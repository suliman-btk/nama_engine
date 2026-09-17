import re,json,difflib
from pathlib import Path
root=Path(__file__).resolve().parents[1]
token=lambda s:re.findall(r"[A-Za-z0-9]+(?:[-'’][A-Za-z]+)*",s)
norm=lambda s:s.lower().replace('’',"'")
script=token((root/'input/pure-script.md').read_text());mapped={};diagnostics=[]
out=root/'generated/word-timing';out.mkdir(parents=True,exist_ok=True)
for filename in ['lesson04-asr-words.json','lesson04-asr-second.json']:
 raw=json.loads((Path('/private/tmp')/filename).read_text())['words'];joined=[]
 for r in raw:
  if r['w'].startswith('-') and joined:joined[-1]['w']+=r['w'];joined[-1]['t1']=r['t1']
  else:joined.append(dict(r))
 source=[dict(w=w,t0=r['t0'],t1=r['t1']) for r in joined for w in token(r['w'])]
 for tag,a0,a1,b0,b1 in difflib.SequenceMatcher(None,list(map(norm,script)),[norm(r['w']) for r in source],autojunk=False).get_opcodes():
  if tag=='equal':
   for j in range(a1-a0):
    if a0+j not in mapped:mapped[a0+j]=dict(source[b0+j],w=script[a0+j])
  else:diagnostics.append(dict(passFile=filename,type=tag,script=' '.join(script[a0:a1]),recognized=' '.join(x['w'] for x in source[b0:b1])))
 (out/filename).write_text(json.dumps({'words':raw},indent=2))
print('Mapped',len(mapped),'of',len(script));print(json.dumps(diagnostics,indent=2))
if len(mapped)!=len(script):raise SystemExit('Missing recognized words: verify audio before proceeding')
words=[mapped[i] for i in range(len(script))]
assert all(words[i]['t0']>=words[i-1]['t0'] for i in range(1,len(words)))
cuts=[0,43.366667,85.7,127.866667,170.066667,208.433333,254.466667,294.666667,341.466667]
(root/'generated/cuts.json').write_text(json.dumps(cuts,indent=2)+'\n')
(out/'lesson-04-word-timing.json').write_text(json.dumps({'lesson':4,'source':'User-authorized spoken narration; exact recognized word timestamps from two local passes; no interpolation','words':words},indent=1)+'\n')
for i,start in enumerate(cuts):
 end=cuts[i+1] if i+1<len(cuts) else 380.157098
 rows=[{'t':round(w['t0']-start,6),'d':max(.001,round(w['t1']-w['t0'],6)),'w':w['w']} for w in words if start<=w['t0']<end]
 (out/f'scene-{i+1:03}.json').write_text(json.dumps(rows,indent=1)+'\n')
(out/'asr-diagnostics.json').write_text(json.dumps(diagnostics,indent=2)+'\n')
