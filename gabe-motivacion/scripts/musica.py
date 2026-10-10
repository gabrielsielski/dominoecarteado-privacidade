"""Compone una base musical informativa (tipo noticiero) sin derechos de autor.

Uso: python3 scripts/musica.py <salida.wav> [segundos] [bpm]
Progresión Lam - Fa - Do - Sol con piano eléctrico, arpegio, bajo suave y percusión ligera.
"""
import sys
import numpy as np
import soundfile as sf

SR = 44100
out = sys.argv[1]
dur = float(sys.argv[2]) if len(sys.argv) > 2 else 62.0
bpm = float(sys.argv[3]) if len(sys.argv) > 3 else 96.0
beat = 60 / bpm
rng = np.random.default_rng(7)
mix = np.zeros((int(SR * (dur + 2)), 2))

def note(freq, length, kind):
    t = np.arange(int(SR * length)) / SR
    if kind == "ep":  # piano eléctrico
        x = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * 2 * freq * t) * np.exp(-t * 6) + 0.12 * np.sin(2 * np.pi * 3 * freq * t) * np.exp(-t * 9)
        env = np.exp(-t * 1.6)
    elif kind == "pluck":
        x = np.sin(2 * np.pi * freq * t) + 0.5 * np.sin(2 * np.pi * 2 * freq * t)
        env = np.exp(-t * 9)
    else:  # bajo
        x = np.tanh(1.4 * np.sin(2 * np.pi * freq * t))
        env = np.minimum(1, t * 80) * np.exp(-t * 2.2)
    rel = np.minimum(1, (length - t) * 30)
    return x * env * rel

def add(x, at, gain, pan=0.0):
    s = int(at * SR)
    if s >= len(mix):
        return
    e = min(s + len(x), len(mix))
    mix[s:e, 0] += x[: e - s] * gain * (1 - pan)
    mix[s:e, 1] += x[: e - s] * gain * (1 + pan)

def hz(midi):
    return 440 * 2 ** ((midi - 69) / 12)

chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Lam Fa Do Sol
bass = [45, 41, 36, 43]
bar = 4 * beat
n_bars = int(dur / bar) + 1
for b in range(n_bars):
    t0 = b * bar
    c = chords[b % 4]
    for m in c:
        add(note(hz(m), bar * 0.98, "ep"), t0, 0.16, pan=(m % 3 - 1) * 0.2)
    add(note(hz(bass[b % 4]), bar * 0.95, "bass"), t0, 0.28)
    if b >= 1:  # el arpegio entra en el segundo compás
        arp = [c[0] + 12, c[1] + 12, c[2] + 12, c[1] + 12]
        for i in range(8):
            add(note(hz(arp[i % 4]), beat * 0.6, "pluck"), t0 + i * beat / 2, 0.07, pan=0.35 if i % 2 else -0.35)
    for i in range(4):  # bombo suave en 1 y 3, hi-hat en contratiempo
        if i % 2 == 0:
            kt = np.arange(int(SR * 0.25)) / SR
            add(np.sin(2 * np.pi * (50 + 70 * np.exp(-kt * 25)) * kt) * np.exp(-kt * 14), t0 + i * beat, 0.35)
        ht = np.arange(int(SR * 0.04)) / SR
        hat = rng.standard_normal(len(ht)) * np.exp(-ht * 120)
        hat = np.diff(hat, prepend=0)
        add(hat, t0 + i * beat + beat / 2, 0.05, pan=0.2)

mix = mix[: int(SR * dur)]
fade = int(SR * 2.5)
mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
mix[: int(SR * 0.5)] *= np.linspace(0, 1, int(SR * 0.5))[:, None]
mix /= np.abs(mix).max() + 1e-9
sf.write(out, (mix * 0.8).astype(np.float32), SR)
print("ok", dur, "s")
