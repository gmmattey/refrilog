# RefriLog

RefriLog é um diário leve de refrigerantes para Android e iOS. Ele ajuda a registrar quantidades, marcas e custos informados sem julgamento: a pessoa pode apenas acompanhar ou definir uma meta semanal voluntária para reduzir no próprio ritmo.

O produto mobile está em [`apps/mobile`](apps/mobile). A antiga PWA permanece neste repositório somente como referência recuperável durante a migração; não é o destino desta entrega e o app mobile não usa Vercel, autenticação, servidor ou serviço pago.

## Funcionalidades do MVP mobile

- Onboarding com os modos **Só registrar** e **Reduzir no meu ritmo**.
- Registro, edição e exclusão de consumo com marca, versão, quantidade efetivamente bebida, custo opcional e data/hora anterior.
- Início, histórico diário/semanal, total de volume, marcas e **Gasto informado** (somente custos registrados).
- Meta semanal voluntária, configurável, e medalhas de acompanhamento; a medalha de meta exige conferir uma semana encerrada e usa a meta guardada para aquela semana.
- SQLite local com migração versionada, CSV para análise e backup JSON versionado validado antes de restaurar.
- Cartão de resumo visualizado antes de compartilhar como imagem pela interface nativa, além do compartilhamento de texto.
- Ajustes, privacidade local e exclusão total após confirmação.

## Rodar no Android ou iOS

Pré-requisitos: Node.js 22+ e Android Studio (Android) ou Xcode (iOS, apenas macOS).

```bash
cd apps/mobile
npm ci
npm run start
```

No terminal do Expo, use `a` para um emulador Android ou `i` para um simulador iOS. Também é possível executar `npm run android` e `npm run ios`.

O MVP usa somente módulos compatíveis com Expo Go para a jornada normal. O compartilhamento de cartão depende da disponibilidade da integração nativa de compartilhamento no aparelho; valide-o em Android/iOS, não no navegador.

## Verificações

```bash
cd apps/mobile
npm run typecheck
npm test
npx expo-doctor
npx expo export --platform android
npx expo export --platform ios
```

Os testes cobrem soma de volume/custo, custo ausente e decimal, limites locais de dia/semana, CSV, backup inválido e elegibilidade de medalha.

## Builds e publicação

`apps/mobile/eas.json` inclui perfis de desenvolvimento, teste interno e produção. Não é necessário plano pago do EAS para executar localmente: `npx expo run:android` e `npx expo run:ios` geram builds locais depois que os ambientes nativos estiverem instalados.

Os identificadores atuais `com.gmmattey.refrilog` são provisórios e precisam ser confirmados antes de registrar o app nas lojas. Não há credenciais, certificados nem segredos no repositório. Ainda faltam os materiais de loja, a confirmação dos identificadores, builds assinados e validação em aparelhos físicos antes de qualquer publicação.

## Dados e backup

Os dados ficam somente no aparelho e podem ser perdidos sem exportar um backup. CSV é para análise; o backup JSON do RefriLog é a única opção de restauração e é validado antes de trocar o banco local. Não existe migração automática do `localStorage` do navegador; veja [o plano de migração](docs/mobile-migration-plan.md) para o limite e o formato atual.
