"""Genera la narración con Kokoro y la línea de tiempo de frases y palabras a partir de un guion JSON.

Uso: python3 scripts/narracion.py <carpeta_modelos> roteiros/<guion>.json
El guion define voz, idioma, velocidad, pausas y rutas de salida (ver roteiros/).
"""
import json, os, sys
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

def trim(s, sr, thr=0.01):
    idx = np.where(np.abs(s) > thr)[0]
    if len(idx) == 0:
        return s
    a = max(idx[0] - int(0.03 * sr), 0)
    b = min(idx[-1] + int(0.06 * sr), len(s))
    return s[a:b]

def main():
    models, guion = sys.argv[1], sys.argv[2]
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    cfg = json.load(open(guion))
    k = Kokoro(f"{models}/kokoro-v1.0.onnx", f"{models}/voices-v1.0.bin")
    sr = 24000
    out = [np.zeros(int(cfg["inicio"] * sr), dtype=np.float32)]
    t = cfg["inicio"]
    timeline = []
    for fr in cfg["frases"]:
        s, sr = k.create(fr["habla"], voice=cfg["voz"], speed=cfg["velocidad"], lang=cfg["idioma"])
        s = trim(s, sr)
        dur = len(s) / sr
        # Tiempo de cada palabra proporcional a su longitud (aproximación).
        words = fr["texto"].split()
        weights = [len(w) + 2 for w in words]
        total = sum(weights)
        acc = t
        wl = []
        for w, wt in zip(words, weights):
            d = dur * wt / total
            wl.append({"text": w, "start": round(acc, 3), "end": round(acc + d, 3)})
            acc += d
        timeline.append({"text": fr["texto"], "start": round(t, 3), "end": round(t + dur, 3), "words": wl})
        out += [s.astype(np.float32), np.zeros(int(fr["pausa"] * sr), dtype=np.float32)]
        t += dur + fr["pausa"]
    os.makedirs(os.path.dirname(f"{root}/{cfg['audio']}"), exist_ok=True)
    sf.write(f"{root}/{cfg['audio']}", np.concatenate(out), sr)
    with open(f"{root}/{cfg['timeline']}", "w") as f:
        json.dump({"duration": round(t + cfg["cierre"], 3), "lines": timeline}, f, ensure_ascii=False, indent=1)
    print(f"duración: {t + cfg['cierre']:.2f}s")

main()
