import sys, json, soundfile as sf
from kokoro_onnx import Kokoro
K = sys.argv[1]; out = sys.argv[2]; voice = sys.argv[3]
lines = [
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
k = Kokoro(f"{K}/kokoro-v1.0.onnx", f"{K}/voices-v1.0.bin")
meta = []
for i, t in enumerate(lines):
    s, sr = k.create(t, voice=voice, speed=0.95, lang="es")
    sf.write(f"{out}/l{i:02d}.wav", s, sr)
    meta.append({"i": i, "text": t, "dur": round(len(s)/sr, 2)})
print(json.dumps(meta, ensure_ascii=False, indent=0))
