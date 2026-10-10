import timeline from "./timeline.json";

// Línea de tiempo generada por scripts/narracion_kokoro.py (segundos).
export const lines = timeline.lines;
export const FPS = 30;

const sceneStartSec = (i: number) => (i === 0 ? 0 : lines[i].start);
const sceneEndSec = (i: number) => (i + 1 < lines.length ? lines[i + 1].start : timeline.duration);

// Inicio y duración de la escena de cada frase, en frames.
export const sceneFrom = (i: number) => Math.round(sceneStartSec(i) * FPS);
export const sceneFrames = (i: number) => Math.round(sceneEndSec(i) * FPS) - sceneFrom(i);
export const TOTAL_FRAMES = Math.round(timeline.duration * FPS);

// Frame (relativo al inicio de la escena) en que se dice la palabra w de la frase i.
export const wordFrame = (i: number, w: number) => Math.round(lines[i].words[w].start * FPS) - sceneFrom(i);
// Frame absoluto de esa palabra.
export const wordAbs = (i: number, w: number) => Math.round(lines[i].words[w].start * FPS);

// Planos (cada uno con su ilustración). Inicio absoluto en frames, en orden.
export const SHOTS = [
  sceneFrom(0), // A02 — 1%
  sceneFrom(1), // B03 — nadie lo nota
  sceneFrom(2), // B07 — ni siquiera tú
  sceneFrom(3), // A07 — no pasa nada
  wordAbs(3, 7), // B08 — un día, dos, un mes
  sceneFrom(4), // A08 — el tiempo multiplica
  sceneFrom(5), // A06 — 37x
  sceneFrom(6), // B05 — al revés
  sceneFrom(7), // B06 — si empeoras…
  wordAbs(7, 6), // B10 — casi no queda nada
  sceneFrom(8), // B04 — un gran día
  sceneFrom(9), // A03 — lo pequeño
  sceneFrom(10), // B02 — cambiarlo todo
  wordAbs(10, 4), // A01 — empezar hoy
  sceneFrom(11), // A10 — sígueme
];
export const shotFrames = (k: number) => (k + 1 < SHOTS.length ? SHOTS[k + 1] : TOTAL_FRAMES) - SHOTS[k];
// Frame de la palabra w de la frase i, relativo al inicio del plano k.
export const wordInShot = (k: number, i: number, w: number) => wordAbs(i, w) - SHOTS[k];
