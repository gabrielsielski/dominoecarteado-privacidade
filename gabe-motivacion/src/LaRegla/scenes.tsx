import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Chart } from "./Chart";
import { colors, fontFamily } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const es = (v: number, digits: number) => v.toFixed(digits).replace(".", ",");

// 0:00–0:12 — un 1% que nadie nota.
export const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 500, fontFamily }}>
      <div
        style={{
          fontSize: 420,
          fontWeight: 900,
          color: colors.gold,
          scale: interpolate(frame, [0, 0.8 * fps], [0.6, 1], { ...clamp, easing: Easing.spring({ damping: 12 }), output: "perceptual-scale" }),
          opacity: interpolate(frame, [0, 0.3 * fps, 9 * fps, 10 * fps], [0, 1, 1, 0.25], clamp),
        }}
      >
        1%
      </div>
      <div
        style={{
          fontSize: 64,
          fontWeight: 500,
          color: colors.muted,
          opacity: interpolate(frame, [5 * fps, 6 * fps, 9 * fps, 10 * fps], [0, 1, 1, 0.25], clamp),
        }}
      >
        1,00 → 1,01
      </div>
    </div>
  );
};

// 0:12–0:32 — el crecimiento compuesto: 1,01^365 ≈ 37,78.
export const GrowthScene = () => (
  <Chart rate={1.01} color={colors.gold} drawSeconds={15} label={(v) => `${es(v, 2)}x`} />
);

// 0:32–0:41 — al revés: 0,99^365 ≈ 0,03.
export const DeclineScene = () => (
  <Chart rate={0.99} color={colors.red} drawSeconds={8} label={(v) => `${es(v, 2)}x`} />
);

// 0:41–0:56 — 365 días pequeños que se van sumando.
export const DaysScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const filled = Math.floor(interpolate(frame, [0.5 * fps, 13 * fps], [0, 365], clamp));
  const cols = 23;
  const cell = 900 / cols;

  return (
    <div style={{ position: "absolute", left: 90, top: 330, width: 900, fontFamily }}>
      <div style={{ color: colors.muted, fontSize: 44, fontWeight: 500, marginBottom: 30 }}>
        <span style={{ color: colors.gold, fontWeight: 900, fontSize: 96 }}>{filled}</span> / 365 días
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {Array.from({ length: 365 }, (_, i) => (
          <div key={i} style={{ width: cell, height: cell, padding: 5, boxSizing: "border-box" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 8, backgroundColor: i < filled ? colors.gold : "#22222b" }} />
          </div>
        ))}
      </div>
    </div>
  );
};

// 0:56–1:00 — llamada a la acción.
export const OutroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 500, fontFamily, fontWeight: 900 }}>
      <div style={{ fontSize: 300, color: colors.gold, scale: interpolate(frame, [0, 0.6 * fps], [0.7, 1], { ...clamp, easing: Easing.spring({ damping: 12 }), output: "perceptual-scale" }) }}>
        1%
      </div>
      <div style={{ fontSize: 200, color: colors.text, opacity: interpolate(frame, [0.8 * fps, 1.2 * fps], [0, 1], clamp) }}>HOY</div>
    </div>
  );
};
