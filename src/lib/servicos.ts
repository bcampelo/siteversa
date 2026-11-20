/**
 * Páginas de serviço para busca local.
 *
 * O site de uma página só não aparece para quem busca "criação de site em Rio
 * Branco" ou "tráfego pago Rio Branco", porque não existe uma página sobre
 * isso. Cada item abaixo vira uma rota em /servicos/[slug], entra no sitemap e
 * tem título, descrição e dados estruturados próprios.
 *
 * Regras de texto: nada de número que não foi medido, nada de preço aqui
 * (preço fica na seção de investimento da home), e o CTA é sempre uma
 * conversa no WhatsApp com a origem marcada.
 */

import type { WhatsAppSource } from "@/lib/whatsapp";

export type ServicoPagina = {
  slug: string;
  origem: WhatsAppSource;
  /** Nome curto, usado no índice e no breadcrumb. */
  nome: string;
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  h1: string;
  h1Destaque: string;
  lede: string;
  problema: { titulo: string; paragrafos: string[] };
  entregas: { titulo: string; texto: string }[];
  etapas: { titulo: string; texto: string }[];
  paraQuem: string[];
  faq: { q: string; a: string }[];
  cta: string;
};

export const SERVICOS_PAGINAS: ServicoPagina[] = [
  {
    slug: "criacao-de-sites-rio-branco",
    origem: "servico-web",
    nome: "Criação de sites",
    seoTitle: "Criação de sites em Rio Branco, Acre",
    seoDescription:
      "Sites e landing pages para negócios de Rio Branco e do Acre. Feitos a partir das perguntas que seus clientes fazem no WhatsApp, rápidos no celular e com medição de cliques.",
    eyebrow: "Criação de sites · Rio Branco, AC",
    h1: "Um site que responde o que seu cliente",
    h1Destaque: "pergunta no WhatsApp.",
    lede: "Preço, horário, endereço, como funciona e um botão para chamar. Quem procura sua empresa no Google encontra o que veio buscar, e você para de digitar a mesma resposta todo dia.",
    problema: {
      titulo: "Por que só o Instagram não basta",
      paragrafos: [
        "Quem busca \"seu serviço em Rio Branco\" no Google já decidiu comprar e está escolhendo de quem. Nessa busca aparecem o mapa, as notas e os sites. Perfil de Instagram quase sempre fica de fora.",
        "Um site também resolve o que acontece depois do anúncio. Se o clique cai num perfil, a pessoa precisa procurar o preço nos destaques e mandar mensagem para descobrir o horário. Muita gente desiste no caminho.",
      ],
    },
    entregas: [
      { titulo: "Site institucional ou landing page", texto: "Uma página por serviço quando faz sentido, para cada uma aparecer na busca certa." },
      { titulo: "Texto escrito com você", texto: "Partimos das perguntas reais dos seus clientes. O texto vem antes do layout." },
      { titulo: "Feito para o celular", texto: "Desenhamos primeiro para a tela pequena, onde seu cliente abre o link." },
      { titulo: "Ficha no Google Maps", texto: "Revisamos ou criamos a ficha da empresa e ligamos ao site." },
      { titulo: "Medição de cliques", texto: "Você sabe quantas pessoas clicaram para chamar no WhatsApp e de onde vieram." },
      { titulo: "Código próprio", texto: "Next.js e React, sem construtor de arrastar. Rápido de abrir e fácil de evoluir." },
    ],
    etapas: [
      { titulo: "Conversa", texto: "Levantamos as perguntas que você mais responde e o que você quer que o cliente faça." },
      { titulo: "Texto", texto: "Escrevemos as seções e você aprova antes de qualquer desenho." },
      { titulo: "Desenho e desenvolvimento", texto: "Primeiro no celular, depois no computador. Você acompanha por um link de teste." },
      { titulo: "Publicação", texto: "Domínio, medição, ficha no Google e o site no ar." },
    ],
    paraQuem: [
      "Clínicas, consultórios e escritórios que recebem muita pergunta repetida",
      "Comércio e serviço local que só tem Instagram",
      "Quem já anuncia e manda o clique para o perfil ou direto para o WhatsApp",
    ],
    faq: [
      { q: "Preciso ter domínio e hospedagem?", a: "Não. Se você ainda não tem, ajudamos a registrar o domínio no seu nome e cuidamos da publicação." },
      { q: "Consigo mudar o texto depois?", a: "Sim. Pequenas mudanças fazemos para você, e se fizer sentido deixamos um painel para você mesmo editar." },
      { q: "Vocês atendem fora de Rio Branco?", a: "Sim, o trabalho é todo remoto. A Versa é de Rio Branco e atende principalmente negócios do Acre." },
    ],
    cta: "Conversar sobre o meu site",
  },
  {
    slug: "sistemas-sob-medida-rio-branco",
    origem: "servico-sistema",
    nome: "Sistemas sob medida",
    seoTitle: "Sistemas sob medida em Rio Branco, Acre",
    seoDescription:
      "Sistemas simples para agenda, pedidos, cadastro de clientes e controle interno. Desenvolvidos em Rio Branco para o jeito que sua empresa já trabalha.",
    eyebrow: "Sistemas · Rio Branco, AC",
    h1: "Se a mesma tarefa toma horas da sua semana, ela pode virar",
    h1Destaque: "sistema.",
    lede: "Agenda com lembrete pelo WhatsApp, pedidos, cadastro de clientes, orçamento e relatórios. Feitos para o processo que sua empresa já tem, no celular e no computador.",
    problema: {
      titulo: "Quando a planilha começa a custar caro",
      paragrafos: [
        "A planilha começa com uma aba de clientes e outra de pedidos. Com o tempo aparecem fórmulas que ninguém lembra por que existem e cores que só uma pessoa entende.",
        "O custo não aparece em nenhuma célula. Aparece no pedido anotado duas vezes, no cliente cobrado errado, no horário que ninguém lembrou de confirmar e no dono que não pode tirar uma semana de folga.",
      ],
    },
    entregas: [
      { titulo: "Agenda com lembrete automático", texto: "O cliente recebe o aviso no WhatsApp e confirma ou remarca com um toque." },
      { titulo: "Pedidos e orçamentos", texto: "Tudo registrado num lugar só, com status, sem depender de print de conversa." },
      { titulo: "Cadastro de clientes", texto: "Histórico de cada cliente acessível para toda a equipe." },
      { titulo: "Relatórios simples", texto: "O que vendeu, o que faltou e o que está atrasado, sem montar planilha." },
      { titulo: "Acesso por perfil", texto: "Cada pessoa da equipe vê e mexe só no que precisa." },
      { titulo: "Evolução contínua", texto: "Começamos pelo menor sistema que resolve o problema e crescemos a partir do uso real." },
    ],
    etapas: [
      { titulo: "Mapeamento", texto: "Você mostra como a tarefa é feita hoje, com a planilha, o caderno ou as conversas." },
      { titulo: "Primeira versão", texto: "Construímos só o que resolve o problema principal e colocamos para a equipe usar." },
      { titulo: "Ajuste com uso real", texto: "Corrigimos o que atrapalha a rotina antes de acrescentar qualquer coisa." },
      { titulo: "Acompanhamento", texto: "Suporte e melhorias conforme a empresa muda." },
    ],
    paraQuem: [
      "Clínicas, salões, oficinas e estúdios com agenda cheia e faltas frequentes",
      "Comércio e distribuidora que controla pedido e estoque em planilha",
      "Prestador de serviço em que só uma pessoa sabe como as coisas funcionam",
    ],
    faq: [
      { q: "Vale mais a pena do que um sistema pronto?", a: "Nem sempre. Se existe um sistema pronto que resolve bem o seu caso, dizemos isso na conversa. Sob medida faz sentido quando o processo da empresa não cabe no pronto." },
      { q: "Funciona no celular?", a: "Sim. Os sistemas rodam no navegador, no celular e no computador, sem instalar nada." },
      { q: "E os meus dados?", a: "Ficam em banco de dados com acesso restrito, e você pode pedir uma cópia completa quando quiser." },
    ],
    cta: "Conversar sobre um sistema",
  },
  {
    slug: "trafego-pago-rio-branco",
    origem: "servico-trafego",
    nome: "Tráfego pago",
    seoTitle: "Gestão de tráfego pago em Rio Branco, Acre",
    seoDescription:
      "Anúncios no Instagram, Facebook e Google para negócios de Rio Branco e do Acre. Acompanhamento semanal, relatório mensal e conta de anúncios no nome do cliente.",
    eyebrow: "Tráfego pago · Rio Branco, AC",
    h1: "Anúncio que leva a pessoa até uma",
    h1Destaque: "conversa com você.",
    lede: "Montamos as campanhas no Instagram, no Facebook e no Google, acompanhamos toda semana e mandamos um relatório por mês com o que funcionou e o que vamos mudar.",
    problema: {
      titulo: "Impulsionar não é anunciar",
      paragrafos: [
        "O botão de impulsionar mostra o post para mais gente, mas não escolhe quem tem chance de comprar nem mede o que acontece depois do clique.",
        "Uma campanha de verdade define o público, o objetivo e para onde a pessoa vai. E mede quantas conversas cada anúncio gerou, para o dinheiro ir para o que funciona.",
      ],
    },
    entregas: [
      { titulo: "Meta Ads e Google Ads", texto: "Instagram, Facebook e busca do Google, conforme o seu cliente procura." },
      { titulo: "Conta no seu nome", texto: "A conta de anúncios e o gerenciador ficam com você. A Versa entra como administradora." },
      { titulo: "Medição de conversas", texto: "Pixel, conversões e origem marcada nas mensagens do WhatsApp." },
      { titulo: "Acompanhamento semanal", texto: "Ajustes com base nos dados, sem mexer todo dia e apagar o aprendizado da campanha." },
      { titulo: "Relatório mensal", texto: "O que entrou, quanto custou e o que muda no mês seguinte, em linguagem clara." },
      { titulo: "Depois do clique", texto: "Olhamos também a página e o atendimento, porque é ali que muita venda se perde." },
    ],
    etapas: [
      { titulo: "Conversa", texto: "Entendemos o que você vende, para quem e quanto pode investir." },
      { titulo: "Implantação", texto: "Gerenciador de negócios, pixel, conversões e as contas configuradas." },
      { titulo: "Campanhas no ar", texto: "Públicos, anúncios e destino definidos. O primeiro mês serve para aprender." },
      { titulo: "Leitura e ajuste", texto: "A partir do segundo mês a leitura de resultado fica confiável e as decisões ficam mais finas." },
    ],
    paraQuem: [
      "Negócios locais que já vendem e querem previsibilidade de clientes novos",
      "Quem impulsiona post e não sabe se voltou algum real",
      "Empresas que atendem pelo WhatsApp e querem saber de qual anúncio veio cada conversa",
    ],
    faq: [
      { q: "Quanto preciso investir em anúncio?", a: "Depende do custo de um cliente no seu setor. A calculadora de verba mínima no site mostra a conta, e na conversa fechamos um valor realista para o seu caso." },
      { q: "Tem fidelidade?", a: "Não. A renovação é mensal, com aviso prévio de 30 dias para encerrar." },
      { q: "Em quanto tempo vejo resultado?", a: "Os primeiros contatos costumam vir no primeiro mês, mas a leitura confiável de resultado vem a partir do segundo." },
    ],
    cta: "Conversar sobre anúncios",
  },
  {
    slug: "placa-nfc-avaliacao-google",
    origem: "servico-nfc",
    nome: "Placa NFC de avaliação",
    seoTitle: "Placa NFC de avaliação no Google em Rio Branco",
    seoDescription:
      "Placa de balcão com NFC e QR code que abre a avaliação da sua empresa no Google. O cliente aproxima o celular e avalia na hora, sem procurar nada.",
    eyebrow: "Placa NFC · Rio Branco, AC",
    h1: "Seu cliente aproxima o celular e",
    h1Destaque: "avalia na hora.",
    lede: "Uma placa de balcão com NFC e QR code que abre direto a tela de avaliação da sua empresa no Google. Sem baixar aplicativo e sem procurar nada.",
    problema: {
      titulo: "Cliente satisfeito esquece de avaliar",
      paragrafos: [
        "Ele gostou do atendimento, mas abrir o Google, procurar sua empresa e achar onde dar as estrelas dá trabalho. No caminho de casa, a intenção passa.",
        "As avaliações pesam na escolha de quem busca no Google Maps. A placa tira o trabalho do caminho e pede a avaliação no momento em que o cliente está satisfeito.",
      ],
    },
    entregas: [
      { titulo: "NFC e QR code", texto: "Funciona em celular com NFC e em qualquer celular com câmera." },
      { titulo: "Link direto para avaliar", texto: "Abre a tela de avaliação da sua ficha, não a página inicial do Google." },
      { titulo: "Arte com a sua marca", texto: "Cores e logo da empresa, no padrão do seu balcão." },
      { titulo: "Configuração", texto: "Gravamos o link e testamos em Android e iPhone antes da entrega." },
    ],
    etapas: [
      { titulo: "Ficha no Google", texto: "Conferimos se a ficha da empresa existe e está completa." },
      { titulo: "Arte", texto: "Montamos a placa com a sua marca e você aprova." },
      { titulo: "Gravação e teste", texto: "NFC gravado e QR conferido em mais de um aparelho." },
      { titulo: "Entrega", texto: "A placa chega pronta para o balcão." },
    ],
    paraQuem: [
      "Restaurantes, clínicas, salões, lojas e qualquer balcão com atendimento presencial",
      "Quem tem muito cliente satisfeito e poucas avaliações no Google",
    ],
    faq: [
      { q: "Funciona em iPhone?", a: "Sim. iPhones recentes leem NFC sem aplicativo, e o QR code funciona em qualquer celular com câmera." },
      { q: "Preciso ter ficha no Google?", a: "Sim. Se ainda não tiver, ajudamos a criar antes de gravar a placa." },
    ],
    cta: "Pedir a minha placa",
  },
];

export function getServicoPagina(slug: string): ServicoPagina | undefined {
  return SERVICOS_PAGINAS.find((s) => s.slug === slug);
}
