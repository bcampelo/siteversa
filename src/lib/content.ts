/**
 * Conteúdo editorial do site.
 * Separado dos componentes de propósito: dá para reescrever copy, adicionar
 * cases ou trocar números sem tocar em uma linha de layout.
 */

/* =========================================================================
   SERVIÇOS — três pilares comerciais, vendidos por benefício
   ========================================================================= */

export type Service = {
  id: string;
  index: string;
  name: string;
  promise: string;
  description: string;
  deliverables: string[];
  outcome: string;
};

export const SERVICES: Service[] = [
  {
    id: "design",
    index: "01",
    name: "Design Gráfico",
    promise: "Sua marca finalmente parecendo do tamanho que ela é.",
    description:
      "Design não é enfeite: é o que faz alguém confiar na sua empresa antes de falar com você. Construímos um sistema visual consistente — não peças soltas — para que cada anúncio, post e apresentação reforcem a mesma percepção de valor.",
    deliverables: [
      "Identidade visual e branding",
      "Sistema visual para redes sociais",
      "Carrosséis e criativos de anúncio",
      "Apresentações e propostas comerciais",
      "Materiais gráficos e impressos",
      "Direção de arte contínua",
    ],
    outcome: "Autoridade percebida antes do primeiro contato",
  },
  {
    id: "trafego",
    index: "02",
    name: "Tráfego Pago",
    promise: "Investimento que volta em cliente, não em curtida.",
    description:
      "Impulsionar não é anunciar. Estruturamos funis com público certo, criativos testados e leitura de dados de verdade — para você saber exatamente quanto entrou para cada real investido e onde escalar.",
    deliverables: [
      "Meta Ads e Google Ads",
      "Estratégia de funil e públicos",
      "Criativos e copy para anúncios",
      "Testes A/B e otimização contínua",
      "Remarketing e recuperação de leads",
      "Relatórios claros, sem métrica de vaidade",
    ],
    outcome: "Previsibilidade de leads e custo por resultado sob controle",
  },
  {
    id: "web",
    index: "03",
    name: "Sites e Landing Pages",
    promise: "Um site que trabalha para vender — não só para existir.",
    description:
      "Desenvolvemos com engenharia de verdade: código próprio, performance medida e estrutura pensada para conversão. O mesmo cuidado de um produto digital aplicado ao principal cartão de visitas da sua empresa.",
    deliverables: [
      "Sites institucionais sob medida",
      "Landing pages de alta conversão",
      "Next.js, React e TypeScript",
      "SEO técnico e Core Web Vitals",
      "Integrações: WhatsApp, CRM, analytics",
      "Manutenção e evolução contínua",
    ],
    outcome: "Visitantes virando conversa, e conversa virando contrato",
  },
];

/* =========================================================================
   DIFERENCIAIS — bento grid
   ========================================================================= */

export type Differential = {
  title: string;
  body: string;
  span: "wide" | "tall" | "normal";
  visual: "grid" | "orbit" | "pulse" | "stack" | "code" | "chart";
};

export const DIFFERENTIALS: Differential[] = [
  {
    title: "Estratégia antes da execução",
    body: "Nenhum projeto começa no Figma nem no editor de código. Começa entendendo o negócio, a margem, o ciclo de venda e quem precisa ser convencido.",
    span: "wide",
    visual: "grid",
  },
  {
    title: "Somos uma empresa de tecnologia",
    body: "Design e mídia são a porta de entrada. Por trás existe engenharia: código versionado, arquitetura pensada, automação e IA aplicada onde gera ganho real.",
    span: "tall",
    visual: "code",
  },
  {
    title: "Zero template pronto",
    body: "Cada projeto é construído do zero para o seu posicionamento. Nada de tema comprado com o logo trocado.",
    span: "normal",
    visual: "stack",
  },
  {
    title: "Comunicação transparente",
    body: "Você sabe o que está sendo feito, por quê e o que vem depois. Sem sumiço e sem relatório enfeitado.",
    span: "normal",
    visual: "pulse",
  },
  {
    title: "Decisão guiada por dado",
    body: "Testamos, medimos e cortamos o que não performa. Opinião é ponto de partida; número é ponto de decisão.",
    span: "normal",
    visual: "chart",
  },
  {
    title: "Atendimento sênior, direto",
    body: "Você fala com quem executa. Sem camada de intermediário traduzindo o seu problema errado.",
    span: "normal",
    visual: "orbit",
  },
];

/* =========================================================================
   MÉTODO — o processo em 4 etapas
   ========================================================================= */

export type ProcessStep = {
  index: string;
  title: string;
  duration: string;
  body: string;
  bullets: string[];
};

export const PROCESS: ProcessStep[] = [
  {
    index: "01",
    title: "Diagnóstico",
    duration: "Dias 1–3",
    body: "Entendemos o negócio antes de propor qualquer coisa. Onde está o gargalo: percepção de marca, geração de demanda ou conversão?",
    bullets: [
      "Reunião de imersão",
      "Análise de concorrência",
      "Leitura de canais e ativos atuais",
    ],
  },
  {
    index: "02",
    title: "Estratégia",
    duration: "Dias 4–7",
    body: "Definimos posicionamento, mensagem, funil e prioridades. Você aprova um plano, não uma surpresa.",
    bullets: [
      "Posicionamento e tom de voz",
      "Arquitetura de funil",
      "Escopo, prazos e metas",
    ],
  },
  {
    index: "03",
    title: "Execução",
    duration: "Semanas 2–4",
    body: "Design, desenvolvimento e campanhas saem juntos e falando a mesma língua — porque são feitos pelo mesmo time.",
    bullets: [
      "Sistema visual e criativos",
      "Site ou landing page em produção",
      "Campanhas estruturadas e no ar",
    ],
  },
  {
    index: "04",
    title: "Otimização",
    duration: "Contínuo",
    body: "É aqui que a maioria para e a gente começa. Lemos os dados, cortamos o que não funciona e escalamos o que funciona.",
    bullets: [
      "Testes A/B semanais",
      "Ajuste de públicos e criativos",
      "Relatório com leitura, não só gráfico",
    ],
  },
];

/* =========================================================================
   TRABALHOS
   -------------------------------------------------------------------------
   COMO ADICIONAR RESULTADOS NUMÉRICOS:
   Cada case aceita um array `metrics` opcional. Se estiver vazio, o card
   simplesmente não renderiza a faixa de números — nada quebra.
   Ex.:  metrics: [
           { value: "+312%", label: "Leads via WhatsApp" },
           { value: "R$ 4,80", label: "Custo por lead" },
         ]
   ========================================================================= */

export type CaseMetric = { value: string; label: string };

export type CaseStudy = {
  id: string;
  client: string;
  sector: string;
  year: string;
  category: "Sites & Landing Pages" | "Design Gráfico" | "Social & Motion";
  headline: string;
  summary: string;
  scope: string[];
  /** Resultados numéricos — opcional. Ver comentário acima. */
  metrics: CaseMetric[];
  /** Resultados qualitativos entregues. */
  outcomes: string[];
  media:
    | {
        kind: "video";
        src: string;
        srcWebm?: string;
        poster: string;
        aspect: string;
      }
    | { kind: "gallery"; images: string[]; aspect: string };
  accent: string;
  featured?: boolean;
};

export const CASES: CaseStudy[] = [
  {
    id: "sampaio-goncalves",
    client: "Sampaio & Gonçalves",
    sector: "Advocacia",
    year: "2026",
    category: "Sites & Landing Pages",
    headline: "Um escritório de advocacia com presença digital à altura da banca.",
    summary:
      "Advocacia se vende por confiança. Construímos um site institucional sóbrio e sofisticado, com direção de arte própria, motion cinematográfico e caminho direto para o WhatsApp — traduzindo a seriedade do escritório para o ambiente digital.",
    scope: [
      "Site institucional",
      "Direção de arte",
      "Motion design",
      "Reels institucional",
      "Copy e mensagem",
    ],
    metrics: [],
    outcomes: [
      "Identidade digital sóbria, coerente com o setor jurídico",
      "Narrativa institucional em vídeo para redes e site",
      "Contato direto por WhatsApp em todas as dobras",
    ],
    media: {
      kind: "video",
      src: "/video/sg-site.mp4",
      srcWebm: "/video/sg-site.webm",
      poster: "/work/sg-site.webp",
      aspect: "16 / 9",
    },
    accent: "#c9a86a",
    featured: true,
  },
  {
    id: "campdev",
    client: "CampDev",
    sector: "Comunidade de tecnologia",
    year: "2026",
    category: "Design Gráfico",
    headline: "Conteúdo técnico embalado como conteúdo que as pessoas salvam.",
    summary:
      "Comunidade de desenvolvedores precisava de peças que competissem com o feed sem perder profundidade técnica. Criamos um sistema visual de carrossel com hierarquia forte, tipografia condensada e ritmo de leitura pensado para retenção slide a slide.",
    scope: [
      "Sistema visual de carrossel",
      "Direção de arte",
      "Copywriting técnico",
      "Adaptação para feed e stories",
    ],
    metrics: [],
    outcomes: [
      "Sistema replicável: novas edições saem em horas, não em dias",
      "Hierarquia visual desenhada para retenção até o último slide",
      "Linguagem que respeita o público técnico",
    ],
    media: {
      kind: "gallery",
      images: [
        "/work/campdev-01.webp",
        "/work/campdev-02.webp",
        "/work/campdev-03.webp",
        "/work/campdev-04.webp",
        "/work/campdev-05.webp",
      ],
      aspect: "4 / 5",
    },
    accent: "#4ade80",
  },
  {
    id: "lasi",
    client: "LASI",
    sector: "Liga acadêmica de computação",
    year: "2026",
    category: "Social & Motion",
    headline: "Uma liga acadêmica com cara de organização consolidada.",
    summary:
      "Processo seletivo, apresentação de diretoria e comunicação institucional dentro de um único sistema visual. Grid rígido, tipografia com peso e paleta própria fizeram a liga parecer maior — e mais séria — do que qualquer arte avulsa conseguiria.",
    scope: [
      "Sistema visual",
      "Artes para feed e stories",
      "Apresentação de diretoria",
      "Campanha de processo seletivo",
    ],
    metrics: [],
    outcomes: [
      "Padrão visual único para toda a comunicação da liga",
      "Peças de processo seletivo com leitura imediata",
      "Percepção institucional elevada junto aos alunos",
    ],
    media: {
      kind: "gallery",
      images: [
        "/work/lasi-01.webp",
        "/work/lasi-02.webp",
        "/work/lasi-03.webp",
        "/work/lasi-04.webp",
      ],
      aspect: "4 / 5",
    },
    accent: "#3b82f6",
  },
  {
    id: "versa",
    client: "Versa",
    sector: "Marca própria",
    year: "2026",
    category: "Design Gráfico",
    headline: "O sistema visual que aplicamos em nós mesmos primeiro.",
    summary:
      "Antes de vender método, aplicamos o nosso: posicionamento, sistema visual dark premium, plano de conteúdo com lógica de funil e uma série de peças que funcionam como um organismo único. Este site é a última camada desse trabalho.",
    scope: [
      "Posicionamento e tom de voz",
      "Sistema visual dark premium",
      "Plano editorial com funil",
      "Roteiros e motion",
    ],
    metrics: [],
    outcomes: [
      "Identidade coerente do logo ao último slide",
      "Plano de conteúdo com etapa de funil definida por peça",
      "Site próprio construído em Next.js pelo mesmo time",
    ],
    media: {
      kind: "gallery",
      images: [
        "/work/versa-01.webp",
        "/work/versa-02.webp",
        "/work/versa-03.webp",
        "/work/versa-04.webp",
        "/work/versa-05.webp",
      ],
      aspect: "4 / 5",
    },
    accent: "#7751bb",
  },
];

export const CASE_FILTERS = [
  "Todos",
  "Sites & Landing Pages",
  "Design Gráfico",
  "Social & Motion",
] as const;

/* =========================================================================
   TECNOLOGIA
   ========================================================================= */

export type TechItem = { name: string; use: string };

export const TECH_GROUPS: { label: string; items: TechItem[] }[] = [
  {
    label: "Front-end",
    items: [
      { name: "React", use: "Interfaces componentizadas e reutilizáveis" },
      { name: "Next.js", use: "Renderização no servidor, SEO e performance" },
      { name: "TypeScript", use: "Tipagem estática: menos bug em produção" },
      { name: "Tailwind CSS", use: "Design system consistente e enxuto" },
    ],
  },
  {
    label: "Back-end",
    items: [
      { name: "Node.js", use: "APIs e integrações em tempo real" },
      { name: "Java", use: "Sistemas robustos de longo ciclo de vida" },
      { name: "Spring Boot", use: "Serviços corporativos escaláveis" },
      { name: "PostgreSQL", use: "Dados relacionais com integridade" },
    ],
  },
  {
    label: "Infra & Dados",
    items: [
      { name: "Docker", use: "Ambientes idênticos do dev à produção" },
      { name: "Git", use: "Histórico versionado de cada decisão" },
      { name: "Supabase", use: "Auth, storage e banco em minutos" },
      { name: "Vercel", use: "Deploy global com edge network" },
    ],
  },
  {
    label: "Inteligência Artificial",
    items: [
      { name: "LLMs", use: "Atendimento e triagem de leads automatizados" },
      { name: "Automação", use: "Fluxos que eliminam trabalho manual" },
      { name: "Análise preditiva", use: "Leitura de dados para decidir onde escalar" },
      { name: "Geração de mídia", use: "Aceleração da produção criativa" },
    ],
  },
];

export const TECH_CODE = `// versa/lead-router.ts
export async function routeLead(lead: Lead) {
  const score = await qualify(lead);          // IA de triagem

  if (score >= 0.75) {
    await notify("whatsapp", lead);           // comercial na hora
    return track("lead.hot", { ...lead, score });
  }

  await enqueue("nurture", lead);             // remarketing
  return track("lead.warm", { ...lead, score });
}`;

/* =========================================================================
   COMPROMISSOS — no lugar de números inventados, padrões que a Versa cumpre
   ========================================================================= */

export type Commitment = {
  value: string;
  suffix?: string;
  prefix?: string;
  label: string;
  note: string;
  countTo?: number;
};

export const COMMITMENTS: Commitment[] = [
  {
    value: "3",
    label: "Pilares integrados",
    note: "Design, mídia e engenharia no mesmo time — não em três fornecedores.",
    countTo: 3,
  },
  {
    value: "24",
    suffix: "h",
    label: "Para retornar seu contato",
    note: "Dia útil. Sem formulário que cai no vazio.",
    countTo: 24,
  },
  {
    value: "90",
    prefix: "+",
    label: "Meta de performance",
    note: "Pontuação mínima que perseguimos no Lighthouse em cada entrega.",
    countTo: 90,
  },
  {
    value: "0",
    label: "Templates prontos",
    note: "Todo projeto é desenhado e codado do zero para a sua marca.",
    countTo: 0,
  },
];

/* =========================================================================
   FAQ
   ========================================================================= */

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Quanto custa trabalhar com a Versa?",
    a: "Depende do escopo, e isso é uma resposta honesta — não uma fuga. Um sistema visual, uma landing page e uma operação de tráfego contínua têm esforços muito diferentes. Na primeira conversa entendemos o seu cenário e apresentamos uma proposta com escopo, prazo e investimento fechados. Sem letra miúda.",
  },
  {
    q: "Em quanto tempo o projeto fica pronto?",
    a: "Landing pages ficam prontas normalmente entre 1 e 3 semanas. Sites institucionais entre 3 e 6 semanas. Tráfego pago entra no ar na primeira semana, mas os melhores resultados aparecem do segundo mês em diante — otimização exige dado acumulado, e qualquer um que prometa resultado imediato está vendendo sorte.",
  },
  {
    q: "Preciso contratar os três serviços juntos?",
    a: "Não. Você pode começar por onde dói mais. Mas vale saber: os três se potencializam. Anúncio bom levando para site ruim desperdiça verba, e site excelente sem tráfego é uma vitrine no deserto. Quando fazem sentido juntos, a gente diz — e quando não, também.",
  },
  {
    q: "Vocês trabalham com empresas de fora da região?",
    a: "Sim. Todo o processo funciona remoto: imersão por videochamada, acompanhamento por WhatsApp e entregas em ambiente compartilhado. Já atendemos clientes de segmentos distintos sem nunca precisar estar na mesma sala.",
  },
  {
    q: "O que acontece depois que o site vai ao ar?",
    a: "O site não é o fim do projeto. Oferecemos manutenção, evolução e leitura de dados para melhorar conversão ao longo do tempo. Se você preferir seguir sozinho, entregamos tudo documentado e sem amarras — o código e os acessos são seus.",
  },
  {
    q: "Por que vocês se chamam empresa de tecnologia e não agência?",
    a: "Porque a base do nosso trabalho é engenharia. Escrevemos código, versionamos, automatizamos processos e aplicamos IA onde ela gera ganho mensurável. Design gráfico e tráfego pago são serviços que oferecemos com excelência — mas a forma como resolvemos problemas é a de uma empresa de tecnologia.",
  },
];
