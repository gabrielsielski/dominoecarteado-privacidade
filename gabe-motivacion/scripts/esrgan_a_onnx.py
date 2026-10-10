import sys, zipfile, pickle, numpy as np, onnx
from onnx import helper, TensorProto, numpy_helper
pth, out = sys.argv[1], sys.argv[2]
z = zipfile.ZipFile(pth); root = z.namelist()[0].split("/")[0]
DT = {"FloatStorage": np.float32, "HalfStorage": np.float16}
class Storage:
    def __init__(s, name, key): s.dt = DT[name]; s.key = key
def rebuild(storage, offset, size, stride, *a):
    buf = np.frombuffer(z.read(f"{root}/data/{storage.key}"), dtype=storage.dt)
    n = int(np.prod(size)) if size else 1
    arr = np.lib.stride_tricks.as_strided(buf[offset:], shape=size, strides=[s * buf.itemsize for s in stride]) if size else buf[offset:offset+1]
    return np.array(arr, dtype=np.float32)
class U(pickle.Unpickler):
    def find_class(s, mod, name):
        if name == "_rebuild_tensor_v2": return rebuild
        if name.endswith("Storage"): return name
        if name == "OrderedDict": import collections; return collections.OrderedDict
        raise pickle.UnpicklingError(f"{mod}.{name}")
    def persistent_load(s, pid):
        _, stype, key, loc, n = pid
        return Storage(stype if isinstance(stype, str) else stype.__name__, key)
sd = U(z.open(f"{root}/data.pkl")).load()
sd = sd.get("params_ema", sd.get("params", sd))
nb = 1 + max(int(k.split(".")[1]) for k in sd if k.startswith("body."))
nodes, inits = [], []
cnt = [0]
def nm(p): cnt[0] += 1; return f"{p}{cnt[0]}"
def conv(x, key):
    w, b = sd[key + ".weight"], sd[key + ".bias"]
    inits.extend([numpy_helper.from_array(w, key + ".w"), numpy_helper.from_array(b, key + ".b")])
    y = nm("c"); nodes.append(helper.make_node("Conv", [x, key + ".w", key + ".b"], [y], pads=[1,1,1,1])); return y
def lrelu(x): y = nm("l"); nodes.append(helper.make_node("LeakyRelu", [x], [y], alpha=0.2)); return y
def cat(xs): y = nm("k"); nodes.append(helper.make_node("Concat", xs, [y], axis=1)); return y
consts = {}
def scal(v):
    if v not in consts:
        n = f"s{len(consts)}"; consts[v] = n; inits.append(numpy_helper.from_array(np.array(v, dtype=np.float32), n))
    return consts[v]
def addmul(x, res, f):
    m = nm("m"); nodes.append(helper.make_node("Mul", [x, scal(f)], [m]))
    y = nm("a"); nodes.append(helper.make_node("Add", [m, res], [y])); return y
def rdb(x, p):
    x1 = lrelu(conv(x, p + ".conv1")); x2 = lrelu(conv(cat([x, x1]), p + ".conv2"))
    x3 = lrelu(conv(cat([x, x1, x2]), p + ".conv3")); x4 = lrelu(conv(cat([x, x1, x2, x3]), p + ".conv4"))
    x5 = conv(cat([x, x1, x2, x3, x4]), p + ".conv5"); return addmul(x5, x, 0.2)
def up(x):
    sc = "upscales"
    if sc not in consts: consts[sc] = sc; inits.append(numpy_helper.from_array(np.array([1,1,2,2], dtype=np.float32), sc))
    y = nm("u"); nodes.append(helper.make_node("Resize", [x, "", sc], [y], mode="nearest")); return y
feat = conv("input", "conv_first"); h = feat
for i in range(nb):
    r = h
    for j in (1, 2, 3): r = rdb(r, f"body.{i}.rdb{j}")
    h = addmul(r, h, 0.2)
body = conv(h, "conv_body"); s = nm("a"); nodes.append(helper.make_node("Add", [feat, body], [s]))
x = lrelu(conv(up(s), "conv_up1")); x = lrelu(conv(up(x), "conv_up2")); x = conv(lrelu(conv(x, "conv_hr")), "conv_last")
nodes.append(helper.make_node("Identity", [x], ["output"]))
g = helper.make_graph(nodes, "esrgan", [helper.make_tensor_value_info("input", TensorProto.FLOAT, [1,3,None,None])],
    [helper.make_tensor_value_info("output", TensorProto.FLOAT, [1,3,None,None])], inits)
m = helper.make_model(g, opset_imports=[helper.make_opsetid("", 17)]); m.ir_version = 8
onnx.checker.check_model(m); onnx.save(m, out); print("blocks", nb, "ok")
