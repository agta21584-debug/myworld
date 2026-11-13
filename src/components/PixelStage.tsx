import React, { useEffect, useRef, useState } from 'react';
import { SCENES } from '../data/scenesData';
import { HerOutfitId, HisOutfitId, SceneId } from '../types/scenes';
import { pixelAudio } from '../utils/sound';
import { CANVAS_H, CANVAS_W, drawScene, Particle } from './pixel/PixelSprites';

interface DialogueBubble {
  id: number;
  speaker: 'her' | 'him' | 'love';
  text: string;
}

interface PixelStageProps {
  sceneId: SceneId;
  herOutfit: HerOutfitId;
  hisOutfit: HisOutfitId;
  specialActive: boolean;
  hugging: boolean;
  flashTrigger: number;
  foundHearts: Record<SceneId, boolean>;
  onCollectHeart: (sceneId: SceneId) => void;
  onHugBurst: () => void;
}

export const PixelStage: React.FC<PixelStageProps> = ({
  sceneId,
  herOutfit,
  hisOutfit,
  specialActive,
  hugging,
  flashTrigger,
  foundHearts,
  onCollectHeart,
  onHugBurst,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const flashAlphaRef = useRef(0);
  const herLineIndexRef = useRef(0);
  const hisLineIndexRef = useRef(0);

  const [bubble, setBubble] = useState<DialogueBubble | null>(null);
  const [hoverHint, setHoverHint] = useState<string | null>(null);

  const scene = SCENES[sceneId];

  useEffect(() => {
    setBubble({
      id: Date.now(),
      speaker: 'love',
      text: scene.sweetOpening,
    });
    herLineIndexRef.current = 0;
    hisLineIndexRef.current = 0;
  }, [sceneId, scene.sweetOpening]);

  useEffect(() => {
    if (flashTrigger > 0) {
      if (sceneId === 'kiss') {
        spawnBurst(CANVAS_W / 2, 108, 'heart', '#f43f5e', 16);
        setBubble({
          id: Date.now(),
          speaker: 'love',
          text: 'Сладкий поцелуй для двоих ♥',
        });
      } else {
        flashAlphaRef.current = 0.92;
        spawnBurst(192, 108, 'sparkle', '#ffffff', 16);
      }
    }
  }, [flashTrigger, sceneId]);

  useEffect(() => {
    if (hugging) {
      spawnBurst(192, 118, 'heart', '#f43f5e', 12);
      setBubble({
        id: Date.now(),
        speaker: 'her',
        text: sceneId === 'kiss' ? 'Чмок! Люблю тебя ♥' : 'Обнимашки! ♥',
      });
    }
  }, [hugging, sceneId]);

  useEffect(() => {
    if (sceneId === 'courtyard' && specialActive) {
      const iv = window.setInterval(() => {
        particlesRef.current.push({
          x: Math.random() * CANVAS_W,
          y: 10 + Math.random() * 40,
          vx: 18 + Math.random() * 20,
          vy: 14 + Math.random() * 14,
          life: 0,
          maxLife: 2.8,
          kind: 'leaf',
          color: Math.random() > 0.5 ? '#4ade80' : '#22c55e',
        });
      }, 240);
      return () => window.clearInterval(iv);
    }
  }, [sceneId, specialActive]);

  function spawnBurst(
    x: number,
    y: number,
    kind: Particle['kind'],
    color: string,
    count: number
  ) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const speed = 15 + Math.random() * 35;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 18,
        life: 0,
        maxLife: 1.1 + Math.random() * 0.6,
        kind,
        color,
      });
    }
  }

  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const nextParticles: Particle[] = [];
      for (const p of particlesRef.current) {
        p.life += dt;
        if (p.life < p.maxLife) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          if (p.kind !== 'leaf') {
            p.vy += 12 * dt;
          }
          nextParticles.push(p);
        }
      }
      particlesRef.current = nextParticles;

      if (flashAlphaRef.current > 0) {
        flashAlphaRef.current = Math.max(0, flashAlphaRef.current - dt * 2.4);
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          drawScene(ctx, {
            scene: sceneId,
            time: now / 1000,
            herOutfit,
            hisOutfit,
            specialActive,
            hugging,
            flashAlpha: flashAlphaRef.current,
            particles: particlesRef.current,
          });
        }
      }

      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(rafId);
  }, [sceneId, herOutfit, hisOutfit, specialActive, hugging]);

  function getLogicalCoords(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { lx: 0, ly: 0 };
    const rect = canvas.getBoundingClientRect();
    const lx = ((e.clientX - rect.left) / rect.width) * CANVAS_W;
    const ly = ((e.clientY - rect.top) / rect.height) * CANVAS_H;
    return { lx, ly };
  }

  function getHitTarget(lx: number, ly: number) {
    const herBox =
      sceneId === 'bedroom'
        ? { x: 78, y: 96, w: 36, h: 48 }
        : sceneId === 'kiss'
        ? { x: 152, y: 126, w: 28, h: 52 }
        : sceneId === 'concert'
        ? { x: 134, y: 136, w: 36, h: 56 }
        : { x: 134, y: 122, w: 36, h: 56 };

    const himBox =
      sceneId === 'bedroom'
        ? { x: 126, y: 92, w: 38, h: 52 }
        : sceneId === 'kiss'
        ? { x: 180, y: 124, w: 28, h: 54 }
        : sceneId === 'concert'
        ? { x: 188, y: 132, w: 38, h: 60 }
        : { x: 188, y: 118, w: 38, h: 60 };

    for (const hs of scene.hotspots) {
      if (lx >= hs.x && lx <= hs.x + hs.w && ly >= hs.y && ly <= hs.y + hs.h) {
        return { type: 'hotspot' as const, hotspot: hs };
      }
    }

    if (lx >= herBox.x && lx <= herBox.x + herBox.w && ly >= herBox.y && ly <= herBox.y + herBox.h) {
      return { type: 'her' as const };
    }
    if (lx >= himBox.x && lx <= himBox.x + himBox.w && ly >= himBox.y && ly <= himBox.y + himBox.h) {
      return { type: 'him' as const };
    }

    return null;
  }

  function handleCanvasMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const { lx, ly } = getLogicalCoords(e);
    const hit = getHitTarget(lx, ly);
    if (!hit) {
      setHoverHint(null);
      return;
    }
    if (hit.type === 'her') {
      setHoverHint(sceneId === 'kiss' ? 'Поцеловать ♥' : 'Нажать на неё');
    } else if (hit.type === 'him') {
      setHoverHint(sceneId === 'kiss' ? 'Поцеловать ♥' : 'Нажать на него');
    } else {
      setHoverHint(hit.hotspot.label);
    }
  }

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const { lx, ly } = getLogicalCoords(e);
    const hit = getHitTarget(lx, ly);

    if (!hit) {
      spawnBurst(lx, ly, 'heart', '#f472b6', 5);
      pixelAudio.playBlip(520, 0.05, 'triangle');
      return;
    }

    if (hit.type === 'her') {
      const lines = scene.herLines;
      const line = lines[herLineIndexRef.current % lines.length];
      herLineIndexRef.current += 1;
      setBubble({ id: Date.now(), speaker: 'her', text: line });
      spawnBurst(lx, ly - 10, 'heart', '#f472b6', 8);
      pixelAudio.playBlip(660, 0.08, 'triangle');
      return;
    }

    if (hit.type === 'him') {
      const lines = scene.himLines;
      const line = lines[hisLineIndexRef.current % lines.length];
      hisLineIndexRef.current += 1;
      setBubble({ id: Date.now(), speaker: 'him', text: line });
      spawnBurst(lx, ly - 10, 'heart', '#fb7185', 8);
      pixelAudio.playBlip(330, 0.09, 'square');
      return;
    }

    const hs = hit.hotspot;
    setBubble({
      id: Date.now(),
      speaker: hs.speaker ?? 'love',
      text: hs.message,
    });

    if (hs.grantsHeart) {
      if (!foundHearts[sceneId]) {
        onCollectHeart(sceneId);
        pixelAudio.playHeartChime();
        spawnBurst(lx, ly, 'heart', '#e11d48', 14);
      } else {
        pixelAudio.playBlip(784, 0.08, 'triangle');
        spawnBurst(lx, ly, 'heart', '#f472b6', 8);
      }
    } else {
      pixelAudio.playBlip(523, 0.07, 'triangle');
      spawnBurst(lx, ly, 'sparkle', '#fef08a', 8);
    }
  }

  return (
    <div className="relative w-full">
      <div className="relative w-full aspect-[16/9] bg-[#2b1d28] pixel-frame overflow-hidden select-none">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          onMouseMove={handleCanvasMove}
          onMouseLeave={() => setHoverHint(null)}
          onClick={handleCanvasClick}
          className={`w-full h-full block pixelated ${hoverHint ? 'cursor-pointer' : 'cursor-crosshair'}`}
        />

        {hoverHint && (
          <div className="pointer-events-none absolute top-3 left-3 bg-[#fff9fb]/95 border-2 border-[#2b1d28] px-2.5 py-1 text-xs font-semibold text-[#2b1d28] shadow-[2px_2px_0px_#2b1d28]">
            {hoverHint}
          </div>
        )}

        <div className="pointer-events-none absolute top-3 right-3 bg-[#fff9fb]/95 border-2 border-[#2b1d28] px-2.5 py-1 text-xs font-semibold text-[#2b1d28] shadow-[2px_2px_0px_#2b1d28]">
          {foundHearts[sceneId] ? '♥ Секрет найден' : '♡ Найди секрет'}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onHugBurst();
          }}
          className="absolute bottom-3 right-3 pixel-btn bg-pink-500 hover:bg-pink-400 text-white px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
        >
          {sceneId === 'kiss' ? 'Чмок ♥' : 'Обняться ♥'}
        </button>
      </div>

      {/* Cute sweet message bar — no dry "Сцена:" label or explanations */}
      <div
        role="status"
        aria-live="polite"
        className="mt-3 bg-[#fff9fb] pixel-frame-sm px-4 py-3 min-h-[52px] flex items-center justify-between gap-4"
      >
        <div className="text-sm sm:text-base leading-snug text-[#2b1d28]">
          {bubble && (
            <>
              {bubble.speaker === 'her' && (
                <span className="font-bold mr-2 text-pink-700">Она:</span>
              )}
              {bubble.speaker === 'him' && (
                <span className="font-bold mr-2 text-indigo-800">Он:</span>
              )}
              {bubble.speaker === 'love' && (
                <span className="font-bold mr-2 text-rose-600" aria-hidden="true">♥</span>
              )}
              <span>{bubble.text}</span>
            </>
          )}
        </div>
        <span className="hidden sm:inline-block text-xs text-[#6f5568] whitespace-nowrap shrink-0">
          Кликай на нас или предметы
        </span>
      </div>
    </div>
  );
};
