import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { lines } from "./timing";

// Fondo con puntos que suben sin parar; se vuelve rojo durante "al revés".
export const Background = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const redIn = lines[6].start * fps;
  const redOut = lines[8].start * fps;
  const red = interpolate(f, [redIn, redIn + 8, redOut - 4, redOut + 4], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b12" }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #2a2350 0%, #0b0b12 65%)", opacity: 1 - red }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #5a1218 0%, #120608 65%)", opacity: red }} />
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 3px, transparent 3px)",
          backgroundSize: "60px 60px",
          backgroundPosition: `0px ${-f * 2}px`,
        }}
      />
    </AbsoluteFill>
  );
};
