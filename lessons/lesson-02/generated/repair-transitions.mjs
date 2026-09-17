import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const generated=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(generated,'../../..');
const edlPath=path.join(generated,'edl.json');
const original=path.join(generated,'edl-before-transition-repair.json');
if(!fs.existsSync(original))fs.copyFileSync(edlPath,original);
const edl=JSON.parse(fs.readFileSync(original));
const merged=[];
for(const s of edl.scenes){
 const previous=merged.at(-1);
 if(previous?.avatar.layout==='PresenterFull'&&s.avatar.layout==='PresenterFull'&&!previous.events.length&&!s.events.length){
  previous.end=s.end;
  previous.avatar.camera='wide';
 }else merged.push(s);
}
for(let i=0;i<merged.length;i++){
 const scene=merged[i],previous=merged[i-1];
 const split=scene.avatar.layout==='PresenterLeft'||scene.avatar.layout==='PresenterRight';
 scene.transitionIn=i===0?'crossfade':split?(previous?.avatar.layout===scene.avatar.layout?(scene.avatar.layout==='PresenterLeft'?'soft-push-left':'soft-push-right'):scene.avatar.layout==='PresenterLeft'?'soft-push-right':'soft-push-left'):'crossfade';
 scene.avatar.mirror=false;
}
for(let i=0;i<merged.length-1;i++)merged[i].transitionOut=merged[i+1].transitionIn;
merged.at(-1).transitionOut='crossfade';
edl.scenes=merged;
fs.writeFileSync(edlPath,JSON.stringify(edl,null,2));
fs.copyFileSync(edlPath,path.join(repo,'production/act-engine/public/lesson-assets/lesson-02/edl.json'));
console.log('Reduced',JSON.parse(fs.readFileSync(original)).scenes.length,'beats to',merged.length,'without changing graphic/audio timings. Removed face-clipping mask wipes and repeated full-frame zoom effects.');
