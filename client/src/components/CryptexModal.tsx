import React, { useState } from 'react';
import { sfx } from '@/lib/audio';

interface CryptexModalProps {
  onClose: () => void;
  onSolve: () => void;
  isAlreadySolved: boolean;
  cryptexImage: string;
}

// Letter cylinders for the cryptex: target word is "LUXOR" (the ancient detective's master passphrase)
const WHEELS = [
  ['L', 'A', 'K', 'M', 'P', 'T'],
  ['U', 'E', 'O', 'I', 'A', 'Y'],
  ['X', 'S', 'Z', 'C', 'V', 'B'],
  ['O', 'I', 'U', 'E', 'A', 'R'],
  ['R', 'T', 'S', 'N', 'D', 'L'],
];

export const CryptexModal: React.FC<CryptexModalProps> = ({
  onClose,
  onSolve,
  isAlreadySolved,
  cryptexImage,
}) => {
  // Current wheel indices. Target: 0, 0, 0, 0, 0 => "L", "U", "X", "O", "R"
  const [indices, setIndices] = useState<number[]>([2, 3, 1, 4, 2]);
  const [solved, setSolved] = useState<boolean>(isAlreadySolved);
  const [feedback, setFeedback] = useState<string>(
    isAlreadySolved
      ? 'The cryptex cylinder has separated! The master exit key is inside!'
      : 'Turn the 5 brass letter rings to align the hidden cipher word along the red hairline.'
  );

  const rotateWheel = (wheelIdx: number, step: 1 | -1) => {
    if (solved) return;
    sfx.tumbler();

    setIndices((prev) => {
      const next = [...prev];
      const len = WHEELS[wheelIdx].length;
      next[wheelIdx] = (next[wheelIdx] + step + len) % len;

      // Check win condition: "L", "U", "X", "O", "R"
      const currentWord = next.map((idx, w) => WHEELS[w][idx]).join('');
      if (currentWord === 'LUXOR') {
        sfx.gearClunk();
        setTimeout(() => sfx.puzzleSolved(), 250);
        setSolved(true);
        setFeedback('A heavy pneumatic hiss! The cryptex unscrews to reveal the Golden Master Key!');
        onSolve();
      } else {
        setFeedback(`Current alignment: ${currentWord}. Brass springs click softly.`);
      }

      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#e3d5be] border-4 border-[#3c2a1a] rounded-lg shadow-2xl p-6 text-[#2a1c12] flex flex-col md:flex-row gap-6 font-serif">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-[#3c2a1a] text-[#e3d5be] px-3 py-1 text-sm font-bold rounded hover:bg-[#5a3e26] transition-colors border border-[#8c6747]"
        >
          ✕ CLOSE
        </button>

        {/* Left Side: Art illustration */}
        <div className="md:w-1/2 flex flex-col items-center">
          <div className="relative border-4 border-[#5a3e26] rounded-md overflow-hidden shadow-inner bg-[#26170d]">
            <img
              src={cryptexImage}
              alt="Steampunk Cryptex"
              className="w-full h-auto object-cover max-h-[360px]"
            />
            <div className="absolute top-2 left-2 bg-[#1b120c]/80 text-[#d4af37] px-2 py-0.5 rounded text-xs font-mono border border-[#8c6747]">
              STEAMPUNK CRYPTEX v2.0
            </div>
            {solved && (
              <div className="absolute inset-0 bg-[#d4af37]/20 flex items-center justify-center animate-pulse">
                <span className="bg-[#2a1a0c] text-[#d4af37] px-4 py-2 rounded-lg font-bold border-2 border-[#d4af37] shadow-xl text-lg">
                  CYLINDER UNLOCKED
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 text-xs text-[#5c4028] text-center italic bg-[#d9c7a7] p-2 rounded border border-[#bda582] w-full">
            &ldquo;Seek the light of Egyptian ruins — the city of palaces that shines in the dark.&rdquo; &mdash; Inspector Felix&apos;s Clue
          </div>
        </div>

        {/* Right Side: Cryptex Letter Ring UI */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="border-b-2 border-[#8c6747] pb-2 mb-3">
              <h2 className="text-2xl font-bold tracking-wide text-[#3c2a1a] uppercase flex items-center gap-2">
                <span>🔐</span> The Steampunk Cryptex
              </h2>
              <p className="text-xs text-[#6e4e32]">
                Professor Layton Style Word Lock Mechanism
              </p>
            </div>

            <p className="text-sm leading-relaxed mb-4 bg-[#f2e7d3] p-3 rounded border border-[#caa982]">
              {feedback}
            </p>

            {/* Alignment line indicator */}
            <div className="relative flex justify-center items-center py-4 bg-[#23150c] rounded-xl border-4 border-[#78532f] shadow-inner">
              {/* Red indicator bar */}
              <div className="absolute left-2 right-2 h-10 border-y-2 border-red-500/80 bg-red-950/20 pointer-events-none z-10 flex justify-between items-center px-1">
                <span className="text-red-500 text-xs font-bold">▶</span>
                <span className="text-red-500 text-xs font-bold">◀</span>
              </div>

              {/* 5 Wheel columns */}
              <div className="grid grid-cols-5 gap-2 px-6 z-20">
                {indices.map((val, wIdx) => {
                  const letters = WHEELS[wIdx];
                  const len = letters.length;
                  const prevLetter = letters[(val - 1 + len) % len];
                  const currentLetter = letters[val];
                  const nextLetter = letters[(val + 1) % len];

                  return (
                    <div key={wIdx} className="flex flex-col items-center">
                      <button
                        disabled={solved}
                        onClick={() => rotateWheel(wIdx, -1)}
                        className="w-8 h-7 bg-[#8c6747] hover:bg-[#a67c52] text-white text-xs font-bold rounded-t flex items-center justify-center active:scale-95 disabled:opacity-40"
                      >
                        ▲
                      </button>

                      {/* Barrel representation */}
                      <div className="w-10 bg-[#e8ddc9] text-[#2c1d11] font-mono text-center border-x-2 border-[#5c4028] shadow-inner py-1 select-none">
                        <div className="text-[10px] text-[#998369] opacity-60 h-4">
                          {prevLetter}
                        </div>
                        <div className="text-xl font-black text-[#852815] bg-[#fff6e6] py-1 border-y border-[#ab8a6b]">
                          {currentLetter}
                        </div>
                        <div className="text-[10px] text-[#998369] opacity-60 h-4">
                          {nextLetter}
                        </div>
                      </div>

                      <button
                        disabled={solved}
                        onClick={() => rotateWheel(wIdx, 1)}
                        className="w-8 h-7 bg-[#8c6747] hover:bg-[#a67c52] text-white text-xs font-bold rounded-b flex items-center justify-center active:scale-95 disabled:opacity-40"
                      >
                        ▼
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="pt-4 border-t border-[#8c6747] flex justify-between items-center">
            <button
              onClick={() => {
                sfx.gearClunk();
                setIndices([0, 0, 0, 0, 0]);
                setSolved(true);
                sfx.puzzleSolved();
                setFeedback('LUXOR cipher matched! Master exit key obtained!');
                onSolve();
              }}
              className="text-xs text-[#7c5a3a] hover:underline"
            >
              [ Inspector Felix Clue Hint ]
            </button>

            {solved && (
              <span className="text-xs bg-[#4a7c38] text-white px-3 py-1 rounded-full font-bold animate-bounce">
                ✓ Solved! Master Key Acquired
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
