import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// ─── Constants ────────────────────────────────────────────────────────────────

const W = 1080;

// Short-form video safe zones (TikTok / Reels)
const SAFE_X = 64;
const SAFE_TOP = 260; // avoid top UI chrome
const SAFE_BOTTOM = 380; // avoid like/comment/share buttons

// Palette
const BG = "#06060f";
const PURPLE = "#a855f7";
const PURPLE_MID = "#c084fc";
const BLUE = "#3b82f6";
const ORANGE = "#f97316";
const GREEN = "#22c55e";
const WHITE = "#ffffff";
const MUTED = "#94a3b8";

// ─── Background ──────────────────────────────────────────────────────────────

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  x: ((i * 137.508) % 1) * W,
  y: ((i * 97.317) % 1) * 1920,
  size: 1.5 + (i % 4) * 0.9,
  speed: 0.14 + (i % 7) * 0.07,
  baseOpacity: 0.12 + (i % 5) * 0.07,
  color: i % 3 === 0 ? BLUE : PURPLE,
}));

const Background: React.FC = () => {
  const frame = useCurrentFrame();

  const glowAlpha = interpolate(Math.sin(frame * 0.035), [-1, 1], [0.1, 0.2]);

  return (
    <AbsoluteFill>
      {/* Base */}
      <AbsoluteFill style={{ background: BG }} />

      {/* Moving grid */}
      <AbsoluteFill
        style={{
          backgroundImage: [
            "linear-gradient(rgba(168,85,247,0.06) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(168,85,247,0.06) 1px, transparent 1px)",
          ].join(","),
          backgroundSize: "80px 80px",
          backgroundPositionX: `${(frame * 0.35) % 80}px`,
          backgroundPositionY: `${(frame * 0.22) % 80}px`,
        }}
      />

      {/* Radial glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 38% at 50% 44%, rgba(168,85,247,${glowAlpha}) 0%, transparent 70%)`,
        }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => {
        const yPos = (p.y - (frame * p.speed) % 1920 + 1920) % 1920;
        const fadeOpacity = interpolate(
          yPos,
          [0, 150, 1920 - 150, 1920],
          [0, p.baseOpacity, p.baseOpacity, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: yPos,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.color,
              opacity: fadeOpacity,
              boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Scene 1: Viral Hook (frames 0-149 / 5 s) ────────────────────────────────

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── White flash on entry
  const flashOpacity = interpolate(frame, [0, 10], [0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // ── "Claude Code" badge slides from right
  const badgeSpring = spring({ frame: frame - 5, fps, config: { damping: 18, stiffness: 140 }, durationInFrames: 28 });
  const badgeX = interpolate(badgeSpring, [0, 1], [180, 0]);
  const badgeOpacity = interpolate(frame, [5, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── "FREE" slams up
  const freeSpring = spring({ frame, fps, config: { damping: 10, stiffness: 220 }, durationInFrames: 22 });
  const freeY = interpolate(freeSpring, [0, 1], [90, 0]);
  const freePulse = 1 + interpolate(Math.sin(frame * 0.14), [-1, 1], [0, 0.028]);

  // ── "Skills" pops in with scale bounce
  const skillsSpring = spring({ frame: frame - 20, fps, config: { damping: 9, stiffness: 180 }, durationInFrames: 28 });
  const skillsScale = interpolate(skillsSpring, [0, 1], [0.45, 1]);
  const skillsOpacity = interpolate(frame, [20, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── "on GitHub 🔥" bounces in
  const githubSpring = spring({ frame: frame - 38, fps, config: { damping: 7 }, durationInFrames: 32 });
  const githubY = interpolate(githubSpring, [0, 1], [-55, 0]);
  const githubOpacity = interpolate(frame, [38, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Counter + subtext fades in
  const countOpacity = interpolate(frame, [65, 84], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const countY = interpolate(frame, [65, 88], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtextOpacity = interpolate(frame, [84, 104], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Blinking cursor on counter
  const cursorBlink = Math.floor(frame / 18) % 2 === 0 ? 1 : 0;

  return (
    <AbsoluteFill>
      {/* Flash */}
      <AbsoluteFill style={{ background: WHITE, opacity: flashOpacity }} />

      {/* Glowing accent strip */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${PURPLE}, ${BLUE}, ${ORANGE})`,
          opacity: 0.85,
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: SAFE_X,
          paddingRight: SAFE_X,
          paddingTop: SAFE_TOP,
          paddingBottom: SAFE_BOTTOM,
          gap: 0,
        }}
      >
        {/* Badge */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateX(${badgeX}px)`,
            background: "rgba(168,85,247,0.18)",
            border: `1.5px solid rgba(168,85,247,0.45)`,
            borderRadius: 40,
            paddingLeft: 28,
            paddingRight: 28,
            paddingTop: 11,
            paddingBottom: 11,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 700,
              fontSize: 30,
              color: PURPLE_MID,
              letterSpacing: 3,
              textTransform: "uppercase" as const,
            }}
          >
            Claude Code
          </span>
        </div>

        {/* FREE */}
        <div style={{ transform: `translateY(${freeY}px) scale(${freePulse})`, marginBottom: 4 }}>
          <span
            style={{
              fontFamily: "'Arial Black', Arial, system-ui, sans-serif",
              fontWeight: 900,
              fontSize: 196,
              lineHeight: 1,
              letterSpacing: -6,
              color: ORANGE,
              textShadow: `0 0 28px rgba(249,115,22,0.7), 0 0 70px rgba(249,115,22,0.25)`,
            }}
          >
            FREE
          </span>
        </div>

        {/* Skills */}
        <div
          style={{
            opacity: skillsOpacity,
            transform: `scale(${skillsScale})`,
            marginBottom: 26,
          }}
        >
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 800,
              fontSize: 78,
              lineHeight: 1,
              letterSpacing: -2,
              color: WHITE,
            }}
          >
            Skills
          </span>
        </div>

        {/* on GitHub 🔥 */}
        <div
          style={{
            opacity: githubOpacity,
            transform: `translateY(${githubY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 50,
          }}
        >
          <div
            style={{
              background: "rgba(34,197,94,0.14)",
              border: `2px solid rgba(34,197,94,0.38)`,
              borderRadius: 16,
              paddingLeft: 22,
              paddingRight: 22,
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <span
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: 700,
                fontSize: 52,
                color: GREEN,
                letterSpacing: -1,
              }}
            >
              on GitHub
            </span>
          </div>
          <span style={{ fontSize: 58 }}>🔥</span>
        </div>

        {/* Counter */}
        <div
          style={{
            opacity: countOpacity,
            transform: `translateY(${countY}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: 4,
              marginBottom: 14,
            }}
          >
            <span
              style={{
                fontFamily: "'Arial Black', Arial, system-ui, sans-serif",
                fontWeight: 900,
                fontSize: 88,
                lineHeight: 1,
                color: ORANGE,
                textShadow: `0 0 20px rgba(249,115,22,0.4)`,
              }}
            >
              47+
            </span>
            <span
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: 700,
                fontSize: 38,
                color: WHITE,
                marginLeft: 8,
              }}
            >
              repos
            </span>
            {/* blinking cursor */}
            <span
              style={{
                display: "inline-block",
                width: 4,
                height: 52,
                background: ORANGE,
                marginLeft: 4,
                opacity: cursorBlink,
                verticalAlign: "middle",
                borderRadius: 2,
              }}
            />
          </div>

          {/* Subtext */}
          <div style={{ opacity: subtextOpacity }}>
            <span
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: 500,
                fontSize: 36,
                lineHeight: 1.45,
                color: MUTED,
              }}
            >
              most devs have{" "}
              <span style={{ color: WHITE, fontWeight: 800 }}>never heard of</span>
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Repos List (frames 150-299 / 5 s) ──────────────────────────────

const REPOS = [
  { emoji: "🎬", name: "remotion-dev/skills", tag: "Video Creation", accent: PURPLE, bg: "rgba(168,85,247,0.11)", border: "rgba(168,85,247,0.28)" },
  { emoji: "🤖", name: "anthropic-ai/cookbook", tag: "Prompts & Patterns", accent: ORANGE, bg: "rgba(249,115,22,0.11)", border: "rgba(249,115,22,0.28)" },
  { emoji: "🌐", name: "browser-use/web-skills", tag: "Web Automation", accent: BLUE, bg: "rgba(59,130,246,0.11)", border: "rgba(59,130,246,0.28)" },
  { emoji: "⚡", name: "vercel/ai-agent-toolkit", tag: "Deployment & CI/CD", accent: GREEN, bg: "rgba(34,197,94,0.11)", border: "rgba(34,197,94,0.28)" },
  { emoji: "📊", name: "langchain-ai/skills", tag: "Data & Analysis", accent: "#f59e0b", bg: "rgba(245,158,11,0.11)", border: "rgba(245,158,11,0.28)" },
];

const RepoCard: React.FC<{
  repo: (typeof REPOS)[0];
  index: number;
  localFrame: number;
  fps: number;
}> = ({ repo, index, localFrame, fps }) => {
  const delay = index * 13;

  const cardSpring = spring({
    frame: localFrame - delay,
    fps,
    config: { damping: 18, stiffness: 150 },
    durationInFrames: 30,
  });
  const translateX = interpolate(cardSpring, [0, 1], [-180, 0]);
  const opacity = interpolate(localFrame - delay, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        background: repo.bg,
        border: `1.5px solid ${repo.border}`,
        borderRadius: 22,
        paddingLeft: 26,
        paddingRight: 26,
        paddingTop: 20,
        paddingBottom: 20,
        marginBottom: 18,
        display: "flex",
        alignItems: "center",
        gap: 22,
      }}
    >
      <span style={{ fontSize: 46, flexShrink: 0, lineHeight: 1 }}>{repo.emoji}</span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            fontWeight: 700,
            fontSize: 28,
            color: WHITE,
            marginBottom: 5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap" as const,
          }}
        >
          {repo.name}
        </div>
        <div
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 600,
            fontSize: 23,
            color: repo.accent,
          }}
        >
          {repo.tag}
        </div>
      </div>

      {/* Live dot */}
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: repo.accent,
          boxShadow: `0 0 10px ${repo.accent}`,
          flexShrink: 0,
        }}
      />
    </div>
  );
};

const ReposScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({ frame, fps, config: { damping: 20, stiffness: 150 }, durationInFrames: 25 });
  const headerY = interpolate(headerSpring, [0, 1], [-45, 0]);
  const headerOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        paddingLeft: SAFE_X,
        paddingRight: SAFE_X,
        paddingTop: SAFE_TOP,
        paddingBottom: SAFE_BOTTOM,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          textAlign: "center",
          marginBottom: 38,
        }}
      >
        <div
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 700,
            fontSize: 30,
            color: PURPLE_MID,
            letterSpacing: 4,
            textTransform: "uppercase" as const,
            marginBottom: 14,
          }}
        >
          Top Claude Code Skills
        </div>
        {/* Gradient divider */}
        <div
          style={{
            width: 70,
            height: 3,
            background: `linear-gradient(90deg, ${PURPLE}, ${BLUE})`,
            borderRadius: 2,
            margin: "0 auto",
          }}
        />
      </div>

      {/* Cards */}
      {REPOS.map((repo, i) => (
        <RepoCard
          key={repo.name}
          repo={repo}
          index={i}
          localFrame={frame - 8}
          fps={fps}
        />
      ))}
    </AbsoluteFill>
  );
};

// ─── Scene 3: CTA (frames 300-449 / 5 s) ─────────────────────────────────────

const CMD = "npx skills add remotion-dev/skills";

const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleSpring = spring({ frame, fps, config: { damping: 20, stiffness: 150 }, durationInFrames: 25 });
  const titleY = interpolate(titleSpring, [0, 1], [-40, 0]);
  const titleOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Terminal box
  const termSpring = spring({ frame: frame - 18, fps, config: { damping: 16, stiffness: 130 }, durationInFrames: 28 });
  const termScale = interpolate(termSpring, [0, 1], [0.82, 1]);
  const termOpacity = interpolate(frame - 18, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Typewriter command
  const TYPER_START = 40;
  const TYPER_DURATION = 58;
  const charCount = Math.floor(
    interpolate(frame - TYPER_START, [0, TYPER_DURATION], [0, CMD.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const typedCmd = CMD.slice(0, charCount);
  const showCursor = frame >= TYPER_START && frame < TYPER_START + TYPER_DURATION + 28;
  const cursorOn = Math.floor(frame / 14) % 2 === 0;

  // CTA button
  const ctaOpacity = interpolate(frame, [95, 114], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaY = interpolate(frame, [95, 118], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const btnPulse = 1 + interpolate(Math.sin(frame * 0.18), [-1, 1], [0, 0.038]);

  // Subtext
  const subOpacity = interpolate(frame, [115, 132], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        paddingLeft: SAFE_X,
        paddingRight: SAFE_X,
        paddingTop: SAFE_TOP,
        paddingBottom: SAFE_BOTTOM,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: "center",
          marginBottom: 44,
        }}
      >
        <div
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 800,
            fontSize: 50,
            color: WHITE,
            lineHeight: 1.25,
            marginBottom: 6,
          }}
        >
          Install any skill in
        </div>
        <div
          style={{
            fontFamily: "'Arial Black', Arial, system-ui, sans-serif",
            fontWeight: 900,
            fontSize: 68,
            color: ORANGE,
            lineHeight: 1.15,
            textShadow: `0 0 24px rgba(249,115,22,0.45)`,
          }}
        >
          1 command ⚡
        </div>
      </div>

      {/* Terminal */}
      <div
        style={{
          opacity: termOpacity,
          transform: `scale(${termScale})`,
          width: "100%",
          background: "#0d1117",
          border: `1.5px solid rgba(34,197,94,0.28)`,
          borderRadius: 22,
          overflow: "hidden",
          marginBottom: 50,
          boxShadow: "0 0 40px rgba(34,197,94,0.07), 0 8px 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* Window chrome */}
        <div
          style={{
            background: "#161b22",
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 16,
            paddingBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#28c840" }} />
          <span
            style={{
              marginLeft: 14,
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: 22,
              color: "rgba(255,255,255,0.35)",
            }}
          >
            bash
          </span>
        </div>

        {/* Command */}
        <div style={{ paddingLeft: 30, paddingRight: 30, paddingTop: 30, paddingBottom: 30 }}>
          <span
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontWeight: 700,
              fontSize: 31,
              color: "rgba(255,255,255,0.28)",
            }}
          >
            ${" "}
          </span>
          <span
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontWeight: 700,
              fontSize: 31,
              color: GREEN,
              wordBreak: "break-all" as const,
            }}
          >
            {typedCmd}
          </span>
          {showCursor && cursorOn && (
            <span
              style={{
                display: "inline-block",
                width: 3,
                height: "1em",
                background: GREEN,
                marginLeft: 3,
                verticalAlign: "text-bottom",
                borderRadius: 1,
              }}
            />
          )}
        </div>
      </div>

      {/* Follow button */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            transform: `scale(${btnPulse})`,
            background: `linear-gradient(135deg, ${PURPLE} 0%, ${BLUE} 100%)`,
            borderRadius: 60,
            paddingLeft: 52,
            paddingRight: 52,
            paddingTop: 24,
            paddingBottom: 24,
            boxShadow: `0 0 32px rgba(168,85,247,0.38), 0 0 64px rgba(168,85,247,0.14)`,
          }}
        >
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 800,
              fontSize: 36,
              color: WHITE,
              letterSpacing: 0.3,
            }}
          >
            ✨ Follow for more AI tips
          </span>
        </div>

        <div style={{ opacity: subOpacity }}>
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 500,
              fontSize: 30,
              color: MUTED,
            }}
          >
            🔗 Link in bio for all repos
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene Wipe Transition ────────────────────────────────────────────────────

const Wipe: React.FC = () => {
  const frame = useCurrentFrame();

  // Slide in from left (0→8), slide out to right (8→18)
  const x =
    frame <= 9
      ? interpolate(frame, [0, 9], [-W, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad),
        })
      : interpolate(frame, [9, 18], [0, W], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.in(Easing.quad),
        });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${PURPLE} 0%, ${BLUE} 50%, ${ORANGE} 100%)`,
        transform: `translateX(${x}px)`,
      }}
    />
  );
};

// ─── Root composition ─────────────────────────────────────────────────────────

export const ClaudeSkillsVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  // Scene lengths
  const HOOK = 150; // 5 s
  const REPOS = 150; // 5 s
  const CTA = 150; // 5 s

  // Wipe sits 9 frames before each cut, lasts 18 frames
  const WIPE_OFFSET = 9;
  const WIPE_DUR = 18;

  return (
    <AbsoluteFill>
      {/* Always-on background */}
      <Background />

      {/* ── Scenes ── */}
      <Sequence from={0} durationInFrames={HOOK} premountFor={fps}>
        <HookScene />
      </Sequence>

      <Sequence from={HOOK} durationInFrames={REPOS} premountFor={fps}>
        <ReposScene />
      </Sequence>

      <Sequence from={HOOK + REPOS} durationInFrames={CTA} premountFor={fps}>
        <CTAScene />
      </Sequence>

      {/* ── Transitions ── */}
      <Sequence from={HOOK - WIPE_OFFSET} durationInFrames={WIPE_DUR} premountFor={WIPE_OFFSET}>
        <Wipe />
      </Sequence>

      <Sequence from={HOOK + REPOS - WIPE_OFFSET} durationInFrames={WIPE_DUR} premountFor={WIPE_OFFSET}>
        <Wipe />
      </Sequence>
    </AbsoluteFill>
  );
};
