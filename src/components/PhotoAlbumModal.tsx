import React, { useState } from 'react';
import { X, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { ALBUM_PHOTOS } from '../data/scenesData';
import { SceneId } from '../types/scenes';

interface PhotoAlbumModalProps {
  open: boolean;
  onClose: () => void;
  onJumpToScene: (sceneId: SceneId) => void;
}

export const PhotoAlbumModal: React.FC<PhotoAlbumModalProps> = ({
  open,
  onClose,
  onJumpToScene,
}) => {
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#fff8fa] pixel-frame w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#2b1d28] bg-[#ffdbe8]">
          <div>
            <h2 className="font-pixel-title text-sm sm:text-base text-[#2b1d28]">
              Альбом воспоминаний
            </h2>
            <p className="text-xs sm:text-sm text-[#5c3e52] mt-1">
              Фотографии, которые вдохновили каждую пиксельную сцену
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть альбом"
            className="pixel-btn bg-white hover:bg-pink-100 p-2 text-[#2b1d28]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALBUM_PHOTOS.map((photo) => (
            <div
              key={photo.id}
              className="bg-white pixel-frame-sm flex flex-col overflow-hidden"
            >
              <div className="aspect-[4/3] bg-[#f8e7ee] relative overflow-hidden border-b-2 border-[#2b1d28]">
                {!failedIds[photo.id] ? (
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    referrerPolicy="no-referrer"
                    onError={() => setFailedIds((prev) => ({ ...prev, [photo.id]: true }))}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-[#7c5c70]">
                    <ImageIcon className="w-6 h-6 mb-2" />
                    <span className="text-xs">{photo.sceneName}</span>
                  </div>
                )}
              </div>
              <div className="p-3 flex flex-col flex-1 justify-between gap-3">
                <p className="text-sm text-[#2b1d28] leading-snug">{photo.caption}</p>
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-pink-100">
                  <span className="text-xs text-[#6f5568] truncate">{photo.sceneName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      onJumpToScene(photo.sceneId);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-pink-700 hover:text-pink-900 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    В сцену
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
