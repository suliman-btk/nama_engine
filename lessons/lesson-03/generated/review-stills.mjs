import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createRequire} from 'node:module';import {spawnSync} from 'node:child_process';
const lesson=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),engine=path.resolve(lesson,'../../production/act-engine');
const require=createRequire(engine+'/package.json'),{bundle}=require('@remotion/bundler'),{renderStill,selectComposition}=require('@remotion/renderer');
const edl=JSON.parse(fs.readFileSync(lesson+'/generated/edl.json')),track=JSON.parse(fs.readFileSync(lesson+'/generated/word-timing/lesson-03-word-timing.json'));
const norm=s=>s.toLowerCase().replace(/[‘’“”"'.,!?;:()\[\]]/g,'').split(/\s+/).filter(Boolean);
const at=p=>{const n=norm(p),i=track.words.findIndex((w,i)=>n.every((x,j)=>norm(track.words[i+j]?.w||'')[0]===x));if(i<0)throw Error(p);return track.words[i].t0;};
const dir=lesson+'/qa/review-cards';fs.mkdirSync(dir,{recursive:true});
const shots=edl.scenes.filter(s=>s.events.length).map(s=>{const end=s.end.atSeconds??at(s.end.atPhrase),start=s.start.atSeconds??at(s.start.atPhrase),reveals=s.events[0].props.revealAtSeconds;return[s.sceneId,Math.min(end-.5,reveals?reveals.at(-1)+1:start+3)];});
const serveUrl=await bundle({entryPoint:engine+'/src/index.ts',publicDir:engine+'/public'}),composition=await selectComposition({serveUrl,id:'Lesson03'});
for(const[name,t]of shots){await renderStill({serveUrl,composition,output:dir+'/'+name+'.png',frame:Math.round(t*30),timeoutInMilliseconds:120000});console.log(name);}
spawnSync('ffmpeg',['-v','error','-y','-pattern_type','glob','-i',dir+'/*.png','-vf','scale=640:360,tile=3x5','-frames:v','1',lesson+'/qa/visual-states-contact-sheet.jpg'],{stdio:'inherit'});
