# Estimativa: Integração de Frete (Melhor Envio / Correios)

Documento para orçar a funcionalidade de **cálculo automático de frete** no checkout, substituindo o cálculo manual.

---

## Situação atual

- O pedido já possui `shippingAmount` (centavos) e `trackingCode` no banco.
- O endereço de entrega tem `zipCode` (CEP).
- No fluxo de pedido há **TODO: calculate shipping** — hoje o valor é fixo (ex.: 0).
- Não há tela de escolha de opções de frete; o valor é definido manualmente.

---

## Escopo da integração

### Opção A — Melhor Envio (recomendada)

**O que é:** Agregador que oferece cotação e compra de frete de várias transportadoras (Correios, Jadlog, Loggi, etc.) via uma única API. Gera etiqueta e rastreio.

| Entrega | Descrição |
|--------|-----------|
| **1. Cotação no checkout** | Ao informar CEP (ou endereço), chamar a API do Melhor Envio com CEP de origem (gráfica), CEP de destino, peso e dimensões da agenda. Exibir opções (ex.: PAC, SEDEX, Jadlog) com preço e prazo. |
| **2. Escolha do cliente** | Usuário seleciona uma opção de frete; o valor é salvo em `shippingAmount` e o total do pedido (produto + frete) é atualizado. |
| **3. Persistência** | Guardar no pedido: valor do frete, transportadora/serviço escolhido (para etiqueta depois). Pode exigir novo campo no banco (ex.: `shippingServiceId`, `shippingCarrier`). |
| **4. (Opcional) Etiqueta** | Após pagamento confirmado, chamar API do Melhor Envio para comprar o frete e gerar etiqueta; preencher `trackingCode` e disponibilizar PDF no admin. |

**Dados necessários no sistema:**

- CEP de origem (da gráfica) — configurável no admin ou em variável de ambiente.
- Peso e dimensões do produto “agenda” (único SKU ou por tipo de miolo, se variar).

**Custo Melhor Envio:** plano pago (consulte [melhorenvio.com.br](https://melhorenvio.com.br) para preços atuais). Não há custo de API por cotação em geral; a cobrança é sobre o frete comprado.

---

### Opção B — Correios direto

**O que é:** Integração direta com os Correios (SIGEP ou API de precificação).

- Exige contrato/comercialização com os Correios para uso em produção.
- Cotação: possível via API de cálculo de preço e prazo (ex.: [preco.contrato.correios.com.br](https://preco.contrato.correios.com.br)).
- Etiqueta: normalmente via SIGEP (mais burocrático) ou uso do Melhor Envio só para Correios no backend.

**Recomendação:** para MVP e menor fricção, usar **Melhor Envio**; ele já abstrai Correios e outras transportadoras. Integração direta com Correios costuma ser feita quando há volume alto ou exigência contratual.

---

## Esforço estimado (desenvolvimento)

Estimativa em **horas de desenvolvimento** (backend + frontend + ajustes).

| Item | Melhor Envio | Observação |
|------|----------------------------|------------|
| Configuração (conta, token, CEP origem, peso/dimensões) | 1–2 h | Admin ou .env |
| Serviço de cotação (chamada API, tratamento de erros, timeout) | 3–5 h | tRPC procedure ou API route |
| Ajuste do checkout: campo CEP, botão “Calcular frete”, lista de opções | 4–6 h | UI + estado + validação |
| Persistir opção escolhida no pedido (schema + migration se necessário) | 1–2 h | Order + eventual novo campo |
| Incluir frete no total e repassar ao Asaas (valor da cobrança Pix) | 1–2 h | Já existe totalAmount; garantir produto + frete |
| Testes manuais (vários CEPs, erro de API, CEP inválido) | 2–3 h | — |
| **Subtotal (só cotação + escolha)** | **~12–20 h** | **~2–2,5 dias úteis** |
| Compra do frete + geração de etiqueta (pós-pagamento) | 4–8 h | Depende do fluxo Melhor Envio (carrinho, checkout de frete) |
| Admin: exibir transportadora, rastreio, link/PDF da etiqueta | 2–3 h | — |
| **Com etiqueta** | **+6–11 h** | **+1–1,5 dia** |

**Resumo:**

- **Só cotação e escolha de frete no checkout:** **~2–2,5 dias** (12–20 h).
- **Cotação + compra de frete + etiqueta + rastreio no admin:** **~3–4 dias** (18–31 h).

*(Estimativa para 1 dev que já conhece o projeto. Prazos em dias assumem ~6–8 h/dia.)*

---

## Sugestão de preço (valor do projeto)

Valores em **reais**, apenas como referência. Ajuste conforme sua tabela de preço/dia.

| Escopo | Faixa sugerida (referência) |
|--------|-----------------------------|
| **Só cotação no checkout** (calcular frete, listar opções, salvar no pedido e no total) | **R$ 2.500 – R$ 4.500** |
| **Cotação + compra de frete + etiqueta + rastreio no admin** | **R$ 4.500 – R$ 7.500** |

Exemplo de critério:  
- R$ 2.500 – R$ 4.500 ≈ 2–2,5 dias a R$ 1.200 – R$ 1.800/dia.  
- Com etiqueta e admin: 3–4 dias na mesma faixa de diária.

Recomendação: fechar **primeiro** o escopo “cotação + escolha no checkout”; depois, se o cliente quiser, orçar separadamente “compra de frete + etiqueta + admin”.

---

## O que o cliente precisa fornecer

- Conta no **Melhor Envio** (ou contrato Correios, se for opção B).
- **CEP de origem** (onde a gráfica/estoque envia).
- **Peso e dimensões** do produto agenda (ex.: 0,5 kg, 21×15×3 cm). Se houver mais de um formato, definir regra (único SKU ou por tipo de miolo).

---

## Onde registrar na proposta

- Incluir no **“Fora do escopo”** da proposta comercial:  
  *“Cálculo automático de frete (Melhor Envio/Correios) — orçamento sob demanda; estimativa em torno de R$ 2.500 – R$ 4.500 para cotação no checkout.”*
- Se quiser, adicionar um **add-on** opcional no final da proposta:  
  *“Integração de frete (cotação + escolha no checkout): R$ X.XXX. Inclusão de geração de etiqueta e rastreio no admin: + R$ X.XXX.”*

---

*Documento de estimativa interna. Revise valores e prazos conforme sua realidade e escopo acordado com o cliente.*
