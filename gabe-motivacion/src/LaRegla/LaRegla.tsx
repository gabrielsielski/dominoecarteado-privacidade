import { Audio } from "@remotion/media";
import { AbsoluteFill, Series, staticFile, useVideoConfig } from "remotion";
import { Captions } from "./Captions";
import { DaysScene, DeclineScene, GrowthScene, IntroScene, OutroScene } from "./scenes";
import { colors, fontFamily } from "./theme";

export const LaRegla = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Audio name="Narración (Kokoro em_alex)" src={staticFile("narracion.mp3")} premountFor={fps} />
      <div style={{ position: "absolute", top: 170, width: "100%", textAlign: "center", fontFamily, fontWeight: 800, fontSize: 52, letterSpacing: 6, color: colors.muted }}>
        LA REGLA DEL 1%
      </div>
      <Series>
        <Series.Sequence name="Intro" durationInFrames={12 * fps} premountFor={fps}>
          <IntroScene />
        </Series.Sequence>
        <Series.Sequence name="Crecimiento" durationInFrames={20 * fps} premountFor={fps}>
          <GrowthScene />
        </Series.Sequence>
        <Series.Sequence name="Al revés" durationInFrames={9 * fps} premountFor={fps}>
          <DeclineScene />
        </Series.Sequence>
        <Series.Sequence name="Cada día" durationInFrames={15 * fps} premountFor={fps}>
          <DaysScene />
        </Series.Sequence>
        <Series.Sequence name="Cierre" durationInFrames={4 * fps} premountFor={fps}>
          <OutroScene />
        </Series.Sequence>
      </Series>
      <Captions />
    </AbsoluteFill>
  );
};
