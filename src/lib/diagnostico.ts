/**
 * O diagnóstico de 6 perguntas.
 *
 * Arquivo puro: é lido pelo formulário no navegador e pela rota de API no
 * servidor. O score NUNCA é calculado no cliente e enviado pronto, porque
 * qualquer pessoa poderia mandar score 100. O cliente manda respostas, o
 * servidor decide o que elas valem.
 *
 * Por que estas seis e não outras:
 * - Faturamento ficou de fora. É a pergunta que mais afasta e a que mais
 *   recebe resposta inventada. "Quanto você investe hoje" mede a mesma
 *   capacidade de pagar sem constranger, e ainda diz o regime de orçamento.
 * - Cidade ficou de fora. O atendimento é remoto, então não decide nada.
 * - Prazo entrou porque urgência é o melhor previsor de fechamento e quase
 *   ninguém pergunta.
 */

export type OptionDef = {
  value: string;
  label: string;
  points?: number;
  /** Texto curto que aparece embaixo da opção escolhida. */
  echo?: string;
};

export type QuestionDef = {
  id: "problema" | "investimento" | "valor_cliente" | "canal_contato" | "prazo" | "decisor";
  pergunta: string;
  ajuda?: string;
  options: OptionDef[];
};

export const QUESTIONS: QuestionDef[] = [
  {
    id: "problema",
    pergunta: "O que mais incomoda hoje no seu negócio?",
    ajuda: "Escolha o que mais dói. A gente ajusta o resto a partir daqui.",
    options: [
      { value: "vender-mais", label: "Vendo menos do que eu poderia" },
      { value: "sem-retorno", label: "Invisto em anúncio e não sei quanto voltou" },
      { value: "sem-conversao", label: "Tenho visita e quase ninguém entra em contato" },
      { value: "marca-amadora", label: "Minha marca parece menor do que a empresa é" },
      { value: "nao-sei", label: "Não sei por onde começar" },
    ],
  },
  {
    id: "investimento",
    pergunta: "Quanto você investe por mês em anúncio hoje?",
    ajuda: "Só a verba de mídia, sem contar honorário de ninguém.",
    options: [
      { value: "nada", label: "Ainda não invisto", points: 5 },
      { value: "ate-500", label: "Até R$ 500", points: 5 },
      { value: "500-2000", label: "Entre R$ 500 e R$ 2.000", points: 18 },
      { value: "2000-5000", label: "Entre R$ 2.000 e R$ 5.000", points: 30 },
      { value: "acima-5000", label: "Acima de R$ 5.000", points: 30 },
    ],
  },
  {
    id: "valor_cliente",
    pergunta: "Quanto vale, em média, um cliente novo para você?",
    ajuda: "Se for recorrente, some o que ele costuma pagar até deixar de ser cliente.",
    options: [
      { value: "ate-500", label: "Até R$ 500", points: 5 },
      { value: "500-2000", label: "Entre R$ 500 e R$ 2.000", points: 15 },
      { value: "acima-2000", label: "Acima de R$ 2.000", points: 25 },
    ],
  },
  {
    id: "canal_contato",
    pergunta: "Como as pessoas entram em contato com você hoje?",
    options: [
      { value: "whatsapp", label: "WhatsApp" },
      { value: "direct", label: "Direct do Instagram" },
      { value: "telefone", label: "Telefone" },
      { value: "formulario", label: "Formulário no site" },
      { value: "presencial", label: "Presencial, na loja ou no consultório" },
      {
        value: "nao-sei",
        label: "Sinceramente, não sei dizer",
        points: 5,
        echo: "Essa é a resposta mais comum e a mais cara. Quem não sabe de onde vem o cliente não consegue investir onde funciona.",
      },
    ],
  },
  {
    id: "prazo",
    pergunta: "Quando você quer começar?",
    options: [
      { value: "atrasado", label: "Já estou atrasado", points: 25 },
      { value: "30-dias", label: "Nos próximos 30 dias", points: 25 },
      { value: "3-meses", label: "Nos próximos 3 meses", points: 10 },
      { value: "pesquisando", label: "Só pesquisando por enquanto", points: 0 },
    ],
  },
  {
    id: "decisor",
    pergunta: "Quem decide sobre isso na empresa?",
    options: [
      { value: "eu", label: "Eu decido", points: 15 },
      { value: "eu-e-socio", label: "Eu e um sócio", points: 15 },
      { value: "aprovar", label: "Preciso levar para alguém aprovar", points: 7 },
    ],
  },
];

export type Answers = Partial<Record<QuestionDef["id"], string>>;

export type Diagnostico = {
  score: number;
  temperatura: "quente" | "morno" | "frio";
  servico: string;
  titulo: string;
  hipotese: string;
  proximos: string[];
};

const SERVICO_POR_PROBLEMA: Record<string, string> = {
  "vender-mais": "Tráfego pago",
  "sem-retorno": "Infra de Medição",
  "sem-conversao": "Sites e landing pages",
  "marca-amadora": "Design e identidade visual",
  "nao-sei": "Diagnóstico e estratégia",
};

function pontos(id: QuestionDef["id"], value?: string): number {
  if (!value) return 0;
  const q = QUESTIONS.find((x) => x.id === id);
  return q?.options.find((o) => o.value === value)?.points ?? 0;
}

/**
 * Calcula score, temperatura e a hipótese de diagnóstico.
 *
 * A hipótese é a parte que vale mais para o visitante. Um formulário que
 * devolve "obrigado, entraremos em contato" não entrega nada. Este devolve
 * uma opinião, e é a opinião que faz a pessoa querer conversar.
 */
export function diagnosticar(a: Answers): Diagnostico {
  const score =
    pontos("investimento", a.investimento) +
    pontos("valor_cliente", a.valor_cliente) +
    pontos("prazo", a.prazo) +
    pontos("decisor", a.decisor) +
    pontos("canal_contato", a.canal_contato);

  const temperatura = score >= 70 ? "quente" : score >= 40 ? "morno" : "frio";

  // O problema de medição tem precedência sobre tudo. Enquanto ele existe,
  // qualquer outro diagnóstico é chute, porque não há número confiável.
  const cego = a.canal_contato === "nao-sei" || a.problema === "sem-retorno";

  const verbaBaixa = a.investimento === "ate-500" || a.investimento === "nada";
  const ticketBaixo = a.valor_cliente === "ate-500";

  let titulo: string;
  let hipotese: string;
  let proximos: string[];

  if (cego) {
    titulo = "O seu gargalo provavelmente é medição, não criativo.";
    hipotese =
      "Você não consegue dizer de onde vêm os clientes. Enquanto isso for verdade, trocar a arte do anúncio ou aumentar a verba é aposta, não decisão. O primeiro passo não é anunciar mais, é conseguir enxergar o que já acontece.";
    proximos = [
      "Instalar pixel e eventos de conversão no site",
      "Colocar parâmetro de origem em cada link de WhatsApp",
      "Registrar a origem de cada contato no atendimento",
    ];
  } else if (a.problema === "sem-conversao") {
    titulo = "O seu gargalo está entre a visita e a conversa.";
    hipotese =
      "Chega gente e quase ninguém fala com você. Isso quase nunca é falta de tráfego. Costuma ser oferta pouco clara, caminho de contato escondido ou página lenta o bastante para a pessoa desistir antes de ler.";
    proximos = [
      "Medir a velocidade real da página no celular",
      "Deixar um único caminho de contato óbvio em cada dobra",
      "Reescrever a primeira dobra em cima do problema do cliente",
    ];
  } else if (a.problema === "marca-amadora") {
    titulo = "O seu gargalo é percepção, e ele custa caro antes da conversa.";
    hipotese =
      "Marca inconsistente faz o cliente duvidar do preço antes de perguntar o preço. O problema raramente é o logo. É não existir um sistema, então cada peça parece de uma empresa diferente.";
    proximos = [
      "Definir um sistema visual, não peças avulsas",
      "Padronizar as peças que mais aparecem antes da venda",
      "Alinhar tom de voz com o nível de preço que você quer cobrar",
    ];
  } else if (verbaBaixa) {
    titulo = "A sua verba atual provavelmente está abaixo do mínimo viável.";
    hipotese =
      "Com verba muito baixa, a plataforma não consegue aprender quem é o seu comprador, e o resultado oscila sem explicação. Isso não é culpa do criativo nem do público. É limitação matemática de volume de dados.";
    proximos = [
      "Descobrir a verba mínima viável para o seu objetivo",
      "Concentrar em um único conjunto de anúncio, não espalhar",
      "Otimizar por um evento barato até haver volume",
    ];
  } else if (ticketBaixo) {
    titulo = "O seu desafio é margem por cliente, não volume de lead.";
    hipotese =
      "Com ticket baixo, o custo por cliente aceitável é pequeno, e mídia paga fica apertada rápido. Costuma render mais aumentar valor por cliente ou recorrência do que aumentar verba.";
    proximos = [
      "Calcular o custo máximo por cliente que fecha a conta",
      "Avaliar aumento de ticket, combo ou recorrência",
      "Só então decidir se mídia paga é o canal certo",
    ];
  } else {
    titulo = "O seu gargalo é geração de demanda.";
    hipotese =
      "Você tem operação e margem, e o que falta é volume qualificado entrando. Esse é o cenário em que mídia paga costuma pagar mais rápido, desde que a medição esteja de pé antes do primeiro real investido.";
    proximos = [
      "Estruturar funil e público antes de subir campanha",
      "Definir o que conta como lead qualificado, por escrito",
      "Medir custo por lead qualificado, não por lead",
    ];
  }

  return {
    score,
    temperatura,
    servico: SERVICO_POR_PROBLEMA[a.problema ?? "nao-sei"] ?? "Diagnóstico e estratégia",
    titulo,
    hipotese,
    proximos,
  };
}
