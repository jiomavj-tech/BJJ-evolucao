/** Desenhos animados (2 quadros) dos exercícios sem foto equivalente — arte original do BJJ Evolução. */
import { figure, YOU } from './positions.mjs';

const ACC = '#f2a65e';
const frame = (f, extra = '', label = '') => figure(f, YOU, true) + extra +
  (label ? `<text x="160" y="192" fill="#e7f0e3" font-size="13" font-weight="700" text-anchor="middle">${label}</text>` : '');
const arrow = (x1, y1, x2, y2) => {
  const a = Math.atan2(y2 - y1, x2 - x1), l = 9;
  const p = (da) => `${x2 - l * Math.cos(a + da)} ${y2 - l * Math.sin(a + da)}`;
  return `<g stroke="${ACC}" stroke-width="4" fill="none" stroke-linecap="round"><path d="M ${x1} ${y1} L ${x2} ${y2}"/><path d="M ${p(.5)} L ${x2} ${y2} L ${p(-.5)}"/></g>`;
};

const D = {
  'bird-dog': {
    caption: 'Bird dog: em quatro apoios, estenda o braço e a perna opostos e segure',
    f0: frame({ h:[92,100], n:[106,108], p:[200,110], e1:[106,144], w1:[106,176], e2:[110,144], w2:[112,176], k1:[198,176], f1:[252,176], k2:[204,176], f2:[258,176] }, '', 'Quatro apoios'),
    f1: frame({ h:[90,98], n:[106,108], p:[200,110], e1:[106,144], w1:[106,176], e2:[74,100], w2:[40,94], k1:[198,176], f1:[252,176], k2:[244,110], f2:[294,106] }, arrow(70,80,44,78) + arrow(256,90,286,88), 'Braço e perna opostos')
  },
  quadril90: {
    caption: 'Troca de quadril 90/90: sentado, gire os dois joelhos de um lado para o outro',
    f0: frame({ h:[150,64], n:[150,82], p:[150,150], e1:[128,120], w1:[110,170], e2:[172,120], w2:[190,170], k1:[214,150], f1:[250,174], k2:[196,174], f2:[150,176] }, '', 'Joelhos para a direita'),
    f1: frame({ h:[170,64], n:[170,82], p:[170,150], e1:[148,120], w1:[130,170], e2:[192,120], w2:[210,170], k1:[106,150], f1:[70,174], k2:[124,174], f2:[170,176] }, arrow(112,128,86,128), 'Joelhos para a esquerda')
  },
  shrimp: {
    caption: 'Fuga de quadril (shrimp): vire de lado e empurre o quadril para trás com o pé',
    f0: frame({ h:[60,160], n:[78,160], p:[160,162], e1:[96,134], w1:[118,118], e2:[100,140], w2:[124,126], k1:[196,128], f1:[226,176], k2:[200,132], f2:[232,176] }, '', 'De costas, pés no chão'),
    f1: frame({ h:[64,150], n:[82,150], p:[138,146], e1:[100,126], w1:[124,112], e2:[104,132], w2:[128,120], k1:[184,124], f1:[226,176], k2:[174,160], f2:[206,172] }, arrow(150,128,108,128), 'De lado, quadril para trás')
  },
  'technical-stand': {
    caption: 'Levantada técnica: mão de apoio atrás, eleve o quadril e leve a perna para trás',
    f0: frame({ h:[132,84], n:[136,100], p:[150,166], e1:[118,136], w1:[110,174], e2:[166,122], w2:[194,112], k1:[196,134], f1:[224,176], k2:[184,160], f2:[214,174] }, '', 'Sentado, mão atrás'),
    f1: frame({ h:[164,48], n:[166,66], p:[160,120], e1:[136,140], w1:[118,174], e2:[192,82], w2:[214,72], k1:[198,146], f1:[220,176], k2:[124,156], f2:[92,174] }, arrow(150,150,104,162), 'Quadril alto, perna para trás')
  },
  'base-shift': {
    caption: 'Troca de base no solo: troque o apoio de um lado para o outro mantendo a base baixa',
    f0: frame({ h:[128,92], n:[140,102], p:[196,122], e1:[124,140], w1:[116,176], e2:[146,140], w2:[150,176], k1:[228,152], f1:[258,176], k2:[196,176], f2:[234,176] }, '', 'Base apoiada'),
    f1: frame({ h:[152,92], n:[162,102], p:[202,124], e1:[148,140], w1:[140,176], e2:[172,140], w2:[178,176], k1:[166,154], f1:[150,176], k2:[230,176], f2:[270,176] }, arrow(150,72,186,72), 'Troque o lado do apoio')
  },
  toracica: {
    caption: 'Rotação torácica em quatro apoios: abra o braço para cima, girando o tronco',
    f0: frame({ h:[92,100], n:[106,108], p:[200,110], e1:[106,144], w1:[106,176], e2:[110,144], w2:[112,176], k1:[198,176], f1:[252,176], k2:[204,176], f2:[258,176] }, '', 'Quatro apoios'),
    f1: frame({ h:[96,92], n:[106,108], p:[200,110], e1:[106,144], w1:[106,176], e2:[104,74], w2:[100,40], k1:[198,176], f1:[252,176], k2:[204,176], f2:[258,176] }, arrow(130,96,112,60), 'Gire e olhe para a mão')
  },
  respirar: {
    caption: 'Respiração diafragmática: a barriga sobe ao inspirar e desce ao expirar',
    f0: frame({ h:[64,160], n:[82,160], p:[172,162], e1:[110,150], w1:[136,146], e2:[112,152], w2:[138,150], k1:[208,124], f1:[238,174], k2:[212,128], f2:[244,176] },
      `<ellipse cx="140" cy="152" rx="20" ry="7" fill="none" stroke="${ACC}" stroke-width="3" stroke-dasharray="5 4"/>`, 'Expire: barriga desce'),
    f1: frame({ h:[64,160], n:[82,160], p:[172,162], e1:[110,140], w1:[136,132], e2:[112,142], w2:[138,136], k1:[208,124], f1:[238,174], k2:[212,128], f2:[244,176] },
      `<ellipse cx="140" cy="146" rx="24" ry="14" fill="none" stroke="${ACC}" stroke-width="3" stroke-dasharray="5 4"/>` + arrow(176,150,176,122), 'Inspire: barriga sobe')
  },
  toalha: {
    caption: 'Aperto de toalha: segure a toalha pendurada e aperte forte, sem soltar',
    f0: `<rect x="138" y="8" width="44" height="168" rx="8" fill="#d8d2c4"/><path d="M 132 8 L 188 8" stroke="#8aa08f" stroke-width="8" stroke-linecap="round"/>`
      + `<rect x="120" y="54" width="80" height="34" rx="14" fill="${YOU}"/><rect x="120" y="100" width="80" height="34" rx="14" fill="${YOU}"/>`
      + `<text x="160" y="192" fill="#e7f0e3" font-size="13" font-weight="700" text-anchor="middle">Pegue a toalha</text>`,
    f1: `<path d="M 138 8 L 182 8 L 170 60 L 170 128 L 182 176 L 138 176 L 150 128 L 150 60 Z" fill="#d8d2c4"/><path d="M 132 8 L 188 8" stroke="#8aa08f" stroke-width="8" stroke-linecap="round"/>`
      + `<rect x="126" y="54" width="68" height="34" rx="14" fill="${YOU}"/><rect x="126" y="100" width="68" height="34" rx="14" fill="${YOU}"/>`
      + arrow(98,71,118,71) + arrow(222,71,202,71) + arrow(98,117,118,117) + arrow(222,117,202,117)
      + `<text x="160" y="192" fill="#e7f0e3" font-size="13" font-weight="700" text-anchor="middle">Aperte e segure</text>`
  },
  'remada-isom': {
    caption: 'Remada isométrica: toalha sob os pés, puxe os cotovelos para trás e segure',
    f0: frame({ h:[132,92], n:[132,108], p:[112,170], e1:[164,128], w1:[200,140], e2:[166,132], w2:[202,144], k1:[172,170], f1:[236,168], k2:[176,172], f2:[240,172] },
      `<path d="M 202 142 L 244 160 L 244 176" stroke="#d8d2c4" stroke-width="5" fill="none"/>`, 'Braços estendidos'),
    f1: frame({ h:[120,86], n:[122,102], p:[112,170], e1:[96,126], w1:[136,136], e2:[98,130], w2:[138,140], k1:[172,170], f1:[236,168], k2:[176,172], f2:[240,172] },
      `<path d="M 138 138 L 244 160 L 244 176" stroke="#d8d2c4" stroke-width="5" fill="none"/>` + arrow(118,146,88,146), 'Puxe e segure')
  },
  sprawl: {
    caption: 'Sprawl: jogue as pernas para trás e o quadril ao chão, peito alto',
    f0: frame({ h:[150,46], n:[152,62], p:[162,110], e1:[176,84], w1:[194,98], e2:[172,88], w2:[190,104], k1:[146,142], f1:[140,176], k2:[180,142], f2:[188,176] }, '', 'Base, mãos à frente'),
    f1: frame({ h:[94,104], n:[108,114], p:[190,156], e1:[104,146], w1:[100,176], e2:[110,148], w2:[108,176], k1:[240,166], f1:[292,172], k2:[236,170], f2:[288,176] }, arrow(210,128,262,150), 'Pernas para trás')
  },
  saltitos: {
    caption: 'Polichinelo sem salto: abra uma perna para o lado e suba os braços, alternando',
    f0: frame({ h:[160,36], n:[160,54], p:[160,110], e1:[146,82], w1:[142,110], e2:[174,82], w2:[178,110], k1:[152,144], f1:[150,176], k2:[168,144], f2:[170,176] }, '', 'Pés juntos'),
    f1: frame({ h:[160,36], n:[160,54], p:[160,110], e1:[138,40], w1:[126,14], e2:[182,40], w2:[194,14], k1:[152,144], f1:[150,176], k2:[184,142], f2:[204,176] }, arrow(214,150,234,150), 'Passo ao lado, braços acima')
  }
};
D['intervalo-marcha'] = null; // usa foto da caminhada

export function drawnMedia(id) {
  const d = D[id]; if (!d) return null;
  const svg = `<svg class="draw-svg" viewBox="0 0 320 200" role="img" aria-label="${d.caption}"><rect x="1" y="1" width="318" height="198" rx="14" fill="#14231c"/>`
    + `<path d="M 14 178 L 306 178" stroke="#3d5a48" stroke-width="3" stroke-linecap="round"/>`
    + `<g class="fr f0">${d.f0}</g><g class="fr f1">${d.f1}</g></svg>`;
  return { svg, caption: d.caption, source: 'Desenho do BJJ Evolução', offline: true, drawn: true };
}
export const DRAWN_IDS = Object.keys(D).filter(k => D[k]);
