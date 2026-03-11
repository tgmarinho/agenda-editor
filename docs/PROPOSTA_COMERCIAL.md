# PROPOSTA COMERCIAL
## Sistema de Personalização de Agendas Online

---

**Para:** [Nome do Cliente]
**De:** [Seu Nome / Empresa]
**Data:** Março de 2026
**Validade:** 15 dias

---

## Resumo Executivo

Desenvolvimento de uma plataforma web completa para venda de agendas personalizadas, onde o cliente final escolhe um template, faz upload do seu logo, digita seu nome e configura o miolo — tudo em um editor visual intuitivo, com preview 3D animado e pagamento via Pix.

---

## O que será entregue

### Etapa 1 — Editor da Capa (Fabric.js)

- Catálogo de templates com filtro por categoria (Feminina, Masculina, Profissional, Elegante)
- Editor visual drag-and-drop da capa:
  - Upload de logo/imagem pessoal (arrastar, redimensionar, rotacionar)
  - Campo de nome com posicionamento livre (arrastar)
  - Seleção de fonte (8 fontes decorativas do Google Fonts: Great Vibes, Dancing Script, Playfair Display, Lora, Montserrat, Raleway, Pacifico, Satisfy)
  - Seleção de cor do nome (paleta com presets + cor personalizada)
  - Controle de tamanho da fonte
- Posições sugeridas por template como ponto de partida
- Undo/Redo (desfazer/refazer ações)
- Auto-save do design no banco de dados
- Export da capa em alta resolução (2480×3508px — A4 300dpi)

---

### Etapa 2 — Configurador do Miolo

Formulário com seletores visuais para:

| Opção | Escolhas disponíveis |
|-------|---------------------|
| Tipo de miolo | Comercial / Clássica / Jurídica |
| Dias por página | 1DPP (1 dia por página) / 2DPP (2 dias por página) |
| Posição do calendário | Lateral / Rodapé |
| Cor das linhas/escritas | Varia por tipo (Comercial: cinza; Clássica: azul, amarelo, cinza, verde; Jurídica: azul, cinza, verde) |
| Cor do espiral | Prata, Dourado, Preto, Branco, Rosa |

- Preview estático do miolo atualiza em tempo real conforme as seleções
- Validação: cores disponíveis filtradas automaticamente pelo tipo de miolo

---

### Etapa 3 — Preview 3D (Flipbook)

- Visualização animada da agenda completa, simulando folhear real
- Sequência de páginas no preview:
  1. Capa personalizada (gerada do editor)
  2. Folha de rosto com nome do cliente
  3. Página de dados pessoais
  4. Calendário 2026 com cor do miolo aplicada
  5. 4–5 páginas de dias (no estilo configurado: 1DPP ou 2DPP)
- Suporte a swipe/toque no mobile
- Botão "Comprar esta agenda" dentro do preview

---

### Etapa 4 — Checkout e Pagamento

- Cadastro/login do cliente final (Supabase Auth)
- Formulário de endereço de entrega
- Resumo do pedido (miniatura da capa + configuração do miolo)
- Geração de QR Code Pix via Asaas
- Webhook de confirmação de pagamento automático
- Atualização automática de status do pedido

---

### Etapa 5 — Painel Administrativo

- Lista de todos os pedidos com filtro por status
- Visualização detalhada do pedido:
  - Preview da capa em alta resolução (download PNG 2480×3508px)
  - Configuração completa do miolo (tipo, DPP, posição calendário, cor, espiral)
- Gerenciamento de templates (cadastrar, ativar/desativar, reordenar)
- Cadastro de tipos de miolo e cores de espiral (seeds iniciais incluídos)

---

### Etapa 6 — Comunicação e Emails

- Email automático de confirmação de pedido ao cliente (Resend)
- Email com resumo do pedido para o administrador
- Status de pedido: `Aguardando Pagamento → Pago → Em Produção → Enviado → Entregue`

---

### Funcionalidades gerais

- Sistema responsivo (mobile-first)
- Deploy na Vercel com CI/CD automático
- Banco de dados PostgreSQL (Supabase)
- Upload de imagens do usuário no Supabase Storage (máx. 10MB, redimensionamento automático client-side)
- 30 dias de suporte pós-entrega (correção de bugs)

---

## O que NÃO está incluso neste escopo

> Qualquer funcionalidade abaixo pode ser contratada separadamente.

| Fora do escopo | Motivo |
|---------------|--------|
| Design e criação dos templates de capa | Os arquivos devem ser entregues pelo cliente (ver seção abaixo) |
| App mobile nativo (iOS/Android) | O sistema é web responsivo |
| Integração com transportadoras (Melhor Envio, Correios) | Cálculo de frete manual |
| Integração com WhatsApp (confirmações, alertas) | Apenas email incluso |
| Painel financeiro com relatórios de vendas | Dashboard básico de pedidos apenas |
| Sistema de cupons de desconto | Sprint futuro |
| Checkout com cartão de crédito | Apenas Pix incluso (Asaas) |
| Multi-tenancy (vários vendedores na mesma plataforma) | Sistema mono-tenant |
| SEO avançado para catálogo de templates | Estrutura básica de metadados inclusa |
| Testes automatizados (unitários/e2e) | Testes manuais do fluxo completo |

---

## Responsabilidades do Cliente

### Imagens dos Templates (CRÍTICO)

O sistema é desenvolvido para exibir os templates que o cliente fornecer. **Sem os templates, o sistema não tem conteúdo real para funcionar.**

**Especificação técnica obrigatória:**

| Tipo | Especificação |
|------|--------------|
| Formato | PNG com fundo (sem transparência) |
| Resolução | **2480 × 3508 pixels** (A4 em 300dpi — padrão gráfica) |
| Cor | RGB (não CMYK) |
| Tamanho máximo | 20MB por arquivo |
| Thumbnail | O sistema gera automaticamente a partir do arquivo original |

**Mínimo necessário para o go-live:** 4 templates (1 por categoria)
**Recomendado para lançamento:** 8–12 templates

> **Importante:** Os templates devem chegar **antes do início da Sprint 2** (semana 2), pois são necessários para desenvolver e testar o editor da capa. Atrasos na entrega dos arquivos impactam diretamente o prazo de entrega do sistema.

### Outras responsabilidades do cliente:

- Conta ativa no Asaas (sandbox para testes + produção)
- Domínio registrado (.com.br ou .com)
- Logo e identidade visual da plataforma (nome, cores, logotipo)
- Definição dos preços das agendas
- Definição das cores de espiral disponíveis (quais a gráfica trabalha)
- Aprovação dos templates de email de confirmação

---

## Investimento

| | Valor |
|--|-------|
| **Desenvolvimento (valor único)** | **R$ 38.000** |
| Infraestrutura mensal (recorrente) | ~R$ 330/mês |

### Forma de pagamento do desenvolvimento:

| Marco | % | Valor | Quando |
|-------|---|-------|--------|
| Entrada | 30% | R$ 11.400 | Assinatura do contrato |
| Entrega do editor de capa + catálogo | 30% | R$ 11.400 | Fim da semana 3 |
| Entrega do checkout + admin | 30% | R$ 11.400 | Fim da semana 5 |
| Go-live + aprovação final | 10% | R$ 3.800 | Deploy em produção |

### Custos de infraestrutura (pagos pelo cliente):

| Serviço | Plano | Custo/mês |
|---------|-------|-----------|
| Vercel (hospedagem) | Pro | ~R$ 100 |
| Supabase (banco + storage + auth) | Pro | ~R$ 125 |
| Resend (emails) | Pro | ~R$ 100 |
| Domínio | - | ~R$ 5 |
| **Total mensal** | | **~R$ 330** |

> Contas Asaas e Google Fonts são gratuitas (no volume inicial).

---

## Cronograma

| Semana | Entregas |
|--------|---------|
| 1–2 | Setup do projeto, banco de dados, catálogo de templates, painel admin de templates |
| 2–3 | Editor da capa (Fabric.js): drag, upload de logo, nome, fontes, cores |
| 3–4 | Configurador do miolo + preview 3D flipbook + autenticação |
| 5 | Checkout com Pix (Asaas) + painel admin de pedidos + emails |
| 6 | Responsividade mobile, testes do fluxo completo, deploy em produção |

**Prazo total estimado: 6 semanas** a partir da data de início e recebimento da entrada.

**Prazo para entrega dos templates pelo cliente: até o início da semana 2.**

---

## Garantias

- Código-fonte entregue ao cliente ao final do projeto
- 30 dias de suporte pós-entrega para correção de bugs
- Deploy incluído no prazo combinado
- Reunião semanal de alinhamento (30min via Google Meet)

---

## Próximos passos

1. Aprovação desta proposta
2. Assinatura de contrato
3. Pagamento da entrada (R$ 11.400)
4. Kick-off: definição das credenciais dos serviços, entrega dos templates
5. Início do desenvolvimento

---

*Proposta válida por 15 dias a partir da data de emissão.*
*Dúvidas? Entre em contato: [seu email] | [seu WhatsApp]*
