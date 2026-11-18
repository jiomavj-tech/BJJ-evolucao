/** Fotos do próprio usuário (exercícios, posições e técnicas), guardadas só no celular (IndexedDB).
 * Chaves: "ex:<id>", "pos:<posição>", "tec:<id>". Cada chave tem 1 ou 2 quadros (início/fim). */

const DB = 'bjj-evolucao-midia', STORE = 'fotos', MAX_SIDE = 900;
const KEY_RE = /^(ex|pos|tec):[a-z0-9_-]{1,40}$/;
export const validKey = k => typeof k === 'string' && KEY_RE.test(k);

let dbp = null;
function db() {
  if (!dbp) dbp = new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  return dbp;
}
async function tx(mode, fn) {
  const d = await db();
  return new Promise((res, rej) => {
    const t = d.transaction(STORE, mode), st = t.objectStore(STORE);
    const out = fn(st);
    t.oncomplete = () => res(out && 'result' in out ? out.result : undefined);
    t.onerror = () => rej(t.error);
    t.onabort = () => rej(t.error || new Error('Operação cancelada'));
  });
}

/** Reduz a foto para no máximo 900 px e converte para JPEG (economiza espaço). */
export async function shrink(file) {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  bmp.close?.();
  return new Promise((res, rej) => c.toBlob(b => b ? res(b) : rej(new Error('Falha ao converter a foto')), 'image/jpeg', 0.8));
}

/** Carrega tudo como URLs de objeto: { chave: { urls:[...], updated } }. */
export async function loadAllMedia() {
  const out = {};
  const all = await tx('readonly', st => st.getAll());
  const keys = await tx('readonly', st => st.getAllKeys());
  (keys || []).forEach((k, i) => {
    const v = all[i];
    if (validKey(k) && v && Array.isArray(v.frames)) out[k] = { urls: v.frames.map(b => b ? URL.createObjectURL(b) : null), updated: v.updated };
  });
  return out;
}

export async function saveFrame(key, index, file, today) {
  if (!validKey(key) || ![0, 1].includes(index)) throw new Error('Chave inválida');
  const blob = await shrink(file);
  const cur = (await tx('readonly', st => st.get(key))) || { frames: [] };
  const frames = [...(cur.frames || [])];
  frames[index] = blob;
  await tx('readwrite', st => st.put({ frames, updated: today }, key));
  try { await navigator.storage?.persist?.(); } catch {}
  return blob;
}

export async function removeFrame(key, index) {
  const cur = await tx('readonly', st => st.get(key));
  if (!cur) return;
  const frames = [...cur.frames]; frames[index] = null;
  if (frames.every(f => !f)) await tx('readwrite', st => st.delete(key));
  else await tx('readwrite', st => st.put({ ...cur, frames }, key));
}

const toDataUrl = b => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(r.error); r.readAsDataURL(b); });
async function fromDataUrl(u) { return (await fetch(u)).blob(); }

/** Para o backup: { chave: [dataURL|null, dataURL|null] }. */
export async function exportMedia() {
  const out = {};
  const all = await tx('readonly', st => st.getAll());
  const keys = await tx('readonly', st => st.getAllKeys());
  for (let i = 0; i < (keys || []).length; i++) {
    if (!validKey(keys[i])) continue;
    out[keys[i]] = await Promise.all((all[i].frames || []).map(b => b ? toDataUrl(b) : null));
  }
  return out;
}

/** Validação do campo "media" de um backup (sem tocar no banco). */
export function validMedia(m) {
  if (m === undefined) return true;
  if (!m || typeof m !== 'object' || Array.isArray(m)) return false;
  const entries = Object.entries(m);
  if (entries.length > 300) return false;
  return entries.every(([k, v]) => validKey(k) && Array.isArray(v) && v.length >= 1 && v.length <= 2 &&
    v.some(Boolean) && v.every(u => u === null || (typeof u === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(u) && u.length <= 4_000_000)));
}

export async function importMedia(m, today) {
  if (!m || !validMedia(m)) return 0;
  await tx('readwrite', st => st.clear());
  let n = 0;
  for (const [k, urls] of Object.entries(m)) {
    const frames = await Promise.all(urls.map(u => u ? fromDataUrl(u) : null));
    await tx('readwrite', st => st.put({ frames, updated: today }, k)); n++;
  }
  return n;
}
