import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fontFamily } from "./theme";

type Props = {
  readonly rate: number; // 1.01 o 0.99
  readonly color: string;
  readonly drawSeconds: number;
  readonly label: (value: number) => string;
};

const W = 900;
const H = 700;

// Curva de rate^día durante 365 días, dibujada progresivamente.
export const Chart: React.FC<Props> = ({ rate, color, drawSeconds, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = interpolate(frame, [0, drawSeconds * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const day = Math.round(progress * 365);
  const maxV = Math.max(Math.pow(rate, 365), 1);
  const y = (v: number) => H - (v / maxV) * H;
  const points = Array.from({ length: day + 1 }, (_, d) => `${(d / 365) * W},${y(Math.pow(rate, d))}`);
  const value = Math.pow(rate, day);
  const lastX = (day / 365) * W;
  const lastY = y(value);

  return (
    <div style={{ position: "absolute", left: 90, top: 380, width: W, fontFamily }}>
      <div style={{ display: "flex", justifyContent: "space-between", color: colors.muted, fontSize: 44, fontWeight: 500 }}>
        <span>Día {day}</span>
        <span style={{ color, fontWeight: 900, fontSize: 96 }}>{label(value)}</span>
      </div>
      <svg width={W} height={H} style={{ overflow: "visible", marginTop: 30 }}>
        <line x1={0} y1={H} x2={W} y2={H} stroke={colors.muted} strokeWidth={3} opacity={0.4} />
        <line x1={0} y1={y(1)} x2={W} y2={y(1)} stroke={colors.muted} strokeWidth={2} strokeDasharray="10 12" opacity={0.4} />
        <polyline points={points.join(" ")} fill="none" stroke={color} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={lastX} cy={lastY} r={18} fill={color} />
      </svg>
    </div>
  );
};
