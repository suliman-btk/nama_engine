import React,{useMemo} from 'react';
import {AbsoluteFill,Audio,staticFile} from 'remotion';
import {resolveEdlAnchors} from '../edl/resolveAnchors';
import {enforceLayoutRules} from '../edl/enforceLayoutRules';
import {lesson19Edl} from '../data/lesson-19-edl';
import timing from '../../../../lessons/lesson-19/generated/word-timing/lesson-19-word-timing.json';
import {PresenterLayer,usePresenterContentEdges} from '../presenter/PresenterLayer';
import {EventRenderer} from './EventRenderer';
import {CourseConfigContext} from '../course/CourseContext';
import {LessonLabelContext,ContentEdgesContext} from '../slides/SlideFrame';
import {BrandWatermark} from '../brand/BrandWatermark';
import {GoldBaseline} from '../brand/FrameChrome';
import {parseCourseConfig} from '../course/schema';
import courseConfigRaw from '../../../../course-config.json';

const courseConfig = parseCourseConfig(courseConfigRaw);

export function Lesson19(){
  const edl=useMemo(()=>enforceLayoutRules(resolveEdlAnchors(lesson19Edl,timing)).edl,[]);
  const src=staticFile(edl.avatarVideoSrc);
  const edges=usePresenterContentEdges(edl.scenes);
  const lessonLabel = courseConfig.lessonLabelTemplate.replace("{lesson}", "19–20");

  return <CourseConfigContext.Provider value={courseConfig}>
    <AbsoluteFill style={{backgroundColor:courseConfig.theme.colors.surface}}>
    <Audio src={src}/>
    <LessonLabelContext.Provider value={lessonLabel}>
      <ContentEdgesContext.Provider value={edges}><EventRenderer edl={edl}/></ContentEdgesContext.Provider>
    </LessonLabelContext.Provider>
    <PresenterLayer scenes={edl.scenes} videoSrc={src} sourceCutSeconds={edl.sourceCutSeconds}/>
    <BrandWatermark/><GoldBaseline/>
  </AbsoluteFill>
  </CourseConfigContext.Provider>;
}
