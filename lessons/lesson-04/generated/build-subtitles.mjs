import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const words=JSON.parse(fs.readFileSync(path.join(dir,'word-timing/lesson-04-word-timing.json'))).words;
const text=fs.readFileSync(path.join(dir,'../input/pure-script.md'),'utf8').trim().split(/\s+/);
if(text.length!==words.length)throw Error('Subtitle tokens do not match narration timing');
const stamp=s=>{const m=Math.round(s*1000);return `${String(Math.floor(m/3600000)).padStart(2,'0')}:${String(Math.floor(m/60000)%60).padStart(2,'0')}:${String(Math.floor(m/1000)%60).padStart(2,'0')},${String(m%1000).padStart(3,'0')}`;};
let cues=[],start=0;
for(let i=0;i<words.length;i++){
 if(i-start>=10||words[i].t1-words[start].t0>=4||/[.!?]$/.test(text[i])||i===words.length-1){
 cues.push(`${cues.length+1}\n${stamp(words[start].t0)} --> ${stamp(Math.max(words[start].t0+.1,words[i].t1))}\n${text.slice(start,i+1).join(' ')}\n`);start=i+1;
 }
}
const srt=cues.join('\n');fs.writeFileSync(path.join(dir,'lesson-04.srt'),srt);
fs.writeFileSync(path.resolve(dir,'../../../production/act-engine/out/lesson-04.srt'),srt);
console.log(cues.length,'cues;',words.length,'spoken words');
