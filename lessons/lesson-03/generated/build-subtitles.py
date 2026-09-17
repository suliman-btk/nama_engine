import json,textwrap
from pathlib import Path
p=Path(__file__).resolve().parents[1]
words=json.loads((p/'generated/word-timing/lesson-03-word-timing.json').read_text())['words']
groups=[];current=[]
for w in words:
 if current and (len(' '.join(x['w'] for x in current+[w]))>76 or w['t0']-current[0]['t0']>4):groups.append(current);current=[]
 current.append(w)
if current:groups.append(current)
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
out=[]
for i,g in enumerate(groups):
 end=max(g[-1]['t1'],g[0]['t0']+1.2)
 if i+1<len(groups):end=min(end,groups[i+1][0]['t0'])
 lines=textwrap.wrap(' '.join(w['w'] for w in g),width=42,break_long_words=False)
 assert len(lines)<=2 and all(len(x)<=42 for x in lines)
 assert end-g[0]['t0']>=1.199
 out.append(f'{i+1}\n{stamp(g[0]["t0"])} --> {stamp(end)}\n'+'\n'.join(lines))
(p/'generated/lesson-03.srt').write_text('\n\n'.join(out)+'\n')
print(len(groups),'complete word-timed subtitle cues')
