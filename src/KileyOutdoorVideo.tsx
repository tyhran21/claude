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

// ─── Scene 1: Brand Intro (0-2s / 0-60 frames) ─────────────────────────────

const BrandIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "KILEY" fades in at top center
  const kileyOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const kileyScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 160 },
    durationInFrames: 22,
  });
  const kileyS = interpolate(kileyScale, [0, 1], [0.7, 1]);

  // "Outdoor Services" slides up beneath
  const subSpring = spring({
    frame: frame - 14,
    fps,
    config: { damping: 12, stiffness: 170 },
    durationInFrames: 22,
  });
  const subY = interpolate(subSpring, [0, 1], [40, 0]);
  const subOpacity = interpolate(frame, [14, 28], [0, 1], {
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
            transform: `scale(${kileyS})`,
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
            transform: `translateY(${subY}px)`,
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

  // "Lawn Season" scale pops in
  const line1Spring = spring({
    frame: frame - 4,
    fps,
    config: { damping: 9, stiffness: 200 },
    durationInFrames: 20,
  });
  const line1Scale = interpolate(line1Spring, [0, 1], [0.3, 1]);
  const line1Opacity = interpolate(frame, [4, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "STARTS NOW" slams in bigger
  const line2Spring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 7, stiffness: 240 },
    durationInFrames: 22,
  });
  const line2Scale = interpolate(line2Spring, [0, 1], [0.2, 1]);
  const line2Opacity = interpolate(frame, [18, 28], [0, 1], {
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
              color: ORANGE,
              textShadow: `0 0 40px ${ORANGE}60, 0 4px 16px rgba(0,0,0,0.2)`,
            }}
          >
            STARTS NOW
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Services bar wipe (5-8s / 150-240 frames) ────────────────────

const ServicesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Orange accent bar wipes across top area
  const barWidth = interpolate(frame, [0, 20], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // "Mowing." slides in
  const w1Spring = spring({
    frame: frame - 16,
    fps,
    config: { damping: 10, stiffness: 190 },
    durationInFrames: 18,
  });
  const w1X = interpolate(w1Spring, [0, 1], [-80, 0]);
  const w1Opacity = interpolate(frame, [16, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Cleanup." slides in
  const w2Spring = spring({
    frame: frame - 26,
    fps,
    config: { damping: 10, stiffness: 190 },
    durationInFrames: 18,
  });
  const w2X = interpolate(w2Spring, [0, 1], [-80, 0]);
  const w2Opacity = interpolate(frame, [26, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Curb Appeal." slides in
  const w3Spring = spring({
    frame: frame - 36,
    fps,
    config: { damping: 10, stiffness: 190 },
    durationInFrames: 18,
  });
  const w3X = interpolate(w3Spring, [0, 1], [-80, 0]);
  const w3Opacity = interpolate(frame, [36, 46], [0, 1], {
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
      {/* Orange accent bar */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: 0,
          width: `${barWidth}%`,
          height: 6,
          background: ORANGE,
          boxShadow: `0 0 20px ${ORANGE}50`,
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
          gap: 20,
        }}
      >
        {/* Mowing */}
        <div
          style={{
            opacity: w1Opacity,
            transform: `translateX(${w1X}px)`,
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
            transform: `translateX(${w2X}px)`,
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
            transform: `translateX(${w3X}px)`,
          }}
        >
          <span
            style={{
              fontFamily: BOLD,
              fontWeight: 900,
              fontSize: 88,
              color: ORANGE,
              textShadow: `0 0 30px ${ORANGE}40`,
            }}
          >
            Curb Appeal.
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Serving Oakland County (8-11s / 240-330 frames) ───────────────

const LocationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pin icon drops in
  const pinSpring = spring({
    frame: frame - 2,
    fps,
    config: { damping: 8, stiffness: 220 },
    durationInFrames: 20,
  });
  const pinY = interpolate(pinSpring, [0, 1], [-60, 0]);
  const pinScale = interpolate(pinSpring, [0, 1], [0.4, 1]);
  const pinOpacity = interpolate(frame, [2, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Serving" + "Oakland County" bounces in
  const textSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 9, stiffness: 200 },
    durationInFrames: 22,
  });
  const textScale = interpolate(textSpring, [0, 1], [0.4, 1]);
  const textOpacity = interpolate(frame, [10, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "& Southeast Michigan" fades in
  const subOpacity = interpolate(frame, [30, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subY = interpolate(frame, [30, 44], [15, 0], {
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
        {/* Location pin */}
        <div
          style={{
            opacity: pinOpacity,
            transform: `translateY(${pinY}px) scale(${pinScale})`,
            marginBottom: 28,
          }}
        >
          {/* SVG pin icon */}
          <svg
            width="72"
            height="96"
            viewBox="0 0 24 32"
            fill="none"
          >
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
            opacity: textOpacity,
            transform: `scale(${textScale})`,
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

        {/* Oakland County */}
        <div
          style={{
            opacity: textOpacity,
            transform: `scale(${textScale})`,
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontFamily: BOLD,
              fontWeight: 900,
              fontSize: 86,
              color: WHITE,
              textShadow: "0 3px 20px rgba(0,0,0,0.15)",
            }}
          >
            Oakland County
          </span>
        </div>

        {/* & Southeast Michigan */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: REGULAR,
              fontWeight: 400,
              fontSize: 38,
              color: WHITE,
              opacity: 0.75,
            }}
          >
            & Southeast Michigan
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

  // "April 15th" scale pop
  const dateSpring = spring({
    frame: frame - 2,
    fps,
    config: { damping: 8, stiffness: 210 },
    durationInFrames: 22,
  });
  const dateScale = interpolate(dateSpring, [0, 1], [0.25, 1]);
  const dateOpacity = interpolate(frame, [2, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle pulse on the date
  const datePulse =
    frame > 20
      ? 1 + interpolate(Math.sin((frame - 20) * 0.18), [-1, 1], [0, 0.025])
      : 1;

  // "We're already booking up" fades in
  const subOpacity = interpolate(frame, [22, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subY = interpolate(frame, [22, 36], [20, 0], {
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
            transform: `scale(${dateScale * datePulse})`,
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
              textShadow: `0 0 40px rgba(255,255,255,0.2), 0 4px 20px rgba(0,0,0,0.2)`,
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
            transform: `translateY(${subY}px)`,
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

  // "Call" label fades in
  const callOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const callY = interpolate(frame, [0, 12], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phone number pops in
  const phoneSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 7, stiffness: 230 },
    durationInFrames: 22,
  });
  const phoneScale = interpolate(phoneSpring, [0, 1], [0.3, 1]);
  const phoneOpacity = interpolate(frame, [6, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phone number pulse
  const phonePulse =
    frame > 24
      ? 1 + interpolate(Math.sin((frame - 24) * 0.22), [-1, 1], [0, 0.025])
      : 1;

  // Website slides up
  const webOpacity = interpolate(frame, [22, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const webY = interpolate(frame, [22, 34], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Orange bottom bar grows in
  const barHeight = interpolate(frame, [0, 18], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ background: GREEN }}>
      {/* Orange bar at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: barHeight,
          background: ORANGE,
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
            transform: `translateY(${callY}px)`,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: REGULAR,
              fontWeight: 400,
              fontSize: 44,
              color: WHITE,
              opacity: 0.8,
            }}
          >
            Call
          </span>
        </div>

        {/* 248-747-LAWN */}
        <div
          style={{
            opacity: phoneOpacity,
            transform: `scale(${phoneScale * phonePulse})`,
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
            transform: `translateY(${webY}px)`,
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

      {/* Scene 2: Lawn Season STARTS NOW (2-5s) */}
      <Sequence from={60} durationInFrames={90}>
        <HeadlineScene />
      </Sequence>

      {/* Scene 3: Mowing. Cleanup. Curb Appeal. (5-8s) */}
      <Sequence from={150} durationInFrames={90}>
        <ServicesScene />
      </Sequence>

      {/* Scene 4: Serving Oakland County (8-11s) */}
      <Sequence from={240} durationInFrames={90}>
        <LocationScene />
      </Sequence>

      {/* Scene 5: April 15th date callout (11-13s) */}
      <Sequence from={330} durationInFrames={60}>
        <DateScene />
      </Sequence>

      {/* Scene 6: CTA (13-15s) */}
      <Sequence from={390} durationInFrames={60}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
