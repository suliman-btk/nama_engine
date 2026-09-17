import re,json,difflib
from pathlib import Path
root=Path(__file__).resolve().parents[1]
script_text=(root/'input/pure-script.md').read_text()
token=lambda s:re.findall(r"[A-Za-z0-9]+(?:[-'’][A-Za-z]+)*",s)
norm=lambda s:s.lower().replace('’',"'")
script=token(script_text);mapped={};diagnostics=[]
for filename in ['lesson03-asr-words.json','lesson03-asr-second.json']:
 raw=json.loads((Path('/private/tmp')/filename).read_text())['words'];joined=[]
 for r in raw:
  if r['w'].startswith('-') and joined:
   joined[-1]['w']+=r['w'];joined[-1]['t1']=r['t1']
  else:joined.append(dict(r))
 source=[dict(w=w,t0=r['t0'],t1=r['t1']) for r in joined for w in token(r['w'])]
 for tag,a0,a1,b0,b1 in difflib.SequenceMatcher(None,list(map(norm,script)),[norm(r['w']) for r in source],autojunk=False).get_opcodes():
  if tag=='equal':
   for j in range(a1-a0):
    if a0+j not in mapped:mapped[a0+j]=dict(source[b0+j],w=script[a0+j])
  else:diagnostics.append(dict(passFile=filename,type=tag,script=' '.join(script[a0:a1]),recognized=' '.join(x['w'] for x in source[b0:b1])))
 (root/'generated/word-timing'/filename).write_text(json.dumps({'words':raw},indent=2))
print('Mapped',len(mapped),'of',len(script));print(json.dumps(diagnostics,indent=2))
if len(mapped)!=len(script):raise SystemExit('Missing recognized narration words: inspect before proceeding')
words=[mapped[i] for i in range(len(script))]
assert all(words[i]['t0']>=words[i-1]['t0'] for i in range(1,len(words)))
cuts=[0,38.4,79.73333333333333,121.4,160.8,201.5,241,282.3]
(root/'generated/cuts.json').write_text(json.dumps(cuts,indent=2)+'\n')
(root/'generated/word-timing/lesson-03-word-timing.json').write_text(json.dumps({'lesson':3,'source':'User-authorized spoken narration; exact recognized words with actual audio timestamps from two local recognition passes, no interpolation','words':words},indent=1)+'\n')
for i,start in enumerate(cuts):
 end=cuts[i+1] if i+1<len(cuts) else 330.814694
 rows=[{'t':round(w['t0']-start,6),'d':max(.001,round(w['t1']-w['t0'],6)),'w':w['w']} for w in words if start<=w['t0']<end]
 (root/f'generated/word-timing/scene-{i+1:03}.json').write_text(json.dumps(rows,indent=1)+'\n')
(root/'generated/word-timing/asr-diagnostics.json').write_text(json.dumps(diagnostics,indent=2)+'\n')
