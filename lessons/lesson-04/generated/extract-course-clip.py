from zipfile import ZipFile
from pathlib import Path
root=Path(__file__).resolve().parents[3]
with ZipFile(root/'source-material/ACT Lessons Updated Logo.pptx') as deck:
 data=deck.read('ppt/media/media4.mp4')
for folder in [root/'lessons/lesson-04/generated',root/'production/act-engine/out']:
 folder.mkdir(parents=True,exist_ok=True)
 (folder/'lesson-04-teamwork.mp4').write_bytes(data)
print('Extracted unmodified official slide 68 activity clip:',len(data),'bytes')
