/** Faixa, graus e estatísticas técnicas do diário de jiu-jitsu. Funções puras. */
import { TECH_BY_ID, TROUBLE_SPOTS, SESSION_KINDS } from './techniques.mjs';

export const BELTS = {
  branca: { label: 'Branca', color: '#f1f1ec', bar: '#111', maxDegrees: 4, next: 'azul' },
  azul:   { label: 'Azul',   color: '#1f5fbf', bar: '#111', maxDegrees: 4, next: 'roxa' },
  roxa:   { label: 'Roxa',   color: '#6a2c91', bar: '#111', maxDegrees: 4, next: 'marrom' },
  marrom: { label: 'Marrom', color: '#6b4226', bar: '#111', maxDegrees: 4, next: 'preta' },
  preta:  { label: 'Preta',  color: '#151515', bar: '#c8102e', maxDegrees: 6, next: null }
};

/** Tempo mínimo na faixa (adulto, 18+) pelo Sistema Geral de Graduação da IBJJF.
 *  Referência: ibjjf.com — Sistema Geral de Graduação, art. 3. A academia pode ter critérios próprios. */
export const IBJJF_MIN_MONTHS = { branca: 0, azul: 24, roxa: 18, marrom: 12 };

export const DEFAULT_BELT_STATE = Object.freeze({ promotions: [], goals: [], monthlyGoal: 12 });

const DAY = 864e5;
const parse = d => new Date(d + 'T12:00:00');
const validDate = d => typeof d === 'string' && /^\d{4}-\d\d-\d\d$/.test(d) && !Number.isNaN(parse(d).valueOf());

export function normalizeBelt(obj) {
  const b = obj && typeof obj === 'object' ? obj : {};
  return {
    promotions: Array.isArray(b.promotions) ? b.promotions.filter(p => p && BELTS[p.belt] && validDate(p.date)) : [],
    goals: Array.isArray(b.goals) ? b.goals : [],
    monthlyGoal: Number.isInteger(b.monthlyGoal) && b.monthlyGoal >= 0 && b.monthlyGoal <= 31 ? b.monthlyGoal : 12
  };
}

export function sortedPromotions(beltState) {
  return [...(beltState?.promotions || [])].sort((a, b) => a.date.localeCompare(b.date) || BELT_ORDER(a.belt) - BELT_ORDER(b.belt) || a.degrees - b.degrees);
}
function BELT_ORDER(b) { return Object.keys(BELTS).indexOf(b); }

/** Faixa atual = graduação registrada mais recente. Sem registros, usa a faixa do perfil. */
export function currentBelt(beltState, profileBelt = 'branca') {
  const list = sortedPromotions(beltState);
  if (!list.length) return { belt: BELTS[profileBelt] ? profileBelt : 'branca', degrees: 0, beltSince: null, degreeSince: null };
  const last = list[list.length - 1];
  let beltSince = last.date;
  for (let i = list.length - 1; i >= 0 && list[i].belt === last.belt; i--) beltSince = list[i].date;
  return { belt: last.belt, degrees: last.degrees, beltSince, degreeSince: last.date };
}

export function beltStats(beltState, history, profileBelt, now = new Date()) {
  const cur = currentBelt(beltState, profileBelt);
  const days = since => since ? Math.max(0, Math.floor((now - parse(since)) / DAY)) : null;
  const bjj = (history || []).filter(s => s.type === 'bjj');
  const after = since => since ? bjj.filter(s => s.date >= since) : bjj;
  const sinceDegree = after(cur.degreeSince), inBelt = after(cur.beltSince);
  const minMonths = IBJJF_MIN_MONTHS[cur.belt] ?? null;
  const daysInBelt = days(cur.beltSince);
  return {
    ...cur,
    info: BELTS[cur.belt],
    daysInBelt,
    daysSinceDegree: days(cur.degreeSince),
    sessionsSinceDegree: sinceDegree.length,
    hoursSinceDegree: Math.round(sinceDegree.reduce((n, s) => n + (Number(s.duration) || 0), 0) / 60),
    sessionsInBelt: inBelt.length,
    hoursInBelt: Math.round(inBelt.reduce((n, s) => n + (Number(s.duration) || 0), 0) / 60),
    minMonths,
    minProgress: minMonths && daysInBelt !== null ? Math.min(1, daysInBelt / (minMonths * 30.44)) : null,
    nextBelt: BELTS[cur.belt].next
  };
}

export function formatDuration(days) {
  if (days === null || days === undefined) return '—';
  if (days < 31) return `${days} ${days === 1 ? 'dia' : 'dias'}`;
  const months = Math.floor(days / 30.44);
  if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  const y = Math.floor(months / 12), m = months % 12;
  return `${y} ${y === 1 ? 'ano' : 'anos'}${m ? ` e ${m} ${m === 1 ? 'mês' : 'meses'}` : ''}`;
}

function inWindow(history, days, now) {
  const start = new Date(now); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - (days - 1));
  return (history || []).filter(s => s.type === 'bjj' && parse(s.date) >= start && parse(s.date) <= new Date(now.getTime() + DAY));
}
function tally(list) {
  const m = {};
  for (const id of list) m[id] = (m[id] || 0) + 1;
  return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([id, n]) => ({ id, n }));
}

/** Estatísticas técnicas do diário numa janela de dias. */
export function bjjStats(history, days = 30, now = new Date()) {
  const s = inWindow(history, days, now);
  const given = s.flatMap(x => x.given || []), taken = s.flatMap(x => x.taken || []);
  const sum = k => s.reduce((n, x) => n + (Number(x[k]) || 0), 0);
  return {
    sessions: s.length,
    rounds: sum('rounds'),
    // Rolas só dos treinos em que as finalizações foram registradas (evita média falsa com registros antigos).
    roundsTracked: s.filter(x => Array.isArray(x.given) || Array.isArray(x.taken)).reduce((n, x) => n + (Number(x.rounds) || 0), 0),
    given: given.length, taken: taken.length,
    topGiven: tally(given).slice(0, 5), topTaken: tally(taken).slice(0, 5),
    sweeps: sum('sweeps'), passes: sum('passes'), takedowns: sum('takedowns'),
    trouble: tally(s.flatMap(x => x.trouble || [])).slice(0, 5),
    worked: tally(s.flatMap(x => x.worked || [])).slice(0, 8),
    kinds: tally(s.map(x => x.kind).filter(Boolean))
  };
}

/** Quantos treinos de BJJ no mês corrente, para a meta mensal. */
export function monthSessions(history, now = new Date()) {
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return (history || []).filter(s => s.type === 'bjj' && s.date.startsWith(ym)).length;
}

/** Contagem por técnica em todo o histórico: aplicada, sofrida, treinada. */
export function techniqueHistory(history, id) {
  const bjj = (history || []).filter(s => s.type === 'bjj');
  const count = k => bjj.reduce((n, s) => n + (s[k] || []).filter(x => x === id).length, 0);
  return { given: count('given'), taken: count('taken'), worked: count('worked') };
}

export function techName(id) { return TECH_BY_ID[id]?.name || (id === 'outra' ? 'Outra finalização' : id); }

// ── Validação de backup ──────────────────────────────────────
const idList = (v, max) => v === undefined || (Array.isArray(v) && v.length <= max && v.every(x => typeof x === 'string' && x.length <= 40));
const smallInt = (v, max) => v === undefined || (Number.isInteger(v) && v >= 0 && v <= max);

export function validBjjSession(s) {
  return idList(s.given, 30) && idList(s.taken, 30) && idList(s.worked, 30) &&
    (s.trouble === undefined || (Array.isArray(s.trouble) && s.trouble.length <= 10 && s.trouble.every(k => k in TROUBLE_SPOTS))) &&
    (s.kind === undefined || s.kind in SESSION_KINDS) &&
    smallInt(s.sweeps, 50) && smallInt(s.passes, 50) && smallInt(s.takedowns, 50);
}

export function validBeltState(b) {
  if (b === undefined) return true;
  if (!b || typeof b !== 'object' || Array.isArray(b)) return false;
  if (!Array.isArray(b.promotions) || b.promotions.length > 60) return false;
  if (!b.promotions.every(p => p && validDate(p.date) && BELTS[p.belt] && Number.isInteger(p.degrees) && p.degrees >= 0 && p.degrees <= BELTS[p.belt].maxDegrees && (p.note === undefined || (typeof p.note === 'string' && p.note.length <= 200)))) return false;
  if (!Array.isArray(b.goals) || b.goals.length > 30 || !b.goals.every(g => g && typeof g.text === 'string' && g.text.length <= 120 && typeof g.done === 'boolean')) return false;
  return b.monthlyGoal === undefined || (Number.isInteger(b.monthlyGoal) && b.monthlyGoal >= 0 && b.monthlyGoal <= 31);
}
