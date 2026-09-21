import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const here=path.dirname(fileURLToPath(import.meta.url));
const engine=path.resolve(here,'../../../production/act-engine');
const require=createRequire(path.join(engine,'package.json'));
const {bundle}=require('@remotion/bundler');
const {renderStill,selectComposition}=require('@remotion/renderer');
const qa=path.resolve(here,'../qa/visual-states');
fs.mkdirSync(qa,{recursive:true});
const edl=JSON.parse(fs.readFileSync(path.join(here,'edl.json')));
const serveUrl=await bundle({entryPoint:path.join(engine,'src/index.ts')});
const composition=await selectComposition({serveUrl,id:'Lesson19'});

for(const scene of edl.scenes.filter(s=>s.events.length)){
  const reveal=scene.events[0].props?.revealAtSeconds??[];
  const lastReveal=reveal.length?Math.max(...reveal):scene.start.atSeconds;
  const seconds=Math.min(scene.end.atSeconds-.45,Math.max(scene.start.atSeconds+1.6,lastReveal+.55));
  const output=path.join(qa,`${scene.sceneId}.png`);
  await renderStill({composition,serveUrl,output,frame:Math.round(seconds*composition.fps),imageFormat:'png'});
  console.log(`${scene.sceneId} ${seconds.toFixed(2)}s`);
}

const sheet=path.resolve(here,'../qa/all-visual-states-contact-sheet.jpg');
const ffmpeg=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-pattern_type','glob','-i',path.join(qa,'beat-*.png'),'-vf','scale=480:270,tile=5x4','-frames:v','1',sheet],{stdio:'inherit'});
if(ffmpeg.status!==0)throw Error('Contact sheet failed');
console.log(`Wrote ${sheet}`);
