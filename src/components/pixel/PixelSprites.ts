import { HerOutfitId, HisOutfitId, SceneId } from '../../types/scenes';

export const CANVAS_W = 360;
export const CANVAS_H = 202;

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  kind: 'heart' | 'sparkle' | 'leaf';
  color: string;
}

export interface DrawState {
  scene: SceneId;
  time: number;
  herOutfit: HerOutfitId;
  hisOutfit: HisOutfitId;
  specialActive: boolean;
  hugging: boolean;
  flashAlpha: number;
  particles: Particle[];
}

function px(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

export function drawPixelHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  scale = 1
) {
  const s = scale;
  const rx = Math.round(x);
  const ry = Math.round(y);
  ctx.fillStyle = color;
  ctx.fillRect(rx + 1 * s, ry, 2 * s, 1 * s);
  ctx.fillRect(rx + 4 * s, ry, 2 * s, 1 * s);
  ctx.fillRect(rx, ry + 1 * s, 7 * s, 2 * s);
  ctx.fillRect(rx + 1 * s, ry + 3 * s, 5 * s, 1 * s);
  ctx.fillRect(rx + 2 * s, ry + 4 * s, 3 * s, 1 * s);
  ctx.fillRect(rx + 3 * s, ry + 5 * s, 1 * s, 1 * s);
}

// Engineering Troops Flag & Black-Yellow-White Imperial Flag
function drawWallFlags(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number
) {
  px(ctx, x1, y1, w1, h1, '#f5f2ed');
  ctx.fillStyle = '#c82829';
  const corners = [
    [x1, y1, x1 + 18, y1, x1, y1 + 14],
    [x1 + w1, y1, x1 + w1 - 18, y1, x1 + w1, y1 + 14],
    [x1, y1 + h1, x1 + 18, y1 + h1, x1, y1 + h1 - 14],
    [x1 + w1, y1 + h1, x1 + w1 - 18, y1 + h1, x1 + w1, y1 + h1 - 14],
  ];
  for (const [ax, ay, bx, by, cx, cy] of corners) {
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.lineTo(x1 + w1 / 2, y1 + h1 / 2);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.fill();
  }
  px(ctx, x1 + w1 / 2 - 12, y1 + h1 / 2 - 9, 24, 18, '#373a42');
  px(ctx, x1 + w1 / 2 - 7, y1 + h1 / 2 - 6, 14, 12, '#6d727c');
  px(ctx, x1 + 12, y1 + 4, w1 - 24, 4, '#202025');
  px(ctx, x1 + 15, y1 + h1 - 7, w1 - 30, 4, '#202025');
  ctx.strokeStyle = '#3d2a24';
  ctx.lineWidth = 1;
  ctx.strokeRect(x1 + 0.5, y1 + 0.5, w1 - 1, h1 - 1);

  const sh = Math.floor(h2 / 3);
  px(ctx, x2, y2, w2, sh, '#18181c');
  px(ctx, x2, y2 + sh, w2, sh, '#e8be38');
  px(ctx, x2, y2 + sh * 2, w2, h2 - sh * 2, '#f5f4f0');
  const cx = x2 + Math.floor(w2 / 2);
  const cy = y2 + Math.floor(h2 / 2);
  px(ctx, cx - 6, cy - 8, 12, 16, '#18181c');
  px(ctx, cx - 12, cy - 5, 24, 9, '#18181c');
  px(ctx, cx - 8, cy - 11, 4, 4, '#18181c');
  px(ctx, cx + 4, cy - 11, 4, 4, '#18181c');
  px(ctx, cx - 3, cy - 3, 6, 6, '#c8342d');
  px(ctx, cx - 2, y2 + 4, 4, 3, '#e8be38');
  ctx.strokeStyle = '#3d2a24';
  ctx.lineWidth = 1;
  ctx.strokeRect(x2 + 0.5, y2 + 0.5, w2 - 1, h2 - 1);
}

// Clean, cute minimalist pixel sprite for HER
export function drawHerSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  outfit: HerOutfitId,
  time: number,
  options: { seated?: boolean; waving?: boolean; hugOffset?: number; holdingPhone?: boolean } = {}
) {
  const bob = options.seated ? Math.sin(time * 2.2) * 0.6 : Math.sin(time * 3.1) * 1.1;
  const cx = Math.round(x + (options.hugOffset ?? 0));
  const cy = Math.round(y + bob);
  const blink = Math.sin(time * 1.4) > 0.96;

  if (!options.seated) {
    px(ctx, cx - 4, cy - 11, 3, 10, '#f3cbb8');
    px(ctx, cx + 1, cy - 11, 3, 10, '#f3cbb8');
    px(ctx, cx - 4, cy - 2, 3, 2, '#2d242a');
    px(ctx, cx + 1, cy - 2, 3, 2, '#2d242a');

    const skirtColor = outfit === 'cat_tee' ? '#f3f1f5' : '#1c1d24';
    const skirtShadow = outfit === 'cat_tee' ? '#d4cfd9' : '#111116';
    px(ctx, cx - 7, cy - 16, 14, 6, skirtColor);
    px(ctx, cx - 8, cy - 13, 16, 3, skirtColor);
    px(ctx, cx - 4, cy - 15, 1, 5, skirtShadow);
    px(ctx, cx, cy - 15, 1, 5, skirtShadow);
    px(ctx, cx + 4, cy - 15, 1, 5, skirtShadow);
  }

  const topY = cy - 26;
  if (outfit === 'tribal_black') {
    px(ctx, cx - 6, topY, 12, 11, '#1b181c');
    px(ctx, cx - 6, topY + 1, 3, 9, '#c62828');
    px(ctx, cx + 3, topY + 1, 3, 9, '#c62828');
    px(ctx, cx - 2, topY + 2, 4, 6, '#f4f1f4');
    px(ctx, cx - 4, topY + 4, 8, 2, '#f4f1f4');
    px(ctx, cx - 9, topY + 1, 3, 8, '#c62828');
    px(ctx, cx - 8, topY + 3, 1, 4, '#1b181c');
    px(ctx, cx + 6, topY + 1, 3, 8, '#c62828');
    px(ctx, cx + 7, topY + 3, 1, 4, '#1b181c');
  } else if (outfit === 'ebash_tee') {
    px(ctx, cx - 7, topY, 14, 11, '#1a1a20');
    px(ctx, cx - 5, topY + 3, 10, 2, '#e7e5e4');
    px(ctx, cx - 4, topY + 7, 8, 2, '#e7e5e4');
    px(ctx, cx - 9, topY + 1, 2, 5, '#1a1a20');
    px(ctx, cx + 7, topY + 1, 2, 5, '#1a1a20');
    px(ctx, cx - 9, topY + 6, 2, 3, '#f8d5c6');
    px(ctx, cx + 7, topY + 6, 2, 3, '#f8d5c6');
  } else if (outfit === 'velvet_red') {
    px(ctx, cx - 6, topY + 1, 12, 10, '#a8222a');
    px(ctx, cx - 4, topY + 2, 8, 8, '#c9343e');
    px(ctx, cx - 3, topY, 6, 3, '#f8d5c6');
    px(ctx, cx - 8, topY + 1, 2, 8, '#931c23');
    px(ctx, cx + 6, topY + 1, 2, 8, '#931c23');
  } else {
    px(ctx, cx - 6, topY, 12, 11, '#1b191e');
    px(ctx, cx - 4, topY + 2, 8, 7, '#f29bc0');
    px(ctx, cx - 2, topY + 4, 4, 4, '#f08b49');
    px(ctx, cx - 2, topY + 3, 1, 1, '#f08b49');
    px(ctx, cx + 1, topY + 3, 1, 1, '#f08b49');
    px(ctx, cx - 8, topY + 1, 2, 4, '#1b191e');
    px(ctx, cx + 6, topY + 1, 2, 4, '#1b191e');
    px(ctx, cx - 8, topY + 5, 2, 4, '#f8d5c6');
    px(ctx, cx + 6, topY + 5, 2, 4, '#f8d5c6');
  }

  if (options.holdingPhone) {
    px(ctx, cx + 6, topY + 2, 4, 6, '#87b5d9');
    px(ctx, cx + 6, topY + 4, 4, 4, '#f4a4c0');
    px(ctx, cx + 7, topY + 2, 2, 2, '#8b7376');
  } else if (options.waving) {
    const waveY = Math.sin(time * 8) * 2;
    px(ctx, cx - 9, topY - 4 + waveY, 2, 5, '#f8d5c6');
    px(ctx, cx - 10, topY - 8 + waveY, 3, 4, '#fff7cc');
  } else {
    px(ctx, cx - 9, topY + 8, 2, 2, '#f8d5c6');
    px(ctx, cx + 7, topY + 8, 2, 2, '#f8d5c6');
  }

  const hairMain = '#f5dc9c';
  const hairShade = '#deb872';
  const hairPink = '#f5bcc8';
  const headY = cy - 39;

  // Soft rounded hair & framing locks ending right at the shoulders (never under chin!)
  px(ctx, cx - 8, headY + 2, 2, 12, hairShade);
  px(ctx, cx + 6, headY + 2, 2, 12, hairShade);
  px(ctx, cx - 9, headY + 5, 2, 10, hairMain);
  px(ctx, cx + 7, headY + 5, 2, 10, hairMain);
  px(ctx, cx - 9, headY + 12, 2, 3, hairPink);
  px(ctx, cx + 7, headY + 12, 2, 3, hairPink);

  // Rounded cute face (beveled corners, soft chin!)
  px(ctx, cx - 5, headY + 2, 10, 1, '#fbe0d2');
  px(ctx, cx - 6, headY + 3, 12, 8, '#fbe0d2');
  px(ctx, cx - 5, headY + 11, 10, 1, '#fbe0d2');
  px(ctx, cx - 3, headY + 12, 6, 1, '#fbe0d2');
  px(ctx, cx - 2, headY + 13, 4, 1, '#f3cbb8');

  if (!blink) {
    px(ctx, cx - 4, headY + 6, 2, 3, '#2b2229');
    px(ctx, cx - 4, headY + 7, 2, 2, '#5c8391');
    px(ctx, cx - 4, headY + 6, 1, 1, '#ffffff');
    px(ctx, cx + 2, headY + 6, 2, 3, '#2b2229');
    px(ctx, cx + 2, headY + 7, 2, 2, '#5c8391');
    px(ctx, cx + 2, headY + 6, 1, 1, '#ffffff');
  } else {
    px(ctx, cx - 4, headY + 8, 2, 1, '#3b2c35');
    px(ctx, cx + 2, headY + 8, 2, 1, '#3b2c35');
  }

  px(ctx, cx - 5, headY + 9, 2, 1, '#f493ad');
  px(ctx, cx + 3, headY + 9, 2, 1, '#f493ad');
  px(ctx, cx + 3, headY + 11, 1, 1, '#8b5e57');
  px(ctx, cx - 1, headY + 11, 2, 1, '#d96b7e');

  // Rounded bangs & crown hair
  px(ctx, cx - 5, headY - 1, 10, 2, hairMain);
  px(ctx, cx - 7, headY + 1, 14, 3, hairMain);
  px(ctx, cx - 6, headY + 3, 12, 2, hairMain);
  px(ctx, cx - 3, headY + 4, 2, 1, hairShade);
  px(ctx, cx + 1, headY + 4, 2, 1, hairShade);

  // Pink over-ear headphones ONLY on cat_tee outfit
  if (outfit === 'cat_tee') {
    px(ctx, cx - 7, headY - 2, 14, 2, '#ec8eb0');
    px(ctx, cx - 9, headY + 4, 3, 6, '#f4a7c3');
    px(ctx, cx + 6, headY + 4, 3, 6, '#f4a7c3');
    px(ctx, cx - 9, headY + 5, 1, 4, '#d96b94');
    px(ctx, cx + 8, headY + 5, 1, 4, '#d96b94');
  }
}

// Clean, cute minimalist pixel sprite for HIM (light fair skin + soft light-brown beard, cute friendly face!)
export function drawHisSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  outfit: HisOutfitId,
  time: number,
  options: { seated?: boolean; waving?: boolean; hugOffset?: number } = {}
) {
  const bob = options.seated ? Math.sin(time * 2.2 + 0.8) * 0.6 : Math.sin(time * 3.1 + 1.0) * 1.1;
  const cx = Math.round(x + (options.hugOffset ?? 0));
  const cy = Math.round(y + bob);
  const blink = Math.sin(time * 1.4 + 2.1) > 0.96;

  if (!options.seated) {
    const legColor = outfit === 'tactical' ? '#464f39' : '#18191e';
    px(ctx, cx - 6, cy - 12, 5, 10, legColor);
    px(ctx, cx + 1, cy - 12, 5, 10, legColor);
    px(ctx, cx - 7, cy - 2, 6, 2, '#d8d4c8');
    px(ctx, cx - 6, cy - 3, 4, 1, '#584e43');
    px(ctx, cx + 1, cy - 2, 6, 2, '#d8d4c8');
    px(ctx, cx + 2, cy - 3, 4, 1, '#584e43');
  }

  const topY = cy - 28;
  if (outfit === 'tactical') {
    px(ctx, cx - 8, topY, 16, 16, '#505b3e');
    px(ctx, cx - 6, topY + 2, 12, 12, '#6f6b4b');
    px(ctx, cx - 4, topY + 3, 3, 2, '#f4f4f4');
    px(ctx, cx - 4, topY + 4, 3, 1, '#2563eb');
    px(ctx, cx - 4, topY + 5, 3, 1, '#dc2626');
    px(ctx, cx + 4, topY + 1, 2, 8, '#f97316');
    px(ctx, cx - 11, topY + 1, 3, 10, '#465236');
    px(ctx, cx + 8, topY + 1, 3, 10, '#465236');
    px(ctx, cx - 11, topY + 10, 3, 2, '#f7d5c6');
    px(ctx, cx + 8, topY + 10, 3, 2, '#f7d5c6');
  } else {
    px(ctx, cx - 8, topY, 16, 16, '#1a1a20');
    px(ctx, cx - 5, topY + 5, 10, 2, '#e7e5e4');
    px(ctx, cx - 4, topY + 9, 8, 2, '#e7e5e4');
    px(ctx, cx - 1, topY + 1, 2, 3, '#d4d4d8'); // cute pendant
    px(ctx, cx - 11, topY + 1, 3, 6, '#1a1a20');
    px(ctx, cx + 8, topY + 1, 3, 6, '#1a1a20');
    px(ctx, cx - 11, topY + 7, 3, 5, '#f7d5c6');
    if (options.waving) {
      const waveY = Math.sin(time * 8 + 1) * 2;
      px(ctx, cx + 9, topY - 4 + waveY, 2, 6, '#f7d5c6');
    } else {
      px(ctx, cx + 8, topY + 7, 3, 5, '#f7d5c6');
    }
  }

  const headY = cy - 42;
  if (outfit === 'balaclava') {
    px(ctx, cx - 7, headY + 1, 14, 14, '#ebe9e4');
    px(ctx, cx - 6, headY, 12, 15, '#f5f3ee');
    px(ctx, cx - 5, headY + 2, 2, 2, '#9f2b2b');
    px(ctx, cx + 3, headY + 3, 3, 2, '#8b2626');
    px(ctx, cx - 4, headY + 10, 2, 2, '#9f2b2b');
    px(ctx, cx - 4, headY + 5, 3, 2, '#4a3530');
    px(ctx, cx + 1, headY + 5, 3, 2, '#4a3530');
    px(ctx, cx - 3, headY + 6, 1, 1, '#18181b');
    px(ctx, cx + 2, headY + 6, 1, 1, '#18181b');
    px(ctx, cx - 2, headY + 9, 4, 2, '#734440');
  } else if (outfit === 'tactical') {
    px(ctx, cx - 6, headY + 3, 12, 11, '#f7d5c6');
    px(ctx, cx - 6, headY + 8, 12, 7, '#18181c');
    px(ctx, cx - 6, headY + 5, 12, 3, '#27272a');
    px(ctx, cx - 5, headY + 6, 4, 2, '#60a5fa');
    px(ctx, cx + 1, headY + 6, 4, 2, '#60a5fa');
    px(ctx, cx - 8, headY - 2, 16, 7, '#848360');
    px(ctx, cx - 6, headY - 3, 12, 2, '#999772');
    px(ctx, cx - 4, headY, 4, 2, '#5c6043');
    px(ctx, cx + 2, headY + 1, 3, 2, '#5c6043');
  } else {
    // Soft rounded fair face + very light subtle beard along the bottom jawline!
    px(ctx, cx - 5, headY + 2, 10, 1, '#fce0d4');
    px(ctx, cx - 6, headY + 3, 12, 8, '#fce0d4');
    px(ctx, cx - 5, headY + 11, 10, 2, '#fce0d4');
    px(ctx, cx - 3, headY + 13, 6, 1, '#fce0d4');

    // Subtle light stubble/beard just along the lower chin edge (чуть-чуть!)
    px(ctx, cx - 5, headY + 11, 1, 1, '#8a6c5f');
    px(ctx, cx + 4, headY + 11, 1, 1, '#8a6c5f');
    px(ctx, cx - 4, headY + 12, 8, 1, '#8a6c5f');
    px(ctx, cx - 3, headY + 13, 6, 1, '#755a4e');

    px(ctx, cx - 1, headY + 10, 2, 1, '#c98580'); // friendly smile
    px(ctx, cx - 5, headY + 8, 2, 1, '#f5a8a8'); // rosy cheeks
    px(ctx, cx + 3, headY + 8, 2, 1, '#f5a8a8');

    // Soft brows & eyes
    px(ctx, cx - 4, headY + 5, 3, 1, '#4a3630');
    px(ctx, cx + 1, headY + 5, 3, 1, '#4a3630');
    if (!blink) {
      px(ctx, cx - 4, headY + 6, 2, 2, '#3a2b28');
      px(ctx, cx + 2, headY + 6, 2, 2, '#3a2b28');
    } else {
      px(ctx, cx - 4, headY + 7, 2, 1, '#3a2b28');
      px(ctx, cx + 2, headY + 7, 2, 1, '#3a2b28');
    }

    // Rounded short brown hair with soft widow's peak hint
    px(ctx, cx - 5, headY - 1, 10, 2, '#58423a');
    px(ctx, cx - 7, headY + 1, 14, 2, '#47342e');
    px(ctx, cx - 1, headY + 3, 2, 1, '#47342e');
  }
}

export function drawScene(ctx: CanvasRenderingContext2D, state: DrawState) {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  switch (state.scene) {
    case 'bedroom':
      drawBedroomScene(ctx, state);
      break;
    case 'studio':
      drawStudioScene(ctx, state);
      break;
    case 'kiss':
      drawKissScene(ctx, state);
      break;
    case 'concert':
      drawConcertScene(ctx, state);
      break;
    case 'courtyard':
      drawCourtyardScene(ctx, state);
      break;
  }

  for (const p of state.particles) {
    const alpha = Math.max(0, 1 - p.life / p.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    if (p.kind === 'heart') {
      drawPixelHeart(ctx, p.x, p.y, p.color, 1);
    } else if (p.kind === 'leaf') {
      px(ctx, p.x, p.y, 3, 2, p.color);
      px(ctx, p.x + 1, p.y - 1, 2, 1, p.color);
    } else {
      px(ctx, p.x, p.y, 2, 2, p.color);
    }
    ctx.restore();
  }

  if (state.flashAlpha > 0.01) {
    ctx.save();
    ctx.fillStyle = `rgba(255, 250, 255, ${state.flashAlpha})`;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.restore();
  }
}

function drawBedroomScene(ctx: CanvasRenderingContext2D, state: DrawState) {
  const night = state.specialActive;
  px(ctx, 0, 0, CANVAS_W, CANVAS_H, night ? '#59424b' : '#e6b29a');
  px(ctx, 0, 146, CANVAS_W, 56, night ? '#3c2a34' : '#caa08c');
  px(ctx, 0, 144, CANVAS_W, 3, night ? '#2c1d26' : '#a87d6b');

  // Wall Flags
  drawWallFlags(ctx, 34, 22, 74, 44, 112, 22, 78, 44);

  // Nightstand & lamp
  px(ctx, 4, 116, 26, 44, '#9b6b4d');
  px(ctx, 6, 118, 22, 16, '#84593e');
  px(ctx, 12, 99, 8, 17, night ? '#ffe478' : '#e8cf72');
  if (night) {
    ctx.fillStyle = 'rgba(255, 225, 130, 0.22)';
    ctx.beginPath();
    ctx.arc(16, 106, 26, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bed Headboard & Pillows
  px(ctx, 36, 86, 152, 40, '#272c3a');
  px(ctx, 38, 88, 148, 3, '#3c4356');
  px(ctx, 46, 94, 46, 20, '#f3a1b5');
  px(ctx, 56, 100, 2, 2, '#d8708d');
  px(ctx, 68, 100, 2, 2, '#d8708d');
  px(ctx, 130, 94, 46, 20, '#6c5348');
  px(ctx, 136, 98, 34, 2, '#987c6e');

  // Couple tucked cozily in bed (NO teddy bear!)
  const hugDist = state.hugging ? 12 : 0;
  drawHerSprite(ctx, 96, 138, state.herOutfit, state.time, { seated: true, hugOffset: hugDist });
  drawHisSprite(ctx, 144, 138, state.hisOutfit, state.time, { seated: true, hugOffset: -hugDist });

  // Plush pink blanket over them
  px(ctx, 32, 122, 158, 56, night ? '#a15d74' : '#f4b3c5');
  px(ctx, 32, 122, 158, 4, night ? '#be738b' : '#fad2dd');
  px(ctx, 45, 138, 40, 3, night ? '#8a4c62' : '#e092a9');
  px(ctx, 110, 146, 62, 3, night ? '#8a4c62' : '#e092a9');

  // White Armchair
  px(ctx, 194, 112, 48, 66, night ? '#8e868d' : '#edeae6');
  px(ctx, 200, 124, 36, 30, '#e5e0db');
  px(ctx, 206, 130, 8, 8, '#302c32');
  px(ctx, 220, 134, 8, 8, '#302c32');

  // White Bookshelf & Certificates
  px(ctx, 248, 46, 74, 136, night ? '#948b92' : '#f2eff0');
  px(ctx, 252, 50, 66, 20, '#1e2028');
  px(ctx, 268, 58, 34, 4, '#a5f3fc');
  px(ctx, 252, 74, 66, 24, '#362e34');
  px(ctx, 274, 76, 22, 20, '#9b7fb6');
  px(ctx, 298, 86, 10, 10, '#f49cbb');
  px(ctx, 252, 102, 66, 24, '#362e34');
  px(ctx, 286, 108, 14, 14, night ? '#ffd97d' : '#b8a088');
  px(ctx, 252, 130, 66, 24, '#362e34');
  for (let i = 0; i < 4; i++) {
    const bx = 258 + i * 15;
    px(ctx, bx, 136, 7, 16, '#cfdbe6');
    px(ctx, bx + 2, 133, 3, 3, '#8ca8c4');
    px(ctx, bx + 1, 142, 5, 5, '#4b7ea6');
  }
  px(ctx, 246, 14, 60, 32, '#e2e5ea');
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  ctx.strokeRect(246.5, 14.5, 59, 31);
  px(ctx, 256, 23, 40, 4, '#1e293b');
  px(ctx, 258, 30, 36, 5, '#0f172a');
  px(ctx, 298, 17, 6, 4, '#22c55e');

  if (night) {
    ctx.fillStyle = 'rgba(30, 18, 42, 0.28)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = 'rgba(255, 220, 140, 0.16)';
    ctx.beginPath();
    ctx.arc(293, 115, 36, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawStudioScene(ctx: CanvasRenderingContext2D, state: DrawState) {
  px(ctx, 0, 0, CANVAS_W, CANVAS_H, '#f8a5cc');
  px(ctx, 0, 152, CANVAS_W, 50, '#ee8bb8');
  px(ctx, 0, 150, CANVAS_W, 3, '#d972a0');

  for (let rx = 96; rx < 264; rx += 12) {
    for (let ry = 158; ry < 186; ry += 7) {
      const alt = ((rx / 12 + ry / 7) | 0) % 2 === 0;
      px(ctx, rx, ry, 12, 7, alt ? '#fce7f3' : '#f472b6');
    }
  }

  drawWallFlags(ctx, 108, 22, 68, 34, 184, 22, 68, 34);

  px(ctx, 22, 50, 46, 88, '#54352d');
  px(ctx, 26, 54, 38, 80, '#d8e7f3');
  px(ctx, 30, 58, 8, 60, '#ebf4fa');
  px(ctx, 50, 118, 10, 10, '#f49ac1');
  px(ctx, 52, 120, 6, 6, '#887279');

  px(ctx, 290, 118, 42, 34, '#6b473a');
  px(ctx, 288, 116, 46, 4, '#8b5e4e');
  px(ctx, 300, 104, 16, 4, '#ec8eb0');
  px(ctx, 298, 106, 4, 8, '#f4a7c3');
  px(ctx, 314, 106, 4, 8, '#f4a7c3');

  for (let i = 0; i < 6; i++) {
    const hx = 40 + i * 56;
    const hy = 24 + Math.sin(state.time * 1.6 + i) * 5;
    drawPixelHeart(ctx, hx, hy, '#fdf2f8', 1);
  }

  const hugDist = state.hugging ? 14 : 0;
  drawHerSprite(ctx, 152, 168, state.herOutfit, state.time, {
    holdingPhone: true,
    hugOffset: hugDist,
  });
  drawHisSprite(ctx, 206, 168, state.hisOutfit, state.time, {
    hugOffset: -hugDist,
  });

  if (state.hugging) {
    drawPixelHeart(ctx, 175, 112, '#e11d48', 2);
  }
}

// Cute soft minimalist Kiss Scene!
function drawKissScene(ctx: CanvasRenderingContext2D, state: DrawState) {
  px(ctx, 0, 0, CANVAS_W, CANVAS_H, '#361b35');
  px(ctx, 0, 38, CANVAS_W, 122, '#4a2243');
  px(ctx, 0, 160, CANVAS_W, 42, '#2a1529');

  ctx.fillStyle = 'rgba(244, 114, 182, 0.22)';
  ctx.beginPath();
  ctx.arc(CANVAS_W / 2, 110, 82, 0, Math.PI * 2);
  ctx.fill();

  // Evening starry window
  px(ctx, 126, 42, 108, 58, '#1c1738');
  ctx.strokeStyle = '#6f3a60';
  ctx.lineWidth = 3;
  ctx.strokeRect(126.5, 42.5, 107, 57);
  px(ctx, 179, 42, 2, 58, '#6f3a60');
  px(ctx, 210, 52, 9, 9, '#fef08a');
  px(ctx, 214, 52, 6, 6, '#1c1738');
  for (let i = 0; i < 8; i++) {
    const sx = 136 + ((i * 21) % 88);
    const sy = 50 + ((i * 15) % 40);
    px(ctx, sx, sy, 2, 2, Math.sin(state.time * 3 + i) > 0.2 ? '#fef9c3' : '#94a3b8');
  }

  // Fairy lights garland
  ctx.strokeStyle = '#2b182a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 14);
  ctx.quadraticCurveTo(CANVAS_W / 2, 32, CANVAS_W, 14);
  ctx.stroke();
  for (let i = 1; i <= 11; i++) {
    const lx = (CANVAS_W / 12) * i;
    const t = i / 12;
    const ly = 14 + Math.sin(t * Math.PI) * 10;
    const glow = Math.sin(state.time * 4 + i) > 0 ? '#fde68a' : '#f9a8d4';
    px(ctx, lx - 2, ly, 4, 4, glow);
  }

  // Gentle rising hearts
  for (let i = 0; i < 6; i++) {
    const hx = 38 + i * 56;
    const hy = 152 - ((state.time * 14 + i * 26) % 104);
    drawPixelHeart(ctx, hx, hy, i % 2 === 0 ? '#fb7185' : '#f472b6', 1);
  }

  // Cute soft kissing couple standing right next to each other!
  const kissCloser = state.specialActive || state.hugging ? 2 : 0;
  const cx = CANVAS_W / 2;
  const cy = 172;
  const bob = Math.sin(state.time * 2.2) * 0.6;

  // HER (left, leaning right for a kiss)
  const hx = cx - 9 + kissCloser;
  const hy = Math.round(cy + bob);
  // Legs & skirt
  px(ctx, hx - 4, hy - 11, 3, 10, '#f3cbb8');
  px(ctx, hx + 1, hy - 11, 3, 10, '#f3cbb8');
  px(ctx, hx - 4, hy - 2, 3, 2, '#2d242a');
  px(ctx, hx + 1, hy - 2, 3, 2, '#2d242a');
  px(ctx, hx - 7, hy - 16, 14, 6, state.herOutfit === 'cat_tee' ? '#f3f1f5' : '#1c1d24');
  // Top
  const herTopCol =
    state.herOutfit === 'velvet_red'
      ? '#b92632'
      : state.herOutfit === 'tribal_black'
      ? '#c62828'
      : '#1a1a20';
  px(ctx, hx - 6, hy - 26, 12, 11, herTopCol);
  if (state.herOutfit === 'ebash_tee') {
    px(ctx, hx - 4, hy - 23, 8, 2, '#e7e5e4');
    px(ctx, hx - 3, hy - 19, 6, 2, '#e7e5e4');
  }
  // Arm hugging him
  px(ctx, hx + 5, hy - 22, 6, 3, '#f8d5c6');
  // Rounded Head & wavy blonde hair ending right at the shoulders
  px(ctx, hx - 9, hy - 36, 6, 13, '#deb872');
  px(ctx, hx - 10, hy - 29, 4, 6, '#f5dc9c');
  px(ctx, hx - 9, hy - 25, 3, 2, '#f5bcc8');
  px(ctx, hx - 4, hy - 37, 9, 1, '#fbe0d2');
  px(ctx, hx - 5, hy - 36, 11, 8, '#fbe0d2');
  px(ctx, hx - 4, hy - 28, 9, 2, '#fbe0d2');
  px(ctx, hx - 5, hy - 39, 10, 2, '#f5dc9c');
  px(ctx, hx - 7, hy - 38, 12, 3, '#f5dc9c');
  px(ctx, hx + 2, hy - 35, 3, 2, '#f5dc9c');
  px(ctx, hx + 2, hy - 33, 2, 1, '#3b2c35');
  px(ctx, hx + 1, hy - 30, 2, 1, '#f493ad');
  px(ctx, hx + 5, hy - 28, 2, 1, '#d96b7e');
  if (state.herOutfit === 'cat_tee') {
    px(ctx, hx - 5, hy - 41, 9, 2, '#ec8eb0');
    px(ctx, hx - 4, hy - 35, 3, 6, '#f4a7c3');
  }

  // HIM (right, leaning left for a kiss — rounded face + subtle 1px jawline beard)
  const mx = cx + 9 - kissCloser;
  const my = Math.round(cy + bob);
  px(ctx, mx - 5, my - 12, 5, 10, state.hisOutfit === 'tactical' ? '#464f39' : '#18191e');
  px(ctx, mx + 1, my - 12, 5, 10, state.hisOutfit === 'tactical' ? '#464f39' : '#18191e');
  px(ctx, mx - 6, my - 2, 6, 2, '#d8d4c8');
  px(ctx, mx + 1, my - 2, 6, 2, '#d8d4c8');
  px(ctx, mx - 8, my - 28, 16, 16, state.hisOutfit === 'tactical' ? '#505b3e' : '#1a1a20');
  if (state.hisOutfit !== 'tactical') {
    px(ctx, mx - 5, my - 23, 10, 2, '#e7e5e4');
    px(ctx, mx - 4, my - 19, 8, 2, '#e7e5e4');
  }
  px(ctx, mx - 11, my - 19, 6, 3, '#f7d5c6');

  if (state.hisOutfit === 'balaclava') {
    px(ctx, mx - 5, my - 42, 11, 14, '#f5f3ee');
    px(ctx, mx - 6, my - 40, 13, 10, '#f5f3ee');
    px(ctx, mx - 5, my - 37, 3, 2, '#4a3530');
  } else {
    px(ctx, mx - 5, my - 40, 10, 1, '#fce0d4');
    px(ctx, mx - 6, my - 39, 12, 8, '#fce0d4');
    px(ctx, mx - 5, my - 31, 10, 2, '#fce0d4');
    px(ctx, mx - 4, my - 29, 7, 1, '#fce0d4');
    // Subtle 1px chin beard along bottom edge
    px(ctx, mx - 4, my - 29, 7, 1, '#8a6c5f');
    px(ctx, mx - 6, my - 31, 1, 1, '#8a6c5f');

    px(ctx, mx - 6, my - 31, 1, 1, '#c98580');
    px(ctx, mx - 4, my - 35, 2, 1, '#3a2b28');
    px(ctx, mx - 3, my - 33, 2, 1, '#f5a8a8');
    px(ctx, mx - 4, my - 43, 10, 2, '#58423a');
    px(ctx, mx - 6, my - 41, 13, 3, '#47342e');
    if (state.hisOutfit === 'tactical') {
      px(ctx, mx - 7, my - 44, 15, 6, '#848360');
    }
  }

  // Heart floating right above the kiss!
  const heartBob = Math.sin(state.time * 4) * 2;
  drawPixelHeart(ctx, cx - 3, cy - 52 + heartBob, '#f43f5e', 1);
}

function drawConcertScene(ctx: CanvasRenderingContext2D, state: DrawState) {
  const mosh = state.specialActive;
  px(ctx, 0, 0, CANVAS_W, CANVAS_H, '#161124');

  ctx.strokeStyle = '#2c2242';
  ctx.lineWidth = 4;
  for (let r = 60; r <= 240; r += 36) {
    ctx.beginPath();
    ctx.arc(CANVAS_W / 2, 140, r, Math.PI, 0);
    ctx.stroke();
  }

  ctx.strokeStyle = '#5b5272';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(CANVAS_W / 2, 115, 84, Math.PI, 0);
  ctx.stroke();

  // Pure Glowing Stage Screen (NO text!)
  px(ctx, 118, 52, 124, 42, '#2d1c3d');
  const grad = ctx.createLinearGradient(122, 56, 238, 90);
  grad.addColorStop(0, '#ec4899');
  grad.addColorStop(0.5, '#a855f7');
  grad.addColorStop(1, '#38bdf8');
  ctx.fillStyle = grad;
  ctx.fillRect(122, 56, 116, 34);
  for (let i = 0; i < 11; i++) {
    const barH = 4 + Math.abs(Math.sin(state.time * 6 + i * 0.7)) * 16;
    px(ctx, 128 + i * 10, 88 - barH, 6, barH, 'rgba(255,255,255,0.28)');
  }

  px(ctx, 175, 86, 10, 18, '#0c0814');
  px(ctx, 177, 80, 6, 6, '#0c0814');
  px(ctx, 198, 92, 16, 12, '#1f1630');

  const sway1 = Math.sin(state.time * (mosh ? 4.5 : 2.1)) * 55;
  const sway2 = Math.cos(state.time * (mosh ? 4.1 : 1.8)) * 55;
  ctx.save();
  ctx.fillStyle = 'rgba(186, 230, 253, 0.19)';
  ctx.beginPath();
  ctx.moveTo(154, 30);
  ctx.lineTo(100 + sway1, 165);
  ctx.lineTo(155 + sway1, 165);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(244, 63, 94, 0.20)';
  ctx.beginPath();
  ctx.moveTo(206, 30);
  ctx.lineTo(200 + sway2, 165);
  ctx.lineTo(258 + sway2, 165);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  px(ctx, 0, 104, CANVAS_W, 98, '#3b0e20');
  px(ctx, 0, 126, CANVAS_W, 76, '#230b19');

  for (let i = 0; i < 26; i++) {
    const cx = 10 + i * 14;
    const bounce = Math.abs(Math.sin(state.time * (mosh ? 9 : 4.5) + i)) * (mosh ? 4 : 2);
    const cy = 114 - bounce;
    px(ctx, cx, cy, 8, 14, '#140c18');
    px(ctx, cx + 1, cy - 5, 6, 5, '#140c18');
    if (i % 2 === 0) {
      px(ctx, cx + 5, cy - 8, 3, 4, i % 4 === 0 ? '#fef08a' : '#fbcfe8');
    }
  }

  const hugDist = state.hugging ? 12 : 0;
  const jumpOffset = mosh ? Math.abs(Math.sin(state.time * 9)) * -4 : 0;
  drawHerSprite(ctx, 152, 184 + jumpOffset, state.herOutfit, state.time, {
    waving: true,
    hugOffset: hugDist,
  });
  drawHisSprite(ctx, 206, 184 + jumpOffset, state.hisOutfit, state.time, {
    waving: true,
    hugOffset: -hugDist,
  });
}

function drawCourtyardScene(ctx: CanvasRenderingContext2D, state: DrawState) {
  px(ctx, 0, 0, CANVAS_W, 134, '#86ccf4');
  const cloudX1 = (state.time * 8) % (CANVAS_W + 60) - 40;
  px(ctx, cloudX1, 20, 38, 10, '#f8fafc');
  px(ctx, cloudX1 + 8, 15, 22, 6, '#f8fafc');

  px(ctx, 0, 96, 170, 38, '#d4cdc2');
  px(ctx, 0, 94, 170, 4, '#a69e92');
  px(ctx, 170, 104, 190, 30, '#bab3a8');

  px(ctx, 256, 84, 78, 52, '#5c6670');
  px(ctx, 260, 90, 70, 42, '#8294a3');
  px(ctx, 254, 82, 82, 4, '#3e464f');

  const treeSway = state.specialActive
    ? Math.sin(state.time * 6) * 2
    : Math.sin(state.time * 1.5) * 0.6;
  px(ctx, 76, 36, 10, 98, '#5c4033');
  px(ctx, 294, 40, 12, 94, '#5c4033');
  const canopies = [
    [40, 6, 70, 42, '#2d6a3e'],
    [54, 14, 58, 34, '#438a4e'],
    [220, 4, 110, 52, '#2d6a3e'],
    [244, 16, 86, 40, '#4d9b56'],
    [130, 0, 80, 34, '#377a47'],
  ] as const;
  for (const [cx, cy, cw, ch, col] of canopies) {
    px(ctx, cx + treeSway, cy, cw, ch, col);
  }

  px(ctx, 48, 86, 3, 52, '#71717a');
  ctx.fillStyle = '#e11d48';
  ctx.beginPath();
  ctx.arc(49.5, 70, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
  px(ctx, 41, 68, 17, 4, '#ffffff');

  px(ctx, 0, 134, CANVAS_W, 68, '#9ca3af');
  px(ctx, 0, 134, CANVAS_W, 3, '#6b7280');

  const hugDist = state.hugging ? 14 : 0;
  drawHerSprite(ctx, 152, 168, state.herOutfit, state.time, {
    hugOffset: hugDist,
  });
  drawHisSprite(ctx, 206, 168, state.hisOutfit, state.time, {
    hugOffset: -hugDist,
  });
}
