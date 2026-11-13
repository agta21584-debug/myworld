import React, { useState } from 'react';
import { X, Heart } from 'lucide-react';

interface LoveNoteModalProps {
  open: boolean;
  onClose: () => void;
  coupleTitle: string;
  loveNote: string;
  onSave: (title: string, note: string) => void;
  heartsCollected: number;
  totalHearts: number;
}

export const LoveNoteModal: React.FC<LoveNoteModalProps> = ({
  open,
  onClose,
  coupleTitle,
  loveNote,
  onSave,
  heartsCollected,
  totalHearts,
}) => {
  const [titleDraft, setTitleDraft] = useState(coupleTitle);
  const [noteDraft, setNoteDraft] = useState(loveNote);

  if (!open) return null;

  const allFound = heartsCollected >= totalHearts;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#fff8fa] pixel-frame w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#2b1d28] bg-[#ffdbe8]">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
            <h2 className="font-pixel-title text-sm text-[#2b1d28]">
              Пиксельная открытка
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть открытку"
            className="pixel-btn bg-white hover:bg-pink-100 p-1.5 text-[#2b1d28]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(titleDraft.trim() || 'Наш Пиксельный Мирок', noteDraft.trim());
            onClose();
          }}
          className="p-5 space-y-4"
        >
          {allFound && (
            <div className="bg-rose-50 border-2 border-rose-400 p-3 text-sm text-rose-900">
              Все {totalHearts} секретных сердечек собраны! Пусть в вашей жизни всегда будет так же тепло, смешно и уютно, как в этих сценках ♥
            </div>
          )}

          <div>
            <label htmlFor="couple-title" className="block text-sm font-semibold text-[#2b1d28] mb-1.5">
              Заголовок сайта (ваши имена)
            </label>
            <input
              id="couple-title"
              type="text"
              maxLength={40}
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-[#2b1d28] text-sm text-[#2b1d28] focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Например: Мы с тобой ♥"
            />
          </div>

          <div>
            <label htmlFor="love-note" className="block text-sm font-semibold text-[#2b1d28] mb-1.5">
              Тёплое послание
            </label>
            <textarea
              id="love-note"
              rows={4}
              maxLength={280}
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-[#2b1d28] text-sm text-[#2b1d28] focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
              placeholder="Напиши пару милых слов для него..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="pixel-btn bg-white hover:bg-pink-50 px-4 py-2 text-sm font-semibold text-[#2b1d28]"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="pixel-btn bg-pink-500 hover:bg-pink-400 px-4 py-2 text-sm font-semibold text-white"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
