import React, { useState } from 'react';
import { sfx } from '@/lib/audio';

interface BookshelfModalProps {
  onClose: () => void;
  onSolve: () => void;
  isAlreadySolved: boolean;
}

// 6 vintage detective novels on the oak shelf
const BOOKS = [
  { id: 'truth', title: 'I. Truth and Consequence', spineColor: '#7a2e22', height: 'h-44' },
  { id: 'shadows', title: 'II. Shadows of Cairo', spineColor: '#2d4b3d', height: 'h-40' },
  { id: 'always', title: 'III. Always in the Dark', spineColor: '#2f3b59', height: 'h-48' },
  { id: 'clues', title: 'IV. Clues in the Dust', spineColor: '#5a4628', height: 'h-36' },
  { id: 'finds', title: 'V. Finds of the Nile', spineColor: '#6a3857', height: 'h-44' },
  { id: 'way', title: 'VI. Way of the Falcon', spineColor: '#3a505b', height: 'h-42' },
];

// Target motto sequence: "TRUTH" -> "ALWAYS" -> "FINDS" -> "WAY"
const TARGET_SEQ = ['truth', 'always', 'finds', 'way'];

export const BookshelfModal: React.FC<BookshelfModalProps> = ({
  onClose,
  onSolve,
  isAlreadySolved,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [solved, setSolved] = useState<boolean>(isAlreadySolved);
  const [feedback, setFeedback] = useState<string>(
    isAlreadySolved
      ? 'The secret shelf has slid aside, revealing Whitmore\'s locked wall compartment!'
      : 'Select and tilt the books in the order of Whitmore\'s detective motto.'
  );

  const pullBook = (id: string) => {
    if (solved) return;
    sfx.click();

    const next = [...selected, id];
    setSelected(next);

    // Verify step
    const currentIndex = next.length - 1;
    if (TARGET_SEQ[currentIndex] === id) {
      if (next.length === TARGET_SEQ.length) {
        sfx.gearClunk();
        setTimeout(() => sfx.puzzleSolved(), 200);
        setSolved(true);
        setFeedback('CLICK-CLACK! The four books depress into the shelf! A hidden brass compartment pops out!');
        onSolve();
      } else {
        setFeedback(`Book ${next.length} clicks into a spring lock! Keep going.`);
      }
    } else {
      sfx.click();
      setFeedback('The shelf mechanism rattles and springs back out! Incorrect motto order.');
      setTimeout(() => setSelected([]), 400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#2e1f13] border-8 border-[#1a110a] rounded-xl shadow-2xl p-6 text-[#ecdcc8] flex flex-col font-serif">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-[#1a110a] text-[#ecdcc8] px-3 py-1 text-sm font-bold rounded hover:bg-[#47301e] border border-[#6b492f]"
        >
          ✕ CLOSE
        </button>

        <h2 className="text-2xl font-bold uppercase tracking-wider text-[#d4af37] mb-1 flex items-center gap-2">
          <span>📚</span> The Secret Bookshelf
        </h2>
        <p className="text-xs text-[#a89078] mb-4">
          Hollowed Victorian Oak Bookshelf with Hidden Lever Mechanism
        </p>

        <div className="bg-[#1f140c] p-3 rounded-lg border border-[#4a3420] text-center text-sm mb-6 text-[#f5ebd7]">
          {feedback}
        </div>

        {/* Bookshelf graphic */}
        <div className="relative w-full bg-[#3d2716] p-6 rounded-lg border-4 border-[#1b1109] shadow-inner flex items-end justify-center gap-3 min-h-[260px] pb-4">
          {/* Wood grain shelf base */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#1e130a] border-t-2 border-[#54361e]"></div>

          {BOOKS.map((book) => {
            const isPulled = selected.includes(book.id);
            return (
              <button
                key={book.id}
                disabled={solved}
                onClick={() => pullBook(book.id)}
                className={`relative w-14 ${book.height} rounded-t-sm shadow-xl flex flex-col justify-between items-center p-2 text-white transition-all duration-200 hover:-translate-y-2 active:scale-95 border-2 border-black/40 ${
                  isPulled ? 'translate-y-4 brightness-125 ring-2 ring-[#d4af37]' : ''
                }`}
                style={{ backgroundColor: book.spineColor }}
              >
                {/* Gold foil embossed title */}
                <div className="text-[10px] font-bold tracking-tighter writing-vertical text-[#e6c885] select-none h-full flex items-center justify-center text-center">
                  {book.title}
                </div>
                <div className="w-full h-1 bg-[#d4af37] opacity-60"></div>
              </button>
            );
          })}
        </div>

        {/* Clue hint & controls */}
        <div className="mt-6 pt-3 border-t border-[#4a3420] flex justify-between items-center text-xs">
          <div className="text-[#a89078] italic">
            Clue on wall poster: &ldquo;TRUTH ALWAYS FINDS A WAY&rdquo;
          </div>

          <button
            onClick={() => {
              sfx.gearClunk();
              setSelected(TARGET_SEQ);
              setSolved(true);
              sfx.puzzleSolved();
              setFeedback('Bookshelf sequence automatically completed!');
              onSolve();
            }}
            className="text-[#baa186] hover:underline"
          >
            [ Felix Cat Bookshelf Nudge ]
          </button>
        </div>
      </div>
    </div>
  );
};
