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

// Fonts — Liberation Sans is metrically equivalent to Roboto on this system
const BOLD = "'Liberation Sans', 'DejaVu Sans', system-ui, sans-serif";
const REGULAR = "'Liberation Sans', 'DejaVu Sans', system-ui, sans-serif";

// ─── White flash transition ─────────────────────────────────────────────────

const FlashTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 2, 4], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ background: WHITE, opacity }} />;
};

// ─── Scene 1: Brand Intro (0-2s / 0-60 frames) ─────────────────────────────

const BrandIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "KILEY" bouncy pop — low damping for overshoot
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

  // "Outdoor Services" bouncy scale pop + slide up
  const subSpring = spring({
    frame: frame - 14,
    fps,
    config: { damping: 5, stiffness: 200, mass: 0.8 },
    durationInFrames: 26,
  });
  const subScale = interpolate(subSpring, [0, 1], [0.3, 1]);
  const subY = interpolate(subSpring, [0, 1], [30, 0]);
  const subOpacity = interpolate(frame, [14, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle accent line
  const lineWidth = interpolate(frame, [26, 42], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Exit
  const exitOpacity = interpolate(frame, [50, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
        {/* KILEY wordmark */}
        <div
          style={{
            opacity: kileyOpacity,
            transform: `scale(${kileyScale})`,
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontFamily: BOLD,
              fontWeight: 900,
              fontSize: 130,
              letterSpacing: 12,
              color: WHITE,
              textShadow: "0 4px 30px rgba(0,0,0,0.2)",
            }}
          >
            KILEY
          </span>
        </div>

        {/* Outdoor Services */}
        <div
          style={{
            opacity: subOpacity,
            transform: `scale(${subScale}) translateY(${subY}px)`,
            marginBottom: 24,
          }}
        >
          <span
            style={{
              fontFamily: BOLD,
              fontWeight: 700,
              fontSize: 48,
              letterSpacing: 6,
              color: WHITE,
            }}
          >
            Outdoor Services
          </span>
        </div>

        {/* Accent underline */}
        <div
          style={{
            width: `${lineWidth}%`,
            maxWidth: 320,
            height: 5,
            background: ORANGE,
            borderRadius: 3,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Lawn Season STARTS NOW (2-5s / 60-150 frames) ────────────────

const HeadlineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Lawn Season" bouncy scale pop
  const line1Spring = spring({
    frame: frame - 4,
    fps,
    config: { damping: 4.5, stiffness: 220, mass: 0.8 },
    durationInFrames: 26,
  });
  const line1Scale = interpolate(line1Spring, [0, 1], [0.2, 1]);
  const line1Opacity = interpolate(frame, [4, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "STARTS NOW" bigger bouncy slam
  const line2Spring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 4, stiffness: 260, mass: 1 },
    durationInFrames: 28,
  });
  const line2Scale = interpolate(line2Spring, [0, 1], [0.15, 1]);
  const line2Opacity = interpolate(frame, [18, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit
  const exitOpacity = interpolate(frame, [80, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
        {/* Lawn Season */}
        <div
          style={{
            opacity: line1Opacity,
            transform: `scale(${line1Scale})`,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: BOLD,
              fontWeight: 900,
              fontSize: 92,
              color: WHITE,
              textShadow: "0 3px 20px rgba(0,0,0,0.15)",
            }}
          >
            Lawn Season
          </span>
        </div>

        {/* STARTS NOW */}
        <div
          style={{
            opacity: line2Opacity,
            transform: `scale(${line2Scale})`,
          }}
        >
          <span
            style={{
              fontFamily: BOLD,
              fontWeight: 900,
              fontSize: 120,
              letterSpacing: 4,
              color: WHITE,
              textShadow: "0 3px 20px rgba(0,0,0,0.15)",
            }}
          >
            STARTS NOW
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Services (5-8s / 150-240 frames) ─────────────────────────────

const ServicesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Mowing." bouncy slide + scale
  const w1Spring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 5, stiffness: 200, mass: 0.8 },
    durationInFrames: 24,
  });
  const w1Scale = interpolate(w1Spring, [0, 1], [0.3, 1]);
  const w1X = interpolate(w1Spring, [0, 1], [-60, 0]);
  const w1Opacity = interpolate(frame, [10, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Cleanup." bouncy slide + scale
  const w2Spring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 5, stiffness: 200, mass: 0.8 },
    durationInFrames: 24,
  });
  const w2Scale = interpolate(w2Spring, [0, 1], [0.3, 1]);
  const w2X = interpolate(w2Spring, [0, 1], [-60, 0]);
  const w2Opacity = interpolate(frame, [22, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Curb Appeal." bouncy slide + scale
  const w3Spring = spring({
    frame: frame - 34,
    fps,
    config: { damping: 5, stiffness: 200, mass: 0.8 },
    durationInFrames: 24,
  });
  const w3Scale = interpolate(w3Spring, [0, 1], [0.3, 1]);
  const w3X = interpolate(w3Spring, [0, 1], [-60, 0]);
  const w3Opacity = interpolate(frame, [34, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit
  const exitOpacity = interpolate(frame, [80, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
        {/* Mowing */}
        <div
          style={{
            opacity: w1Opacity,
            transform: `translateX(${w1X}px) scale(${w1Scale})`,
          }}
        >
          <span
            style={{
              fontFamily: BOLD,
              fontWeight: 900,
              fontSize: 88,
              color: WHITE,
            }}
          >
            Mowing.
          </span>
        </div>

        {/* Cleanup */}
        <div
          style={{
            opacity: w2Opacity,
            transform: `translateX(${w2X}px) scale(${w2Scale})`,
          }}
        >
          <span
            style={{
              fontFamily: BOLD,
              fontWeight: 900,
              fontSize: 88,
              color: WHITE,
            }}
          >
            Cleanup.
          </span>
        </div>

        {/* Curb Appeal */}
        <div
          style={{
            opacity: w3Opacity,
            transform: `translateX(${w3X}px) scale(${w3Scale})`,
          }}
        >
          <span
            style={{
              fontFamily: BOLD,
              fontWeight: 900,
              fontSize: 88,
              color: WHITE,
            }}
          >
            Curb Appeal.
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Serving Southern Oakland County (8-11s / 240-330 frames) ──────

const LocationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pin drops from way above with heavy bounce
  const pinSpring = spring({
    frame: frame - 2,
    fps,
    config: { damping: 3.5, stiffness: 120, mass: 1.2 },
    durationInFrames: 40,
  });
  const pinY = interpolate(pinSpring, [0, 1], [-500, 0]);
  const pinOpacity = interpolate(frame, [2, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Squash/stretch on bounce: when moving down, stretch vertically; at rest, normal
  const pinVelocity = frame > 2 ? (pinY - interpolate(
    spring({ frame: frame - 3, fps, config: { damping: 3.5, stiffness: 120, mass: 1.2 }, durationInFrames: 40 }),
    [0, 1], [-500, 0]
  )) : 0;
  const squashX = 1 + Math.min(Math.abs(pinVelocity) * 0.003, 0.25);
  const squashY = 1 / squashX;

  // "Serving" bouncy scale pop
  const servingSpring = spring({
    frame: frame - 14,
    fps,
    config: { damping: 5, stiffness: 200, mass: 0.8 },
    durationInFrames: 24,
  });
  const servingScale = interpolate(servingSpring, [0, 1], [0.3, 1]);
  const servingOpacity = interpolate(frame, [14, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Southern Oakland County" bouncy scale pop
  const countySpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 4.5, stiffness: 210, mass: 0.9 },
    durationInFrames: 26,
  });
  const countyScale = interpolate(countySpring, [0, 1], [0.3, 1]);
  const countyOpacity = interpolate(frame, [20, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit
  const exitOpacity = interpolate(frame, [80, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
        {/* Location pin — drops + bounces */}
        <div
          style={{
            opacity: pinOpacity,
            transform: `translateY(${pinY}px) scaleX(${squashX}) scaleY(${squashY})`,
            marginBottom: 28,
          }}
        >
          <svg width="72" height="96" viewBox="0 0 24 32" fill="none">
            <path
              d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20C24 5.373 18.627 0 12 0z"
              fill={ORANGE}
            />
            <circle cx="12" cy="12" r="5" fill={WHITE} />
          </svg>
        </div>

        {/* Serving */}
        <div
          style={{
            opacity: servingOpacity,
            transform: `scale(${servingScale})`,
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontFamily: REGULAR,
              fontWeight: 400,
              fontSize: 52,
              color: WHITE,
              opacity: 0.85,
            }}
          >
            Serving
          </span>
        </div>

        {/* Southern Oakland County */}
        <div
          style={{
            opacity: countyOpacity,
            transform: `scale(${countyScale})`,
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontFamily: BOLD,
              fontWeight: 900,
              fontSize: 74,
              lineHeight: 1.15,
              color: WHITE,
              textShadow: "0 3px 20px rgba(0,0,0,0.15)",
            }}
          >
            Southern
            <br />
            Oakland County
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 5: Date callout (11-13s / 330-390 frames) ────────────────────────

const DateScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "April 15th" bouncy scale pop
  const dateSpring = spring({
    frame: frame - 2,
    fps,
    config: { damping: 4, stiffness: 230, mass: 0.9 },
    durationInFrames: 28,
  });
  const dateScale = interpolate(dateSpring, [0, 1], [0.15, 1]);
  const dateOpacity = interpolate(frame, [2, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "We're already booking up" bouncy pop
  const subSpring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 5, stiffness: 200, mass: 0.8 },
    durationInFrames: 24,
  });
  const subScale = interpolate(subSpring, [0, 1], [0.4, 1]);
  const subY = interpolate(subSpring, [0, 1], [15, 0]);
  const subOpacity = interpolate(frame, [22, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit
  const exitOpacity = interpolate(frame, [52, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
        {/* April 15th */}
        <div
          style={{
            opacity: dateOpacity,
            transform: `scale(${dateScale})`,
            textAlign: "center",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              fontFamily: BOLD,
              fontWeight: 900,
              fontSize: 130,
              lineHeight: 1,
              color: WHITE,
              textShadow: "0 0 40px rgba(255,255,255,0.2), 0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            April 15
            <span style={{ fontSize: 80, verticalAlign: "super" }}>th</span>
          </span>
        </div>

        {/* Orange accent dot */}
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: ORANGE,
            marginBottom: 28,
            opacity: subOpacity,
            boxShadow: `0 0 16px ${ORANGE}80`,
          }}
        />

        {/* We're already booking up */}
        <div
          style={{
            opacity: subOpacity,
            transform: `scale(${subScale}) translateY(${subY}px)`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: REGULAR,
              fontWeight: 400,
              fontSize: 44,
              color: WHITE,
              opacity: 0.85,
            }}
          >
            We're already booking up
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 6: CTA (13-15s / 390-450 frames) ────────────────────────────────

const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Call" bouncy pop
  const callSpring = spring({
    frame: frame - 2,
    fps,
    config: { damping: 5, stiffness: 210, mass: 0.8 },
    durationInFrames: 24,
  });
  const callScale = interpolate(callSpring, [0, 1], [0.2, 1]);
  const callOpacity = interpolate(frame, [2, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phone number bouncy pop
  const phoneSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 4.5, stiffness: 240, mass: 0.9 },
    durationInFrames: 26,
  });
  const phoneScale = interpolate(phoneSpring, [0, 1], [0.15, 1]);
  const phoneOpacity = interpolate(frame, [8, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Two distinct pulses after phone appears (at frame 28 and 38)
  const pulse1 = spring({
    frame: frame - 28,
    fps,
    config: { damping: 6, stiffness: 300, mass: 0.6 },
    durationInFrames: 12,
  });
  const pulse1Scale = frame >= 28 ? 1 + interpolate(pulse1, [0, 0.5, 1], [0, 0.12, 0]) : 0;

  const pulse2 = spring({
    frame: frame - 38,
    fps,
    config: { damping: 6, stiffness: 300, mass: 0.6 },
    durationInFrames: 12,
  });
  const pulse2Scale = frame >= 38 ? interpolate(pulse2, [0, 0.5, 1], [0, 0.08, 0]) : 0;

  const totalPhoneScale = phoneScale * (1 + pulse1Scale + pulse2Scale);

  // Website bouncy pop
  const webSpring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 5, stiffness: 200, mass: 0.8 },
    durationInFrames: 24,
  });
  const webScale = interpolate(webSpring, [0, 1], [0.4, 1]);
  const webY = interpolate(webSpring, [0, 1], [15, 0]);
  const webOpacity = interpolate(frame, [22, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Orange bottom accent line grows in
  const barWidth = interpolate(frame, [0, 18], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ background: GREEN }}>
      {/* Orange accent line at bottom */}
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
        {/* "Call" */}
        <div
          style={{
            opacity: callOpacity,
            transform: `scale(${callScale})`,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: BOLD,
              fontWeight: 900,
              fontSize: 94,
              color: WHITE,
              letterSpacing: 2,
              textShadow: "0 4px 24px rgba(0,0,0,0.2)",
            }}
          >
            Call
          </span>
        </div>

        {/* 248-747-LAWN — double pulse */}
        <div
          style={{
            opacity: phoneOpacity,
            transform: `scale(${totalPhoneScale})`,
            marginBottom: 32,
          }}
        >
          <span
            style={{
              fontFamily: BOLD,
              fontWeight: 900,
              fontSize: 94,
              color: WHITE,
              letterSpacing: 2,
              textShadow: "0 4px 24px rgba(0,0,0,0.2)",
            }}
          >
            248-747-LAWN
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 4,
            background: ORANGE,
            borderRadius: 2,
            marginBottom: 28,
            opacity: webOpacity,
          }}
        />

        {/* Website */}
        <div
          style={{
            opacity: webOpacity,
            transform: `scale(${webScale}) translateY(${webY}px)`,
          }}
        >
          <span
            style={{
              fontFamily: REGULAR,
              fontWeight: 400,
              fontSize: 36,
              color: WHITE,
              opacity: 0.8,
              letterSpacing: 1,
            }}
          >
            kileyoutdoorservices.com
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Main Composition ───────────────────────────────────────────────────────

export const KileyOutdoorVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: GREEN }}>
      {/* Scene 1: Brand intro (0-2s) */}
      <Sequence from={0} durationInFrames={60}>
        <BrandIntro />
      </Sequence>

      {/* Flash: Intro → Headline */}
      <Sequence from={58} durationInFrames={5}>
        <FlashTransition />
      </Sequence>

      {/* Scene 2: Lawn Season STARTS NOW (2-5s) */}
      <Sequence from={60} durationInFrames={90}>
        <HeadlineScene />
      </Sequence>

      {/* Flash: Headline → Services */}
      <Sequence from={148} durationInFrames={5}>
        <FlashTransition />
      </Sequence>

      {/* Scene 3: Mowing. Cleanup. Curb Appeal. (5-8s) */}
      <Sequence from={150} durationInFrames={90}>
        <ServicesScene />
      </Sequence>

      {/* Flash: Services → Location */}
      <Sequence from={238} durationInFrames={5}>
        <FlashTransition />
      </Sequence>

      {/* Scene 4: Serving Southern Oakland County (8-11s) */}
      <Sequence from={240} durationInFrames={90}>
        <LocationScene />
      </Sequence>

      {/* Flash: Location → Date */}
      <Sequence from={328} durationInFrames={5}>
        <FlashTransition />
      </Sequence>

      {/* Scene 5: April 15th date callout (11-13s) */}
      <Sequence from={330} durationInFrames={60}>
        <DateScene />
      </Sequence>

      {/* Flash: Date → CTA */}
      <Sequence from={388} durationInFrames={5}>
        <FlashTransition />
      </Sequence>

      {/* Scene 6: CTA (13-15s) */}
      <Sequence from={390} durationInFrames={60}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
