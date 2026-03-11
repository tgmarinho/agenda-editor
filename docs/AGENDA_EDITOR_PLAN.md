# Editor de Capas de Agenda Personalizadas

## Contexto

Construir um sistema web estilo "Canva simplificado" focado em vender agendas personalizadas. O cliente escolhe um template, faz upload de logo/imagem, digita seu nome, posiciona livremente os elementos, ve o preview em tempo real e finaliza a compra.

### Tipos de Template (baseado nos exemplos reais)
- **Femininas:** Floral (rosas, marsalla, azul), Delicadeza, Red Roses
- **Masculinas:** Minimalista, Classica (verde), Mapa Mundi, Marmoraria
- **Profissionais:** Juridica (azul/preta), com logo da profissao
- **Elegantes:** Fundo preto com dourado, ornamentos nos cantos

### O que o cliente personaliza:

**Capa (editor Fabric.js):**
- **Nome** - em fonte decorativa/script, posicao livre (drag)
- **Logo/imagem** - upload da profissao ou pessoal, posicao e tamanho livres (drag + resize)
- **Fonte e cor** do nome

**Miolo (configurador com selects/radio buttons):**
- **Tipo de miolo:** Comercial | Classica | Juridica
- **Dias por pagina:** 1DPP (1 dia por pagina) | 2DPP (2 dias por pagina)
- **Posicao do calendario:** Lateral (vertical na borda) | Rodape (horizontal embaixo)
- **Cor das folhas/linhas/escritas:** opcoes por tipo de miolo
  - Comercial: cinza
  - Classica: azul, amarelo, cinza, verde
  - Juridica: azul, cinza, verde
- **Cor do espiral:** opcoes pre-definidas (prata, dourado, preto, branco, rosa, etc.)

### O que e fixo no template:
- Imagem de fundo da capa (texturas, flores, marmore)
- Ornamentos decorativos (folhas, molduras, cantos)
- "Agenda 2026" (texto fixo do template)

### Conteudo fixo do miolo (todas as agendas incluem):
- Pagina de abertura
- Dados pessoais / Dados comerciais / Saude
- Calendarios 2025, 2026 e 2027
- Contatos importantes
- Senhas e logins
- Objetivos e metas para 2026
- Planejamento anual
- Divisoria mensal + Calendario de visao mensal
- Prioridades do mes + Datas importantes + Anotacoes
- (Juridica) Audiencias com campos: Hora, Vara, Autor, Reu, Processo, Telefone

---

## Stack Tecnologica

| Categoria | Tecnologia |
|-----------|-----------|
| Framework | Next.js 14+ (App Router, TypeScript) |
| Canvas | **Fabric.js** (melhor texto, padrao para editores de design, export SVG+PNG) |
| UI | Tailwind CSS + shadcn/ui |
| Estado | Zustand |
| Backend | tRPC + Prisma |
| Banco | PostgreSQL (Supabase) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Pagamento | Asaas (Pix) |
| Email | Resend |
| Export | Fabric.js `toDataURL()` / `toSVG()` + jsPDF |
| Deploy | Vercel |

### Por que Fabric.js (e nao Konva, PixiJS ou Three.js)

- **Fabric.js**: Melhor renderizacao de texto (protagonista nas agendas), padrao da industria para editores Canva-like, export SVG+PNG, objetos compostos com `Group`, filtros de imagem. Integra com React via wrapper.
- **Konva.js**: Boa performance e react-konva nativo, mas texto mais basico. Seria 2a opcao.
- **PixiJS**: Motor WebGL para jogos/animacoes. Overkill, texto inferior para impressao.
- **Three.js**: 3D. As agendas sao 100% 2D, nao faz sentido.

### Referencia: github.com/Davronov-Alimardon/canva-clone

Projeto Next.js 14 + Fabric.js 5.3 com editor completo. Usaremos como referencia de arquitetura.

**Reutilizar padroes (adaptar para nosso caso):**
- `useEditor()` hook - wrapper React/Fabric.js (canvas init, dispose, object management)
- `useHistory` hook - undo/redo com `canvasHistory` ref
- `useCanvasEvents` hook - listeners de selection:created/updated/cleared
- `useClipboard` hook - copiar/colar objetos
- `useAutoResize` hook - responsive canvas com ResizeObserver
- Workspace clipping pattern - retangulo "clip" define area da capa
- Export via `canvas.toDataURL()` com viewport reset + restauracao
- `generateSaveOptions()` - calcula bounds do workspace para export
- `downloadFile()` helper - cria anchor element para download
- Toolbar contextual baseada em `selectedObjects[0].type`
- Debounced auto-save (500ms) para salvar estado no banco
- `canvas.loadFromJSON()` / `canvas.toJSON()` para serializar/deserializar designs

**Simplificar (remover do nosso projeto):**
- Shapes sidebar (circulo, retangulo, triangulo) - nao precisamos
- Draw mode - nao precisamos
- AI features (Replicate) - nao precisamos
- Unsplash integration - nao precisamos
- Filter sidebar - nao precisamos
- RemoveBg sidebar - nao precisamos
- Stripe subscription - trocamos por Asaas (Pix)
- UploadThing - trocamos por Supabase Storage
- Hono backend - trocamos por tRPC
- Drizzle ORM - trocamos por Prisma
- NextAuth - trocamos por Supabase Auth
- Neon DB - trocamos por Supabase PostgreSQL

**Adicionar (nao tem no clone):**
- Google Fonts decorativas (clone usa so system fonts - precisamos Great Vibes, Dancing Script, etc.)
- Hook `useFontLoader` com FontFace API
- Templates com posicoes sugeridas por zona (nome, logo)
- Fluxo de checkout com Pix (Asaas)
- Painel admin de pedidos + download arquivo de producao
- Email de confirmacao (Resend)

---

## Arquitetura do Editor

```
+--------------------------------------------------+
|                  EditorPage                       |
|  +------------+  +---------------------------+   |
|  | SidePanel  |  |     CanvasPreview         |   |
|  |            |  |     (Fabric.js Canvas)     |   |
|  | - Upload   |  |  +---------------------+   |   |
|  | - Texto    |  |  | Template (fundo)    |   |   |
|  | - Fontes   |  |  |  +------+           |   |   |
|  | - Cores    |  |  |  | Logo | <- drag   |   |   |
|  |            |  |  |  +------+   resize  |   |   |
|  |            |  |  |  "Karen Viegas" <-drag|   |   |
|  |            |  |  +---------------------+   |   |
|  +------------+  +---------------------------+   |
|  [ Salvar ]  [ Preview PDF ]  [ Comprar R$XX ]   |
+--------------------------------------------------+
```

**Camadas no Fabric.js Canvas:**
1. `fabric.Image` - template de fundo (locked, nao selecionavel)
2. `fabric.Image` - logo/imagem do usuario (draggable, resizable, rotatable)
3. `fabric.IText` - nome do usuario (draggable, editavel inline, font/color customizavel)

**Interacao:** Todos os elementos do usuario sao livres para arrastar e posicionar onde quiser no canvas. O template define uma posicao sugerida inicial, mas o cliente tem liberdade total.

### Fluxo do Pedido (4 etapas)

```
Etapa 1: EDITOR DA CAPA (Fabric.js Canvas)
  -> Escolher template -> Upload logo -> Digitar nome -> Preview

Etapa 2: CONFIGURADOR DO MIOLO (Form com selects/radios)
  -> Tipo de miolo (Comercial/Classica/Juridica)
  -> 1DPP ou 2DPP
  -> Posicao do calendario (lateral/rodape)
  -> Cor das folhas/linhas
  -> Cor do espiral
  -> Preview com imagem de exemplo do miolo selecionado

Etapa 3: PREVIEW REALISTA (react-pageflip) - "wow moment"
  -> Sistema gera capa (PNG do Fabric.js) + paginas internas (cor aplicada)
  -> Cliente folheia a agenda como se fosse real
  -> Ve capa -> folha de rosto -> calendario -> primeiras paginas de dia
  -> Convencido? -> Botao "Comprar esta agenda"

Etapa 4: CHECKOUT
  -> Login/cadastro -> Endereco -> Pix -> Pedido confirmado
```

**Importante:** A grafica NAO tem miolos pre-prontos. Eles imprimem o miolo sob demanda conforme a cor e estilo que o cliente escolher. O sistema salva as opcoes e envia para producao.

---

## Fabric.js - Detalhes de Implementacao

### Inicializacao do Canvas
```typescript
// Carregar com dynamic import (sem SSR)
const canvas = new fabric.Canvas('editor-canvas', {
  width: containerWidth,
  height: containerHeight,
  preserveObjectStacking: true, // manter z-order
});

// Template como fundo (locked)
fabric.Image.fromURL(templateUrl, (img) => {
  img.scaleToWidth(canvas.width!);
  img.set({ selectable: false, evented: false });
  canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
});
```

### Texto do Nome
```typescript
const nameText = new fabric.IText('Seu Nome', {
  left: suggestedX,
  top: suggestedY,
  fontFamily: 'Great Vibes',
  fontSize: 48,
  fill: '#c8a960', // dourado padrao
  editable: true,   // duplo-clique para editar inline
});
canvas.add(nameText);
```

### Upload de Logo
```typescript
fabric.Image.fromURL(uploadedImageUrl, (img) => {
  img.scaleToWidth(150);
  img.set({ left: suggestedX, top: suggestedY });
  canvas.add(img);
  canvas.setActiveObject(img); // seleciona para mostrar handles
});
```

### Export Alta Resolucao
```typescript
const multiplier = ORIGINAL_WIDTH / canvas.getWidth();
const dataUrl = canvas.toDataURL({
  format: 'png',
  multiplier, // ex: 2480/600 = ~4.13x
  quality: 1,
});
```

---

## Sistema de Templates

- Imagens em alta resolucao (2480x3508px para A4 300dpi) no Supabase Storage
- Metadados no PostgreSQL: nome, slug, categoria, thumbnail, zonas sugeridas para logo/texto, preco
- Thumbnails para o catalogo (400x566px), imagem full para o editor
- Categorias: floral, minimalista, corporativo, juridico, elegante

### Modelo do Template
```typescript
interface AgendaTemplate {
  id: string;
  name: string;           // "Agenda Flor Marsalla"
  slug: string;           // "flor-marsalla"
  category: string;       // "feminina" | "masculina" | "profissional" | "elegante"
  thumbnailUrl: string;
  fullImageUrl: string;
  // Posicoes sugeridas (% do canvas) - ponto de partida para o cliente
  suggestedNamePosition: { x: number; y: number; fontSize: number; fontFamily: string; color: string };
  suggestedLogoPosition: { x: number; y: number; width: number };
  price: number;          // centavos
  isActive: boolean;
}
```

---

## Schema do Banco (Prisma)

- **User** - id, email, name, phone, authId (Supabase)
- **Template** - id, name, slug, category, thumbnailUrl, fullImageUrl, suggestedLayout (JSON), price, isActive, sortOrder
- **MioloType** - id, name (Comercial/Classica/Juridica), availableColors (JSON array), description
- **SpiralColor** - id, name, hexColor, isActive
- **Design** - id, userId, templateId, editorState (JSON), userImageUrl, previewImageUrl, exportImageUrl
- **AgendaConfig** - id, designId, mioloTypeId, daysPerPage (1|2), calendarPosition (lateral|footer), mioloColor, spiralColorId
- **Order** - id, userId, designId, agendaConfigId, addressId, status (enum), totalAmount, shippingAmount, paymentId, paymentMethod, paidAt, trackingCode
- **Address** - id, userId, street, number, complement, neighborhood, city, state, zipCode

**OrderStatus:** `PENDING_PAYMENT -> PAID -> IN_PRODUCTION -> SHIPPED -> DELIVERED`

### Seeds de referencia

**MioloType seeds:**
- Comercial  -> cores: [cinza]
- Classica   -> cores: [azul, amarelo, cinza, verde]
- Juridica   -> cores: [azul, cinza, verde]

**SpiralColor seeds:**
- Prata, Dourado, Preto, Branco, Rosa (+ outras cores disponiveis)

---

## Estrutura de Pastas

```
src/
+-- app/
|   +-- (public)/
|   |   +-- page.tsx                         # Landing page
|   |   +-- templates/page.tsx               # Catalogo de templates
|   |   +-- editor/[templateSlug]/page.tsx   # Pagina do editor (capa)
|   |   +-- configurar/[designId]/page.tsx   # Configurador do miolo (etapa 2)
|   +-- (auth)/login, register
|   +-- (dashboard)/meus-pedidos, meus-designs
|   +-- (admin)/pedidos, templates
|   +-- checkout/page.tsx, pagamento/page.tsx
|   +-- api/
|       +-- trpc/[trpc]/route.ts
|       +-- webhooks/asaas/route.ts
+-- features/
|   +-- editor/
|   |   +-- components/
|   |   |   +-- editor.tsx                   # Layout principal
|   |   |   +-- sidebar.tsx                  # Painel lateral
|   |   |   +-- toolbar.tsx                  # Contextual: texto props, imagem props
|   |   |   +-- navbar.tsx                   # Undo/redo, export, comprar
|   |   |   +-- text-sidebar.tsx             # Nome, fonte, cor, tamanho
|   |   |   +-- font-sidebar.tsx             # Google Fonts com preview
|   |   |   +-- image-sidebar.tsx            # Upload de logo
|   |   |   +-- fill-color-sidebar.tsx       # Color picker
|   |   |   +-- template-sidebar.tsx         # Trocar template
|   |   +-- hooks/
|   |   |   +-- use-editor.ts               # Core: wrapper Fabric.js
|   |   |   +-- use-history.ts              # Undo/redo
|   |   |   +-- use-canvas-events.ts        # Selection listeners
|   |   |   +-- use-clipboard.ts            # Copy/paste
|   |   |   +-- use-auto-resize.ts          # ResizeObserver
|   |   |   +-- use-font-loader.ts          # Google Fonts via FontFace API
|   |   +-- types.ts
|   |   +-- utils.ts
|   +-- agenda-config/
|   |   +-- components/
|   |   |   +-- config-page.tsx
|   |   |   +-- miolo-type-selector.tsx
|   |   |   +-- days-per-page-selector.tsx
|   |   |   +-- calendar-position-selector.tsx
|   |   |   +-- miolo-color-selector.tsx
|   |   |   +-- spiral-color-selector.tsx
|   |   |   +-- miolo-preview.tsx
|   |   +-- hooks/
|   |   |   +-- use-agenda-config.ts
|   |   +-- types.ts
|   +-- preview/
|       +-- components/
|       |   +-- flipbook-preview.tsx
|       |   +-- preview-modal.tsx
|       |   +-- page-renderer.tsx
|       +-- templates/
|       |   +-- page-1dpp-lateral.tsx
|       |   +-- page-1dpp-footer.tsx
|       |   +-- page-2dpp-lateral.tsx
|       |   +-- page-2dpp-footer.tsx
|       |   +-- front-page.tsx
|       |   +-- calendar-page.tsx
|       |   +-- personal-data-page.tsx
|       +-- hooks/
|       |   +-- use-preview-pages.ts
|       +-- utils.ts
+-- components/
|   +-- ui/                                  # shadcn/ui
|   +-- checkout/OrderSummary, AddressForm, PixPayment
|   +-- templates/TemplateCard, TemplateGrid
+-- server/
|   +-- routers/template.ts, design.ts, order.ts
|   +-- services/asaas.ts, email.ts
|   +-- trpc.ts
+-- lib/
|   +-- supabase/client.ts, server.ts
|   +-- prisma.ts
|   +-- fonts.ts
|   +-- validators.ts
+-- types/template.ts, order.ts
```

---

## Preview 3D - Folhear a Agenda (react-pageflip)

### Biblioteca: react-pageflip (StPageFlip)
- 668+ stars GitHub, zero dependencias, 37KB
- Animacao realista de virar paginas
- Suporte mobile com swipe/touch
- `dynamic(() => import('react-pageflip'), { ssr: false })`

### Sequencia de paginas no preview

```
[Capa personalizada]        <- export do Fabric.js canvas (PNG)
[Folha de rosto]            <- gerada com nome do cliente + estilo
[Dados pessoais]            <- template base com cor do miolo aplicada
[Calendario 2026]           <- gerado com cor do miolo
[Pagina Jan - dia 01]       <- template da folha com cor aplicada (1DPP ou 2DPP)
[Pagina Jan - dia 02]
[...]                       <- mais 3-4 paginas de exemplo (nao precisa 365)
[Contra-capa]               <- imagem fixa ou personalizada
```

---

## Dependencias (package.json)

```
Core:       next 14, react 18, typescript 5
Canvas:     fabric 5.3.0-browser
Estado:     zustand, @tanstack/react-query
UI:         tailwindcss, shadcn/ui (radix), lucide-react
Color:      react-color
Backend:    @trpc/server, @trpc/client, prisma, zod
Auth:       @supabase/supabase-js, @supabase/auth-helpers-nextjs
Upload:     @supabase/supabase-js (Storage)
Pagamento:  asaas (API REST via fetch)
Email:      resend
Flipbook:   react-pageflip (StPageFlip)
Preview:    html2canvas
Utils:      lodash.debounce, date-fns, uuid, sonner (toasts)
```

---

## Plano de Sprints (MVP ~5-6 semanas)

### Sprint 1 (Semana 1-2): Fundacao + Templates
- Setup projeto: `create-next-app`, Tailwind, shadcn/ui, Prisma, Supabase
- Schema do banco + migrations + seeds
- CRUD de templates (admin) com upload de imagens
- Landing page + catalogo de templates com filtro por categoria

### Sprint 2 (Semana 2-3): Editor da Capa (Fabric.js)
- Zustand store do editor
- Fabric.js canvas com template de fundo (locked)
- Upload de logo do usuario (drag, resize, rotate)
- Texto com `fabric.IText` (drag, edicao inline, fontes, cores)
- Hook `useFontLoader` para Google Fonts
- Posicoes sugeridas por template como ponto de partida

### Sprint 3 (Semana 3-4): Configurador do Miolo + Preview 3D
- Zustand store `useAgendaConfigStore`
- Pagina de configuracao com selectors visuais
- Templates HTML/SVG das paginas internas com variaveis de cor
- Renderizacao das paginas internas (html2canvas)
- Preview 3D flipbook (react-pageflip)
- Supabase Auth (login/registro)
- Salvar design + config no banco
- Export PNG alta res (multiplier para 2480x3508)

### Sprint 4 (Semana 5): Checkout + Admin
- Integracao Asaas (cobranca Pix + webhook)
- Checkout: resumo + endereco + pagamento
- Painel de pedidos do usuario
- Admin: lista pedidos, download capa, config do miolo
- Email de confirmacao (Resend)

### Sprint 5 (Semana 6): Polish + Deploy
- Responsividade mobile
- Testes e2e do fluxo completo
- Seeds de dados finais
- Deploy Vercel

---

## Custos de Infraestrutura (Estimativa Mensal)

| Servico | Plano | Custo/mes |
|---------|-------|-----------|
| Vercel | Pro | $20 |
| Supabase | Pro | $25 |
| Resend | Pro | $20 |
| Dominio | - | ~$1 |
| **Total Base** | | **~$66/mes (~R$330/mes)** |

---

## Desafios Tecnicos

| Desafio | Solucao |
|---------|---------|
| Fontes no Fabric.js | Hook `useFontLoader` com `FontFace` API, render apos `document.fonts.ready` |
| Performance mobile | Imagens menor resolucao para edicao, alta res so no export via `multiplier` |
| SSR + Fabric.js | `dynamic(() => import(...), { ssr: false })` |
| Upload grande | Redimensionar client-side antes do upload (canvas nativo, max 2000px) |
| Fidelidade export | `multiplier` do Fabric.js, testar com templates reais em resolucao de grafica |
| React + Fabric.js | Hook `useFabricCanvas` que gerencia ciclo de vida do canvas e sincroniza com Zustand |

---

## Verificacao (Criterios de Aceite)

1. Criar projeto e rodar `pnpm dev` - landing page abre
2. Subir 2-3 templates via admin e ver no catalogo com filtro por categoria
3. **Editor da capa:** selecionar template, upload logo (drag/resize), digitar nome, trocar fonte/cor, arrastar
4. Exportar PNG e verificar resolucao correta (2480x3508 para impressao)
5. **Configurador do miolo:** selecionar tipo Classica, 2DPP, calendario lateral, cor azul, espiral dourado
6. Trocar para Juridica - verificar que cores disponiveis mudam (azul, cinza, verde)
7. **Preview 3D:** clicar "Ver Preview", ver flipbook abrir com capa personalizada, folhear paginas. Swipe no mobile.
8. **Fluxo completo:** editor capa -> configurar miolo -> preview 3D -> checkout -> gerar Pix -> confirmar via webhook -> pedido aparece no admin
