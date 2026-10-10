"""Sintetiza los efectos de sonido y la base rítmica en public/sfx/ (sin dependencias externas)."""
import os
import numpy as np
import soundfile as sf

SR = 44100
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = f"{root}/public/sfx"
os.makedirs(out, exist_ok=True)
rng = np.random.default_rng(1)

def t(d):
    return np.linspace(0, d, int(SR * d), endpoint=False)

def env(x, a=0.005, r=None):
    n = len(x); e = np.ones(n)
    na = max(int(a * SR), 1); e[:na] = np.linspace(0, 1, na)
    if r: e *= np.exp(-np.arange(n) / (r * SR))
    return x * e

def lowpass(x, alpha):
    y = np.zeros_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += alpha[i] * (v - acc) if hasattr(alpha, "__len__") else alpha * (v - acc)
        y[i] = acc
    return y

def save(name, x, gain=0.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    sf.write(f"{out}/{name}.wav", np.stack([x, x], 1).astype(np.float32), SR)

# whoosh: ruido filtrado con barrido
d = 0.55; tt = t(d)
sweep = np.sin(np.pi * tt / d) ** 2
save("whoosh", lowpass(rng.standard_normal(len(tt)), 0.02 + 0.25 * sweep) * sweep, 0.7)

# pop: seno con caída de tono
tt = t(0.12); f = 900 * np.exp(-tt * 25) + 300
save("pop", env(np.sin(2 * np.pi * np.cumsum(f) / SR), 0.001, 0.03), 0.8)

# tick
tt = t(0.04)
save("tick", env(np.sin(2 * np.pi * 2200 * tt) + 0.5 * rng.standard_normal(len(tt)), 0.0005, 0.006), 0.6)

# boom: sub grave con caída
tt = t(0.9); f = 120 * np.exp(-tt * 6) + 40
save("boom", env(np.tanh(2.5 * np.sin(2 * np.pi * np.cumsum(f) / SR)), 0.002, 0.3), 0.95)

# ding: campana
tt = t(1.2)
bell = sum(a * np.sin(2 * np.pi * fr * tt) for fr, a in [(1318, 1), (2637, 0.4), (3951, 0.2), (1976, 0.3)])
save("ding", env(bell, 0.002, 0.35), 0.6)

# down: tono descendente (fracaso)
tt = t(0.8); f = 600 * np.exp(-tt * 2.5) + 80
save("down", env(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.5, 0.005, 0.4), 0.5)

# stamp: golpe seco
tt = t(0.25)
save("stamp", env(np.tanh(3 * np.sin(2 * np.pi * (180 * np.exp(-tt * 20) + 60) * tt)) + 0.4 * rng.standard_normal(len(tt)) * np.exp(-tt * 60), 0.001, 0.08), 0.9)

# base rítmica 120 bpm: bombo, hi-hat y bajo
bpm = 120; beat = 60 / bpm; dur = 50.0
music = np.zeros(int(SR * dur))
kick_t = t(0.3); kick = env(np.sin(2 * np.pi * np.cumsum(110 * np.exp(-kick_t * 18) + 45) / SR), 0.001, 0.12)
hat_t = t(0.05); hat = env(rng.standard_normal(len(hat_t)), 0.0005, 0.012)
hat = hat - lowpass(hat, 0.3)
roots = [55.0, 55.0, 43.65, 49.0]  # La, La, Fa, Sol
for i in range(int(dur / beat)):
    s = int(i * beat * SR)
    def add(x, at, g):
        e = min(at + len(x), len(music)); music[at:e] += g * x[: e - at]
    add(kick, s, 0.9)
    add(hat, s + int(beat / 2 * SR), 0.25)
    bt = t(beat * 0.9); r = roots[(i // 4) % 4]
    add(env(np.tanh(1.5 * np.sin(2 * np.pi * r * bt)), 0.005, 0.25), s, 0.35)
save("beat", music, 0.8)  # convertir a mp3: ffmpeg -i beat.wav -b:a 160k beat.mp3
print("ok")
