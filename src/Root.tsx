import React from "react";
import { Composition } from "remotion";
import { ClaudeSkillsVideo } from "./ClaudeSkillsVideo";
import { KileyOutdoorVideo } from "./KileyOutdoorVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ClaudeSkillsVideo"
        component={ClaudeSkillsVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="KileyOutdoorVideo"
        component={KileyOutdoorVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
