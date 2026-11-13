import { useEffect, useState } from 'react';
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Heart,
  Image as ImageIcon,
  Moon,
  Music,
  Volume2,
  VolumeX,
  Wind,
  Zap,
} from 'lucide-react';
import { LoveNoteModal } from './components/LoveNoteModal';
import { PhotoAlbumModal } from './components/PhotoAlbumModal';
import { PixelStage } from './components/PixelStage';
import { HER_OUTFITS, HIS_OUTFITS, SCENES, SCENE_ORDER } from './data/scenesData';
import { HerOutfitId, HisOutfitId, SceneId } from './types/scenes';
import { pixelAudio } from './utils/sound';

const DEFAULT_NOTE =
  'Маленький пиксельный мир про нас двоих: от уютной кроватки с флагами до концерта и летних прогулок ♥';

export default function App() {
  const [activeScene, setActiveScene] = useState<SceneId>('bedroom');
  const [herOutfit, setHerOutfit] = useState<HerOutfitId>(SCENES.bedroom.defaultHerOutfit);
  const [hisOutfit, setHisOutfit] = useState<HisOutfitId>(SCENES.bedroom.defaultHisOutfit);
  const [specialActive, setSpecialActive] = useState(false);
  const [hugging, setHugging] = useState(false);
  const [flashTrigger, setFlashTrigger] = useState(0);

  const [soundOn, setSoundOn] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  const [albumOpen, setAlbumOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  const [coupleTitle, setCoupleTitle] = useState<string>(() => {
    try {
      return localStorage.getItem('pixel_couple_title') || 'Наш Пиксельный Мирок';
    } catch {
      return 'Наш Пиксельный Мирок';
    }
  });

  const [loveNote, setLoveNote] = useState<string>(() => {
    try {
      return localStorage.getItem('pixel_couple_note') || DEFAULT_NOTE;
    } catch {
      return DEFAULT_NOTE;
    }
  });

  const [foundHearts, setFoundHearts] = useState<Record<SceneId, boolean>>(() => {
    try {
      const saved = localStorage.getItem('pixel_found_hearts');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage errors
    }
    return {
      bedroom: false,
      studio: false,
      kiss: false,
      concert: false,
      courtyard: false,
    };
  });

  const sceneMeta = SCENES[activeScene];
  const heartsCount = Object.values(foundHearts).filter(Boolean).length;

  function switchScene(nextId: SceneId) {
    setActiveScene(nextId);
    setHerOutfit(SCENES[nextId].defaultHerOutfit);
    setHisOutfit(SCENES[nextId].defaultHisOutfit);
    setSpecialActive(false);
    setHugging(false);
    pixelAudio.playBlip(587, 0.06, 'triangle');
  }

  function stepScene(dir: -1 | 1) {
    const idx = SCENE_ORDER.indexOf(activeScene);
    const nextIdx = (idx + dir + SCENE_ORDER.length) % SCENE_ORDER.length;
    switchScene(SCENE_ORDER[nextIdx]);
  }

  function handleCollectHeart(sceneId: SceneId) {
    setFoundHearts((prev) => {
      if (prev[sceneId]) return prev;
      const updated = { ...prev, [sceneId]: true };
      try {
        localStorage.setItem('pixel_found_hearts', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }

  function handleHug() {
    setHugging(true);
    pixelAudio.playHugChord();
    window.setTimeout(() => setHugging(false), 1600);
  }

  function handleSpecialAction() {
    if (activeScene === 'studio') {
      setFlashTrigger((c) => c + 1);
      pixelAudio.playShutter();
      return;
    }
    if (activeScene === 'kiss') {
      setFlashTrigger((c) => c + 1);
      setHugging(true);
      pixelAudio.playHeartChime();
      window.setTimeout(() => setHugging(false), 1400);
      return;
    }
    setSpecialActive((prev) => !prev);
    pixelAudio.playBlip(698, 0.08, 'triangle');
  }

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    pixelAudio.setEnabled(next);
    if (!next) {
      setMusicOn(false);
    }
  }

  function toggleMusic() {
    const playing = pixelAudio.toggleMusic();
    setMusicOn(playing);
    if (playing) setSoundOn(true);
  }

  function handleSaveNote(nextTitle: string, nextNote: string) {
    setCoupleTitle(nextTitle);
    setLoveNote(nextNote);
    try {
      localStorage.setItem('pixel_couple_title', nextTitle);
      localStorage.setItem('pixel_couple_note', nextNote);
    } catch {
      // ignore
    }
    pixelAudio.playHeartChime();
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (albumOpen || noteOpen) return;
      if (e.key === 'ArrowLeft') stepScene(-1);
      if (e.key === 'ArrowRight') stepScene(1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const SpecialIcon =
    activeScene === 'bedroom'
      ? Moon
      : activeScene === 'studio'
      ? Camera
      : activeScene === 'kiss'
      ? Heart
      : activeScene === 'concert'
      ? Zap
      : Wind;

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf2f6] text-[#2b1d28]">
      {/* Top Bar Contract: 3 clean zones separated by gap-8 */}
      <header className="w-full border-b-2 border-[#2b1d28] bg-[#fff9fb]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Title */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              switchScene('bedroom');
            }}
            className="font-pixel-title text-xs sm:text-sm text-[#2b1d28] whitespace-nowrap shrink-0"
          >
            {coupleTitle}
          </a>

          {/* Zone 2: 5 concise single-line scene links */}
          <nav
            aria-label="Выбор сцены"
            className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#5e4356]"
          >
            {SCENE_ORDER.map((id) => {
              const active = id === activeScene;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => switchScene(id)}
                  className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors cursor-pointer ${
                    active
                      ? 'border-pink-600 text-[#2b1d28]'
                      : 'border-transparent hover:text-[#2b1d28] hover:border-pink-300'
                  }`}
                >
                  {SCENES[id].shortTitle}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary CTA */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => {
                pixelAudio.playBlip(587, 0.06);
                setAlbumOpen(true);
              }}
              className="pixel-btn bg-pink-500 hover:bg-pink-400 text-white px-4 py-2 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Альбом фото</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Interactive Workspace */}
      <main id="top" className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Scene Header + Quick Scene Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#6f5568] mb-1">
              <span>Сцена {SCENE_ORDER.indexOf(activeScene) + 1} из {SCENE_ORDER.length}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">Сердечек: {heartsCount} / {SCENE_ORDER.length}</span>
            </div>
            <h1 className="font-pixel-title text-base sm:text-xl text-[#2b1d28] text-balance">
              {sceneMeta.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => stepScene(-1)}
              aria-label="Предыдущая сцена"
              className="pixel-btn bg-white hover:bg-pink-50 px-3 py-2 text-sm font-semibold inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>
            <button
              type="button"
              onClick={() => stepScene(1)}
              aria-label="Следующая сцена"
              className="pixel-btn bg-white hover:bg-pink-50 px-3 py-2 text-sm font-semibold inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Дальше</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Scene Switcher */}
        <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-3 mb-2">
          {SCENE_ORDER.map((id) => {
            const active = id === activeScene;
            return (
              <button
                key={id}
                type="button"
                onClick={() => switchScene(id)}
                className={`pixel-btn px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 ${
                  active ? 'bg-pink-500 text-white' : 'bg-white text-[#2b1d28]'
                }`}
              >
                {SCENES[id].shortTitle}
              </button>
            );
          })}
        </div>

        {/* Dominant Focal Anchor: Interactive Pixel Canvas */}
        <PixelStage
          sceneId={activeScene}
          herOutfit={herOutfit}
          hisOutfit={hisOutfit}
          specialActive={specialActive}
          hugging={hugging}
          flashTrigger={flashTrigger}
          foundHearts={foundHearts}
          onCollectHeart={handleCollectHeart}
          onHugBurst={handleHug}
        />

        {/* Workspace Controls: Scene Action, Audio, Note & Outfit Dressing Room */}
        <section
          aria-label="Управление сценой и образами"
          className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
        >
          {/* Left: Scene Actions & Audio */}
          <div className="lg:col-span-5 bg-[#fff9fb] pixel-frame-sm p-4 space-y-4">
            <h2 className="font-pixel-title text-xs text-[#2b1d28]">
              Действия и атмосфера
            </h2>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={handleSpecialAction}
                title={sceneMeta.specialActionHint}
                className={`pixel-btn px-3.5 py-2 text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                  specialActive
                    ? 'bg-amber-300 text-[#2b1d28]'
                    : 'bg-white hover:bg-pink-50 text-[#2b1d28]'
                }`}
              >
                <SpecialIcon className="w-4 h-4" />
                <span>{sceneMeta.specialActionLabel}</span>
              </button>

              <button
                type="button"
                onClick={toggleSound}
                className={`pixel-btn px-3.5 py-2 text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                  soundOn ? 'bg-pink-200 text-[#2b1d28]' : 'bg-white hover:bg-pink-50 text-[#2b1d28]'
                }`}
              >
                {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{soundOn ? 'Звук вкл' : 'Звук выкл'}</span>
              </button>

              <button
                type="button"
                onClick={toggleMusic}
                className={`pixel-btn px-3.5 py-2 text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                  musicOn ? 'bg-pink-500 text-white' : 'bg-white hover:bg-pink-50 text-[#2b1d28]'
                }`}
              >
                <Music className="w-4 h-4" />
                <span>{musicOn ? 'Мелодия играет' : '8-бит мелодия'}</span>
              </button>
            </div>

            <div className="pt-3 border-t border-pink-200 flex items-start justify-between gap-3">
              <p className="text-sm text-[#4f3949] leading-snug">{loveNote}</p>
              <button
                type="button"
                onClick={() => setNoteOpen(true)}
                className="pixel-btn bg-white hover:bg-pink-50 px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Открытка</span>
              </button>
            </div>
          </div>

          {/* Right: Outfit Switcher */}
          <div className="lg:col-span-7 bg-[#fff9fb] pixel-frame-sm p-4 space-y-4">
            <h2 className="font-pixel-title text-xs text-[#2b1d28]">
              Гардероб персонажей
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="her-outfit"
                  className="block text-xs font-semibold text-[#6f5568] mb-1.5"
                >
                  Её образ
                </label>
                <select
                  id="her-outfit"
                  value={herOutfit}
                  onChange={(e) => {
                    setHerOutfit(e.target.value as HerOutfitId);
                    pixelAudio.playBlip(740, 0.06, 'triangle');
                  }}
                  className="w-full px-3 py-2 bg-white border-2 border-[#2b1d28] text-sm font-semibold text-[#2b1d28] focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
                >
                  {HER_OUTFITS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="his-outfit"
                  className="block text-xs font-semibold text-[#6f5568] mb-1.5"
                >
                  Его образ
                </label>
                <select
                  id="his-outfit"
                  value={hisOutfit}
                  onChange={(e) => {
                    setHisOutfit(e.target.value as HisOutfitId);
                    pixelAudio.playBlip(392, 0.06, 'square');
                  }}
                  className="w-full px-3 py-2 bg-white border-2 border-[#2b1d28] text-sm font-semibold text-[#2b1d28] focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
                >
                  {HIS_OUTFITS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#6f5568]">
              <span>Переодевай нас в любой сцене — в том числе в парные футболки «I DON’T SLAM»</span>
              <span className="tabular-nums">
                {heartsCount === SCENE_ORDER.length
                  ? 'Все сердечки найдены ♥'
                  : `Осталось найти сердечек: ${SCENE_ORDER.length - heartsCount}`}
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Quiet Footer */}
      <footer className="w-full border-t-2 border-[#2b1d28]/15 py-4 px-4 sm:px-6 text-center text-xs text-[#6f5568]">
        <span>Создано по мотивам ваших фотографий и рисунков</span>
        <span className="mx-2" aria-hidden="true">·</span>
        <button
          type="button"
          onClick={() => setNoteOpen(true)}
          className="underline hover:text-[#2b1d28] cursor-pointer"
        >
          Редактировать открытку
        </button>
      </footer>

      <PhotoAlbumModal
        open={albumOpen}
        onClose={() => setAlbumOpen(false)}
        onJumpToScene={switchScene}
      />

      <LoveNoteModal
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        coupleTitle={coupleTitle}
        loveNote={loveNote}
        onSave={handleSaveNote}
        heartsCollected={heartsCount}
        totalHearts={SCENE_ORDER.length}
      />
    </div>
  );
}
