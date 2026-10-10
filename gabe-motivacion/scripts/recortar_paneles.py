import sys, numpy as np
from PIL import Image
src, prefix, out = sys.argv[1], sys.argv[2], sys.argv[3]
im = Image.open(src).convert("RGB"); a = np.asarray(im).astype(int)
white = (a.min(axis=2) > 235)
def runs(mask_1d, minlen):
    segs=[]; start=None
    for i,v in enumerate(mask_1d):
        if not v and start is None: start=i
        if v and start is not None:
            if i-start>=minlen: segs.append((start,i))
            start=None
    if start is not None and len(mask_1d)-start>=minlen: segs.append((start,len(mask_1d)))
    return segs
rows = runs(white.mean(axis=1) > 0.9, 100)
n=0
for (r0,r1) in rows:
    cols = runs(white[r0:r1].mean(axis=0) > 0.9, 100)
    for (c0,c1) in cols:
        n+=1; im.crop((c0+2,r0+2,c1-2,r1-2)).save(f"{out}/{prefix}{n:02d}.png")
        print(prefix, n, c1-c0, r1-r0)
