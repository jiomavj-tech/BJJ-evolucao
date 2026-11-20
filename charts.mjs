/** Gráficos da Evolução: agrupamento por semana ou mês e barras empilhadas em SVG.
 * Paleta categórica validada (modo escuro, fundo #14211d): azul, laranja, verde-água, amarelo. */

export const COLORS = { c1: '#3987e5', c2: '#d95926', c3: '#199e70', c4: '#c98500' };
export const PERIODS = { '4s': '4 semanas', '12s': '12 semanas', '6m': '6 meses' };
const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Semanas (segunda a domingo) ou meses, do mais antigo ao atual. */
export function buckets(history, period = '12s', now = new Date()) {
  const out = [];
  if (period === '6m') {
    for (let i = 5; i >= 0; i--) {
      const a = new Date(now.getFullYear(), now.getMonth() - i, 1), b = new Date(a.getFullYear(), a.getMonth() + 1, 0);
      out.push({ from: iso(a), to: iso(b), label: MONTHS[a.getMonth()], long: `${MONTHS[a.getMonth()]} de ${a.getFullYear()}` });
    }
  } else {
    const n = period === '4s' ? 4 : 12, mon = new Date(now); mon.setHours(12, 0, 0, 0); mon.setDate(mon.getDate() - ((mon.getDay() + 6) % 7));
    for (let i = n - 1; i >= 0; i--) {
      const a = new Date(mon); a.setDate(a.getDate() - 7 * i); const b = new Date(a); b.setDate(b.getDate() + 6);
      out.push({ from: iso(a), to: iso(b), label: `${a.getDate()}/${a.getMonth() + 1}`, long: `semana de ${a.getDate()}/${a.getMonth() + 1} a ${b.getDate()}/${b.getMonth() + 1}` });
    }
  }
  for (const k of out) k.sessions = (history || []).filter(s => s.date >= k.from && s.date <= k.to).sort((x, y) => x.date.localeCompare(y.date));
  return out;
}

const sum = (list, f) => list.reduce((n, s) => n + (Number(f(s)) || 0), 0);
export const METRICS = {
  bjj: { label: 'Jiu-jitsu', value: k => k.sessions.filter(s => s.type === 'bjj').length },
  fisico: { label: 'Treino físico', value: k => k.sessions.filter(s => s.type === 'fisico').length },
  minBjj: { label: 'Jiu-jitsu', value: k => sum(k.sessions.filter(s => s.type === 'bjj'), s => s.duration) },
  minFis: { label: 'Treino físico', value: k => sum(k.sessions.filter(s => s.type === 'fisico'), s => s.duration) },
  given: { label: 'Finalizações', value: k => sum(k.sessions, s => s.given?.length) },
  sweeps: { label: 'Raspagens', value: k => sum(k.sessions, s => s.sweeps) },
  passes: { label: 'Passagens', value: k => sum(k.sessions, s => s.passes) },
  takedowns: { label: 'Quedas', value: k => sum(k.sessions, s => s.takedowns) },
  taken: { label: 'Finalizações sofridas', value: k => sum(k.sessions, s => s.taken?.length) }
};

function niceMax(v) { if (v <= 4) return 4; const p = 10 ** Math.floor(Math.log10(v)); const m = v / p; return (m <= 2 ? 2 : m <= 5 ? 5 : 10) * p; }

/** Barras empilhadas. series: [{metric, color}]. Toque/clique na barra → data-action="chartPick". */
export function stackedBars({ id, data, series, selected = -1, unit = '' }) {
  const W = 340, H = 190, L = 30, R = 6, T = 10, B = 26, n = data.length;
  const totals = data.map(k => series.reduce((t, s) => t + METRICS[s.metric].value(k), 0));
  const max = niceMax(Math.max(1, ...totals)), y = v => T + (H - T - B) * (1 - v / max);
  const slot = (W - L - R) / n, bw = Math.min(26, slot * 0.62);
  let g = '';
  for (const t of [0, max / 2, max]) g += `<line x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}" class="grid"/><text x="${L - 6}" y="${y(t) + 4}" class="axis" text-anchor="end">${Math.round(t)}</text>`;
  data.forEach((k, i) => {
    const x = L + slot * i + (slot - bw) / 2; let base = 0; const parts = [];
    series.forEach(s => { const v = METRICS[s.metric].value(k); if (v > 0) parts.push({ v, color: s.color, from: base }); base += v; });
    parts.forEach((p, j) => {
      const top = y(p.from + p.v), bottom = y(p.from), h = Math.max(0, bottom - top - (j ? 2 : 0)), last = j === parts.length - 1, r = Math.min(4, h / 2, bw / 2);
      const yy = top, yb = yy + h;
      g += last && r > 0
        ? `<path d="M${x} ${yb} V${yy + r} Q${x} ${yy} ${x + r} ${yy} H${x + bw - r} Q${x + bw} ${yy} ${x + bw} ${yy + r} V${yb} Z" fill="${p.color}"/>`
        : `<rect x="${x}" y="${yy}" width="${bw}" height="${h}" fill="${p.color}"/>`;
    });
    const tip = `${k.long}: ` + series.map(s => `${METRICS[s.metric].label} ${METRICS[s.metric].value(k)}${unit}`).join(', ');
    if (i === selected) g += `<rect x="${L + slot * i + 1}" y="${T - 4}" width="${slot - 2}" height="${H - T - B + 8}" rx="6" class="sel"/>`;
    g += `<text x="${L + slot * i + slot / 2}" y="${H - 8}" class="axis ${i === selected ? 'on' : ''}" text-anchor="middle">${n > 8 && i % 2 && i !== n - 1 ? '' : k.label}</text>`;
    g += `<rect x="${L + slot * i}" y="0" width="${slot}" height="${H}" fill="transparent" class="hit" data-action="chartPick" data-chart="${id}" data-index="${i}" role="button" tabindex="0" aria-label="${tip}"><title>${tip}</title></rect>`;
  });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="group" aria-label="Gráfico de barras">${g}</svg>`;
}

export function legend(series) {
  return `<div class="legend">${series.map(s => `<span><i style="background:${s.color}"></i>${METRICS[s.metric].label}</span>`).join('')}</div>`;
}

/** Tabela com os mesmos números do gráfico (acessibilidade e conferência). */
export function dataTable(data, series, unit = '') {
  return `<table class="mini-table"><thead><tr><th>Período</th>${series.map(s => `<th>${METRICS[s.metric].label}</th>`).join('')}</tr></thead><tbody>${data.map(k => `<tr><td>${k.label}</td>${series.map(s => `<td>${METRICS[s.metric].value(k)}${unit}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
