import React,{useMemo} from 'react';
import {AbsoluteFill,Audio,staticFile} from 'remotion';
import {resolveEdlAnchors} from '../edl/resolveAnchors';
import {enforceLayoutRules} from '../edl/enforceLayoutRules';
import {lesson03Edl} from '../data/lesson-03-edl';
import timing from '../../../../lessons/lesson-03/generated/word-timing/lesson-03-word-timing.json';
import config from '../../../../lessons/lesson-03/input/scene-config.json';
import {PresenterLayer,usePresenterContentEdges} from '../presenter/PresenterLayer';
import {EventRenderer} from './EventRenderer';
import {theme} from '../components/theme';
import {LessonLabelContext,ContentEdgesContext} from '../slides/SlideFrame';
import {BrandWatermark} from '../brand/BrandWatermark';
import {GoldBaseline} from '../brand/FrameChrome';
export function Lesson03(){
 const edl=useMemo(()=>enforceLayoutRules(resolveEdlAnchors(lesson03Edl,timing)).edl,[]);
 const src=staticFile(edl.avatarVideoSrc),edges=usePresenterContentEdges(edl.scenes);
 return <AbsoluteFill style={{backgroundColor:theme.colors.surface}}><Audio src={src}/><LessonLabelContext.Provider value={config.lessonLabel}><ContentEdgesContext.Provider value={edges}><EventRenderer edl={edl}/></ContentEdgesContext.Provider></LessonLabelContext.Provider><PresenterLayer scenes={edl.scenes} videoSrc={src} sourceCutSeconds={edl.sourceCutSeconds}/><BrandWatermark/><GoldBaseline/></AbsoluteFill>;
}
