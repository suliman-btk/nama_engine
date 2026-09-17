import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {resolveEdlAnchors} from '../edl/resolveAnchors';
import {enforceLayoutRules} from '../edl/enforceLayoutRules';
import {lesson02Edl} from '../data/lesson-02-edl';
import timing from '../../../../lessons/lesson-02/generated/word-timing/lesson-02-word-timing.json';
import {PresenterLayer, usePresenterContentEdges} from '../presenter/PresenterLayer';
import {EventRenderer} from './EventRenderer';
import {theme} from '../components/theme';
import {LessonLabelContext, ContentEdgesContext} from '../slides/SlideFrame';
import {BrandWatermark} from '../brand/BrandWatermark';
import {GoldBaseline} from '../brand/FrameChrome';

export function Lesson02() {
  const edl = useMemo(() => enforceLayoutRules(resolveEdlAnchors(lesson02Edl, timing)).edl, []);
  const src = staticFile(edl.avatarVideoSrc);
  const edges = usePresenterContentEdges(edl.scenes);
  return <AbsoluteFill style={{backgroundColor: theme.colors.surface}}>
    <Audio src={src}/>
    <LessonLabelContext.Provider value="ACT · Lesson 2">
      <ContentEdgesContext.Provider value={edges}><EventRenderer edl={edl}/></ContentEdgesContext.Provider>
    </LessonLabelContext.Provider>
    <PresenterLayer scenes={edl.scenes} videoSrc={src} sourceCutSeconds={edl.sourceCutSeconds}/>
    <BrandWatermark/><GoldBaseline/>
  </AbsoluteFill>;
}
