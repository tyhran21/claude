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
const GREEN_BRIGHT = "#4CAF50";
const GREEN_LIGHT = "#66BB6A";
const ORANGE = "#F5821F";
const WHITE = "#FFFFFF";
const BROWN = "#8B7355";
const BROWN_LIGHT = "#A08B6E";
const BROWN_DARK = "#6B5740";
const OFF_BLACK = "#1C1C1C";

const BOLD = "'Liberation Sans', 'DejaVu Sans', system-ui, sans-serif";
const REGULAR = "'Liberation Sans', 'DejaVu Sans', system-ui, sans-serif";

// ─── Grass texture helpers ──────────────────────────────────────────────────

const deadGrassPatterns = [
  "linear-gradient(165deg, #8B7355 25%, #7A6548 25%, #7A6548 50%, #8B7355 50%, #8B7355 75%, #7A6548 75%)",
  "linear-gradient(45deg, rgba(107,87,64,0.5) 25%, transparent 25%, transparent 75%, rgba(107,87,64,0.5) 75%)",
].join(",");

const lushGrassPatterns = [
  "linear-gradient(165deg, #4CAF50 25%, #43A047 25%, #43A047 50%, #4CAF50 50%, #4CAF50 75%, #43A047 75%)",
  "linear-gradient(45deg, rgba(56,142,60,0.5) 25%, transparent 25%, transparent 75%, rgba(56,142,60,0.5) 75%)",
].join(",");

// ─── Grass blade particles ──────────────────────────────────────────────────

const GRASS_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x: ((i * 137.508) % 1) * W,
  y: 400 + ((i * 97.317) % 1) * 1100,
  size: 2 + (i % 3) * 1.5,
  speed: 0.08 + (i % 5) * 0.04,
  opacity: 0.15 + (i % 4) * 0.08,
}));

// ─── White flash transition ─────────────────────────────────────────────────

const FlashTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 2, 4], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ background: WHITE, opacity }} />;
};

// ─── Scene 1: Brand Intro (0-50 frames) ─────────────────────────────────────

const BrandIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glowAlpha = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.15, 0.35]);

  // "KILEY" bouncy pop
  const kileySpring = spring({
    frame,
    fps,
    config: { damping: 5, stiffness: 180, mass: 0.9 },
    durationInFrames: 28,
  });
  const kileyScale = interpolate(kileySpring, [0, 1], [0.2, 1]);
  const kileyOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "OUTDOOR SERVICES" bouncy pop + slide
  const subSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 5, stiffness: 200, mass: 0.8 },
    durationInFrames: 26,
  });
  const subScale = interpolate(subSpring, [0, 1], [0.3, 1]);
  const subY = interpolate(subSpring, [0, 1], [25, 0]);
  const subOpacity = interpolate(frame, [10, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Accent line swoosh
  const lineWidth = interpolate(frame, [18, 32], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // "Lawn Season is Here" bouncy pop
  const headSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 5, stiffness: 190, mass: 0.8 },
    durationInFrames: 26,
  });
  const headScale = interpolate(headSpring, [0, 1], [0.3, 1]);
  const headOpacity = interpolate(frame, [20, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit
  const exitOpacity = interpolate(frame, [42, 50], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      <AbsoluteFill style={{ background: GREEN }} />
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
              opacity: p.opacity * kileyOpacity,
            }}
          />
        );
      })}

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
        {/* KILEY */}
        <div style={{ opacity: kileyOpacity, transform: `scale(${kileyScale})`, marginBottom: 8 }}>
          <span
            style={{
              fontFamily: BOLD,
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
        <div style={{ opacity: subOpacity, transform: `scale(${subScale}) translateY(${subY}px)`, marginBottom: 28 }}>
          <span
            style={{
              fontFamily: BOLD,
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
            marginBottom: 36,
          }}
        />

        {/* Lawn Season is Here */}
        <div style={{ opacity: headOpacity, transform: `scale(${headScale})`, textAlign: "center" }}>
          <span
            style={{
              fontFamily: BOLD,
              fontWeight: 900,
              fontSize: 76,
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
              fontFamily: BOLD,
              fontWeight: 900,
              fontSize: 76,
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

// ─── Dead lawn background ───────────────────────────────────────────────────

const DeadLawnBg: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = frame * 0.15;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: BROWN }} />
      <AbsoluteFill
        style={{
          backgroundImage: deadGrassPatterns,
          backgroundSize: "60px 60px, 40px 40px",
          backgroundPosition: `${drift}px ${drift * 0.5}px`,
          opacity: 0.7,
        }}
      />
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
      <AbsoluteFill style={{ background: "rgba(139,115,85,0.15)", mixBlendMode: "multiply" }} />
      {[
        { x1: 200, y1: 600, x2: 400 },
        { x1: 500, y1: 1000, x2: 700 },
        { x1: 150, y1: 1350, x2: 450 },
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
            transform: `rotate(${i * 5 - 3}deg)`,
            opacity: 0.5,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// ─── Lush lawn background ───────────────────────────────────────────────────

const LushLawnBg: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = frame * 0.12;
  const shimmerX = interpolate(Math.sin(frame * 0.06), [-1, 1], [0, 100]);
  const shimmerAlpha = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.02, 0.08]);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: GREEN_BRIGHT }} />
      <AbsoluteFill
        style={{
          backgroundImage: lushGrassPatterns,
          backgroundSize: "50px 50px, 35px 35px",
          backgroundPosition: `${drift}px ${drift * 0.4}px`,
          opacity: 0.6,
        }}
      />
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
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, transparent ${shimmerX - 15}%, rgba(255,255,255,${shimmerAlpha}) ${shimmerX}%, transparent ${shimmerX + 15}%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 90% 40% at 50% 25%, rgba(255,255,200,0.06) 0%, transparent 70%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Wipe reveal (left to right clip) ───────────────────────────────────────

const WipeReveal: React.FC<{ children: React.ReactNode; dur: number }> = ({ children, dur }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, dur], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}>
      {children}
    </AbsoluteFill>
  );
};

// ─── Wipe line accent ───────────────────────────────────────────────────────

const WipeLine: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const xPos = interpolate(frame, [0, dur], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const lineOpacity = interpolate(frame, [0, 6, dur - 6, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
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

// ─── Grass clippings burst ──────────────────────────────────────────────────

const WIPE_CLIPPINGS = Array.from({ length: 35 }, (_, i) => ({
  yBase: 100 + ((i * 137.508) % 1) * 1720,
  speed: 2 + (i % 6) * 1.5,
  size: 3 + (i % 4) * 2,
  yDrift: (i % 2 === 0 ? 1 : -1) * (10 + (i % 5) * 8),
  color: i % 3 === 0 ? GREEN_BRIGHT : i % 3 === 1 ? GREEN_LIGHT : "#81C784",
  delay: (i % 8) * 1.5,
}));

const WipeClippings: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const wipeX = interpolate(frame, [0, dur], [0, W], {
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
        const opacity = interpolate(localFrame, [0, 5, dur - 15, dur], [0, 0.8, 0.8, 0], {
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

// ─── Services scene: Mowing. Cleanup. Curb Appeal. ──────────────────────────

const ServicesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const w1Spring = spring({ frame: frame - 8, fps, config: { damping: 5, stiffness: 200, mass: 0.8 }, durationInFrames: 24 });
  const w1Scale = interpolate(w1Spring, [0, 1], [0.3, 1]);
  const w1X = interpolate(w1Spring, [0, 1], [-60, 0]);
  const w1Opacity = interpolate(frame, [8, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const w2Spring = spring({ frame: frame - 20, fps, config: { damping: 5, stiffness: 200, mass: 0.8 }, durationInFrames: 24 });
  const w2Scale = interpolate(w2Spring, [0, 1], [0.3, 1]);
  const w2X = interpolate(w2Spring, [0, 1], [-60, 0]);
  const w2Opacity = interpolate(frame, [20, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const w3Spring = spring({ frame: frame - 32, fps, config: { damping: 5, stiffness: 200, mass: 0.8 }, durationInFrames: 24 });
  const w3Scale = interpolate(w3Spring, [0, 1], [0.3, 1]);
  const w3X = interpolate(w3Spring, [0, 1], [-60, 0]);
  const w3Opacity = interpolate(frame, [32, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const exitOpacity = interpolate(frame, [62, 70], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: GREEN, opacity: exitOpacity }}>
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
          gap: 20,
        }}
      >
        <div style={{ opacity: w1Opacity, transform: `translateX(${w1X}px) scale(${w1Scale})` }}>
          <span style={{ fontFamily: BOLD, fontWeight: 900, fontSize: 88, color: WHITE }}>Mowing.</span>
        </div>
        <div style={{ opacity: w2Opacity, transform: `translateX(${w2X}px) scale(${w2Scale})` }}>
          <span style={{ fontFamily: BOLD, fontWeight: 900, fontSize: 88, color: WHITE }}>Cleanup.</span>
        </div>
        <div style={{ opacity: w3Opacity, transform: `translateX(${w3X}px) scale(${w3Scale})` }}>
          <span style={{ fontFamily: BOLD, fontWeight: 900, fontSize: 88, color: WHITE }}>Curb Appeal.</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Location scene: Serving Southern Oakland County ────────────────────────

const LocationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pin drops from above with heavy bounce
  const pinSpring = spring({ frame: frame - 2, fps, config: { damping: 3.5, stiffness: 120, mass: 1.2 }, durationInFrames: 40 });
  const pinY = interpolate(pinSpring, [0, 1], [-500, 0]);
  const pinOpacity = interpolate(frame, [2, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pinVelocity = frame > 2 ? (pinY - interpolate(
    spring({ frame: frame - 3, fps, config: { damping: 3.5, stiffness: 120, mass: 1.2 }, durationInFrames: 40 }),
    [0, 1], [-500, 0]
  )) : 0;
  const squashX = 1 + Math.min(Math.abs(pinVelocity) * 0.003, 0.25);
  const squashY = 1 / squashX;

  const servingSpring = spring({ frame: frame - 14, fps, config: { damping: 5, stiffness: 200, mass: 0.8 }, durationInFrames: 24 });
  const servingScale = interpolate(servingSpring, [0, 1], [0.3, 1]);
  const servingOpacity = interpolate(frame, [14, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const countySpring = spring({ frame: frame - 20, fps, config: { damping: 4.5, stiffness: 210, mass: 0.9 }, durationInFrames: 26 });
  const countyScale = interpolate(countySpring, [0, 1], [0.3, 1]);
  const countyOpacity = interpolate(frame, [20, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const exitOpacity = interpolate(frame, [52, 60], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: GREEN, opacity: exitOpacity }}>
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
        <div style={{ opacity: pinOpacity, transform: `translateY(${pinY}px) scaleX(${squashX}) scaleY(${squashY})`, marginBottom: 28 }}>
          <svg width="72" height="96" viewBox="0 0 24 32" fill="none">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20C24 5.373 18.627 0 12 0z" fill={ORANGE} />
            <circle cx="12" cy="12" r="5" fill={WHITE} />
          </svg>
        </div>
        <div style={{ opacity: servingOpacity, transform: `scale(${servingScale})`, textAlign: "center", marginBottom: 4 }}>
          <span style={{ fontFamily: REGULAR, fontWeight: 400, fontSize: 52, color: WHITE, opacity: 0.85 }}>Serving</span>
        </div>
        <div style={{ opacity: countyOpacity, transform: `scale(${countyScale})`, textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: BOLD, fontWeight: 900, fontSize: 74, lineHeight: 1.15, color: WHITE, textShadow: "0 3px 20px rgba(0,0,0,0.15)" }}>
            Southern<br />Oakland County
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Date scene: April 15th ─────────────────────────────────────────────────

const DateScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dateSpring = spring({ frame: frame - 2, fps, config: { damping: 4, stiffness: 230, mass: 0.9 }, durationInFrames: 28 });
  const dateScale = interpolate(dateSpring, [0, 1], [0.15, 1]);
  const dateOpacity = interpolate(frame, [2, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const subSpring = spring({ frame: frame - 18, fps, config: { damping: 5, stiffness: 200, mass: 0.8 }, durationInFrames: 24 });
  const subScale = interpolate(subSpring, [0, 1], [0.4, 1]);
  const subY = interpolate(subSpring, [0, 1], [15, 0]);
  const subOpacity = interpolate(frame, [18, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const exitOpacity = interpolate(frame, [42, 50], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: GREEN, opacity: exitOpacity }}>
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
        <div style={{ opacity: dateOpacity, transform: `scale(${dateScale})`, textAlign: "center", marginBottom: 28 }}>
          <span style={{ fontFamily: BOLD, fontWeight: 900, fontSize: 130, lineHeight: 1, color: WHITE, textShadow: "0 0 40px rgba(255,255,255,0.2), 0 4px 20px rgba(0,0,0,0.2)" }}>
            April 15<span style={{ fontSize: 80, verticalAlign: "super" }}>th</span>
          </span>
        </div>
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: ORANGE, marginBottom: 28, opacity: subOpacity, boxShadow: `0 0 16px ${ORANGE}80` }} />
        <div style={{ opacity: subOpacity, transform: `scale(${subScale}) translateY(${subY}px)`, textAlign: "center" }}>
          <span style={{ fontFamily: REGULAR, fontWeight: 400, fontSize: 44, color: WHITE, opacity: 0.85 }}>
            We're already booking up
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── CTA scene ──────────────────────────────────────────────────────────────

const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const callSpring = spring({ frame: frame - 2, fps, config: { damping: 5, stiffness: 210, mass: 0.8 }, durationInFrames: 24 });
  const callScale = interpolate(callSpring, [0, 1], [0.2, 1]);
  const callOpacity = interpolate(frame, [2, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const phoneSpring = spring({ frame: frame - 8, fps, config: { damping: 4.5, stiffness: 240, mass: 0.9 }, durationInFrames: 26 });
  const phoneScale = interpolate(phoneSpring, [0, 1], [0.15, 1]);
  const phoneOpacity = interpolate(frame, [8, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const pulse1 = spring({ frame: frame - 26, fps, config: { damping: 6, stiffness: 300, mass: 0.6 }, durationInFrames: 12 });
  const pulse1Scale = frame >= 26 ? interpolate(pulse1, [0, 0.5, 1], [0, 0.12, 0]) : 0;
  const pulse2 = spring({ frame: frame - 36, fps, config: { damping: 6, stiffness: 300, mass: 0.6 }, durationInFrames: 12 });
  const pulse2Scale = frame >= 36 ? interpolate(pulse2, [0, 0.5, 1], [0, 0.08, 0]) : 0;
  const totalPhoneScale = phoneScale * (1 + pulse1Scale + pulse2Scale);

  const webSpring = spring({ frame: frame - 20, fps, config: { damping: 5, stiffness: 200, mass: 0.8 }, durationInFrames: 24 });
  const webScale = interpolate(webSpring, [0, 1], [0.4, 1]);
  const webY = interpolate(webSpring, [0, 1], [15, 0]);
  const webOpacity = interpolate(frame, [20, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const barWidth = interpolate(frame, [0, 18], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ background: GREEN }}>
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: "50%",
          width: `${barWidth}%`,
          maxWidth: 600,
          height: 5,
          background: ORANGE,
          transform: "translateX(-50%)",
          borderRadius: 3,
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
        <div style={{ opacity: callOpacity, transform: `scale(${callScale})`, marginBottom: 8 }}>
          <span style={{ fontFamily: BOLD, fontWeight: 900, fontSize: 76, color: WHITE, letterSpacing: 2, textShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>Call</span>
        </div>
        <div style={{ opacity: phoneOpacity, transform: `scale(${totalPhoneScale})`, marginBottom: 32, paddingLeft: 20, paddingRight: 20 }}>
          <span style={{ fontFamily: BOLD, fontWeight: 900, fontSize: 76, color: WHITE, letterSpacing: 2, textShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>248-747-LAWN</span>
        </div>
        <div style={{ width: 80, height: 4, background: ORANGE, borderRadius: 2, marginBottom: 28, opacity: webOpacity }} />
        <div style={{ opacity: webOpacity, transform: `scale(${webScale}) translateY(${webY}px)` }}>
          <span style={{ fontFamily: REGULAR, fontWeight: 400, fontSize: 36, color: WHITE, opacity: 0.8, letterSpacing: 1 }}>kileyoutdoorservices.com</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Main Composition ───────────────────────────────────────────────────────

// Timeline:
// 0-50:     Brand intro (1.7s)
// 50-200:   Dead lawn bg (bottom layer through wipe)
// 140-210:  Lush lawn revealed by wipe (top layer)
// 140-200:  Wipe line + clippings (2s)
// 215-285:  Services scene (2.3s)
// 290-350:  Location scene (2s)
// 355-405:  Date scene (1.7s)
// 405-450:  CTA scene (1.5s)

const WIPE_DUR = 60;

export const KileyOutdoorVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: OFF_BLACK }}>
      {/* Scene 1: Brand intro */}
      <Sequence from={0} durationInFrames={50}>
        <BrandIntro />
      </Sequence>

      {/* Flash: Intro → Lawn */}
      <Sequence from={48} durationInFrames={5}>
        <FlashTransition />
      </Sequence>

      {/* Dead lawn background (bottom layer, visible during wipe) */}
      <Sequence from={50} durationInFrames={160}>
        <DeadLawnBg />
      </Sequence>

      {/* Lush lawn revealed by wipe (top layer with clip) */}
      <Sequence from={140} durationInFrames={70}>
        <WipeReveal dur={WIPE_DUR}>
          <LushLawnBg />
        </WipeReveal>
      </Sequence>

      {/* Wipe accent line + grass clippings */}
      <Sequence from={140} durationInFrames={WIPE_DUR}>
        <WipeLine dur={WIPE_DUR} />
        <WipeClippings dur={WIPE_DUR} />
      </Sequence>

      {/* Wipe swoosh sound */}
      <Sequence from={140} durationInFrames={WIPE_DUR}>
        <Audio src={staticFile("swoosh.wav")} volume={0.7} />
      </Sequence>

      {/* Flash: Lawn → Services */}
      <Sequence from={213} durationInFrames={5}>
        <FlashTransition />
      </Sequence>

      {/* Services: Mowing. Cleanup. Curb Appeal. */}
      <Sequence from={215} durationInFrames={70}>
        <ServicesScene />
      </Sequence>

      {/* Flash: Services → Location */}
      <Sequence from={283} durationInFrames={5}>
        <FlashTransition />
      </Sequence>

      {/* Location: Serving Southern Oakland County */}
      <Sequence from={285} durationInFrames={65}>
        <LocationScene />
      </Sequence>

      {/* Flash: Location → Date */}
      <Sequence from={348} durationInFrames={5}>
        <FlashTransition />
      </Sequence>

      {/* Date: April 15th */}
      <Sequence from={350} durationInFrames={55}>
        <DateScene />
      </Sequence>

      {/* Flash: Date → CTA */}
      <Sequence from={403} durationInFrames={5}>
        <FlashTransition />
      </Sequence>

      {/* CTA */}
      <Sequence from={405} durationInFrames={45}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
