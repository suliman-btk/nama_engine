import React,{useMemo} from 'react';
import {AbsoluteFill,Audio,staticFile} from 'remotion';
import {resolveEdlAnchors} from '../edl/resolveAnchors';
import {enforceLayoutRules} from '../edl/enforceLayoutRules';
import {lesson04Edl} from '../data/lesson-04-edl';
import timing from '../../../../lessons/lesson-04/generated/word-timing/lesson-04-word-timing.json';
import config from '../../../../lessons/lesson-04/input/scene-config.json';
import {PresenterLayer,usePresenterContentEdges} from '../presenter/PresenterLayer';
import {EventRenderer} from './EventRenderer';
import {theme} from '../components/theme';
import {LessonLabelContext,ContentEdgesContext} from '../slides/SlideFrame';
import {BrandWatermark} from '../brand/BrandWatermark';
import {GoldBaseline} from '../brand/FrameChrome';
export function Lesson04(){
 const edl=useMemo(()=>enforceLayoutRules(resolveEdlAnchors(lesson04Edl,timing)).edl,[]);
 const src=staticFile(edl.avatarVideoSrc),edges=usePresenterContentEdges(edl.scenes);
 return <AbsoluteFill style={{backgroundColor:theme.colors.surface}}><Audio src={src}/><LessonLabelContext.Provider value={config.lessonLabel}><ContentEdgesContext.Provider value={edges}><EventRenderer edl={edl}/></ContentEdgesContext.Provider></LessonLabelContext.Provider><PresenterLayer scenes={edl.scenes} videoSrc={src} sourceCutSeconds={edl.sourceCutSeconds}/><BrandWatermark/><GoldBaseline/></AbsoluteFill>;
}
