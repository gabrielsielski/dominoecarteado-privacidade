import { Audio } from "@remotion/media";
import { AbsoluteFill, Series, staticFile, useVideoConfig } from "remotion";
import { Captions } from "./Captions";
import { BigText, Calendar, Confetti, Counter, RisingChips, Struck, Subscribe } from "./Overlays";
import { Shot } from "./Shot";
import { colors } from "./theme";
import { SHOTS, shotFrames, wordAbs, wordInShot } from "./timing";

const sfx = (name: string) => staticFile(`sfx/${name}.wav`);

export const LaRegla = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Series>
        <Series.Sequence name="1% (A02)" durationInFrames={shotFrames(0)} premountFor={fps}>
          <Shot image="A02" zoom={[1.0, 1.12]}>
            <BigText at={2} top={900} size={360} color={colors.gold}>1%</BigText>
          </Shot>
        </Series.Sequence>
        <Series.Sequence name="Nadie lo nota (B03)" durationInFrames={shotFrames(1)} premountFor={fps}>
          <Shot image="B03" zoom={[1.1, 1.0]} pan={[-30, 20]} />
        </Series.Sequence>
        <Series.Sequence name="Ni siquiera tú (B07)" durationInFrames={shotFrames(2)} premountFor={fps}>
          <Shot image="B07" zoom={[1.0, 1.15]}>
            <BigText at={wordInShot(2, 2, 2)} top={880} size={380} color={colors.gold} rotate={8}>?</BigText>
          </Shot>
        </Series.Sequence>
        <Series.Sequence name="No pasa nada (A07)" durationInFrames={shotFrames(3)} premountFor={fps}>
          <Shot image="A07" zoom={[1.02, 1.1]} pan={[0, 30]} />
        </Series.Sequence>
        <Series.Sequence name="Un día, dos, un mes (B08)" durationInFrames={shotFrames(4)} premountFor={fps}>
          <Shot image="B08" zoom={[1.0, 1.12]}>
            <Calendar two={wordInShot(4, 3, 9)} month={wordInShot(4, 3, 11)} />
          </Shot>
        </Series.Sequence>
        <Series.Sequence name="El tiempo multiplica (A08)" durationInFrames={shotFrames(5)} premountFor={fps}>
          <Shot image="A08" zoom={[1.0, 1.18]}>
            <Counter from={30} to={365} start={0} end={shotFrames(5)} rate={1.01} color={colors.gold} top={900} />
          </Shot>
        </Series.Sequence>
        <Series.Sequence name="37x (A06)" durationInFrames={shotFrames(6)} premountFor={fps}>
          <Shot image="A06" zoom={[1.0, 1.1]}>
            <BigText at={wordInShot(6, 5, 5)} top={880} size={380} color={colors.gold}>37x</BigText>
            <Confetti at={wordInShot(6, 5, 5)} />
          </Shot>
        </Series.Sequence>
        <Series.Sequence name="Al revés (B05)" durationInFrames={shotFrames(7)} premountFor={fps}>
          <Shot image="B05" zoom={[1.15, 1.0]} tint="#ff6b6b">
            <BigText at={4} top={900} size={360} color={colors.red} rotate={4}>-1%</BigText>
          </Shot>
        </Series.Sequence>
        <Series.Sequence name="Si empeoras (B06)" durationInFrames={shotFrames(8)} premountFor={fps}>
          <Shot image="B06" zoom={[1.0, 1.12]} pan={[0, 40]}>
            <Counter from={0} to={180} start={0} end={shotFrames(8)} rate={0.99} color={colors.red} top={900} />
          </Shot>
        </Series.Sequence>
        <Series.Sequence name="Casi no queda nada (B10)" durationInFrames={shotFrames(9)} premountFor={fps}>
          <Shot image="B10" zoom={[1.0, 1.15]}>
            <Counter from={180} to={365} start={0} end={wordInShot(9, 7, 13)} rate={0.99} color={colors.red} top={900} />
          </Shot>
        </Series.Sequence>
        <Series.Sequence name="Un gran día (B04)" durationInFrames={shotFrames(10)} premountFor={fps}>
          <Shot image="B04" zoom={[1.12, 1.0]}>
            <Struck at={2} strike={wordInShot(10, 8, 6)} top={930}>1 GRAN DÍA</Struck>
          </Shot>
        </Series.Sequence>
        <Series.Sequence name="Lo pequeño (A03)" durationInFrames={shotFrames(11)} premountFor={fps}>
          <Shot image="A03" zoom={[1.0, 1.12]}>
            <RisingChips />
          </Shot>
        </Series.Sequence>
        <Series.Sequence name="Cambiarlo todo (B02)" durationInFrames={shotFrames(12)} premountFor={fps}>
          <Shot image="B02" zoom={[1.0, 1.1]}>
            <Struck at={wordInShot(12, 10, 2)} strike={wordInShot(12, 10, 3) + 3} top={930}>CAMBIARLO TODO</Struck>
          </Shot>
        </Series.Sequence>
        <Series.Sequence name="Empezar hoy (A01)" durationInFrames={shotFrames(13)} premountFor={fps}>
          <Shot image="A01" zoom={[1.0, 1.1]}>
            <BigText at={wordInShot(13, 10, 6)} top={880} size={380} color={colors.gold} rotate={-6}>HOY</BigText>
          </Shot>
        </Series.Sequence>
        <Series.Sequence name="Sígueme (A10)" durationInFrames={shotFrames(14)} premountFor={fps}>
          <Shot image="A10" zoom={[1.0, 1.08]}>
            <Subscribe at={wordInShot(14, 11, 2)} />
          </Shot>
        </Series.Sequence>
      </Series>
      <Captions />

      <Audio name="Narración (Kokoro em_alex)" src={staticFile("narracion.wav")} premountFor={fps} />
      <Audio name="Base" src={staticFile("sfx/beat.mp3")} volume={0.16} premountFor={fps} />

      {/* Whoosh suave en cada corte de plano */}
      {SHOTS.slice(1).map((s) => (
        <Audio key={s} name="whoosh corte" src={sfx("whoosh")} from={s - 3} volume={0.25} premountFor={fps} />
      ))}

      {/* Efectos sincronizados con palabras */}
      <Audio name="boom 1%" src={sfx("boom")} from={2} volume={0.45} premountFor={fps} />
      <Audio name="pop ?" src={sfx("pop")} from={wordAbs(2, 2)} volume={0.6} premountFor={fps} />
      <Audio name="tick día 1" src={sfx("tick")} from={SHOTS[4]} volume={0.6} premountFor={fps} />
      <Audio name="tick día 2" src={sfx("tick")} from={wordAbs(3, 9)} volume={0.6} premountFor={fps} />
      <Audio name="tick día 30" src={sfx("tick")} from={wordAbs(3, 11)} volume={0.6} premountFor={fps} />
      <Audio name="boom 37x" src={sfx("boom")} from={wordAbs(5, 5)} volume={0.45} premountFor={fps} />
      <Audio name="ding 37x" src={sfx("ding")} from={wordAbs(5, 5)} volume={0.5} premountFor={fps} />
      <Audio name="caída" src={sfx("down")} from={SHOTS[7]} volume={0.35} premountFor={fps} />
      <Audio name="stamp gran día" src={sfx("stamp")} from={wordAbs(8, 6)} volume={0.45} premountFor={fps} />
      <Audio name="pop +1%" src={sfx("pop")} from={SHOTS[11]} volume={0.35} premountFor={fps} />
      <Audio name="stamp tachado" src={sfx("stamp")} from={wordAbs(10, 3) + 3} volume={0.45} premountFor={fps} />
      <Audio name="boom HOY" src={sfx("boom")} from={wordAbs(10, 6)} volume={0.45} premountFor={fps} />
      <Audio name="click suscribirse" src={sfx("tick")} from={wordAbs(11, 2) + Math.round(0.7 * fps)} volume={0.8} premountFor={fps} />
      <Audio name="ding final" src={sfx("ding")} from={wordAbs(11, 2) + Math.round(0.7 * fps)} volume={0.5} premountFor={fps} />
    </AbsoluteFill>
  );
};
