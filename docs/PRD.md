# PRD — Editor de Capas de Agenda Personalizadas

**Versão:** 1.0
**Data:** Março 2026
**Status:** Em desenvolvimento

---

## 1. Resumo Executivo

O **Editor de Capas de Agenda Personalizadas** é uma plataforma web que permite clientes criarem agendas completamente personalizadas — do design da capa à configuração do miolo — e efetuarem a compra com pagamento via Pix, tudo em um único fluxo integrado.

A plataforma funciona como um "Canva simplificado" especializado em agendas, eliminando a necessidade de comunicação back-and-forth com designers, reduzindo erros de produção e oferecendo uma experiência de compra moderna e autoguiada.

---

## 2. Problema e Oportunidade

### Problema Atual
- Clientes que desejam agendas personalizadas precisam enviar briefings por e-mail ou WhatsApp, aguardar artes de designers, aprovar iterações e só então efetuar o pedido — processo lento e sujeito a erros.
- Gráficas e papelarias não oferecem ferramentas de personalização online, perdendo vendas para clientes que querem autonomia e agilidade.
- A falta de preview realístico gera desistências e devoluções.

### Oportunidade
- Mercado de papelaria personalizada em crescimento, especialmente agendas profissionais e presentes corporativos.
- Plataforma de autoatendimento reduz custo operacional (menos horas de designer por pedido) e aumenta volume de pedidos.
- Preview 3D animado diferencia a experiência de compra e aumenta conversão.

---

## 3. Usuários-Alvo / Personas

### Persona 1 — Profissional Liberal (Primária)
- **Quem:** Advogada, médica, psicóloga, arquiteta (25–45 anos)
- **Necessidade:** Agenda personalizada com logo do escritório e nome, visual profissional
- **Comportamento:** Acostumada com ferramentas digitais, espera processo rápido e resultado elegante
- **Dor:** Não quer depender de designer para algo simples como uma agenda

### Persona 2 — Presenteador Corporativo (Secundária)
- **Quem:** Gerente de RH ou compras (30–50 anos)
- **Necessidade:** Lote de agendas personalizadas como brinde corporativo de fim de ano
- **Comportamento:** Precisa de agilidade, quer ver preview antes de aprovar
- **Dor:** Orçamentos demorados e falta de visualização do produto final

### Persona 3 — Consumidor Final / Papelaria Pessoal (Secundária)
- **Quem:** Estudante ou profissional que quer agenda com nome (18–35 anos)
- **Necessidade:** Agenda bonita com nome e estilo pessoal (feminino, minimalista, floral)
- **Comportamento:** Mobile-first, influenciada por redes sociais
- **Dor:** Agendas prontas no mercado não têm personalidade

### Persona 4 — Administrador da Plataforma (Interna)
- **Quem:** Operador da gráfica/papelaria
- **Necessidade:** Gerenciar pedidos, acompanhar status de produção, baixar artes para impressão
- **Comportamento:** Acessa painel administrativo diariamente
- **Dor:** Organizar pedidos recebidos por canais dispersos (WhatsApp, e-mail)

---

## 4. Objetivos do Produto e Métricas de Sucesso (KPIs)

### Objetivos
1. Oferecer fluxo completo de personalização e compra em menos de 10 minutos
2. Eliminar dependência de designer para pedidos individuais
3. Aumentar taxa de conversão com preview 3D realístico
4. Centralizar gestão de pedidos no painel administrativo

### KPIs

| Métrica | Meta (3 meses pós-lançamento) |
|---|---|
| Taxa de conclusão do fluxo de 4 etapas | > 60% dos usuários que iniciam o editor |
| Tempo médio de conclusão do pedido | < 10 minutos |
| Taxa de abandono no checkout | < 30% |
| NPS (Net Promoter Score) | > 50 |
| Pedidos processados por mês | > 100 |
| Tempo de resposta da página do editor | < 3 segundos |
| Erros de exportação PNG reportados | 0 por mês |

---

## 5. Funcionalidades e Requisitos

### 5.1 Must Have (Obrigatório — MVP)

#### Editor de Capa (Fabric.js)
- Seleção de template a partir do catálogo com filtro por categoria
- Upload de logo do usuário (PNG/JPG/SVG, até 5MB)
- Posicionamento livre do logo (arrastar, redimensionar, rotacionar)
- Campo de texto com nome do cliente (arrastar, editar inline)
- Seleção de fonte (mínimo 12 opções Google Fonts)
- Seleção de cor do texto (color picker)
- Desfazer/refazer ações (histórico)
- Exportação em PNG A4 300dpi (2480×3508px)
- Responsividade: canvas ajustado a qualquer viewport

#### Configurador do Miolo
- Seleção de tipo de miolo: Comercial, Clássica, Jurídica
- Seleção de dias por página: 1DPP, 2DPP
- Seleção de posição do calendário: Lateral, Rodapé
- Seleção de cor das folhas/linhas (opções variam por tipo de miolo)
- Seleção de cor do espiral: Prata, Dourado, Preto, Branco, Rosa, Azul, Verde
- Validação: combinações inválidas devem ser bloqueadas ou alertadas

#### Preview 3D
- Renderização animada tipo flipbook (react-pageflip)
- Exibição da capa personalizada na frente do livro
- Navegação por páginas com flip animado
- Suporte a swipe em dispositivos móveis

#### Checkout
- Autenticação: login e cadastro (Supabase Auth)
- Formulário de endereço de entrega
- Geração de cobrança Pix via Asaas
- Exibição de QR Code e código Pix copia-e-cola
- Webhook Asaas para confirmação de pagamento
- E-mail de confirmação de pedido (Resend)
- Página de pedido confirmado

#### Painel Administrativo
- Listagem de pedidos com filtro por status
- Detalhe do pedido: preview da capa, configuração completa do miolo, dados de entrega
- Download da arte da capa em PNG (alta resolução)
- Atualização manual de status do pedido

### 5.2 Should Have (Importante — pós-MVP)

- CRUD completo de templates no admin (upload, ativar/desativar, reordenar)
- CRUD de tipos de miolo e cores de espiral
- E-mail de atualização de status do pedido ao cliente
- Dashboard do cliente: "Meus Pedidos" e "Meus Designs"
- Paginação e busca na listagem de pedidos (admin)
- Zoom no canvas do editor (scroll do mouse / pinch)

### 5.3 Could Have (Desejável — futuro)

- Múltiplos templates de páginas internas com preview
- Compartilhamento de design via link
- Suporte a múltiplos idiomas (i18n)
- Integração com outros meios de pagamento (cartão de crédito)
- Pedidos em lote / quantidade
- Sistema de cupom de desconto
- Área de afiliados/revendedores

---

## 6. User Stories

### Fluxo do Cliente

**US-01 — Catálogo de Templates**
Como cliente, quero visualizar os templates disponíveis filtrados por categoria (feminino, masculino, profissional, elegante) para escolher o estilo que mais combina comigo.

**US-02 — Editor de Capa**
Como cliente, quero fazer upload do meu logo, posicioná-lo livremente na capa e digitar meu nome com fonte e cor de minha escolha, para criar uma capa personalizada.

**US-03 — Preview em Tempo Real**
Como cliente, quero ver em tempo real como ficará minha capa enquanto edito, para ter confiança no resultado final antes de comprar.

**US-04 — Exportação para Impressão**
Como sistema, preciso exportar a capa em PNG 2480×3508px (A4 300dpi) para garantir qualidade de impressão profissional.

**US-05 — Configuração do Miolo**
Como cliente, quero configurar o tipo de miolo, dias por página, posição do calendário, cor das folhas e cor do espiral, para que a agenda atenda exatamente às minhas necessidades de uso.

**US-06 — Validação de Combinações**
Como cliente, ao selecionar o tipo de miolo "Jurídica", quero que as cores disponíveis sejam atualizadas automaticamente (azul, cinza, verde), para evitar selecionar combinações inválidas.

**US-07 — Preview 3D**
Como cliente, quero visualizar um preview animado em 3D da minha agenda personalizada, girando as páginas, para ter uma experiência realística do produto final.

**US-08 — Swipe Mobile no Preview**
Como cliente usando celular, quero navegar pelo preview 3D com gesto de swipe, para ter uma experiência fluida em dispositivos móveis.

**US-09 — Checkout Autenticado**
Como cliente, quero me cadastrar ou fazer login para salvar meu pedido e acompanhar o status de entrega.

**US-10 — Pagamento via Pix**
Como cliente, quero gerar um QR Code Pix para pagar minha agenda de forma rápida e segura.

**US-11 — Confirmação por E-mail**
Como cliente, quero receber um e-mail confirmando meu pedido com resumo da personalização escolhida.

**US-12 — Acompanhamento do Pedido**
Como cliente, quero acessar "Meus Pedidos" para ver o status atual do meu pedido (Aguardando pagamento → Pago → Em produção → Enviado → Entregue).

### Fluxo do Administrador

**US-13 — Gestão de Pedidos**
Como administrador, quero listar todos os pedidos com filtro por status, para organizar a produção do dia.

**US-14 — Detalhe do Pedido**
Como administrador, quero acessar os detalhes de um pedido para ver a capa personalizada, a configuração do miolo e os dados de entrega.

**US-15 — Download da Arte**
Como administrador, quero baixar a arte da capa em PNG alta resolução diretamente do painel, para enviar à produção sem comunicação adicional.

**US-16 — Atualização de Status**
Como administrador, quero atualizar o status do pedido (Em produção → Enviado → Entregue), para que o cliente receba notificações automáticas.

**US-17 — Gestão de Templates**
Como administrador, quero adicionar, editar, ativar/desativar e reordenar templates, para manter o catálogo atualizado.

---

## 7. Requisitos Técnicos

### Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript |
| Editor de Canvas | Fabric.js |
| Estilização | Tailwind CSS + shadcn/ui |
| Estado global | Zustand |
| API | tRPC v11 |
| ORM / Banco | Prisma v5 + PostgreSQL (Supabase) |
| Autenticação | Supabase Auth |
| Storage de arquivos | Supabase Storage |
| Pagamento | Asaas (Pix) |
| E-mail transacional | Resend |
| Preview 3D | react-pageflip |
| Deploy | Vercel |

### Requisitos de Infraestrutura
- PostgreSQL hospedado no Supabase
- Storage Supabase para templates PNG e logos de clientes
- Webhook Asaas acessível publicamente (Vercel Serverless Function)
- Variáveis de ambiente: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `ASAAS_API_KEY`, `RESEND_API_KEY`

### Requisitos do Editor
- Canvas Fabric.js com resolução interna 2480×3508px (A4 300dpi)
- Camadas: (1) background do template — bloqueado; (2) logo do usuário — livre; (3) texto do nome — livre
- Viewport responsivo: canvas escala para o container, mantendo proporção A4
- Suporte a 12+ fontes Google Fonts com carregamento assíncrono
- Histórico de ações: mínimo 20 estados de undo/redo
- Export: `canvas.toDataURL('image/png')` com multiplicador para 300dpi

### Modelos de Dados Principais
- `User` — autenticado via Supabase Auth
- `Template` — id, name, category, imageUrl, isActive, order
- `MioloType` — id, name, availableColors (JSON)
- `SpiralColor` — id, name, hexColor
- `Design` — id, userId, templateId, canvasJson, exportedImageUrl
- `AgendaConfig` — id, designId, mioloTypeId, dpp, calendarPosition, lineColor, spiralColorId
- `Order` — id, userId, designId, agendaConfigId, addressId, status, pixCode, pixQrCode, totalAmount
- `Address` — id, userId, street, number, complement, city, state, zipCode
- `OrderStatus` enum: `PENDING_PAYMENT | PAID | IN_PRODUCTION | SHIPPED | DELIVERED`

---

## 8. Requisitos Não-Funcionais

### Performance
- Tempo de carregamento inicial da página do editor: < 3 segundos (LCP)
- Renderização do canvas após seleção de template: < 1 segundo
- Export PNG: < 5 segundos
- API tRPC: p95 < 500ms

### Segurança
- Autenticação obrigatória para salvar design e efetuar pedido
- Row Level Security (RLS) no Supabase: usuário acessa apenas seus próprios dados
- Validação de uploads: tipos permitidos (PNG, JPG, SVG), tamanho máximo 5MB
- Webhook Asaas: validação de assinatura/token para evitar fraudes
- Rotas do painel admin protegidas por role de administrador
- HTTPS obrigatório em produção (Vercel fornece por padrão)

### Escalabilidade
- Serverless (Vercel) escala automaticamente com demanda
- Supabase suporta crescimento de banco e storage
- tRPC com React Query: cache automático de queries frequentes
- Imagens de templates servidas via CDN (Supabase Storage CDN)

### Usabilidade
- Interface responsiva: funcional em mobile (mínimo 375px) e desktop
- Editor de canvas: touch events para dispositivos móveis
- Fluxo de 4 etapas com indicador de progresso visível
- Mensagens de erro claras e acionáveis
- Loading states em todas as operações assíncronas

### Disponibilidade
- SLA mínimo: 99.5% (Vercel + Supabase managed)
- Webhook Asaas com retry automático em caso de falha

### Acessibilidade
- Contraste mínimo WCAG AA nos textos da interface
- Labels em todos os inputs de formulário
- Alt text em imagens de templates

---

## 9. Fora do Escopo (Out of Scope)

- Edição das páginas internas da agenda (miolo) pelo cliente
- Impressão local / geração de PDF para impressão pelo cliente
- App nativo (iOS/Android) — apenas PWA responsivo
- Integração com Correios para cálculo automático de frete
- Sistema de avaliações/reviews de produtos
- Chat de suporte em tempo real
- Integração com marketplaces (Mercado Livre, Shopee)
- Pagamento parcelado em cartão de crédito (fase 1)
- Múltiplas quantidades por pedido (apenas 1 agenda por pedido na fase 1)

---

## 10. Dependências e Riscos

### Dependências Externas

| Dependência | Tipo | Impacto se falhar |
|---|---|---|
| Supabase | Banco + Auth + Storage | Alto — sistema inoperante |
| Asaas | Pagamentos Pix | Alto — checkout inoperante |
| Resend | E-mails transacionais | Médio — pedidos confirmados sem e-mail |
| Vercel | Deploy e hosting | Alto — sistema inoperante |
| Google Fonts | Fontes do editor | Baixo — fallback para fontes do sistema |

### Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Cliente não entrega templates PNG no prazo | Média | Alto | Usar templates placeholder durante desenvolvimento |
| Fabric.js incompatibilidade com SSR (Next.js) | Baixa | Médio | Importar Fabric.js dinamicamente com `next/dynamic` |
| Webhook Asaas bloqueado em preview/dev | Alta | Médio | Usar ngrok ou Cloudflare Tunnel em dev |
| Performance do canvas em dispositivos móveis low-end | Média | Médio | Limitar operações simultâneas, otimizar eventos de touch |
| Export PNG muito lento para logos grandes | Baixa | Baixo | Redimensionar logo no upload (canvas resize antes de aplicar) |
| Mudança de API do Asaas | Baixa | Alto | Abstrair chamadas Asaas em service layer isolado |

---

## 11. Visão Geral do Cronograma

| Sprint | Período | Foco | Status |
|---|---|---|---|
| Sprint 1 | Semana 1–2 | Setup + Templates + Infraestrutura | ✅ Concluído |
| Sprint 2 | Semana 2–3 | Editor de Capa (Fabric.js) | 🔄 Em andamento |
| Sprint 3 | Semana 3–4 | Configurador de Miolo + Preview 3D | ⏳ Pendente |
| Sprint 4 | Semana 5 | Checkout + Painel Admin | ⏳ Pendente |
| Sprint 5 | Semana 6 | Polish, Testes, Deploy | ⏳ Pendente |

**Total estimado:** 6 semanas
**Valor total:** R$ 38.000 (pagamento em 4 parcelas: 30% / 30% / 30% / 10%)
**Infraestrutura recorrente:** ~R$ 330/mês

---

## 12. Critérios de Aceite

Os seguintes cenários devem ser validados antes da entrega final:

1. Executar `pnpm dev` → landing page abre sem erros
2. Cadastrar 2–3 templates via admin → aparecem no catálogo com filtro por categoria funcional
3. Editor: selecionar template, fazer upload de logo (arrastar/redimensionar), digitar nome, mudar fonte/cor e posição — tudo funcionando
4. Exportar PNG e verificar resolução exata de 2480×3508px para impressão
5. Configurador de miolo: selecionar Clássica, 2DPP, calendário lateral, cor azul, espiral dourado — salvar e prosseguir
6. Mudar para Jurídica → verificar que cores disponíveis mudam para (azul, cinza, verde)
7. Preview 3D: clicar "Ver Preview", ver flipbook com capa personalizada, virar páginas. Swipe funcional no mobile
8. Fluxo completo: editor → configurar miolo → preview 3D → checkout → gerar Pix → confirmar via webhook → pedido aparece no admin com status correto

---

*Documento gerado em Março 2026. Sujeito a revisões conforme evolução do projeto.*
