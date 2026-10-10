import { useCurrentFrame, useVideoConfig } from "remotion";
import { ease, es, lerp, pop, rand } from "./anim";
import { Gabe, Person } from "./Gabe";
import { Shell } from "./Shell";
import { colors, fontFamily } from "./theme";
import { wordFrame } from "./timing";

const GROUND = 1180;

const Ground = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: GROUND, height: 6, backgroundColor: "rgba(255,255,255,0.15)" }} />
);

const Big: React.FC<{ readonly children: React.ReactNode; readonly top: number; readonly size: number; readonly color: string; readonly style?: React.CSSProperties }> = ({ children, top, size, color, style }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top,
      textAlign: "center",
      fontFamily,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1,
      color,
      textShadow: "0 12px 0 rgba(0,0,0,0.35)",
      ...style,
    }}
  >
    {children}
  </div>
);

// "Si mejoras solo un 1% cada día…"
export const S0 = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const step = ease(f, wordFrame(0, 4), wordFrame(0, 4) + 0.3 * fps);
  return (
    <Shell>
      <Ground />
      <Big top={260} size={380} color={colors.gold} style={{ scale: pop(f, 2, 12), rotate: `${lerp(ease(f, 2, 14), -12, 0)}deg` }}>
        1%
      </Big>
      <div style={{ position: "absolute", left: 440, width: 200, top: GROUND - 40 * step, height: 40 * step, backgroundColor: colors.gold, borderRadius: 8 }} />
      <Gabe pose="idle" x={540} y={GROUND - 40 * step} height={520} />
    </Shell>
  );
};

// "…nadie lo va a notar."
export const S1 = () => {
  const f = useCurrentFrame();
  const people = [
    { x: 170, at: 0 },
    { x: 910, at: wordFrame(1, 1) },
    { x: 330, at: wordFrame(1, 3) },
    { x: 750, at: wordFrame(1, 4) },
  ];
  return (
    <Shell>
      <Ground />
      {people.map((p, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, scale: pop(f, p.at, 8), transformOrigin: `${p.x}px ${GROUND}px` }}>
          <Person x={p.x} y={GROUND} height={i % 2 ? 340 : 300} />
          <div style={{ position: "absolute", left: p.x - 60, top: GROUND - (i % 2 ? 420 : 380), width: 120, height: 70, borderRadius: 35, backgroundColor: "#fff", color: "#111", fontFamily, fontWeight: 900, fontSize: 50, textAlign: "center", lineHeight: "50px" }}>
            …
          </div>
        </div>
      ))}
      <Gabe pose="idle" x={540} y={GROUND - 40} height={480} />
      <div style={{ position: "absolute", left: 440, width: 200, top: GROUND - 40, height: 40, backgroundColor: colors.gold, borderRadius: 8 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 120, color: colors.muted, scale: pop(f, 2) }}>
        +1% = ¿?
      </div>
    </Shell>
  );
};

// "Ni siquiera tú."
export const S2 = () => {
  const f = useCurrentFrame();
  return (
    <Shell>
      <Ground />
      <Gabe pose="shrug" x={540} y={GROUND} height={560} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 220, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 300, color: colors.gold, scale: pop(f, wordFrame(2, 2), 10), translate: `0px ${Math.sin(f * 0.4) * 14}px` }}>
        ?
      </div>
    </Shell>
  );
};

// "Al principio parece que no pasa nada. Un día, dos, un mes…"
export const S3 = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w2 = wordFrame(3, 9);
  const w3 = wordFrame(3, 11);
  const day = f < w2 ? 1 : f < w3 ? 2 : Math.round(lerp(ease(f, w3, w3 + 0.6 * fps), 3, 30));
  const flip = f < w2 ? f : f < w3 ? f - w2 : f - w3;
  // Escalera casi plana que se desplaza bajo Gabe.
  const offset = (f * 6) % 120;
  return (
    <Shell>
      <div style={{ position: "absolute", left: 340, top: 230, width: 400, height: 330, borderRadius: 30, backgroundColor: "#fff", overflow: "hidden", boxShadow: "0 20px 0 rgba(0,0,0,0.3)", rotate: `${Math.sin(flip * 0.6) * 6 * Math.max(0, 1 - flip / 10)}deg` }}>
        <div style={{ height: 90, backgroundColor: colors.red, color: "#fff", fontFamily, fontWeight: 900, fontSize: 56, textAlign: "center", lineHeight: "90px" }}>DÍA</div>
        <div style={{ fontFamily, fontWeight: 900, fontSize: 190, color: "#111", textAlign: "center", lineHeight: "230px" }}>{day}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 610, textAlign: "center", fontFamily, fontWeight: 800, fontSize: 80, color: colors.muted }}>
        {es(Math.pow(1.01, day), 2)}x
      </div>
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: i * 120 - offset - 60, top: GROUND - i * 3, width: 122, height: 120, backgroundColor: "#2c2c3a", borderTop: `6px solid ${colors.gold}` }} />
      ))}
      <Gabe pose="walk" x={540} y={GROUND - 18} height={500} />
    </Shell>
  );
};

// "Pero el tiempo multiplica."
export const S4 = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = ease(f, 0, durationInFrames);
  const d = Math.round(lerp(p, 30, 365));
  const W = 860;
  const H = 760;
  const pts = Array.from({ length: d + 1 }, (_, k) => [(k / 365) * W, H - (Math.pow(1.01, k) / 37.78) * H]);
  const last = pts[pts.length - 1];
  return (
    <Shell shake={10}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 150, color: colors.gold }}>
        {es(Math.pow(1.01, d), 2)}x
      </div>
      <svg width={W} height={H} style={{ position: "absolute", left: 110, top: 420, overflow: "visible" }}>
        <polyline points={pts.map((q) => q.join(",")).join(" ")} fill="none" stroke={colors.gold} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last[0]} cy={last[1]} r={24} fill={colors.gold} />
      </svg>
      <Gabe pose="cheer" x={110 + last[0]} y={420 + last[1] - 10} height={240} />
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 100 + rand(i) * 880, top: 1250 - ((f * (10 + rand(i + 9) * 12) + rand(i + 3) * 900) % 1100), fontFamily, fontWeight: 900, fontSize: 80, color: colors.gold, opacity: 0.35 }}>
          ×
        </div>
      ))}
    </Shell>
  );
};

// "Al final del año serás 37 veces mejor."
export const S5 = () => {
  const f = useCurrentFrame();
  const at = wordFrame(5, 5);
  return (
    <Shell>
      {/* montaña */}
      <svg width={1080} height={700} style={{ position: "absolute", left: 0, top: 640 }}>
        <path d="M0 700 L540 120 L1080 700 Z" fill="#2c2c3a" />
        <path d="M540 120 L470 195 L510 185 L540 210 L575 185 L610 195 Z" fill="#fff" opacity={0.85} />
      </svg>
      <div style={{ position: "absolute", left: 560, top: 560, width: 8, height: 210, backgroundColor: "#ddd" }} />
      <div style={{ position: "absolute", left: 568, top: 560, width: 130, height: 80, backgroundColor: colors.gold, rotate: `${Math.sin(f * 0.4) * 4}deg`, transformOrigin: "left center" }} />
      <Gabe pose="cheer" x={470} y={775} height={330} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily, fontWeight: 900, fontSize: 330, lineHeight: 1, color: colors.gold, textShadow: "0 14px 0 rgba(0,0,0,0.35)", scale: pop(f, at, 10), rotate: `${Math.sin(f * 0.3) * 3}deg` }}>
        37x
      </div>
      {/* confeti */}
      {Array.from({ length: 40 }, (_, i) => {
        const t = Math.max(0, f - at);
        const ang = rand(i) * Math.PI * 2;
        const v = 18 + rand(i + 50) * 22;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 + Math.cos(ang) * v * t,
              top: 330 + Math.sin(ang) * v * t + 0.9 * t * t,
              width: 22,
              height: 34,
              backgroundColor: [colors.gold, "#4dd4ff", "#ff6fae", "#7dff8a"][i % 4],
              rotate: `${t * (10 + rand(i) * 20)}deg`,
              opacity: f >= at ? 1 : 0,
            }}
          />
        );
      })}
    </Shell>
  );
};
