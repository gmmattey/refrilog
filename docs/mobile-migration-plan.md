# Migração mobile do RefriLog

## Decisão de produto

O destino do produto é Android e iOS, offline e sem conta. A PWA permanece no repositório apenas como referência recuperável do protótipo; ela não é o destino da próxima entrega.

## Execução

1. Preservar o modelo real de registros, objetivos e cálculo local.
2. Implementar a aplicação em `apps/mobile` com React Native, Expo Router e SQLite.
3. Guardar meta por semana para que trocas futuras não reescrevam medalhas antigas.
4. Oferecer CSV para análise e JSON versionado para restauração; validar todo backup antes de substituir o banco.
5. Validar regras de domínio, tipos, compatibilidade do Expo e bundles nativos disponíveis.

## Migração dos dados do navegador

Não existe migração automática do `localStorage` para o app. A aplicação web usa a chave `refrilog-v1`, mas o formato do navegador não é um backup portátil oficial. Uma migração futura poderá ler um arquivo exportado explicitamente; o MVP mobile restaura apenas o formato `refrilog-backup` JSON versionado, validado antes de alterar os dados locais.
