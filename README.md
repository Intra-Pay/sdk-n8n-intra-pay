# n8n-nodes-intrapay

Community Node para n8n que integra com a Intra Pay reutilizando o pacote `intrapay-sdk`.

## Visão Geral

- Nome no painel: `Intra Pay Brazilian Payments`.
- Ícone: empacotado localmente (`file:logo-intra-pay.svg`) para compatibilidade com n8n self-hosted.
- Compatível com n8n `>= 1.121.2` (self-hosted Docker/Portainer).

## Instalação

- No n8n: Settings → Community Nodes → Install → `n8n-nodes-intrapay`.
- Se já instalado, use Settings → Community Nodes → Update e reinicie o container para limpar cache.

## Credenciais

Crie credenciais "IntraPay API" com:
- `clientKey`: obrigatório
- `clientSecret`: obrigatório
- `baseUrl`: opcional (default `https://api.intrapay.io/api/financial/v1`)

## Recursos e Operações

- `pixCashIn`
  - `createStaticCharge`: cria cobrança estática (retorna `emvqrcps`, `transactionIdentification`, etc.)
  - `createDynamicImmediateCharge`: cria cobrança dinâmica com expiração (retorna `expiresAt` e campos da cobrança)
  - `getChargeStatus`: em planejamento (depende de endpoint de consulta na doc)
- `pixCashOut`
  - `payByAccount`: pagamento via conta (ISPB/branch/account/taxId/name/accountType/password)
  - `payByEmv`: pagamento via EMV (type, endToEndId, amounts, receiver)
  - `payByKey`: pagamento via chave (key/keyType/endtoEndId/account/owner)

## Uso Básico

1) Adicione o node "Intra Pay Brazilian Payments" ao workflow.
2) Selecione o `Resource` (Pix Cash In/Out) e a `Operation` desejada.
3) Preencha os campos conforme a operação:
- Cash In estática: `pixKeyId`, `amount`, `additionalInformation`.
- Cash In imediata: `pixKeyId`, `amount`, `expirationMinutes`, `debtorName`, `debtorTaxId`, `payerQuestion`.
- Cash Out por conta: `account`, `branch`, `bank (ISPB)`, `amount`, `taxId`, `name`, `accountType`, `description`, `password`.
- Cash Out por EMV: `emvType`, `endToEndId`, `amountOriginal`, `amountFinal`, `receiverName`, `receiverParticipant`, `receiverDocumentNumber`.
- Cash Out por chave: `key`, `keyType`, `keyEndToEndId`, dados de `account` e `owner`.

## Observações

- O node usa `intrapay-sdk` e autentica automaticamente; em caso de `401` por token expirado, há retry com reautenticação.
- Os campos e respostas seguem os modelos da documentação oficial da Intra Pay.
- Ícone: em ambientes self-hosted, o n8n carrega ícones via `file:`; o pacote inclui `logo-intra-pay.svg` e `logo-intra-pay.png` ao lado do node compilado.
- Se o ícone não aparecer, remova o node, reinicie o container e reinstale (cache de assets).

## Desenvolvimento

- Build: `npm run build`
- Publicação: `npm publish --access public`

## Suporte

- Para dúvidas de integração, verifique as páginas da doc da Intra Pay.