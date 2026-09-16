import React, {useMemo} from 'react';
import {AbsoluteFill,Audio,staticFile} from 'remotion';
import {resolveEdlAnchors} from '../edl/resolveAnchors';
import {enforceLayoutRules} from '../edl/enforceLayoutRules';
import {lesson06Edl} from '../data/lesson-06-edl';
import timing from '../../../../lessons/lesson-06/generated/word-timing/lesson-06-word-timing.json';
import {PresenterLayer,StageLayer,usePresenterContentEdges} from '../presenter/PresenterLayer';
import {EventRenderer} from './EventRenderer';
import {theme} from '../components/theme';
import {LessonLabelContext,ContentEdgesContext} from '../slides/SlideFrame';
import {BrandWatermark} from '../brand/BrandWatermark';
import {GoldBaseline} from '../brand/FrameChrome';
export function Lesson06(){
 const edl=useMemo(()=>enforceLayoutRules(resolveEdlAnchors(lesson06Edl,timing)).edl,[]);
 const src=staticFile(edl.avatarVideoSrc),edges=usePresenterContentEdges(edl.scenes);
 return <AbsoluteFill style={{backgroundColor:theme.colors.surface}}>
  <Audio src={src}/><StageLayer scenes={edl.scenes} videoSrc={src} coveredBySlide/>
  <LessonLabelContext.Provider value="ACT · Lesson 6"><ContentEdgesContext.Provider value={edges}><EventRenderer edl={edl}/></ContentEdgesContext.Provider></LessonLabelContext.Provider>
  <PresenterLayer scenes={edl.scenes} videoSrc={src} sourceCutSeconds={edl.sourceCutSeconds}/><BrandWatermark/><GoldBaseline/>
 </AbsoluteFill>;
}
