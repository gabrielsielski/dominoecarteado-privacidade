import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fontFamily } from "./theme";

// Cada línea empieza en el segundo marcado en el guion.
export const captions = [
  { start: 0, end: 4.5, text: "Si mejoras solo un 1% cada día…" },
  { start: 5, end: 8.5, text: "…nadie lo va a notar." },
  { start: 9, end: 11.5, text: "Ni siquiera tú." },
  { start: 12, end: 19.5, text: "Al principio parece que no pasa nada. Un día, dos, un mes…" },
  { start: 20, end: 26.5, text: "Pero el tiempo multiplica." },
  { start: 27, end: 31.5, text: "Al final del año serás 37 veces mejor." },
  { start: 32, end: 34.5, text: "Y al revés también funciona." },
  { start: 35, end: 40.5, text: "Si empeoras un 1% cada día, al final del año casi no queda nada." },
  { start: 41, end: 45.5, text: "La diferencia no está en un gran día." },
  { start: 46, end: 50.5, text: "Está en lo pequeño que repites cada día." },
  { start: 51, end: 55.5, text: "No necesitas cambiarlo todo. Necesitas empezar hoy." },
  { start: 56, end: 60, text: "1%. Hoy. Sígueme para más motivación." },
];

export const Captions = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const active = captions.find((c) => t >= c.start && t < c.end);
  if (!active) return null;
  const local = frame - active.start * fps;

  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: 1380,
        textAlign: "center",
        fontFamily,
        fontWeight: 800,
        fontSize: 68,
        lineHeight: 1.2,
        color: colors.text,
        textShadow: "0 4px 24px rgba(0,0,0,0.8)",
        opacity: interpolate(local, [0, 0.25 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(local, [0, 0.4 * fps], ["0px 30px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      {active.text}
    </div>
  );
};
