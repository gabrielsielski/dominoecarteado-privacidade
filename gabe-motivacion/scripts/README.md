# Narración (Kokoro)

1. `pip install kokoro-onnx soundfile` y descarga `kokoro-v1.0.onnx` y `voices-v1.0.bin`
   de https://github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0) en una carpeta `MODELOS`.
2. `python3 scripts/narracion_kokoro.py MODELOS SALIDA em_alex` genera `l00.wav` … `l11.wav`.
3. Mezcla cada línea en su segundo del guion (0 5 9 12 20 27 32 35 41 46 51 56) en `public/narracion.mp3`
   con ffmpeg `adelay` + `amix` + `loudnorm=I=-14`.

Video: `npm run dev` (Studio) o `npx remotion render LaReglaDel1 out/la-regla-del-1.mp4`.
