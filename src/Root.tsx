import React from "react";
import { Composition } from "remotion";
import { ClaudeSkillsVideo } from "./ClaudeSkillsVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ClaudeSkillsVideo"
      component={ClaudeSkillsVideo}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
