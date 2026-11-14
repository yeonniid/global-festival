import { GroupFestivalPlan } from '../types/festival';

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.split('');
  const lines: string[] = [];
  let current = '';

  for (let i = 0; i < words.length; i++) {
    const ch = words[i];
    const test = current + ch;
    if (ctx.measureText(test).width > maxWidth && current.length > 0) {
      lines.push(current);
      current = ch;
      if (lines.length === maxLines) {
        lines[maxLines - 1] = lines[maxLines - 1].slice(0, -1) + '…';
        return lines;
      }
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Renders a crisp 1080x1350 SNS-format Festival Card as a PNG data URL
 * containing all 4 required elements: 축제 이름, 개최 장소, 특색, 체험 내용.
 */
export async function renderSnsCardToPngDataUrl(plan: GroupFestivalPlan): Promise<string> {
  const width = 1080;
  const height = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // Background paper
  ctx.fillStyle = '#FAF9F6';
  ctx.fillRect(0, 0, width, height);

  // Outer card frame
  const pad = 40;
  const cardW = width - pad * 2;
  const cardH = height - pad * 2;
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#E7E5E4';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(pad, pad, cardW, cardH, 28);
  ctx.fill();
  ctx.stroke();

  // Top SNS Header Bar
  ctx.fillStyle = '#1C1917';
  ctx.beginPath();
  ctx.arc(pad + 52, pad + 56, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px "Noto Sans KR", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('지리', pad + 52, pad + 62);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 24px "Noto Sans KR", sans-serif';
  ctx.fillText(plan.groupName || '우리 모둠', pad + 90, pad + 50);

  ctx.fillStyle = '#78716C';
  ctx.font = '20px "Noto Sans KR", sans-serif';
  ctx.fillText(
    `${plan.continent} · ${plan.country} ${plan.city} · ${plan.month}월`,
    pad + 90,
    pad + 78
  );

  // Environment badge text on right
  ctx.textAlign = 'right';
  ctx.fillStyle = '#C2410C';
  ctx.font = 'bold 20px "Noto Sans KR", sans-serif';
  ctx.fillText(`${plan.naturalFactor} × ${plan.humanFactor}`, width - pad - 36, pad + 64);

  // Photo Area
  const imgX = pad;
  const imgY = pad + 108;
  const imgW = cardW;
  const imgH = 560;

  await new Promise<void>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(imgX, imgY, imgW, imgH);
      ctx.clip();

      // Cover scaling
      const scale = Math.max(imgW / img.width, imgH / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const dx = imgX + (imgW - drawW) / 2;
      const dy = imgY + (imgH - drawH) / 2;
      ctx.drawImage(img, dx, dy, drawW, drawH);

      // Measured contrast scrim at bottom
      const grad = ctx.createLinearGradient(0, imgY + imgH - 220, 0, imgY + imgH);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.82)');
      ctx.fillStyle = grad;
      ctx.fillRect(imgX, imgY + imgH - 220, imgW, 220);

      // Title & Location over bottom scrim
      ctx.textAlign = 'left';
      ctx.fillStyle = '#FDBA74';
      ctx.font = 'bold 20px "Noto Sans KR", sans-serif';
      ctx.fillText(`개최 장소 · ${plan.country} ${plan.city}`, imgX + 36, imgY + imgH - 96);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 42px "Noto Sans KR", sans-serif';
      const titleLines = wrapLines(ctx, plan.festivalName || '세계 축제 기획안', imgW - 72, 2);
      titleLines.forEach((line, idx) => {
        ctx.fillText(line, imgX + 36, imgY + imgH - 46 + idx * 46);
      });

      ctx.restore();
      resolve();
    };
    img.onerror = () => {
      ctx.fillStyle = '#E7E5E4';
      ctx.fillRect(imgX, imgY, imgW, imgH);
      resolve();
    };
    img.src = plan.customUploadedImage || plan.imageUrl;
  });

  // Body Content (Required Elements: 특색, 체험 내용, 성공 배경·지역 영향)
  let cursorY = imgY + imgH + 48;
  const textX = pad + 38;
  const maxTextW = cardW - 76;

  const drawSection = (label: string, content: string, accentColor = '#1C1917') => {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#C2410C';
    ctx.font = 'bold 19px "Noto Sans KR", sans-serif';
    ctx.fillText(label, textX, cursorY);
    cursorY += 32;

    ctx.fillStyle = accentColor;
    ctx.font = '24px "Noto Sans KR", sans-serif';
    const lines = wrapLines(ctx, content || '-', maxTextW, 3);
    lines.forEach((line) => {
      ctx.fillText(line, textX, cursorY);
      cursorY += 34;
    });
    cursorY += 18;
  };

  drawSection('지리적 특색 (자연 · 인문환경)', plan.specialtyFeature);
  drawSection('주요 체험 내용', plan.experienceContent);
  drawSection(
    '성공 배경 및 지역 경제 영향',
    plan.regionalEconomicImpact || plan.successBackground,
    '#44403C'
  );

  // Hashtags Footer
  ctx.fillStyle = '#15803D';
  ctx.font = 'bold 22px "Noto Sans KR", sans-serif';
  const tagLines = wrapLines(ctx, plan.hashtags || '#세계축제지리', maxTextW, 2);
  tagLines.forEach((line, idx) => {
    ctx.fillText(line, textX, height - pad - 54 + idx * 30);
  });

  return canvas.toDataURL('image/png');
}
