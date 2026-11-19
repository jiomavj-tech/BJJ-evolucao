/** Mapa de jogo: de cada posição (e papel), o que você pode fazer, para onde leva e o que emendar
 * se o parceiro defender. Nó = "posição:papel" (a = por cima / atacando em pé; b = por baixo / defendendo). */
import { TECH_BY_ID } from './techniques.mjs';
import { POSITION_LABELS } from './positions.mjs';

export const ROLE_LABEL = {
  guarda_fechada: { a: 'Por cima (passando)', b: 'Por baixo (na guarda)' },
  meia_guarda: { a: 'Por cima (passando)', b: 'Por baixo (na guarda)' },
  borboleta: { a: 'Por cima (passando)', b: 'Por baixo (na guarda)' },
  guarda_aberta: { a: 'Em pé (passando)', b: 'Por baixo (na guarda)' },
  em_pe: { a: 'Atacando', b: 'Defendendo' },
  default: { a: 'Por cima', b: 'Por baixo' }
};
export const roleLabel = (pos, r) => (ROLE_LABEL[pos] || ROLE_LABEL.default)[r];
export const nodeLabel = node => { const [p, r] = node.split(':'); return `${POSITION_LABELS[p]} · ${roleLabel(p, r).toLowerCase()}`; };

// O que fazer em cada nó.
export const ATTACKS = {
  'em_pe:a': ['q-puxada', 'q-baiana', 'q-single', 'q-osoto', 'f-guilhotina'],
  'em_pe:b': ['q-sprawl', 'd-guilhotina'],
  'guarda_fechada:b': ['r-tesoura', 'r-quadril', 'r-pendulo', 'f-armlock-guarda', 'f-triangulo', 'f-omoplata', 'f-kimura', 'f-cruzado', 'f-guilhotina'],
  'guarda_fechada:a': ['p-abertura', 'd-armlock', 'd-triangulo'],
  'meia_guarda:b': ['r-meia-underhook'],
  'meia_guarda:a': ['p-joelho', 'p-pressao', 'p-meia'],
  'borboleta:b': ['r-borboleta', 'f-guilhotina'],
  'borboleta:a': ['p-toreando', 'p-pressao'],
  'guarda_aberta:b': ['r-tripe', 'r-x', 'f-chave-pe'],
  'guarda_aberta:a': ['p-toreando', 'p-sobre-baixo', 'p-leg-drag', 'p-joelho'],
  'lateral:a': ['c-transicao-montada', 'c-joelho-barriga', 'c-norte-sul', 'f-americana', 'f-kimura', 'f-arm-triangle'],
  'lateral:b': ['d-lateral'],
  'montada:a': ['f-armlock-montada', 'f-americana', 'f-ezequiel', 'f-arm-triangle', 'f-cruzado', 'c-costas'],
  'montada:b': ['d-upa', 'd-cotovelo-joelho'],
  'joelho_barriga:a': ['c-montada', 'f-armlock-montada', 'c-lateral'],
  'joelho_barriga:b': ['d-lateral'],
  'norte_sul:a': ['f-kimura', 'c-lateral'],
  'norte_sul:b': ['d-lateral'],
  'costas:a': ['f-mata-leao', 'f-gola-costas'],
  'costas:b': ['d-mata-leao', 'd-costas']
};

// Para onde a técnica leva quando dá certo (null = finaliza).
export const LEADS_TO = {
  'q-puxada': 'guarda_fechada:b', 'q-baiana': 'lateral:a', 'q-single': 'lateral:a', 'q-osoto': 'lateral:a', 'q-sprawl': 'costas:a',
  'd-guilhotina': 'lateral:a',
  'r-tesoura': 'montada:a', 'r-quadril': 'montada:a', 'r-pendulo': 'montada:a', 'r-borboleta': 'lateral:a',
  'r-meia-underhook': 'lateral:a', 'r-tripe': 'guarda_aberta:a', 'r-x': 'guarda_aberta:a',
  'p-abertura': 'guarda_aberta:a', 'p-toreando': 'lateral:a', 'p-sobre-baixo': 'lateral:a', 'p-leg-drag': 'lateral:a',
  'p-joelho': 'lateral:a', 'p-pressao': 'lateral:a', 'p-meia': 'lateral:a',
  'd-armlock': 'guarda_fechada:a', 'd-triangulo': 'guarda_fechada:a',
  'c-transicao-montada': 'montada:a', 'c-joelho-barriga': 'joelho_barriga:a', 'c-norte-sul': 'norte_sul:a',
  'c-montada': 'montada:a', 'c-lateral': 'lateral:a', 'c-costas': 'costas:a',
  'd-lateral': 'guarda_fechada:b', 'd-upa': 'guarda_fechada:a', 'd-cotovelo-joelho': 'meia_guarda:b',
  'd-mata-leao': 'costas:b', 'd-costas': 'guarda_fechada:a'
};

// Se o parceiro defender, emende com...
export const CHAINS = {
  'f-triangulo': ['f-omoplata', 'f-armlock-guarda'],
  'f-armlock-guarda': ['f-triangulo', 'f-omoplata'],
  'f-omoplata': ['r-tesoura', 'f-triangulo'],
  'f-kimura': ['r-quadril', 'f-guilhotina'],
  'r-quadril': ['f-kimura', 'f-guilhotina'],
  'r-tesoura': ['r-pendulo', 'f-armlock-guarda'],
  'r-pendulo': ['f-armlock-guarda', 'r-tesoura'],
  'f-cruzado': ['f-armlock-guarda', 'f-armlock-montada'],
  'f-americana': ['f-kimura', 'f-armlock-montada'],
  'f-armlock-montada': ['c-costas', 'f-americana'],
  'f-ezequiel': ['f-americana', 'f-armlock-montada'],
  'f-arm-triangle': ['f-americana', 'c-montada'],
  'f-mata-leao': ['f-gola-costas'],
  'f-gola-costas': ['f-mata-leao'],
  'f-guilhotina': ['r-quadril', 'f-kimura'],
  'q-baiana': ['q-single'],
  'q-single': ['q-baiana'],
  'q-osoto': ['q-baiana'],
  'p-toreando': ['p-leg-drag', 'p-joelho'],
  'p-leg-drag': ['p-toreando'],
  'p-joelho': ['p-pressao', 'p-meia'],
  'p-pressao': ['p-joelho'],
  'p-abertura': ['p-toreando'],
  'r-borboleta': ['f-guilhotina'],
  'r-meia-underhook': ['r-borboleta'],
  'd-upa': ['d-cotovelo-joelho'],
  'd-cotovelo-joelho': ['d-upa'],
  'd-mata-leao': ['d-costas'],
  'c-transicao-montada': ['c-joelho-barriga']
};

export const NODES = Object.keys(ATTACKS);
export const START = 'em_pe:a';
const MAX_PLAN = 3;

export function planFor(gameplan, node) { return (gameplan?.[node] || []).filter(id => ATTACKS[node]?.includes(id)); }

export function togglePlan(gameplan, node, id) {
  const cur = planFor(gameplan, node);
  if (!ATTACKS[node]?.includes(id)) return { gameplan, error: 'Técnica não pertence a esta posição.' };
  if (cur.includes(id)) return { gameplan: { ...gameplan, [node]: cur.filter(x => x !== id) } };
  if (cur.length >= MAX_PLAN) return { gameplan, error: `Máximo de ${MAX_PLAN} técnicas no plano de cada posição.` };
  return { gameplan: { ...gameplan, [node]: [...cur, id] } };
}

/** Linha do seu jogo: segue o plano A (1ª escolha) a partir de um nó até finalizar, repetir ou faltar plano. */
export function gameLine(gameplan, start = START, maxSteps = 8) {
  const steps = [], seen = new Set();
  let node = start;
  for (let i = 0; i < maxSteps && node; i++) {
    if (seen.has(node)) { steps.push({ node, loop: true }); break; }
    seen.add(node);
    const pick = planFor(gameplan, node)[0];
    if (!pick) { steps.push({ node, missing: true }); break; }
    const next = LEADS_TO[pick] ?? null;
    steps.push({ node, tech: pick, finish: next === null && TECH_BY_ID[pick]?.cat === 'finalizacao' });
    node = next;
  }
  return steps;
}

export function nodesWithTech(id) { return NODES.filter(n => ATTACKS[n].includes(id)); }

export function validGameplan(g) {
  if (g === undefined) return true;
  if (!g || typeof g !== 'object' || Array.isArray(g)) return false;
  return Object.entries(g).every(([n, ids]) => NODES.includes(n) && Array.isArray(ids) && ids.length <= MAX_PLAN && ids.every(id => typeof id === 'string' && ATTACKS[n].includes(id)));
}
