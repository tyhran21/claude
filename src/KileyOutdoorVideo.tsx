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

// ─── Constants ──────────────────────────────────────────────────────────────

const W = 1080;
const H = 1920;
const SAFE_X = 64;
const SAFE_TOP = 260;
const SAFE_BOTTOM = 380;

// Kiley Outdoor Services palette
const GREEN = "#3A7D34";
const GREEN_DARK = "#2D6229";
const GREEN_BRIGHT = "#4CAF50";
const GREEN_LIGHT = "#66BB6A";
const ORANGE = "#F5821F";
const WHITE = "#FFFFFF";
const BROWN = "#8B7355";
const BROWN_LIGHT = "#A08B6E";
const BROWN_DARK = "#6B5740";
const OFF_BLACK = "#1C1C1C";

const FONT = "'Liberation Sans', 'DejaVu Sans', system-ui, sans-serif";

// ─── Grass texture helpers ──────────────────────────────────────────────────

const deadGrassPatterns = [
  "linear-gradient(165deg, #8B7355 25%, #7A6548 25%, #7A6548 50%, #8B7355 50%, #8B7355 75%, #7A6548 75%)",
  "linear-gradient(45deg, rgba(107,87,64,0.5) 25%, transparent 25%, transparent 75%, rgba(107,87,64,0.5) 75%)",
].join(",");

const lushGrassPatterns = [
  "linear-gradient(165deg, #4CAF50 25%, #43A047 25%, #43A047 50%, #4CAF50 50%, #4CAF50 75%, #43A047 75%)",
  "linear-gradient(45deg, rgba(56,142,60,0.5) 25%, transparent 25%, transparent 75%, rgba(56,142,60,0.5) 75%)",
].join(",");

// ─── Floating grass blade particles ─────────────────────────────────────────

const GRASS_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x: ((i * 137.508) % 1) * W,
  y: 400 + ((i * 97.317) % 1) * 1100,
  size: 2 + (i % 3) * 1.5,
  speed: 0.08 + (i % 5) * 0.04,
  opacity: 0.15 + (i % 4) * 0.08,
}));

// ─── Scene 1: Brand Intro (0-2s, 60 frames) ────────────────────────────────

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background glow pulse
  const glowAlpha = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.15, 0.35]);

  // "KILEY" logo text - springs in from scale 0
  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 180, mass: 1 },
    durationInFrames: 22,
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.3, 1]);
  const logoOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "OUTDOOR SERVICES" subtitle
  const subSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 14, stiffness: 160 },
    durationInFrames: 20,
  });
  const subY = interpolate(subSpring, [0, 1], [25, 0]);
  const subOpacity = interpolate(frame, [8, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Divider line swoosh
  const lineWidth = interpolate(frame, [18, 34], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // "Lawn Season is Here" text
  const headSpring = spring({
    frame: frame - 24,
    fps,
    config: { damping: 12, stiffness: 170 },
    durationInFrames: 22,
  });
  const headScale = interpolate(headSpring, [0, 1], [0.6, 1]);
  const headOpacity = interpolate(frame, [24, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit fade for the whole scene
  const exitOpacity = interpolate(frame, [50, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      {/* Solid green background */}
      <AbsoluteFill style={{ background: GREEN }} />

      {/* Radial glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 45%, rgba(76,175,80,${glowAlpha}) 0%, transparent 70%)`,
        }}
      />

      {/* Floating particles */}
      {GRASS_PARTICLES.slice(0, 10).map((p, i) => {
        const yOff = (frame * p.speed * 8) % 40;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y - yOff,
              width: p.size,
              height: p.size * 3,
              borderRadius: "50%",
              background: WHITE,
              opacity: p.opacity * logoOpacity,
            }}
          />
        );
      })}

      {/* Content */}
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
        {/* KILEY logo text */}
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 120,
              letterSpacing: 10,
              color: WHITE,
              textShadow: "0 4px 30px rgba(0,0,0,0.3)",
            }}
          >
            KILEY
          </span>
        </div>

        {/* OUTDOOR SERVICES */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            marginBottom: 28,
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 44,
              letterSpacing: 8,
              color: ORANGE,
              textShadow: "0 2px 12px rgba(0,0,0,0.2)",
            }}
          >
            OUTDOOR SERVICES
          </span>
        </div>

        {/* Accent line */}
        <div
          style={{
            width: `${lineWidth}%`,
            maxWidth: 500,
            height: 5,
            background: `linear-gradient(90deg, transparent, ${WHITE}, transparent)`,
            borderRadius: 3,
            marginBottom: 44,
          }}
        />

        {/* Lawn Season is Here */}
        <div
          style={{
            opacity: headOpacity,
            transform: `scale(${headScale})`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 80,
              lineHeight: 1.15,
              color: WHITE,
              textShadow: "0 4px 24px rgba(0,0,0,0.25)",
            }}
          >
            Lawn Season
          </span>
          <br />
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 80,
              lineHeight: 1.15,
              color: WHITE,
              textShadow: "0 4px 24px rgba(0,0,0,0.25)",
            }}
          >
            is Here
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Dead lawn background (BEFORE) ─────────────────────────────────────────

const DeadLawnBg: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle drift for texture
  const drift = frame * 0.15;

  return (
    <AbsoluteFill>
      {/* Base brown */}
      <AbsoluteFill style={{ background: BROWN }} />

      {/* Texture stripes */}
      <AbsoluteFill
        style={{
          backgroundImage: deadGrassPatterns,
          backgroundSize: "60px 60px, 40px 40px",
          backgroundPosition: `${drift}px ${drift * 0.5}px`,
          opacity: 0.7,
        }}
      />

      {/* Random brown patches */}
      {[
        { x: 120, y: 400, w: 300, h: 200, color: BROWN_DARK },
        { x: 600, y: 700, w: 250, h: 180, color: BROWN_LIGHT },
        { x: 80, y: 1100, w: 350, h: 220, color: BROWN_DARK },
        { x: 500, y: 1400, w: 280, h: 160, color: "#7A6548" },
        { x: 300, y: 300, w: 200, h: 250, color: BROWN_LIGHT },
        { x: 700, y: 900, w: 220, h: 200, color: "#6B5740" },
        { x: 150, y: 1600, w: 260, h: 180, color: BROWN_DARK },
        { x: 650, y: 1200, w: 300, h: 190, color: "#9A8466" },
      ].map((patch, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: patch.x,
            top: patch.y,
            width: patch.w,
            height: patch.h,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${patch.color} 0%, transparent 70%)`,
            opacity: 0.6,
          }}
        />
      ))}

      {/* Desaturated overlay */}
      <AbsoluteFill
        style={{
          background: "rgba(139,115,85,0.15)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Dry cracks pattern */}
      {[
        { x1: 200, y1: 600, x2: 400, y2: 650 },
        { x1: 500, y1: 1000, x2: 700, y2: 1020 },
        { x1: 150, y1: 1350, x2: 450, y2: 1380 },
      ].map((crack, i) => (
        <div
          key={`crack-${i}`}
          style={{
            position: "absolute",
            left: crack.x1,
            top: crack.y1,
            width: crack.x2 - crack.x1,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${BROWN_DARK}80, transparent)`,
            transform: `rotate(${(i * 5 - 3)}deg)`,
            opacity: 0.5,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// ─── Lush lawn background (AFTER) ───────────────────────────────────────────

const LushLawnBg: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = frame * 0.12;

  // Shimmer effect
  const shimmerX = interpolate(Math.sin(frame * 0.06), [-1, 1], [0, 100]);
  const shimmerAlpha = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.02, 0.08]);

  return (
    <AbsoluteFill>
      {/* Base green */}
      <AbsoluteFill style={{ background: GREEN_BRIGHT }} />

      {/* Grass texture */}
      <AbsoluteFill
        style={{
          backgroundImage: lushGrassPatterns,
          backgroundSize: "50px 50px, 35px 35px",
          backgroundPosition: `${drift}px ${drift * 0.4}px`,
          opacity: 0.6,
        }}
      />

      {/* Gradient variation patches */}
      {[
        { x: 100, y: 350, w: 350, h: 250, color: GREEN_LIGHT },
        { x: 550, y: 650, w: 300, h: 230, color: "#81C784" },
        { x: 50, y: 1050, w: 400, h: 280, color: GREEN_LIGHT },
        { x: 450, y: 1350, w: 320, h: 200, color: "#A5D6A7" },
        { x: 250, y: 250, w: 280, h: 300, color: "#66BB6A" },
        { x: 680, y: 850, w: 280, h: 240, color: "#81C784" },
        { x: 120, y: 1550, w: 300, h: 220, color: GREEN_LIGHT },
        { x: 600, y: 1150, w: 340, h: 230, color: "#A5D6A7" },
      ].map((patch, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: patch.x,
            top: patch.y,
            width: patch.w,
            height: patch.h,
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${patch.color} 0%, transparent 70%)`,
            opacity: 0.45,
          }}
        />
      ))}

      {/* Sunlight shimmer sweep */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, transparent ${shimmerX - 15}%, rgba(255,255,255,${shimmerAlpha}) ${shimmerX}%, transparent ${shimmerX + 15}%)`,
        }}
      />

      {/* Warm light overlay */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 90% 40% at 50% 25%, rgba(255,255,200,0.06) 0%, transparent 70%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── BEFORE label ───────────────────────────────────────────────────────────

const BeforeLabel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 10, stiffness: 200 },
    durationInFrames: 20,
  });
  const labelScale = interpolate(labelSpring, [0, 1], [0.4, 1]);
  const labelOpacity = interpolate(frame, [6, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle red/warning tint badge
  const badgePulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.85, 1]);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: SAFE_TOP,
        paddingBottom: SAFE_BOTTOM,
      }}
    >
      <div
        style={{
          opacity: labelOpacity,
          transform: `scale(${labelScale * badgePulse})`,
          textAlign: "center",
        }}
      >
        {/* Dark scrim behind text */}
        <div
          style={{
            background: "rgba(0,0,0,0.45)",
            borderRadius: 24,
            paddingLeft: 64,
            paddingRight: 64,
            paddingTop: 28,
            paddingBottom: 28,
            border: "3px solid rgba(255,255,255,0.2)",
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 110,
              letterSpacing: 8,
              color: WHITE,
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            BEFORE
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── AFTER label ────────────────────────────────────────────────────────────

const AfterLabel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 8, stiffness: 220 },
    durationInFrames: 20,
  });
  const labelScale = interpolate(labelSpring, [0, 1], [0.4, 1]);
  const labelOpacity = interpolate(frame, [6, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow pulse
  const glowPulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.4, 0.8]);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: SAFE_TOP,
        paddingBottom: SAFE_BOTTOM,
      }}
    >
      <div
        style={{
          opacity: labelOpacity,
          transform: `scale(${labelScale})`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "rgba(58,125,52,0.6)",
            borderRadius: 24,
            paddingLeft: 64,
            paddingRight: 64,
            paddingTop: 28,
            paddingBottom: 28,
            border: `3px solid rgba(255,255,255,0.35)`,
            boxShadow: `0 0 60px rgba(76,175,80,${glowPulse})`,
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 110,
              letterSpacing: 8,
              color: WHITE,
              textShadow: `0 0 30px rgba(76,175,80,0.6), 0 4px 20px rgba(0,0,0,0.4)`,
            }}
          >
            AFTER
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Wipe transition (left to right reveal) ─────────────────────────────────

const WipeReveal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();

  // Wipe progress: 0 to 1 over 90 frames (3 seconds)
  const progress = interpolate(frame, [0, 90], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        clipPath: `inset(0 ${100 - progress}% 0 0)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ─── Wipe line accent ───────────────────────────────────────────────────────

const WipeLine: React.FC = () => {
  const frame = useCurrentFrame();

  const xPos = interpolate(frame, [0, 90], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const lineOpacity = interpolate(frame, [0, 8, 82, 90], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow intensity
  const glowPulse = interpolate(Math.sin(frame * 0.2), [-1, 1], [0.5, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${xPos}%`,
        top: 0,
        width: 8,
        height: H,
        marginLeft: -4,
        background: `linear-gradient(180deg, ${ORANGE}, ${WHITE}, ${ORANGE})`,
        opacity: lineOpacity,
        boxShadow: `0 0 ${30 * glowPulse}px ${ORANGE}, 0 0 ${60 * glowPulse}px ${ORANGE}50`,
        zIndex: 10,
      }}
    />
  );
};

// ─── Grass clippings burst during wipe ──────────────────────────────────────

const WIPE_CLIPPINGS = Array.from({ length: 35 }, (_, i) => ({
  yBase: 100 + ((i * 137.508) % 1) * 1720,
  speed: 2 + (i % 6) * 1.5,
  size: 3 + (i % 4) * 2,
  yDrift: (i % 2 === 0 ? 1 : -1) * (10 + (i % 5) * 8),
  color: i % 3 === 0 ? GREEN_BRIGHT : i % 3 === 1 ? GREEN_LIGHT : "#81C784",
  delay: (i % 8) * 1.5,
}));

const WipeClippings: React.FC = () => {
  const frame = useCurrentFrame();

  const wipeX = interpolate(frame, [0, 90], [0, W], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <>
      {WIPE_CLIPPINGS.map((c, i) => {
        const localFrame = frame - c.delay;
        if (localFrame < 0) return null;

        const xPos = wipeX + Math.sin(localFrame * 0.3) * 30 + c.speed * localFrame * 0.5;
        const yPos = c.yBase + Math.sin(localFrame * 0.15) * c.yDrift;
        const rot = localFrame * (3 + (i % 4) * 2);
        const opacity = interpolate(localFrame, [0, 5, 70, 85], [0, 0.8, 0.8, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: xPos,
              top: yPos,
              width: c.size,
              height: c.size * 3,
              borderRadius: 2,
              background: c.color,
              opacity,
              transform: `rotate(${rot}deg)`,
              zIndex: 11,
            }}
          />
        );
      })}
    </>
  );
};

// ─── CTA Scene (13-15s, 60 frames) ─────────────────────────────────────────

const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background glow
  const glowAlpha = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.1, 0.25]);

  // "Season starts April 15th" springs in
  const dateSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 190 },
    durationInFrames: 20,
  });
  const dateScale = interpolate(dateSpring, [0, 1], [0.5, 1]);
  const dateOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Divider
  const lineWidth = interpolate(frame, [12, 26], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // "Call 248-747-LAWN" bounces in
  const phoneSpring = spring({
    frame: frame - 16,
    fps,
    config: { damping: 8, stiffness: 220 },
    durationInFrames: 22,
  });
  const phoneScale = interpolate(phoneSpring, [0, 1], [0.3, 1]);
  const phoneOpacity = interpolate(frame, [16, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phonePulse = frame > 30 ? 1 + interpolate(Math.sin((frame - 30) * 0.25), [-1, 1], [0, 0.03]) : 1;

  // "Book Today" sub-CTA
  const bookOpacity = interpolate(frame, [30, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bookY = interpolate(frame, [30, 42], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Green background */}
      <AbsoluteFill style={{ background: GREEN }} />

      {/* Radial glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 45% at 50% 50%, rgba(76,175,80,${glowAlpha}) 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
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
        {/* Season starts April 15th */}
        <div
          style={{
            opacity: dateOpacity,
            transform: `scale(${dateScale})`,
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 64,
              lineHeight: 1.2,
              color: WHITE,
              textShadow: "0 4px 24px rgba(0,0,0,0.3)",
            }}
          >
            Season starts
          </span>
          <br />
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 88,
              lineHeight: 1.2,
              color: ORANGE,
              textShadow: `0 0 30px ${ORANGE}70, 0 4px 16px rgba(0,0,0,0.3)`,
            }}
          >
            April 15th
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: `${lineWidth}%`,
            maxWidth: 500,
            height: 5,
            background: `linear-gradient(90deg, transparent, ${WHITE}CC, transparent)`,
            borderRadius: 3,
            marginTop: 32,
            marginBottom: 40,
          }}
        />

        {/* Call 248-747-LAWN */}
        <div
          style={{
            opacity: phoneOpacity,
            transform: `scale(${phoneScale * phonePulse})`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "rgba(0,0,0,0.2)",
              borderRadius: 20,
              paddingLeft: 48,
              paddingRight: 48,
              paddingTop: 24,
              paddingBottom: 24,
              border: `3px solid ${ORANGE}`,
              boxShadow: `0 0 30px ${ORANGE}40`,
            }}
          >
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 40,
                color: WHITE,
                display: "block",
                marginBottom: 4,
              }}
            >
              Call
            </span>
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 72,
                color: WHITE,
                letterSpacing: 2,
                textShadow: `0 0 20px ${ORANGE}50`,
              }}
            >
              248-747-LAWN
            </span>
          </div>
        </div>

        {/* Book Today */}
        <div
          style={{
            opacity: bookOpacity,
            transform: `translateY(${bookY}px)`,
            marginTop: 36,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 42,
              color: WHITE,
              opacity: 0.85,
            }}
          >
            Book your spot today
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Main Composition ───────────────────────────────────────────────────────

export const KileyOutdoorVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  // Timeline
  const INTRO = 60;          // 0-2s
  const BEFORE_START = 60;   // 2s
  const BEFORE_DUR = 240;    // 2-10s (includes wipe period)
  const WIPE_START = 210;    // 7s
  const WIPE_DUR = 90;       // 7-10s
  const AFTER_START = 210;   // 7s (revealed by wipe)
  const AFTER_DUR = 180;     // 7-13s
  const AFTER_LABEL_START = 300; // 10s (after wipe finishes)
  const AFTER_LABEL_DUR = 90;   // 10-13s
  const CTA_START = 390;     // 13s
  const CTA_DUR = 60;        // 13-15s

  return (
    <AbsoluteFill style={{ background: OFF_BLACK }}>
      {/* Scene 1: Brand intro */}
      <Sequence from={0} durationInFrames={INTRO} premountFor={fps}>
        <IntroScene />
      </Sequence>

      {/* Scene 2: BEFORE lawn (bottom layer) */}
      <Sequence from={BEFORE_START} durationInFrames={BEFORE_DUR} premountFor={fps}>
        <DeadLawnBg />
      </Sequence>

      {/* BEFORE label (visible before wipe starts) */}
      <Sequence from={BEFORE_START} durationInFrames={WIPE_START - BEFORE_START} premountFor={fps}>
        <BeforeLabel />
      </Sequence>

      {/* Scene 3-4: AFTER lawn revealed by wipe (top layer with clip) */}
      <Sequence from={AFTER_START} durationInFrames={AFTER_DUR} premountFor={fps}>
        <WipeReveal>
          <LushLawnBg />
        </WipeReveal>
      </Sequence>

      {/* Wipe accent line */}
      <Sequence from={WIPE_START} durationInFrames={WIPE_DUR} premountFor={fps}>
        <WipeLine />
        <WipeClippings />
      </Sequence>

      {/* Wipe swoosh sound */}
      <Sequence from={WIPE_START} durationInFrames={WIPE_DUR} premountFor={fps}>
        <Audio src={staticFile("swoosh.wav")} volume={0.7} />
      </Sequence>

      {/* AFTER label (appears after wipe finishes) */}
      <Sequence from={AFTER_LABEL_START} durationInFrames={AFTER_LABEL_DUR} premountFor={fps}>
        <AfterLabel />
      </Sequence>

      {/* Scene 5: CTA */}
      <Sequence from={CTA_START} durationInFrames={CTA_DUR} premountFor={fps}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
