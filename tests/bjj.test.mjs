import test from 'node:test';
import assert from 'node:assert/strict';
import { TECHNIQUES, TECH_BY_ID, TECH_CATEGORIES, TROUBLE_SPOTS, filterTechniques, techniqueSummary, validTechState } from '../techniques.mjs';
import { BELTS, currentBelt, beltStats, bjjStats, monthSessions, techniqueHistory, validBeltState, validBjjSession, normalizeBelt, formatDuration } from '../bjj.mjs';
import { validateImport, DEFAULT_PROFILE } from '../core.mjs';

test('catálogo de técnicas: ids únicos, categorias válidas e pontos-chave', () => {
  assert.equal(new Set(TECHNIQUES.map(t => t.id)).size, TECHNIQUES.length);
  assert.ok(TECHNIQUES.length >= 45);
  for (const t of TECHNIQUES) {
    assert.ok(TECH_CATEGORIES[t.cat], t.id);
    assert.ok(t.points.length >= 2 && t.points.every(p => p.length > 10), t.id);
    assert.ok([1, 2, 3].includes(t.level) && ['ambos', 'kimono'].includes(t.gi), t.id);
  }
  for (const spot of Object.values(TROUBLE_SPOTS)) assert.ok(spot.study === null || TECH_BY_ID[spot.study], spot.label);
});

test('faixa atual vem da graduação mais recente e conta treinos desde então', () => {
  const belt = normalizeBelt({ promotions: [
    { id: '1', date: '2024-03-10', belt: 'branca', degrees: 4 },
    { id: '2', date: '2025-01-15', belt: 'azul', degrees: 0 },
    { id: '3', date: '2025-09-01', belt: 'azul', degrees: 1 }
  ] });
  const cur = currentBelt(belt);
  assert.deepEqual(cur, { belt: 'azul', degrees: 1, beltSince: '2025-01-15', degreeSince: '2025-09-01' });
  const history = [
    { type: 'bjj', date: '2025-08-30', duration: 60 },
    { type: 'bjj', date: '2025-09-02', duration: 90 },
    { type: 'fisico', date: '2025-09-03', duration: 30 },
    { type: 'bjj', date: '2025-10-01', duration: 30 }
  ];
  const s = beltStats(belt, history, 'branca', new Date('2026-01-15T12:00:00'));
  assert.equal(s.sessionsSinceDegree, 2);
  assert.equal(s.hoursSinceDegree, 2);
  assert.equal(s.sessionsInBelt, 3);
  assert.equal(s.minMonths, 24);
  assert.ok(s.minProgress > 0.45 && s.minProgress < 0.5);
});

test('sem graduações usa a faixa do perfil', () => {
  assert.equal(currentBelt(normalizeBelt(), 'roxa').belt, 'roxa');
  assert.equal(currentBelt(normalizeBelt(), 'outro').belt, 'branca');
});

test('estatísticas do diário: finalizações, raspagens e onde sofre', () => {
  const now = new Date('2026-11-17T12:00:00');
  const h = [
    { type: 'bjj', date: '2026-11-10', duration: 60, rounds: 4, given: ['f-triangulo', 'f-triangulo'], taken: ['f-mata-leao'], sweeps: 2, passes: 1, trouble: ['costas'], worked: ['f-triangulo'] },
    { type: 'bjj', date: '2026-11-15', duration: 60, rounds: 4, given: ['f-kimura'], taken: ['f-mata-leao'], sweeps: 1, trouble: ['costas', 'montada'] },
    { type: 'bjj', date: '2026-09-01', duration: 60, rounds: 4, given: ['f-americana'] }
  ];
  const st = bjjStats(h, 30, now);
  assert.equal(st.sessions, 2);
  assert.equal(st.given, 3);
  assert.equal(st.taken, 2);
  assert.equal(st.sweeps, 3);
  assert.equal(st.roundsTracked, 8);
  assert.deepEqual(st.topGiven[0], { id: 'f-triangulo', n: 2 });
  assert.deepEqual(st.topTaken[0], { id: 'f-mata-leao', n: 2 });
  assert.deepEqual(st.trouble[0], { id: 'costas', n: 2 });
  assert.equal(monthSessions(h, now), 2);
  assert.deepEqual(techniqueHistory(h, 'f-triangulo'), { given: 2, taken: 0, worked: 1 });
});

test('filtros e resumo de técnicas', () => {
  const st = { 'f-triangulo': { status: 3, focus: true }, 'g-meia': { status: 2 } };
  assert.equal(techniqueSummary(st).counts[3], 1);
  assert.equal(techniqueSummary(st).focus.length, 1);
  assert.deepEqual(filterTechniques({ status: 'foco' }, st).map(t => t.id), ['f-triangulo']);
  assert.ok(filterTechniques({ q: 'MONTADA' }).length >= 3);
  assert.ok(filterTechniques({ cat: 'finalizacao' }).every(t => t.cat === 'finalizacao'));
});

test('validação de backup aceita dados novos e rejeita dados corrompidos', () => {
  const base = { schema: 1, profile: { ...DEFAULT_PROFILE }, history: [{ type: 'bjj', date: '2026-11-17', duration: 60, rounds: 3, rpe: 6, given: ['f-kimura'], kind: 'nogi', sweeps: 2, trouble: ['costas'] }] };
  assert.ok(validateImport(base), 'backup antigo + campos novos');
  assert.ok(validateImport({ ...base, belt: { promotions: [{ id: 'a', date: '2025-01-01', belt: 'azul', degrees: 2 }], goals: [{ id: 'g', text: 'Fugir da montada', done: false }], monthlyGoal: 12 }, techniques: { 'f-kimura': { status: 3, focus: true, note: 'ok' } } }));
  assert.equal(validateImport({ ...base, belt: { promotions: [{ date: '2025-01-01', belt: 'azul', degrees: 9 }], goals: [] } }), false, 'graus acima do máximo');
  assert.equal(validateImport({ ...base, techniques: { 'f-kimura': { status: 7 } } }), false);
  assert.equal(validateImport({ ...base, history: [{ ...base.history[0], sweeps: -1 }] }), false);
  assert.equal(validateImport({ ...base, history: [{ ...base.history[0], trouble: ['inexistente'] }] }), false);
  assert.ok(validBjjSession({}) && validBeltState(undefined) && validTechState(undefined));
  assert.equal(BELTS.preta.maxDegrees, 6);
});

test('formatação de tempo de faixa', () => {
  assert.equal(formatDuration(5), '5 dias');
  assert.equal(formatDuration(100), '3 meses');
  assert.equal(formatDuration(800), '2 anos e 2 meses');
  assert.equal(formatDuration(null), '—');
});
