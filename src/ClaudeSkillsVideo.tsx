import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// ─── Constants ────────────────────────────────────────────────────────────────

const W = 1080;

// Short-form safe zones
const SAFE_X = 64;
const SAFE_TOP = 260;
const SAFE_BOTTOM = 380;

// Palette — Kiley Organization brand colors + accents
const BG = "#06060f";
const PURPLE = "#a855f7";
const PURPLE_MID = "#c084fc";
const BLUE = "#3b82f6";
const ORANGE = "#f97316";
const GREEN = "#22c55e";
const YELLOW = "#eab308";
const WHITE = "#ffffff";
const MUTED = "#94a3b8";
const GH_DARK = "#0d1117";
const GH_BORDER = "#30363d";

// Kiley brand
const KILEY_BLUE = "#19469D";
const KILEY_ORANGE = "#F5821F";
const KILEY_BLACK = "#1C1C1C";

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
      <AbsoluteFill style={{ background: BG }} />
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
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 38% at 50% 44%, rgba(168,85,247,${glowAlpha}) 0%, transparent 70%)`,
        }}
      />
      {PARTICLES.map((p, i) => {
        const yPos = (p.y - ((frame * p.speed) % 1920) + 1920) % 1920;
        const fadeOpacity = interpolate(yPos, [0, 150, 1770, 1920], [0, p.baseOpacity, p.baseOpacity, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
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

// ─── Scene 1: Viral Hook (0–3 s = 90 frames) ────────────────────────────────

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flashOpacity = interpolate(frame, [0, 8], [0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "FREE" slams up
  const freeSpring = spring({ frame, fps, config: { damping: 10, stiffness: 220 }, durationInFrames: 20 });
  const freeY = interpolate(freeSpring, [0, 1], [80, 0]);
  const freePulse = 1 + interpolate(Math.sin(frame * 0.16), [-1, 1], [0, 0.025]);

  // "Claude Code Skills" appears
  const subSpring = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 160 }, durationInFrames: 24 });
  const subScale = interpolate(subSpring, [0, 1], [0.5, 1]);
  const subOpacity = interpolate(frame, [12, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "on GitHub 🔥"
  const ghSpring = spring({ frame: frame - 28, fps, config: { damping: 8 }, durationInFrames: 28 });
  const ghY = interpolate(ghSpring, [0, 1], [-45, 0]);
  const ghOpacity = interpolate(frame, [28, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "Here are the top 5..."
  const bottomOpacity = interpolate(frame, [50, 68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bottomY = interpolate(frame, [50, 68], [15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: WHITE, opacity: flashOpacity }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 5,
          background: `linear-gradient(90deg, ${KILEY_BLUE}, ${KILEY_ORANGE}, ${KILEY_BLUE})`,
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
        }}
      >
        {/* FREE */}
        <div style={{ transform: `translateY(${freeY}px) scale(${freePulse})`, marginBottom: 10 }}>
          <span
            style={{
              fontFamily: "'Arial Black', Arial, system-ui, sans-serif",
              fontWeight: 900,
              fontSize: 200,
              lineHeight: 1,
              letterSpacing: -6,
              color: KILEY_ORANGE,
              textShadow: `0 0 28px ${KILEY_ORANGE}B3, 0 0 70px ${KILEY_ORANGE}40`,
            }}
          >
            FREE
          </span>
        </div>

        {/* Claude Code Skills */}
        <div style={{ opacity: subOpacity, transform: `scale(${subScale})`, textAlign: "center", marginBottom: 24 }}>
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 800,
              fontSize: 68,
              lineHeight: 1.15,
              color: WHITE,
            }}
          >
            Claude Code
          </span>
          <br />
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 800,
              fontSize: 68,
              lineHeight: 1.15,
              color: KILEY_BLUE,
              textShadow: `0 0 20px ${KILEY_BLUE}60`,
            }}
          >
            Skills
          </span>
        </div>

        {/* on GitHub 🔥 */}
        <div style={{ opacity: ghOpacity, transform: `translateY(${ghY}px)`, display: "flex", alignItems: "center", gap: 14, marginBottom: 44 }}>
          <div
            style={{
              background: "rgba(34,197,94,0.14)",
              border: "2px solid rgba(34,197,94,0.38)",
              borderRadius: 16,
              paddingLeft: 22,
              paddingRight: 22,
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <span style={{ fontFamily: "system-ui", fontWeight: 700, fontSize: 48, color: GREEN }}>on GitHub</span>
          </div>
          <span style={{ fontSize: 52 }}>🔥</span>
        </div>

        {/* Bottom text */}
        <div style={{ opacity: bottomOpacity, transform: `translateY(${bottomY}px)`, textAlign: "center" }}>
          <span style={{ fontFamily: "system-ui", fontWeight: 600, fontSize: 36, color: MUTED }}>
            Here are the{" "}
            <span style={{ color: KILEY_ORANGE, fontWeight: 800 }}>top 5 repos</span>
            {" "}you need
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Repo data (all verified public & free) ──────────────────────────────────

const REPOS = [
  {
    owner: "anthropics",
    repo: "skills",
    stars: "116k",
    desc: "Official repository for Agent Skills — the standard for how AI agents learn new capabilities",
    tags: ["official", "agent-skills", "SKILL.md"],
    accent: ORANGE,
    initial: "A",
    files: ["skills/", "spec/", "template/", "README.md"],
  },
  {
    owner: "vercel-labs",
    repo: "skills",
    stars: "14k",
    desc: "The open agent skills CLI — discover, install & manage skills across 40+ agents",
    tags: ["cli", "npx-skills", "ecosystem"],
    accent: WHITE,
    initial: "V",
    files: ["src/", "skills/", "package.json", "README.md"],
  },
  {
    owner: "remotion-dev",
    repo: "skills",
    stars: "2.7k",
    desc: "Agent Skills for programmatic video creation in React with Remotion",
    tags: ["video", "react", "remotion"],
    accent: PURPLE,
    initial: "R",
    files: ["skills/remotion/", "src/", "README.md"],
  },
  {
    owner: "levnikolaevich",
    repo: "claude-code-skills",
    stars: "387",
    desc: "Plugin suite + MCP servers — Agile pipeline, docs gen, codebase audits & more",
    tags: ["mcp-servers", "agile", "plugins"],
    accent: GREEN,
    initial: "L",
    files: ["plugins/", "CLAUDE.md", "SKILL.md"],
  },
  {
    owner: "glebis",
    repo: "claude-skills",
    stars: "105",
    desc: "45+ curated skills — TDD, Google Workspace, productivity, knowledge maps",
    tags: ["workflows", "tdd", "productivity"],
    accent: BLUE,
    initial: "G",
    files: ["tdd/", "gws/", "vault-daydream/", "README.md"],
  },
];

// ─── Repo Scene (each is 60 frames = 2 s) ───────────────────────────────────

const RepoScene: React.FC<{ repoIndex: number }> = ({ repoIndex }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const repo = REPOS[repoIndex];

  // Card enters
  const cardSpring = spring({ frame, fps, config: { damping: 14, stiffness: 170 }, durationInFrames: 22 });
  const cardScale = interpolate(cardSpring, [0, 1], [0.8, 1]);
  const cardOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Star badge pops
  const starSpring = spring({ frame: frame - 10, fps, config: { damping: 8, stiffness: 200 }, durationInFrames: 18 });
  const starScale = interpolate(starSpring, [0, 1], [0.4, 1]);

  // Tags + files stagger in
  const detailsOpacity = interpolate(frame, [16, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Exit fade (last 6 frames)
  const exitOpacity = interpolate(frame, [54, 60], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const totalOpacity = cardOpacity * exitOpacity;

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
      {/* Counter badge */}
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP + 10,
          right: SAFE_X + 10,
          opacity: cardOpacity,
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: 700,
          fontSize: 28,
          color: MUTED,
        }}
      >
        {repoIndex + 1}/5
      </div>

      {/* GitHub-style mockup card */}
      <div
        style={{
          opacity: totalOpacity,
          transform: `scale(${cardScale})`,
          width: "100%",
          background: GH_DARK,
          border: `2px solid ${repo.accent}40`,
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: `0 0 50px ${repo.accent}12, 0 10px 50px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Colored accent bar */}
        <div
          style={{
            height: 5,
            background: `linear-gradient(90deg, ${repo.accent}, ${repo.accent}80)`,
          }}
        />

        <div style={{ padding: 36 }}>
          {/* Owner + Repo name row */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
            {/* Avatar circle */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: `${repo.accent}25`,
                border: `2.5px solid ${repo.accent}55`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "system-ui",
                fontWeight: 800,
                fontSize: 26,
                color: repo.accent,
                flexShrink: 0,
              }}
            >
              {repo.initial}
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 0, flexWrap: "wrap" as const }}>
                <span
                  style={{
                    fontFamily: "system-ui",
                    fontWeight: 500,
                    fontSize: 26,
                    color: MUTED,
                  }}
                >
                  {repo.owner}
                  <span style={{ color: `${MUTED}80` }}> / </span>
                </span>
                <span
                  style={{
                    fontFamily: "system-ui",
                    fontWeight: 800,
                    fontSize: 34,
                    color: WHITE,
                  }}
                >
                  {repo.repo}
                </span>
              </div>
            </div>
          </div>

          {/* Star badge */}
          <div
            style={{
              transform: `scale(${starScale})`,
              transformOrigin: "left center",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(234,179,8,0.12)",
              border: "1.5px solid rgba(234,179,8,0.32)",
              borderRadius: 30,
              paddingLeft: 18,
              paddingRight: 18,
              paddingTop: 9,
              paddingBottom: 9,
              marginBottom: 22,
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>⭐</span>
            <span
              style={{
                fontFamily: "system-ui",
                fontWeight: 800,
                fontSize: 30,
                color: YELLOW,
              }}
            >
              {repo.stars}
            </span>
          </div>

          {/* Description */}
          <div
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 500,
              fontSize: 30,
              lineHeight: 1.45,
              color: "#c9d1d9",
              marginBottom: 24,
            }}
          >
            {repo.desc}
          </div>

          {/* Topic tags */}
          <div
            style={{
              opacity: detailsOpacity,
              display: "flex",
              gap: 10,
              flexWrap: "wrap" as const,
              marginBottom: 22,
            }}
          >
            {repo.tags.map((tag) => (
              <div
                key={tag}
                style={{
                  background: `${repo.accent}15`,
                  border: `1px solid ${repo.accent}30`,
                  borderRadius: 20,
                  paddingLeft: 14,
                  paddingRight: 14,
                  paddingTop: 6,
                  paddingBottom: 6,
                  fontFamily: "'Courier New', monospace",
                  fontWeight: 600,
                  fontSize: 20,
                  color: repo.accent,
                }}
              >
                {tag}
              </div>
            ))}
          </div>

          {/* Fake file tree */}
          <div
            style={{
              opacity: detailsOpacity,
              borderTop: `1px solid ${GH_BORDER}`,
              paddingTop: 14,
            }}
          >
            {repo.files.map((file) => (
              <div
                key={file}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  paddingTop: 7,
                  paddingBottom: 7,
                  borderBottom: `1px solid ${GH_BORDER}50`,
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{file.endsWith("/") ? "📁" : "📄"}</span>
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: 22,
                    color: "#58a6ff",
                  }}
                >
                  {file}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Confetti / explosion particles for CTA ────────────────────────────────

const CTA_PARTICLES = Array.from({ length: 60 }, (_, i) => {
  const angle = (i / 60) * Math.PI * 2 + ((i * 37) % 7) * 0.3;
  const speed = 3 + (i % 8) * 2.5;
  const colors = [KILEY_BLUE, KILEY_ORANGE, WHITE, "#FFD700", "#FF4081", "#00E5FF"];
  return {
    angle,
    speed,
    color: colors[i % colors.length],
    size: 6 + (i % 5) * 5,
    rotSpeed: (i % 2 === 0 ? 1 : -1) * (3 + (i % 4) * 2),
    shape: i % 3, // 0=circle, 1=square, 2=rectangle
    delay: Math.floor(i / 15) * 2, // staggered bursts
  };
});

// ─── CTA Scene (2 s = 60 frames) — Kiley brand ─────────────────────────────

const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Flash bang at start
  const flashOpacity = interpolate(frame, [0, 6], [0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shockwave ring
  const ringScale = interpolate(frame, [0, 20], [0, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const ringOpacity = interpolate(frame, [0, 20], [0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Sign Up for" — slides down from above
  const titleSpring = spring({ frame: frame - 4, fps, config: { damping: 10, stiffness: 200 }, durationInFrames: 18 });
  const titleY = interpolate(titleSpring, [0, 1], [-60, 0]);
  const titleOpacity = interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "Kiley" logo slam — springs in with overshoot
  const brandSpring = spring({ frame: frame - 8, fps, config: { damping: 6, stiffness: 260, mass: 1.2 }, durationInFrames: 28 });
  const brandScale = interpolate(brandSpring, [0, 1], [0.15, 1]);
  const brandRotation = interpolate(brandSpring, [0, 1], [-8, 0]);
  const brandOpacity = interpolate(frame, [8, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Kiley underline accent swoosh
  const swooshWidth = interpolate(frame, [18, 32], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Subtext bounce in
  const subSpring = spring({ frame: frame - 28, fps, config: { damping: 12, stiffness: 180 }, durationInFrames: 20 });
  const subY = interpolate(subSpring, [0, 1], [40, 0]);
  const subOpacity = interpolate(frame, [28, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Arrow bounce
  const arrowBounce = frame > 38 ? Math.sin((frame - 38) * 0.4) * 8 : 0;

  return (
    <AbsoluteFill>
      {/* Radial gradient background burst */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 48%, ${KILEY_BLUE}40 0%, transparent 55%)`,
          opacity: interpolate(frame, [0, 15, 50], [0, 0.8, 0.4], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* Shockwave ring */}
      <div
        style={{
          position: "absolute",
          top: "48%",
          left: "50%",
          width: 80,
          height: 80,
          marginLeft: -40,
          marginTop: -40,
          borderRadius: "50%",
          border: `4px solid ${KILEY_ORANGE}`,
          opacity: ringOpacity,
          transform: `scale(${ringScale})`,
        }}
      />

      {/* Confetti explosion */}
      {CTA_PARTICLES.map((p, i) => {
        const t = Math.max(0, frame - p.delay) / 60;
        const gravity = 600;
        const vx = Math.cos(p.angle) * p.speed * 120;
        const vy = Math.sin(p.angle) * p.speed * 120 - 200;
        const px = 540 + vx * t;
        const py = 920 + (vy * t + 0.5 * gravity * t * t);
        const rot = t * p.rotSpeed * 360;
        const opacity = interpolate(frame, [p.delay, p.delay + 4, 45, 60], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const w = p.shape === 2 ? p.size * 2.2 : p.size;
        const h = p.size;
        const br = p.shape === 0 ? "50%" : "2px";

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: w,
              height: h,
              borderRadius: br,
              background: p.color,
              opacity,
              transform: `rotate(${rot}deg)`,
              boxShadow: `0 0 ${p.size}px ${p.color}60`,
            }}
          />
        );
      })}

      {/* White flash */}
      <AbsoluteFill style={{ background: WHITE, opacity: flashOpacity }} />

      {/* Main content */}
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
        {/* "Sign Up for" */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontFamily: "'Liberation Sans', 'DejaVu Sans', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 56,
              color: WHITE,
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}
          >
            Sign Up for
          </span>
        </div>

        {/* Kiley — styled as logo */}
        <div
          style={{
            opacity: brandOpacity,
            transform: `scale(${brandScale}) rotate(${brandRotation}deg)`,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontFamily: "'Liberation Sans', 'DejaVu Sans', system-ui, sans-serif",
              fontWeight: 900,
              fontSize: 160,
              lineHeight: 1,
              letterSpacing: 6,
              color: KILEY_BLUE,
              textShadow: `0 0 40px ${KILEY_BLUE}90, 0 0 100px ${KILEY_BLUE}40, 0 4px 8px rgba(0,0,0,0.5)`,
            }}
          >
            Kiley
          </span>
        </div>

        {/* Accent swoosh underline */}
        <div
          style={{
            width: `${swooshWidth}%`,
            maxWidth: 420,
            height: 6,
            background: `linear-gradient(90deg, ${KILEY_ORANGE}, ${KILEY_BLUE})`,
            borderRadius: 3,
            marginBottom: 36,
            boxShadow: `0 0 20px ${KILEY_ORANGE}60`,
          }}
        />

        {/* Subtext */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Liberation Sans', 'DejaVu Sans', system-ui, sans-serif",
              fontWeight: 600,
              fontSize: 38,
              color: MUTED,
              lineHeight: 1.5,
            }}
          >
            Get all these skills
          </span>
          <br />
          <span
            style={{
              fontFamily: "'Liberation Sans', 'DejaVu Sans', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 42,
              color: KILEY_ORANGE,
              textShadow: `0 0 20px ${KILEY_ORANGE}50`,
            }}
          >
            & so much more
          </span>
        </div>

        {/* Bouncing arrow */}
        <div
          style={{
            opacity: subOpacity,
            marginTop: 44,
            fontSize: 52,
            transform: `translateY(${arrowBounce}px)`,
          }}
        >
          👇
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Wipe transition ─────────────────────────────────────────────────────────

const Wipe: React.FC = () => {
  const frame = useCurrentFrame();
  const x =
    frame <= 9
      ? interpolate(frame, [0, 9], [-W, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) })
      : interpolate(frame, [9, 18], [0, W], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${KILEY_BLUE} 0%, ${KILEY_ORANGE} 50%, ${KILEY_BLUE} 100%)`,
        transform: `translateX(${x}px)`,
      }}
    />
  );
};

// ─── Main Composition ────────────────────────────────────────────────────────

export const ClaudeSkillsVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  // Timeline (frames)
  const HOOK = 90; // 3 s
  const REPO_DUR = 60; // 2 s each
  const CTA_DUR = 60; // 2 s
  // Total: 90 + 60*5 + 60 = 450 frames = 15 s

  const WIPE_OFFSET = 9;
  const WIPE_DUR = 18;

  const repo1Start = HOOK;
  const repo2Start = repo1Start + REPO_DUR;
  const repo3Start = repo2Start + REPO_DUR;
  const repo4Start = repo3Start + REPO_DUR;
  const repo5Start = repo4Start + REPO_DUR;
  const ctaStart = repo5Start + REPO_DUR;

  return (
    <AbsoluteFill>
      <Background />

      {/* Hook */}
      <Sequence from={0} durationInFrames={HOOK} premountFor={fps}>
        <HookScene />
      </Sequence>

      {/* 5 repo scenes */}
      <Sequence from={repo1Start} durationInFrames={REPO_DUR} premountFor={fps}>
        <RepoScene repoIndex={0} />
      </Sequence>
      <Sequence from={repo2Start} durationInFrames={REPO_DUR} premountFor={fps}>
        <RepoScene repoIndex={1} />
      </Sequence>
      <Sequence from={repo3Start} durationInFrames={REPO_DUR} premountFor={fps}>
        <RepoScene repoIndex={2} />
      </Sequence>
      <Sequence from={repo4Start} durationInFrames={REPO_DUR} premountFor={fps}>
        <RepoScene repoIndex={3} />
      </Sequence>
      <Sequence from={repo5Start} durationInFrames={REPO_DUR} premountFor={fps}>
        <RepoScene repoIndex={4} />
      </Sequence>

      {/* CTA */}
      <Sequence from={ctaStart} durationInFrames={CTA_DUR} premountFor={fps}>
        <CTAScene />
        <Audio src={staticFile("boom.wav")} volume={0.8} />
      </Sequence>

      {/* Wipe: Hook → Repo 1 */}
      <Sequence from={HOOK - WIPE_OFFSET} durationInFrames={WIPE_DUR} premountFor={WIPE_OFFSET}>
        <Wipe />
      </Sequence>

      {/* Wipe: Repo 5 → CTA */}
      <Sequence from={ctaStart - WIPE_OFFSET} durationInFrames={WIPE_DUR} premountFor={WIPE_OFFSET}>
        <Wipe />
      </Sequence>
    </AbsoluteFill>
  );
};
