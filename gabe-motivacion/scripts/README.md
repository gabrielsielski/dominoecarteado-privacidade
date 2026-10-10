# Audio

## Narración (Kokoro)

1. `pip install kokoro-onnx soundfile` y descarga `kokoro-v1.0.onnx` y `voices-v1.0.bin`
   de https://github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0) en una carpeta `MODELOS`.
2. `python3 scripts/narracion_kokoro.py MODELOS em_alex 1.1`
   genera `public/narracion.wav` (frases seguidas, sin pausas) y `src/LaRegla/timeline.json`
   (tiempos de cada frase y palabra). Las escenas y subtítulos se sincronizan solos con ese archivo.

## Efectos y base

`python3 scripts/sfx.py` sintetiza los efectos en `public/sfx/`.
Luego: `ffmpeg -i public/sfx/beat.wav -b:a 160k public/sfx/beat.mp3 && rm public/sfx/beat.wav`.

## Video

`npm run dev` (Studio) o `npx remotion render LaReglaDel1 out/la-regla-del-1.mp4`.
