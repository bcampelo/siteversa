/**
 * Toda a copy da home v3, letra por letra como na referência
 * (site-v3/referencia-desktop.html). Os componentes de seção só leem daqui,
 * nada de texto escrito direto no JSX.
 *
 * Os textos dentro das peças dos clientes (card do Instagram do Sampaio,
 * anúncios da TransLima, artes da Arasuper) são ilustrativos até o Breno
 * confirmar. Os `*Label` são descrições para leitor de tela dos palcos
 * desenhados, que ficam com aria-hidden por dentro.
 */

/** Título com um trecho sublinhado à caneta. */
export type UnderlinedTitle = {
  before: string;
  underlined: string;
  after?: string;
};

/** Citação em latim à mão, com a tradução e a fonte embaixo. */
export type HandQuote = { latin: string; translation: string };

export const CTA_LABEL = "Falar com a Versa";

/* ---------------------------------------------------------------- Hero -- */

export const HERO = {
  /** As duas primeiras linhas do título. A terceira vem de `lastLine`. */
  lines: ["Pior que falarem", "da sua empresa"],
  /** "é ninguém falar." com "ninguém" circulado à mão. */
  lastLine: { before: "é ", circled: "ninguém", after: " falar." },
  cite: "Oscar Wilde, O Retrato de Dorian Gray, 1890",
  lede: "Social media, tráfego pago e sites para empresas de Rio Branco.",
  cta: CTA_LABEL,
  ctaNote: "a conversa é no WhatsApp",
  stageLabel:
    "Hermes de mármore falando num megafone, com as ondas de som desenhadas virando uma mensagem",
  hermesAlt: "Busto de mármore de Hermes falando num megafone",
  message: "Oi! Vi o anúncio de vocês.",
  note: "o anúncio certo vira cliente",
} as const;

/* ------------------------------------------------------------ Serviços -- */

export const SERVICOS = {
  quote: {
    latin: "esse est percipi",
    translation: "ser é ser percebido. George Berkeley, 1710",
  } satisfies HandQuote,
  title: {
    before: "Do primeiro post ao ",
    underlined: "primeiro cliente.",
  } satisfies UnderlinedTitle,
  lede: "Toda peça começa como rascunho. Aqui ele vira peça pronta na sua frente.",
  items: {
    social: {
      num: "01",
      title: "Social media",
      text: "Conteúdo com função antes da arte, para quem compra de você aqui.",
      stageLabel:
        "Rascunho de um post do Instagram que vira a peça pronta, com a promessa na capa",
      tag: "promessa na capa",
      post: {
        caption: "Abra seu Instagram. Conte os últimos 9 posts.",
        handle: "@helloversa",
      },
    },
    trafego: {
      num: "02",
      title: "Tráfego pago",
      text: "Anúncio no Meta e no Google, com relatório todo mês e sem mexida diária.",
      stageLabel:
        "Rascunho de um gráfico de anúncio que vira a peça pronta, com a curva de aprendizado da campanha subindo",
      tag: "sem mexer todo dia",
      chart: {
        title: "Seu anúncio não está caro. Está recomeçando.",
        label: "Gráfico ilustrativo de aprendizado da campanha",
      },
    },
    sites: {
      num: "03",
      title: "Sites e landing pages",
      text: "Página rápida que responde a pergunta que você digita toda semana.",
      stageLabel:
        "Rascunho de uma página que vira a peça pronta, com um botão de WhatsApp e a mensagem que chega",
      tag: "um botão só",
      page: {
        title: "A pergunta que virou página.",
        text: "Horário, preço e endereço, respondidos antes da mensagem.",
        button: "Falar no WhatsApp",
      },
      bubble: "Oi! Vi o site de vocês.",
    },
  },
} as const;

/* ----------------------------------------------------------- Trabalhos -- */

export const TRABALHOS = {
  title: {
    before: "Três clientes daqui, ",
    underlined: "três caras.",
  } satisfies UnderlinedTitle,
  lede: "Escritório, transportadora e farmácia de Rio Branco.",
} as const;

export const CASES = {
  sampaio: {
    name: "Sampaio & Gonçalves",
    description: "Social media e landing page do escritório.",
    /** Sem URL confirmada. O link "Ver ao vivo" só renderiza se isto tiver valor. */
    url: "",
    linkLabel: "Ver ao vivo",
    stageLabel:
      "Landing page e post do Instagram do escritório Sampaio & Gonçalves, ao lado da estátua da Justiça",
    statueAlt: "Estátua da Justiça de mármore segurando a balança",
    landing: {
      brand: "Sampaio & Gonçalves",
      title: "Sampaio & Gonçalves Advogados Associados",
      button: "Fale com o escritório",
    },
    card: {
      tag: "Direito do consumidor",
      text: "Seus direitos, em linguagem simples.",
    },
    note: "sério, sem juridiquês",
  },
  translima: {
    name: "TransLima Express",
    description:
      "Tráfego pago no Meta, um anúncio por temperatura de público.",
    stageLabel:
      "Três anúncios da TransLima Express, um para público frio, um para morno e um para quente, ao lado do Atlas de mármore",
    statueAlt: "Atlas de mármore carregando uma caixa de papelão",
    note: "a carga é o cliente",
    /** Esquerda e direita abrem em leque; o do meio é o principal. */
    ads: {
      left: { title: "Sua carga chega.", button: "Chamar no WhatsApp" },
      right: { title: "Sua carga em boas mãos.", button: "Chamar no WhatsApp" },
      center: {
        brand: "TransLima Express",
        title: "Entrega sem dor de cabeça.",
        button: "Chamar no WhatsApp",
      },
    },
    temperatures: { cold: "frio", warm: "morno", hot: "quente" },
  },
  arasuper: {
    name: "Drogaria Arasuper",
    description: "Artes e conteúdo para a farmácia, nas cores da loja.",
    stageLabel:
      "Artes da Drogaria Arasuper passando em colunas, ao lado da Hígia de mármore",
    statueAlt:
      "Hígia de mármore, deusa da saúde, segurando um frasco de remédio",
    note: "o balcão de sempre, no feed",
    pause: "Pausar",
    resume: "Continuar",
    /**
     * Três colunas de três artes; cada coluna é repetida uma vez no DOM para o
     * laço de 30s fechar sem salto. `tone` escolhe o fundo (green, yellow,
     * white), `marginTop` desloca a coluna em px e `reverse` inverte o sentido.
     */
    columns: [
      {
        marginTop: 0,
        reverse: false,
        tiles: [
          { tone: "green", text: "Ofertas da semana" },
          { tone: "white", text: "Tire suas dúvidas no balcão" },
          { tone: "yellow", text: "Fale no WhatsApp" },
        ],
      },
      {
        marginTop: -120,
        reverse: true,
        tiles: [
          { tone: "yellow", text: "Cuidado com a pele" },
          { tone: "green", text: "Unidade Betel" },
          { tone: "white", text: "Dica da farmacêutica" },
        ],
      },
      {
        marginTop: -60,
        reverse: false,
        tiles: [
          { tone: "white", text: "Mamãe e bebê" },
          { tone: "yellow", text: "Ofertas da semana" },
          { tone: "green", text: "Fale no WhatsApp" },
        ],
      },
    ],
    tileBrand: "Drogaria Arasuper",
  },
} as const;

/* --------------------------------------------------------- Mais peças -- */

/**
 * Seção depois dos cases: artes da Lastro e animações da Join Club.
 * Sem métrica, depoimento ou promessa de resultado (rodada 3, seção 2).
 * A legenda de cada arte repete o texto que está dentro da própria imagem.
 */
export const MAIS_PECAS = {
  title: "Mais peças.",
  lede: "Artes e animações de outros projetos.",
  lastro: {
    name: "Lastro",
    line: "Hamburgueria. Algumas artes.",
    label: "Artes da Lastro",
    prev: "Arte anterior",
    next: "Próxima arte",
    /** Rótulo dos pontos de navegação, com o número da arte. */
    goTo: "Ir para a arte",
    /** "Arte 2 de 6": nome de cada item para leitor de tela. */
    item: "Arte",
    of: "de",
    arts: [
      {
        src: "/v3/lastro/lastro-01.webp",
        caption: "Duas carnes. As duas importam.",
        alt: "Hambúrguer duplo com queijo e picles. Texto: Duas carnes. As duas importam.",
      },
      {
        src: "/v3/lastro/lastro-02.webp",
        caption: "Olha o que tem no meio.",
        alt: "Hambúrguer aberto em camadas sobre fundo amarelo. Texto: Olha o que tem no meio.",
      },
      {
        src: "/v3/lastro/lastro-03.webp",
        caption: "O segredo faz barulho.",
        alt: "Carne na chapa com espátula. Texto: O segredo faz barulho.",
      },
      {
        src: "/v3/lastro/lastro-04.webp",
        caption: "Ainda bem que eu vim.",
        alt: "Mulher sorrindo com um hambúrguer na mão. Texto: Ainda bem que eu vim.",
      },
      {
        src: "/v3/lastro/lastro-05.webp",
        caption: "Só mais uma.",
        alt: "Mão pegando uma batata frita. Texto: Só mais uma.",
      },
      {
        src: "/v3/lastro/lastro-06.webp",
        caption: "Pede o teu. A batata é nossa.",
        alt: "Amigos à mesa dividindo batatas. Texto: Pede o teu. A batata é nossa.",
      },
    ],
  },
  joinClub: {
    /** Vídeos mudos e em laço: o rótulo descreve o quadro para leitor de tela. */
    tv: {
      caption: "Join Club, animações para TV.",
      label: "Animação da Join Club para TV, em laço e sem som",
      webm: "/video/joinclub-tv.webm",
      mp4: "/video/joinclub-tv.mp4",
      poster: "/v3/joinclub-tv.webp",
      width: 1280,
      height: 720,
    },
    stories: {
      caption: "Join Club, stories.",
      label: "Animação da Join Club para stories, em laço e sem som",
      webm: "/video/joinclub-stories.webm",
      mp4: "/video/joinclub-stories.mp4",
      poster: "/v3/joinclub-stories.webp",
      width: 720,
      height: 1280,
    },
  },
} as const;

/* ------------------------------------------------ Roadmap (Como trabalhamos) -- */

/** Seis etapas desenhadas pela rolagem. A cópia aguarda confirmação do Breno. */
export const ROADMAP = {
  title: {
    before: "Do primeiro oi ao ",
    underlined: "relatório",
    after: " do mês.",
  } satisfies UnderlinedTitle,
  lede: "Seis etapas. Role a página e acompanhe a caneta.",
  handAlt: "Mão de mármore segurando uma caneta-tinteiro",
  steps: [
    {
      num: "01",
      title: "Conversa",
      text: "Você conta o que vende e para quem, no WhatsApp.",
    },
    {
      num: "02",
      title: "Diagnóstico",
      text: "Olho seu perfil, seus anúncios e a concorrência daqui.",
    },
    {
      num: "03",
      title: "Proposta",
      text: "Escopo, prazo e valor por escrito. Sem fidelidade.",
    },
    {
      num: "04",
      title: "Rascunho",
      text: "Estratégia e primeiras peças. Você aprova antes de ir ao ar.",
    },
    {
      num: "05",
      title: "No ar",
      text: "Post publicado, campanha rodando, página online.",
    },
    {
      num: "06",
      title: "Medição",
      text: "Relatório todo mês e ajuste do que não rendeu.",
    },
  ],
  back: "e volta para a conversa",
} as const;

/* ---------------------------------------------------------- Fechamento -- */

export const FECHAMENTO = {
  quote: {
    latin: "exegi monumentum aere perennius",
    translation:
      "ergui um monumento mais duradouro que o bronze. Horácio, Odes III.30",
  } satisfies HandQuote,
  /** Duas linhas, com quebra entre elas. */
  title: ["Me conta o que", "você vende."],
  text: "Quem responde a mensagem é quem vai fazer o trabalho.",
  cta: CTA_LABEL,
  /** O busto é decorativo: alt vazio. */
  bustAlt: "",
  /** A assinatura é link para /sobre: "Breno" e, embaixo, o convite. */
  sign: {
    name: "Breno",
    link: "Conheça quem faz o trabalho",
    href: "/sobre",
  },
} as const;

/* ---------------------------------------------------------------- Sobre -- */

export const SOBRE = {
  meta: {
    title: "Breno Campelo, fundador da Versa",
    description:
      "Breno Campelo, fundador da Versa. Desenvolvedor full stack e gestor de tráfego em Rio Branco, Acre.",
  },
  quote: {
    latin: "nosce te ipsum",
    translation: "conhece a ti mesmo. Inscrição do templo de Delfos",
  } satisfies HandQuote,
  /** Duas linhas, com quebra entre elas. */
  title: ["Breno", "Campelo"],
  role: "Fundador da Versa, Rio Branco",
  portraitAlt: "Breno Campelo",
  /** Notas à mão no retrato. A segunda tem duas linhas. */
  notes: {
    who: "quem atende é quem faz",
    both: ["código e campanha", "na mesma cabeça"],
  },
  bio: {
    title: {
      before: "Programo o site e cuido do ",
      underlined: "anúncio",
      after: " que leva gente até ele.",
    } satisfies UnderlinedTitle,
    text: "Por isso a Versa é pequena de propósito. A estratégia, a peça e o código passam pela mesma mesa.",
    /** `num` é o algarismo romano escrito à mão. */
    items: [
      {
        num: "i",
        title: "Desenvolvedor full stack",
        text: "Formado pelo Web Academy, programa de formação com a Motorola.",
      },
      {
        num: "ii",
        title: "Sistemas de Informação",
        text: "Graduando na UFAC, em Rio Branco.",
      },
      {
        num: "iii",
        title: "Marketing e tráfego pago",
        text: "Cerca de 4 anos na área, com diversos projetos já produzidos.",
      },
      {
        num: "iv",
        title: "Clientes daqui",
        // A Sabor Acreano depende da confirmação do Breno (spec 2.3). Se ele disser não, sai daqui.
        text: "Sampaio & Gonçalves, TransLima Express, Drogaria Arasuper e Sabor Acreano.",
      },
    ],
  },
  closing: {
    title: ["Agora você sabe", "quem vai responder."],
    text: "Me chama no WhatsApp e conta o que você vende.",
    cta: CTA_LABEL,
    sign: "Breno",
  },
} as const;

/* -------------------------------------------------------------- Rodapé -- */

export const RODAPE = {
  /** Mesmos links da referência. O primeiro grupo é o que ela mostra. */
  links: [
    { label: "Serviços", href: "/#servicos" },
    { label: "Trabalhos", href: "/#trabalhos" },
    { label: "Como trabalhamos", href: "/#como" },
    { label: "Sobre", href: "/sobre" },
  ],
  instagram: "Instagram",
  /** Rotas fora da home, que continuam acessíveis pelo rodapé. */
  more: [
    { label: "Todos os serviços", href: "/servicos" },
    { label: "Diagnóstico gratuito", href: "/diagnostico" },
    { label: "Ferramentas", href: "/ferramentas" },
    { label: "Privacidade e dados", href: "/privacidade" },
  ],
  copyright: "Versa",
} as const;

/* ----------------------------------------------------------- 404 e OG -- */

/** Única copy nova do projeto, aprovada no plano (seção 6.3). */
export const NOT_FOUND = {
  title: "Essa página não chegou.",
  text: "O endereço mudou ou nunca existiu.",
  button: "Voltar ao início",
  note: "a carga é o cliente, a página não",
  statueAlt: "Atlas de mármore carregando uma caixa de papelão",
} as const;
