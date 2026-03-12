# Suporte e Manutenção — Sistema de Agendas Personalizadas

Propostas de pacotes de suporte e manutenção contínua para oferecer à cliente (ex.: Fashion Véus / Débora) após o go-live, incluindo cenários de alto volume.

---

## 1. O que pode exigir suporte quando o volume cresce

| Área | Possível impacto com escala |
|------|------------------------------|
| **Pedidos** | Muitos registros no banco; listagem do admin pode ficar lenta; necessidade de filtros, paginação e eventual arquivamento. |
| **Designs / imagens** | Mais usuários = mais uploads no Supabase Storage; custo de storage sobe; política de retenção (ex.: apagar designs antigos após X meses). |
| **Export de capa** | Muitas exportações simultâneas (PNG alta res) podem exigir fila ou otimização. |
| **Emails** | Resend/outros têm limite por plano; volume alto pode exigir upgrade. |
| **Checkout / Pix** | Asaas suporta alto volume; webhooks devem estar estáveis e idempotentes. |
| **Hospedagem** | Vercel/Supabase têm limites por plano; tráfego e uso de função/banco podem pedir upgrade. |
| **Segurança e compliance** | Atualizações de dependências (Next.js, libs), correções de segurança, boas práticas de senha e dados. |

---

## 2. Pacotes de suporte e manutenção (sugestão)

### Pacote Básico — “Suporte contínuo”

**Indicado para:** operação estável, poucas mudanças, até ~100–300 pedidos/mês.

| Incluso | Detalhe |
|--------|---------|
| Correção de bugs | Até X horas/mês (ex.: 2h) para correções que não sejam evolução de escopo. |
| Atualizações de segurança | Aplicar patches de segurança em dependências (Next, React, libs críticas) até 2x/ano. |
| Canal de contato | Email/WhatsApp com SLA de resposta em até 48h úteis. |
| Sem garantia de horário | Resolução conforme disponibilidade; não há prioridade sobre outros projetos. |

**Sugestão de investimento:** R$ 350 – 600/mês (ou 2–3h de sua diária em valor fixo).

---

### Pacote Intermediário — “Manutenção + evoluções leves”

**Indicado para:** loja em crescimento, necessidade de pequenas melhorias e tranquilidade com desempenho.

| Incluso | Detalhe |
|--------|---------|
| Tudo do Básico | + |
| Horas de evolução | Ex.: 4h/mês para pequenas melhorias (novo campo, ajuste de texto, novo status de pedido, relatório simples). |
| Monitoramento básico | Verificação mensal de saúde (uptime, erros no Vercel/Supabase, uso de cota). |
| Backup e rollback | Orientação/documentação para backup do banco; em caso de problema grave, 1 rollback/ano incluso. |
| SLA de resposta | Resposta em até 24h úteis; bugs críticos (site fora, checkout quebrado) em até 4–8h. |

**Sugestão de investimento:** R$ 800 – 1.400/mês.

---

### Pacote Avançado — “Suporte prioritário + escala”

**Indicado para:** alto volume (centenas de pedidos/mês), muitos designs, necessidade de performance e evoluções recorrentes.

| Incluso | Detalhe |
|--------|---------|
| Tudo do Intermediário | + |
| Horas de evolução | Ex.: 8–10h/mês para evoluções e otimizações (performance, relatórios, integrações). |
| Revisão de escala | 1x por semestre: análise de uso (banco, storage, emails, Vercel), sugestão de upgrade de planos e otimizações. |
| Prioridade de atendimento | Bugs e dúvidas tratados antes de clientes em pacotes menores. |
| SLA | Resposta em até 12h úteis; críticos em até 2–4h. |
| Relatório trimestral | Resumo de incidentes, melhorias feitas, recomendações (performance, custos, próximos passos). |

**Sugestão de investimento:** R$ 1.800 – 3.000/mês.

---

## 3. Itens avulsos (fora do pacote)

Para quem não quer pacote fixo ou precisa de algo pontual:

| Serviço | Descrição | Faixa de preço (referência) |
|---------|-----------|-----------------------------|
| Hora avulsa | Desenvolvimento, correção ou análise (fora do pacote) | R$ 120 – 200/h |
| Atualização de dependências | Upgrade de Next.js, React, libs (com testes) | R$ 400 – 1.000 (único) |
| Otimização de performance | Análise + ajustes (queries, cache, imagens) | R$ 800 – 2.000 (único) |
| Nova funcionalidade | Escopo definido em conjunto (ex.: relatório de vendas, novo filtro no admin) | Orçamento sob demanda |
| Integração adicional | Ex.: Melhor Envio, WhatsApp, outro gateway | Conforme estimativa (ex.: doc de frete) |
| Treinamento | Sessão para equipe usar o admin (1–2h) | R$ 250 – 500 (único) |

---

## 4. O que deixar claro no contrato de suporte

- **O que é bug** (correção de comportamento conforme especificação) **vs. evolução** (nova funcionalidade ou mudança de regra). Evolução consome horas do pacote ou é avulsa.
- **Canal oficial** (email/WhatsApp) e que pedidos por outros canais não garantem SLA.
- **Horas não utilizadas** no mês: normalmente não acumulam (ou acumulam com limite, ex.: 1 mês).
- **Escopo do sistema:** suporte cobre apenas o que foi entregue no projeto; novas integrações ou módulos são orçados à parte.
- **Infraestrutura:** custos de Vercel, Supabase, Resend, etc. continuam sendo do cliente; o suporte não inclui pagamento de planos.

---

## 5. Como encaixar na proposta comercial

- **Garantia inicial:** Manter os “30 dias de suporte pós-entrega (correção de bugs)” na proposta atual.
- **Após a garantia:** Oferecer por escrito: “Após os 30 dias, podemos contratar um pacote de suporte e manutenção contínua (Básico, Intermediário ou Avançado), conforme documento de Suporte e Manutenção.”
- **Na reunião de fechamento:** Mostrar o doc (ou um resumo de 1 página) com os 3 pacotes e dizer que, se o volume crescer, o Intermediário ou Avançado ajudam a manter o sistema estável e evoluir sem sustos.

---

## 6. Resumo para a cliente (texto pronto)

> **Suporte após o go-live**  
> Nos primeiros 30 dias após a entrega, qualquer bug é corrigido sem custo adicional. Depois disso, você pode optar por um **pacote de suporte e manutenção** para ter correções de bugs, atualizações de segurança e, se quiser, horas mensais para pequenas melhorias e acompanhamento quando o volume de pedidos e usuários crescer. Os pacotes variam de um valor básico mensal (suporte reativo) até um pacote com prioridade, revisão de performance e relatório trimestral. Itens como novas integrações (frete, WhatsApp) ou funcionalidades maiores continuam sendo orçados à parte.

---

*Documento de apoio comercial. Ajuste valores e prazos de SLA conforme sua tabela e capacidade de atendimento.*
