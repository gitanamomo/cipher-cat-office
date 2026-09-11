import React, { useState } from 'react';
import { sfx } from '@/lib/audio';

interface PuzzleBoxModalProps {
  onClose: () => void;
  onSolve: () => void;
  isAlreadySolved: boolean;
  boxImage: string;
}

// Dial symbols in Tintin comic style
const SYMBOLS = ['★', '☾', '👁', '▲', '⬟', '☼'];

export const PuzzleBoxModal: React.FC<PuzzleBoxModalProps> = ({
  onClose,
  onSolve,
  isAlreadySolved,
  boxImage,
}) => {
  // 4 dials, target solution is: ★ (Star), ☾ (Crescent Moon), 👁 (All-Seeing Eye), ▲ (Pyramid)
  // Indices: Star=0, Moon=1, Eye=2, Pyramid=3
  const [dials, setDials] = useState<number[]>([2, 4, 1, 5]);
  const [solved, setSolved] = useState<boolean>(isAlreadySolved);
  const [feedback, setFeedback] = useState<string>(
    isAlreadySolved
      ? 'The brass cylinders have locked into place, the inner chamber is open!'
      : 'Intricate brass gears connect the tumblers. Align the four esoteric symbols!'
  );

  const rotateDial = (index: number, direction: 1 | -1) => {
    if (solved) return;
    sfx.click();

    setDials((prev) => {
      const next = [...prev];
      // Turning dial also slightly engages neighboring gears
      next[index] = (next[index] + direction + SYMBOLS.length) % SYMBOLS.length;

      // Subtle mechanical coupling: Dial 1 couples with Dial 2
      if (index === 0 && Math.random() > 0.6) {
        next[1] = (next[1] + 1) % SYMBOLS.length;
      }

      // Check win condition: 0 (★), 1 (☾), 2 (👁), 3 (▲)
      if (next[0] === 0 && next[1] === 1 && next[2] === 2 && next[3] === 3) {
        sfx.gearClunk();
        setTimeout(() => sfx.puzzleSolved(), 200);
        setSolved(true);
        setFeedback('CLICK-WHIRRR! The brass gears engage! A secret drawer slides out!');
        onSolve();
      } else {
        setFeedback(`Dial ${index + 1} turned. Gears rattle softly.`);
      }

      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#e3d5be] border-4 border-[#3c2a1a] rounded-lg shadow-2xl p-6 text-[#2a1c12] flex flex-col md:flex-row gap-6 font-serif">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-[#3c2a1a] text-[#e3d5be] px-3 py-1 text-sm font-bold rounded hover:bg-[#5a3e26] transition-colors border border-[#8c6747]"
        >
          ✕ CLOSE
        </button>

        {/* Left Side: Close-up illustration */}
        <div className="md:w-1/2 flex flex-col items-center">
          <div className="relative border-4 border-[#5a3e26] rounded-md overflow-hidden shadow-inner bg-[#26170d]">
            <img
              src={boxImage}
              alt="Mechanical Puzzle Box"
              className="w-full h-auto object-cover max-h-[360px]"
            />
            {/* Overlay animated gear indicator */}
            <div className="absolute top-2 left-2 bg-[#1b120c]/80 text-[#d4af37] px-2 py-0.5 rounded text-xs font-mono border border-[#8c6747]">
              BRASS MECHANISM Mk.IV
            </div>
            {solved && (
              <div className="absolute inset-0 bg-[#d4af37]/20 flex items-center justify-center animate-pulse">
                <span className="bg-[#2a1a0c] text-[#d4af37] px-4 py-2 rounded-lg font-bold border-2 border-[#d4af37] shadow-xl text-lg">
                  UNLOCKED
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 text-xs text-[#5c4028] text-center italic bg-[#d9c7a7] p-2 rounded border border-[#bda582] w-full">
            &ldquo;As the stars align with the moon, the eye beholds the sacred pyramid.&rdquo; &mdash; Whitmore&apos;s Journal
          </div>
        </div>

        {/* Right Side: Interactive Dials & Controls */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="border-b-2 border-[#8c6747] pb-2 mb-4">
              <h2 className="text-2xl font-bold tracking-wide text-[#3c2a1a] uppercase flex items-center gap-2">
                <span>⚙</span> The Brass Puzzle Box
              </h2>
              <p className="text-xs text-[#6e4e32]">
                Professor Layton Style Mystery Chamber
              </p>
            </div>

            <p className="text-sm leading-relaxed mb-6 bg-[#f2e7d3] p-3 rounded border border-[#caa982]">
              {feedback}
            </p>

            {/* Dials Container */}
            <div className="grid grid-cols-4 gap-3 text-center my-4">
              {dials.map((val, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center bg-[#cbb898] p-2 rounded-lg border-2 border-[#7a5938] shadow"
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#4a3522] mb-1">
                    Ring {idx + 1}
                  </span>

                  {/* Up button */}
                  <button
                    disabled={solved}
                    onClick={() => rotateDial(idx, -1)}
                    className="w-10 h-8 bg-[#8c6747] hover:bg-[#a67c52] text-[#fff] font-bold rounded flex items-center justify-center shadow active:scale-95 disabled:opacity-40"
                  >
                    ▲
                  </button>

                  {/* Current Symbol Display */}
                  <div className="my-2 w-12 h-14 bg-[#2e1d11] text-[#f4d06f] text-2xl font-bold flex items-center justify-center rounded border-2 border-[#9e764e] shadow-inner select-none transition-transform duration-150">
                    {SYMBOLS[val]}
                  </div>

                  {/* Down button */}
                  <button
                    disabled={solved}
                    onClick={() => rotateDial(idx, 1)}
                    className="w-10 h-8 bg-[#8c6747] hover:bg-[#a67c52] text-[#fff] font-bold rounded flex items-center justify-center shadow active:scale-95 disabled:opacity-40"
                  >
                    ▼
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons / Result */}
          <div className="pt-4 border-t border-[#8c6747] flex justify-between items-center">
            <button
              onClick={() => {
                sfx.gearClunk();
                setDials([0, 1, 2, 3]);
                setSolved(true);
                sfx.puzzleSolved();
                setFeedback('Auto-aligned mechanism unlocked!');
                onSolve();
              }}
              className="text-xs text-[#7c5a3a] hover:underline"
            >
              [ Detective Felix Auto-Solve ]
            </button>

            {solved && (
              <span className="text-xs bg-[#4a7c38] text-white px-3 py-1 rounded-full font-bold animate-bounce">
                ✓ Solved! Items Retrieved
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
