/** Treino por tempo: estima a duração de cada exercício e monta uma sessão que cabe no tempo escolhido. */
import { EXERCISES, BY_ID, safe, makePlan } from './core.mjs';
import { avoidedIds } from './injuries.mjs';

const LIGHT = new Set(['aquecimento', 'mobilidade', 'recuperacao']);
export const REST_OPTIONS = [30, 45, 60, 90, 120];

/** Segundos de trabalho de UMA série, a partir da dose ("8–12", "15–25 s/lado", "3–5 min"...). */
export function workSeconds(ex) {
  const d = String(ex.dose || '').toLowerCase();
  const nums = (d.match(/\d+/g) || []).map(Number);
  const top = nums.length ? Math.max(...nums.slice(0, 2)) : 10;
  const sides = /lado/.test(d) ? 2 : 1;
  if (/min/.test(d)) return Math.round(((nums[0] || 3) + (nums[1] || nums[0] || 3)) / 2 * 60);
  if (/\d+\s*s\s*\/\s*\d+\s*s/.test(d)) return nums[0] + (nums[1] || 0);
  if (/\bs\b|seg/.test(d)) return top * sides;
  if (/ciclo/.test(d)) return top * 5;
  return top * 3 * sides; // repetições: ~3 s cada
}

export function restFor(ex, rest) { return LIGHT.has(ex.category) ? 15 : rest; }

/** Estimativa em segundos: séries × trabalho + descansos + 30 s de troca de exercício. */
export function estimateSeconds(ex, rest = 60) {
  const sets = Math.max(1, Number(ex.sets) || 1);
  return sets * workSeconds(ex) + (sets - 1) * restFor(ex, rest) + 30;
}
export function totalMinutes(ids, rest = 60) {
  return Math.round(ids.map(id => BY_ID[id]).filter(Boolean).reduce((n, ex) => n + estimateSeconds(ex, rest), 0) / 60);
}

export function eligible(profile, injuries = []) {
  const p = profile || {}, avoid = avoidedIds(injuries);
  return EXERCISES.filter(ex => safe(ex, p) && !avoid.has(ex.id) && (p.readiness > 2 || LIGHT.has(ex.category)));
}

/** Monta a sessão. variant alterna entre os dias do plano para variar os treinos. */
export function buildQuick(profile, minutes, rest = 60, variant = 0, injuries = []) {
  const budget = minutes * 60, pool = eligible(profile, injuries), ok = new Set(pool.map(e => e.id));
  const ids = [];
  const add = id => { if (ok.has(id) && !ids.includes(id)) ids.push(id); };
  const cost = list => list.reduce((n, id) => n + estimateSeconds(BY_ID[id], rest), 0);
  const recovery = profile.readiness <= 2;
  // Aquecimento curto
  add(minutes >= 20 ? 'marcha' : 'gato-vaca');
  if (!ids.length) add(pool.find(e => LIGHT.has(e.category))?.id);
  const cool = ['quadril90', 'toracica', 'gato-vaca', 'respirar'].find(id => ok.has(id) && !ids.includes(id));
  const coolCost = minutes >= 20 && cool ? estimateSeconds(BY_ID[cool], rest) : 0;
  // Principais: dia do plano (variando), depois o restante elegível
  const plan = makePlan(profile);
  const day = plan.days[variant % plan.days.length] || plan.days[0];
  const main = [...(day?.items || []).map(e => e.id), ...plan.days.flatMap(d => d.items.map(e => e.id)),
    ...pool.filter(e => recovery || !LIGHT.has(e.category)).map(e => e.id)]
    .filter(id => recovery || !LIGHT.has(BY_ID[id]?.category));
  for (const id of main) {
    if (ids.includes(id) || !ok.has(id)) continue;
    if (cost([...ids, id]) + coolCost > budget) continue;
    ids.push(id);
    if (ids.length >= 12) break;
  }
  if (coolCost && !ids.includes(cool) && cost([...ids, cool]) <= budget + 60) ids.push(cool);
  return ids;
}

/** Próxima alternativa do mesmo tipo (categoria), que ainda não está na lista. */
export function swapOptions(profile, id, current, injuries = []) {
  const ex = BY_ID[id]; if (!ex) return [];
  const alt = eligible(profile, injuries).filter(e => e.id !== id && !current.includes(e.id) && e.category === ex.category);
  return [...alt.filter(e => e.pattern === ex.pattern), ...alt.filter(e => e.pattern !== ex.pattern)];
}
