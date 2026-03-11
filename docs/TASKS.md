# TASKS — Editor de Capas de Agenda Personalizadas

**Última atualização:** Março 2026
**Metodologia:** Sprints de 1–2 semanas
**Estimativa de esforço:** S = pequeno (< 2h) | M = médio (2–4h) | L = grande (4–8h)

---

## Sprint 1 — Setup + Templates + Infraestrutura ✅ Concluído

> Semana 1–2. Toda a base do projeto foi configurada com sucesso.

- [x] Inicializar projeto Next.js 15 com App Router e TypeScript — `S`
- [x] Configurar Tailwind CSS — `S`
- [x] Instalar e configurar shadcn/ui (componentes base) — `S`
- [x] Configurar Prisma v5 com schema completo — `M`
  - Models: User, Template, MioloType, SpiralColor, Design, AgendaConfig, Order, Address
  - Enum OrderStatus: PENDING_PAYMENT, PAID, IN_PRODUCTION, SHIPPED, DELIVERED
- [x] Configurar conexão com PostgreSQL (Supabase) — `S`
- [x] Executar migrations iniciais — `S`
- [x] Criar seed com dados iniciais — `M`
  - 3 MioloTypes (Comercial, Clássica, Jurídica)
  - 8 SpiralColors (Prata, Dourado, Preto, Branco, Rosa, Azul, Verde, etc.)
  - 4 Templates (exemplos de cada categoria)
- [x] Configurar tRPC v11 (setup, context, routers base) — `M`
- [x] Criar router tRPC: `template` (listagem, detalhe, CRUD admin) — `M`
- [x] Criar router tRPC: `design` (criar, salvar, listar por usuário) — `M`
- [x] Criar router tRPC: `order` (criar, atualizar status, listar) — `M`
- [x] Configurar Supabase Auth — `S`
- [x] Configurar Supabase Storage (bucket para templates e logos) — `S`
- [x] Criar Zustand store: `useEditorStore` — `M`
- [x] Criar Zustand store: `useAgendaConfigStore` — `S`
- [x] Instalar e configurar Fabric.js (import dinâmico Next.js) — `M`
- [x] Criar hook `use-editor.ts` — wrapper principal do Fabric.js — `L`
- [x] Criar hook `use-font-loader.ts` — 12 Google Fonts — `M`
- [x] Criar hook `use-history.ts` — undo/redo — `M`
- [x] Criar hook `use-canvas-events.ts` — eventos do canvas — `M`
- [x] Criar hook `use-auto-resize.ts` — canvas responsivo — `M`
- [x] Criar componente `Editor` (container principal) — `M`
- [x] Criar componente `Navbar` (barra superior do editor) — `S`
- [x] Criar componente `Sidebar` (painel lateral esquerdo) — `M`
- [x] Criar componente `TextSidebar` (painel de propriedades do texto) — `M`
- [x] Criar componente `ImageSidebar` (painel de propriedades do logo) — `M`
- [x] Implementar exportação PNG alta resolução (2480×3508px) — `M`
- [x] Configurar estrutura de pastas do projeto (features/, server/, lib/) — `S`
- [x] Instalar componentes shadcn/ui adicionais (badge, card, dialog, input, label, radio-group, scroll-area, select, separator, sheet, slider, tabs) — `S`

---

## Sprint 2 — Editor de Capa (Fabric.js) ✅ Concluído

> Semana 2–3. Editor de capa com persistência, upload de logo, controles e salvamento implementados.

### Concluído
- [x] Estrutura base do componente Editor — `M`
- [x] Hooks: use-editor, use-history, use-canvas-events, use-auto-resize, use-font-loader — `L`
- [x] Sidebar de texto (fonte, cor, tamanho) — `M`
- [x] Sidebar de imagem (logo upload, redimensionar) — `M`
- [x] Export PNG base — `M`
- [x] Página de catálogo de templates `/templates` com grid de cards — `M`
- [x] Filtro por categoria no catálogo (Femininas, Masculinas, Profissionais, Elegantes) — `S`
- [x] Card de template com preview, nome e botão "Personalizar" — `S`
- [x] Navegação: clicar no template redireciona para `/editor/[slug]` — `S`
- [x] Carregar template selecionado como background bloqueado no canvas ao abrir editor — `M`
- [x] Persistir canvas JSON no localStorage a cada alteração — `S`
- [x] Restaurar estado do canvas ao recarregar a página (localStorage) — `M`
- [x] Indicador de progresso das 4 etapas visível no topo do editor — `S`
- [x] Botão de upload de logo na sidebar — `S`
- [x] Validação de tipo de arquivo (PNG, JPG, SVG) e tamanho máximo 5MB — `S`
- [x] Upload do logo para Supabase Storage — `M`
- [x] Adicionar logo ao canvas como `fabric.Image` draggable/resizable/rotatable — `M`
- [x] Controles de transformação visíveis (handles de redimensionamento) — `S`
- [x] Botão para remover logo do canvas — `S`
- [x] Texto padrão ao canvas ao carregar template ("Seu Nome") — `S`
- [x] Edição inline do texto ao clicar duas vezes — `S`
- [x] Seletor de fonte na sidebar com preview visual — `M`
- [x] Color picker para cor do texto — `S`
- [x] Controle de tamanho do texto (slider ou input numérico) — `S`
- [x] Controle de negrito e itálico — `S`
- [x] Botões Desfazer / Refazer com atalhos Ctrl+Z / Ctrl+Y — `S`
- [x] Botão de zoom: aumentar/diminuir e reset — `M`
- [x] Ordem de camadas: trazer para frente / enviar para trás — `S`
- [x] Tecla Delete para remover elemento selecionado — `S`
- [x] Botão "Salvar Design" — salva JSON do canvas via tRPC `design.save` — `M`
- [x] Botão "Exportar PNG" — gera PNG 2480×3508px e faz download — `M`
- [x] Ao salvar design, armazenar `exportImageUrl` no Storage do Supabase — `M`
- [x] Botão "Próximo" habilita apenas após template selecionado e nome preenchido — `S`

### Pendente (opcional / polish)
- [ ] Botão "Centralizar" para logo e texto — `S`
- [ ] Testar critério de aceite 3: upload de logo, posicionamento, fonte, cor — `M`
- [ ] Testar critério de aceite 4: verificar resolução do PNG exportado (2480×3508px) — `S`

---

## Sprint 3 — Configurador de Miolo + Preview 3D ⏳ Pendente

> Semana 3–4.

### Configurador de Miolo

#### UI e Componentes
- [ ] Criar página `/configurar` — etapa 2 do fluxo — `M`
- [ ] Criar componente `MioloConfigurator` (container da etapa 2) — `M`
- [ ] Seção "Tipo de Miolo": radio group (Comercial | Clássica | Jurídica) — `S`
- [ ] Seção "Dias por Página": radio group (1DPP | 2DPP) com descrição visual — `S`
- [ ] Seção "Posição do Calendário": radio group (Lateral | Rodapé) com ícone ilustrativo — `S`
- [ ] Seção "Cor das Folhas/Linhas": seletor dinâmico que muda conforme tipo de miolo — `M`
  - Comercial: Azul, Rosa, Roxo, Cinza, Laranja
  - Clássica: Azul, Preto, Verde, Bordeaux
  - Jurídica: Azul, Cinza, Verde
- [ ] Seção "Cor do Espiral": seletor visual com swatches coloridos — `M`
  - Opções: Prata, Dourado, Preto, Branco, Rosa, Azul, Verde
- [ ] Preview lateral com resumo das seleções em tempo real — `M`

#### Lógica e Estado
- [ ] Carregar opções do banco via tRPC `mioloType.list` e `spiralColor.list` — `S`
- [ ] Implementar lógica de cores disponíveis por tipo de miolo em `useAgendaConfigStore` — `M`
  - Ao trocar tipo de miolo → resetar cor de linha selecionada se inválida
- [ ] Validar que todos os campos estão preenchidos antes de avançar — `S`
- [ ] Botão "Próximo" → salvar AgendaConfig via tRPC e redirecionar para preview — `M`
- [ ] Testar critério de aceite 5: Clássica, 2DPP, lateral, azul, espiral dourado — `S`
- [ ] Testar critério de aceite 6: trocar para Jurídica → cores atualizadas — `S`

### Preview 3D

#### Setup e Infraestrutura
- [ ] Instalar `react-pageflip` — `S`
- [ ] Criar página `/preview` — etapa 3 do fluxo — `M`
- [ ] Criar componente `AgendaPreview3D` (container react-pageflip) — `L`

#### Conteúdo do Flipbook
- [ ] Página 1 (capa): exibir PNG exportado da capa personalizada — `M`
  - Dependência: design exportado e armazenado no Sprint 2
- [ ] Páginas internas: renderizar templates de miolo conforme tipo selecionado — `L`
  - Criar componentes visuais para cada tipo de miolo (Comercial, Clássica, Jurídica)
  - Aplicar cor de linhas e posição de calendário selecionados
- [ ] Página final (contracapa): template genérico ou personalizado — `S`

#### Interatividade e Mobile
- [ ] Configurar flip animado suave (spring animation) — `S`
- [ ] Suporte a swipe no mobile (touch events do react-pageflip) — `M`
- [ ] Botões de navegação "Próxima página" / "Página anterior" — `S`
- [ ] Botão "Voltar e Editar" — volta para editor preservando estado — `S`
- [ ] Botão "Finalizar e Comprar" — avança para checkout — `S`
- [ ] Testar critério de aceite 7: preview 3D com swipe mobile — `M`

---

## Sprint 4 — Checkout + Painel Administrativo ⏳ Pendente

> Semana 5.

### Autenticação (Supabase Auth)

- [ ] Criar página de login `/login` (e-mail + senha) — `M`
- [ ] Criar página de cadastro `/cadastro` (nome, e-mail, senha) — `M`
- [ ] Criar componente `AuthGuard` — redireciona para login se não autenticado — `S`
- [ ] Configurar middleware Next.js para proteger rotas autenticadas — `M`
- [ ] Criar `AuthProvider` / integração com Supabase Auth no cliente — `M`
- [ ] Callback de autenticação OAuth (opcional: Google) — `M`

### Checkout

#### Endereço de Entrega
- [ ] Criar página `/checkout` — etapa 4 do fluxo — `M`
- [ ] Formulário de endereço: CEP, logradouro, número, complemento, bairro, cidade, estado — `M`
- [ ] Busca automática de endereço por CEP (ViaCEP API) — `M`
- [ ] Salvar endereço via tRPC `address.save` — `S`
- [ ] Opção de reutilizar endereço cadastrado anteriormente — `M`

#### Resumo do Pedido
- [ ] Componente `OrderSummary` — exibir thumbnail da capa, configuração do miolo, valor total — `M`
- [ ] Exibir valor fixo da agenda — `S`

#### Pagamento Pix (Asaas)
- [ ] Criar service `asaas.service.ts` com cliente HTTP para API Asaas — `M`
- [ ] Criar endpoint tRPC `order.createWithPix` — cria Order e gera cobrança no Asaas — `L`
  - Criar customer no Asaas (ou reutilizar por CPF/e-mail)
  - Gerar cobrança Pix com valor, vencimento e descrição
  - Salvar `pixCode`, `pixQrCode` e `asaasPaymentId` no Order
- [ ] Criar página `/pagamento/[orderId]` — exibir QR Code e código copia-e-cola — `M`
- [ ] Polling ou WebSocket para detectar pagamento confirmado (fallback enquanto webhook não chega) — `M`
- [ ] Exibir contador de expiração do Pix (30 minutos) — `S`

#### Webhook Asaas
- [ ] Criar rota `POST /api/webhooks/asaas` — `L`
  - Validar autenticidade do webhook (token secret)
  - Processar evento `PAYMENT_CONFIRMED` → atualizar Order para `PAID`
  - Processar evento `PAYMENT_OVERDUE` → atualizar Order para `PENDING_PAYMENT` (reabrir)
- [ ] Criar ngrok / Cloudflare Tunnel em desenvolvimento para receber webhook — `S`

#### Confirmação e E-mail
- [ ] Criar página `/pedido-confirmado/[orderId]` — resumo do pedido pago — `M`
- [ ] Criar service `email.service.ts` com cliente Resend — `M`
- [ ] Criar template de e-mail de confirmação de pedido (HTML responsivo) — `M`
- [ ] Disparar e-mail ao confirmar pagamento via webhook — `S`
- [ ] Testar critério de aceite 8: fluxo completo até pedido no admin — `L`

### Dashboard do Cliente

- [ ] Criar página `/meus-pedidos` — listagem de pedidos do usuário autenticado — `M`
- [ ] Card de pedido: thumbnail da capa, status com badge colorido, data, valor — `M`
- [ ] Criar página `/meus-designs` — listagem de designs salvos — `M`
- [ ] Ação "Continuar editando" em designs não finalizados — `S`

### Painel Administrativo

#### Proteção e Layout
- [ ] Criar middleware para verificar role de admin (`user.role === 'ADMIN'`) — `M`
- [ ] Criar layout `/admin` com sidebar de navegação — `M`

#### Gestão de Pedidos
- [ ] Criar página `/admin/pedidos` — tabela de pedidos com paginação — `M`
- [ ] Filtro de pedidos por status (select ou tabs) — `S`
- [ ] Busca por nome do cliente ou ID do pedido — `S`
- [ ] Criar página `/admin/pedidos/[id]` — detalhe completo do pedido — `M`
  - Preview da capa personalizada (thumbnail)
  - Download do PNG em alta resolução (2480×3508px)
  - Configuração completa do miolo
  - Dados de entrega
  - Histórico de status com timestamps
- [ ] Botão para atualizar status do pedido (dropdown) — `M`
  - PAID → IN_PRODUCTION → SHIPPED → DELIVERED
- [ ] Enviar e-mail de atualização de status ao cliente ao trocar status — `M`

#### Gestão de Templates (Should Have)
- [ ] Criar página `/admin/templates` — listagem de templates — `M`
- [ ] Formulário de criação/edição de template (nome, categoria, upload PNG, ativo) — `L`
- [ ] Upload do PNG do template para Supabase Storage — `M`
- [ ] Ativar / desativar template (toggle) — `S`
- [ ] Reordenar templates via drag-and-drop — `L`

#### Gestão de Miolo e Espiral (Should Have)
- [ ] CRUD de tipos de miolo com configuração de cores disponíveis — `M`
- [ ] CRUD de cores de espiral com seletor de cor hex — `M`

---

## Sprint 5 — Polish, Testes e Deploy ⏳ Pendente

> Semana 6.

### Landing Page
- [ ] Criar página `/` — landing page com hero, benefícios e CTA — `L`
  - Hero: título, subtítulo, botão "Criar minha agenda"
  - Seção de templates em destaque
  - Seção "Como funciona" (4 passos ilustrados)
  - Depoimentos (mock ou reais)
  - Footer com links e contato
- [ ] Criar página de catálogo de templates público `/templates` integrada à landing — `M`

### UX e Polish
- [ ] Adicionar indicador de progresso (stepper) para as 4 etapas do fluxo — `S`
- [ ] Loading skeletons em todas as listas e carregamentos de imagem — `M`
- [ ] Tratamento de erros global: toast notifications para erros de API — `M`
- [ ] Empty states: catálogo sem templates, lista de pedidos vazia — `S`
- [ ] Animações de transição entre etapas do fluxo (Framer Motion ou CSS) — `M`
- [ ] Otimização de imagens (next/image em todos os templates e thumbnails) — `S`
- [ ] Favicon, meta tags e OG image para compartilhamento social — `S`

### Responsividade Mobile
- [ ] Testar e corrigir editor no mobile (touch events, escala do canvas) — `L`
- [ ] Testar configurador de miolo em mobile (380px) — `S`
- [ ] Testar preview 3D com swipe em iOS e Android — `M`
- [ ] Testar checkout em mobile — `S`

### Performance
- [ ] Analisar bundle com `@next/bundle-analyzer` — `S`
- [ ] Lazy loading de Fabric.js (já com `next/dynamic`) — verificar — `S`
- [ ] Lazy loading do react-pageflip — `S`
- [ ] Otimizar carregamento de Google Fonts (subset, display=swap) — `S`
- [ ] Medir Core Web Vitals com Lighthouse — meta: LCP < 3s, CLS < 0.1 — `M`

### Segurança
- [ ] Revisar RLS no Supabase para todas as tabelas — `M`
- [ ] Validar todos os inputs com Zod (validators.ts) no tRPC — `M`
- [ ] Configurar CSP (Content Security Policy) headers no Next.js — `M`
- [ ] Auditoria de dependências com `pnpm audit` — `S`

### Testes
- [ ] Testar critério de aceite 1: `pnpm dev` → landing page abre — `S`
- [ ] Testar critério de aceite 2: upload de templates via admin — `S`
- [ ] Testar critério de aceite 3: fluxo completo do editor — `M`
- [ ] Testar critério de aceite 4: resolução do PNG exportado — `S`
- [ ] Testar critério de aceite 5 e 6: configurador de miolo — `S`
- [ ] Testar critério de aceite 7: preview 3D + swipe — `S`
- [ ] Testar critério de aceite 8: fluxo completo com webhook — `L`
- [ ] Testar fluxo de pagamento em ambiente sandbox do Asaas — `M`
- [ ] Teste de carga: simular 10 usuários simultâneos no editor — `M`

### Deploy e Configuração de Produção
- [ ] Criar projeto no Vercel e vincular ao repositório — `S`
- [ ] Configurar todas as variáveis de ambiente no Vercel — `S`
  - `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`
  - `ASAAS_API_KEY`, `RESEND_API_KEY`, `WEBHOOK_SECRET`
- [ ] Executar migration de produção (`prisma migrate deploy`) — `S`
- [ ] Executar seed em produção (MioloTypes, SpiralColors, Templates iniciais) — `S`
- [ ] Configurar domínio customizado no Vercel — `S`
- [ ] Registrar URL do webhook no painel do Asaas (produção) — `S`
- [ ] Smoke test em produção: testar critérios de aceite 1–8 — `L`
- [ ] Configurar monitoramento de erros (Sentry ou similar) — `M`
- [ ] Configurar analytics (Vercel Analytics ou Posthog) — `S`

---

## Backlog — Melhorias Futuras

> Itens fora do escopo do MVP mas desejáveis para versões futuras.

### Funcionalidades
- [ ] Suporte a múltiplos itens de texto na capa (tagline, cargo, etc.) — `M`
- [ ] Stickers / elementos decorativos opcionais na capa — `L`
- [ ] Personalização de páginas internas (nome no rodapé de cada página) — `L`
- [ ] Pedidos em lote com quantidade e desconto por volume — `L`
- [ ] Sistema de cupom de desconto — `M`
- [ ] Pagamento via cartão de crédito (parcelado) — `L`
- [ ] Cálculo automático de frete via API dos Correios — `L`
- [ ] Compartilhamento de design via link público — `M`
- [ ] Notificações push (status do pedido) — `M`
- [ ] Login social (Google, Facebook) — `S`
- [ ] Salvamento automático do canvas (autosave) — `M`

### Admin e Operações
- [ ] Dashboard com métricas: pedidos/dia, receita, templates mais usados — `L`
- [ ] Exportação de relatório de pedidos em CSV/Excel — `M`
- [ ] Integração com sistema de etiquetas de envio — `L`
- [ ] Notificações para admin via e-mail ao receber novo pedido — `S`
- [ ] Área de afiliados / revendedores com comissão — `L`

### Performance e Infraestrutura
- [ ] CDN para assets estáticos e imagens de templates — `M`
- [ ] Cache Redis para queries frequentes do tRPC — `M`
- [ ] Filas de processamento para exportação PNG assíncrona (jobs pesados) — `L`
- [ ] Testes automatizados E2E com Playwright — `L`
- [ ] CI/CD com GitHub Actions (lint, type-check, testes) — `M`

---

*Documento gerado em Março 2026. Atualizar checkboxes conforme tarefas são concluídas.*
