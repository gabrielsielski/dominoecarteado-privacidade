import { Easing, interpolate } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Escala con rebote desde 0 a partir del frame `at`.
export const pop = (f: number, at: number, len = 10) =>
  interpolate(f, [at, at + len], [0, 1], { ...clamp, easing: Easing.spring({ damping: 9 }), output: "perceptual-scale" });

// 0→1 suave.
export const ease = (f: number, from: number, to: number) =>
  interpolate(f, [from, to], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });

export const lerp = (p: number, a: number, b: number) => a + (b - a) * p;

export const es = (v: number, digits: number) => v.toFixed(digits).replace(".", ",");

// Pseudoaleatorio determinista.
export const rand = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
