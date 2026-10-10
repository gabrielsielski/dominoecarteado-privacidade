import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Envuelve cada escena con un "punch-in" de cámara al cortar y un zoom lento constante.
export const Shell: React.FC<{ readonly children: React.ReactNode; readonly shake?: number }> = ({ children, shake = 0 }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = shake * Math.max(0, 1 - f / (0.4 * fps));
  return (
    <AbsoluteFill
      style={{
        scale: interpolate(f, [0, 0.25 * fps, durationInFrames], [1.12, 1, 1.04], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        translate: `${Math.sin(f * 2.1) * s}px ${Math.cos(f * 1.7) * s}px`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
