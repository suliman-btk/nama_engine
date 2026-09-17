import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createRequire} from 'node:module';import {spawnSync} from 'node:child_process';
const lesson=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),engine=path.resolve(lesson,'../../production/act-engine');
const require=createRequire(engine+'/package.json'),{bundle}=require('@remotion/bundler'),{renderMedia,selectComposition}=require('@remotion/renderer');
const track=JSON.parse(fs.readFileSync(lesson+'/generated/word-timing/lesson-03-word-timing.json'));
const norm=s=>s.toLowerCase().replace(/[‘’“”"'.,!?;:()\[\]]/g,'').split(/\s+/).filter(Boolean);
const at=p=>{const n=norm(p),i=track.words.findIndex((w,i)=>n.every((x,j)=>norm(track.words[i+j]?.w||'')[0]===x));if(i<0)throw Error(p);return track.words[i].t0;};
const dir=lesson+'/qa/transition-review';fs.mkdirSync(dir,{recursive:true});
const serveUrl=await bundle({entryPoint:engine+'/src/index.ts',publicDir:engine+'/public'}),composition=await selectComposition({serveUrl,id:'Lesson03'});
const phrases=['The rabbit and turtle example','As you watch','When you return','Once you begin noticing your own'];
for(let i=0;i<phrases.length;i++){
 const t=at(phrases[i]),start=Math.round((t-.4)*30),end=Math.round((t+2.4)*30)-1;
 await renderMedia({serveUrl,composition,codec:'h264',outputLocation:dir+`/${i}.mp4`,frameRange:[start,end],scale:2/3,crf:20,concurrency:2});console.log(phrases[i]);
}
const args=['-v','error','-y'];for(let i=0;i<phrases.length;i++)args.push('-i',dir+`/${i}.mp4`);
args.push('-filter_complex',phrases.map((_,i)=>`[${i}:v][${i}:a]`).join('')+'concat=n=4:v=1:a=1[v][a]','-map','[v]','-map','[a]','-c:v','libx264','-crf','20','-c:a','aac',lesson+'/qa/transition-review.mp4');
const result=spawnSync('ffmpeg',args,{stdio:'inherit'});if(result.status)throw Error('Motion preview concatenation failed');
