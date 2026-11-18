/** Biblioteca de técnicas de jiu-jitsu — conteúdo original do BJJ Evolução.
 * Cada técnica: id único, categoria, posição de partida, nível sugerido,
 * uso (ambos = kimono e sem kimono; kimono = depende de pegada no pano)
 * e pontos-chave curtos. O conteúdo é lembrete de estudo: a técnica
 * deve ser aprendida com o professor. */

export const TECH_CATEGORIES = {
  guarda: 'Guardas',
  raspagem: 'Raspagens',
  passagem: 'Passagens',
  controle: 'Controles por cima',
  finalizacao: 'Finalizações',
  fuga: 'Fugas e defesas',
  queda: 'Quedas e luta em pé'
};

export const TECH_LEVELS = { 1: 'Fundamento', 2: 'Intermediário', 3: 'Avançado' };
export const TECH_GI = { ambos: 'Kimono e sem kimono', kimono: 'Kimono' };

// Status pessoal de domínio de cada técnica.
export const TECH_STATUS = {
  0: 'Não vista',
  1: 'Vi em aula',
  2: 'Drilando',
  3: 'Funciona no rola'
};

export const TECHNIQUES = [
  // ── Guardas ─────────────────────────────────────────────
  {id:'g-fechada',name:'Guarda fechada',cat:'guarda',from:'Por baixo',level:1,gi:'ambos',points:['Pernas cruzadas nas costas do oponente, quebrando a postura dele para frente.','Controle de manga e gola (ou punho e nuca) antes de atacar.','Se ele ficar com a postura alta, quebre de novo antes de qualquer ataque.']},
  {id:'g-meia',name:'Meia-guarda',cat:'guarda',from:'Por baixo',level:1,gi:'ambos',points:['Fique de lado, nunca de costas no chão.','Busque o underhook (braço por baixo da axila dele) do lado da perna presa.','Enquadre o pescoço/ombro com o outro braço para impedir o cross-face.']},
  {id:'g-borboleta',name:'Guarda borboleta',cat:'guarda',from:'Sentado',level:1,gi:'ambos',points:['Ganchos com o peito do pé por dentro das coxas dele.','Tronco inclinado à frente, sentado sobre o quadril.','Underhook ou pegada de braço para elevar e raspar.']},
  {id:'g-dlr',name:'Guarda De La Riva',cat:'guarda',from:'Por baixo, oponente em pé',level:2,gi:'ambos',points:['Gancho por fora e por trás da perna da frente dele.','Pegada no tornozelo da mesma perna e na manga ou gola.','O outro pé empurra o quadril ou a outra perna para controlar a distância.']},
  {id:'g-aranha',name:'Guarda aranha',cat:'guarda',from:'Por baixo',level:2,gi:'kimono',points:['Pegada nas mangas com os pés nos bíceps dele.','Mantenha uma perna estendida e a outra ativa, trocando a tensão.','Não deixe ele empilhar: quadril sempre se ajustando.']},
  {id:'g-laco',name:'Guarda laço (lasso)',cat:'guarda',from:'Por baixo',level:2,gi:'kimono',points:['Perna passa por fora e envolve o braço dele, com pegada na manga.','O laço controla a postura e a base do mesmo lado.','Combine com pegada na outra manga ou no tornozelo.']},
  {id:'g-x',name:'Guarda X',cat:'guarda',from:'Por baixo, debaixo do oponente',level:3,gi:'ambos',points:['Um pé atrás do joelho e o outro no quadril, cruzando em X sob uma perna dele.','Controle a perna dele abraçada no seu ombro.','Estender as pernas desequilibra para trás ou para o lado.']},

  // ── Raspagens ───────────────────────────────────────────
  {id:'r-tesoura',name:'Raspagem tesoura',cat:'raspagem',from:'Guarda fechada',level:1,gi:'kimono',points:['Pegue gola e manga, abra a guarda e coloque a canela atravessada na barriga dele.','Puxe a gola e a manga enquanto a perna de baixo corta o joelho dele.','Termine montado, mantendo a pegada da manga até cair.']},
  {id:'r-quadril',name:'Raspagem de quadril',cat:'raspagem',from:'Guarda fechada',level:1,gi:'ambos',points:['Funciona quando ele levanta a postura.','Sente-se apoiando uma mão no chão e passe o outro braço por cima do ombro dele.','Empurre com o quadril para o lado da mão que ficou presa. Se ele defender, emende a kimura ou a guilhotina.']},
  {id:'r-pendulo',name:'Raspagem pêndulo (flower sweep)',cat:'raspagem',from:'Guarda fechada',level:1,gi:'ambos',points:['Controle a manga e abrace a perna dele do mesmo lado.','Gire o corpo para o lado e balance a perna livre como um pêndulo.','A perna de baixo empurra a coxa dele enquanto a de cima varre; caia montado.']},
  {id:'r-borboleta',name:'Raspagem de gancho (borboleta)',cat:'raspagem',from:'Guarda borboleta',level:1,gi:'ambos',points:['Underhook de um lado e controle do braço do outro lado.','Caia de lado para o lado do braço controlado.','Eleve com o gancho do lado do underhook e termine por cima.']},
  {id:'r-meia-underhook',name:'Raspagem com underhook (meia-guarda)',cat:'raspagem',from:'Meia-guarda',level:2,gi:'ambos',points:['Com o underhook, saia de baixo para as costas dele.','Busque a perna de trás dele (pegada no joelho ou tornozelo).','Empurre com a cabeça e vire por cima.']},
  {id:'r-tripe',name:'Raspagem tripé',cat:'raspagem',from:'Guarda aberta (oponente em pé)',level:2,gi:'ambos',points:['Segure os dois tornozelos dele.','Um pé no quadril empurra; o outro puxa atrás do calcanhar.','Ele cai sentado; levante-se na hora para passar a guarda.']},
  {id:'r-x',name:'Raspagem técnica da guarda X',cat:'raspagem',from:'Guarda X',level:3,gi:'ambos',points:['Estenda as pernas para desequilibrar.','Ele cai para trás; faça a levantada técnica ainda segurando a perna.','Termine com controle da perna e passe.']},

  // ── Passagens ───────────────────────────────────────────
  {id:'p-abertura',name:'Abertura da guarda fechada',cat:'passagem',from:'Dentro da guarda fechada',level:1,gi:'ambos',points:['Primeiro a postura: costas retas, cabeça erguida e mãos no quadril ou no peito dele.','Ajoelhado: um joelho vai ao centro e o outro abre para trás. Em pé: abra as pernas dele com o quadril.','Não deixe as mãos dentro da guarda.']},
  {id:'p-toreando',name:'Passagem toreando',cat:'passagem',from:'Guarda aberta',level:1,gi:'ambos',points:['Segure as calças nos joelhos ou as canelas e empurre as pernas para um lado.','Ande em volta pelo outro lado, rápido.','Crave o joelho na barriga ou estabilize na lateral antes de ele repor a guarda.']},
  {id:'p-joelho',name:'Passagem de joelho cruzado (knee slice)',cat:'passagem',from:'Meia-guarda ou guarda aberta',level:1,gi:'ambos',points:['O joelho atravessa por cima da coxa dele, na diagonal.','Faça cross-face ou segure a gola, e controle o underhook dele.','Deslize o joelho até o chão do outro lado e estabilize na lateral.']},
  {id:'p-sobre-baixo',name:'Passagem over-under',cat:'passagem',from:'Guarda aberta',level:2,gi:'ambos',points:['Um braço passa por baixo de uma perna e o outro por cima da outra.','Ombro e peso em cima do quadril dele.','Ande para o lado da perna de baixo e alcance a lateral.']},
  {id:'p-pressao',name:'Passagem de pressão (smash)',cat:'passagem',from:'Meia-guarda',level:2,gi:'ambos',points:['Cross-face e peito colado no dele.','Mate o underhook dele antes de tudo.','Solte a perna presa com o pé livre ou com o joelho e caia na lateral.']},
  {id:'p-leg-drag',name:'Leg drag',cat:'passagem',from:'Guarda aberta',level:2,gi:'ambos',points:['Puxe a perna dele para o outro lado do seu quadril.','Prenda a perna com o seu quadril e controle o quadril dele.','Caia na lateral ou tome as costas se ele virar.']},
  {id:'p-meia',name:'Passagem da meia-guarda (tirar o joelho)',cat:'passagem',from:'Meia-guarda',level:1,gi:'ambos',points:['Prenda a cabeça e o ombro dele (cross-face e underhook).','Use o pé livre para empurrar o joelho dele e liberar a sua perna.','Estabilize na lateral ou na montada.']},

  // ── Controles por cima ──────────────────────────────────
  {id:'c-lateral',name:'Cem quilos (lateral)',cat:'controle',from:'Por cima',level:1,gi:'ambos',points:['Peito no peito, com cross-face e braço por baixo da cabeça ou no quadril.','Joelhos junto ao quadril e à cabeça dele, sem espaço.','O peso fica no oponente, não no chão.']},
  {id:'c-montada',name:'Montada',cat:'controle',from:'Por cima',level:1,gi:'ambos',points:['Joelhos colados na axila ou no quadril dele, com os pés por baixo das pernas dele.','Contra a ponte: base larga, mãos no chão se precisar.','Suba aos poucos para a montada alta e ataque os braços.']},
  {id:'c-joelho-barriga',name:'Joelho na barriga',cat:'controle',from:'Por cima',level:1,gi:'ambos',points:['A canela atravessa a barriga dele, com o pé de trás afastado para ter base.','Segure a gola e a calça, ou a cabeça e o quadril.','Acompanhe os movimentos dele e use o joelho para pressionar ou ir à montada.']},
  {id:'c-costas',name:'Pegada das costas',cat:'controle',from:'Por cima/atrás',level:1,gi:'ambos',points:['Faça a pegada cinto de segurança: um braço por cima do ombro e outro por baixo da axila.','Coloque os ganchos dentro das coxas dele, nunca com os pés cruzados.','Peito colado e cabeça junto à dele.']},
  {id:'c-norte-sul',name:'Norte-sul',cat:'controle',from:'Por cima',level:2,gi:'ambos',points:['Peito sobre o peito dele, com o corpo invertido.','Segure a faixa ou o quadril e controle os cotovelos.','Daí saem a kimura e o estrangulamento norte-sul.']},
  {id:'c-transicao-montada',name:'Transição lateral → montada',cat:'controle',from:'Cem quilos',level:1,gi:'ambos',points:['Prenda a perna de cima dele com o seu joelho.','Deslize o joelho por cima da barriga, mantendo o cross-face.','Se ele bloquear com a perna, passe para o joelho na barriga primeiro.']},

  // ── Finalizações ────────────────────────────────────────
  {id:'f-armlock-guarda',name:'Armlock da guarda',cat:'finalizacao',from:'Guarda fechada',level:1,gi:'ambos',points:['Controle o braço e gire o corpo, ficando perpendicular a ele.','A perna passa por cima do rosto dele e os joelhos ficam juntos.','O polegar dele aponta para cima e o quadril sobe devagar.']},
  {id:'f-armlock-montada',name:'Armlock da montada',cat:'finalizacao',from:'Montada',level:1,gi:'ambos',points:['Suba para a montada alta e isole um braço.','Gire o corpo sem soltar o braço e passe a perna por cima da cabeça dele.','Sente perto do ombro dele antes de deitar, com os joelhos fechados.']},
  {id:'f-triangulo',name:'Triângulo',cat:'finalizacao',from:'Guarda',level:1,gi:'ambos',points:['Deixe um braço dele dentro e o outro fora das suas pernas.','Ajuste o ângulo: o corpo fica de lado em relação a ele.','Puxe a cabeça para baixo e aperte os joelhos, com a dobra do joelho travando o pé.']},
  {id:'f-kimura',name:'Kimura',cat:'finalizacao',from:'Guarda, lateral ou norte-sul',level:1,gi:'ambos',points:['Segure o punho dele e trave o seu outro braço por dentro (a "figura 4").','O cotovelo dele fica junto ao corpo dele.','Gire o braço dele para as costas, devagar.']},
  {id:'f-americana',name:'Americana',cat:'finalizacao',from:'Montada ou lateral',level:1,gi:'ambos',points:['Prenda o punho dele no chão, na altura da cabeça, com o cotovelo dobrado em 90°.','Faça a figura 4 por baixo do braço dele.','Arraste o punho dele em direção ao quadril e levante o cotovelo dele.']},
  {id:'f-mata-leao',name:'Mata-leão',cat:'finalizacao',from:'Costas',level:1,gi:'ambos',points:['A dobra do cotovelo vai embaixo do queixo, nunca na mandíbula.','A mão vai no bíceps do outro braço e a outra mão atrás da cabeça dele.','Feche os cotovelos e encoste o peito nas costas dele.']},
  {id:'f-cruzado',name:'Estrangulamento cruzado',cat:'finalizacao',from:'Guarda ou montada',level:1,gi:'kimono',points:['Primeira mão bem funda na gola, com os quatro dedos por dentro.','Segunda mão na outra gola, cruzando por cima ou por baixo.','Puxe os cotovelos para fora e para baixo, trazendo a cabeça dele.']},
  {id:'f-ezequiel',name:'Ezequiel',cat:'finalizacao',from:'Montada ou guarda do oponente',level:2,gi:'ambos',points:['Um braço passa por trás do pescoço e a mão segura a manga do outro braço.','A outra mão, com a lâmina, passa na frente da garganta.','Feche os dois braços como uma tesoura.']},
  {id:'f-guilhotina',name:'Guilhotina',cat:'finalizacao',from:'Guarda, em pé ou na defesa de queda',level:1,gi:'ambos',points:['O braço envolve o pescoço com o antebraço na garganta.','Feche a guarda ou abaixe o quadril para alongar o corpo dele.','Puxe o antebraço para cima, em direção ao seu peito.']},
  {id:'f-arm-triangle',name:'Triângulo de braço (katagatame)',cat:'finalizacao',from:'Montada ou lateral',level:2,gi:'ambos',points:['Prenda a cabeça e o braço dele juntos, com o braço dele contra o próprio pescoço.','Feche as mãos e mude para o lado oposto ao braço preso.','Encoste a cabeça no chão e aperte os cotovelos.']},
  {id:'f-omoplata',name:'Omoplata',cat:'finalizacao',from:'Guarda',level:2,gi:'ambos',points:['A perna passa por cima do ombro dele, prendendo o braço.','Gire para o lado e sente-se, controlando a cintura dele para ele não rolar.','Incline o tronco à frente, devagar.']},
  {id:'f-gola-costas',name:'Estrangulamento arco e flecha',cat:'finalizacao',from:'Costas',level:2,gi:'kimono',points:['Uma mão funda na gola dele, por trás do pescoço.','A outra mão segura a calça e a sua perna passa por cima do quadril dele.','Estique o corpo como um arco, puxando a gola e a perna.']},
  {id:'f-chave-pe',name:'Chave de pé reta',cat:'finalizacao',from:'Guarda aberta / leg lock',level:2,gi:'ambos',points:['O braço envolve o tendão de Aquiles, com a lâmina do antebraço por baixo.','A perna dele fica presa entre as suas e o pé dele vai na sua axila.','Arqueie o tronco para trás, devagar. Não torça o joelho.']},

  // ── Fugas e defesas ─────────────────────────────────────
  {id:'d-upa',name:'Fuga da montada: upa',cat:'fuga',from:'Montada (por baixo)',level:1,gi:'ambos',points:['Prenda o braço e o pé dele do mesmo lado.','Faça a ponte por cima do ombro, para o lado preso.','Termine dentro da guarda dele, com a postura alta.']},
  {id:'d-cotovelo-joelho',name:'Fuga da montada: cotovelo-joelho',cat:'fuga',from:'Montada (por baixo)',level:1,gi:'ambos',points:['Cotovelos fechados, protegendo o pescoço e os braços.','Vire de lado e encaixe o cotovelo no joelho dele, criando espaço.','Tire o joelho de dentro, passe a perna e recomponha a meia-guarda ou a guarda.']},
  {id:'d-lateral',name:'Fuga da lateral (reposição)',cat:'fuga',from:'Cem quilos (por baixo)',level:1,gi:'ambos',points:['Coloque os antebraços como uma armação no pescoço e no quadril dele. Não empurre com os braços esticados.','Fuga de quadril para longe dele, criando espaço.','Coloque o joelho no espaço e recomponha a guarda.']},
  {id:'d-costas',name:'Fuga das costas',cat:'fuga',from:'Costas tomadas',level:1,gi:'ambos',points:['Primeiro as mãos: proteja o pescoço e controle o braço que estrangula.','Escorregue para o lado do braço de baixo dele e encoste as costas no chão.','Gire o corpo para dentro da guarda dele ou para cima.']},
  {id:'d-armlock',name:'Defesa do armlock',cat:'fuga',from:'Guarda do oponente',level:1,gi:'ambos',points:['Junte as mãos ou segure a própria gola, sem esticar o braço.','Empilhe: leve o peso para cima dele, com o polegar para cima.','Gire o polegar e puxe o cotovelo de volta para a linha do corpo.']},
  {id:'d-triangulo',name:'Defesa do triângulo',cat:'fuga',from:'Guarda do oponente',level:1,gi:'ambos',points:['Postura alta, sem deixar a cabeça descer.','Coloque o braço preso de volta para dentro ou junte os dois braços.','Empilhe e ande em direção à perna de cima dele antes de ele ajustar o ângulo.']},
  {id:'d-guilhotina',name:'Defesa da guilhotina',cat:'fuga',from:'Pescoço preso',level:1,gi:'ambos',points:['Puxe o braço que estrangula para baixo, aliviando a garganta.','Se ele puxar a guarda, passe para o lado do braço que estrangula.','Ombro na cara dele e quadril baixo.']},
  {id:'d-mata-leao',name:'Defesa do mata-leão',cat:'fuga',from:'Costas tomadas',level:1,gi:'ambos',points:['As duas mãos no punho do braço que estrangula, puxando para baixo.','Encoste o queixo no peito, protegendo a garganta.','Depois de aliviar, siga com a fuga das costas.']},

  // ── Quedas e luta em pé ─────────────────────────────────
  {id:'q-puxada',name:'Puxada para a guarda',cat:'queda',from:'Em pé',level:1,gi:'ambos',points:['Faça a pegada antes de sentar.','Pé no quadril dele e sente-se perto, não longe.','Já sente encaixando a guarda escolhida.']},
  {id:'q-baiana',name:'Baiana (double leg)',cat:'queda',from:'Em pé',level:2,gi:'ambos',points:['Abaixe o nível dobrando os joelhos, não a coluna.','Dê o passo de penetração entre as pernas dele, com a cabeça encostada ao lado do corpo dele.','Segure atrás dos joelhos e mude de direção para derrubar.']},
  {id:'q-single',name:'Single leg',cat:'queda',from:'Em pé',level:2,gi:'ambos',points:['Prenda uma perna dele junto ao seu quadril.','Cabeça para dentro e coluna reta.','Termine girando ou varrendo a perna de apoio dele.']},
  {id:'q-osoto',name:'O-soto-gari',cat:'queda',from:'Em pé',level:2,gi:'kimono',points:['Pegada na gola e na manga, levando o peso dele para o calcanhar de trás.','Passe ao lado dele e ceife a perna por trás.','Acompanhe a queda sem soltar a manga.']},
  {id:'q-sprawl',name:'Defesa de queda (sprawl)',cat:'queda',from:'Em pé',level:1,gi:'ambos',points:['Jogue as pernas para trás e o quadril para o chão.','Afaste a cabeça dele com a mão e o antebraço.','Circule para as costas ou para a frente da cabeça dele.']}
];

export const TECH_BY_ID = Object.fromEntries(TECHNIQUES.map(t => [t.id, t]));

// Posições onde o atleta mais sofre — cada uma aponta para a fuga a estudar.
export const TROUBLE_SPOTS = {
  montada: { label: 'Montada por baixo', study: 'd-cotovelo-joelho' },
  lateral: { label: 'Cem quilos por baixo', study: 'd-lateral' },
  costas: { label: 'Costas tomadas', study: 'd-costas' },
  joelho: { label: 'Joelho na barriga por baixo', study: 'd-lateral' },
  guarda_passada: { label: 'Guarda passada com facilidade', study: 'g-meia' },
  nao_passo: { label: 'Não consegui passar a guarda', study: 'p-toreando' },
  em_pe: { label: 'Luta em pé / quedas', study: 'q-sprawl' },
  gas: { label: 'Faltou condicionamento', study: null }
};

export const SESSION_KINDS = { kimono: 'Kimono', nogi: 'Sem kimono', openmat: 'Open mat', competicao: 'Competição' };

/** Link de busca no YouTube: não aponta para um vídeo específico. */
export function videoSearchUrl(tech) {
  return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(tech.name + ' jiu jitsu');
}

export function techniqueStatus(techState, id) {
  const s = techState?.[id];
  return s && Number.isInteger(s.status) ? s.status : 0;
}

export function techniqueSummary(techState) {
  const counts = { 0: 0, 1: 0, 2: 0, 3: 0 };
  for (const t of TECHNIQUES) counts[techniqueStatus(techState, t.id)]++;
  const focus = TECHNIQUES.filter(t => techState?.[t.id]?.focus);
  return { counts, total: TECHNIQUES.length, focus };
}

export function filterTechniques({ q = '', cat = 'todas', status = 'todos' } = {}, techState = {}) {
  const query = q.trim().toLocaleLowerCase('pt-BR');
  return TECHNIQUES.filter(t =>
    (cat === 'todas' || t.cat === cat) &&
    (status === 'todos' || (status === 'foco' ? !!techState[t.id]?.focus : techniqueStatus(techState, t.id) === Number(status))) &&
    (!query || t.name.toLocaleLowerCase('pt-BR').includes(query) || t.from.toLocaleLowerCase('pt-BR').includes(query))
  );
}

/** Valida o objeto de técnicas vindo de backup. Campos extras são rejeitados. */
export function validTechState(obj) {
  if (obj === undefined) return true;
  if (!obj || typeof obj !== 'object' || Array.isArray(obj) || Object.keys(obj).length > 300) return false;
  return Object.entries(obj).every(([id, v]) =>
    typeof id === 'string' && id.length <= 40 && v && typeof v === 'object' &&
    Number.isInteger(v.status) && v.status >= 0 && v.status <= 3 &&
    (v.note === undefined || (typeof v.note === 'string' && v.note.length <= 500)) &&
    (v.focus === undefined || typeof v.focus === 'boolean') &&
    (v.updated === undefined || (typeof v.updated === 'string' && /^\d{4}-\d\d-\d\d$/.test(v.updated))));
}
