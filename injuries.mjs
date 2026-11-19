/** Lesões e dores: registro simples e ligação com os exercícios do plano físico.
 * Regra: lesão ativa com dor ≥ 3 tira do treino os exercícios que carregam a região;
 * dor 1–2 mantém o exercício com aviso de cuidado. Não substitui avaliação profissional. */

export const AREAS = {
  pescoco: 'Pescoço', ombro: 'Ombro', cotovelo: 'Cotovelo', punho: 'Punho e mão', dedos: 'Dedos',
  costelas: 'Costelas', lombar: 'Lombar', quadril: 'Quadril', joelho: 'Joelho', tornozelo: 'Tornozelo e pé'
};
export const SIDES = { direito: 'direito', esquerdo: 'esquerdo', ambos: 'dos dois lados', centro: '' };

// Exercícios que carregam cada região (ids de core.mjs).
export const LOADS = {
  pescoco: ['sprawl', 'technical-stand', 'barra', 'puxada', 'farmer'],
  ombro: ['flexao-parede', 'flexao', 'flexao-tempo', 'barra', 'suspensao', 'supino', 'puxada', 'prancha', 'lateral', 'technical-stand', 'base-shift', 'sprawl', 'toracica', 'bird-dog', 'saltitos'],
  cotovelo: ['flexao-parede', 'flexao', 'flexao-tempo', 'barra', 'suspensao', 'supino', 'puxada', 'remada-elastico', 'remada-maquina', 'remada-isom', 'farmer', 'toalha', 'lateral'],
  punho: ['flexao-parede', 'flexao', 'flexao-tempo', 'prancha', 'gato-vaca', 'toracica', 'bird-dog', 'base-shift', 'technical-stand', 'sprawl', 'supino', 'farmer', 'toalha', 'barra', 'suspensao'],
  dedos: ['toalha', 'farmer', 'barra', 'suspensao', 'remada-isom', 'remada-elastico', 'remada-maquina', 'puxada'],
  costelas: ['prancha', 'lateral', 'sprawl', 'shrimp', 'pallof', 'deadbug', 'toracica'],
  lombar: ['terra-romeno', 'farmer', 'legpress', 'sprawl', 'remada-maquina', 'remada-isom', 'agachamento', 'afundo', 'stepup'],
  quadril: ['quadril90', 'afundo', 'agachamento', 'agachamento-caixa', 'legpress', 'ponte-uni', 'stepup', 'shrimp', 'base-shift', 'technical-stand'],
  joelho: ['agachamento', 'agachamento-caixa', 'afundo', 'stepup', 'legpress', 'sprawl', 'technical-stand', 'base-shift', 'saltitos', 'intervalo-marcha', 'quadril90', 'bike'],
  tornozelo: ['saltitos', 'stepup', 'afundo', 'agachamento', 'intervalo-marcha', 'caminhada', 'marcha', 'sprawl', 'farmer']
};

export const RED_FLAGS = 'Procure um médico ou fisioterapeuta se a dor for 7 ou mais, se houver inchaço, deformidade, estalo na hora da lesão, formigamento, perda de força, ou se a dor não melhorar em uma ou duas semanas.';

export const active = list => (list || []).filter(i => !i.healed);
const lastPain = i => (i.painLog?.length ? i.painLog[i.painLog.length - 1].pain : i.pain);
export const currentPain = lastPain;

export function injuryLabel(i) { return `${AREAS[i.area] || i.area}${i.side && SIDES[i.side] ? ' ' + SIDES[i.side] : ''}`; }

/** Situação de um exercício diante das lesões ativas: null, 'cuidado' ou 'evitar'. */
export function injuryFor(exId, list) {
  let worst = null;
  for (const i of active(list)) {
    if (!LOADS[i.area]?.includes(exId)) continue;
    const level = lastPain(i) >= 3 ? 'evitar' : 'cuidado';
    if (!worst || (level === 'evitar' && worst.level !== 'evitar')) worst = { level, injury: i, label: injuryLabel(i) };
  }
  return worst;
}
export function avoidedIds(list) {
  const s = new Set();
  for (const i of active(list)) if (lastPain(i) >= 3) (LOADS[i.area] || []).forEach(id => s.add(id));
  return s;
}

export function daysSince(date, now = new Date()) {
  return Math.max(0, Math.floor((now - new Date(date + 'T12:00:00')) / 864e5));
}

const vDate = d => typeof d === 'string' && /^\d{4}-\d\d-\d\d$/.test(d);
const vPain = p => Number.isInteger(p) && p >= 0 && p <= 10;
export function validInjuries(list) {
  if (list === undefined) return true;
  return Array.isArray(list) && list.length <= 60 && list.every(i => i && typeof i.id === 'string' && i.id.length <= 60 &&
    i.area in AREAS && (i.side === undefined || i.side in SIDES) && vDate(i.start) && vPain(i.pain) &&
    (i.healed === undefined || i.healed === null || vDate(i.healed)) &&
    (i.note === undefined || (typeof i.note === 'string' && i.note.length <= 300)) &&
    (i.painLog === undefined || (Array.isArray(i.painLog) && i.painLog.length <= 120 && i.painLog.every(x => x && vDate(x.date) && vPain(x.pain)))));
}
