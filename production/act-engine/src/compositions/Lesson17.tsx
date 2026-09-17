import React,{useMemo} from 'react';
import {AbsoluteFill,Audio,staticFile} from 'remotion';
import {resolveEdlAnchors} from '../edl/resolveAnchors';
import {enforceLayoutRules} from '../edl/enforceLayoutRules';
import {lesson17Edl} from '../data/lesson-17-edl';
import timing from '../../../../lessons/lesson-17/generated/word-timing/lesson-17-word-timing.json';
import {PresenterLayer,usePresenterContentEdges} from '../presenter/PresenterLayer';
import {EventRenderer} from './EventRenderer';
import {theme} from '../components/theme';
import {LessonLabelContext,ContentEdgesContext} from '../slides/SlideFrame';
import {BrandWatermark} from '../brand/BrandWatermark';
import {GoldBaseline} from '../brand/FrameChrome';
export function Lesson17(){
 const edl=useMemo(()=>enforceLayoutRules(resolveEdlAnchors(lesson17Edl,timing)).edl,[]);
 const src=staticFile(edl.avatarVideoSrc),edges=usePresenterContentEdges(edl.scenes);
 return <AbsoluteFill style={{backgroundColor:theme.colors.surface}}><Audio src={src}/><LessonLabelContext.Provider value="ACT · Lessons 17–18"><ContentEdgesContext.Provider value={edges}><EventRenderer edl={edl}/></ContentEdgesContext.Provider></LessonLabelContext.Provider><PresenterLayer scenes={edl.scenes} videoSrc={src} sourceCutSeconds={edl.sourceCutSeconds}/><BrandWatermark/><GoldBaseline/></AbsoluteFill>;
}
