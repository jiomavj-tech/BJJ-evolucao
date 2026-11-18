import test from 'node:test';
import assert from 'node:assert/strict';
import { buildQuick, totalMinutes, workSeconds, swapOptions, restFor } from '../quick.mjs';
import { BY_ID, DEFAULT_PROFILE, EXERCISES } from '../core.mjs';
import { TECHNIQUES } from '../techniques.mjs';
import { positionFor, positionSvg, POSITION_KEYS } from '../positions.mjs';
import { remoteImages } from '../visuals.mjs';
import { existsSync } from 'node:fs';

const gym = { ...DEFAULT_PROFILE, level: 'intermediario', equipment: 'academia', readiness: 3 };

test('treino por tempo cabe no tempo escolhido e não repete exercícios', () => {
  for (const p of [DEFAULT_PROFILE, gym]) for (const m of [15, 20, 30, 45, 60]) {
    const ids = buildQuick(p, m, 60, 0);
    assert.ok(ids.length >= 2, `${m} min`);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(totalMinutes(ids, 60) <= m + 1, `${m} min → ${totalMinutes(ids, 60)}`);
  }
});

test('energia baixa monta só mobilidade e recuperação', () => {
  const ids = buildQuick({ ...gym, readiness: 2 }, 30, 60, 0);
  assert.ok(ids.every(id => ['aquecimento', 'mobilidade', 'recuperacao'].includes(BY_ID[id].category)), ids.join());
});

test('estimativa de tempo e descanso', () => {
  assert.equal(workSeconds(BY_ID['flexao']), 36);
  assert.equal(workSeconds(BY_ID['lateral']), 50);
  assert.equal(workSeconds(BY_ID['marcha']), 240);
  assert.equal(restFor(BY_ID['gato-vaca'], 90), 15);
  assert.equal(restFor(BY_ID['flexao'], 90), 90);
  const alt = swapOptions(gym, 'flexao', ['flexao']);
  assert.ok(alt.length && alt.every(e => e.category === 'forca' && e.id !== 'flexao'));
});

test('toda técnica tem desenho de posição e todo desenho é válido', () => {
  for (const t of TECHNIQUES) assert.ok(positionFor(t.id), t.id);
  for (const k of POSITION_KEYS) assert.match(positionSvg(k, 'a'), /^<svg[\s\S]*<\/svg>$/);
});

test('fotos locais existem no repositório', () => {
  let local = 0;
  for (const ex of EXERCISES) {
    const m = remoteImages(ex);
    if (m?.offline && m.photos) { local++; for (const f of m.photos) assert.ok(existsSync(new URL('../' + f.slice(2), import.meta.url)), f); }
  }
  assert.ok(local >= 27, `fotos offline: ${local}`);
});

test('todo exercício tem imagem: foto, desenho ou guia de drill', async () => {
  const { bjjDiagram } = await import('../visuals.mjs');
  const missing = EXERCISES.filter(ex => !remoteImages(ex) && !bjjDiagram(ex)).map(ex => ex.id);
  assert.deepEqual(missing, []);
  const remote = EXERCISES.filter(ex => remoteImages(ex) && !remoteImages(ex).offline).map(ex => ex.id);
  assert.deepEqual(remote, [], 'todas as imagens principais devem funcionar offline');
});
