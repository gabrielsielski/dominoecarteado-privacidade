import { useCurrentFrame, useVideoConfig } from "remotion";
import { ease, lerp, pop } from "./anim";
import { fontFamily } from "./theme";

export const big: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  textAlign: "center",
  fontFamily,
  fontWeight: 900,
  lineHeight: 1,
  WebkitTextStroke: "16px #000",
  paintOrder: "stroke fill",
  filter: "drop-shadow(0 14px 0 rgba(0,0,0,0.45))",
};

// Texto grande con rebote al aparecer en el frame `at`.
export const BigText: React.FC<{ readonly at: number; readonly top: number; readonly size: number; readonly color: string; readonly rotate?: number; readonly until?: number; readonly children: React.ReactNode }> = ({ at, top, size, color, rotate = -4, until, children }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ ...big, top, fontSize: size, color, scale: pop(f, at, 10), rotate: `${rotate + Math.sin(f * 0.25) * 1.5}deg`, opacity: f >= at && (until === undefined || f < until) ? 1 : 0 }}>
      {children}
    </div>
  );
};

// Botón de suscripción con cursor que hace clic.
export const Subscribe: React.FC<{ readonly at: number; readonly handle: string; readonly labels?: readonly [string, string] }> = ({ at, handle, labels = ["SUSCRÍBETE", "SUSCRITO"] }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const click = at + Math.round(0.7 * fps);
  const move = ease(f, at + 4, click);
  const done = f >= click;
  return (
    <>
      <div style={{ position: "absolute", left: 140, width: 800, top: 1040, height: 150, borderRadius: 75, backgroundColor: done ? "#3a3a48" : "#ff0033", color: "#fff", fontFamily, fontWeight: 900, fontSize: 68, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, boxShadow: "0 14px 0 rgba(0,0,0,0.45)", scale: done ? lerp(ease(f, click, click + 5), 0.92, 1) : pop(f, at, 8), opacity: f >= at ? 1 : 0 }}>
        {done ? labels[1] : labels[0]}
      </div>
      <div style={{ ...big, top: 1215, fontSize: 60, color: "#fff", WebkitTextStroke: "10px #000", opacity: ease(f, at, at + 6) }}>
        {handle}
      </div>
      <svg width={90} height={110} viewBox="0 0 24 30" style={{ position: "absolute", left: lerp(move, 1100, 600), top: lerp(move, 1500, 1100), scale: done && f < click + 4 ? 0.85 : 1, opacity: f >= at ? 1 : 0 }}>
        <path d="M2 2 L2 24 L8 18 L12 28 L16 26 L12 17 L20 17 Z" fill="#fff" stroke="#000" strokeWidth={1.5} />
      </svg>
    </>
  );
};
