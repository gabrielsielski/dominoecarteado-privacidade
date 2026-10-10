import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  readonly image: string;
  readonly zoom?: [number, number];
  readonly pan?: [number, number]; // desplazamiento vertical en px (inicio, fin)
  readonly tint?: string;
  readonly children?: React.ReactNode;
};

// Ilustración a pantalla completa con "punch-in" al entrar, zoom lento (Ken Burns) y destello en el corte.
export const Shot: React.FC<Props> = ({ image, zoom = [1.04, 1.14], pan = [0, -40], tint, children }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          scale: interpolate(f, [0, 0.2 * fps, durationInFrames], [zoom[0] + 0.18, zoom[0], zoom[1]], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          translate: `0px ${interpolate(f, [0, durationInFrames], pan, clamp)}px`,
        }}
      >
        <Img src={staticFile(`gabe/${image}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }} />
      </AbsoluteFill>
      {tint ? <AbsoluteFill style={{ backgroundColor: tint, mixBlendMode: "multiply" }} /> : null}
      {/* degradado inferior para leer subtítulos */}
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)" }} />
      {children}
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: interpolate(f, [0, 4], [0.55, 0], clamp) }} />
    </AbsoluteFill>
  );
};
