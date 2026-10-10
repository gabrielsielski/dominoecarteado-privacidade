"""Genera la narración con Kokoro y la línea de tiempo de frases y palabras a partir de un guion JSON.

Uso: python3 scripts/narracion.py <carpeta_modelos> roteiros/<guion>.json

Campos del guion:
- "voz": nombre de Kokoro o mezcla {"pm_alex": 0.7, "am_adam": 0.3}
- "idioma", "velocidad", "inicio", "cierre", "audio", "timeline"
- "filtro" (opcional): filtros de ffmpeg para el audio final (deben conservar la duración)
- "frases": lista de {"habla", "texto", "pausa"} o, para controlar el ritmo dentro de la frase,
  {"partes": [{"habla", "texto", "pausa", "velocidad"?}, ...]}.
  Cada parte se genera por separado (la entonación de "?" y "." queda limpia) y se une con
  silencios exactos. "velocidad" de la parte multiplica la velocidad general.

Guía de pausas (estilo orador, adaptada a Shorts):
  coma/respiro 0.15–0.25 s · antes de un dato clave 0.3–0.45 s · fin de idea 0.4–0.5 s
  después de una pregunta, antes de la respuesta 0.6–0.9 s · cambio de tema 0.6–0.8 s
"""
import json, os, subprocess, sys
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

def words_timed(text, start, dur):
    # Tiempo de cada palabra proporcional a su longitud (aproximación).
    words = text.split()
    weights = [len(w) + 2 for w in words]
    total = sum(weights)
    acc, out = start, []
    for w, wt in zip(words, weights):
        d = dur * wt / total
        out.append({"text": w, "start": round(acc, 3), "end": round(acc + d, 3)})
        acc += d
    return out

def main():
    models, guion = sys.argv[1], sys.argv[2]
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    cfg = json.load(open(guion))
    k = Kokoro(f"{models}/kokoro-v1.0.onnx", f"{models}/voices-v1.0.bin")
    voz = cfg["voz"]
    if isinstance(voz, dict):
        voz = sum(k.get_voice_style(n) * w for n, w in voz.items())
    sr = 24000
    out = [np.zeros(int(cfg["inicio"] * sr), dtype=np.float32)]
    t = cfg["inicio"]
    timeline = []
    for fr in cfg["frases"]:
        partes = fr.get("partes") or [{"habla": fr["habla"], "texto": fr["texto"], "pausa": fr["pausa"]}]
        line_start, words = t, []
        for i, p in enumerate(partes):
            speed = cfg["velocidad"] * p.get("velocidad", 1.0)
            s, sr = k.create(p["habla"], voice=voz, speed=speed, lang=cfg["idioma"])
            s = trim(s, sr)
            dur = len(s) / sr
            words += words_timed(p.get("texto", p["habla"]), t, dur)
            line_end = t + dur
            out += [s.astype(np.float32), np.zeros(int(p["pausa"] * sr), dtype=np.float32)]
            t += dur + p["pausa"]
        text = " ".join(p.get("texto", p["habla"]) for p in partes)
        timeline.append({"text": text, "start": round(line_start, 3), "end": round(line_end, 3), "words": words})
    dest = f"{root}/{cfg['audio']}"
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if cfg.get("filtro"):
        crudo = dest + ".crudo.wav"
        sf.write(crudo, np.concatenate(out), sr)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", crudo, "-af", cfg["filtro"], dest], check=True)
        os.remove(crudo)
    else:
        sf.write(dest, np.concatenate(out), sr)
    with open(f"{root}/{cfg['timeline']}", "w") as f:
        json.dump({"duration": round(t + cfg["cierre"], 3), "lines": timeline}, f, ensure_ascii=False, indent=1)
    print(f"duración: {t + cfg['cierre']:.2f}s")

main()
