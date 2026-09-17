import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const file=path.join(root,'lessons/lesson-17/generated/edl.json');
const edl=JSON.parse(fs.readFileSync(file,'utf8'));
const scenes=[];
for(const scene of edl.scenes){
 const previous=scenes.at(-1);
 if(previous && previous.avatar.layout==='PresenterFull' && scene.avatar.layout==='PresenterFull' && !previous.events.length && !scene.events.length){
  previous.end=scene.end;
  previous.avatar.camera='wide';
 }else scenes.push(scene);
}
for(let i=0;i<scenes.length;i++){
 const scene=scenes[i];
 scene.transitionIn=scene.avatar.layout==='PresenterLeft'?'soft-push-right':scene.avatar.layout==='PresenterRight'?'soft-push-left':'crossfade';
 delete scene.transitionOut;
 if(i)scenes[i-1].transitionOut=scene.transitionIn;
}
edl.scenes=scenes;
const json=JSON.stringify(edl,null,2)+'\n';
fs.writeFileSync(file,json);
fs.writeFileSync(path.join(root,'production/act-engine/public/lesson-assets/lesson-17/edl.json'),json);
console.log(`${scenes.length} beats; coordinated directional pushes and clean full-frame returns.`);
