import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fontFamily } from "./theme";
import { lines } from "./timing";

const CHUNK = 3;

// Subtítulos estilo Shorts: bloques de hasta 3 palabras, la palabra actual en dorado.
export const Captions = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const li = lines.findIndex((l, i) => t >= (i === 0 ? 0 : l.start) && (i + 1 >= lines.length || t < lines[i + 1].start));
  if (li < 0) return null;
  const words = lines[li].words;
  let wi = words.findIndex((w) => t < w.end);
  if (wi < 0) wi = words.length - 1;
  const chunkStart = Math.floor(wi / CHUNK) * CHUNK;
  const chunk = words.slice(chunkStart, chunkStart + CHUNK);
  const chunkFrame = frame - Math.round(words[chunkStart].start * fps);

  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 1330,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: 40,
        fontFamily,
        fontWeight: 900,
        fontSize: 92,
        lineHeight: 1.15,
        textTransform: "uppercase",
        scale: interpolate(chunkFrame, [0, 0.15 * fps], [0.85, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          output: "perceptual-scale",
        }),
      }}
    >
      {chunk.map((w, k) => {
        const active = chunkStart + k === wi;
        const wf = frame - Math.round(w.start * fps);
        return (
          <span
            key={chunkStart + k}
            style={{
              color: active ? colors.gold : colors.text,
              WebkitTextStroke: "14px #000",
              paintOrder: "stroke fill",
              scale: active
                ? interpolate(wf, [0, 0.08 * fps, 0.2 * fps], [1, 1.1, 1.04], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
                : 1,
              display: "inline-block",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
