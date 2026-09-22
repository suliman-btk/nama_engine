import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const input=path.resolve(here,'../input/source-subtitles.srt');
const outDir=path.join(here,'word-timing');
fs.mkdirSync(outDir,{recursive:true});

const sceneStarts=[0,37.375667,76.075667,113.108989,151.575656,189.975656,227.908989,273.808989,303.708989,330.142322];
const sourceCuts=[0,37.375667,76.075667,113.108989,151.575656,189.975656,227.908989,231.108989,273.808989,303.708989,330.142322];
const toSeconds=(stamp)=>{const [h,m,rest]=stamp.split(':');const [s,ms]=rest.split(',');return +h*3600 + +m*60 + +s + +ms/1000;};
const blocks=fs.readFileSync(input,'utf8').trim().split(/\r?\n\r?\n/);
const words=[];
for(const block of blocks){
  const lines=block.split(/\r?\n/);
  const match=lines[1]?.match(/(\d\d:\d\d:\d\d,\d+) --> (\d\d:\d\d:\d\d,\d+)/);
  if(!match)continue;
  const start=toSeconds(match[1]),end=toSeconds(match[2]);
  const tokens=lines.slice(2).join(' ').replace(/\s+/g,' ').trim().split(' ').filter(Boolean);
  tokens.forEach((w,i)=>{const t0=start+(end-start)*i/tokens.length;const t1=start+(end-start)*(i+1)/tokens.length;words.push({t0:+t0.toFixed(3),t1:+t1.toFixed(3),w});});
}

sceneStarts.forEach((start,i)=>{
  const end=sceneStarts[i+1]??395.784127;
  const rows=words.filter(w=>w.t0>=start&&w.t0<end).map(w=>({t:+(w.t0-start).toFixed(3),d:+Math.max(.001,w.t1-w.t0).toFixed(3),w:w.w}));
  fs.writeFileSync(path.join(outDir,`scene-${String(i+1).padStart(3,'0')}.json`),JSON.stringify(rows,null,2));
});
fs.writeFileSync(path.join(here,'cuts.json'),JSON.stringify(sceneStarts,null,2));
fs.writeFileSync(path.join(here,'source-cuts.json'),JSON.stringify(sourceCuts,null,2));
console.log(`Prepared ${words.length} caption-aligned words across ${sceneStarts.length} scenes.`);
