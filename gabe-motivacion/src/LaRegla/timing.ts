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
