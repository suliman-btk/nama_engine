import json,re
from pathlib import Path
root=Path(__file__).resolve().parents[1]
rows=json.loads(Path('/private/tmp/lesson01-new-asr.json').read_text())['words']
# Recognition artefacts, not audio edits. Confirmed against independent recognition and
# retained supplied text; the original master audio remains continuous and unchanged.
artefacts={28.6:'welcome.',111.36:'owners,',139.58:'1.',167.36:'1.',328.22:'place.',357.6:'What',382.32:'them.',519.56:'One',570.62:'Life?',712.74:'However,'}
words=[];removed=[]
for row in rows:
 if row['t0'] in artefacts and row['w']==artefacts[row['t0']]:removed.append(row);continue
 if row['w'].startswith('-') and words:
  words[-1]['w']+=row['w'];words[-1]['t1']=row['t1']
 else:words.append(dict(row))
for word in words:
 bare=word['w'].strip('.,!?');name={'Act':'ACT','Nama':'NAMA','Kopen':'Koh','Yee':'Panyee'}.get(bare)
 if name:word['w']=word['w'].replace(bare,name)
cuts=[0,26.266667,50.466667,77.1,97.1,98.7,142.833333,191.533333,288.433333,376.233333,427.066667,475.4,525.266667,570.833333,609.333333,628.1,656.6,701.8]
out=root/'generated/word-timing';out.mkdir(parents=True,exist_ok=True)
(out/'lesson-01-word-timing.json').write_text(json.dumps({'lesson':1,'source':'User-approved spoken master; local recognition with actual audio word timestamps, no interpolation','words':words},indent=1))
(out/'recognition-artefacts.json').write_text(json.dumps({'removedRecognitionArtefacts':removed,'audioEdits':[]},indent=2))
(root/'generated/cuts.json').write_text(json.dumps(cuts,indent=2))
for i,start in enumerate(cuts):
 end=cuts[i+1] if i+1<len(cuts) else 746.567982
 chunk=[{'t':round(w['t0']-start,6),'d':max(.001,round(w['t1']-w['t0'],6)),'w':w['w']} for w in words if start<=w['t0']<end]
 (out/f'scene-{i+1:03}.json').write_text(json.dumps(chunk,indent=1))
print('Prepared',len(words),'word timings; removed',len(removed),'recognition artefacts; source audio unchanged')
