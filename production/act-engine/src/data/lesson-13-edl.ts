import { parseEdl, type Edl, type EdlInput } from "../edl/schema";
const LABEL = "ACT · Lesson 13";
type Scene = EdlInput["scenes"][number];
type Component = NonNullable<Scene["events"]>[number]["component"];
const pair = (n:number,start:number,end:number,phrase:string,side:"PresenterLeft"|"PresenterRight",component:Component,props:Record<string,unknown>):Scene[] => [
  {sceneId:`s${n}-open`,start:{atSeconds:start},end:{atPhrase:phrase},avatar:{layout:"PresenterFull",camera:"medium"},transitionIn:n%2?"scale-through":"mask-wipe",events:[]},
  {sceneId:`s${n}-visual`,start:{atPhrase:phrase},end:{atSeconds:end},avatar:{layout:side,camera:"medium"},transitionIn:side==="PresenterLeft"?"soft-push-right":"soft-push-left",events:[{id:`visual-${n}`,anchor:{atPhrase:phrase},action:"show",component,props:{...props,lessonLabel:LABEL}}]},
];
const input:EdlInput={lessonId:"lesson-13",title:"From Solution to Practical Plan",fps:30,width:1920,height:1080,avatarVideoSrc:"avatar/lesson-13-master.mp4",sourceCutSeconds:[29.8,60.3,92,118.767,153.667,184.133,216.9],scenes:[
  ...pair(1,0,29.8,"A good idea is not yet a plan","PresenterRight","StatementSlide",{kicker:"From idea to action",headline:"Planning makes the next action obvious",emphasize:["next action"],variant:"bar"}),
  ...pair(2,29.8,60.3,"A useful plan breaks","PresenterLeft","ChecklistSlide",{kicker:"Break down the work",title:"Big project → main steps → tasks",items:["The project is the big box","Main steps are smaller boxes","Tasks are work you can actually do"]}),
  ...pair(3,60.3,92,"One main step could be","PresenterRight","ChecklistSlide",{kicker:"Example plan",title:"Prepare and arrange the session",items:["Collect reliable information","Prepare simple slides and materials","Find a place, permission, and time"]}),
  ...pair(4,92,118.767,"These questions connect","PresenterLeft","ChecklistSlide",{kicker:"Plan model",title:"Six questions connect the idea to reality",items:["What needs to be done?","Resources and cost?","Who, when, and where?"]}),
  ...pair(5,118.767,153.667,"For each task, ask","PresenterRight","QuestionSlide",{kicker:"Resource check",questions:["What do I need?","Do I have access to it?","Do I need another option?"]}),
  ...pair(6,153.667,184.133,"Then check the location","PresenterLeft","ChecklistSlide",{kicker:"Time and place",title:"Sequence the work realistically",items:["What must happen first?","Is the place available?","Does it support the activity?"]}),
  ...pair(7,184.133,216.9,"You do not need to complete","PresenterRight","ActivitySlide",{kicker:"Quick planning test",title:"Test one main step",steps:["List smaller tasks","Add resources, cost, and responsibility","Add time and place"],pauseNote:"Notice how specific work makes the idea clearer"}),
  ...pair(8,216.9,255.489161,"In the next lesson","PresenterLeft","OutroSlide",{kicker:"Next lesson",title:"Check the plan before action",takeaways:["Find weak assumptions","Check what is realistic","Improve the plan"]}),
]};
export const lesson13Edl:Edl=parseEdl(input);
