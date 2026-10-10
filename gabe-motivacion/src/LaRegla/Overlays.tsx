import { useCurrentFrame, useVideoConfig } from "remotion";
import { big } from "../shared/Overlays";
import { ease, es, lerp, pop, rand } from "../shared/anim";
import { colors, fontFamily } from "../shared/theme";



// Contador animado (p. ej. 1,00x → 37,78x).
export const Counter: React.FC<{ readonly from: number; readonly to: number; readonly start: number; readonly end: number; readonly rate: number; readonly color: string; readonly top: number }> = ({ from, to, start, end, rate, color, top }) => {
  const f = useCurrentFrame();
  const d = Math.round(lerp(ease(f, start, end), from, to));
  return (
    <div style={{ ...big, top, fontSize: 190, color, scale: pop(f, 0, 8) }}>
      {es(Math.pow(rate, d), 2)}x
      <div style={{ fontSize: 60, color: "#fff", WebkitTextStroke: "10px #000", marginTop: 10 }}>DÍA {d}</div>
    </div>
  );
};

// Calendario que salta 1 → 2 → 30.
export const Calendar: React.FC<{ readonly two: number; readonly month: number }> = ({ two, month }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const day = f < two ? 1 : f < month ? 2 : Math.round(lerp(ease(f, month, month + 0.5 * fps), 3, 30));
  const last = f < two ? 0 : f < month ? two : month;
  return (
    <div style={{ position: "absolute", left: 340, top: 900, width: 400, height: 330, borderRadius: 30, backgroundColor: "#fff", overflow: "hidden", boxShadow: "0 20px 0 rgba(0,0,0,0.4)", scale: pop(f, 0, 8), rotate: `${Math.sin((f - last) * 0.7) * 7 * Math.max(0, 1 - (f - last) / 10)}deg` }}>
      <div style={{ height: 90, backgroundColor: colors.red, color: "#fff", fontFamily, fontWeight: 900, fontSize: 56, textAlign: "center", lineHeight: "90px" }}>DÍA</div>
      <div style={{ fontFamily, fontWeight: 900, fontSize: 190, color: "#111", textAlign: "center", lineHeight: "230px" }}>{day}</div>
    </div>
  );
};

// Confeti que estalla en `at`.
export const Confetti: React.FC<{ readonly at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f - at);
  if (f < at) return null;
  return (
    <>
      {Array.from({ length: 50 }, (_, i) => {
        const ang = rand(i) * Math.PI * 2;
        const v = 20 + rand(i + 50) * 26;
        return (
          <div key={i} style={{ position: "absolute", left: 540 + Math.cos(ang) * v * t, top: 1050 + Math.sin(ang) * v * t + 1.1 * t * t, width: 24, height: 36, borderRadius: 4, backgroundColor: [colors.gold, "#4dd4ff", "#ff6fae", "#7dff8a"][i % 4], rotate: `${t * (10 + rand(i) * 20)}deg` }} />
        );
      })}
    </>
  );
};

// Fichas "+1%" que suben sin parar.
export const RisingChips: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({ length: 10 }, (_, i) => {
        const at = i * 6;
        const t = f - at;
        if (t < 0) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 120 + rand(i + 7) * 700, top: 1250 - t * 14, padding: "12px 28px", borderRadius: 40, backgroundColor: colors.gold, color: "#111", fontFamily, fontWeight: 900, fontSize: 64, scale: pop(f, at, 6), opacity: Math.max(0, 1 - t / 45) }}>
            +1%
          </div>
        );
      })}
    </>
  );
};

// Texto tachado con una línea roja que se dibuja en `strike`.
export const Struck: React.FC<{ readonly at: number; readonly strike: number; readonly top: number; readonly children: React.ReactNode }> = ({ at, strike, top, children }) => {
  const f = useCurrentFrame();
  const cut = ease(f, strike, strike + 6);
  return (
    <div style={{ ...big, top, fontSize: 130, color: "#fff", scale: pop(f, at, 8), opacity: f >= at ? 1 : 0 }}>
      {children}
      <div style={{ position: "absolute", left: 100, top: "45%", height: 28, width: 880 * cut, backgroundColor: colors.red, rotate: "-7deg", borderRadius: 14, border: "5px solid #000" }} />
    </div>
  );
};

