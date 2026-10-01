import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const platform = process.argv[2];

if (!['ios', 'android'].includes(platform)) {
  throw new Error('Uso: node store-assets/scripts/generate-editorial-frames.mjs <ios|android>');
}

const inputDir = platform === 'ios'
  ? resolve(root, 'ios', 'app-store-6.3')
  : resolve(root, 'android', 'raw');
const outputDir = resolve(root, platform, 'editorial');
const workDir = resolve(root, '.generated');
const mascotPath = resolve(root, '..', 'apps', 'mobile', 'assets', 'mascot-transparent.png');

if (!existsSync(inputDir)) {
  throw new Error(`Capturas brutas não encontradas em ${inputDir}`);
}

mkdirSync(outputDir, { recursive: true });
mkdirSync(workDir, { recursive: true });

const mascot = readFileSync(mascotPath).toString('base64');
const layout = platform === 'ios'
  ? { width: 1206, height: 2622, clipX: 55, clipY: 710, clipWidth: 1096, clipHeight: 1840, radius: 76, screenshotY: 500, screenshotWidth: 1096, screenshotHeight: 2381, brandX: 84, brandY: 150, titleX: 78, titleY1: 300, titleY2: 418, titleSize: 104, subtitleX: 84, subtitleY: 505, subtitleSize: 38, mascotX: 846, mascotY: 415, mascotSize: 254 }
  : { width: 1080, height: 1920, clipX: 40, clipY: 530, clipWidth: 1000, clipHeight: 1345, radius: 68, screenshotY: 350, screenshotWidth: 1000, screenshotHeight: 2222, brandX: 70, brandY: 115, titleX: 64, titleY1: 232, titleY2: 328, titleSize: 82, subtitleX: 70, subtitleY: 400, subtitleSize: 30, mascotX: 790, mascotY: 265, mascotSize: 202 };
const frames = [
  { file: '01-resumo-semanal', title: ['Seu refri,', 'do seu jeito.'], subtitle: 'Anote. Acompanhe. Sem culpa.', offset: 500 },
  { file: '02-historico', title: ['Um hábito', 'mais claro.'], subtitle: 'O seu histórico, no seu ritmo.', offset: 520 },
  { file: '03-meta-semanal', title: ['Uma meta que', 'acompanha você.'], subtitle: 'Seu plano. Sua semana. Seu jeito.', offset: 520 },
  { file: '04-cartao-compartilhamento', title: ['Seu panorama', 'vale ser visto.'], subtitle: 'Compartilhe o que faz sentido para você.', offset: 520 },
];

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

for (const frame of frames) {
  const input = resolve(inputDir, `${frame.file}.png`);
  const source = existsSync(input) ? input : resolve(inputDir, `${frame.file}.jpg`);
  if (!existsSync(source)) {
    throw new Error(`Captura ausente: ${source}`);
  }
  const screenshot = readFileSync(source).toString('base64');
  const screenshotMime = source.endsWith('.png') ? 'image/png' : 'image/jpeg';
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${layout.width}" height="${layout.height}" viewBox="0 0 ${layout.width} ${layout.height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.9" y2="1">
      <stop offset="0" stop-color="#F9FDFF"/>
      <stop offset="1" stop-color="#EAF7FF"/>
    </linearGradient>
    <radialGradient id="halo" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#D9F2FF" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#D9F2FF" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="22" stdDeviation="28" flood-color="#3689C4" flood-opacity="0.18"/>
    </filter>
    <clipPath id="screenClip"><rect x="${layout.clipX}" y="${layout.clipY}" width="${layout.clipWidth}" height="${layout.clipHeight}" rx="${layout.radius}"/></clipPath>
  </defs>
  <rect width="${layout.width}" height="${layout.height}" fill="url(#bg)"/>
  <ellipse cx="${layout.width / 2}" cy="${Math.round(layout.height * 0.63)}" rx="${Math.round(layout.width * 0.54)}" ry="${Math.round(layout.height * 0.36)}" fill="url(#halo)"/>
  <text x="${layout.brandX}" y="${layout.brandY}" fill="#1976BE" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(layout.titleSize * 0.41)}" font-weight="700" letter-spacing="${Math.round(layout.titleSize * 0.106)}">REFRILOG</text>
  <text x="${layout.titleX}" y="${layout.titleY1}" fill="#102E4A" font-family="Arial, Helvetica, sans-serif" font-size="${layout.titleSize}" font-weight="800">${escapeXml(frame.title[0])}</text>
  <text x="${layout.titleX}" y="${layout.titleY2}" fill="#102E4A" font-family="Arial, Helvetica, sans-serif" font-size="${layout.titleSize}" font-weight="800">${escapeXml(frame.title[1])}</text>
  <text x="${layout.subtitleX}" y="${layout.subtitleY}" fill="#637992" font-family="Arial, Helvetica, sans-serif" font-size="${layout.subtitleSize}" font-weight="400">${escapeXml(frame.subtitle)}</text>
  <image href="data:image/png;base64,${mascot}" x="${layout.mascotX}" y="${layout.mascotY}" width="${layout.mascotSize}" height="${layout.mascotSize}" preserveAspectRatio="xMidYMid meet"/>
  <rect x="${layout.clipX}" y="${layout.clipY}" width="${layout.clipWidth}" height="${layout.clipHeight}" rx="${layout.radius}" fill="#FFFFFF" filter="url(#shadow)"/>
  <g clip-path="url(#screenClip)">
    <image href="data:${screenshotMime};base64,${screenshot}" x="${layout.clipX}" y="${platform === 'ios' ? frame.offset : layout.screenshotY}" width="${layout.screenshotWidth}" height="${layout.screenshotHeight}" preserveAspectRatio="xMidYMin meet"/>
  </g>
</svg>`;
  const svgPath = resolve(workDir, `${platform}-${frame.file}.svg`);
  const outPath = resolve(outputDir, `${frame.file}.jpg`);
  writeFileSync(svgPath, svg);
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '90', svgPath, '--out', outPath], { stdio: 'inherit' });
}

console.log(`Peças editoriais criadas em ${outputDir}`);
