import { useCurrentFrame, useVideoConfig } from "remotion";
import { ease, es, lerp, pop } from "./anim";
import { Gabe } from "./Gabe";
import { Shell } from "./Shell";
import { colors, fontFamily } from "./theme";
import { wordFrame } from "./timing";

const GROUND = 1180;

// "Y al revés también funciona."
export const S6 = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spin = ease(f, 0, 0.45 * fps);
  return (
    <Shell>
      <div style={{ position: "absolute", inset: 0, rotate: `${lerp(spin, 180, 360)}deg`, scale: lerp(spin, 0.6, 1) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 340, color: colors.red, textShadow: "0 14px 0 rgba(0,0,0,0.35)" }}>
          -1%
        </div>
        <Gabe pose="sad" x={540} y={GROUND} height={480} />
      </div>
    </Shell>
  );
};

// "Si empeoras un 1% cada día, al final del año casi no queda nada."
export const S7 = () => {
  const f = useCurrentFrame();
  const end = wordFrame(7, 13);
  const p = ease(f, 0, end);
  const d = Math.round(lerp(p, 0, 365));
  const W = 860;
  const H = 700;
  const pts = Array.from({ length: d + 1 }, (_, k) => [(k / 365) * W, H - Math.pow(0.99, k) * H]);
  const last = pts[pts.length - 1];
  return (
    <Shell shake={f >= end ? 0 : 6}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 150, color: colors.red, scale: f >= end ? pop(f, end, 8) : 1 }}>
        {es(Math.pow(0.99, d), 2)}x
      </div>
      <svg width={W} height={H} style={{ position: "absolute", left: 110, top: 440, overflow: "visible" }}>
        <polyline points={pts.map((q) => q.join(",")).join(" ")} fill="none" stroke={colors.red} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last[0]} cy={last[1]} r={24} fill={colors.red} />
      </svg>
      <Gabe pose="sad" x={110 + last[0]} y={440 + last[1] - 10} height={240} style={{ rotate: `${lerp(p, 0, 20)}deg` }} />
    </Shell>
  );
};

// "La diferencia no está en un gran día."
export const S8 = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const land = 0.3 * fps;
  const fall = ease(f, 0, land);
  const stamp = wordFrame(8, 6);
  return (
    <Shell shake={0}>
      <div style={{ position: "absolute", left: 0, right: 0, top: GROUND, height: 6, backgroundColor: "rgba(255,255,255,0.15)" }} />
      <div
        style={{
          position: "absolute",
          left: 190,
          width: 700,
          height: 560,
          top: lerp(fall, -700, GROUND - 560),
          borderRadius: 30,
          backgroundColor: "#3a3a4a",
          border: `10px solid ${colors.muted}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily,
          fontWeight: 900,
          color: colors.text,
          rotate: `${f > land ? Math.sin((f - land) * 1.2) * 4 * Math.max(0, 1 - (f - land) / 12) : 0}deg`,
        }}
      >
        <div style={{ fontSize: 110 }}>1 GRAN</div>
        <div style={{ fontSize: 170 }}>DÍA</div>
      </div>
      <svg width={760} height={620} viewBox="0 0 760 620" style={{ position: "absolute", left: 160, top: GROUND - 590, scale: pop(f, stamp, 8), opacity: f >= stamp ? 1 : 0 }}>
        <path d="M40 40 L720 580 M720 40 L40 580" stroke={colors.red} strokeWidth={70} strokeLinecap="round" />
      </svg>
    </Shell>
  );
};

// "Está en lo pequeño que repites cada día."
export const S9 = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const STEPS = 12;
  const every = Math.max(2, Math.floor((durationInFrames - 6) / STEPS));
  const built = Math.min(STEPS, Math.floor(f / every) + 1);
  const sw = 72;
  const sh = 52;
  const x0 = 110;
  const top = (i: number) => GROUND - (i + 1) * sh;
  const gx = x0 + (built - 0.5) * sw;
  return (
    <Shell>
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 110, color: colors.text }}>
        DÍA <span style={{ color: colors.gold }}>{built * 30}</span>
      </div>
      {Array.from({ length: built }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x0 + i * sw,
            top: top(i),
            width: sw - 6,
            height: (i + 1) * sh,
            borderRadius: 8,
            backgroundColor: colors.gold,
            opacity: 0.55 + 0.45 * ((i + 1) / STEPS),
            scale: pop(f, i * every, 6),
            transformOrigin: "bottom center",
          }}
        />
      ))}
      <Gabe pose="walk" x={gx} y={top(built - 1)} height={300} />
    </Shell>
  );
};

// "No necesitas cambiarlo todo. Necesitas empezar hoy."
export const S10 = () => {
  const f = useCurrentFrame();
  const strike = wordFrame(10, 3) + 4;
  const b = wordFrame(10, 5);
  const hoy = wordFrame(10, 6);
  const cut = ease(f, strike, strike + 6);
  return (
    <Shell shake={f >= hoy ? 14 : 0}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 120, lineHeight: 1.05, color: colors.text, scale: pop(f, 0, 8), opacity: f >= b ? 0.35 : 1 }}>
        CAMBIARLO
        <br />
        TODO
        <div style={{ position: "absolute", left: 160, top: 120, height: 22, width: 760 * cut, backgroundColor: colors.red, rotate: "-8deg", borderRadius: 11 }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 620, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 110, color: colors.text, scale: pop(f, b, 8) }}>
        EMPEZAR
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 330, lineHeight: 1, color: colors.gold, textShadow: "0 14px 0 rgba(0,0,0,0.35)", scale: f >= hoy ? lerp(ease(f, hoy, hoy + 6), 2.2, 1) : 0, rotate: "-6deg" }}>
        HOY
      </div>
      <Gabe pose={f >= hoy ? "cheer" : "shrug"} x={540} y={1300} height={300} style={{ opacity: f >= b ? 0 : 1 }} />
    </Shell>
  );
};

// "1%. Hoy. Sígueme para más motivación."
export const S11 = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btn = wordFrame(11, 2);
  const click = btn + Math.round(0.7 * fps);
  const move = ease(f, btn + 4, click);
  const done = f >= click;
  return (
    <Shell>
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 200, lineHeight: 1, color: colors.gold, scale: pop(f, 0, 8) }}>
        1% <span style={{ color: colors.text, opacity: f >= wordFrame(11, 1) ? 1 : 0 }}>HOY</span>
      </div>
      <Gabe pose="wave" x={540} y={1010} height={440} style={{ zIndex: 1 }} />
      <div style={{ position: "absolute", left: 140, width: 800, top: 1040, height: 150, borderRadius: 75, backgroundColor: done ? "#3a3a48" : "#ff0033", color: "#fff", fontFamily, fontWeight: 900, fontSize: 68, display: "flex", alignItems: "center", justifyContent: "center", scale: f >= click ? lerp(ease(f, click, click + 5), 0.92, 1) : pop(f, btn, 8) }}>
        {done ? "SUSCRITO" : "SUSCRÍBETE"}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1200, textAlign: "center", fontFamily, fontWeight: 800, fontSize: 56, color: colors.text, opacity: ease(f, btn, btn + 6) }}>
        @gabemotivacion
      </div>
      <svg width={90} height={110} viewBox="0 0 24 30" style={{ position: "absolute", left: lerp(move, 1100, 600), top: lerp(move, 1500, 1090), scale: f >= click && f < click + 4 ? 0.85 : 1, opacity: f >= btn ? 1 : 0 }}>
        <path d="M2 2 L2 24 L8 18 L12 28 L16 26 L12 17 L20 17 Z" fill="#fff" stroke="#000" strokeWidth={1.5} />
      </svg>
    </Shell>
  );
};
