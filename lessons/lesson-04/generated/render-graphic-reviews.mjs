import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const lesson=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const engine=path.resolve(lesson,'../../production/act-engine');
const require=createRequire(path.join(engine,'package.json'));
const {bundle}=require('@remotion/bundler'),{renderStill,selectComposition}=require('@remotion/renderer');
const edl=JSON.parse(fs.readFileSync(path.join(lesson,'generated/edl.json')));
const output=path.join(lesson,'qa/graphic-stills');fs.mkdirSync(output,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(engine,'src/index.ts')});
const composition=await selectComposition({serveUrl,id:'Lesson04'});
for(const scene of edl.scenes){
 if(process.argv.length>2&&!process.argv.slice(2).includes(scene.sceneId))continue;
 if(!scene.events.length)continue;
 const reveals=scene.events[0].props?.revealAtSeconds??[];
 const seconds=Math.min(scene.end.atSeconds-.6,Math.max(scene.start.atSeconds+2,...reveals.map(t=>t+1)));
 await renderStill({serveUrl,composition,frame:Math.round(seconds*30),output:path.join(output,`${scene.sceneId}.png`),imageFormat:'png'});
 console.log(scene.sceneId,seconds.toFixed(2));
}
