import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const pub=path.resolve(dir,'../../../production/act-engine/public/lesson-assets/lesson-19');
fs.mkdirSync(pub,{recursive:true});
const words=JSON.parse(fs.readFileSync(path.join(dir,'word-timing/lesson-19-word-timing.json'))).words;
const norm=s=>s.toLowerCase().replace(/[‘’“”"'.,!?;:()\[\]]/g,'');
function at(phrase){const needle=phrase.split(/\s+/).map(norm);for(let i=0;i<=words.length-needle.length;i++)if(needle.every((w,j)=>norm(words[i+j].w)===w))return words[i].t0;throw Error('Missing spoken phrase: '+phrase);}
let beats=[{t:0,layout:'PresenterFull'}];
function graphic(phrase,endPhrase,side,component,props){const start=at(phrase),end=typeof endPhrase==='number'?start+endPhrase:at(endPhrase);beats.push({t:start,phrase,layout:side,component,props});beats.push({t:end,layout:'PresenterFull'});}
function seq(phrase,end,side,eyebrow,items,reveals){graphic(phrase,end,side,'ScenarioSequence',{eyebrow,items:items.map((text,i)=>({n:i+1,text})),revealAtSeconds:reveals?.map(at)});}
function checklist(phrase,end,side,kicker,title,items,reveals){graphic(phrase,end,side,'ChecklistSlide',{kicker,title,items,revealAtSeconds:reveals?.map(at)});}
function statement(phrase,end,side,kicker,headline,emphasize=[]){graphic(phrase,end,side,'StatementSlide',{kicker,headline,variant:'bar',emphasize});}
function diagrams(phrase,end,side,kicker,title,items){graphic(phrase,end,side,'PhotoGridSlide',{kicker,title,images:items.map(([file,label])=>({src:`lesson-assets/lesson-19/${file}`,label}))});}

statement('When an initiative is finished','Good communication is not about','PresenterLeft','Lessons 19–20','Communicate the experience',['Communicate','experience']);
diagrams('Good communication is not about','A simple structure','PresenterLeft','A useful explanation','A simple story with a clear message',[['story-arc.svg','Problem, response, lesson'],['message-filter.svg','Details become a clear message']]);

seq('A simple structure makes','This creates a clear path','PresenterLeft','The story structure',['Problem','Need','Response','Result','Lesson'],['Start with the problem','Then explain the need','response you chose','Share the important result','finish with the main lesson']);
statement('This creates a clear path','Clear structure helps','PresenterLeft','Clear structure','A path, not disconnected details',['path','details']);

diagrams('There are different ways','Storytelling can be useful','PresenterRight','Choose for clarity','The format serves the message',[['format-map.svg','Six possible formats'],['clarity-scale.svg','Clarity guides the choice']]);

diagrams('Storytelling can be useful','The message should always','PresenterRight','Story and evidence','Visuals clarify what changed',[['before-after.svg','Before and after'],['evidence-timeline.svg','Evidence in sequence']]);

checklist('When speaking clarity matters','A strong opening helps','PresenterLeft','Clear delivery','What supports the message',['Natural posture','Clear gestures','Fitting facial expression','Varied tone','Fewer filler words'],['natural posture','clear gestures','facial expressions','Vary your tone','reduce distracting filler']);
seq('A strong opening helps','Try a short individual','PresenterLeft','A memorable explanation',['Opening: why listen?','Middle: what matters?','Ending: what stays?'],['strong opening','In between','strong ending']);

graphic('Try a short individual exercise','Sentence one','PresenterLeft','ActivitySlide',{kicker:'Five-sentence test',title:'Explain a small initiative',steps:['Keep only the information another person needs.','Build the explanation in five sentences.'],pauseNote:'Clarity comes from choosing what matters.'});
diagrams('Sentence one','It also shows whether','PresenterLeft','Five-sentence test','Five sentences, one clear explanation',[['five-step-stair.svg','Sentences 1–3'],['core-target.svg','Sentences 4–5']]);

graphic('Before we close','The goal was to see','PresenterRight','FourStepJourney',{eyebrow:'The complete ACT journey',steps:[{n:1,title:'Self-awareness',question:'Understand yourself'},{n:2,title:'Social awareness',question:'Understand people and roles'},{n:3,title:'Social issues',question:'Understand the real need'},{n:4,title:'Social initiatives',question:'Turn understanding into action'}]});
statement('The goal was to see','From there Act moved','PresenterRight','Awareness grows outward','Self-awareness is the beginning',['Self-awareness','beginning']);

diagrams('From there Act moved','better understanding','PresenterRight','From issue to solution','Understanding shapes a SMART response',[['problem-funnel.svg','Find the actual need'],['smart-wheel.svg','Make the solution SMART']]);

diagrams('In the final unit','Put together the full path','PresenterLeft','Making ideas practical','A plan becomes stronger through experience',[['planning-matrix.svg','The planning matrix'],['action-cycle.svg','Plan, act, adapt, learn']]);
diagrams('Put together the full path','And that brings us','PresenterLeft','The complete ACT path','Eight connected stages',[['journey-roadmap.svg','The full roadmap'],['unit-stack.svg','Four units, one journey']]);

diagrams('And that brings us','Thank you for spend','PresenterLeft','Beyond the course','Keep the way of thinking',[['thinking-compass.svg','Understand, listen, plan, adapt'],['course-map.svg','Carry the journey forward']]);
graphic('Thank you for spend',19.2,'PresenterLeft','OutroSlide',{kicker:'The ACT journey',title:'Thank you for learning with us',points:['Use these ideas in your studies and work.','Use them in your community and daily choices.'],next:'Keep learning'});

beats=beats.filter(b=>(b.component||!beats.some(o=>o.component&&Math.abs(o.t-b.t)<.001))&&(b.component||b.t<394.5));beats.sort((a,b)=>a.t-b.t);
let previous='';
const scenes=beats.map((b,i)=>{const end=beats[i+1]?.t??395.087528;if(end<=b.t)throw Error('Overlapping beats at '+b.t);let preset=i===0?'crossfade':b.layout==='PresenterFull'?'crossfade':b.layout==='PresenterLeft'?'soft-push-right':'soft-push-left';if(preset===previous&&b.layout!=='PresenterFull')preset=preset==='soft-push-left'?'soft-push-right':'soft-push-left';previous=preset;return {sceneId:`beat-${String(i+1).padStart(3,'0')}`,start:{atSeconds:b.t},end:{atSeconds:end},avatar:{layout:b.layout,camera:'wide',mirror:false},transitionIn:preset,transitionOut:i===beats.length-1?'crossfade':undefined,events:b.component?[{id:`graphic-${i+1}`,anchor:{atPhrase:b.phrase},action:'show',component:b.component,animation:b.component==='ScenarioSequence'?'diagram-build':'fade-rise',position:'full',props:b.props}]:[]};});
const sourceCuts=JSON.parse(fs.readFileSync(path.join(dir,'source-cuts.json'))).slice(1);
const edl={lessonId:'lesson-19',title:'Communicate the Experience and Complete the ACT Journey',fps:30,width:1920,height:1080,avatarVideoSrc:'avatar/lesson-19-master.mp4',sourceCutSeconds:sourceCuts,scenes};
fs.writeFileSync(path.join(dir,'edl.json'),JSON.stringify(edl,null,2));
fs.writeFileSync(path.join(pub,'edl.json'),JSON.stringify(edl,null,2));
console.log(`Authored ${scenes.length} beats with ${scenes.filter(s=>s.events.length).length} timed graphics.`);
