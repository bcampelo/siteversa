# Auditoria do site da Versa

Documento de diagnóstico comercial, não de UI.
Data: 06 de setembro de 2026.
Escopo auditado: `Projetos/Versa/03-Site/versa-site` (Next.js 16, App Router, TypeScript, Tailwind v4, Motion, React Three Fiber).
Método: leitura integral do código, da copy, da arquitetura de seções, dos metadados, das integrações e do que existe de instrumentação. Nada aqui foi inferido de screenshot.

Regra que segui: auditar como se o site fosse de um concorrente que eu preciso derrubar.

---

## SUMÁRIO EXECUTIVO

O site é um belíssimo folder digital. Ele não é um canal de aquisição. Essas são duas coisas diferentes, e a distância entre elas é o assunto deste documento.

O que está muito bom, sem falsa modéstia:

- A engenharia é séria. Fontes auto-hospedadas, cabeçalhos de segurança, cache imutável para mídia, orçamento de performance explícito para o 3D, preloader que roda sem JavaScript, skip link, `prefers-reduced-motion` respeitado em todas as animações. Contraste de texto passa em AA com folga (chalk 17,9:1, fog 8,1:1, fog-dim 5,6:1 sobre o ink).
- A copy é acima da média do mercado de agência. "Impulsionar não é anunciar" e "É aqui que a maioria para e a gente começa" são frases que vendem.
- O conteúdo está separado do layout em `content.ts`. Dá para reescrever o site inteiro sem tocar em componente. Isso é decisão de engenheiro, não de designer.

O que está errado, e está errado de forma grave:

**1. O site não mede nada.** Não existe GA4, não existe GTM, não existe pixel da Meta, não existe evento de clique, não existe UTM, não existe Conversions API. Grep no projeto inteiro por `gtag|gtm|analytics|pixel|fbq` retorna uma única linha, e é a palavra "analytics" dentro de um texto de venda. Uma empresa que vende gestão de tráfego pago tem um site cego. Isso não é só perda de dado, é risco de reputação no dia em que um cliente perguntar como a Versa mede o próprio site.

**2. O site repete no próprio caso o erro que a Versa diagnosticou no cliente.** No relatório da TransLima está escrito que o clique ia para o Instagram e de lá para o WhatsApp, e que por isso "não existe contagem de conversas iniciadas nem custo por contato". O site da Versa faz exatamente isso. Todos os CTAs, sem exceção, jogam o visitante para fora do domínio via `wa.me`. Nenhuma conversão é contável. Nenhum lead fica registrado. É o mesmo buraco, na casa de quem vende o conserto.

**3. Não existe nenhum caminho para quem não está pronto para conversar.** O site tem um único tipo de conversão: falar com humano, agora, no WhatsApp. Numa distribuição normal de tráfego frio, entre 1% e 3% das pessoas estão nesse estado. As outras 97% saem sem deixar rastro e sem possibilidade de retorno, porque não há pixel para remarketing nem e-mail para nutrição.

**4. O site promete um diagnóstico gratuito que não existe.** O hero exibe "Diagnóstico gratuito" como selo de confiança. Não há diagnóstico em lugar nenhum. É uma promessa cuja entrega depende de o visitante mandar mensagem e esperar. Essa é, ao mesmo tempo, a maior falha de coerência e a maior oportunidade destravada do site.

**5. O serviço mais vendável da Versa não tem uma única prova no site.** Existem quatro cases. Nenhum de tráfego pago. O filtro de trabalhos nem oferece a categoria. Todos os quatro têm `metrics: []`, ou seja, zero números. Dois dos quatro não são clientes comerciais (a própria Versa e uma liga acadêmica). Enquanto isso, TransLima e Dr. Werlitton existem, rodam campanha e não aparecem. O site diz "decisão guiada por dado" e não mostra um único dado.

**6. O site não está no ar.** `SITE.url` ainda é `https://versa.com.br`, que é um domínio de placeholder e não é da Versa. Não há repositório git inicializado na pasta. Sem domínio publicado não existe SEO, não existe indexação, não existe tráfego, não existe nada do que este documento propõe.

**7. Não há superfície de SEO.** Uma página, uma URL, um sitemap com uma entrada. Um site de uma página só compete pela busca do próprio nome da marca. Termos como "gestão de tráfego pago Rio Branco" ou "criação de site para advogado" não têm onde aterrissar.

**8. O maior ativo tecnológico da Versa está fora do site.** Existe um motor de diagnóstico de Meta Ads construído, testado (67 testes) e documentado, com classificação de regime de orçamento, árvore de decisão de oito ações e thresholds versionados. Isso vale mais como ferramenta pública do que qualquer seção "Tecnologia" com nome de framework escrito na tela. Está guardado numa pasta.

A tese central da auditoria: **o site fala que a Versa é uma empresa de tecnologia e prova isso com uma lista de tecnologias. Prova errada. A prova certa é o site fazer alguma coisa que uma agência comum não conseguiria construir.**

---

## PARTE 0 — O SITE POR DENTRO

Antes de criticar, o mapa do que existe.

### Arquitetura

Uma rota (`/`). Onze seções montadas em `page.tsx` na ordem impacto, dor, solução, método, prova, tecnologia, compromisso, objeção, convite.

```
Hero → Manifesto → Services → ServicesCta → Differentials →
Process → Work → Tech → Commitments → Faq → FinalCta
```

Sem rotas de API. Sem formulário. Sem página de obrigado. Sem página de política de privacidade. Sem blog. Sem `/servicos/*`. Sem `/cases/*`.

### Stack

Next 16, React 19, TypeScript, Tailwind 4, Motion 12, Lenis (scroll suave), React Three Fiber + Drei + Three 0.185. Fontes locais em woff2 (Inter Tight, Geist, Geist Mono, Instrument Serif). Deploy previsto para Vercel.

### Integrações existentes

Nenhuma. Literalmente. Os pontos de contato são:

| Ponto | Mecanismo | Mensurável? |
|---|---|---|
| Botão do header | `wa.me` com texto pré-preenchido | Não |
| CTA primário do hero | `wa.me` | Não |
| CTA de serviços | `wa.me` | Não |
| CTA da seção Trabalhos | `wa.me` | Não |
| CTA final | `wa.me` | Não |
| CTA secundário final | `mailto:` | Não |
| FAQ | `wa.me` | Não |
| Rodapé | `wa.me`, `mailto:`, Instagram | Não |
| Menu mobile | `wa.me`, `mailto:` | Não |

Nove pontos de saída, uma única mensagem pré-preenchida ("Olá! Vim pelo site da Versa e quero falar sobre um projeto"), zero segmentação de origem. Um lead que veio do card de tráfego pago chega exatamente igual a um que veio do rodapé. O atendimento começa do zero em 100% dos casos.

### SEO técnico

Bom no básico, inexistente no que importa.

Tem: metadata completa, canonical, OG e Twitter card com imagem, robots, sitemap, JSON-LD de `ProfessionalService` com `hasOfferCatalog`, `themeColor`, `lang="pt-BR"`.

Falta: `FAQPage` no JSON-LD (o site tem seis perguntas prontas e não marca nenhuma, é rich result de graça), `BreadcrumbList`, `LocalBusiness` com `geo` e `openingHours`, qualquer página que sustente um termo de cauda longa, qualquer link interno com âncora descritiva, e o domínio real.

### Performance e experiência

- Preloader de marca de 2,15 segundos, desktop, uma vez por sessão. Bonito. Caro. Em tráfego pago frio isso é imposto de saída cobrado no pior momento possível.
- `HeroCanvas` com React Three Fiber carregado sob `requestIdleCallback` com timeout de 2,4s, só em desktop, só sem `reduced-motion`. A defesa está bem feita, mas Three + Fiber + Drei é o maior bloco de JavaScript do projeto para renderizar um fundo que o halo em CSS já resolve. Vale medir o custo real de INP em máquina modesta antes de manter.
- A seção Método no desktop ocupa `100 + 4 × 55 = 320vh` de rolagem sequestrada. São mais de três telas de scroll horizontal antes do visitante chegar em Trabalhos, que é a prova. O elemento mais persuasivo do site está atrás do trecho mais longo do site.
- No mobile o CTA do header vira só o ícone do WhatsApp. Não existe barra fixa de ação no rodapé mobile, que é o padrão que mais converte em celular.
- Vídeos com `preload="none"`, `muted`, `loop`, `playsInline`. Correto.
- Imagem decorativa com `alt=""` e imagens de case com alt descritivo. Correto.

---

## PARTE 1 — DIAGNÓSTICO DE CONVERSÃO

### O teste dos 5 segundos

Simulei a leitura de alguém que nunca ouviu falar da Versa, chegando de um anúncio, no celular, com pressa.

| Pergunta | Resposta honesta |
|---|---|
| Entendo o que a Versa faz? | Parcialmente. O hero fala em design, engenharia e mídia paga, mas isso aparece no subtítulo, depois da headline, e "engenharia" não significa nada para um dono de clínica. |
| Entendo para quem ela faz? | **Não.** Não há uma palavra sobre porte, segmento, região ou tipo de cliente. O site serve igualmente uma padaria e uma indústria, o que na prática significa que não serve ninguém em específico. |
| Entendo qual problema resolve? | Só ao rolar. A dor está no Manifesto, que é a segunda seção. No hero não há problema, só afirmação. |
| Entendo por que continuar? | Sim. Visualmente o site prende. Esse é o ponto mais forte dele. |
| Existe proposta de valor clara? | Não no sentido comercial. Existe promessa emocional ("falta a internet saber disso"), não proposta de valor ("o que eu ganho, em quanto tempo, por quanto"). |
| Existe diferenciação? | Existe e está escondida. O diferencial real da Versa é ser tecnologia de verdade, e isso aparece pela primeira vez no card 02 da seção Diferenciais, quinta seção do site, e é explicado no FAQ, penúltima seção. |
| Existe razão para entrar em contato? | Só uma, e é a mais cara: falar com gente. |

### Análise do hero

O que está lá:

```
[chip] Empresa de tecnologia · aceitando projetos

Sua empresa já é boa.
Falta a internet saber disso.

A Versa é uma empresa de tecnologia. Unimos design, engenharia
e mídia paga para transformar presença digital em crescimento
real — não em curtida.

[Falar com a Versa]  [Ver trabalhos]

✓ Diagnóstico gratuito  ✓ Resposta em até 24h  ✓ Zero template pronto
```

**Headline.** "Sua empresa já é boa. Falta a internet saber disso." é boa de verdade. Tem ritmo, tem elogio implícito, tem tensão. É a melhor linha do site. O problema é que ela é uma linha de campanha de marca, não de aquisição. Ela funciona para quem já sabe quem é a Versa. Para tráfego frio ela consome os cinco segundos inteiros sem entregar o que a empresa vende nem para quem.

**Subheadline.** "transformar presença digital em crescimento real" é exatamente o tipo de frase que você pediu para eu caçar. É a versão educada de "levamos sua marca para o próximo nível". "Crescimento real" não significa nada porque ninguém promete crescimento falso. Some a frase e nada se perde.

**CTA primário.** "Falar com a Versa" é um CTA centrado na empresa e de alta fricção. O visitante que clica está aceitando iniciar uma conversa de vendas com um estranho. É o compromisso mais caro do site oferecido no momento de menor confiança.

**CTA secundário.** "Ver trabalhos" está correto e é o único caminho de baixo compromisso que existe. Mas ele leva a uma seção que está a mais de cinco telas de distância.

**Selos de confiança.** "Diagnóstico gratuito" é a promessa mais forte do hero e não tem entrega. Isso é pior do que não ter o selo, porque cria expectativa de ferramenta e entrega formulário de WhatsApp.

**Diagnóstico:** se eu tivesse que explicar a Versa depois de cinco segundos de hero, eu diria "é uma empresa de marketing com um site muito bonito". Isso é insuficiente. O site tem personalidade e não tem oferta.

### Proposta de hero reescrita

Três direções, com lógica diferente. Todas mantêm a estética e o tom.

**Direção A — a especificidade (recomendada para tráfego pago)**

```
Eyebrow: Empresa de tecnologia · Rio Branco, atendendo o Brasil

H1:   Marketing que você
      consegue auditar.

Sub:  Design, tráfego e engenharia no mesmo time. Você recebe o
      número que importa, quanto entrou para cada real investido,
      e o caminho para melhorar ele.

CTA1: Rodar o raio-x da minha campanha  (grátis, 2 minutos, sem cadastro)
CTA2: Ver o que já entregamos

Selos: Diagnóstico automático · Resposta em 24h úteis · Código e acessos são seus
```

Por que funciona: "auditar" é uma palavra que nenhuma agência da região usa, porque quase nenhuma sobrevive a uma auditoria. Ela ataca a desconfiança que é o real bloqueio de compra nesse mercado. E o CTA primário deixa de ser uma conversa e passa a ser uma entrega.

**Direção B — a dor com nome**

```
H1:   Você investe todo mês.
      E não sabe quanto voltou.

Sub:  A Versa é uma empresa de tecnologia que junta design, mídia
      paga e engenharia para fechar essa conta. Começa com um
      diagnóstico gratuito do que você já tem no ar.

CTA1: Descobrir o que está travando
CTA2: Ver trabalhos
```

Por que funciona: move a dor do Manifesto para o hero. O visitante se reconhece na primeira linha. Risco: é mais próximo do que outras agências fazem, perde parte da personalidade.

**Direção C — a provocação editorial (mantém mais da linha atual)**

```
H1:   Sua empresa já é boa.
      Falta a internet saber disso.

Sub:  Somos uma empresa de tecnologia. Desenhamos a marca,
      escrevemos o código e operamos a mídia. Um time só, uma conta
      só, um número no fim do mês.

CTA1: Rodar o diagnóstico gratuito
CTA2: Ver trabalhos
```

Por que funciona: mantém a melhor linha do site e conserta o que estava quebrado, que é o subtítulo genérico e o CTA de alta fricção. É a mudança de menor risco e provavelmente a primeira a testar.

Em qualquer das três, a mudança estruturalmente mais importante não é a frase. É o CTA primário deixar de ser "conversar" e passar a ser "receber alguma coisa".

---

## PARTE 2 — COPY

Fiz a varredura de `content.ts`, `site.ts` e de todo texto embutido em componente. Classifiquei cada bloco em três níveis: mantém, ajusta, reescreve.

### O que está bom e deve ser protegido

| Trecho | Por que funciona |
|---|---|
| "Impulsionar não é anunciar." | Corrige uma crença errada do cliente em quatro palavras. É a melhor frase comercial do site. |
| "É aqui que a maioria para e a gente começa." | Diferenciação por comportamento, não por adjetivo. |
| "Site excelente sem tráfego é uma vitrine no deserto." | Imagem concreta, vende o pacote sem empurrar. |
| "Opinião é ponto de partida; número é ponto de decisão." | Posicionamento em uma linha. |
| "Você fala com quem executa." | Ataca a dor real de quem já foi mal atendido por agência. |
| "Depende do escopo, e isso é uma resposta honesta, não uma fuga." | Antecipa a objeção e ganha confiança ao mesmo tempo. |
| Seção Compromissos inteira | Substituir estatística inflada por padrão verificável foi a decisão editorial mais madura do site. |

### O que é genérico e precisa cair

| Onde | Frase | Problema | Substituir por |
|---|---|---|---|
| Hero / SITE.description | "transformar presença digital em crescimento real" | Ninguém promete crescimento irreal. Frase de preenchimento. | "para você saber quanto entrou para cada real investido" |
| Services heading | "Três frentes. Um objetivo: crescimento." | "Crescimento" é o objetivo de qualquer empresa. Não diz nada. | "Três frentes. Uma conta no fim do mês." |
| Serviço 01 | "Sua marca finalmente parecendo do tamanho que ela é." | Bonita, mas é sobre estética, não sobre dinheiro. Design vendido como aparência. | "Parar de perder cliente para um concorrente pior que parece melhor." |
| FinalCta | "A próxima fase da sua marca começa com uma conversa." | "Próxima fase" é vago. E conversa não é entrega. | "Você não precisa contratar nada para descobrir o que está travando." |
| SITE.tagline | "Tecnologia, design e mídia paga sob o mesmo teto." | "Sob o mesmo teto" é clichê de agência full service dos anos 2000. | "Uma empresa de tecnologia que também opera a sua mídia." |
| Differentials lede | "A diferença está em como as decisões são tomadas" | Correto e invisível. Não dá exemplo. | Trocar por um exemplo real de decisão que a Versa tomou e o cliente lucrou. |

### O que falta na copy inteira

**1. O cliente não aparece.** Contei as ocorrências: o site fala de si mesmo muito mais do que fala do leitor. Os seis diferenciais são todos escritos da perspectiva da Versa ("Somos uma empresa de tecnologia", "Zero template pronto", "Atendimento sênior"). Nenhum começa pelo que muda na vida de quem lê. Regra de correção: cada diferencial deve terminar com a consequência para o cliente, não com a característica da Versa.

Exemplo de reescrita do card "Somos uma empresa de tecnologia":

> Atual: "Design e mídia são a porta de entrada. Por trás existe engenharia: código versionado, arquitetura pensada, automação e IA aplicada onde gera ganho real."
>
> Proposta: "Quando o gargalo é técnico, a gente não terceiriza nem improvisa. Já automatizamos triagem de lead, já construímos um motor próprio de análise de campanha e já reescrevemos um site inteiro porque o formulário perdia 30% dos envios. Agência não faz isso porque agência não escreve código."

**2. Não existe uma linha sobre para quem a Versa é.** Segmento, porte, faixa de investimento, região. O site fala com todo mundo. Falar com todo mundo é a forma mais cara de não converter ninguém. Sugestão de bloco novo, curto, logo abaixo do hero:

> **Trabalhamos bem com** clínicas, escritórios, comércio local e prestadores de serviço que já vendem e querem previsibilidade. Faturamento a partir de mais ou menos R$ 30 mil por mês, ou disposição de investir a partir de R$ 1.500 por mês em mídia.
>
> **Não somos a escolha certa para** quem quer post bonito sem estratégia, quem precisa de resultado em sete dias ou quem quer o menor preço da praça.

Dizer para quem você não serve é a forma mais rápida de ganhar confiança de quem você serve. E filtra lead ruim antes de gastar o tempo do comercial.

**3. Não existe preço em lugar nenhum.** O FAQ responde "depende" com elegância, mas o efeito prático é que uma parte do tráfego sai sem saber se cabe no orçamento. Não precisa tabelar. Precisa ancorar. "Projetos de site a partir de R$ X" e "gestão de tráfego a partir de R$ Y por mês, fora a verba de mídia" eliminam a pergunta mais comum do WhatsApp e qualificam sozinho.

**4. Não existe risco reversível.** Nenhuma garantia, nenhum piloto, nenhum "primeiro mês assim". Toda venda de serviço para PME trava no medo de errar. O site não oferece nada que reduza esse medo além de ser bonito.

**5. Nenhuma copy é escrita por serviço.** Quem chega buscando "criação de site" lê o mesmo texto de quem chega buscando "gestão de tráfego". Isso é consequência da arquitetura de página única e é o argumento mais forte para quebrar o site em páginas de serviço.

### Tom de voz: veredito

O tom está certo e é raro. Direto, sem eufemismo, com opinião. É genuinamente bom. O problema não é o tom, é o assunto. O site fala com muita personalidade sobre a Versa, e com pouca precisão sobre o cliente.

---

## PARTE 3 — O FUNIL DO SITE

Mapeamento do funil real, etapa por etapa, com o que existe e o que falta.

### VISITANTE

**O que temos.** Nada. Não há origem de tráfego definida, não há campanha apontando para o site, não há UTM, não há domínio publicado. O site existe como arquivo.

**O que falta.** Domínio, deploy, Search Console, uma campanha de marca e uma campanha de intenção. Sem isso o funil não começa.

**Como melhorar.** P0. Publicar, medir e apontar tráfego. Todo o resto deste documento depende deste item.

---

### ENTENDIMENTO

**O que temos.** Hero forte visualmente, Manifesto com comparativo "sem estratégia versus com a Versa" que é a melhor seção de argumentação do site.

**O que falta.** Clareza de oferta e de público no primeiro scroll. O visitante entende a estética antes de entender o negócio.

**Como melhorar.** Hero reescrito (Parte 1), bloco de "para quem é e para quem não é", e um resumo de três linhas do que a Versa entrega antes do Manifesto.

**Elemento que deveria existir.** Uma faixa logo abaixo do hero com os três serviços e o preço de entrada de cada um. Resolve entendimento e ancoragem no mesmo espaço.

---

### INTERESSE

**O que temos.** Serviços em cards empilhados com promessa, descrição, entregáveis e resultado esperado. Bem construído.

**O que falta.** Nenhum card de serviço tem CTA próprio. O único CTA da seção é um `wa.me` genérico depois dos três cards. Quem se identificou com "Tráfego Pago" e quer agir tem que rolar, achar um botão que não menciona tráfego e mandar uma mensagem que não diz de onde veio.

**Como melhorar.** CTA por serviço, com intenção específica e destino específico.

**Elemento que deveria existir.** Em cada card: "Ver como funciona na prática" levando à página do serviço, e "Rodar o diagnóstico de [tráfego / marca / site]" levando à ferramenta correspondente.

---

### CONSIDERAÇÃO

**O que temos.** Método em quatro etapas, seção Tecnologia, Diferenciais.

**O que falta.** Preço, escopo, prazo comparável, e qualquer coisa que ajude a decidir entre a Versa e o concorrente. O visitante em consideração está comparando, e o site não dá material de comparação.

**Como melhorar.** Faixas de investimento, um comparativo honesto "Versa versus agência tradicional versus freelancer versus fazer interno", e um simulador de escopo.

**Elemento que deveria existir.** Uma página de investimento. Não uma tabela de preço fechada, uma página que explica como a Versa cobra e o que faz o preço subir ou descer.

---

### CONFIANÇA

**Esta é a etapa mais fraca do site.**

**O que temos.** Quatro cases. Zero métricas (`metrics: []` nos quatro). Zero depoimento. Zero logo de cliente. Zero antes e depois. Zero rosto humano. Zero CNPJ, endereço ou qualquer prova de existência física.

Dos quatro cases: um é escritório de advocacia (cliente real), um é comunidade de tecnologia, um é liga acadêmica universitária, e um é a própria Versa. Ou seja, um único case comercial de verdade, e ele é de site, não de tráfego.

**O que falta.** Prova. Toda ela.

**Como melhorar.** Detalhado na Parte 12.

**Elemento que deveria existir.** Pelo menos um case de tráfego pago com número real, um depoimento em vídeo de 30 segundos, e uma foto de quem atende. Confiança em serviço local se compra com cara e nome.

---

### LEAD

**O que temos.** Um link de WhatsApp repetido nove vezes.

**O que falta.** Tudo o que faz um lead existir como registro. Não há formulário, não há captura de e-mail, não há CRM, não há planilha, não há evento, não há página de obrigado, não há confirmação. Se a pessoa clicar no WhatsApp e desistir de digitar, ela nunca existiu.

**Como melhorar.** Três caminhos paralelos, por temperatura:

- Quente: WhatsApp direto, como hoje, mas com mensagem pré-preenchida diferente por seção de origem.
- Morno: formulário curto de diagnóstico que devolve um relatório na hora.
- Frio: captura de e-mail em troca de material ou de acesso a uma ferramenta.

**Elemento que deveria existir.** Um destino próprio (`/diagnostico`) com formulário que grava no banco antes de mandar para o WhatsApp.

---

### QUALIFICAÇÃO

**O que temos.** Nada. Zero. A qualificação hoje acontece na cabeça do Breno, no WhatsApp, gastando o recurso mais caro da empresa, que é o tempo de quem executa.

**O que falta.** Um filtro automático que separe quem vale conversa de quem não vale, antes da conversa.

**Como melhorar.** Formulário inteligente de 6 perguntas (Parte 7) com score automático e roteamento.

**Elemento que deveria existir.** Score de lead calculado no envio, gravado junto com a resposta, e uma notificação diferente para lead quente e lead frio. Isso já está desenhado no próprio site, no bloco de código da seção Tecnologia (`routeLead`). O site mostra o código de uma coisa que ele não faz. Vale construir de verdade, é meia dúzia de horas.

---

### REUNIÃO

**O que temos.** Nada. Não há agendamento. A marcação depende de troca de mensagem.

**O que falta.** Agenda com link. Cada troca de mensagem para marcar horário é uma chance de esfriar.

**Como melhorar.** Cal.com ou Google Agenda com link público, oferecido só para quem passou no score. Lead frio não ganha acesso à agenda, ganha nutrição.

---

### CLIENTE

**O que temos.** Fora do escopo do site hoje.

**O que falta.** Proposta comercial em formato próprio (hoje provavelmente é PDF ou conversa), assinatura, onboarding.

**Como melhorar.** Proposta como página web na URL da Versa, com escopo, prazo, investimento e botão de aceite. Isso é venda e é demonstração de capacidade ao mesmo tempo.

### Onde exatamente o site perde gente

Ordenado por volume perdido, do maior para o menor:

1. **Entre visitante e lead, por ausência de opção intermediária.** Perda estimada de 95% a 99% do tráfego. Causa: um único CTA, de alta fricção, sem alternativa.
2. **Na etapa de confiança, por falta de prova numérica.** Quem chega perto de decidir não encontra motivo para escolher a Versa em vez do concorrente.
3. **Na saída para o WhatsApp.** Toda conversão sai do domínio e vira invisível. Não dá nem para saber o tamanho do vazamento.
4. **No preloader e no scroll longo, em tráfego pago.** 2,15s de intro mais 320vh de método antes da prova é caro em visita paga.
5. **Na ausência de remarketing.** Sem pixel, 100% de quem sai está perdido para sempre.

---

## PARTE 4 — FERRAMENTAS INTERATIVAS

Critério que usei para gerar e filtrar: a ferramenta precisa entregar valor mesmo para quem nunca contratar, precisa capturar um dado que muda a conversa comercial, e precisa ser difícil de copiar por uma agência que não tem programador. Ferramenta que qualquer um constrói não diferencia ninguém.

A Versa tem uma vantagem que quase nenhuma agência do país tem no mesmo lugar: um motor de diagnóstico de Meta Ads já construído, com regras determinísticas, thresholds versionados e classificação por regime de orçamento. Metade das ferramentas abaixo é fachada web para coisa que já existe.

### Camada 1 — as que só a Versa consegue construir

**01. Raio-X de Campanha**
O visitante sobe o export do Gerenciador de Anúncios (CSV ou XLSX) ou cola os números principais. O motor roda offline no servidor e devolve um relatório com nota de 0 a 100, achados por domínio (estrutura, público, criativo, orçamento, rastreamento, qualificação) e uma lista de ações classificadas em manter, pausar, testar, ajustar, redistribuir, escalar, reduzir ou aguardar dados. Sai com a identidade visual da Versa em PDF.
Por que é forte: o visitante recebe uma auditoria de agência sênior em dois minutos, de graça, e a Versa descobre verba, segmento, CPL, estrutura e nível de maturidade antes de qualquer conversa. É o lead mais qualificado que existe.
Esforço: médio. O motor existe. Falta a camada web, o parser de upload e o gerador de PDF.

**02. Calculadora de Verba Mínima Viável**
Pergunta o CPA alvo (ou ticket e taxa de fechamento) e devolve quanto a campanha precisa gastar por dia para a Meta conseguir otimizar de verdade. A conta é `(CPA alvo × 50) ÷ 7`. Com um CPA de R$ 60 isso dá R$ 428 por dia. O visitante que gasta R$ 20 por dia descobre em cinco segundos que está tentando fazer uma coisa matematicamente impossível, e descobre por que os resultados dele oscilam.
Por que é forte: esse número é conhecimento proprietário acumulado pela Versa operando contas pequenas, e contradiz frontalmente o que todo mundo vende na região. É a ferramenta com maior potencial de gerar conversa espontânea e de posicionar a Versa como quem sabe a matemática. Também é honesta: alguns visitantes vão descobrir que não devem contratar tráfego ainda, e isso economiza o tempo de todo mundo.
Esforço: baixíssimo. É uma tela e uma fórmula. Duas horas.

**03. Detector de Rastreamento**
O visitante cola a URL do site dele. A ferramenta carrega a página, identifica quais pixels estão instalados (Meta, Google, TikTok, GTM), se há eventos disparando, se o link de WhatsApp tem parâmetro de origem, se há página de obrigado, se há consentimento de cookie. Devolve um mapa do que ele está medindo e do que está perdendo.
Por que é forte: 90% dos anunciantes pequenos não fazem ideia de que estão cegos, e essa ferramenta prova isso em dez segundos, sem discussão. É exatamente o gargalo que a Versa identificou na TransLima. Vende sozinha o serviço de Infra de Medição.
Esforço: médio. Fetch da página, parse do HTML e de scripts conhecidos.

**04. Raio-X do Concorrente**
O visitante digita o nome ou a página do concorrente. A ferramenta consulta a Biblioteca de Anúncios da Meta, que é pública, e mostra quantos anúncios ele tem no ar, há quanto tempo cada um roda, quais criativos ele repetiu (sinal de que está performando) e quais ele matou rápido.
Por que é forte: nenhuma agência da região faz isso, é dado público, e a curiosidade sobre concorrente é o gatilho de clique mais confiável que existe em PME. Ainda serve como prova de que a Versa sabe ler mídia.
Esforço: médio. Depende da disponibilidade da API pública da Biblioteca de Anúncios, com scraping da versão web como plano B, respeitando os termos.

**05. Estimador de Perda por Site Lento**
Cola a URL, a ferramenta roda a API do PageSpeed Insights, pega LCP e INP reais de campo, pergunta o ticket médio e a estimativa de visitas mensais, e devolve uma frase: "seu site perde aproximadamente R$ X por mês em conversão por causa da velocidade".
Por que é forte: traduz métrica técnica em dinheiro, que é exatamente o que a Versa diz fazer. Vende site sem falar de site.
Esforço: baixo. A API do PageSpeed é gratuita.

**06. Prévia de Landing Page ao vivo**
O visitante digita o nome da empresa, o segmento e a oferta principal. Em poucos segundos o site monta e exibe uma landing page real, funcionando, com a estética da Versa, dentro do próprio site. Ele pode ver no celular. Para receber o link publicado ou o código, deixa o e-mail.
Por que é forte: é a demonstração mais direta possível de marketing, design e tecnologia acontecendo ao mesmo tempo. Uma agência comum não constrói isso. Também é o melhor argumento de venda de site que existe, porque o visitante já viu o produto.
Esforço: alto. Vale como bandeira, não como primeiro item.

### Camada 2 — diagnósticos e scores

**07. Diagnóstico de Site em 30 segundos**
Cola a URL. A ferramenta checa título, meta description, H1 único, dados estruturados, HTTPS, responsividade, presença de CTA visível, presença de contato, imagem sem alt, velocidade e indexação. Nota geral e nota por dimensão, com o que corrigir primeiro.

**08. Score de Marca**
Doze perguntas objetivas sobre consistência (você tem manual de marca, seu logo tem versão para fundo escuro, sua tipografia é a mesma em todas as peças, alguém consegue reconhecer sua marca sem ver o logo). Devolve uma nota, um gráfico por dimensão e o item mais barato de corrigir.

**09. Analisador de Perfil do Instagram**
Informa o @ ou sobe um print do perfil. Avalia clareza da bio, se a oferta é entendível em três segundos, se há CTA, se há destaque de prova social, se a grade tem sistema visual ou é peça avulsa. Devolve nota e três correções.

**10. Avaliador de Criativo**
Sobe a imagem ou o vídeo do anúncio. Avalia legibilidade no tamanho real do feed, hierarquia, contraste, proporção de texto, presença e clareza de CTA, e adequação de promessa. Para segmentos de saúde, checa também compliance de conselho profissional, que é uma dor real e cara.

**11. Teste de Maturidade de Marketing**
Vinte perguntas, cinco níveis (invisível, presente, ativo, mensurável, previsível). Devolve o nível, o que caracteriza quem está lá e qual é o único próximo passo. Deliberadamente um passo por vez, para não parecer venda de pacote.

**12. Qual serviço eu preciso**
Seis perguntas. Roteia para tráfego, marca ou site, explica o raciocínio e, quando for o caso, diz "no seu momento, nada do que vendemos resolve, resolva X primeiro". Essa resposta honesta é a que mais gera confiança e a que mais volta depois.

### Camada 3 — calculadoras e simuladores

**13. Simulador de ROI de campanha**
Entradas: ticket médio, margem bruta, taxa de fechamento, verba mensal. Saídas: CPL máximo aceitável, leads necessários, faturamento projetado e ponto de equilíbrio. Mostra a conta aberta, não só o resultado.

**14. Calculadora de CAC e LTV**
Quanto custa adquirir um cliente hoje, quanto ele vale ao longo do relacionamento, em quanto tempo se paga. Para negócio recorrente, inclui retenção média, que é onde quase todo mundo erra a conta.

**15. Simulador de escopo e investimento**
O visitante monta o projeto (identidade sim ou não, site de quantas páginas, tráfego em quantas plataformas, produção mensal de quantas peças) e recebe faixa de investimento e prazo estimado. Não é orçamento fechado, é ancoragem.

**16. Calculadora de custo do improviso**
Compara três cenários: fazer interno, contratar freelancer, contratar a Versa. Considera horas de sócio gastas, retrabalho e tempo até o resultado. Se for honesta, vai apontar freelancer como melhor escolha em alguns casos, e é justamente isso que a torna crível.

### Camada 4 — geradores e utilitários

**17. Gerador de briefing**
Oito a dez perguntas adaptativas. Devolve um briefing profissional em PDF que o visitante pode levar para qualquer fornecedor, inclusive concorrente. Valor real e desinteressado, o que faz dele um ativo de reputação. A Versa recebe um briefing pronto quando o lead volta.

**18. Gerador de calendário editorial**
Segmento e objetivo entram, saem 30 dias de pauta com formato, ângulo e etapa de funil por peça. A Versa já produz isso internamente, o custo marginal é baixo.

**19. Checklist de lançamento de campanha**
Vinte e quatro itens, com progresso salvo no navegador. Ao final, opção de receber por e-mail o que ainda falta. Simples, útil, e captura e-mail sem pedir nada em troca de nada.

**20. Verificador de nome de marca**
Digita o nome pretendido e a ferramenta checa disponibilidade de domínio e de arroba nas principais redes de uma vez. Topo de funil puro, alto compartilhamento, entrada natural para branding.

### Duas ideias fora da caixa

**21. Versa Índice**
Um painel público e atualizado com dados agregados e anonimizados das contas que a Versa opera: CPL mediano por segmento no Acre e no Norte, custo por conversa no WhatsApp, faixa de verba típica. Começa pequeno e vira, com o tempo, a única fonte pública de benchmark regional. Quem publica o índice de um mercado passa a ser a referência daquele mercado. É a jogada de posicionamento mais forte deste documento e a mais barata de começar.

**22. Modo auditoria do próprio site**
Um botão discreto no rodapé que abre uma camada sobre o site da Versa e anota, em cima de cada seção, a decisão de conversão por trás dela. "Este CTA está aqui porque a leitura de prova acabou." "Esta seção tem 320vh porque perdemos INP se comprimirmos." Transforma o site em aula e em portfólio ao mesmo tempo. Nenhuma agência tem coragem de fazer isso, porque exige que as decisões existam.

---

## PARTE 5 — FERRAMENTAS QUE VIRAM PRODUTO

Tabela de conversão de ferramenta em receita. Ticket em real, referência de mercado regional.

| Ferramenta | Valor gratuito entregue | Dado capturado | Tipo de lead | Serviço relacionado | Upsell | Potencial de receita |
|---|---|---|---|---|---|---|
| **Raio-X de Campanha** | Auditoria com nota e plano de ação | Verba, segmento, CPL, estrutura, plataforma, maturidade | Muito quente | Gestão de tráfego | Auditoria aprofundada paga, depois gestão mensal | **Altíssimo.** Diagnóstico avulso de R$ 497 a R$ 1.500. Gestão de R$ 1.200 a R$ 3.000 por mês |
| **Verba Mínima Viável** | Descobre se o orçamento dele funciona | Verba atual, ticket, segmento | Quente ou desqualificado (útil nos dois casos) | Gestão de tráfego | Consultoria de estruturação | Alto. Qualifica e desqualifica em segundos |
| **Detector de Rastreamento** | Mapa do que ele não mede | URL, stack, lacunas de medição | Muito quente | Infra de Medição | Gestão de tráfego, depois site | **Altíssimo.** Setup de R$ 1.500 a R$ 3.500, entrega em poucos dias |
| **Raio-X do Concorrente** | Inteligência competitiva real | Segmento, concorrentes, região | Morno | Estratégia, tráfego, criativo | Produção mensal de criativo | Médio, alto em volume de topo |
| **Estimador de Perda por Site Lento** | Um número em reais | URL, ticket, tráfego | Quente | Sites e landing pages | Manutenção, otimização contínua | Alto. Projeto de R$ 4.000 a R$ 15.000 |
| **Prévia de Landing ao vivo** | Uma página real dele mesmo | Segmento, oferta, nome, e-mail | Quente | Landing page | Tráfego para a landing | Alto, e é o melhor material de venda de site |
| **Diagnóstico de Site** | Nota técnica e correções | URL, problemas técnicos | Morno | Sites | Otimização, SEO técnico | Médio a alto |
| **Score de Marca** | Diagnóstico de consistência | Estágio da marca, materiais existentes | Morno | Branding e identidade | Direção de arte contínua | Médio. Identidade de R$ 3.500 a R$ 12.000 |
| **Analisador de Instagram** | Avaliação do perfil | @, segmento, presença atual | Morno | Social e design | Produção mensal | Médio, ótimo volume |
| **Avaliador de Criativo** | Nota e três correções | Nível do criativo, segmento, compliance | Quente | Criativo para anúncio | Produção recorrente | Alto. Pacote de criativo de R$ 800 a R$ 2.500 por mês |
| **Teste de Maturidade** | Nível e próximo passo | Maturidade, estrutura, equipe | Frio a morno | Todos | Consultoria de entrada | Médio. Excelente para nutrição |
| **Qual serviço eu preciso** | Direção honesta | Problema declarado, prioridade | Morno a quente | Roteia para o serviço certo | Pacote combinado | Alto, porque aumenta a taxa de acerto do comercial |
| **Simulador de ROI** | Conta aberta do próprio negócio | Ticket, margem, fechamento, verba | Quente | Tráfego | Consultoria de precificação | Alto |
| **Simulador de escopo** | Faixa de investimento e prazo | Escopo desejado, orçamento | Quente | Projeto fechado | Retainer depois da entrega | Alto. Encurta o ciclo de venda |
| **Gerador de briefing** | Briefing profissional em PDF | Projeto inteiro descrito | Morno a quente | Todos | Execução do briefing | Médio, alto em reputação |
| **Calendário editorial** | 30 dias de pauta | Segmento, objetivo, frequência | Frio a morno | Social e conteúdo | Produção mensal | Médio |
| **Checklist de campanha** | Lista prática | E-mail, estágio | Frio | Tráfego | Nutrição para diagnóstico | Baixo direto, alto como topo de funil |
| **Versa Índice** | Benchmark regional público | Nada diretamente, tudo em autoridade | Frio | Todos | Todos | Baixo direto, altíssimo em posicionamento e imprensa |

Leitura da tabela: as três primeiras linhas concentram a maior parte do valor comercial e são, juntas, menos de três semanas de trabalho, porque duas delas já têm o motor pronto.

---

## PARTE 6 — O SITE COMO VENDEDOR

Hoje o site apresenta. Ele deveria conduzir. A diferença é que apresentar entrega informação e conduzir entrega uma conclusão.

O fluxo abaixo é o que um vendedor sênior faria numa primeira conversa, transposto para tela. Ele funciona como camada sobre o site, não como substituição dele.

### O fluxo

```
                     [ Visitante entra ]
                             │
              "Quer descobrir o que está travando
                    o seu marketing?"
                             │
                     ┌───────┴───────┐
                     │  1. INTENÇÃO  │
                     └───────┬───────┘
        "O que mais incomoda hoje no seu negócio?"
                             │
   ┌──────────┬──────────────┼──────────────┬──────────┐
   │          │              │              │          │
"Vendo    "Invisto e     "Tenho visita  "Minha marca  "Não sei
 pouco"    não sei o      e ninguém      parece        por onde
           retorno"       fala comigo"   amadora"      começar"
   │          │              │              │          │
   └──────────┴──────────────┼──────────────┴──────────┘
                             │
                     ┌───────┴───────┐
                     │ 2. CONTEXTO   │   3 a 4 perguntas, adaptadas
                     └───────┬───────┘   à resposta anterior
                             │
                     ┌───────┴───────┐
                     │ 3. HIPÓTESE   │  "Pelo que você descreveu, o
                     └───────┬───────┘   seu gargalo provavelmente
                             │           não é X. É Y."
                     ┌───────┴───────┐
                     │  4. PROVA     │  Case, número ou peça do
                     └───────┬───────┘   mesmo problema, filtrado
                             │
                     ┌───────┴───────┐
                     │ 5. TAMANHO    │  "Resolver isso costuma custar
                     └───────┬───────┘   entre R$ A e R$ B, em N semanas"
                             │
                     ┌───────┴───────┐
                     │ 6. OFERTA     │  "Quer que a gente analise o
                     └───────┬───────┘   seu caso especificamente?"
                             │
              ┌──────────────┴──────────────┐
              │                             │
        Score alto                     Score baixo
              │                             │
    Agenda + WhatsApp direto      Relatório por e-mail
    com contexto já preenchido    + sequência de nutrição
```

### As seis etapas em detalhe

**1. Intenção.** Uma pergunta só, com cinco opções, escrita na linguagem do cliente e não na da agência. Ninguém procura "branding". As pessoas procuram "minha marca parece amadora". Essa pergunta sozinha resolve metade da personalização do site.

**2. Contexto.** Três a quatro perguntas que mudam conforme a resposta da etapa 1. Quem disse "invisto e não sei o retorno" recebe perguntas sobre verba, plataforma e destino do clique. Quem disse "minha marca parece amadora" recebe perguntas sobre materiais existentes e tempo de mercado. Nunca perguntar o que não vai ser usado.

**3. Hipótese.** O momento que faz a diferença. O site precisa arriscar um diagnóstico, não devolver um menu. "Você investe R$ 20 por dia e manda o clique para o perfil do Instagram. O seu problema não é criativo, é que você não consegue medir nem otimizar nada. Trocar a arte não vai resolver." Isso é o que um sênior falaria, e é o que faz o visitante pensar "essa gente entendeu".

**4. Prova.** Mostrar só o case que corresponde ao diagnóstico. Prova genérica não convence, prova específica sim. Se o diagnóstico foi medição, mostrar a TransLima. Se foi percepção de marca, mostrar o escritório de advocacia.

**5. Tamanho.** Faixa de investimento e prazo. É aqui que a maior parte do lead ruim se autoelimina e o lead bom relaxa. Esconder preço não protege a venda, só adia o desencontro.

**6. Oferta.** O convite muda de acordo com o score. Lead quente ganha agenda e WhatsApp com o contexto já resumido na mensagem. Lead frio ganha o relatório por e-mail e entra em nutrição, sem nunca ouvir um não.

### O detalhe que a maior parte das agências erra

O fluxo precisa ter uma saída honesta. Em pelo menos um caminho o site deve dizer "com o que você descreveu, contratar tráfego agora seria desperdício, resolva X primeiro, volte quando estiver pronto e a gente ajuda". Quem recebe isso não compra hoje, mas volta e indica. Essa saída é o que separa consultoria de balcão.

---

## PARTE 7 — QUALIFICAÇÃO DE LEADS

Objetivo: descobrir com o menor número possível de perguntas se o lead merece uma conversa. Cada campo a mais derruba a taxa de conclusão, então cada pergunta precisa ganhar o lugar dela.

Testei mentalmente a lista que você sugeriu e cortei o que não muda decisão nenhuma. Faturamento é a pergunta que mais assusta e mais mente. Cidade não decide nada, porque o atendimento é remoto. Tamanho de equipe só importa quando o serviço é operação contínua.

### As seis perguntas que ficam

**1. Qual é o principal problema hoje?**
Cinco opções em linguagem de cliente. Define o roteamento e o resto do formulário.
Peso no score: define a trilha, não pontua.

**2. Quanto você investe hoje por mês em anúncio?**
Faixas: nada ainda, até R$ 500, R$ 500 a R$ 2.000, R$ 2.000 a R$ 5.000, acima de R$ 5.000.
Por que essa e não faturamento: mede a mesma coisa (capacidade de pagar) sem constrangimento, e ainda diz se a conta cai em regime micro, baixo, médio ou alto. Serve para o comercial e para a operação.
Peso: alto.

**3. Quanto vale, em média, um cliente novo para você?**
Faixas amplas. É a pergunta que permite calcular CPA máximo aceitável e é a que separa um negócio com espaço para mídia de um que não tem.
Peso: alto.

**4. Como as pessoas entram em contato hoje?**
WhatsApp, telefone, formulário no site, direct do Instagram, presencial, não sei dizer.
"Não sei dizer" é a resposta mais valiosa do formulário inteiro, porque revela o problema de medição que a Versa vende.
Peso: médio, mas altíssimo valor de diagnóstico.

**5. Quando você quer começar?**
Já estou atrasado, nos próximos 30 dias, nos próximos 3 meses, só pesquisando.
A pergunta de urgência é a que melhor prevê fechamento e a que menos gente coloca.
Peso: alto.

**6. Quem decide sobre isso na empresa?**
Eu decido, eu decido junto com um sócio, preciso levar para alguém aprovar.
Peso: médio.

Mais o campo de contato: nome, WhatsApp e e-mail. E um campo opcional de texto livre com o rótulo "quer contar mais alguma coisa?", que muita gente preenche e onde costuma estar a informação mais útil de todas.

### Score

Fórmula simples, calculada no envio e gravada com a resposta.

| Critério | Pontos |
|---|---|
| Investe acima de R$ 2.000 por mês | 30 |
| Investe R$ 500 a R$ 2.000 | 18 |
| Investe até R$ 500 ou nada | 5 |
| Cliente vale acima de R$ 2.000 | 25 |
| Cliente vale R$ 500 a R$ 2.000 | 15 |
| Cliente vale menos de R$ 500 | 5 |
| Quer começar já ou em 30 dias | 25 |
| Em 3 meses | 10 |
| Só pesquisando | 0 |
| Decide sozinho ou com sócio | 15 |
| Precisa aprovar com terceiro | 7 |
| Respondeu "não sei dizer" no contato | +5 (oportunidade clara de Infra de Medição) |

Faixas: acima de 70 é quente, entre 40 e 69 é morno, abaixo de 40 é frio.

### Roteamento

| Faixa | O que acontece |
|---|---|
| Quente | Notificação imediata no WhatsApp do comercial com o resumo do lead. Tela de obrigado com link de agenda. Prazo de resposta prometido de 2 horas úteis, não 24. |
| Morno | Relatório automático por e-mail com o diagnóstico. Entra em sequência de nutrição de 5 e-mails. Notificação diária agrupada, não imediata. |
| Frio | Recebe o relatório e material educativo. Sem contato ativo do comercial. Entra na lista para conteúdo mensal. |

### Regra de ouro do formulário

O formulário nunca deve pedir dado antes de entregar algo. A ordem correta é: perguntas de diagnóstico primeiro, resultado parcial na tela, e só então o campo de contato para receber o relatório completo. Quem já viu parte do valor preenche o contato numa taxa muito maior do que quem preenche antes de ver qualquer coisa.

---

## PARTE 8 — PERSONALIZAÇÃO

Personalização aqui não é enfeite, é redução de esforço cognitivo. O visitante não deveria precisar descobrir sozinho qual das três frentes resolve o problema dele.

### Nível 1 — por intenção declarada (fácil, alto impacto)

Depois da primeira pergunta do fluxo, o site guarda a intenção em `sessionStorage` e reorganiza a página.

| O visitante diz | O site reordena para | E muda o CTA para |
|---|---|---|
| "Quero vender mais" | Tráfego pago primeiro, depois medição, depois site. Manifesto muda para o texto de demanda. | "Ver quanto eu deveria investir" |
| "Minha marca parece amadora" | Branding primeiro, com os cases de identidade em destaque. | "Rodar o Score de Marca" |
| "Tenho visita e ninguém fala comigo" | Site e conversão primeiro, com o Estimador de Perda em evidência. | "Analisar meu site" |
| "Invisto e não sei o retorno" | Infra de Medição primeiro, o Detector de Rastreamento vira o herói da página. | "Descobrir o que eu não estou medindo" |
| "Não sei por onde começar" | Mantém a ordem atual e oferece o Teste de Maturidade. | "Descobrir meu nível" |

Uma frase acima do conteúdo confirma a escolha: "Ajustamos esta página para quem quer vender mais. Ver tudo." O link de escape é obrigatório, personalização sem saída irrita.

### Nível 2 — por origem de tráfego (fácil, invisível para o visitante)

Ler UTM e trocar o hero por variante correspondente.

- `utm_campaign=trafego` abre com headline de mídia paga e o Raio-X de Campanha como CTA.
- `utm_campaign=site` abre com o Estimador de Perda.
- `utm_source=instagram` abre com uma linha de continuidade do post que trouxe a pessoa.
- Visitante que chega da busca por um termo local recebe a menção da região no hero.

Isso aumenta a coerência entre anúncio e página, que é o fator isolado que mais melhora a taxa de conversão em tráfego pago, e ainda melhora a nota de qualidade do anúncio.

### Nível 3 — por retorno (médio)

- Segunda visita sem conversão: o hero passa a exibir prova antes de promessa. Quem voltou já ouviu a promessa.
- Terceira visita: oferecer explicitamente o caminho de menor compromisso ("já veio aqui algumas vezes, quer só receber o diagnóstico por e-mail?").
- Visitante que já rodou uma ferramenta: o site cumprimenta pelo nome e mostra o resultado anterior no topo, com opção de continuar de onde parou.

### Nível 4 — pós-diagnóstico (alto impacto, exige as ferramentas)

Depois de rodar qualquer ferramenta, o site inteiro passa a falar com o resultado. Se o Raio-X apontou rastreamento quebrado, todas as seções seguintes tratam medição como assunto principal, e os cases exibidos são os de medição. O visitante deixa de navegar num catálogo e passa a navegar numa proposta.

### O que não fazer

Não personalizar por geolocalização de IP e não exibir contador falso de urgência ou "3 pessoas vendo agora". A Versa está construindo autoridade sobre honestidade de dado. Um truque desses derruba tudo o que o resto do site conquistou, e o público que a Versa quer é justamente o que percebe.

---

## PARTE 9 — NOVOS SERVIÇOS

Critério: só entra o que a Versa consegue entregar com o que já tem hoje, o que reforça o posicionamento de empresa de tecnologia e o que o site consegue vender sozinho ou quase.

Descartei antes de escrever: qualquer coisa que exija equipe que não existe, produção de vídeo em volume, assessoria de imprensa e social media operacional puro. Não são fracas, são incompatíveis com a estrutura atual e com o posicionamento.

---

### SERVIÇO 1 — Infra de Medição

**Problema resolvido.** O anunciante investe e não consegue dizer quantas conversas cada real gerou. É o gargalo mais comum e o mais invisível, porque quem tem o problema não sabe que tem.

**Cliente ideal.** Qualquer empresa que já anuncia e manda o clique para WhatsApp, direct ou perfil. É a maioria absoluta do mercado regional.

**Escopo.** Pixel e Conversions API instalados e validados, GA4 com eventos de conversão, link de WhatsApp com parâmetro de origem por campanha e por anúncio, página de obrigado real, planilha de qualificação implantada no atendimento, painel simples de leitura semanal.

**Como vender.** O Detector de Rastreamento gera o lead sozinho. A ferramenta mostra o buraco, o serviço tapa. Não precisa convencer, só precisa mostrar.

**Ticket.** R$ 1.500 a R$ 3.500 de implantação.

**Recorrência.** Não por si só, mas é a porta de entrada natural para gestão de tráfego. Quem instala a medição precisa de alguém que leia o dado.

**Dificuldade de execução.** Baixa. Dois a quatro dias de trabalho, quase tudo já dominado.

**Potencial de escala.** Alto. É repetível, tem checklist, e a mesma implantação serve para qualquer segmento.

**Como o site vende.** Detector de Rastreamento → relatório com o que falta → oferta de implantação com prazo fechado.

**Por que este é o primeiro da lista.** É o serviço com a melhor relação entre esforço, ticket, clareza de dor e conexão com o que a Versa já sabe fazer. E ele cria o pré-requisito técnico para todo o resto da operação de mídia funcionar melhor, ou seja, melhora o resultado dos outros serviços.

---

### SERVIÇO 2 — Raio-X de Tráfego (auditoria avulsa paga)

**Problema resolvido.** A empresa já tem alguém rodando o tráfego (interno, freelancer ou outra agência) e desconfia que está queimando dinheiro, mas não tem como saber.

**Cliente ideal.** Quem investe acima de R$ 2.000 por mês e não quer trocar de fornecedor às cegas.

**Escopo.** Auditoria completa da conta com relatório em PDF de 8 a 12 páginas, nota por domínio, achados críticos, plano de ação priorizado e uma reunião de leitura de 45 minutos.

**Como vender.** A versão gratuita da ferramenta entrega o diagnóstico superficial. A versão paga entrega a conta inteira analisada, o histórico, a estrutura de campanha e a reunião.

**Ticket.** R$ 497 na versão simples, R$ 1.500 na versão com reunião e plano de 90 dias.

**Recorrência.** Não, mas converte em gestão mensal numa taxa alta, porque o cliente já viu a Versa trabalhar antes de contratar.

**Dificuldade de execução.** Baixa. O motor de análise já existe, já tem árvore de decisão e já gera saída estruturada. O trabalho é de curadoria e apresentação.

**Potencial de escala.** Alto, e é o produto que melhor transforma capacidade técnica em receita sem exigir mais horas de operação.

**Como o site vende.** Raio-X gratuito → "quer a análise completa da conta, com histórico e reunião?" → checkout ou proposta.

---

### SERVIÇO 3 — Sprint de Conversão

**Problema resolvido.** A empresa tem tráfego chegando e não converte. Contratar site inteiro é caro e demorado, e o problema geralmente não é o site inteiro.

**Cliente ideal.** Quem já anuncia e tem site ou landing com problema de conversão.

**Escopo.** Duas semanas. Diagnóstico da página atual, medição instalada, uma landing nova construída do zero, dois testes A/B definidos e no ar, e leitura de resultado ao final.

**Como vender.** Escopo fechado, prazo fechado, entregável visível. É a venda mais fácil de todas porque o risco percebido é pequeno.

**Ticket.** R$ 3.500 a R$ 6.000.

**Recorrência.** Vira otimização contínua, de R$ 800 a R$ 1.500 por mês, para quem gostou do resultado.

**Dificuldade de execução.** Média. Exige disciplina de prazo, mas é exatamente o que a Versa já sabe construir.

**Potencial de escala.** Médio a alto. Limitado por horas, mas com margem boa.

**Como o site vende.** Estimador de Perda → número em reais → "recuperamos parte disso em duas semanas, por escopo fechado".

---

### SERVIÇO 4 — Versa Radar (monitoramento recorrente)

**Problema resolvido.** Cliente que não tem verba para gestão completa mas está rodando campanha sozinho e erra por não olhar os números na hora certa.

**Cliente ideal.** Conta em regime micro ou baixo, que hoje a Versa não consegue atender com gestão completa sem prejuízo.

**Escopo.** O motor de análise roda automaticamente todo mês sobre a conta do cliente, gera relatório com nota e ações, e a Versa faz uma leitura curta por escrito. Sem operação, só diagnóstico recorrente.

**Como vender.** Como assinatura barata que resolve o problema de quem não pode pagar gestão. E cria um funil interno: quem cresce dentro do Radar vira cliente de gestão.

**Ticket.** R$ 250 a R$ 500 por mês.

**Recorrência.** Total. É o único serviço da lista com receita previsível de verdade.

**Dificuldade de execução.** Baixa depois de automatizado. Alta no começo, porque exige a automação existir.

**Potencial de escala.** O maior da lista, porque o custo marginal de um cliente a mais tende a zero.

**Como o site vende.** Raio-X gratuito → "quer que a gente olhe isso todo mês por R$ X?" → assinatura.

**Observação de risco.** Este é o serviço que mais depende de automação real. Se for entregue no braço, a margem some. Só lançar quando o pipeline estiver automatizado.

---

### SERVIÇO 5 — Anúncio em Conformidade (nicho saúde)

**Problema resolvido.** Clínica, médico ou dentista que quer anunciar e tem medo, com razão, de ser autuado pelo conselho profissional. A maioria das agências não sabe as regras, produz peça irregular e o cliente descobre tarde.

**Cliente ideal.** Saúde, odontologia, estética avançada, procedimentos. Ticket alto, ciclo de decisão longo, dor real de compliance.

**Escopo.** Produção de criativo e copy dentro das regras do conselho, revisão de peças existentes, e um parecer por escrito do que pode e não pode em cada formato.

**Como vender.** É a única oferta da lista que se vende por medo em vez de por ambição, e por isso converte rápido. A Versa já opera um cliente de capilar com compliance crítico, então o repertório existe.

**Ticket.** R$ 1.200 a R$ 2.500 por mês de produção, ou R$ 800 por auditoria avulsa de peças.

**Recorrência.** Alta.

**Dificuldade de execução.** Média. Exige manter as regras atualizadas por especialidade.

**Potencial de escala.** Alto dentro do nicho, e o nicho é grande e paga bem.

**Como o site vende.** Avaliador de Criativo com módulo de compliance → aponta a irregularidade na peça que ele já está rodando → oferta de revisão.

---

### Ideia de longo prazo, registrada e não recomendada para agora

**Licenciar o motor de diagnóstico para outras agências.** O sistema de análise da Versa é bom o bastante para virar produto vendido a outras agências pequenas que não têm método. Mercado real, margem de software. Só que exige suporte, versionamento, cobrança recorrente e uma operação que não é a de hoje. Fica anotado como destino possível em 12 a 24 meses, não como projeto do trimestre. Antes disso, os thresholds precisam sair de "hipótese" para "calibrado", o que exige volume de contas que a Versa ainda não tem.

---

## PARTE 10 — O QUE DÁ PARA ENTREGAR SEM FALAR COM NINGUÉM

Recorte prático das ferramentas por critério de autonomia. Tudo abaixo pode acontecer às 23h de um domingo, sem ninguém acordado.

| Entrega | Formato | Pede contato antes? | Gera relatório? |
|---|---|---|---|
| Verba mínima viável | Calculadora, 3 campos | Não | Não, resultado na tela |
| Simulador de ROI | Calculadora, 4 campos | Não | Opcional por e-mail |
| Diagnóstico de site | Cola URL | Não para a nota, sim para o detalhe | Sim, PDF |
| Detector de rastreamento | Cola URL | Não para o mapa, sim para o plano | Sim, PDF |
| Raio-X de campanha | Upload ou formulário | Sim, depois de mostrar a nota | Sim, PDF completo |
| Score de marca | Quiz de 12 | Sim, no final | Sim |
| Teste de maturidade | Quiz de 20 | Sim, no final | Sim, com trilha |
| Qual serviço eu preciso | Quiz de 6 | Não | Não, recomendação na tela |
| Gerador de briefing | Formulário adaptativo | Sim, para baixar | Sim, PDF |
| Calendário editorial | 3 campos | Sim | Sim |
| Simulador de escopo | Configurador | Só para receber a proposta | Sim |
| Checklist de campanha | Interativo | Só para receber o que falta | Sim |
| Verificador de nome | 1 campo | Não | Não |
| Estimador de perda | Cola URL + 2 campos | Não para o número, sim para o plano | Sim |

Regra que atravessa a tabela: **mostrar o resultado antes de pedir o contato, sempre.** O padrão de mercado é o contrário, e é por isso que o padrão de mercado converte mal. Pedir e-mail antes de entregar valor transforma a ferramenta num formulário disfarçado, e o visitante percebe.

O relatório em PDF é o item que mais compensa construir uma vez. Ele circula dentro da empresa do cliente, chega em quem decide sem a Versa estar na sala, e carrega a marca. Um relatório bem feito é o melhor vendedor que a Versa pode ter, e é o mesmo pipeline que já produziu o relatório da TransLima (HTML renderizado em PDF via chromium), então a infraestrutura existe.

---

## PARTE 11 — IA

Filtro que apliquei: só entra IA onde a alternativa determinística seria pior ou impossível. Onde uma fórmula resolve, a fórmula é melhor, porque é auditável, gratuita e nunca alucina.

### Onde IA vale de verdade

**1. Leitura de peça e de criativo**
O visitante sobe a imagem do anúncio. Modelo com visão avalia legibilidade em tamanho de feed, hierarquia, contraste, clareza de CTA e adequação de promessa, e devolve três correções específicas.
Tecnicamente: rota de API no Next, upload para storage temporário, chamada a um modelo com visão, resposta em JSON validado por schema antes de renderizar. Guardar limite de tamanho e de taxa.

**2. Análise e reescrita de copy de anúncio**
Cola a copy, recebe diagnóstico e três variações para teste, cada uma com o princípio por trás.
Tecnicamente: chamada de texto com prompt de sistema carregando o método da Versa. Saída estruturada, nunca texto livre.

**3. Narrativa do relatório**
O diagnóstico numérico continua determinístico, calculado pelo motor. A IA entra só para escrever a leitura em português claro, na voz da Versa, a partir dos achados já calculados. Isso preserva a confiabilidade e resolve o problema real, que é relatório que ninguém entende.
Tecnicamente: os achados vão como JSON, o modelo só redige. Nunca deixar o modelo inventar número.

**4. Classificação e resumo de lead**
No envio do formulário, o modelo lê o campo de texto livre, extrai segmento, urgência e problema declarado, e escreve um resumo de duas linhas que chega junto com a notificação. O comercial abre o WhatsApp já sabendo com quem vai falar.
Tecnicamente: exatamente o `routeLead` que já está desenhado no bloco de código da seção Tecnologia. O site mostra esse código como vitrine e não executa. Construir de verdade é meia dúzia de horas e transforma uma peça de marketing em fato.

**5. Recomendação de estratégia dentro do quiz**
Depois das seis perguntas, o modelo escreve a hipótese de diagnóstico em linguagem natural, ancorada nas regras da Versa, e não numa opinião livre.
Tecnicamente: regras primeiro, redação depois. A regra decide, a IA explica.

**6. Geração da prévia de landing page**
O visitante descreve a empresa e a oferta, e o modelo preenche um template estruturado da Versa (não gera HTML livre, preenche campos de um esquema conhecido). Isso mantém a qualidade visual e evita saída quebrada.

**7. Busca conversacional sobre o próprio site e sobre os cases**
Um campo de pergunta que responde com base no conteúdo real do site, dos cases e do FAQ. Útil e barato. Só vale a pena depois que existir conteúdo suficiente para responder, ou seja, depois das páginas de serviço e dos cases detalhados.

### Onde IA não deve entrar

- Cálculo de diagnóstico e de score. Já existe motor determinístico, auditável e testado. Substituir por modelo seria trocar precisão por moda.
- Chat de atendimento genérico no canto da tela. Aumenta atrito, esconde o WhatsApp e passa a impressão contrária à que o site defende ("a gente responde de verdade, não com robô", palavras do próprio FAQ). Usar um chatbot depois de escrever isso seria contradição pública.
- Geração automática de peça final de cliente. A Versa vende direção de arte. Automatizar a entrega final destrói a percepção de valor do serviço mais caro dela.

### Custo e controle

Toda chamada de modelo precisa de limite por sessão, limite diário global, cache de resultado por entrada idêntica e um plano B determinístico para quando a API falhar. Ferramenta gratuita sem teto de gasto é como campanha sem limite de orçamento.

---

## PARTE 12 — PROVA SOCIAL

Pergunta que você fez, respondida sem rodeio: **o site está dizendo que é bom, não mostrando.**

### Inventário do que existe

| Tipo de prova | Situação |
|---|---|
| Cases | 4, sendo 1 cliente comercial real, 1 comunidade, 1 liga acadêmica e 1 a própria Versa |
| Métricas | Zero. `metrics: []` nos quatro cases |
| Depoimentos | Zero |
| Logos de cliente | Zero |
| Antes e depois | Zero |
| Números de operação | Zero (a seção Compromissos usa padrões, não resultados) |
| Rosto ou nome de quem executa | Zero |
| Prova de existência (CNPJ, endereço, tempo de mercado) | Zero |
| Case de tráfego pago | **Zero**, e é o serviço mais vendável |

O campo `metrics` já está implementado no tipo `CaseStudy` e o card renderiza a faixa de números quando o array não está vazio. A infraestrutura está pronta e o conteúdo nunca foi preenchido. Isso é preguiça de conteúdo, não limitação técnica, e é o conserto mais barato de alto impacto do site inteiro.

### O problema de credibilidade

O site afirma "decisão guiada por dado" e "número é ponto de decisão" e não apresenta um único número de resultado. Um visitante atento percebe a contradição, e o visitante atento é exatamente o cliente que a Versa quer.

Pior: o único case comercial visível é de site institucional. Alguém que chega procurando gestão de tráfego não encontra nenhuma evidência de que a Versa já operou uma campanha na vida. E operou.

### O que fazer, em ordem

**1. Publicar o case da TransLima com os números reais.**
Existe material. 12 dias, R$ 300 investidos, 32.530 alcançados, 837 cliques, R$ 0,36 por clique, um reel com 10.677 visualizações. E existe algo mais raro e mais valioso: uma lacuna documentada honestamente, que é a impossibilidade de contar conversas porque o clique ia para o perfil, e a decisão de corrigir isso no ciclo seguinte.

Publicar esse case **com a lacuna incluída** é a jogada mais forte de prova social disponível hoje. Nenhuma agência publica o que ainda não conseguiu medir. Publicar isso prova três coisas de uma vez: que a Versa opera de verdade, que ela mede de verdade e que ela é honesta quando o dado não existe. Isso vale mais do que qualquer "+312% de leads" que ninguém acredita.

Formato sugerido: contexto, o que foi feito, os números, o que não deu para medir e por quê, o que muda no próximo ciclo.

**2. Colher depoimento de cada cliente, hoje.**
Três perguntas por WhatsApp, resposta em áudio ou vídeo de celular mesmo:
- Como estava antes de trabalhar com a gente?
- O que mudou na prática?
- O que você diria para alguém que está em dúvida?
Depoimento em vídeo vertical de 30 segundos converte mais do que texto com foto, e é mais difícil de forjar, o que é justamente o ponto.

**3. Preencher `metrics` em todo case.**
Onde não houver número de resultado, usar número de entrega. "5 peças por semana em produção", "site em 22 dias", "nota 97 no Lighthouse", "de 3 fornecedores para 1". Número de entrega é honesto e ainda é número.

**4. Colocar rosto.**
Uma seção com quem faz. Nome, o que cada um faz, foto real. Em serviço local, comprar de pessoa vence comprar de logo. Hoje o site diz "você fala com quem executa" e não mostra quem executa.

**5. Tirar a Versa da lista de cases.**
Marca própria como case ocupa espaço de prova social real e sinaliza escassez de cliente. O trabalho é bom, mas o lugar dele é numa página "como aplicamos em nós mesmos", separada da prateleira de clientes.

**6. Criar a categoria "Tráfego e Performance" no filtro.**
Hoje o filtro nem oferece a opção, o que comunica que a Versa não faz tráfego.

**7. Prova de existência.**
CNPJ no rodapé, cidade, tempo de mercado. Custa nada e remove uma objeção silenciosa que ninguém verbaliza mas todo mundo tem.

### Como apresentar melhor os cases

O formato atual (card com modal) está bem construído tecnicamente. O que falta é estrutura de argumentação dentro dele. Todo case deveria seguir a mesma sequência:

```
Situação  →  o que estava acontecendo, com número quando houver
Decisão   →  o que a Versa escolheu fazer e por que aquilo e não outra coisa
Execução  →  o que foi entregue, com as peças
Resultado →  o que mudou, com número
Limite    →  o que ainda não dá para afirmar
```

O último bloco é o que ninguém faz e é o que fixa a marca na cabeça de quem lê.

---

## PARTE 13 — CTAs

### Inventário atual

Nove pontos de conversão. Oito vão para o mesmo link de WhatsApp, um vai para e-mail. Os textos são:

| Onde | Texto | Problema |
|---|---|---|
| Header | "Falar no WhatsApp" | Centrado no canal, não no benefício. No mobile some e vira só o ícone. |
| Hero primário | "Falar com a Versa" | Centrado na empresa. Fricção máxima no momento de menor confiança. |
| Hero secundário | "Ver trabalhos" | Correto. Único caminho de baixo compromisso do site. |
| Serviços | "Descobrir por onde começar" | **O melhor CTA do site.** É baseado em intenção e promete uma resposta, não uma conversa. Está desperdiçado apontando para um WhatsApp genérico. |
| Trabalhos | "Começar uma conversa" | Vago. "Conversa" não é resultado. |
| FAQ | Número do WhatsApp cru | Sem promessa nenhuma. |
| Final | "Chamar no WhatsApp" | Canal, não benefício. |
| Final secundário | "Enviar um e-mail" | Canal, não benefício. E e-mail com assunto pré-preenchido é o caminho de menor conversão possível. |
| Menu mobile | "Falar no WhatsApp" | Idem. |

Diagnóstico: sete dos nove CTAs pedem a mesma coisa, no mesmo canal, com a mesma fricção. O site tem nove oportunidades e usa uma só.

### Regra para reescrever

Um CTA bom responde à pergunta "o que eu recebo se clicar?". Nenhuma das versões atuais responde, porque a resposta hoje é "uma conversa de vendas", e ninguém quer isso.

Segunda regra: o texto do CTA deve corresponder ao estado mental de quem está naquela altura da página. CTA de topo e CTA de rodapé não podem ser o mesmo texto, porque a pessoa que chega no rodapé leu tudo e já é outra pessoa.

### CTAs propostos, por seção e por intenção

| Seção | Estado mental do visitante | CTA primário | CTA secundário |
|---|---|---|---|
| Header (sempre visível) | Variável | "Diagnóstico gratuito" | Ícone de WhatsApp |
| Hero | Acabou de chegar, cético | "Rodar o raio-x da minha campanha" com a linha de apoio "grátis, 2 minutos, sem cadastro" | "Ver o que já entregamos" |
| Manifesto (após a dor) | Se reconheceu no problema | "Descobrir onde está o meu gargalo" | — |
| Serviço Design | Marca parece amadora | "Rodar o Score de Marca" | "Ver identidades que fizemos" |
| Serviço Tráfego | Investe e não sabe o retorno | "Descobrir se minha verba é suficiente" | "Ver o raio-x de campanha" |
| Serviço Site | Tem visita e não converte | "Ver quanto meu site está perdendo por mês" | "Ver sites no ar" |
| Diferenciais | Comparando fornecedores | "Ver como decidimos, na prática" | — |
| Método | Quer saber como funciona | "Ver um diagnóstico real" | — |
| Trabalhos | Avaliando prova | "Quero um resultado desse tipo" | "Ver o case completo" |
| Tecnologia | Impressionado, cético | "Testar uma das nossas ferramentas" | — |
| FAQ | Objeção residual | "Perguntar direto no WhatsApp" | "Ver faixas de investimento" |
| Final | Leu tudo, decidindo | "Quero uma análise do meu caso" | "Falar agora no WhatsApp" |
| Barra fixa mobile | Qualquer | "Diagnóstico grátis" | Ícone de WhatsApp |

### Detalhes que mudam número

**Mensagem do WhatsApp por origem.** Hoje todos os nove links mandam a mesma frase. Deveria ser específico: quem clicou no card de tráfego envia "Vim pelo site, quero falar sobre gestão de tráfego". O comercial já abre a conversa sabendo o assunto, e passa a existir atribuição de seção mesmo sem ferramenta nenhuma.

**Todo clique de CTA precisa disparar evento** com identificação da seção de origem, antes de abrir o WhatsApp. Isso é uma linha de código por botão e resolve metade do problema de cegueira do site.

**Barra fixa no rodapé mobile.** Não existe hoje. É o padrão que mais converte em celular e o mobile é onde está o tráfego social.

**Segundo botão sempre menos comprometedor que o primeiro.** Hoje o CTA final oferece WhatsApp e e-mail, que são o mesmo nível de compromisso em canais diferentes. Deveria oferecer conversar agora e receber diagnóstico por e-mail, que são níveis diferentes.

---

## PARTE 14 — ESTRUTURA IDEAL

Duas propostas. A primeira é a home reordenada, que dá para fazer em dias. A segunda é a arquitetura completa, que é o destino.

### Proposta A — a home reorganizada

A ordem atual é uma narrativa bonita e longa demais para tráfego frio. A prova, que é o argumento mais forte, aparece na sétima seção. O método, que interessa a quem já confia, aparece antes da prova e ocupa mais de três telas.

Ordem proposta, com a função de cada bloco:

| # | Seção | Função | Mudança |
|---|---|---|---|
| 01 | **Hero** | Dizer o que é, para quem, e oferecer a primeira entrega | Reescrever. CTA vira ferramenta. |
| 02 | **Faixa de prova imediata** | Matar a desconfiança nos primeiros 3 segundos | **Nova.** Logos ou nomes de clientes, número de projetos, um depoimento curto. |
| 03 | **Manifesto** | Nomear a dor e criar concordância | Manter. É a melhor seção do site. |
| 04 | **Ferramenta em destaque** | Entregar valor antes de pedir qualquer coisa | **Nova.** O Raio-X ou a calculadora, embutido na home, funcionando ali. |
| 05 | **Serviços** | Mostrar as três frentes | Manter, com CTA próprio por card. |
| 06 | **Para quem é e para quem não é** | Qualificar e ganhar confiança | **Nova.** Curta, duas colunas. |
| 07 | **Trabalhos** | Provar | **Subir.** Com números e depoimentos. |
| 08 | **Diferenciais** | Justificar a escolha | Manter, reescrito na perspectiva do cliente. |
| 09 | **Método** | Reduzir medo de processo | Manter, **encurtar** de 320vh para no máximo 150vh. |
| 10 | **Investimento** | Ancorar preço | **Nova.** Faixas por tipo de projeto. |
| 11 | **Tecnologia** | Sustentar o posicionamento | Manter, com as ferramentas do site como prova em vez da lista de frameworks. |
| 12 | **Compromissos** | Reforçar padrão | Manter. |
| 13 | **FAQ** | Derrubar objeção final | Manter, com schema `FAQPage`. |
| 14 | **CTA final** | Fechar | Reescrever, com dois níveis de compromisso. |

Duas seções novas fazem o trabalho pesado: prova imediata no topo e ferramenta no meio.

### Proposta B — a arquitetura completa

```
/                              home (proposta A)
│
├── /servicos/trafego-pago     página dedicada, copy própria, cases próprios,
│                               FAQ próprio, ferramenta relacionada, CTA próprio
├── /servicos/design           idem
├── /servicos/sites            idem
├── /servicos/medicao          serviço novo, página nova
│
├── /ferramentas               índice de todas, é a página que gera link
│   ├── /raio-x-de-campanha
│   ├── /verba-minima
│   ├── /diagnostico-de-site
│   ├── /rastreamento
│   ├── /score-de-marca
│   ├── /simulador-de-roi
│   └── ...
│
├── /diagnostico               o fluxo guiado da Parte 6, destino de todo CTA principal
│
├── /trabalhos                 índice
│   └── /trabalhos/[slug]      case completo no formato situação → limite
│
├── /investimento              como a Versa cobra e o que faz o preço mudar
├── /sobre                     quem faz, com rosto e nome
│
├── /conteudo                  artigos, o que sustenta SEO e nutrição
│   └── /conteudo/[slug]
│
├── /indice                    o Versa Índice, benchmark regional público
│
├── /obrigado                  página de conversão, dispara evento, oferece agenda
└── /privacidade               LGPD, obrigatória a partir do momento que houver formulário
```

Por que quebrar em páginas importa mais do que parece: cada página é uma porta de entrada de busca, um destino de anúncio com correspondência de mensagem e uma unidade mensurável. Um site de página única tem uma porta. Este tem vinte.

### O que remover

- **Preloader de 2,15s.** Reduzir para no máximo 800ms, ou manter só na visita direta ao domínio e desligar quando houver UTM. Tráfego pago não paga intro.
- **Versa como case.** Move para `/sobre`.
- **Lista de frameworks na seção Tecnologia.** "React, Next.js, TypeScript, Tailwind" não significa nada para o cliente e significa pouco para o técnico. Substituir pelas ferramentas do site funcionando. Prova em vez de vocabulário.
- **Um dos quatro selos do hero**, se o hero ficar carregado. "Zero template pronto" é o mais fraco dos três.
- **A cena 3D**, se a medição mostrar custo de INP relevante em aparelho modesto. Só medindo dá para decidir, mas a hipótese padrão deveria ser cortar, porque o halo em CSS já entrega 90% do efeito por 0% do peso.

---

## PARTE 15 — PRIORIDADE

Escala de esforço: baixo é até 4 horas, médio é de 1 a 3 dias, alto é de 1 a 3 semanas.
Escala de impacto: medida em leads adicionais e em qualidade de lead, não em beleza.

### P0 — sem isso nada funciona

| # | Item | Impacto | Esforço | Motivo |
|---|---|---|---|---|
| 1 | Publicar em domínio próprio e corrigir `SITE.url` | Máximo | Baixo | O site não existe para o mundo. Todo o resto depende disso. |
| 2 | Inicializar git e versionar | Alto | Baixo | Não há histórico. Uma empresa que vende "código versionado" tem o próprio site fora de versionamento. |
| 3 | GA4 e GTM instalados, com eventos em todos os CTAs | Máximo | Baixo | Sem isso não dá para saber se qualquer coisa deste documento funcionou. |
| 4 | Pixel da Meta e tag do Google, com Conversions API | Máximo | Médio | Sem pixel não há remarketing. 100% de quem sai hoje está perdido para sempre. |
| 5 | UTM em todo link de WhatsApp, por seção de origem | Alto | Baixo | Uma linha por botão. Cria atribuição sem construir nada. |
| 6 | Formulário próprio em `/diagnostico`, gravando antes de mandar para o WhatsApp | Máximo | Médio | Hoje nenhum lead fica registrado. |
| 7 | Página de obrigado com evento de conversão | Alto | Baixo | É o que torna a conversão contável e otimizável pela Meta. |
| 8 | Política de privacidade e consentimento de cookie | Médio | Baixo | Obrigatório assim que houver coleta. Risco jurídico, não estético. |

### P1 — alto impacto, esforço baixo ou médio

| # | Item | Impacto | Esforço | Motivo |
|---|---|---|---|---|
| 9 | Preencher `metrics` nos quatro cases | Alto | Baixo | Campo já implementado. É digitar. |
| 10 | Publicar o case da TransLima com números e com a lacuna | Alto | Baixo | Único case de tráfego. Material já existe. |
| 11 | Reescrever o hero (headline, subtítulo, CTA) | Alto | Baixo | Muda o primeiro contato de 100% do tráfego. |
| 12 | Calculadora de Verba Mínima Viável | Alto | Baixo | Duas horas de trabalho, conhecimento proprietário, gera conversa sozinha. |
| 13 | Reescrever os nove CTAs por intenção | Alto | Baixo | Meia hora de texto. |
| 14 | Barra fixa de CTA no mobile | Alto | Baixo | Padrão que mais converte em celular. |
| 15 | Bloco "para quem é e para quem não é" | Médio | Baixo | Qualifica antes do comercial gastar tempo. |
| 16 | Faixas de investimento na home | Alto | Baixo | Elimina a pergunta mais comum e filtra lead. |
| 17 | Schema `FAQPage` no JSON-LD | Médio | Baixo | Rich result de graça com conteúdo que já existe. |
| 18 | Reduzir o preloader e desligá-lo quando houver UTM | Médio | Baixo | Recupera visita paga que sai antes de ver o hero. |
| 19 | Mensagem de WhatsApp diferente por seção | Médio | Baixo | O comercial passa a saber de onde veio o lead. |
| 20 | Depoimentos em vídeo dos clientes atuais | Alto | Baixo | Uma tarde de WhatsApp. Maior salto de confiança por hora investida. |
| 21 | Seção com rosto e nome de quem executa | Médio | Baixo | Serviço local se compra de pessoa. |
| 22 | Detector de Rastreamento | Alto | Médio | Gera o serviço de maior margem sem esforço comercial. |
| 23 | Raio-X de Campanha (versão web do motor) | Máximo | Médio | O maior ativo da empresa virando canal de aquisição. |
| 24 | Encurtar a seção Método de 320vh para 150vh | Médio | Baixo | Aproxima o visitante da prova. |

### P2 — importante, faz diferença no médio prazo

| # | Item | Impacto | Esforço | Motivo |
|---|---|---|---|---|
| 25 | Quebrar em páginas de serviço | Alto | Alto | Multiplica portas de entrada e permite correspondência anúncio e página. |
| 26 | Fluxo guiado de diagnóstico (Parte 6) | Alto | Alto | Transforma o site em vendedor. |
| 27 | Score de lead e roteamento automático | Alto | Médio | Deixa de gastar tempo sênior com lead frio. |
| 28 | Relatório em PDF automático | Alto | Médio | Circula dentro da empresa do cliente sem a Versa estar lá. |
| 29 | Estimador de Perda por Site Lento | Médio | Médio | Vende site por número, não por estética. |
| 30 | Simulador de ROI e simulador de escopo | Médio | Médio | Ancora preço e encurta ciclo. |
| 31 | Captura de e-mail e nutrição de 5 e-mails | Alto | Médio | Hoje 100% do tráfego que não converte é perdido. |
| 32 | Agenda com link para lead quente | Médio | Baixo | Remove idas e vindas que esfriam. |
| 33 | Página `/investimento` | Médio | Médio | Material de comparação para quem está decidindo. |
| 34 | Reescrever os seis diferenciais na perspectiva do cliente | Médio | Baixo | Tira o site do modo autobiografia. |
| 35 | Personalização por UTM no hero | Médio | Médio | Melhora correspondência e qualidade do anúncio. |

### P3 — experimento, apostas de posicionamento

| # | Item | Impacto | Esforço | Motivo |
|---|---|---|---|---|
| 36 | Versa Índice | Alto no longo prazo | Alto | Quem publica o benchmark de um mercado vira a referência dele. |
| 37 | Raio-X do Concorrente | Alto | Médio | Alto potencial de compartilhamento, depende de API pública. |
| 38 | Prévia de landing ao vivo | Alto | Alto | A demonstração mais forte possível, mas cara. |
| 39 | Modo auditoria do próprio site | Médio | Médio | Diferenciação de marca pura. |
| 40 | Blog e conteúdo | Alto no longo prazo | Alto | SEO e nutrição, retorno lento e composto. |
| 41 | Versa Radar como assinatura | Alto | Alto | Depende de automação madura. |
| 42 | Avaliar a remoção da cena 3D | Médio | Baixo | Decidir com dado de INP, não com gosto. |

### O corte que eu faria

Se houvesse tempo para apenas oito itens: 1, 3, 4, 5, 6, 11, 12 e 23. Sete são de esforço baixo, um é médio, e juntos eles transformam um site que não mede nada e não captura nada num canal que mede tudo, captura três temperaturas de lead e entrega uma ferramenta que nenhum concorrente da região tem.

---

## PARTE 16 — EXPERIMENTOS DE CRO

Nenhum destes testes faz sentido antes do item 3 da lista P0. Sem medição, teste A/B é adivinhação com trabalho extra.

Volume mínimo para decidir: uns 300 visitantes por variante, ou duas semanas, o que vier primeiro. Abaixo disso o resultado é ruído. Rodar um teste por vez.

| # | Hipótese | Variante A (atual) | Variante B | Métrica principal | Resultado esperado |
|---|---|---|---|---|---|
| E1 | Um CTA que entrega algo converte mais do que um que pede conversa | "Falar com a Versa" para WhatsApp | "Rodar o raio-x da minha campanha" para a ferramenta | Taxa de conversão em lead identificado | Aumento grande em leads capturados, provável queda em conversas diretas no WhatsApp. Olhar o total, não cada canal isolado. |
| E2 | Clareza vende mais do que provocação em tráfego frio | "Sua empresa já é boa. Falta a internet saber disso." | "Marketing que você consegue auditar." | Rolagem além do hero e cliques no CTA primário | Incerto e por isso vale testar. A atual pode ganhar em tráfego de marca e perder em tráfego frio. |
| E3 | Prova antes de método aumenta conversão | Ordem atual (método antes de trabalhos) | Trabalhos subindo para antes do método | Conversão geral e profundidade de rolagem | Aumento moderado. A prova é o argumento mais forte e está enterrado. |
| E4 | Preço na página qualifica sem afastar | Sem faixa de investimento | Faixas visíveis na home | Taxa de lead qualificado, não taxa de lead bruta | Queda no volume, aumento na qualidade. Sucesso se o número de reuniões marcadas subir. |
| E5 | Diagnóstico converte mais que formulário | Formulário de contato direto | Fluxo de 6 perguntas com resultado antes do contato | Taxa de conclusão e qualidade do lead | Aumento grande. É o teste com maior valor esperado da lista. |
| E6 | Preloader custa visita paga | Intro de 2,15s ativa | Intro desligada quando há UTM | Rejeição e conversão em tráfego pago | Melhora perceptível. Se não melhorar, o preloader fica sem culpa. |
| E7 | Barra fixa mobile aumenta conversão | Sem barra | Barra fixa com dois botões | Cliques em CTA no celular | Aumento claro. É quase consenso de mercado, mas vale confirmar no contexto. |
| E8 | Depoimento em vídeo supera texto | Sem depoimento | Vídeo vertical de 30s abaixo dos cases | Conversão da seção Trabalhos | Aumento relevante. |
| E9 | Mostrar resultado antes de pedir contato aumenta conclusão | Contato no início do quiz | Contato só depois do resultado parcial | Taxa de conclusão do fluxo | Aumento grande. |
| E10 | Números nos cases aumentam confiança | Cases sem métrica | Cases com faixa de números | Abertura de case e conversão pós-case | Aumento moderado. |
| E11 | Correspondência entre anúncio e página melhora conversão | Hero único para todo tráfego | Hero variando por `utm_campaign` | Conversão por campanha e custo por lead | Melhora consistente, é dos ajustes mais confiáveis em mídia paga. |
| E12 | Método longo perde gente | 320vh de rolagem sequestrada | Versão vertical compacta de 150vh | Taxa de chegada na seção Trabalhos | Aumento na chegada à prova. |

Anotar cada teste com data de início, data de fim, volume por variante e decisão. Teste sem registro vira opinião com aparência de dado, que é exatamente o que a Versa critica nos concorrentes.

---

## PARTE 17 — MÉTRICAS

Visitante não é métrica de negócio. A pergunta que importa é quantas oportunidades comerciais o site gerou e quanto custou cada uma.

### As 6 métricas principais

Se só desse para acompanhar seis, seriam estas.

**1. Leads identificados por mês**
Contato completo capturado, não clique no WhatsApp. É o numerador de quase tudo.

**2. Taxa de conversão do site**
Leads identificados dividido por visitantes únicos. Referência realista para site institucional de serviço: 1% a 3% sem ferramenta, 4% a 8% com ferramenta de diagnóstico funcionando. Se o site ficar abaixo de 1% depois das mudanças, o problema é oferta ou tráfego, não layout.

**3. Percentual de leads qualificados**
Leads com score acima de 70 divididos pelo total. Mede se o site atrai a pessoa certa. Um site que gera muito lead ruim é pior do que um que gera pouco lead bom, porque consome o recurso mais escasso da Versa, que é o tempo de quem executa.

**4. Custo por lead qualificado**
Não custo por lead. Investimento total dividido por leads que passaram no score. É o único número que responde se o marketing da própria Versa está pagando.

**5. Taxa de reunião**
Leads qualificados que viraram conversa marcada. Se essa taxa for baixa com score alto, o problema é o comercial ou o tempo de resposta, não o site.

**6. Taxa de fechamento e ticket médio**
Fecha o ciclo. Sem esses dois números, os quatro anteriores não viram decisão de investimento.

### Métricas de operação do site

| Métrica | Por que acompanhar | Alerta |
|---|---|---|
| Taxa de conclusão do diagnóstico | Mede se o fluxo é longo demais | Abaixo de 40% significa cortar perguntas |
| Abandono por pergunta | Mostra exatamente qual pergunta espanta | Qualquer pergunta com queda acima de 15% |
| CTR de cada CTA, por seção | Diz qual argumento está funcionando | CTA abaixo de 1% deveria ser reescrito ou removido |
| Conversão por seção de origem | Revela onde a decisão acontece de verdade | Costuma surpreender |
| Serviço mais escolhido no quiz | Informa o que o mercado quer comprar, não o que a Versa quer vender | Pode mudar a estratégia de oferta inteira |
| Profundidade média de rolagem | Diz onde o site perde gente | Queda acentuada em uma seção específica |
| LCP e INP reais de campo | Performance percebida, não de laboratório | LCP acima de 2,5s ou INP acima de 200ms |
| Origem do lead (UTM completo) | Atribuição real | Tráfego direto acima de 40% indica UTM faltando |
| Tempo até a primeira resposta | O site promete 24h. Cumprir é o compromisso mais barato de manter e o mais caro de quebrar | Acima de 4h úteis para lead quente |

### O painel que a Versa deveria ter

Uma tela só, atualizada semanalmente, com sete linhas: visitantes, leads, taxa de conversão, leads qualificados, custo por lead qualificado, reuniões, contratos. Se esse painel não existir, nada do que foi construído vai ser melhorado, porque não vai dar para saber o que melhorou.

Detalhe que fecha o argumento: esse painel é também o melhor material de venda que a Versa pode ter. Mostrar o próprio painel numa reunião vale mais do que qualquer slide de método.

---

## PARTE 18 — VISÃO DE PRODUTO

A pergunta é como o site deixa de ser site e vira plataforma. A resposta não é construir tudo de uma vez, é escolher a ordem certa.

### O raciocínio

A Versa tem uma assimetria rara: capacidade de engenharia dentro de uma empresa de marketing. Num mercado onde o concorrente terceiriza site e não escreve uma linha de código, isso não é uma vantagem incremental, é uma categoria diferente. Mas a vantagem só existe se estiver visível e utilizável por quem não é cliente ainda.

O caminho é este: ferramenta gratuita gera lead, ferramenta paga gera receita, conta de usuário gera retenção, dado acumulado gera monopólio de informação regional.

### Fase 1 — mês 1 a 3, ferramentas soltas

Duas ou três ferramentas gratuitas, cada uma com URL própria, cada uma gerando lead identificado. Sem conta de usuário, sem login, sem complexidade. O objetivo é aprender qual ferramenta o mercado usa de verdade, e isso só se descobre publicando.

Entrega: `/ferramentas` com Raio-X de Campanha, Verba Mínima e Detector de Rastreamento.

### Fase 2 — mês 3 a 6, conta e histórico

Login simples (Supabase já está na lista de tecnologias). O visitante que rodou o Raio-X pode voltar, ver o histórico e comparar com o mês anterior. A comparação mês a mês é o que transforma ferramenta em hábito, e hábito em disposição a pagar.

Entrega: conta, histórico de diagnósticos, comparação temporal, relatório salvo.

### Fase 3 — mês 6 a 9, área do cliente

Quem contrata a Versa entra na mesma plataforma e passa a ver relatório de campanha, andamento de projeto, entregas aprovadas e próximos passos. Isso resolve um problema real de operação (a pergunta "como está meu projeto?" some do WhatsApp) e é diferenciação de venda ("você não vai depender de eu te responder para saber como está").

Entrega: painel do cliente, aprovação de peça, relatório mensal automático.

### Fase 4 — mês 9 a 12, produto pago

O Versa Radar vira assinatura de verdade: diagnóstico automático mensal, alerta quando um indicador sai da faixa, relatório na caixa de entrada. Receita recorrente que não consome hora de operação proporcional.

Entrega: assinatura, cobrança recorrente, automação do pipeline de análise.

### Fase 5 — mês 12 em diante, o dado

Com contas suficientes rodando, o Versa Índice deixa de ser uma página bonita e passa a ser a única fonte confiável de benchmark de mídia paga do Norte. Nesse ponto a Versa não é mais uma agência com site legal, é a empresa que sabe quanto custa um lead em cada segmento da região. Isso muda o que ela pode cobrar.

Isso também resolve a pendência técnica registrada na memória do projeto: os thresholds do motor só saem de "hipótese" para "calibrado" com volume, e volume é exatamente o que as ferramentas públicas produzem.

### O que não fazer

- Não construir área de cliente antes de ter fluxo constante de lead. Retenção sem aquisição é caprichar na saída de um estádio vazio.
- Não lançar assinatura antes da automação estar madura. Cobrar recorrente para entregar no braço destrói margem e reputação ao mesmo tempo.
- Não tentar virar SaaS antes de dominar o serviço. A receita de serviço é o que financia o produto, e quem inverte a ordem quebra.

### O critério de decisão em cada fase

Só avançar de fase quando a anterior estiver gerando número. Fase 1 avança quando uma ferramenta gerar leads consistentes por dois meses seguidos. Fase 2 avança quando houver gente voltando. Fase 3 avança quando houver clientes suficientes para justificar. Construir a fase seguinte por empolgação é o erro mais caro que uma empresa pequena com boa capacidade técnica pode cometer, e é um erro que a Versa está em risco real de cometer, porque consegue construir mais rápido do que consegue validar.

---
---

# SÍNTESE

## TOP 10 MELHORIAS

Em ordem de execução, não de importância isolada. Cada uma habilita a seguinte.

**1. Publicar o site em domínio próprio.**
`SITE.url` ainda aponta para um placeholder. Enquanto isso não mudar, tudo neste documento é teoria. Junto: inicializar git.

**2. Instalar medição completa antes de qualquer mudança de layout.**
GA4, GTM, pixel da Meta, tag do Google, Conversions API, evento em cada um dos nove CTAs, UTM em cada link de WhatsApp. Sem isso não existe forma de saber o que funcionou, e a Versa continua vendendo medição sem medir a si mesma.

**3. Criar o destino de conversão que hoje não existe.**
Uma página `/diagnostico` com formulário próprio que grava o lead antes de mandar para o WhatsApp, e uma `/obrigado` que dispara o evento. É o item que muda o site de "canal de saída" para "canal de captura".

**4. Reescrever o hero.**
Headline que diz o que a Versa faz e para quem, subtítulo sem "crescimento real", e CTA primário que entrega alguma coisa em vez de pedir uma conversa.

**5. Construir a Calculadora de Verba Mínima Viável.**
Duas horas de trabalho para colocar no ar o conhecimento mais proprietário e mais contraintuitivo que a Versa tem. É a menor distância entre esforço e diferenciação em todo este documento.

**6. Publicar o case da TransLima com os números reais e com a lacuna de medição.**
O único case de tráfego que a empresa tem, e o mais honesto que ela poderia publicar. Junto: preencher `metrics` nos outros quatro.

**7. Colher e publicar depoimentos em vídeo dos clientes atuais.**
Uma tarde de WhatsApp. Maior ganho de confiança por hora investida em todo o site.

**8. Reescrever os nove CTAs por intenção e adicionar barra fixa no mobile.**
Trabalho de texto mais um componente. Alto retorno, esforço trivial.

**9. Colocar faixas de investimento e o bloco de "para quem é e para quem não é".**
Qualifica antes da conversa, elimina a pergunta mais frequente e ganha confiança ao dizer para quem a Versa não serve.

**10. Colocar o Raio-X de Campanha no ar.**
O maior ativo tecnológico da empresa deixando de ser uma pasta e virando o principal canal de aquisição. É o item de maior impacto da lista e por isso vem depois dos fundamentos, não antes.

---

## TOP 10 FERRAMENTAS

Ordenadas por relação entre valor comercial e esforço.

| # | Ferramenta | Por que esta | Esforço |
|---|---|---|---|
| 1 | **Raio-X de Campanha** | O motor já existe, testado e documentado. Gera o lead mais qualificado possível e nenhum concorrente regional consegue copiar. | Médio |
| 2 | **Calculadora de Verba Mínima Viável** | Conhecimento proprietário, duas horas de trabalho, contradiz o que todo mundo vende e prova a matemática na tela. | Baixo |
| 3 | **Detector de Rastreamento** | Cria sozinho a demanda pelo serviço de maior margem e menor esforço da empresa. | Médio |
| 4 | **Estimador de Perda por Site Lento** | Traduz métrica técnica em reais, que é exatamente o que a Versa promete fazer. Vende site sem falar de site. | Baixo |
| 5 | **Simulador de ROI** | Mostra a conta aberta do negócio do visitante e ancora a conversa em número. | Baixo |
| 6 | **Qual serviço eu preciso** | Resolve o problema de posicionamento do site (três frentes, nenhuma direção) e roteia o lead sozinho. | Baixo |
| 7 | **Avaliador de Criativo** | Alto volume de uso, conecta com produção recorrente, e o módulo de compliance abre o nicho de saúde. | Médio |
| 8 | **Raio-X do Concorrente** | Curiosidade sobre concorrente é o gatilho de clique mais confiável em PME, e o dado é público. | Médio |
| 9 | **Score de Marca** | Única ferramenta que puxa branding, que é o serviço de ticket mais alto por projeto. | Baixo |
| 10 | **Versa Índice** | Retorno lento, teto altíssimo. Quem publica o benchmark de um mercado passa a definir esse mercado. | Alto |

---

## TOP 5 NOVOS SERVIÇOS

| # | Serviço | Ticket | Recorrente | Por que este |
|---|---|---|---|---|
| 1 | **Infra de Medição** | R$ 1.500 a R$ 3.500 | Não, mas abre gestão | Melhor relação entre dor real, esforço de entrega e ticket. A ferramenta gera o lead sozinha. |
| 2 | **Raio-X de Tráfego pago** | R$ 497 a R$ 1.500 | Não, converte em gestão | Transforma capacidade técnica existente em receita sem aumentar horas de operação. |
| 3 | **Sprint de Conversão** | R$ 3.500 a R$ 6.000 | Vira otimização mensal | Escopo e prazo fechados, risco percebido baixo, venda rápida. |
| 4 | **Versa Radar** | R$ 250 a R$ 500 por mês | Sim | Única receita previsível da lista, e atende a faixa de cliente que hoje não cabe na gestão completa. |
| 5 | **Anúncio em Conformidade (saúde)** | R$ 800 a R$ 2.500 por mês | Sim | Nicho com ticket alto, dor de compliance real, e a Versa já tem o repertório de um cliente do setor. |

---

## FUNIL RECOMENDADO

```
   TRÁFEGO
   Busca local · Meta e Google Ads · Instagram · Indicação
        │
        ▼
   CHEGADA                                    Hero com oferta clara
   "isso é para mim"                          e prova imediata logo abaixo
        │
        ├──────────────┬──────────────┬──────────────┐
        ▼              ▼              ▼              ▼
   [ QUENTE ]     [ MORNO ]      [ FRIO ]      [ CURIOSO ]
   pronto para    quer entender  pesquisando   veio pela
   contratar      o problema                   ferramenta
        │              │              │              │
        ▼              ▼              ▼              ▼
   WhatsApp       Diagnóstico    Calculadora   Ferramenta
   com contexto   guiado         ou quiz       específica
   pré-preenchido (6 perguntas)                 (URL própria)
        │              │              │              │
        │              ▼              ▼              ▼
        │         Resultado na   Resultado na    Resultado
        │         tela, antes    tela            na tela
        │         de pedir dado       │              │
        │              │              │              │
        │              ▼              ▼              ▼
        │         Contato para   E-mail para    E-mail para
        │         relatório      material       relatório
        │         completo            │              │
        │              │              │              │
        └──────────────┴──────────────┴──────────────┘
                       │
                       ▼
                 SCORE AUTOMÁTICO
                 (verba, ticket, urgência, decisão)
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
     ≥ 70          40 a 69          < 40
        │              │              │
        ▼              ▼              ▼
   Notificação    Relatório +    Relatório +
   imediata +     nutrição de    conteúdo
   link de agenda 5 e-mails      mensal
   Resposta em         │              │
   até 2h úteis        │              │
        │              │              │
        ▼              ▼              ▼
    REUNIÃO      Volta quando    Volta quando
    de 45 min    amadurece       o momento chega
        │              │              │
        ▼              └──────┬───────┘
    PROPOSTA                  │
    (página web,              │  remarketing com pixel
    escopo e prazo)           │  para 100% de quem passou
        │                     │
        ▼                     │
    CLIENTE ◄─────────────────┘
        │
        ▼
    ÁREA DO CLIENTE
    (relatório, andamento, aprovação)
        │
        ▼
    EXPANSÃO
    (medição → tráfego → site → recorrência)
```

O ponto central do desenho: hoje existe **um** caminho, e ele serve só a coluna "quente". O funil recomendado tem quatro entradas e nenhuma delas termina em desperdício, porque até quem não converte fica no pixel e na lista.

---

## SITE IDEAL DA VERSA

Como a experiência deveria ser, descrita como narrativa e não como lista.

Uma dona de clínica, 22h de uma quarta, celular na mão, cansada de investir R$ 30 por dia sem entender o que acontece. Ela clica num anúncio.

A página abre em menos de um segundo, sem intro, porque a Versa sabe que a intro é para quem digitou o domínio, não para quem pagou o clique. O título diz, em português direto, o que ela sente. Logo abaixo, três nomes de clientes reais e um número.

Ela não é convidada a "falar com a Versa". É convidada a descobrir uma coisa: se os R$ 30 por dia dela são suficientes para a Meta conseguir otimizar. Ela digita o ticket médio e a taxa de fechamento. Em três segundos aparece a conta, aberta, com a fórmula visível, e a resposta de que a verba dela está abaixo do mínimo viável para o objetivo escolhido, com a explicação do que isso causa na prática, que é exatamente o que ela vinha sentindo sem saber nomear.

Nesse momento ela não foi vendida nada. Ela entendeu uma coisa que ninguém tinha explicado antes. É aqui que a relação muda.

O site então oferece o passo seguinte, ainda gratuito. Ela sobe o print do gerenciador. Dois minutos depois tem um diagnóstico com nota, três achados críticos e um plano de ação. Só então, para receber o relatório completo em PDF, ela deixa nome, WhatsApp e e-mail, e responde três perguntas rápidas que valem mais para ela do que para a Versa.

O sistema calcula o score. Ela pontua alto. O relatório chega no e-mail em segundos, com a marca da Versa, e ela encaminha para o sócio. No WhatsApp do comercial chega uma notificação com duas linhas de resumo: quem é, quanto investe, qual o problema, qual a urgência. A tela de obrigado oferece uma agenda com três horários.

Ela marca. Na reunião, ninguém precisa perguntar nada básico, porque tudo já está na tela. A conversa começa no ponto em que uma primeira conversa costuma terminar.

Se ela não tivesse marcado, o pixel a acompanharia, os e-mails chegariam com o assunto certo, e o site, na visita seguinte, mostraria o resultado anterior dela no topo, perguntando se alguma coisa mudou.

Em nenhum momento o site disse que a Versa domina marketing, design e tecnologia. Ele fez marketing, mostrou design e rodou tecnologia enquanto ela usava. **Essa é a diferença entre um site que afirma competência e um site que é a evidência dela.**

---

## ROADMAP

Quatro semanas. Cada semana termina com alguma coisa no ar, nunca com "quase pronto".

### Semana 1 — fundação e medição

Objetivo: o site existe no mundo e conta o que acontece nele.

- Registrar e apontar o domínio definitivo, corrigir `SITE.url`, publicar na Vercel
- Inicializar git, primeiro commit, repositório remoto
- Google Search Console e Bing, submeter sitemap
- GA4 e GTM instalados
- Pixel da Meta e tag do Google Ads, com Conversions API no servidor
- Evento `cta_click` em cada um dos nove CTAs, com parâmetro de seção de origem
- UTM em cada link de WhatsApp, e mensagem pré-preenchida diferente por seção
- Política de privacidade e banner de consentimento
- Schema `FAQPage` adicionado ao JSON-LD

**Entrega da semana:** site no ar, indexado, com cada clique contado.

---

### Semana 2 — conversão e prova

Objetivo: o site captura lead e mostra que a Versa entrega resultado.

- Página `/diagnostico` com formulário de 6 perguntas, gravando em banco antes de mandar para o WhatsApp
- Página `/obrigado` com evento de conversão
- Score de lead calculado no envio, notificação diferenciada por faixa
- Hero reescrito (headline, subtítulo, CTA, selos)
- Nove CTAs reescritos por intenção
- Barra fixa de CTA no mobile
- Preloader reduzido e desligado quando houver UTM
- Case da TransLima publicado, com números e com a lacuna de medição
- `metrics` preenchido nos quatro cases existentes
- Categoria "Tráfego e Performance" adicionada ao filtro
- Depoimentos gravados com os clientes atuais (a coleta começa nesta semana)

**Entrega da semana:** todo lead fica registrado e classificado, e o site tem prova de tráfego pago pela primeira vez.

---

### Semana 3 — as duas primeiras ferramentas

Objetivo: o site passa a entregar valor antes de pedir qualquer coisa.

- `/ferramentas/verba-minima` no ar, com a conta aberta na tela
- `/ferramentas/rastreamento` no ar, com relatório do que o visitante não mede
- Índice `/ferramentas`
- Geração de relatório em PDF (reaproveitar o pipeline HTML e chromium do relatório da TransLima)
- Captura de e-mail integrada às duas ferramentas
- Bloco "para quem é e para quem não é" na home
- Faixas de investimento na home
- Depoimentos em vídeo publicados
- Seção com rosto e nome de quem executa

**Entrega da semana:** duas ferramentas gerando lead sozinhas, com relatório em PDF circulando com a marca da Versa.

---

### Semana 4 — o Raio-X e o começo da medição de verdade

Objetivo: colocar o maior ativo da empresa no ar e começar a ler o que os três meses seguintes vão decidir.

- `/ferramentas/raio-x-de-campanha` com upload de CSV ou XLSX e formulário alternativo
- Motor de análise conectado à camada web, com saída em JSON validado
- Relatório completo em PDF com nota, achados e plano de ação
- Oferta do Raio-X pago dentro da tela de resultado
- Sequência de nutrição de 5 e-mails para lead morno
- Agenda com link para lead quente
- Painel semanal com as 7 linhas da Parte 17
- Primeiro experimento A/B no ar (E1, o CTA do hero)

**Entrega da semana:** o site deixa de ser um folder e passa a ser uma máquina que atrai, diagnostica, qualifica, prova valor e entrega o lead pronto para a conversa.

---

### Depois das quatro semanas

Semanas 5 a 8: páginas de serviço, `/investimento`, mais duas ferramentas, primeiro conteúdo de SEO.
Mês 3: fluxo guiado completo da Parte 6, personalização por UTM, Versa Radar em piloto com um cliente.
Mês 4 a 6: conta de usuário, histórico de diagnóstico, primeiros dados do Versa Índice.

---

## OBSERVAÇÃO FINAL

O site da Versa é, de longe, o melhor site de empresa de comunicação que eu vi sair de Rio Branco. O problema é que ele foi construído com a régua errada. Ele foi julgado por "está bonito e bem feito?", e a resposta é sim. A régua certa é "quantas oportunidades comerciais ele gerou este mês?", e a resposta hoje é que não dá para saber, porque ele não conta.

A boa notícia é que quase tudo que falta é barato. Os oito itens de maior impacto somam menos de duas semanas de trabalho, e metade deles é texto. O item mais valioso de todos, o Raio-X de Campanha, é uma camada web sobre um motor que já está construído e testado.

A Versa se define como empresa de tecnologia. O site prova isso hoje com uma lista de frameworks, que é a forma mais fraca de provar qualquer coisa. A forma forte é o visitante usar, no site, uma coisa que a agência do lado nunca vai conseguir construir. É isso que está faltando, e é isso que está mais perto do que parece.
