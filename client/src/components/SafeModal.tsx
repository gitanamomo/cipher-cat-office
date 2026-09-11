import React, { useState } from 'react';
import { sfx } from '@/lib/audio';

interface SafeModalProps {
  onClose: () => void;
  onSolve: () => void;
  isAlreadySolved: boolean;
}

export const SafeModal: React.FC<SafeModalProps> = ({
  onClose,
  onSolve,
  isAlreadySolved,
}) => {
  // Safe combination: 10 - 4 - 28 (Clock at 10, 4th drawer, 28th on calendar)
  const [currentVal, setCurrentVal] = useState<number>(0);
  const [stage, setStage] = useState<number>(0); // 0 -> waiting for 10, 1 -> waiting for 4, 2 -> waiting for 28
  const [solved, setSolved] = useState<boolean>(isAlreadySolved);
  const [feedback, setFeedback] = useState<string>(
    isAlreadySolved
      ? 'The heavy cast iron safe door swings open on oiled hinges!'
      : 'Turn the dial left and right to align the 3-step combination lock.'
  );

  const turnDial = (delta: number) => {
    if (solved) return;
    sfx.tumbler();
    const nextVal = (currentVal + delta + 40) % 40;
    setCurrentVal(nextVal);
  };

  const confirmNumber = () => {
    if (solved) return;
    sfx.click();

    if (stage === 0) {
      if (currentVal === 10) {
        sfx.tumbler();
        setStage(1);
        setFeedback('Tumbler 1 clicks firmly into place! [10 confirmed]');
      } else {
        setFeedback(`Clunk! Number ${currentVal} is incorrect. The lock resets.`);
        setStage(0);
      }
    } else if (stage === 1) {
      if (currentVal === 4) {
        sfx.tumbler();
        setStage(2);
        setFeedback('Tumbler 2 engages with a deep metallic ring! [4 confirmed]');
      } else {
        setFeedback(`Clunk! Number ${currentVal} is incorrect. The lock resets.`);
        setStage(0);
      }
    } else if (stage === 2) {
      if (currentVal === 28) {
        sfx.gearClunk();
        setTimeout(() => sfx.puzzleSolved(), 200);
        setSolved(true);
        setFeedback('CLANG! The heavy bolt slides back! The wall safe is OPEN!');
        onSolve();
      } else {
        setFeedback(`Clunk! Number ${currentVal} is incorrect. The lock resets.`);
        setStage(0);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#2b241e] border-8 border-[#17130f] rounded-xl shadow-2xl p-6 text-[#d9c7a7] flex flex-col items-center font-serif">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-[#17130f] text-[#d9c7a7] px-3 py-1 text-sm font-bold rounded hover:bg-[#3d3229] border border-[#594738]"
        >
          ✕ CLOSE
        </button>

        <h2 className="text-2xl font-bold uppercase tracking-wider text-[#d4af37] mb-1 flex items-center gap-2">
          <span>🗝</span> Whitmore Heavy Vault Safe
        </h2>
        <p className="text-xs text-[#a3907c] mb-4">
          Patented Cast-Steel Combination Vault Lock (1928 Model)
        </p>

        <div className="w-full bg-[#1e1915] p-3 rounded-lg border border-[#4a3d31] text-center text-sm mb-6 text-[#ecdcc8]">
          {feedback}
        </div>

        {/* Circular Safe Dial Graphic */}
        <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-[#3b332b] via-[#211b16] to-[#120f0c] border-8 border-[#544436] shadow-2xl flex items-center justify-center my-2">
          {/* Top indicator tick */}
          <div className="absolute -top-3 w-4 h-6 bg-red-600 rounded-sm shadow border border-red-950 z-20 flex items-center justify-center">
            <div className="w-1 h-3 bg-white"></div>
          </div>

          {/* Rotating dial disc */}
          <div
            className="w-48 h-48 rounded-full bg-[#1a1512] border-4 border-[#8c6747] flex flex-col items-center justify-center text-[#d4af37] shadow-inner relative transition-transform duration-100"
            style={{ transform: `rotate(${currentVal * 9}deg)` }}
          >
            {/* Compass marks around dial */}
            {[0, 5, 10, 15, 20, 25, 30, 35].map((n) => {
              const angle = n * 9;
              return (
                <div
                  key={n}
                  className="absolute text-[10px] font-mono font-bold text-[#b89552]"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-80px)`,
                  }}
                >
                  {n}
                </div>
              );
            })}

            {/* Inner knob */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#8c6747] to-[#45301d] border-2 border-[#b89552] flex items-center justify-center shadow-lg">
              <span className="font-mono text-2xl font-black text-[#fff]">
                {currentVal}
              </span>
            </div>
          </div>
        </div>

        {/* Dial Stepper Controls */}
        <div className="flex items-center gap-4 mt-6">
          <button
            disabled={solved}
            onClick={() => turnDial(-5)}
            className="px-3 py-2 bg-[#3d3229] hover:bg-[#594738] text-white rounded font-mono font-bold border border-[#78614c] active:scale-95 disabled:opacity-40"
          >
            -5
          </button>
          <button
            disabled={solved}
            onClick={() => turnDial(-1)}
            className="px-4 py-2 bg-[#544436] hover:bg-[#78614c] text-white rounded font-mono font-bold border border-[#9e8267] active:scale-95 disabled:opacity-40 text-lg"
          >
            ◄ -1
          </button>

          <button
            disabled={solved}
            onClick={confirmNumber}
            className="px-6 py-2.5 bg-[#8c6747] hover:bg-[#a67c52] text-[#fff] font-bold rounded shadow-lg border-2 border-[#d4af37] active:scale-95 disabled:opacity-40 uppercase tracking-wider text-sm"
          >
            Push Tumbler
          </button>

          <button
            disabled={solved}
            onClick={() => turnDial(1)}
            className="px-4 py-2 bg-[#544436] hover:bg-[#78614c] text-white rounded font-mono font-bold border border-[#9e8267] active:scale-95 disabled:opacity-40 text-lg"
          >
            +1 ►
          </button>
          <button
            disabled={solved}
            onClick={() => turnDial(5)}
            className="px-3 py-2 bg-[#3d3229] hover:bg-[#594738] text-white rounded font-mono font-bold border border-[#78614c] active:scale-95 disabled:opacity-40"
          >
            +5
          </button>
        </div>

        {/* Tumbler Progress display */}
        <div className="flex items-center gap-2 mt-4 text-xs font-mono text-[#a3907c]">
          <span>Tumbler Stage:</span>
          <span className={`px-2 py-0.5 rounded ${stage >= 1 || solved ? 'bg-green-900 text-green-200' : 'bg-gray-800'}`}>
            1: [10]
          </span>
          <span className={`px-2 py-0.5 rounded ${stage >= 2 || solved ? 'bg-green-900 text-green-200' : 'bg-gray-800'}`}>
            2: [4]
          </span>
          <span className={`px-2 py-0.5 rounded ${solved ? 'bg-green-900 text-green-200' : 'bg-gray-800'}`}>
            3: [28]
          </span>
        </div>

        {/* Cheat / Felix Helper */}
        <div className="mt-4 pt-3 border-t border-[#4a3d31] w-full flex justify-between items-center text-xs">
          <button
            onClick={() => {
              sfx.gearClunk();
              setSolved(true);
              sfx.puzzleSolved();
              setFeedback('Safe opened via Detective Felix stethoscope bypass!');
              onSolve();
            }}
            className="text-[#99826a] hover:underline"
          >
            [ Felix Cat Stethoscope Trick ]
          </button>

          {solved && (
            <span className="text-green-400 font-bold animate-pulse">
              ✓ VAULT OPENED
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
