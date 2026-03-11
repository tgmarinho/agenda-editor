# Plano de Implementação — Sprint 2: Editor de Capa (Fabric.js)

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completar o editor de capa com catálogo funcional, persistência de estado, upload de logo para Supabase, controles (undo/redo, zoom, camadas), salvamento de design via tRPC e indicador das 4 etapas do fluxo.

**Architecture:** O editor já existe em `src/features/editor/` com hooks (use-editor, use-history, use-font-loader, etc.) e componentes (Editor, Navbar, Sidebar, TextSidebar, ImageSidebar). A página de templates em `src/app/(public)/templates/page.tsx` já tem grid, filtro e link para `/editor/[templateSlug]`. Este plano adiciona: (1) persistência do canvas em store/localStorage, (2) validação e upload do logo no Supabase Storage, (3) integração do useHistory na UI e atalhos, (4) zoom, camadas e Delete, (5) salvar design (tRPC + exportImageUrl no Storage), (6) stepper das 4 etapas e botão "Próximo" condicional.

**Tech Stack:** Next.js 15, Fabric.js, tRPC, Prisma, Supabase (Auth + Storage), Zustand, shadcn/ui.

---

## Estado atual (já implementado)

- **Catálogo:** `src/app/(public)/templates/page.tsx` — listagem com `template.list`, filtro por categoria, `TemplateGrid` + `TemplateCard` com link para `/editor/${template.slug}`.
- **Editor:** `src/app/(public)/editor/[templateSlug]/page.tsx` — carrega template pelo slug (Prisma), passa para `<Editor template={...} />`.
- **Editor (feature):** Canvas com template de fundo, texto "Agenda" + ano + "Seu Nome", `addLogo(imageUrl)`, `addText()`, `deleteSelected`, `updateNameText/Font/Color/Size`, `exportHighRes()`.
- **ImageSidebar:** input file, resize client-side (max 2000px), passa dataURL para `onLogoUpload` — sem validação de tipo/tamanho e sem upload no Supabase.
- **use-history:** implementado mas não usado no Editor.
- **design.save:** tRPC com `saveDesignSchema` (templateId, editorState, userImageUrl?, previewImageUrl?). Prisma `Design` tem `exportImageUrl`; validator não inclui `exportImageUrl`.

---

## Chunk 1: Persistência de estado do canvas e stepper

### Task 1.1: Persistir canvas JSON no store e restaurar do localStorage

**Arquivos:**
- Modificar: `src/features/editor/hooks/use-editor.ts`
- Modificar: `src/features/editor/components/editor.tsx` (se precisar passar templateId para chave do localStorage)

**Objetivo:** A cada alteração relevante no canvas (object:modified, object:added, object:removed), serializar `canvas.toJSON()` e guardar em localStorage (chave ex: `agenda-editor-state-${templateId}`). Na inicialização do canvas, após carregar o template, verificar se existe estado salvo; se existir, usar `canvas.loadFromJSON()` (preservando backgroundImage do template) e restaurar objetos editáveis.

- [ ] **Step 1:** Em `use-editor.ts`, após criar o canvas e definir o background, registrar listeners para `object:modified`, `object:added`, `object:removed`. No handler, fazer `localStorage.setItem(\`agenda-editor-state-${template.id}\`, JSON.stringify(canvas.toJSON()))` (debounce 300–500 ms para não escrever a cada movimento).

- [ ] **Step 2:** Na mesma inicialização, antes de adicionar os textos padrão ("Agenda", ano, "Seu Nome"), verificar `localStorage.getItem(\`agenda-editor-state-${template.id}\`)`. Se existir, fazer `canvas.loadFromJSON(parsed, () => { canvas.renderAll(); })` e pular a criação dos textos padrão. Garantir que o background do template seja reaplicado após loadFromJSON se o JSON não o contiver (ou salvar apenas objetos, não o background). Documentação Fabric: ao usar `loadFromJSON` com objetos apenas, o background pode ser setado antes. Implementar: salvar apenas `canvas.toJSON(['selectable','evented'])` ou equivalente para não sobrescrever dimensões; ao restaurar, manter width/height e background já setados.

- [ ] **Step 3:** Retornar do hook uma função `clearLocalState(templateId?)` opcional para limpar ao "começar de novo", se desejar. (Opcional para MVP.)

- [ ] **Step 4:** Testar: abrir editor, mover texto, recarregar página — estado deve voltar.

**Nota:** Se `toJSON()` incluir o background e ao restaurar o template sumir, usar abordagem: salvar só os objetos (get('objects')) em um JSON customizado e na restauração aplicar apenas os objetos sobre o canvas já com background. Ver API Fabric.js `canvas.toJSON()` com propriedades excluídas.

### Task 1.2: Indicador das 4 etapas no topo do editor

**Arquivos:**
- Criar: `src/features/editor/components/step-indicator.tsx`
- Modificar: `src/features/editor/components/editor.tsx`
- Modificar: `src/features/editor/components/navbar.tsx` (ou colocar o stepper entre Navbar e o conteúdo)

**Objetivo:** Exibir um stepper horizontal: 1. Capa | 2. Miolo | 3. Preview | 4. Checkout. Etapa 1 ativa (destacada), demais desabilitadas ou apenas visuais.

- [ ] **Step 1:** Criar `StepIndicator` com quatro etapas. Receber prop `currentStep: 1 | 2 | 3 | 4` (default 1). Usar ícones ou números + labels. Estilo: etapa atual em destaque, concluídas com check (quando houver fluxo completo).

- [ ] **Step 2:** Incluir `<StepIndicator currentStep={1} />` no layout do Editor (acima ou dentro da Navbar, conforme layout atual).

- [ ] **Step 3:** Commit: "feat(editor): add 4-step progress indicator"

---

## Chunk 2: Upload de logo — validação, Supabase Storage e remoção

### Task 2.1: Validação de arquivo (tipo e tamanho 5MB)

**Arquivos:**
- Modificar: `src/features/editor/components/image-sidebar.tsx`

**Objetivo:** Aceitar apenas PNG, JPG/JPEG, SVG; tamanho máximo 5MB. Mostrar toast de erro (ex.: sonner) se inválido.

- [ ] **Step 1:** Definir constantes: `ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml']`, `MAX_SIZE_BYTES = 5 * 1024 * 1024`.

- [ ] **Step 2:** No `handleFileChange`, antes do FileReader: se `!ALLOWED_TYPES.includes(file.type)` ou `file.size > MAX_SIZE_BYTES`, exibir toast (ex.: "Use PNG, JPG ou SVG. Máximo 5MB.") e return.

- [ ] **Step 3:** Ajustar o `<input accept="...">` para `accept="image/png,image/jpeg,image/svg+xml"`.

- [ ] **Step 4:** Commit: "feat(editor): validate logo file type and size (5MB)"

### Task 2.2: Upload do logo para Supabase Storage e uso da URL

**Arquivos:**
- Criar: `src/lib/supabase/upload-logo.ts` (ou função em `src/lib/supabase/storage.ts`)
- Modificar: `src/features/editor/components/image-sidebar.tsx`
- Verificar: bucket no Supabase (ex.: `logos` ou `uploads`) criado e políticas de upload (anon ou autenticado conforme projeto)

**Objetivo:** Após validação, fazer upload do arquivo para o Supabase Storage, obter URL pública (ou signed) e passar essa URL para `onLogoUpload(url: string)` em vez de dataURL. O hook `use-editor` já chama `fabric.Image.fromURL(imageUrl)` — deve continuar funcionando.

- [ ] **Step 1:** Criar função `uploadLogo(file: File): Promise<string>` que: gera um nome único (ex.: `uuid()` ou `Date.now()-${file.name}`), usa `supabase.storage.from('logos').upload(path, file, { upsert: true })`, obtém URL pública com `getPublicUrl` ou `createSignedUrl` conforme configuração do projeto, retorna a URL.

- [ ] **Step 2:** Em `ImageSidebar`, após validação, em vez de ler como dataURL e chamar `onLogoUpload(dataUrl)`, chamar `uploadLogo(file)` e depois `onLogoUpload(url)` em caso de sucesso. Manter loading state (desabilitar botão / spinner) durante upload. Em erro, toast com mensagem.

- [ ] **Step 3:** Se o bucket exigir autenticação, garantir que o cliente Supabase está logado ou usar service role em uma API route que faça o upload (alternativa: criar `POST /api/upload-logo` que recebe FormData e chama Supabase server-side). Para MVP, se o bucket for público para upload anon, manter no client.

- [ ] **Step 4:** Commit: "feat(editor): upload logo to Supabase Storage and use URL in canvas"

### Task 2.3: Botão remover logo do canvas

**Arquivos:**
- Modificar: `src/features/editor/hooks/use-editor.ts` — expor `removeLogo` ou reutilizar lógica de remoção do objeto de logo.
- Modificar: `src/features/editor/components/editor.tsx` — passar callback para Sidebar/ImageSidebar.
- Modificar: `src/features/editor/components/image-sidebar.tsx` — botão "Remover logo" que chama o callback e limpa preview.
- Modificar: `src/features/editor/components/sidebar.tsx` — repassar prop para ImageSidebar.

**Objetivo:** Remover o objeto de logo do canvas e limpar o estado (logoObject). O ImageSidebar já tem "Remover" que limpa preview; deve também remover o objeto do canvas.

- [ ] **Step 1:** Em `use-editor.ts`, adicionar `removeLogo = useCallback(() => { if (logoObject) { canvas?.remove(logoObject); setLogoObject(null); canvas?.renderAll(); } }, [canvas, logoObject])` e retornar no objeto.

- [ ] **Step 2:** No Editor, passar `onRemoveLogo={removeLogo}` para Sidebar; Sidebar para ImageSidebar. No ImageSidebar, ao clicar em "Remover", chamar `onRemoveLogo?.()` e `handleRemove()` (limpar preview e input).

- [ ] **Step 3:** Commit: "feat(editor): button to remove logo from canvas"

---

## Chunk 3: Texto do nome — negrito e itálico

**Arquivos:**
- Modificar: `src/features/editor/hooks/use-editor.ts` — expor `updateNameFontStyle(weight: string, style: string)` ou dois callbacks.
- Modificar: `src/features/editor/components/text-sidebar.tsx` — controles de negrito e itálico (toggle buttons).
- Modificar: `src/features/editor/components/sidebar.tsx` e `src/features/editor/components/editor.tsx` — passar props.

**Objetivo:** Permitir negrito e itálico no texto do nome (objeto IText). Fabric IText usa `fontWeight` e `fontStyle`.

- [ ] **Step 1:** No hook, adicionar `updateNameFontWeight = (w: string) => nameObject?.set('fontWeight', w)` e `updateNameFontStyle = (s: string) => nameObject?.set('fontStyle', s)` (ou um único `updateNameFontStyle({ fontWeight?, fontStyle? })`). Retornar do hook.

- [ ] **Step 2:** No TextSidebar, adicionar dois toggles (ex.: Bold e Italic) que alternam entre normal/bold e normal/italic e chamam os callbacks. Sincronizar estado dos toggles com o objeto selecionado (quando seleção for o nameObject, mostrar estado atual).

- [ ] **Step 3:** Commit: "feat(editor): bold and italic for name text"

---

## Chunk 4: Controles gerais — Undo/Redo, Zoom, Camadas, Delete

### Task 4.1: Integrar useHistory na UI e atalhos de teclado

**Arquivos:**
- Modificar: `src/features/editor/hooks/use-editor.ts` — retornar `canvas` estável para o useHistory (ou integrar useHistory dentro do use-editor e retornar undo, redo, canUndo, canRedo).
- Modificar: `src/features/editor/components/editor.tsx` — usar useHistory(canvas), passar undo/redo/canUndo/canRedo para Navbar.
- Modificar: `src/features/editor/components/navbar.tsx` — botões Desfazer e Refazer; registrar atalhos Ctrl+Z e Ctrl+Y no useEffect.

**Objetivo:** Histórico de undo/redo funcionando e visível na barra superior. useHistory já salva estado com `saveState`; é preciso chamar `saveState` antes de cada alteração relevante. Fabric permite escutar `object:modified`, `object:added`, `object:removed` e chamar `saveState()` após cada um (debounced). O useHistory atual salva estado manualmente; precisamos chamar saveState quando o canvas mudar.

- [ ] **Step 1:** No use-editor, após init do canvas, registrar em `object:modified`, `object:added`, `object:removed` um callback que chama uma ref/callback `onCanvasChange`. Expor essa ref ou receber no Editor um callback que será o `saveState` do useHistory. Alternativa: integrar useHistory dentro de use-editor: o hook use-editor recebe o canvas state e quando canvas existe, chama useHistory(canvas) e em object:modified/added/removed chama saveState(). Retornar { undo, redo, canUndo, canRedo } do use-editor.

- [ ] **Step 2:** Implementar: no use-editor, depois de `setCanvas(fabricCanvas)`, não temos acesso ao setState do useHistory. Melhor: no componente Editor, usar `useHistory(canvas)` onde `canvas` vem do useEditor. Quando `canvas` mudar, useHistory já usa esse canvas. Precisamos que useHistory seja chamado com o canvas atual e que saveState seja invocado nos eventos do canvas. Então: em use-editor, aceitar um callback opcional `onStateChange` ou registrar os eventos e chamar um callback que o Editor passa (saveState). No Editor: `const { canvas, ... } = useEditor(template); const { undo, redo, canUndo, canRedo, saveState } = useHistory(canvas); useEffect(() => { if (!canvas) return; const handler = () => saveState(); canvas.on('object:modified', handler); canvas.on('object:added', handler); canvas.on('object:removed', handler); return () => { canvas.off('object:modified', handler); ... }; }, [canvas, saveState]);`. Passar undo, redo, canUndo, canRedo para a Navbar.

- [ ] **Step 3:** Na Navbar, adicionar dois botões "Desfazer" e "Refazer" (ícones Lucide), desabilitados quando !canUndo e !canRedo, onClick chama undo() e redo(). Adicionar useEffect para keydown: e.ctrlKey && e.key === 'z' => undo(), e.ctrlKey && e.key === 'y' => redo(); e.preventDefault() para não conflitar com o browser.

- [ ] **Step 4:** Commit: "feat(editor): undo/redo in navbar and Ctrl+Z / Ctrl+Y"

### Task 4.2: Zoom no canvas

**Arquivos:**
- Modificar: `src/features/editor/hooks/use-editor.ts` — expor `zoomIn`, `zoomOut`, `zoomReset` e talvez `zoomLevel` (state) para exibir na UI.
- Modificar: `src/features/editor/components/navbar.tsx` ou barra ao lado do canvas — botões + / - e opcionalmente "100%".

**Objetivo:** Aumentar/diminuir zoom do viewport (Fabric permite setZoom e renderAll). Manter zoom no estado do hook; aplicar no canvas quando houver.

- [ ] **Step 1:** No use-editor, adicionar state `zoomLevel = 1`. `zoomIn` => zoomLevel *= 1.2 (max 3), `zoomOut` => zoomLevel /= 1.2 (min 0.25), `zoomReset` => zoomLevel = 1. Aplicar com `canvas.setZoom(zoomLevel)` e `canvas.renderAll()`. Retornar zoomIn, zoomOut, zoomReset, zoomLevel.

- [ ] **Step 2:** Na Navbar (ou em um toolbar ao lado do canvas), botões "-" e "+" e opcionalmente label "100%". Chamar zoomOut, zoomIn, zoomReset.

- [ ] **Step 3:** Commit: "feat(editor): zoom in/out and reset"

### Task 4.3: Ordem de camadas e tecla Delete

**Arquivos:**
- Modificar: `src/features/editor/hooks/use-editor.ts` — expor `bringToFront`, `sendToBack` (ou bringForward/sendBackward).
- Modificar: `src/features/editor/components/sidebar.tsx` ou toolbar — botões "Trazer para frente" / "Enviar para trás".
- Modificar: `src/features/editor/components/editor.tsx` — listener keydown para tecla Delete/Backspace chamar deleteSelected.

**Objetivo:** Trazer objeto selecionado para frente e enviar para trás. Garantir que Delete remove o objeto selecionado (já existe deleteSelected; só garantir que a tecla está ligada).

- [ ] **Step 1:** No use-editor: `bringToFront = () => { const o = canvas?.getActiveObject(); o && canvas?.bringObjectToFront(o); canvas?.renderAll(); }`, `sendToBack = () => { const o = canvas?.getActiveObject(); o && canvas?.sendObjectToBack(o); canvas?.renderAll(); }`. Retornar do hook.

- [ ] **Step 2:** Na Sidebar (aba texto ou uma aba "Camadas"), dois botões que chamam bringToFront e sendToBack. Desabilitar quando não houver seleção.

- [ ] **Step 3:** No Editor, useEffect com keydown: se key === 'Delete' ou key === 'Backspace', evitar default e chamar deleteSelected (se houver objeto ativo). Cuidado para não disparar em inputs de texto; verificar se o target não é input/textarea.

- [ ] **Step 4:** Commit: "feat(editor): layer order and Delete key"

---

## Chunk 5: Salvamento de design e export para Storage

### Task 5.1: Incluir exportImageUrl no validator e no fluxo de save

**Arquivos:**
- Modificar: `src/lib/validators.ts` — adicionar `exportImageUrl: z.string().url().optional()` em saveDesignSchema.
- Modificar: `src/server/routers/design.ts` — garantir que create/update aceitam exportImageUrl no input (Prisma já tem o campo).

**Objetivo:** Poder salvar a URL da capa exportada (PNG no Storage) no Design.

- [ ] **Step 1:** Em validators, em saveDesignSchema, adicionar `exportImageUrl: z.string().url().optional()`.

- [ ] **Step 2:** Verificar se Prisma create/update já aceitam esse campo (Design tem exportImageUrl). Se o input for tipado pelo schema, o tRPC já repassa. Commit: "chore: add exportImageUrl to saveDesignSchema"

### Task 5.2: Upload do PNG exportado para Supabase Storage

**Arquivos:**
- Criar ou modificar: `src/lib/supabase/upload-export.ts` ou usar mesmo módulo de upload — função que recebe dataURL ou Blob do PNG e faz upload (path ex.: `exports/${designId ou uuid}.png`).
- Modificar: `src/features/editor/components/editor.tsx` ou hook — ao salvar design, primeiro exportar PNG (getPreviewDataUrl ou exportHighRes em memória), converter para Blob, upload, obter URL, então chamar design.save com exportImageUrl.

**Objetivo:** Ao clicar "Salvar Design", gerar PNG em alta res (2480×3508), fazer upload para o bucket (ex.: `exports` ou `designs`), obter URL e incluir no payload de design.save.

- [ ] **Step 1:** Criar `uploadExportPng(blob: Blob, filename: string): Promise<string>`. Usar `dataUrlToBlob` de editor/utils se for passar dataURL. Bucket ex.: `exports` ou `designs`. Retornar URL pública.

- [ ] **Step 2:** No fluxo de salvar (ver Task 5.3): obter dataURL do canvas em alta res (exportHighRes retorna dataUrl; ou criar getExportDataUrl que não faz download). Converter para Blob, upload, pegar URL. Incluir em design.save como exportImageUrl.

- [ ] **Step 3:** Commit: "feat(editor): upload exported PNG to Supabase Storage"

### Task 5.3: Botão "Salvar Design" e chamada tRPC

**Arquivos:**
- Modificar: `src/features/editor/hooks/use-editor.ts` — expor `getEditorState(): object` (canvas.toJSON()) e `getExportDataUrl(): string | null` (toDataURL em alta res sem download).
- Modificar: `src/features/editor/components/navbar.tsx` — botão "Salvar Design"; ao clicar, chamar mutation design.save com templateId, editorState, userImageUrl (se houver logo), previewImageUrl (opcional), exportImageUrl (após upload do PNG). Se design.save retornar design com id, guardar em state ou contexto para uso no "Próximo" (redirecionar para /configurar/[designId]).
- Modificar: `src/features/editor/components/editor.tsx` — estado para designId após salvar; passar onSave e designId para Navbar. Implementar: 1) export PNG → upload → URL; 2) design.save({ templateId, editorState: canvas.toJSON(), userImageUrl: urlDoLogoOuUndefined, exportImageUrl: urlExport }); 3) em sucesso, setDesignId(res.id) e toast "Design salvo".

**Objetivo:** Um clique em "Salvar Design" persiste o design no banco e a arte no Storage, e deixa pronto para ir para a etapa 2.

- [ ] **Step 1:** use-editor: retornar `getEditorState: () => canvas?.toJSON() ?? null` e `getExportDataUrl: () => canvas ? canvas.toDataURL(generateExportOptions()) : null`. Manter exportHighRes para download; getExportDataUrl só retorna a string para upload.

- [ ] **Step 2:** No Editor, estado `savedDesignId: string | null`. Navbar recebe onSave (callback) e savedDesignId. onSave: 1) getExportDataUrl() → blob → uploadExportPng → exportImageUrl; 2) trpc.design.save.mutate({ templateId, editorState: getEditorState(), userImageUrl, exportImageUrl }); 3) em sucesso, setSavedDesignId(data.id) e toast. userImageUrl: se temos logoObject ou URL do logo salva no state, usar (precisa guardar a URL do logo no state quando faz upload no ImageSidebar — pode ser passada de volta ou guardada no Editor).

- [ ] **Step 3:** Garantir que userImageUrl seja a URL do Supabase do logo (quando o usuário fez upload). No ImageSidebar, após upload bem-sucedido, podemos passar a URL para o parent ou guardar em um state/contexto no Editor. Opção simples: no Editor, state `logoUrl: string | null`; ImageSidebar recebe onLogoUpload(url) e o callback no Editor faz setLogoUrl(url) e addLogo(url). Ao salvar, usar logoUrl como userImageUrl.

- [ ] **Step 4:** Commit: "feat(editor): save design via tRPC with export PNG to Storage"

### Task 5.4: Botão "Próximo" e redirecionamento

**Arquivos:**
- Modificar: `src/features/editor/components/navbar.tsx` — botão "Próximo" (ou "Continuar") que só está habilitado quando: template selecionado (sempre true na página do editor) e nome preenchido (nome !== "Seu Nome" ou verificar se o IText do nome tem texto não vazio). Ao clicar: se savedDesignId existe, redirecionar para `/configurar/${savedDesignId}`; senão, primeiro chamar onSave e depois redirecionar com o id retornado (ou desabilitar "Próximo" até ter salvo uma vez).

**Objetivo:** Botão "Próximo" leva à etapa 2 (configurador do miolo). Habilitar apenas quando nome estiver preenchido (e idealmente design salvo).

- [ ] **Step 1:** Navbar recebe: canGoNext: boolean (nome preenchido), savedDesignId: string | null, onSave: () => Promise<string | null>. Botão "Próximo": desabilitado se !canGoNext. Se habilitado, ao clicar: se savedDesignId, router.push(\`/configurar/${savedDesignId}\`); senão, chamar onSave(), então router.push(\`/configurar/${id}\`) se id.

- [ ] **Step 2:** No Editor, canGoNext = nome do nameObject !== 'Seu Nome' e trim !== ''. Precisar de um state que reflita o texto atual do nome (atualizado em object:modified ou quando updateNameText é chamado). use-editor pode expor `nameText: string` (ler de nameObject.get('text')) e o Editor passa para Navbar como canGoNext = nameText !== 'Seu Nome' && nameText.trim() !== ''.

- [ ] **Step 3:** use-editor: state local nameTextValue, atualizado quando nameObject muda (object:modified) ou no updateNameText. Retornar nameTextValue. Editor: canGoNext = nameTextValue !== 'Seu Nome' && nameTextValue.trim() !== ''.

- [ ] **Step 4:** Commit: "feat(editor): Next button to configurator with validation"

---

## Chunk 6: Testes e critérios de aceite Sprint 2

- [ ] **Step 1:** Testar critério de aceite 3 (TASKS.md): selecionar template, upload de logo (arrastar/redimensionar), digitar nome, mudar fonte/cor/posição — tudo funcionando.

- [ ] **Step 2:** Testar critério de aceite 4: exportar PNG e verificar resolução 2480×3508 (propriedades do arquivo ou abrir em editor de imagem).

- [ ] **Step 3:** Atualizar TASKS.md marcando como concluídos os itens do Sprint 2 que foram implementados.

- [ ] **Step 4:** Commit: "chore: mark Sprint 2 tasks done in TASKS.md"

---

## Resumo de arquivos

| Ação   | Caminho |
|--------|--------|
| Criar  | `src/features/editor/components/step-indicator.tsx` |
| Criar  | `src/lib/supabase/upload-logo.ts` (ou `storage.ts`) |
| Criar  | `src/lib/supabase/upload-export.ts` (ou mesmo módulo) |
| Modificar | `src/features/editor/hooks/use-editor.ts` |
| Modificar | `src/features/editor/components/editor.tsx` |
| Modificar | `src/features/editor/components/navbar.tsx` |
| Modificar | `src/features/editor/components/sidebar.tsx` |
| Modificar | `src/features/editor/components/text-sidebar.tsx` |
| Modificar | `src/features/editor/components/image-sidebar.tsx` |
| Modificar | `src/lib/validators.ts` |
| Modificar | `docs/TASKS.md` |

---

## Dependências e referências

- **Fabric.js:** `canvas.toJSON()`, `loadFromJSON()`, `toDataURL()`, `setZoom()`, `bringObjectToFront()`, `sendObjectToBack()`, eventos `object:modified`, `object:added`, `object:removed`.
- **Supabase Storage:** Buckets `logos` e `exports` (ou nomes definidos no projeto); políticas de upload (público anon ou autenticado).
- **tRPC:** `design.save` mutation com input do saveDesignSchema (templateId, editorState, userImageUrl?, previewImageUrl?, exportImageUrl?).
- **Docs:** `docs/TASKS.md` (Sprint 2), `docs/AGENDA_EDITOR_PLAN.md`, `docs/PRD.md`.

---

*Plano salvo em 2026-03-11. Executar com subagent-driven-development ou executing-plans.*
