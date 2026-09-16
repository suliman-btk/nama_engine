import React,{useMemo} from "react";
import {AbsoluteFill,Audio,staticFile} from "remotion";
import {resolveEdlAnchors} from "../edl/resolveAnchors";
import {enforceLayoutRules} from "../edl/enforceLayoutRules";
import {lesson13Edl} from "../data/lesson-13-edl";
import timing from "../data/lesson-13-word-timing.json";
import {PresenterLayer,StageLayer,usePresenterContentEdges} from "../presenter/PresenterLayer";
import {EventRenderer} from "./EventRenderer";
import {theme} from "../components/theme";
import {LessonLabelContext,ContentEdgesContext} from "../slides/SlideFrame";
import {BrandWatermark} from "../brand/BrandWatermark";
import {GoldBaseline} from "../brand/FrameChrome";
export function Lesson13(){const edl=useMemo(()=>{const r=resolveEdlAnchors(lesson13Edl,timing as {words:{t0:number;t1:number;w:string}[]});return enforceLayoutRules(r).edl},[]);const src=staticFile(edl.avatarVideoSrc);const edges=usePresenterContentEdges(edl.scenes);return <AbsoluteFill style={{backgroundColor:theme.colors.surface}}><Audio src={src}/><StageLayer scenes={edl.scenes} videoSrc={src} coveredBySlide/><LessonLabelContext.Provider value="ACT · Lesson 13"><ContentEdgesContext.Provider value={edges}><EventRenderer edl={edl}/></ContentEdgesContext.Provider></LessonLabelContext.Provider><PresenterLayer scenes={edl.scenes} videoSrc={src} sourceCutSeconds={edl.sourceCutSeconds}/><BrandWatermark/><GoldBaseline/></AbsoluteFill>}
