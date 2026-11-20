import test from 'node:test';
import assert from 'node:assert/strict';
import { planEnd, occurrences, statuses, pendingList, adherence, planIcs, googleCalendarUrl, validPlan, slotMinutes } from '../schedule.mjs';
import { buckets, METRICS, stackedBars } from '../charts.mjs';
import { validateImport, DEFAULT_PROFILE } from '../core.mjs';

const plan = {
  id: 'p1', name: 'Dezembro', start: '2026-11-20', length: 'semana', end: '2026-11-26', log: {},
  slots: [
    { id: 'm', kind: 'bjj', start: '07:00', end: '08:00', days: [1, 2, 3, 4, 5] },
    { id: 'n', kind: 'bjj', start: '19:00', end: '22:00', days: [1, 2, 3, 4, 5] },
    { id: 'c', kind: 'fisico', start: '12:00', end: '12:40', days: [3], label: 'calistenia' }
  ]
};

test('duração do plano', () => {
  assert.equal(planEnd('2026-11-20', 'dia'), '2026-11-20');
  assert.equal(planEnd('2026-11-20', 'semana'), '2026-11-26');
  assert.equal(planEnd('2026-11-20', 'mes'), '2026-12-19');
  assert.equal(planEnd('2026-11-20', 'tri'), '2027-02-19');
  assert.equal(planEnd('2026-01-31', 'mes'), '2026-02-27');
  assert.equal(slotMinutes(plan.slots[1]), 180);
  assert.equal(slotMinutes({ start: '23:00', end: '00:30' }), 90);
});

test('ocorrências: sex 20 a qui 26 → 5 dias úteis × 2 de BJJ + 1 calistenia na quarta', () => {
  const o = occurrences(plan, plan.start, plan.end);
  assert.equal(o.filter(x => x.slot.kind === 'bjj').length, 10);
  assert.deepEqual(o.filter(x => x.slot.kind === 'fisico').map(x => x.date), ['2026-11-25']);
  assert.deepEqual(o.slice(0, 2).map(x => x.slot.start), ['07:00', '19:00'], 'manhã antes da noite');
});

test('cobrança: treino do diário conta sozinho; o resto fica pendente só depois do horário', () => {
  const now = new Date('2026-11-23T23:00:00'); // segunda à noite
  const history = [{ id: 'h1', type: 'bjj', date: '2026-11-20', duration: 60 }];
  const st = statuses(plan, history, now);
  const fri = st.filter(o => o.date === '2026-11-20');
  assert.equal(fri[0].status, 'feito'); assert.ok(fri[0].auto);
  assert.equal(fri[1].status, 'pendente');
  assert.equal(st.find(o => o.date === '2026-11-24').status, 'futuro');
  const pend = pendingList(plan, history, now);
  assert.deepEqual(pend.map(o => o.key), ['2026-11-20|n', '2026-11-23|m', '2026-11-23|n']);
  const withLog = { ...plan, log: { '2026-11-23|m': { s: 'nao', r: 'trabalho' }, '2026-11-23|n': { s: 'feito', id: 'x' } } };
  const ad = adherence(withLog, history, now);
  assert.deepEqual([ad.done, ad.missed, ad.pending, ad.past, ad.total], [2, 1, 1, 4, 11]);
  assert.equal(ad.pct, 50);
  assert.deepEqual(ad.reasons, { trabalho: 1 });
  assert.equal(statuses(plan, [], new Date('2026-11-23T07:30:00')).find(o => o.key === '2026-11-23|m').status, 'agora');
});

test('agenda do celular: .ics com repetição semanal, avisos e link; Google Agenda com recur', () => {
  const ics = planIcs(plan, 'https://x.github.io/app/', new Date('2026-11-20T10:00:00Z'));
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n') && ics.endsWith('END:VCALENDAR\r\n'));
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 3);
  assert.match(ics, /DTSTART:20261120T070000/);
  assert.match(ics, /RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20261126T235959/);
  assert.match(ics, /DTSTART:20261125T120000/);
  assert.match(ics, /TRIGGER:-PT15M/); assert.match(ics, /TRIGGER;RELATED=END:PT5M/);
  assert.match(ics, /confirmar=1/);
  const g = googleCalendarUrl(plan, plan.slots[1], 'https://x/');
  assert.match(decodeURIComponent(g), /recur=RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20261126/);
  assert.match(decodeURIComponent(g), /dates=20261120T190000\/20261120T220000/);
});

test('validação do plano no backup', () => {
  assert.ok(validPlan(plan) && validPlan(null) && validPlan(undefined));
  assert.equal(validPlan({ ...plan, slots: [{ ...plan.slots[0], start: '25:00' }] }), false);
  assert.equal(validPlan({ ...plan, log: { 'x': { s: 'feito' } } }), false);
  assert.equal(validPlan({ ...plan, log: { '2026-11-20|m': { s: 'nao', r: 'preguica' } } }), false);
  const base = { schema: 1, profile: { ...DEFAULT_PROFILE }, history: [] };
  assert.ok(validateImport({ ...base, plan, planHistory: [{ name: 'Nov', start: '2026-11-01', end: '2026-11-07', done: 3, past: 4 }] }));
});

test('gráficos: semanas de segunda a domingo e somas por período', () => {
  const now = new Date('2026-11-20T12:00:00'); // sexta
  const h = [
    { type: 'bjj', date: '2026-11-16', duration: 60, sweeps: 2, passes: 1, given: ['f-kimura'] },
    { type: 'fisico', date: '2026-11-20', duration: 30 },
    { type: 'bjj', date: '2026-11-15', duration: 90, takedowns: 3 }
  ];
  const b = buckets(h, '4s', now);
  assert.equal(b.length, 4);
  assert.equal(b[3].from, '2026-11-16'); assert.equal(b[3].to, '2026-11-22');
  assert.equal(METRICS.bjj.value(b[3]), 1); assert.equal(METRICS.fisico.value(b[3]), 1);
  assert.equal(METRICS.sweeps.value(b[3]), 2); assert.equal(METRICS.given.value(b[3]), 1);
  assert.equal(METRICS.takedowns.value(b[2]), 3); assert.equal(METRICS.minBjj.value(b[2]), 90);
  assert.equal(buckets(h, '6m', now).length, 6);
  const svg = stackedBars({ id: 't', data: b, series: [{ metric: 'bjj', color: '#000' }, { metric: 'fisico', color: '#111' }], selected: 3 });
  assert.equal((svg.match(/data-action="chartPick"/g) || []).length, 4);
  assert.match(svg, /class="sel"/);
});
