"""Genera la narración continua (sin pausas) con Kokoro y la línea de tiempo de palabras.

Uso: python3 scripts/narracion_kokoro.py <carpeta_modelos> [voz] [velocidad]
Salida: public/narracion.wav y src/LaRegla/timeline.json
"""
import json, os, sys
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

LINES = [
    "Si mejoras solo un uno por ciento cada día…",
    "…nadie lo va a notar.",
    "Ni siquiera tú.",
    "Al principio parece que no pasa nada. Un día, dos, un mes…",
    "Pero el tiempo multiplica.",
    "Al final del año serás treinta y siete veces mejor.",
    "Y al revés también funciona.",
    "Si empeoras un uno por ciento cada día, al final del año casi no queda nada.",
    "La diferencia no está en un gran día.",
    "Está en lo pequeño que repites cada día.",
    "No necesitas cambiarlo todo. Necesitas empezar hoy.",
    "Uno por ciento. Hoy. Sígueme para más motivación.",
]
# Texto en pantalla (números en cifras) para cada línea.
DISPLAY = [
    "Si mejoras solo un 1% cada día…",
    "…nadie lo va a notar.",
    "Ni siquiera tú.",
    "Al principio parece que no pasa nada. Un día, dos, un mes…",
    "Pero el tiempo multiplica.",
    "Al final del año serás 37 veces mejor.",
    "Y al revés también funciona.",
    "Si empeoras un 1% cada día, al final del año casi no queda nada.",
    "La diferencia no está en un gran día.",
    "Está en lo pequeño que repites cada día.",
    "No necesitas cambiarlo todo. Necesitas empezar hoy.",
    "1%. Hoy. Sígueme para más motivación.",
]
# Pausa después de cada frase (segundos): más larga en los momentos de impacto.
GAPS = [0.5, 0.5, 1.0, 0.5, 1.0, 1.0, 0.5, 1.0, 0.5, 0.5, 0.5, 0.0]
LEAD = 0.15  # silencio inicial
TAIL = 1.6  # cierre tras la última frase

def trim(s, sr, thr=0.01):
    idx = np.where(np.abs(s) > thr)[0]
    if len(idx) == 0:
        return s
    a = max(idx[0] - int(0.03 * sr), 0)
    b = min(idx[-1] + int(0.06 * sr), len(s))
    return s[a:b]

def main():
    models = sys.argv[1]
    voice = sys.argv[2] if len(sys.argv) > 2 else "em_alex"
    speed = float(sys.argv[3]) if len(sys.argv) > 3 else 0.85
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    k = Kokoro(f"{models}/kokoro-v1.0.onnx", f"{models}/voices-v1.0.bin")
    sr = 24000
    out = [np.zeros(int(LEAD * sr), dtype=np.float32)]
    t = LEAD
    timeline = []
    for text, shown, gap in zip(LINES, DISPLAY, GAPS):
        s, sr = k.create(text, voice=voice, speed=speed, lang="es")
        s = trim(s, sr)
        dur = len(s) / sr
        # Tiempo de cada palabra proporcional a su longitud (aproximación).
        words = shown.split()
        weights = [len(w) + 2 for w in words]
        total = sum(weights)
        acc = t
        wl = []
        for w, wt in zip(words, weights):
            d = dur * wt / total
            wl.append({"text": w, "start": round(acc, 3), "end": round(acc + d, 3)})
            acc += d
        timeline.append({"text": shown, "start": round(t, 3), "end": round(t + dur, 3), "words": wl})
        out += [s.astype(np.float32), np.zeros(int(gap * sr), dtype=np.float32)]
        t += dur + gap
    audio = np.concatenate(out)
    sf.write(f"{root}/public/narracion.wav", audio, sr)
    with open(f"{root}/src/LaRegla/timeline.json", "w") as f:
        json.dump({"duration": round(t + TAIL, 3), "lines": timeline}, f, ensure_ascii=False, indent=1)
    print(f"duración: {t:.2f}s")

main()
