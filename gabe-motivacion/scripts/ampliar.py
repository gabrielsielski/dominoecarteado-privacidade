import sys, glob, os, numpy as np, onnxruntime as ort
from PIL import Image
model, src, dst = sys.argv[1:4]
os.makedirs(dst, exist_ok=True)
sess = ort.InferenceSession(model, providers=["CPUExecutionProvider"])
for f in sorted(glob.glob(f"{src}/*.png")):
    a = np.asarray(Image.open(f).convert("RGB")).astype(np.float32) / 255
    y = sess.run(None, {"input": a.transpose(2, 0, 1)[None]})[0][0]
    Image.fromarray((np.clip(y.transpose(1, 2, 0), 0, 1) * 255).round().astype(np.uint8)).save(f"{dst}/{os.path.basename(f)}")
    print(os.path.basename(f), y.shape, flush=True)
