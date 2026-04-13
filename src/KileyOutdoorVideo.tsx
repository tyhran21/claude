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

// ─── Constants ──────────────────────────────────────────────────────────────

const SAFE_X = 64;
const SAFE_TOP = 260;
const SAFE_BOTTOM = 380;

// Kiley Outdoor Services palette
const GREEN = "#3A7D34";
const ORANGE = "#F5821F";
const WHITE = "#FFFFFF";
const OFF_BLACK = "#1C1C1C";

const BOLD = "'Liberation Sans', 'DejaVu Sans', system-ui, sans-serif";
const REGULAR = "'Liberation Sans', 'DejaVu Sans', system-ui, sans-serif";

// ─── Grass blade particles ──────────────────────────────────────────────────

const GRASS_PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  x: ((i * 137.508) % 1) * 1080,
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

// ─── Scene 1: Brand Intro ───────────────────────────────────────────────────

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
  const exitOpacity = interpolate(frame, [78, 88], [1, 0], {
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
      {GRASS_PARTICLES.map((p, i) => {
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

  const exitOpacity = interpolate(frame, [78, 88], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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

  const exitOpacity = interpolate(frame, [78, 88], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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

// ─── Date scene: Season Starts April 15th ───────────────────────────────────

const DateScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Season Starts" bouncy entrance
  const startsSpring = spring({ frame: frame - 2, fps, config: { damping: 5, stiffness: 200, mass: 0.8 }, durationInFrames: 24 });
  const startsScale = interpolate(startsSpring, [0, 1], [0.3, 1]);
  const startsOpacity = interpolate(frame, [2, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "April 15th" big bouncy pop
  const dateSpring = spring({ frame: frame - 12, fps, config: { damping: 4, stiffness: 230, mass: 0.9 }, durationInFrames: 28 });
  const dateScale = interpolate(dateSpring, [0, 1], [0.15, 1]);
  const dateOpacity = interpolate(frame, [12, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const exitOpacity = interpolate(frame, [78, 88], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
        <div style={{ opacity: startsOpacity, transform: `scale(${startsScale})`, textAlign: "center", marginBottom: 12 }}>
          <span style={{ fontFamily: REGULAR, fontWeight: 400, fontSize: 52, color: WHITE, opacity: 0.85 }}>
            Season Starts
          </span>
        </div>
        <div style={{ opacity: dateOpacity, transform: `scale(${dateScale})`, textAlign: "center" }}>
          <span style={{ fontFamily: BOLD, fontWeight: 900, fontSize: 130, lineHeight: 1, color: WHITE, textShadow: "0 0 40px rgba(255,255,255,0.2), 0 4px 20px rgba(0,0,0,0.2)" }}>
            April 15<span style={{ fontSize: 80, verticalAlign: "super" }}>th</span>
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

  const bookSpring = spring({ frame: frame - 20, fps, config: { damping: 5, stiffness: 200, mass: 0.8 }, durationInFrames: 24 });
  const bookScale = interpolate(bookSpring, [0, 1], [0.4, 1]);
  const bookY = interpolate(bookSpring, [0, 1], [15, 0]);
  const bookOpacity = interpolate(frame, [20, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
        <div style={{ width: 80, height: 4, background: ORANGE, borderRadius: 2, marginBottom: 28, opacity: bookOpacity }} />
        <div style={{ opacity: bookOpacity, transform: `scale(${bookScale}) translateY(${bookY}px)`, textAlign: "center" }}>
          <span style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 48, color: WHITE, letterSpacing: 1 }}>Book Your Spot Today</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Main Composition ───────────────────────────────────────────────────────

// Timeline (450 frames = 15s at 30fps):
// 0-90:    Brand intro (3s)
// 90-180:  Services - Mowing. Cleanup. Curb Appeal. (3s)
// 180-270: Location - Serving Southern Oakland County (3s)
// 270-360: Date - Season Starts April 15th (3s)
// 360-450: CTA - Call 248-747-LAWN / Book Your Spot Today (3s)

export const KileyOutdoorVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: OFF_BLACK }}>
      {/* Scene 1: Brand intro */}
      <Sequence from={0} durationInFrames={90}>
        <BrandIntro />
      </Sequence>

      {/* Flash: Intro → Services */}
      <Sequence from={88} durationInFrames={5}>
        <FlashTransition />
      </Sequence>

      {/* Scene 2: Services */}
      <Sequence from={90} durationInFrames={90}>
        <ServicesScene />
      </Sequence>

      {/* Flash: Services → Location */}
      <Sequence from={178} durationInFrames={5}>
        <FlashTransition />
      </Sequence>

      {/* Scene 3: Location */}
      <Sequence from={180} durationInFrames={90}>
        <LocationScene />
      </Sequence>

      {/* Flash: Location → Date */}
      <Sequence from={268} durationInFrames={5}>
        <FlashTransition />
      </Sequence>

      {/* Scene 4: Season Starts April 15th */}
      <Sequence from={270} durationInFrames={90}>
        <DateScene />
      </Sequence>

      {/* Flash: Date → CTA */}
      <Sequence from={358} durationInFrames={5}>
        <FlashTransition />
      </Sequence>

      {/* Scene 5: CTA */}
      <Sequence from={360} durationInFrames={90}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
