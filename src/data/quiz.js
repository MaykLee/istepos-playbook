export const QUIZ_DEFENSE = [
  // --- 10 perguntas originais ---
  { q: 'O TE está à esquerda. O Mike LB vai chamar:', opts: ['Lucky', 'Ringo', 'Fire', 'Blitz'], ans: 0, exp: 'TE à esquerda = força pra esquerda = Lucky.' },
  { q: 'Henry entra em motion lateral antes do snap. O que pode vir aí?', opts: ['Smash concept', 'Jet Sweep ou Jet Bubble', 'Cover 3', 'Buck Blitz'], ans: 1, exp: 'Motion lateral do WR mais rápido = Jet Sweep ou a opção de Bubble Screen (Jet Bubble).' },
  { q: 'O RB começa indo pro flat. Por que você não abre imediatamente pra cobrir?', opts: ['Porque vai fazer hitch', 'Pode ser Wheel — começa no flat e sobe fundo', 'É sempre Lead, sem bola', 'QB nunca olha pro flat'], ans: 1, exp: 'Wheel parece rota curta no flat mas vira profunda. Se você abre cedo, ele já está atrás de você.' },
  { q: 'A defesa está lotando a caixa. O que o coordenador disse pra temer?', opts: ['Corrida lateral', 'Blitz total', 'Rotas fundas — caixa cheia abre espaço no fundo', 'JP fazendo swing'], ans: 2, exp: "Paulo Barcelos: 'a tendência é a defesa descer mais pra caixa, daí pode dar espaço pro fundo'." },
  { q: 'Zanon (QB) está olhando pro lado esquerdo antes do snap. Onde você fica de olho?', opts: ['Lado esquerdo — ele vai pra lá', 'Lado direito (backside)', 'No Nose Tackle', 'No safety'], ans: 1, exp: 'Zanon é fã de jogar pro backside. Olhou pra esquerda = pode jogar pra direita.' },
  { q: 'JP está com a bola na mão. Você vai ser:', opts: ['Menos agressivo — ele é rápido', 'Mais agressivo — ele performa melhor em espaço aberto', 'Neutro', 'Recuado — pode ser fake'], ans: 1, exp: 'JP e Laurentino são mais efetivos em espaço aberto. No contato direto, vale ser agressivo e não dar espaço.' },
  { q: 'Na cobertura Smash, quem decide qual passe o QB joga?', opts: ['O RB', 'O Free Safety', 'O Cornerback', 'O Mike LB'], ans: 2, exp: 'QB lê o CB: fechou no hitch = joga corner fundo. Ficou fundo = joga hitch. O CB controla a jogada.' },
  { q: 'Cover 2 tem quantas zonas de cobertura no fundo?', opts: ['1', '2', '3', '4'], ans: 1, exp: 'Cover 2 = 2 safeties dividem o fundo em dois. 5 jogadores cobrem o curto.' },
  { q: "No Jet Bubble, quem 'decide' se é sweep ou bubble screen?", opts: ['O QB antes do snap', 'A defesa — se apertar no Henry, QB joga bubble', 'O RB escolhe', 'O coordenador via sinal'], ans: 1, exp: 'É um RPO: se a defesa apertar no lado do Henry, QB joga bubble pro outro lado.' },
  { q: 'Sem tag na jogada, o RB vai:', opts: ['Correr pelo gap A', 'Fazer rota de swing', 'Bloquear como Lead', 'Alinhar no slot'], ans: 2, exp: 'Regra do playbook: sem tag = RB é sempre LEAD.' },
  // --- 5 novas perguntas ---
  { q: 'No Stunt Slash, como os DEs se movimentam?', opts: ['Ambos fecham para dentro', 'Um corta diagonal pelo gap, o outro faz o inverso', 'Ambos mantêm a contenção de borda', 'Trocam de lado completamente'], ans: 1, exp: 'Slash: um DE corta diagonal pelo gap, o outro faz o movimento inverso. Cria confusão nos bloqueadores.' },
  { q: 'Buck Blitz ataca pelo lado do TE ou pelo lado fraco?', opts: ['Lado fraco (Away)', 'Lado forte (onde está o TE)', 'Sempre pelo gap A central', 'Depende do huddle call'], ans: 1, exp: 'Buck blitza pelo gap forte (lado do TE). Will blitza pelo lado fraco.' },
  { q: 'Cover 4 (Orange) tem quantas zonas no fundo?', opts: ['2', '3', '4', '5'], ans: 2, exp: 'Cover 4 = 4 zonas no fundo (F1, F2, F3, F4). Excelente contra passes profundos.' },
  { q: 'O Stunt Wiz faz o quê com os DLs?', opts: ['Penetram juntos pelo gap A', 'Redistribuem responsabilidade de gap — trocam de lado', 'Fecham os DEs para dentro', 'Atacam a borda simultaneamente'], ans: 1, exp: 'Wiz: redistribuição de responsabilidade de gap — os DLs trocam de lado, confundindo o bloqueio.' },
  { q: 'Você está em Cover 3. Um receiver faz hitch curto no seu terço. O que você faz?', opts: ['Abre imediatamente para cobrir o hitch', 'Mantém o terço, cobre o curto se a bola vier', 'Apoia a corrida primeiro', 'Dobra o coverage no receiver'], ans: 1, exp: 'Em Cover 3 você protege seu terço. Não abandone a zona — espere a bola antes de fechar.' },
]

export const QUIZ_COVERAGE = [
  { q: 'Analise o campo. Que cobertura está alinhada?', opts: ['Cover 2', 'Cover 3', 'Cover 4', 'Cover 2 Man'], ans: 0, exp: 'Dois safeties dividindo o fundo em duas zonas (ZONA 1 e ZONA 2) = Cover 2.', playId: 'stack-pinch-buck-blue' },
  { q: 'Veja as zonas no fundo. Que cobertura está sendo jogada?', opts: ['Cover 2', 'Cover 3', 'Cover 4', 'Cover 2 Man'], ans: 1, exp: 'Três zonas no fundo (CB esq + FS central + CB dir) = Cover 3. LBs cobrem o curto.', playId: 'stack-contain-buck-green' },
  { q: 'Observe o alinhamento dos DBs. Qual é a cobertura?', opts: ['Cover 2', 'Cover 3', 'Cover 4', 'Cover 2 Man'], ans: 2, exp: 'Quatro zonas no fundo (F1, F2, F3, F4) = Cover 4. Máxima proteção contra o profundo.', playId: '55-pinch-buck-orange' },
  { q: 'Que cobertura está sendo executada nessa formação?', opts: ['Cover 2', 'Cover 3', 'Cover 4', 'Cover 2 Man'], ans: 0, exp: 'Dois safeties no fundo = Cover 2. O stunt Axe não altera a cobertura traseira.', playId: 'angle-axe-blue' },
  { q: 'Analise as zonas de cobertura. O que está sendo jogado?', opts: ['Cover 4', 'Cover 2 Man', 'Cover 3', 'Cover 2'], ans: 2, exp: 'Três zonas no fundo = Cover 3. CB + FS + CB protegem profundo.', playId: 'stack-wiz-mike-green' },
  { q: 'Dois ou quatro safeties no fundo? Identifique a cobertura.', opts: ['Cover 2 Man', 'Cover 4', 'Cover 2', 'Cover 3'], ans: 1, exp: 'Quatro zonas no fundo = Cover 4. Cada safety cobre um quarto do campo.', playId: '55-pinch-will-orange' },
  { q: 'Veja as marcações no fundo do campo. Que cobertura é essa?', opts: ['Cover 3', 'Cover 4', 'Cover 2', 'Cover 2 Man'], ans: 2, exp: 'Dois safeties dividindo o fundo em duas zonas = Cover 2.', playId: 'stack-pinch-will-blue' },
  { q: 'Olhando para o campo, identifique a cobertura traseira.', opts: ['Cover 2', 'Cover 2 Man', 'Cover 4', 'Cover 3'], ans: 3, exp: 'Três zonas no fundo (CB + FS + CB) = Cover 3. Coberturas curtas ficam com os LBs.', playId: '55-contain-buck-green' },
]

export function generatePlayQuiz(play) {
  function sh(arr) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  function mkq(q, correct, wrongPool, exp) {
    const wrongs = sh(wrongPool).slice(0, 3)
    const all = sh([correct, ...wrongs])
    return { q, opts: all, ans: all.indexOf(correct), exp, playId: play.id }
  }

  const COV_LABEL = { Blue: 'Cover 2 (Blue)', Green: 'Cover 3 (Green)', Orange: 'Cover 4 (Orange)', Silver: 'Cover 2 Man (Silver)' }
  const COV_EXP = {
    Blue:   'Cover 2: dois safeties dividem o fundo em duas zonas. CBs cobrem o flat.',
    Green:  'Cover 3: três zonas no fundo (CB + FS + CB). LBs cobrem o curto.',
    Orange: 'Cover 4: quatro zonas no fundo. Excelente contra passes profundos.',
    Silver: 'Cover 2 Man: dois safeties + marcação individual nos receptores.',
  }
  const STUNT_EXP = {
    Pinch:   'Pinch: DEs fecham para dentro, comprimindo os gaps A e B.',
    Contain: 'Contain: DEs mantêm contenção da borda. QB não escapa lateralmente.',
    Slash:   'Slash: um DE corta diagonal pelo gap, o outro faz o movimento inverso.',
    Wiz:     'Wiz: redistribuição de gap — DLs trocam de lado após o snap.',
    Axe:     'Axe: DEs seguram o gap com técnica de eixo. Controlado e disciplinado.',
  }
  const FRONT_EXP = {
    Stack:         'Stack: linha de 4 com NT no gap A. Formação base equilibrada.',
    '55':          '55 (Over): linha deslocada para o lado forte. NT sai do gap A.',
    Angle:         'Angle: linha em ângulo — DE posicionado para criar ângulo imprevisível.',
    'LSU Prevent': 'LSU Prevent: 5 DBs em campo. Prioridade em não ceder passes profundos.',
    Dam:           'Dam: formação especial para situações táticas específicas.',
  }
  const MOD_EXP = {
    Buck:  'Buck blitza pelo gap forte (lado do TE).',
    Will:  'Will blitza pelo gap fraco (backside).',
    Mike:  'Mike blitza pelo gap A. Pressão central direta no QB.',
    Fire:  'Fire: Will + Buck blitzam juntos. Pressão dupla pelos gaps laterais.',
    WiM:   'WiM: Will + Mike blitzam juntos. Pressão pelo centro e lado fraco.',
    BuD:   'BuD: Buck + Dog blitzam. Overload no lado forte.',
    RoD:   'RoD: Rover + Dog blitzam pelo exterior.',
    Dog:   'Dog blitza pelo exterior, de ângulo surpresa.',
    Blood: 'Blood: combinação especial — confirmar com o coordenador.',
  }

  const qs = []

  // Q1: Frente
  qs.push(mkq(
    'Qual é a frente defensiva nessa jogada?',
    play.front,
    ['Stack', '55', 'Angle', 'LSU Prevent', 'Dam'].filter(f => f !== play.front),
    FRONT_EXP[play.front] || play.front,
  ))

  // Q2: Stunt
  qs.push(mkq(
    'Que stunt os DLs executam?',
    play.stunt,
    ['Pinch', 'Contain', 'Slash', 'Wiz', 'Axe'].filter(s => s !== play.stunt),
    STUNT_EXP[play.stunt] || play.stunt,
  ))

  // Q3: Blitz
  if (play.modifier.length === 0) {
    qs.push(mkq(
      'Há blitz nessa jogada?',
      'Sem blitz',
      ['Buck', 'Will', 'Mike', 'Fire'],
      'Essa jogada não tem blitz. Os LBs mantêm cobertura e responsabilidade de gap.',
    ))
  } else {
    const correctMod = play.modifier.join(' + ')
    qs.push(mkq(
      'Quem blitza nessa jogada?',
      correctMod,
      ['Buck', 'Will', 'Mike', 'Fire', 'WiM', 'BuD', 'RoD', 'Dog'].filter(m => !play.modifier.includes(m)),
      MOD_EXP[play.modifier[0]] || `${correctMod} blitza.`,
    ))
  }

  // Q4: Cobertura
  qs.push(mkq(
    'Qual é a cobertura traseira?',
    COV_LABEL[play.coverage],
    ['Blue', 'Green', 'Orange', 'Silver'].filter(c => c !== play.coverage).map(c => COV_LABEL[c]),
    COV_EXP[play.coverage] || play.coverage,
  ))

  return qs
}

export const QUIZ_SITUATIONS = [
  { q: '3rd & 15 no campo próprio. O que o ataque provavelmente vai fazer?', opts: ['Corrida pelo gap A', 'Passe curto no flat', 'Passe longo ou cruzamento profundo', 'QB sneak'], ans: 2, exp: '3rd & 15 = o ataque PRECISA ganhar 15 yards em um play. Espere rotas de médio/longo alcance.' },
  { q: '4th & 1 na linha de 40 adversária. O que esperar?', opts: ['Punt imediato', 'Field goal tentativa', 'Corrida direta ou QB sneak', 'Hail Mary'], ans: 2, exp: '4th & 1 = a apenas 1 yard de conversão, a tendência é tentar converter com corrida ou QB sneak.' },
  { q: 'Adversário perdendo por 7, 2 minutos restantes, sem timeouts. O que ele vai fazer?', opts: ['Correr o relógio para o OT', 'Drive de 2 minutos: passes saindo em campo ou curtos/médios rápidos', 'Punt e esperar o onside kick', 'Jogar conservador e esperar a defesa errar'], ans: 1, exp: '2 min + déficit de 7 + sem timeouts = drive de urgência com passes saindo em campo ou curtos para poupar o relógio.' },
  { q: '1st & 10 na própria linha de 5 yards. O que o ataque EVITA a todo custo?', opts: ['Corridas curtas para sair do campo', 'Passes de alto risco (deep bombs)', 'Screen passes pelo flat', 'Passes curtos no meio-campo'], ans: 1, exp: 'Na linha de 5 própria qualquer turno ou safety é catastrófico. Zero tolerância a risco — sem bombs.' },
  { q: 'Você ganha por 14 no 4Q, 5 minutos. Adversário com todos os timeouts. O que a defesa prioriza?', opts: ['Blitz agressivo para forçar erros', 'Cobrir o meio-campo e não deixar passes rápidos parar o relógio', 'Cover 0 man-to-man total', 'Apertar a caixa e eliminar a corrida'], ans: 1, exp: 'Com timeouts, passes curtos param o relógio fácil. Cubra o meio-campo e force o relógio a correr.' },
  { q: '2nd & 2. Qual tendência ofensiva você espera?', opts: ['Passe profundo (bombs)', 'Corrida ou passe curto de conversão', 'Punt antecipado', 'Kickoff surpresa'], ans: 1, exp: '2nd & short = alta probabilidade de corrida ou passe curto para converter com folga no 3rd down.' },
  { q: '3rd & 2 com TE alinhado tight na LOS. O que pode vir?', opts: ['Hail Mary', 'Play action ou corrida pelo lado do TE', 'Punt imediato', 'Shotgun spread pass fundo'], ans: 1, exp: 'TE tight em 3rd & short = ameaça de corrida pelo bloco + play action. Cubra a borda, desconfie do fake.' },
  { q: 'Adversário empatado, último drive, 1 minuto, no campo médio. O que você protege primeiro?', opts: ['A corrida pelo gap A', 'O avanço pelo meio-campo para FG range', 'A endzone com prevent defense pura', 'O punt block'], ans: 1, exp: 'Empatado no campo médio: o adversário quer FG range. Bloqueie o avanço pelo curto — não deixe ele entrar no range.' },
]
