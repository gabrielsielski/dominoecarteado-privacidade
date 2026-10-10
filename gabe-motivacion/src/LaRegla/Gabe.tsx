import { useCurrentFrame } from "remotion";

export type Pose = "idle" | "walk" | "cheer" | "shrug" | "sad" | "wave";

type Props = {
  readonly pose: Pose;
  readonly height?: number;
  readonly x: number; // centro
  readonly y: number; // pies
  readonly style?: React.CSSProperties;
};

const SKIN = "#d9a07a";
const HAIR = "#2b1d14";
const SHIRT = "#1f2a44";
const JEANS = "#3d5f93";

// Gabe en versión caricatura: pelo corto, barba, camiseta azul marino y jeans.
export const Gabe: React.FC<Props> = ({ pose, height = 420, x, y, style }) => {
  const f = useCurrentFrame();
  const swing = Math.sin(f * 0.45);

  let armL = 8;
  let armR = -8;
  let legL = 0;
  let legR = 0;
  let bob = Math.sin(f * 0.15) * 2;
  let headTilt = 0;
  let mouth = "M82 120 Q100 136 118 120"; // sonrisa

  if (pose === "walk") {
    legL = swing * 22;
    legR = -swing * 22;
    armL = -swing * 25;
    armR = -swing * 25;
    bob = Math.abs(Math.sin(f * 0.45)) * -6;
  } else if (pose === "cheer") {
    armL = 150 + Math.sin(f * 0.6) * 12;
    armR = -150 - Math.sin(f * 0.6) * 12;
    bob = -Math.abs(Math.sin(f * 0.3)) * 30;
    mouth = "M80 116 Q100 145 120 116 Z";
  } else if (pose === "shrug") {
    armL = 55;
    armR = -55;
    headTilt = Math.sin(f * 0.2) * 6;
    mouth = "M86 124 L114 124";
  } else if (pose === "sad") {
    armL = 3;
    armR = -3;
    headTilt = 8;
    bob = 6;
    mouth = "M84 128 Q100 116 116 128";
  } else if (pose === "wave") {
    armL = 8;
    armR = -140 + Math.sin(f * 0.5) * 20;
  }

  const blink = f % 75 < 4 ? 0.15 : 1;

  return (
    <svg
      viewBox="0 0 200 400"
      width={height / 2}
      height={height}
      style={{ position: "absolute", left: x - height / 4, top: y - height, overflow: "visible", ...style }}
    >
      <g transform={`translate(0 ${bob})`}>
        {/* piernas */}
        <g transform={`rotate(${legL} 85 265)`}>
          <rect x={70} y={260} width={30} height={120} rx={12} fill={JEANS} />
          <ellipse cx={82} cy={384} rx={24} ry={12} fill="#f2f2f2" />
        </g>
        <g transform={`rotate(${legR} 115 265)`}>
          <rect x={100} y={260} width={30} height={120} rx={12} fill={JEANS} />
          <ellipse cx={118} cy={384} rx={24} ry={12} fill="#f2f2f2" />
        </g>
        {/* brazos */}
        <g transform={`rotate(${armL} 60 170)`}>
          <rect x={48} y={160} width={24} height={105} rx={12} fill={SKIN} />
          <rect x={46} y={158} width={28} height={40} rx={12} fill={SHIRT} />
        </g>
        <g transform={`rotate(${armR} 140 170)`}>
          <rect x={128} y={160} width={24} height={105} rx={12} fill={SKIN} />
          <rect x={126} y={158} width={28} height={40} rx={12} fill={SHIRT} />
        </g>
        {/* torso */}
        <rect x={55} y={150} width={90} height={125} rx={26} fill={SHIRT} />
        <path d="M88 152 Q100 166 112 152" stroke="#2d3b5e" strokeWidth={5} fill="none" />
        {/* cabeza */}
        <g transform={`rotate(${headTilt} 100 140)`}>
          <rect x={90} y={130} width={20} height={24} fill={SKIN} />
          <circle cx={46} cy={98} r={11} fill={SKIN} />
          <circle cx={154} cy={98} r={11} fill={SKIN} />
          <circle cx={100} cy={92} r={55} fill={SKIN} />
          {/* barba */}
          <path d="M47 95 Q48 150 100 152 Q152 150 153 95 Q140 128 100 130 Q60 128 47 95 Z" fill={HAIR} opacity={0.85} />
          {/* pelo */}
          <path d="M45 85 Q42 30 100 32 Q160 30 155 85 Q148 58 120 55 Q95 62 70 52 Q50 60 45 85 Z" fill={HAIR} />
          {/* ojos */}
          <ellipse cx={80} cy={92} rx={6} ry={7 * blink} fill="#1a1a1a" />
          <ellipse cx={120} cy={92} rx={6} ry={7 * blink} fill="#1a1a1a" />
          <path d="M70 78 Q80 73 90 78 M110 78 Q120 73 130 78" stroke={HAIR} strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d={mouth} stroke="#5a2a1a" strokeWidth={5} fill={pose === "cheer" ? "#5a2a1a" : "none"} strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
};

// Silueta genérica (gente que "no lo nota").
export const Person: React.FC<{ readonly x: number; readonly y: number; readonly height: number; readonly style?: React.CSSProperties }> = ({ x, y, height, style }) => (
  <svg viewBox="0 0 200 400" width={height / 2} height={height} style={{ position: "absolute", left: x - height / 4, top: y - height, overflow: "visible", ...style }}>
    <circle cx={100} cy={90} r={52} fill="#3a3a48" />
    <rect x={52} y={150} width={96} height={130} rx={28} fill="#3a3a48" />
    <rect x={68} y={270} width={28} height={115} rx={12} fill="#3a3a48" />
    <rect x={104} y={270} width={28} height={115} rx={12} fill="#3a3a48" />
    {/* móvil iluminando la cara */}
    <rect x={112} y={170} width={34} height={56} rx={6} fill="#9ad0ff" />
    <path d="M70 100 L90 104 M110 104 L130 100" stroke="#9ad0ff" strokeWidth={6} strokeLinecap="round" />
  </svg>
);
