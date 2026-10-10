import { Audio } from "@remotion/media";
import { AbsoluteFill, Series, staticFile, useVideoConfig } from "remotion";
import { Background } from "./Background";
import { Captions } from "./Captions";
import { S0, S1, S2, S3, S4, S5 } from "./Scenes1";
import { S10, S11, S6, S7, S8, S9 } from "./Scenes2";
import { sceneFrames, sceneFrom, wordAbs } from "./timing";

const sfx = (name: string) => staticFile(`sfx/${name}.wav`);

export const LaRegla = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Background />
      <Series>
        <Series.Sequence name="1% cada día" durationInFrames={sceneFrames(0)} premountFor={fps}><S0 /></Series.Sequence>
        <Series.Sequence name="Nadie lo nota" durationInFrames={sceneFrames(1)} premountFor={fps}><S1 /></Series.Sequence>
        <Series.Sequence name="Ni siquiera tú" durationInFrames={sceneFrames(2)} premountFor={fps}><S2 /></Series.Sequence>
        <Series.Sequence name="Día 1, 2, 30" durationInFrames={sceneFrames(3)} premountFor={fps}><S3 /></Series.Sequence>
        <Series.Sequence name="El tiempo multiplica" durationInFrames={sceneFrames(4)} premountFor={fps}><S4 /></Series.Sequence>
        <Series.Sequence name="37x" durationInFrames={sceneFrames(5)} premountFor={fps}><S5 /></Series.Sequence>
        <Series.Sequence name="Al revés" durationInFrames={sceneFrames(6)} premountFor={fps}><S6 /></Series.Sequence>
        <Series.Sequence name="Caída 0,03x" durationInFrames={sceneFrames(7)} premountFor={fps}><S7 /></Series.Sequence>
        <Series.Sequence name="Un gran día" durationInFrames={sceneFrames(8)} premountFor={fps}><S8 /></Series.Sequence>
        <Series.Sequence name="Lo pequeño" durationInFrames={sceneFrames(9)} premountFor={fps}><S9 /></Series.Sequence>
        <Series.Sequence name="Empezar hoy" durationInFrames={sceneFrames(10)} premountFor={fps}><S10 /></Series.Sequence>
        <Series.Sequence name="Sígueme" durationInFrames={sceneFrames(11)} premountFor={fps}><S11 /></Series.Sequence>
      </Series>
      <Captions />

      <Audio name="Narración (Kokoro em_alex)" src={staticFile("narracion.wav")} premountFor={fps} />
      <Audio name="Base" src={staticFile("sfx/beat.mp3")} volume={0.18} premountFor={fps} />

      {/* Efectos de sonido sincronizados con las palabras */}
      <Audio name="boom 1%" src={sfx("boom")} from={2} volume={0.45} premountFor={fps} />
      <Audio name="pop escalón" src={sfx("pop")} from={wordAbs(0, 4)} volume={0.5} premountFor={fps} />
      <Audio name="pop gente 1" src={sfx("pop")} from={sceneFrom(1)} volume={0.4} premountFor={fps} />
      <Audio name="pop gente 2" src={sfx("pop")} from={wordAbs(1, 1)} volume={0.4} premountFor={fps} />
      <Audio name="pop gente 3" src={sfx("pop")} from={wordAbs(1, 3)} volume={0.4} premountFor={fps} />
      <Audio name="pop ?" src={sfx("pop")} from={wordAbs(2, 2)} volume={0.6} premountFor={fps} />
      <Audio name="tick día 1" src={sfx("tick")} from={sceneFrom(3)} volume={0.6} premountFor={fps} />
      <Audio name="tick día 2" src={sfx("tick")} from={wordAbs(3, 9)} volume={0.6} premountFor={fps} />
      <Audio name="tick día 30" src={sfx("tick")} from={wordAbs(3, 11)} volume={0.6} premountFor={fps} />
      <Audio name="whoosh multiplica" src={sfx("whoosh")} from={sceneFrom(4)} volume={0.8} premountFor={fps} />
      <Audio name="boom 37x" src={sfx("boom")} from={wordAbs(5, 5)} volume={0.45} premountFor={fps} />
      <Audio name="ding 37x" src={sfx("ding")} from={wordAbs(5, 5)} volume={0.5} premountFor={fps} />
      <Audio name="whoosh al revés" src={sfx("whoosh")} from={sceneFrom(6)} volume={0.8} premountFor={fps} />
      <Audio name="caída" src={sfx("down")} from={sceneFrom(7)} volume={0.4} premountFor={fps} />
      <Audio name="boom gran día" src={sfx("boom")} from={sceneFrom(8) + 9} volume={0.45} premountFor={fps} />
      <Audio name="stamp X" src={sfx("stamp")} from={wordAbs(8, 6)} volume={0.45} premountFor={fps} />
      <Audio name="pop escalones" src={sfx("pop")} from={sceneFrom(9)} volume={0.35} premountFor={fps} />
      <Audio name="stamp tachado" src={sfx("stamp")} from={wordAbs(10, 3) + 4} volume={0.45} premountFor={fps} />
      <Audio name="boom HOY" src={sfx("boom")} from={wordAbs(10, 6)} volume={0.45} premountFor={fps} />
      <Audio name="click suscribirse" src={sfx("tick")} from={wordAbs(11, 2) + Math.round(0.7 * fps)} volume={0.8} premountFor={fps} />
      <Audio name="ding final" src={sfx("ding")} from={wordAbs(11, 2) + Math.round(0.7 * fps)} volume={0.5} premountFor={fps} />
    </AbsoluteFill>
  );
};
