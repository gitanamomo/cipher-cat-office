import React from 'react';
import { sfx } from '@/lib/audio';

interface DetectiveCatDialogueProps {
  catImage: string;
  isOpen: boolean;
  onClose: () => void;
  currentHint: string;
  progressPhase: string;
}

export const DetectiveCatDialogue: React.FC<DetectiveCatDialogueProps> = ({
  catImage,
  isOpen,
  onClose,
  currentHint,
  progressPhase,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl px-4 animate-in slide-in-from-bottom-6 duration-200">
      <div className="relative bg-[#efe3cf] border-4 border-[#3b2716] rounded-xl shadow-2xl p-4 flex items-center gap-4 text-[#2b1c10] font-serif">
        {/* Cat Avatar with 1920s rubber-hose badge */}
        <div className="relative w-24 h-24 flex-shrink-0 border-4 border-[#593b22] rounded-full overflow-hidden bg-[#24180d] shadow-md ring-2 ring-[#d4af37]">
          <img
            src={catImage}
            alt="Inspector Felix Claws"
            className="w-full h-full object-cover object-top scale-125 translate-y-1"
          />
        </div>

        {/* Dialogue Bubble */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-bold uppercase tracking-wide text-[#802a1b] flex items-center gap-1.5">
              <span>🐾</span> Inspector Felix Claws
            </span>
            <span className="text-[10px] bg-[#d9c5a3] text-[#593d25] px-2 py-0.5 rounded font-mono border border-[#ab9573]">
              {progressPhase}
            </span>
          </div>

          <p className="text-sm leading-snug italic bg-[#fbf5e9] p-3 rounded border border-[#cbbaa1] shadow-inner">
            &ldquo;{currentHint}&rdquo;
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              sfx.catMeow();
              onClose();
            }}
            className="bg-[#3b2716] hover:bg-[#593b22] text-[#fbf5e9] px-3 py-1.5 text-xs font-bold rounded shadow transition-colors"
          >
            Understood!
          </button>
        </div>
      </div>
    </div>
  );
};
