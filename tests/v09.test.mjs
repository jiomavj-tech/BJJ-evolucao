import test from 'node:test';
import assert from 'node:assert/strict';
import { ATTACKS, LEADS_TO, CHAINS, NODES, togglePlan, gameLine, planFor, validGameplan } from '../gameplan.mjs';
import { TECH_BY_ID, TECHNIQUES } from '../techniques.mjs';
import { LOADS, AREAS, injuryFor, avoidedIds, validInjuries } from '../injuries.mjs';
import { BY_ID, DEFAULT_PROFILE, validateImport } from '../core.mjs';
import { buildQuick } from '../quick.mjs';
import { partnerStats, knownPartners, validBjjSession } from '../bjj.mjs';

test('mapa de jogo: todas as referências existem e toda técnica (fora guardas) aparece', () => {
  for (const [n, ids] of Object.entries(ATTACKS)) for (const id of ids) assert.ok(TECH_BY_ID[id], `${n}: ${id}`);
  for (const [id, n] of Object.entries(LEADS_TO)) { assert.ok(TECH_BY_ID[id], id); assert.ok(NODES.includes(n), `${id} → ${n}`); }
  for (const [id, ids] of Object.entries(CHAINS)) for (const x of [id, ...ids]) assert.ok(TECH_BY_ID[x], x);
  const used = new Set(Object.values(ATTACKS).flat());
  const missing = TECHNIQUES.filter(t => t.cat !== 'guarda' && !used.has(t.id)).map(t => t.id);
  assert.deepEqual(missing, []);
  for (const t of TECHNIQUES.filter(t => t.cat !== 'finalizacao' && used.has(t.id))) assert.ok(t.id in LEADS_TO, `sem destino: ${t.id}`);
});

test('plano A/B/C e linha do jogo', () => {
  let g = {};
  g = togglePlan(g, 'em_pe:a', 'q-puxada').gameplan;
  g = togglePlan(g, 'guarda_fechada:b', 'r-tesoura').gameplan;
  g = togglePlan(g, 'montada:a', 'f-americana').gameplan;
  const line = gameLine(g);
  assert.deepEqual(line.map(s => s.tech), ['q-puxada', 'r-tesoura', 'f-americana']);
  assert.ok(line.at(-1).finish);
  assert.ok(togglePlan(g, 'montada:a', 'q-puxada').error, 'técnica fora da posição');
  for (const id of ['f-armlock-montada', 'f-ezequiel']) g = togglePlan(g, 'montada:a', id).gameplan;
  assert.ok(togglePlan(g, 'montada:a', 'f-arm-triangle').error, 'máximo 3');
  g = togglePlan(g, 'montada:a', 'f-americana').gameplan;
  assert.deepEqual(planFor(g, 'montada:a'), ['f-armlock-montada', 'f-ezequiel']);
  assert.ok(gameLine({}).at(0).missing);
  assert.ok(validGameplan(g) && !validGameplan({ 'montada:a': ['q-puxada'] }) && !validGameplan({ 'x:y': [] }));
});

test('lesões: regiões válidas e filtro do treino', () => {
  for (const [a, ids] of Object.entries(LOADS)) { assert.ok(AREAS[a]); for (const id of ids) assert.ok(BY_ID[id], `${a}: ${id}`); }
  const knee = [{ id: '1', area: 'joelho', side: 'direito', pain: 6, start: '2026-11-10' }];
  assert.equal(injuryFor('agachamento', knee).level, 'evitar');
  assert.equal(injuryFor('flexao', knee), null);
  assert.equal(injuryFor('agachamento', [{ ...knee[0], painLog: [{ date: '2026-11-18', pain: 2 }] }]).level, 'cuidado');
  assert.equal(avoidedIds([{ ...knee[0], healed: '2026-11-18' }]).size, 0, 'curada não filtra');
  const p = { ...DEFAULT_PROFILE, level: 'intermediario', equipment: 'academia' };
  for (const m of [20, 30, 45]) { const ids = buildQuick(p, m, 60, 0, knee); assert.ok(ids.length >= 2); assert.ok(!ids.some(id => LOADS.joelho.includes(id)), ids.join()); }
  assert.ok(validInjuries(knee) && !validInjuries([{ ...knee[0], area: 'x' }]) && !validInjuries([{ ...knee[0], pain: 11 }]));
});

test('parceiros: estatística por faixa e validação', () => {
  const now = new Date('2026-11-19T12:00:00');
  const h = [{ type: 'bjj', date: '2026-11-18', partners: [{ name: 'João', belt: 'azul', out: 'fin' }, { name: 'joão ', belt: 'azul', out: 'tap' }, { name: 'Ana', belt: 'roxa', out: 'tap' }] }];
  const st = partnerStats(h, 90, now);
  assert.equal(st.total, 3);
  assert.deepEqual(st.byBelt.azul, { rolls: 2, fin: 1, tap: 1, emp: 0 });
  assert.equal(st.partners[0].rolls, 2, 'mesmo nome junta maiúscula e espaço');
  assert.equal(knownPartners(h).length, 2);
  assert.ok(validBjjSession(h[0]));
  assert.equal(validBjjSession({ partners: [{ name: '', belt: 'azul', out: 'fin' }] }), false);
  assert.equal(validBjjSession({ partners: [{ name: 'X', belt: 'verde', out: 'fin' }] }), false);
  const base = { schema: 1, profile: { ...DEFAULT_PROFILE }, history: [{ ...h[0], duration: 60, rounds: 3, rpe: 6 }] };
  assert.ok(validateImport({ ...base, gameplan: { 'em_pe:a': ['q-puxada'] }, injuries: [{ id: '1', area: 'joelho', pain: 3, start: '2026-11-10' }] }));
  assert.equal(validateImport({ ...base, injuries: [{ id: '1', area: 'joelho', pain: 30, start: '2026-11-10' }] }), false);
});
