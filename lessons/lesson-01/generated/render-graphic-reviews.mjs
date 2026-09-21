import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const lesson=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),engine=path.resolve(lesson,'../../production/act-engine');
const require=createRequire(path.join(engine,'package.json'));
const {bundle}=require('@remotion/bundler'),{renderStill,selectComposition}=require('@remotion/renderer');
const edl=JSON.parse(fs.readFileSync(path.join(lesson,'generated/edl.json'))),output=path.join(lesson,'qa/graphic-stills');fs.mkdirSync(output,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(engine,'src/index.ts')});
const composition=await selectComposition({serveUrl,id:'Lesson01'});
for(const scene of edl.scenes){
 if(process.argv.length>2&&!process.argv.slice(2).includes(scene.sceneId))continue;
 if(!scene.events.length)continue;
 const reveals=scene.events[0].props?.revealAtSeconds??[];
 const seconds=Math.min(scene.end.atSeconds-.4,Math.max(scene.start.atSeconds+1.8,...reveals.map(t=>t+.6)));
 await renderStill({serveUrl,composition,frame:Math.round(seconds*30),output:path.join(output,`${scene.sceneId}.png`),imageFormat:'png'});
 if(process.argv.length>2){
  const cuts=JSON.parse(fs.readFileSync(path.join(lesson,'generated/cuts.json'))),index=cuts.findLastIndex(t=>t<=scene.start.atSeconds),mid=(cuts[index]+(cuts[index+1]??746.567982))/2;
  if(mid>=scene.start.atSeconds&&mid<scene.end.atSeconds)await renderStill({serveUrl,composition,frame:Math.round(mid*30),output:path.join(lesson,'qa/scene-stills',`scene-${String(index+1).padStart(3,'0')}-middle.png`),imageFormat:'png'});
 }
 console.log(scene.sceneId,seconds.toFixed(2));
}
