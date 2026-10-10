# Audio

## Narración (Kokoro)

1. `pip install kokoro-onnx soundfile` y descarga `kokoro-v1.0.onnx` y `voices-v1.0.bin`
   de https://github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0) en una carpeta `MODELOS`.
2. `python3 scripts/narracion.py MODELOS roteiros/la-regla.json`
   genera `public/narracion.wav` (frases seguidas, sin pausas) y `src/LaRegla/timeline.json`
   (tiempos de cada frase y palabra). Las escenas y subtítulos se sincronizan solos con ese archivo.

## Efectos y base

`python3 scripts/sfx.py` sintetiza los efectos en `public/sfx/`.
Luego: `ffmpeg -i public/sfx/beat.wav -b:a 160k public/sfx/beat.mp3 && rm public/sfx/beat.wav`.

## Video

`npm run dev` (Studio) o `npx remotion render LaReglaDel1 out/la-regla-del-1.mp4`.

## Ilustraciones (public/gabe/)

Las ilustraciones vienen en cuadrículas; se recortan y se amplían x4 con Real-ESRGAN (anime 6B) vía ONNX, sin PyTorch:

1. `python3 scripts/recortar_paneles.py cuadricula.png A paneles/` (detecta los márgenes blancos).
2. Descarga `RealESRGAN_x4plus_anime_6B.pth` de https://github.com/xinntao/Real-ESRGAN/releases (v0.2.2.4)
   y conviértelo: `pip install onnx onnxruntime && python3 scripts/esrgan_a_onnx.py anime6B.pth anime6B.onnx`.
3. `python3 scripts/ampliar.py anime6B.onnx paneles/ ampliados/` y guarda como JPG en `public/gabe/`.

## Música de fondo

`python3 scripts/musica.py salida.wav 62 96` compone una base informativa (Lam–Fa–Do–Sol, 96 bpm) sin derechos de autor.
Normalízala con `ffmpeg -i salida.wav -af loudnorm=I=-20:TP=-3 musica.mp3`.
