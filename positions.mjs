/** Desenhos esquemáticos das posições de jiu-jitsu — arte original do BJJ Evolução.
 * Vista lateral simplificada, fora de escala. Duas figuras: "a" (por cima / quem passa /
 * quem pega as costas / à esquerda em pé) e "b" (por baixo / quem joga guarda / à direita em pé).
 * Cada técnica diz em qual posição começa e qual figura é você. */

// Pontos de cada figura: h cabeça, n pescoço, p quadril, e1/w1 cotovelo/mão, e2/w2, k1/f1 joelho/pé, k2/f2.
const POS = {
  guarda_fechada: {
    label: 'Guarda fechada',
    b: { h:[52,152], n:[70,150], p:[140,154], e1:[98,120], w1:[150,104], e2:[96,128], w2:[140,112], k1:[182,112], f1:[222,122], k2:[178,120], f2:[226,114] },
    a: { h:[170,66], n:[178,82], p:[212,130], e1:[160,110], w1:[128,140], e2:[168,116], w2:[118,146], k1:[186,168], f1:[236,170], k2:[196,168], f2:[246,170] }
  },
  meia_guarda: {
    label: 'Meia-guarda',
    b: { h:[48,150], n:[66,150], p:[140,156], e1:[96,134], w1:[128,120], e2:[84,166], w2:[106,170], k1:[168,124], f1:[206,140], k2:[176,150], f2:[222,166] },
    a: { h:[96,108], n:[112,116], p:[200,124], e1:[96,140], w1:[70,158], e2:[134,140], w2:[150,150], k1:[206,164], f1:[256,170], k2:[176,146], f2:[214,162] }
  },
  borboleta: {
    label: 'Guarda borboleta',
    b: { h:[96,90], n:[106,104], p:[100,160], e1:[140,110], w1:[180,104], e2:[134,126], w2:[166,132], k1:[150,126], f1:[204,150], k2:[146,136], f2:[200,160] },
    a: { h:[196,72], n:[204,88], p:[232,132], e1:[184,112], w1:[160,122], e2:[192,118], w2:[168,128], k1:[200,168], f1:[252,170], k2:[244,168], f2:[276,170] }
  },
  guarda_aberta: {
    label: 'Guarda aberta (parceiro em pé)',
    b: { h:[46,152], n:[64,150], p:[130,154], e1:[110,164], w1:[196,166], e2:[94,124], w2:[150,92], k1:[158,116], f1:[196,104], k2:[164,136], f2:[200,148] },
    a: { h:[180,30], n:[190,46], p:[216,102], e1:[170,74], w1:[156,96], e2:[178,80], w2:[164,104], k1:[206,138], f1:[200,170], k2:[232,138], f2:[244,170] }
  },
  montada: {
    label: 'Montada',
    b: { h:[50,152], n:[68,152], p:[160,156], e1:[94,138], w1:[118,128], e2:[86,166], w2:[108,170], k1:[202,136], f1:[236,168], k2:[198,142], f2:[228,170] },
    a: { h:[124,58], n:[130,76], p:[142,136], e1:[112,104], w1:[94,140], e2:[120,108], w2:[104,144], k1:[112,164], f1:[152,168], k2:[118,166], f2:[160,170] }
  },
  lateral: {
    label: 'Cem quilos (lateral)',
    b: { h:[50,154], n:[68,154], p:[160,156], e1:[86,136], w1:[108,120], e2:[92,166], w2:[118,170], k1:[198,148], f1:[232,166], k2:[196,152], f2:[226,170] },
    a: { h:[92,130], n:[104,130], p:[176,118], e1:[74,150], w1:[52,166], e2:[140,146], w2:[160,150], k1:[188,166], f1:[232,168], k2:[166,168], f2:[210,170] }
  },
  joelho_barriga: {
    label: 'Joelho na barriga',
    b: { h:[50,154], n:[68,154], p:[160,156], e1:[90,136], w1:[112,124], e2:[90,166], w2:[112,170], k1:[200,138], f1:[234,168], k2:[196,144], f2:[228,170] },
    a: { h:[118,40], n:[124,58], p:[142,104], e1:[104,92], w1:[92,136], e2:[148,92], w2:[164,138], k1:[128,142], f1:[164,152], k2:[184,132], f2:[214,170] }
  },
  norte_sul: {
    label: 'Norte-sul',
    b: { h:[200,154], n:[182,154], p:[96,156], e1:[160,138], w1:[150,124], e2:[166,166], w2:[144,170], k1:[60,140], f1:[28,168], k2:[64,146], f2:[34,170] },
    a: { h:[160,132], n:[176,132], p:[252,124], e1:[148,148], w1:[118,152], e2:[156,150], w2:[126,156], k1:[262,168], f1:[300,170], k2:[244,168], f2:[284,170] }
  },
  costas: {
    label: 'Costas (com ganchos)',
    b: { h:[98,70], n:[106,86], p:[132,160], e1:[92,124], w1:[84,146], e2:[100,128], w2:[94,150], k1:[78,128], f1:[48,168], k2:[84,134], f2:[54,170] },
    a: { h:[138,64], n:[146,80], p:[178,160], e1:[118,90], w1:[94,104], e2:[128,128], w2:[102,118], k1:[122,132], f1:[92,146], k2:[128,140], f2:[96,156] }
  },
  em_pe: {
    label: 'Em pé, com pegada',
    a: { h:[118,34], n:[122,50], p:[110,102], e1:[146,70], w1:[166,64], e2:[142,82], w2:[164,86], k1:[100,138], f1:[88,170], k2:[124,136], f2:[126,170] },
    b: { h:[210,34], n:[206,50], p:[218,102], e1:[184,72], w1:[168,66], e2:[188,84], w2:[170,90], k1:[206,138], f1:[200,170], k2:[232,136], f2:[244,170] }
  }
};

// técnica → [posição de partida, figura que é você]
const TECH_POS = {
  'g-fechada':['guarda_fechada','b'],'g-meia':['meia_guarda','b'],'g-borboleta':['borboleta','b'],'g-dlr':['guarda_aberta','b'],
  'g-aranha':['guarda_aberta','b'],'g-laco':['guarda_aberta','b'],'g-x':['guarda_aberta','b'],
  'r-tesoura':['guarda_fechada','b'],'r-quadril':['guarda_fechada','b'],'r-pendulo':['guarda_fechada','b'],'r-borboleta':['borboleta','b'],
  'r-meia-underhook':['meia_guarda','b'],'r-tripe':['guarda_aberta','b'],'r-x':['guarda_aberta','b'],
  'p-abertura':['guarda_fechada','a'],'p-toreando':['guarda_aberta','a'],'p-joelho':['meia_guarda','a'],'p-sobre-baixo':['guarda_aberta','a'],
  'p-pressao':['meia_guarda','a'],'p-leg-drag':['guarda_aberta','a'],'p-meia':['meia_guarda','a'],
  'c-lateral':['lateral','a'],'c-montada':['montada','a'],'c-joelho-barriga':['joelho_barriga','a'],'c-costas':['costas','a'],
  'c-norte-sul':['norte_sul','a'],'c-transicao-montada':['lateral','a'],
  'f-armlock-guarda':['guarda_fechada','b'],'f-armlock-montada':['montada','a'],'f-triangulo':['guarda_fechada','b'],'f-kimura':['guarda_fechada','b'],
  'f-americana':['montada','a'],'f-mata-leao':['costas','a'],'f-cruzado':['guarda_fechada','b'],'f-ezequiel':['montada','a'],
  'f-guilhotina':['em_pe','a'],'f-arm-triangle':['montada','a'],'f-omoplata':['guarda_fechada','b'],'f-gola-costas':['costas','a'],
  'f-chave-pe':['guarda_aberta','b'],
  'd-upa':['montada','b'],'d-cotovelo-joelho':['montada','b'],'d-lateral':['lateral','b'],'d-costas':['costas','b'],
  'd-armlock':['guarda_fechada','a'],'d-triangulo':['guarda_fechada','a'],'d-guilhotina':['em_pe','b'],'d-mata-leao':['costas','b'],
  'q-puxada':['em_pe','a'],'q-baiana':['em_pe','a'],'q-single':['em_pe','a'],'q-osoto':['em_pe','a'],'q-sprawl':['em_pe','b']
};

export const POSITION_KEYS = Object.keys(POS);
export function positionFor(techId) { const t = TECH_POS[techId]; return t ? { key: t[0], you: t[1], label: POS[t[0]].label } : null; }

export const YOU = '#b6ec74', PARTNER = '#f2a65e';
export function figure(f, color, front) {
  const line = pts => `M ${pts.map(p => p.join(' ')).join(' L ')}`;
  const sw = front ? 9 : 8;
  return `<g stroke="${color}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${front ? 1 : .92}">`
    + `<path d="${line([f.p, f.k2, f.f2])}"/><path d="${line([f.n, f.e2, f.w2])}"/>`
    + `<path d="${line([f.n, f.p])}" stroke-width="${sw + 5}"/>`
    + `<path d="${line([f.p, f.k1, f.f1])}"/><path d="${line([f.n, f.e1, f.w1])}"/>`
    + `<circle cx="${f.h[0]}" cy="${f.h[1]}" r="11" fill="${color}" stroke="none"/></g>`;
}

/** SVG da posição. you = 'a' | 'b' (qual figura é você). */
export function positionSvg(key, you = 'a') {
  const P = POS[key]; if (!P) return '';
  const other = you === 'a' ? 'b' : 'a';
  return `<svg class="pos-svg" viewBox="0 0 320 196" role="img" aria-label="Desenho esquemático: ${P.label}. Você em verde, parceiro em laranja.">`
    + `<rect x="1" y="1" width="318" height="194" rx="14" fill="#14231c" stroke="#33503f"/>`
    + `<path d="M 14 178 L 306 178" stroke="#3d5a48" stroke-width="3" stroke-linecap="round"/>`
    + figure(P[other], PARTNER, false) + figure(P[you], YOU, true)
    + `</svg>`;
}

export function techniqueDiagram(techId) {
  const pos = positionFor(techId); if (!pos) return '';
  return `<div class="pos-diagram"><div class="eyebrow">Posição de partida · ${pos.label}</div>${positionSvg(pos.key, pos.you)}`
    + `<div class="pos-legend"><span><i style="background:${YOU}"></i>Você</span><span><i style="background:${PARTNER}"></i>Parceiro</span></div>`
    + `<p class="tiny muted">Desenho esquemático, fora de escala: mostra a posição, não o detalhe da técnica. Os detalhes estão nos pontos-chave e com o seu professor.</p></div>`;
}

export const POSITION_LABELS = Object.fromEntries(Object.entries(POS).map(([k, v]) => [k, v.label]));
