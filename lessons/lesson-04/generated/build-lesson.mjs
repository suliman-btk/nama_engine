import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(dir,'../../../'),lesson=path.resolve(dir,'..');
const publicDir=path.join(root,'production/act-engine/public/lesson-assets/lesson-04');fs.mkdirSync(publicDir,{recursive:true});
const track=JSON.parse(fs.readFileSync(path.join(dir,'word-timing/lesson-04-word-timing.json'))),words=track.words;
const norm=s=>s.toLowerCase().replace(/[‘’“”"'.,!?;:()\[\]]/g,'');
function at(phrase){const needle=phrase.split(/\s+/).map(norm);for(let i=0;i<=words.length-needle.length;i++)if(needle.every((w,j)=>norm(words[i+j].w)===w))return words[i].t0;throw Error('Missing phrase '+phrase);}
const beats=[];let side='PresenterLeft';
function full(phrase){beats.push({t:typeof phrase==='number'?phrase:at(phrase),layout:'PresenterFull'});}
function slide(phrase,component,props){beats.push({t:at(phrase),phrase,layout:side,component,props});}
function statement(phrase,kicker,headline,emphasize=[]){slide(phrase,'StatementSlide',{kicker,headline,variant:'bar',emphasize});}
function list(phrase,kicker,title,items,phrases){slide(phrase,'ChecklistSlide',{kicker,title,items,revealAtSeconds:phrases.map(at)});}
full(0);
statement('Now we can name the skill','From awareness to action','Leadership turns ideas into action.',['Leadership','action']);
statement('Leadership is directing people','A working definition','Directing people toward a goal.',['goal']);
list('Notice what that definition','Beyond a title','Leadership is not…',['Having a title','Being the loudest person','Giving orders'],['having a title','being the loudest person','giving orders']);
statement('For a community leader','The useful question','Can I help people move toward a useful goal?',['useful','goal']);
full('The curriculum also makes');side='PresenterRight';
statement('Its message is that','A skill you can build','Leadership can be acquired and developed.',['acquired','developed']);
list('Some people may feel','Build your ability','Develop leadership through…',['Experience','Practice','Responsibility'],['experience practice and responsibility','practice and responsibility','responsibility']);
list('That means you should','More than one personality','These traits can all appear in leadership.',['Quiet','Careful','Creative','People focused'],['quiet careful','careful creative','creative or people','people focused']);
statement('Community leadership grows','Practice before a title','Leadership grows through practice.',['practice']);
full('Leadership can also look');side='PresenterLeft';
list('Some people lead by','Different approaches','Different ways to lead',['Clear direction and fast decisions','Persuasion around an idea','Motivating a team','Role modelling through actions'],['giving clear direction','Others persuade people','Some motivate a team','others become role models']);
statement('The source curriculum wants','Situation matters','Different situations need different strengths.',['different','strengths']);
full('The curriculum uses a teamwork');side='PresenterRight';
statement('The strength of a group','Teamwork','Combine strengths—not identical personalities.',['Combine','strengths']);
slide('Pause the video and watch','VideoLinkSlide',{kicker:'Pause and watch',title:'The teamwork clip',note:'Watch the accompanying curriculum clip, then return to this lesson.'});
slide('When you return focus','QuestionSlide',{kicker:'Reflect',questions:['What made the smaller individuals successful?']});
list('It is that people become','Working together','Become more effective together',['Understand your abilities','Cooperate','Combine strengths'],['understand their abilities','cooperate and combine','combine strengths']);
full('Now youll use the official');side='PresenterLeft';
slide('The source explains that','ActivitySlide',{kicker:'Official assessment',title:'Follow the ACT worksheet exactly',steps:['Rank the traits according to how strongly they describe you.','Total your results.','Complete the assessment honestly.'],pauseNote:'Pause to complete the official assessment.'});
slide('then total the results','PhotoGridSlide',{kicker:'Official scoring table',title:'Total each leadership direction',images:[{src:'lesson-assets/lesson-04/scoring-east-west.svg',label:'Eastern · Western'},{src:'lesson-assets/lesson-04/scoring-south-north.svg',label:'Southern · Northern'}]});
statement('Treat the result as','Your result','Current tendencies—not a permanent label.',['tendencies','not']);
full('Before you leave the assessment');side='PresenterRight';
list('It can help you notice','Self-awareness','Notice patterns in how you…',['Think','Communicate','Decide','Work with people'],['think communicate','communicate decide','decide or work','work with people']);
statement('A result should create','Keep perspective','Self-awareness, not a box.',['Self-awareness']);
full('Theres one more source activity');side='PresenterLeft';
slide('Choose five people','ActivitySlide',{kicker:'A mission for the brave',title:'Ask five people you trust',steps:['What are my strengths?','What positive traits do you see in me?'],pauseNote:'Write five names. Speak to them before the next lesson.'});
slide('Your goal is to collect','PhotoGridSlide',{kicker:'Official feedback worksheet',title:'Record specific answers',images:[{src:'lesson-assets/lesson-04/feedback-people.svg',label:'Five people you trust'},{src:'lesson-assets/lesson-04/feedback-strengths.svg',label:'Strengths they see in you'}]});
statement('But remember these answers','Keep perspective','Opinions are information—not final facts.',['information','not']);
full('Why ask other people');side='PresenterRight';
list('Because leaders need both','Two views','See yourself from both sides',['Internal: your intentions','External: your behaviour'],['You know your intentions','other people experience your behavior']);
statement('Use feedback as information','Use feedback wisely','Information to examine—not a verdict to obey.',['examine','not']);
list('Discover your strengths so','Keep developing','Invest in your strengths',['Discover your strengths','Develop undiscovered abilities','Become useful to people and projects'],['Discover your strengths','Keep developing undiscovered','become more useful']);
full('Today you learned');side='PresenterLeft';
list('You learned that people can','Lesson recap','Leadership takes different forms',['Direction','Influence','Motivation','Example','Teamwork'],['direction influence','influence motivation','motivation example','example and teamwork','teamwork and that']);
statement('Keep both results','Bring to the next lesson','Keep your assessment and outside feedback.',['assessment','feedback']);
statement('When is my natural style','Next: the leadership compass','When is my style useful—and when should I adapt?',['useful','adapt']);
beats.sort((a,b)=>a.t-b.t);
for(let i=1;i<beats.length;i++)if(beats[i].t-beats[i-1].t<2&&beats[i-1].layout==='PresenterFull')throw Error('Short full beat');
let last='';const scenes=beats.map((b,i)=>{let preset=i===0?'crossfade':b.layout==='PresenterFull'?'crossfade':b.layout==='PresenterLeft'?'soft-push-right':'soft-push-left';if(preset===last&&b.layout!=='PresenterFull')preset=preset==='soft-push-left'?'soft-push-right':'soft-push-left';last=preset;return {sceneId:`beat-${String(i+1).padStart(3,'0')}`,start:{atSeconds:b.t},end:{atSeconds:beats[i+1]?.t??380.157098},avatar:{layout:b.layout,camera:'wide',mirror:false},transitionIn:preset,transitionOut:i===beats.length-1?'crossfade':undefined,events:b.component?[{id:`graphic-${i+1}`,anchor:{atPhrase:b.phrase},action:'show',component:b.component,animation:'fade-rise',position:'full',props:b.props}]:[]};});
const cuts=JSON.parse(fs.readFileSync(path.join(dir,'cuts.json')));
const edl={lessonId:'lesson-04',title:'Leadership can be developed',fps:30,width:1920,height:1080,avatarVideoSrc:'avatar/lesson-04-master.mp4',sourceCutSeconds:[...cuts.slice(1),225.2].sort((a,b)=>a-b),scenes};
fs.writeFileSync(path.join(dir,'edl.json'),JSON.stringify(edl,null,2)+'\n');fs.copyFileSync(path.join(dir,'edl.json'),path.join(publicDir,'edl.json'));
const cols=[['Eastern',[2,6,11,13,17,22,26,31,33,37]],['Western',[1,5,10,15,19,21,25,30,35,39]],['Southern',[4,8,9,14,18,24,28,29,34,38]],['Northern',[3,7,12,16,20,23,27,32,36,40]]];
function svg(body){return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200" viewBox="0 0 800 1200"><rect width="800" height="1200" fill="#faf7ee"/><g font-family="Arial,sans-serif" fill="#191c44">${body}</g></svg>`;}
for(let k=0;k<2;k++){let b='<text x="400" y="110" text-anchor="middle" font-size="40" font-weight="bold">Official scoring table</text>';cols.slice(k*2,k*2+2).forEach(([label,nums],j)=>{const x=70+j*360;b+=`<text x="${x}" y="200" font-size="40" font-weight="bold">${label}</text>`;nums.forEach((n,i)=>{const y=275+i*70;b+=`<text x="${x}" y="${y}" font-size="34">${n}.</text><line x1="${x+72}" y1="${y}" x2="${x+260}" y2="${y}" stroke="#191c44" stroke-width="2"/>`;});b+=`<text x="${x}" y="1020" font-size="34" font-weight="bold">Sum:</text><circle cx="${x+175}" cy="1008" r="36" fill="none" stroke="#191c44" stroke-width="2"/>`;});b+='<text x="400" y="1120" text-anchor="middle" font-size="24">ACT Lessons Updated Logo.pptx · slide 71</text>';fs.writeFileSync(path.join(publicDir,k===0?'scoring-east-west.svg':'scoring-south-north.svg'),svg(b));}
let p='<text x="400" y="150" text-anchor="middle" font-size="44" font-weight="bold">Name of the Person</text><text x="400" y="210" text-anchor="middle" font-size="44" font-weight="bold">Close to You</text>';
for(let i=0;i<5;i++){const y=330+i*145;p+=`<text x="90" y="${y}" font-size="42">${i+1}.</text><line x1="165" y1="${y}" x2="700" y2="${y}" stroke="#191c44" stroke-width="2"/>`;}
p+='<text x="400" y="1120" text-anchor="middle" font-size="24">ACT Lessons Updated Logo.pptx · slide 74</text>';fs.writeFileSync(path.join(publicDir,'feedback-people.svg'),svg(p));
let s='<text x="400" y="140" text-anchor="middle" font-size="39" font-weight="bold">The Strength Points</text><text x="400" y="200" text-anchor="middle" font-size="39" font-weight="bold">They See in You</text><text x="400" y="260" text-anchor="middle" font-size="28">Repeat this section for each person.</text>';
for(let i=0;i<5;i++){const y=375+i*125;s+=`<text x="90" y="${y}" font-size="42">${i+1}.</text><line x1="165" y1="${y}" x2="700" y2="${y}" stroke="#191c44" stroke-width="2"/>`;}
s+='<text x="400" y="1120" text-anchor="middle" font-size="24">ACT Lessons Updated Logo.pptx · slide 74</text>';fs.writeFileSync(path.join(publicDir,'feedback-strengths.svg'),svg(s));
const assets=[{files:['scoring-east-west.svg','scoring-south-north.svg'],source:'ACT Lessons Updated Logo.pptx',slide:71,treatment:'Faithful vector reconstruction of every scoring column, item number and total; original labels retained; split into two readable cards.'},{files:['feedback-people.svg','feedback-strengths.svg'],source:'ACT Lessons Updated Logo.pptx',slide:74,treatment:'Vector adaptation preserving five people and five strength entries per person; original column labels retained.'},{file:'lesson-04-teamwork.mp4',source:'ACT Lessons Updated Logo.pptx',slide:68,embeddedPath:'ppt/media/media4.mp4',treatment:'Unmodified accompanying activity clip; narration and master audio not interrupted.'}];fs.writeFileSync(path.join(dir,'asset-manifest.json'),JSON.stringify({assets,licence:'Provided official curriculum; no separate licence claimed'},null,2));
console.log('Authored',scenes.length,'beats; phrase-timed graphics',scenes.filter(s=>s.events.length).length);
