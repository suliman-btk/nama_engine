import json,subprocess,time,sys
from pathlib import Path
root=Path(__file__).resolve().parents[3]
video=root/'production/act-engine/out/lesson-04.mp4'
report=root/'lessons/lesson-04/qa/final-qa.json'
pid=sys.argv[1]
for attempt in range(720):
 process=subprocess.run(['ps','-p',pid,'-o','args='],capture_output=True,text=True)
 if process.returncode or 'remotion render src/index.ts Lesson04 out/lesson-04.mp4' not in process.stdout:break
 time.sleep(10)
else:raise SystemExit('Render is still running; QA has not been completed')
if not video.exists():raise SystemExit('Render did not produce an MP4; final QA failed')
probe=subprocess.run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(video)],capture_output=True,text=True,check=True)
media=json.loads(probe.stdout)
decode=subprocess.run(['ffmpeg','-v','error','-i',str(video),'-f','null','-'],capture_output=True,text=True)
streams=media['streams'];picture=next(s for s in streams if s['codec_type']=='video');audio=[s for s in streams if s['codec_type']=='audio']
passed=decode.returncode==0 and not decode.stderr.strip() and picture['width']==1920 and picture['height']==1080 and bool(audio) and abs(float(media['format']['duration'])-380.157098)<.2
result={'status':'passed' if passed else 'failed','video':str(video),'duration':media['format']['duration'],'width':picture['width'],'height':picture['height'],'hasAudio':bool(audio),'fullDecodeExitCode':decode.returncode,'decodeErrors':decode.stderr,'previewApproval':'Explicit user approval','assessmentHandout':'Complete assessment questionnaire not located; learner handout availability still requires confirmation','subtitles':str(video.with_suffix('.srt'))}
report.write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2),flush=True)
if not passed:raise SystemExit(1)
