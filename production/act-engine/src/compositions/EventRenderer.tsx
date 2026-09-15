import React from "react";
import type { Edl } from "../edl/schema";
import { getComponent } from "../components/registry";
import type { GraphicWindow } from "../components/useWindow";
import { SlideTransition } from "../transitions/SlideTransition";

/**
 * Flattens every event across every (already-anchor-resolved) scene and mounts each one's
 * component for exactly its resolved time window. This is the one place that turns EDL JSON
 * into JSX — the planner never touches this file, only the JSON it produces (rule 17/18).
 */
export function EventRenderer({ edl }: { edl: Edl }) {
  return (
    <>
      {edl.scenes.flatMap((scene, sceneIndex) =>
        scene.events.map((event, eventIndex) => {
          const startSeconds = event.anchor.atSeconds;
          // The last slide in a scene holds until the scene actually ends. Its endAnchor
          // usually lands on the final phrase it illustrates, a beat before the cut — and
          // that beat was showing as a hole, with the outgoing slide already gone and the
          // next one not yet in.
          const isLast = eventIndex === scene.events.length - 1;
          const endSeconds = isLast
            ? scene.end.atSeconds ?? event.endAnchor?.atSeconds
            : event.endAnchor?.atSeconds ?? scene.end.atSeconds;
          if (startSeconds === undefined || endSeconds === undefined) {
            throw new Error(`Event "${event.id}" has unresolved timing — did you run resolveEdlAnchors()?`);
          }
          if (!event.component) return null;

          // Lead-in: a slide begins arriving a beat BEFORE its scene starts, so the outgoing
          // and incoming slides are moving at the same time. Without this they queue — one
          // finishes leaving, then the next begins — which reads as a pause followed by a
          // sudden transition rather than one continuous move.
          // Was fps * 0.36, to start the incoming slide before the outgoing one left so the
          // two moved together. With opaque full-frame slides that is simply two slides on
          // screen at once, which is what the client saw. Slides are strictly sequential now;
          // the presenter's own move between layouts carries the transition.
          const leadInFrames = 0;
          // Both edges are rounded from the scene boundary itself. Rounding the DURATION
          // instead let a window end one frame past where the next one began, so two slides
          // shared a frame at some cuts.
          const rawStart = Math.round(startSeconds * edl.fps);
          const rawEnd = Math.round(endSeconds * edl.fps);
          const window: GraphicWindow = {
            startFrame: Math.max(0, rawStart - leadInFrames),
            durationInFrames: rawEnd - rawStart + leadInFrames,
          };

          const Component = getComponent(event.component);
          const side = event.position === "full" ? "center" : event.position;

          // A cut is ONE transition, so the slide leaving and the slide arriving have to move
          // in the same language. The outgoing slide's exit therefore takes the NEXT scene's
          // transitionIn — not its own `transitionOut`, which is unset on every scene and so
          // defaulted to clean-cut, i.e. a plain fade. That was the bug: the arriving slide
          // did the designed band-open while the departing one just faded, and the two halves
          // plainly didn't belong to each other.
          const nextScene = edl.scenes[sceneIndex + 1];
          const exitPreset = nextScene ? nextScene.transitionIn : scene.transitionOut;

          // The scene's transition drives how its slide arrives and leaves. Wrapping the
          // component here (rather than inside each one) means every graphic in the library
          // gets the motion for free and none of them can forget it.
          return (
            <SlideTransition
              key={event.id}
              preset={scene.transitionIn}
              outPreset={exitPreset}
              startFrame={window.startFrame}
              durationInFrames={window.durationInFrames}
            >
              <Component
                window={window}
                side={side}
                animation={event.animation}
                fps={edl.fps}
                {...(event.props ?? {})}
              />
            </SlideTransition>
          );
        })
      )}
    </>
  );
}
