/** Plano de treinos com horários (1 dia, 1 semana, 1 mês ou 3 meses): ocorrências, cobrança,
 * cumprimento e exportação para a agenda do celular. Funções puras. */

export const PLAN_LENGTHS = { dia: '1 dia', semana: '1 semana', mes: '1 mês', tri: '3 meses' };
export const SLOT_KINDS = { bjj: 'Jiu-jitsu', fisico: 'Treino físico' };
export const REASONS = { lesao: 'Lesão ou dor', cansaco: 'Cansaço', trabalho: 'Trabalho ou família', academia: 'Academia fechada', outro: 'Outro motivo' };
export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const ICS_DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

const D = s => new Date(s + 'T12:00:00');
export const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const addDays = (s, n) => { const d = D(s); d.setDate(d.getDate() + n); return iso(d); };
const addMonths = (s, n) => { const d = D(s), day = d.getDate(); d.setDate(1); d.setMonth(d.getMonth() + n); d.setDate(Math.min(day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate())); return iso(d); };
const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
export const slotMinutes = s => { const d = toMin(s.end) - toMin(s.start); return d > 0 ? d : d + 1440; };

export function planEnd(start, length) {
  if (length === 'dia') return start;
  if (length === 'semana') return addDays(start, 6);
  if (length === 'mes') return addDays(addMonths(start, 1), -1);
  return addDays(addMonths(start, 3), -1);
}

/** Ocorrências do plano entre duas datas (inclusive), em ordem. */
export function occurrences(plan, from, to) {
  if (!plan?.slots?.length) return [];
  const a = from > plan.start ? from : plan.start, b = to < plan.end ? to : plan.end, out = [];
  for (let d = a; d <= b; d = addDays(d, 1)) {
    const wd = D(d).getDay();
    for (const slot of [...plan.slots].sort((x, y) => x.start.localeCompare(y.start)))
      if (plan.length === 'dia' || slot.days.includes(wd)) out.push({ date: d, slot, key: `${d}|${slot.id}` });
  }
  return out;
}

function endsAt(occ) { const d = D(occ.date); d.setHours(0, toMin(occ.slot.start) + slotMinutes(occ.slot), 0, 0); return d; }
function startsAt(occ) { const d = D(occ.date); d.setHours(0, toMin(occ.slot.start), 0, 0); return d; }

/** Situação de cada ocorrência: feito, nao, pendente (já passou, sem resposta) ou futuro.
 * Treino registrado no diário no mesmo dia e tipo conta como feito, sem precisar confirmar de novo. */
export function statuses(plan, history, now = new Date(), from = plan?.start, to = plan?.end) {
  const occs = occurrences(plan, from, to), log = plan?.log || {};
  const linked = new Set(Object.values(log).map(v => v.id).filter(Boolean));
  const free = {};
  for (const s of history || []) if (!linked.has(s.id)) (free[`${s.date}|${s.type}`] ||= []).push(s.id);
  return occs.map(o => {
    const l = log[o.key];
    if (l?.s === 'feito') return { ...o, status: 'feito', sessionId: l.id };
    if (l?.s === 'nao') return { ...o, status: 'nao', reason: l.r };
    const pool = free[`${o.date}|${o.slot.kind}`];
    if (pool?.length) return { ...o, status: 'feito', sessionId: pool.shift(), auto: true };
    return { ...o, status: endsAt(o) <= now ? 'pendente' : (startsAt(o) <= now ? 'agora' : 'futuro') };
  });
}

export function pendingList(plan, history, now = new Date(), maxDays = 14) {
  if (!plan) return [];
  const from = addDays(iso(now), -maxDays);
  return statuses(plan, history, now, from, iso(now)).filter(o => o.status === 'pendente');
}

export function adherence(plan, history, now = new Date()) {
  const st = statuses(plan, history, now).filter(o => o.status !== 'futuro' && o.status !== 'agora');
  const reasons = {};
  st.filter(o => o.status === 'nao').forEach(o => { reasons[o.reason || 'outro'] = (reasons[o.reason || 'outro'] || 0) + 1; });
  const done = st.filter(o => o.status === 'feito').length, missed = st.filter(o => o.status === 'nao').length;
  return { done, missed, pending: st.length - done - missed, past: st.length, total: occurrences(plan, plan.start, plan.end).length, reasons, pct: st.length ? Math.round(100 * done / st.length) : 0 };
}

export const planActive = (plan, now = new Date()) => !!plan && iso(now) <= plan.end;

// ── Agenda do celular ─────────────────────────────────────────
const icsText = t => String(t).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const stamp = (date, time) => date.replace(/-/g, '') + 'T' + time.replace(':', '') + '00';
function firstDate(plan, slot) {
  for (let d = plan.start; d <= plan.end; d = addDays(d, 1)) if (plan.length === 'dia' || slot.days.includes(D(d).getDay())) return d;
  return null;
}
function endStamp(date, slot) { const e = toMin(slot.start) + slotMinutes(slot); const day = e >= 1440 ? addDays(date, 1) : date; const m = e % 1440; return stamp(day, `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`); }
const titleOf = s => s.label ? `${SLOT_KINDS[s.kind]}: ${s.label}` : SLOT_KINDS[s.kind];

/** Arquivo .ics (horário local do celular): um evento repetido por horário do plano, com aviso 15 min antes
 * e outro no fim, pedindo para confirmar no app. */
export function planIcs(plan, appUrl, now = new Date()) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BJJ Evolucao//Plano//PT', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  const dtstamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  for (const s of plan.slots) {
    const first = firstDate(plan, s); if (!first) continue;
    lines.push('BEGIN:VEVENT', `UID:${s.id}-${plan.id}@bjj-evolucao`, `DTSTAMP:${dtstamp}`, `DTSTART:${stamp(first, s.start)}`, `DTEND:${endStamp(first, s)}`,
      `SUMMARY:${icsText(titleOf(s))}`, `DESCRIPTION:${icsText(`Plano ${plan.name}. Depois do treino, confirme no app: ${appUrl}?confirmar=1`)}`, `URL:${appUrl}?confirmar=1`);
    if (plan.length !== 'dia') lines.push(`RRULE:FREQ=WEEKLY;BYDAY=${s.days.map(d => ICS_DAYS[d]).join(',')};UNTIL=${plan.end.replace(/-/g, '')}T235959`);
    lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsText(titleOf(s) + ' em 15 minutos')}`, 'TRIGGER:-PT15M', 'END:VALARM',
      'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsText('Confirme o treino no app BJJ Evolução')}`, 'TRIGGER;RELATED=END:PT5M', 'END:VALARM', 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}

/** Link "adicionar à Google Agenda" para um horário, já com repetição semanal até o fim do plano. */
export function googleCalendarUrl(plan, slot, appUrl) {
  const first = firstDate(plan, slot); if (!first) return null;
  const p = new URLSearchParams({ action: 'TEMPLATE', text: titleOf(slot), dates: `${stamp(first, slot.start)}/${endStamp(first, slot)}`, ctz: 'America/Sao_Paulo',
    details: `Plano ${plan.name}. Depois do treino, confirme no app: ${appUrl}?confirmar=1` });
  if (plan.length !== 'dia') p.set('recur', `RRULE:FREQ=WEEKLY;BYDAY=${slot.days.map(d => ICS_DAYS[d]).join(',')};UNTIL=${plan.end.replace(/-/g, '')}`);
  return 'https://calendar.google.com/calendar/render?' + p.toString();
}

// ── Validação de backup ───────────────────────────────────────
const vDate = d => typeof d === 'string' && /^\d{4}-\d\d-\d\d$/.test(d);
const vTime = t => typeof t === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(t);
export function validSlot(s) {
  return s && typeof s.id === 'string' && s.id.length <= 60 && s.kind in SLOT_KINDS && vTime(s.start) && vTime(s.end) && s.start !== s.end &&
    Array.isArray(s.days) && s.days.length <= 7 && s.days.every(d => Number.isInteger(d) && d >= 0 && d <= 6) &&
    (s.label === undefined || (typeof s.label === 'string' && s.label.length <= 40));
}
export function validPlan(p) {
  if (p === undefined || p === null) return true;
  return typeof p === 'object' && typeof p.id === 'string' && typeof p.name === 'string' && p.name.length <= 60 && p.length in PLAN_LENGTHS &&
    vDate(p.start) && vDate(p.end) && p.end >= p.start && Array.isArray(p.slots) && p.slots.length >= 1 && p.slots.length <= 20 && p.slots.every(validSlot) &&
    (p.log === undefined || (typeof p.log === 'object' && !Array.isArray(p.log) && Object.keys(p.log).length <= 2000 &&
      Object.entries(p.log).every(([k, v]) => /^\d{4}-\d\d-\d\d\|.{1,60}$/.test(k) && v && (v.s === 'feito' || v.s === 'nao') && (v.r === undefined || v.r in REASONS) && (v.id === undefined || typeof v.id === 'string'))));
}
export function validPlanHistory(h) {
  return h === undefined || (Array.isArray(h) && h.length <= 50 && h.every(x => x && typeof x.name === 'string' && x.name.length <= 60 && vDate(x.start) && vDate(x.end) && Number.isInteger(x.done) && Number.isInteger(x.past)));
}
