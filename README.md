# RefriLog

Um diário de refrigerantes com duas formas de uso: **Só registrar** ou **Reduzir no meu ritmo**. O projeto é uma aplicação web responsiva/PWA feita com React, TanStack Start e Zustand.

## Funcionalidades

- Registros de marca, versão, quantidade efetivamente consumida (ml) e custo opcional.
- Histórico com edição e exclusão; visualização diária e semanal.
- Objetivo de registro sem teto de consumo; objetivo de redução com meta semanal ajustável.
- Conquistas de início e acompanhamento; a medalha de semana na meta exige que o usuário confira uma semana encerrada.
- Compartilhamento voluntário de resumo e medalhas pelo recurso nativo do navegador (cópia de texto como alternativa).
- Exportação CSV. Dados permanecem no armazenamento deste navegador; registros do protótipo anterior são preservados.

## Rodar

```bash
npm ci
npm run dev
```

Verificações: `npm run typecheck` e `npm run build`.

## Hospedagem

Este repositório contém o código da aplicação, mas ainda não publica uma URL por si só. O projeto está configurado para gerar uma aplicação TanStack Start/Nitro com destino Vercel. Ao importar o repositório na Vercel, use o diretório raiz, o comando `npm run build` e Node.js 22 ou superior. Não configure `DATABASE_URL`: os registros são locais ao navegador e o app não usa contas nesta versão.

GitHub Pages não executa a saída de servidor deste projeto. A publicação deve ser validada no celular antes de divulgar o link.

## Limites atuais

Sem conta, sincronização ou importação de CSV. Limpar os dados do navegador pode apagar registros. Metas e medalhas refletem os registros informados; não inferem consumo nos dias sem anotação. As marcas são sugestões editáveis e não há catálogo nutricional.
