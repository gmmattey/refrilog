# Materiais de loja — RefriLog

As peças usam somente telas reais do app e uma base demonstrativa local coerente; não representam dados de uma pessoa real. A direção editorial escolhida é **"Seu refri, do seu jeito"**: fundo claro, título grande, tela do produto em destaque e o mascote como companhia.

## App Store — iPhone 6,3 polegadas

Os quatro JPEGs em `ios/app-store-6.3/` têm 1206 x 2622 px e não têm canal alpha:

1. `01-resumo-semanal.jpg` — registro de hoje, panorama da semana e meta voluntária.
2. `02-historico.jpg` — histórico por dia, marcas, versões, volume e custo informado.
3. `03-meta-semanal.jpg` — escolha do objetivo e meta ajustável.
4. `04-cartao-compartilhamento.jpg` — prévia do cartão antes de compartilhar.

As versões editoriais desses quatro quadros estão em `ios/editorial/`. Elas removem elementos de sistema e organizam a narrativa para a página de loja, preservando o conteúdo real das telas.

`ios/refrilog-app-preview-886x1920-v2.mp4` é um preview vertical H.264 de 18,97 segundos, 886 x 1920 px e 30 fps. Ele percorre as quatro experiências acima e está no tamanho aceito para App Preview do iPhone.

## Google Play

As capturas brutas vieram de um Android Pixel 9 API 36 dedicado ao RefriLog. As quatro peças finais para a ficha estão em `android/editorial/`, em JPEG 1080 x 1920 px e sem canal alpha:

1. `01-resumo-semanal.jpg` — registro rápido e panorama da semana.
2. `02-historico.jpg` — registros organizados por dia.
3. `03-meta-semanal.jpg` — objetivo e meta pessoal ajustável.
4. `04-cartao-compartilhamento.jpg` — cartão revisável antes de compartilhar.

Os PNGs de origem do Android ficam em `android/raw/` apenas para conferência local e são ignorados pelo Git.

## Limites antes de publicar

- O aplicativo também declara suporte a iPad; ainda faltam as capturas específicas do iPad para uma submissão iOS completa.
- O preview do Google Play deve ser hospedado em um vídeo do YouTube; este arquivo é a fonte local, não uma publicação.
