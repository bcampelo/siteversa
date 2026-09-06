/**
 * Calculadora de verba mínima viável.
 *
 * A conta que quase ninguém faz antes de subir campanha, e que explica a
 * maior parte dos resultados ruins em conta pequena.
 *
 * A Meta precisa de aproximadamente 50 eventos de otimização por conjunto de
 * anúncios a cada 7 dias para sair da fase de aprendizado. Abaixo disso o
 * sistema nunca aprende quem é o comprador, e o resultado oscila sem
 * explicação aparente. Não é culpa do criativo nem do público: é limitação
 * de volume de dados.
 *
 *   verba diária mínima = (custo por evento × 50) ÷ 7
 *
 * O que a ferramenta faz de diferente do resto do mercado é dizer a verdade
 * inconveniente. Muita gente vai descobrir aqui que não deveria estar
 * anunciando ainda, e essa resposta economiza o dinheiro dela e o nosso
 * tempo. Um diagnóstico que só diz "sim, contrate" não é diagnóstico.
 */

export type RegimeId = "micro" | "baixo" | "medio" | "alto";

export type Regime = {
  id: RegimeId;
  nome: string;
  faixa: string;
  descricao: string;
  regras: string[];
};

/**
 * Regimes de orçamento.
 *
 * Toda metodologia pública de mídia paga assume verba 10 a 50 vezes maior do
 * que a que a maioria das empresas pequenas do Brasil realmente usa. Operar
 * em regime micro não é operar errado, é operar sob outra regra. O que muda
 * não é o esforço, é o conjunto inteiro de decisões.
 */
export const REGIMES: Record<RegimeId, Regime> = {
  micro: {
    id: "micro",
    nome: "Regime micro",
    faixa: "abaixo de R$ 50 por dia",
    descricao:
      "Nessa faixa a fase de aprendizado da Meta é praticamente inalcançável para eventos caros. Dá para operar, mas com outro conjunto de regras, e ninguém conta isso.",
    regras: [
      "Um único conjunto de anúncios, nunca vários competindo",
      "Otimizar por evento barato: clique no link ou conversa iniciada",
      "Orçamento na campanha (CBO), não no conjunto",
      "Janela de decisão de 14 dias, não de 3",
      "Teste sempre sequencial, nunca dois ao mesmo tempo",
    ],
  },
  baixo: {
    id: "baixo",
    nome: "Regime baixo",
    faixa: "R$ 50 a R$ 150 por dia",
    descricao:
      "Já dá para aprender em eventos baratos e começar a ler diferença entre criativos, desde que a medição esteja de pé.",
    regras: [
      "No máximo dois conjuntos, com públicos claramente distintos",
      "Otimizar por conversa ou lead, ainda não por venda",
      "Decisão a cada 7 a 10 dias",
      "Trocar criativo antes de trocar público",
    ],
  },
  medio: {
    id: "medio",
    nome: "Regime médio",
    faixa: "R$ 150 a R$ 500 por dia",
    descricao:
      "Faixa em que a otimização por conversão começa a funcionar de verdade e testes simultâneos passam a fazer sentido.",
    regras: [
      "Estrutura com teste e escala separados",
      "Otimização por conversão do site quando o volume permitir",
      "Decisão semanal com significância mínima",
      "Remarketing como campanha própria",
    ],
  },
  alto: {
    id: "alto",
    nome: "Regime alto",
    faixa: "acima de R$ 500 por dia",
    descricao:
      "Volume suficiente para a metodologia padrão do mercado funcionar como está escrita nos manuais.",
    regras: [
      "Teste simultâneo com verba dedicada",
      "Otimização por evento de valor, não por volume",
      "Leitura por coorte e por janela de atribuição",
      "Escala por incremento controlado",
    ],
  },
};

export function regimePara(verbaDiaria: number): Regime {
  if (verbaDiaria < 50) return REGIMES.micro;
  if (verbaDiaria < 150) return REGIMES.baixo;
  if (verbaDiaria < 500) return REGIMES.medio;
  return REGIMES.alto;
}

export type EntradaVerba = {
  /** Quanto vale um cliente novo, em reais. */
  valorCliente: number;
  /** De cada 100 pessoas que pedem orçamento, quantas fecham. */
  taxaFechamento: number;
  /** Quanto do valor do cliente você aceita gastar para conquistá-lo, em %. */
  percentualAquisicao: number;
  /** Quanto você investe hoje por mês em mídia. */
  verbaMensalAtual: number;
};

export type ResultadoVerba = {
  cpaMaximo: number;
  cplMaximo: number;
  leadsPorCliente: number;
  minimoDiario: number;
  minimoMensal: number;
  verbaDiariaAtual: number;
  suficiente: boolean;
  cobertura: number;
  regimeAtual: Regime;
  regimeNecessario: Regime;
  veredito: string;
  recomendacoes: string[];
};

const EVENTOS_APRENDIZADO = 50;
const DIAS_JANELA = 7;

export function calcularVerba(e: EntradaVerba): ResultadoVerba {
  const valorCliente = Math.max(0, e.valorCliente);
  const taxa = Math.min(100, Math.max(1, e.taxaFechamento)) / 100;
  const pct = Math.min(100, Math.max(1, e.percentualAquisicao)) / 100;
  const verbaMensalAtual = Math.max(0, e.verbaMensalAtual);

  const cpaMaximo = valorCliente * pct;
  const cplMaximo = cpaMaximo * taxa;
  const leadsPorCliente = taxa > 0 ? 1 / taxa : 0;

  const minimoDiario = (cplMaximo * EVENTOS_APRENDIZADO) / DIAS_JANELA;
  const minimoMensal = minimoDiario * 30;

  const verbaDiariaAtual = verbaMensalAtual / 30;
  const suficiente = verbaDiariaAtual >= minimoDiario;
  const cobertura = minimoDiario > 0 ? verbaDiariaAtual / minimoDiario : 0;

  const regimeAtual = regimePara(verbaDiariaAtual);
  const regimeNecessario = regimePara(minimoDiario);

  let veredito: string;
  const recomendacoes: string[] = [];

  if (valorCliente <= 0) {
    veredito = "Preencha quanto vale um cliente para a conta fechar.";
  } else if (suficiente) {
    veredito =
      "Sua verba comporta o aprendizado da plataforma para esse objetivo. O gargalo, se existir, está em outro lugar: oferta, criativo, público ou medição.";
    recomendacoes.push(
      "Confirme que a conversão está sendo medida de verdade antes de escalar",
      "Defina por escrito o que conta como lead qualificado",
      "Acompanhe custo por lead qualificado, não por lead bruto",
    );
  } else if (cobertura >= 0.5) {
    veredito =
      "Sua verba está perto do mínimo, mas ainda abaixo. Na prática o resultado vai oscilar bastante de semana para semana, e vai ser difícil separar o que é criativo ruim do que é falta de volume.";
    recomendacoes.push(
      "Concentre tudo em um único conjunto de anúncios",
      "Otimize por um evento mais barato até acumular volume",
      "Decida com janela de 14 dias, não de 3",
    );
  } else {
    veredito =
      "Sua verba atual está bem abaixo do mínimo para esse objetivo. Isso não é falha de criativo nem de público: a plataforma simplesmente não recebe eventos suficientes para aprender. Aumentar a verba ou trocar o objetivo resolve mais do que trocar a arte.";
    recomendacoes.push(
      "Otimize por conversa iniciada ou clique, não por venda",
      "Um conjunto só, orçamento na campanha",
      "Aumente a verba ou reduza a ambição do evento antes de investir mais tempo em criativo",
      "Se aumentar não for possível agora, avalie canais de custo fixo antes de mídia paga",
    );
  }

  return {
    cpaMaximo,
    cplMaximo,
    leadsPorCliente,
    minimoDiario,
    minimoMensal,
    verbaDiariaAtual,
    suficiente,
    cobertura,
    regimeAtual,
    regimeNecessario,
    veredito,
    recomendacoes,
  };
}

export const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: v < 100 ? 2 : 0,
  }).format(Number.isFinite(v) ? v : 0);
