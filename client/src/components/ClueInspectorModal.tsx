import React from 'react';
import { sfx } from '@/lib/audio';

interface ClueInspectorModalProps {
  onClose: () => void;
  type: 'typewriter' | 'memo' | 'calendar' | 'door';
  onDoorEscape?: () => void;
  hasMasterKey?: boolean;
}

export const ClueInspectorModal: React.FC<ClueInspectorModalProps> = ({
  onClose,
  type,
  onDoorEscape,
  hasMasterKey,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#efe3cf] border-8 border-[#3d2b1c] rounded-xl shadow-2xl p-6 text-[#291b10] font-serif">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-[#3d2b1c] text-[#efe3cf] px-3 py-1 text-sm font-bold rounded hover:bg-[#573e28] border border-[#78573a]"
        >
          ✕ CLOSE
        </button>

        {type === 'typewriter' && (
          <div>
            <div className="flex items-center gap-3 border-b-2 border-[#78573a] pb-3 mb-4">
              <span className="text-3xl">⌨</span>
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wide text-[#3d2b1c]">
                  Underwood 1931 Vintage Typewriter
                </h2>
                <p className="text-xs text-[#735439]">
                  Fresh ribbon ink on yellowed bond paper
                </p>
              </div>
            </div>

            <div className="bg-[#fcf8ed] border-2 border-[#b59e7e] p-6 rounded shadow-inner font-mono text-sm leading-relaxed text-[#1a1109] relative">
              <div className="absolute top-2 right-4 text-[10px] text-red-700 font-bold tracking-widest border border-red-700 px-2 py-0.5 rotate-3">
                CONFIDENTIAL CASE FILE
              </div>
              <p className="font-bold mb-2">MEMORANDUM FOR FILE #304-B:</p>
              <p className="mb-3">
                &ldquo;If they break into this office, the vault locks automatically. The cipher box on my oak desk holds the silver dial.&rdquo;
              </p>
              <p className="mb-3 bg-[#e8dbbe] p-2 rounded border border-[#c4ae88]">
                <strong>Brass Box Key:</strong> &ldquo;Align the night sky with eternal vigilance: First the <strong>STAR (★)</strong>, second the <strong>CRESCENT MOON (☾)</strong>, third the <strong>ALL-SEEING EYE (👁)</strong>, and finally the <strong>PYRAMID (▲)</strong>.&rdquo;
              </p>
              <p className="italic text-xs text-[#6e533c]">
                Note scribbled below: &ldquo;Vault combination is recorded in the room&apos;s passing hours: Wall clock hour [10], Desk filing drawer [4], and Detective&apos;s Day on the calendar [28].&rdquo;
              </p>
            </div>
          </div>
        )}

        {type === 'calendar' && (
          <div>
            <div className="flex items-center gap-3 border-b-2 border-[#78573a] pb-3 mb-4">
              <span className="text-3xl">📅</span>
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wide text-[#3d2b1c]">
                  September 1931 Office Calendar
                </h2>
                <p className="text-xs text-[#735439]">Torn monthly planner pinned by the vault</p>
              </div>
            </div>

            <div className="bg-[#fcf8ed] border-2 border-[#b59e7e] p-6 rounded shadow-inner text-center">
              <div className="text-lg font-bold mb-2 text-[#7a2014] tracking-widest uppercase">
                September 1931
              </div>
              <p className="text-sm mb-4">
                Red circle drawn heavily in ink around date:
              </p>
              <div className="inline-block border-4 border-red-600 rounded-full px-6 py-3 font-mono text-4xl font-black text-red-700 animate-pulse bg-red-50">
                28
              </div>
              <p className="mt-4 text-xs italic text-[#593d25]">
                &ldquo;Meeting at the harbor docks: 10 PM. Safe tumbler code part III.&rdquo;
              </p>
            </div>
          </div>
        )}

        {type === 'door' && (
          <div>
            <div className="flex items-center gap-3 border-b-2 border-[#78573a] pb-3 mb-4">
              <span className="text-3xl">🚪</span>
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wide text-[#3d2b1c]">
                  Office Heavy Oak Exit Door
                </h2>
                <p className="text-xs text-[#735439]">
                  Frosted fluted glass lettered: &ldquo;PRIVATE - J.H. WHITMORE DETECTIVE&rdquo;
                </p>
              </div>
            </div>

            <div className="bg-[#fcf8ed] border-2 border-[#b59e7e] p-6 rounded shadow-inner text-center">
              <p className="text-sm leading-relaxed mb-4">
                The massive brass electro-mechanical deadbolt requires the master key retrieved from the Steampunk Cryptex.
              </p>

              {hasMasterKey ? (
                <div className="p-4 bg-green-50 border-2 border-green-600 rounded-lg">
                  <p className="text-green-900 font-bold text-base mb-3">
                    ★ You possess the Golden Master Key from the Cryptex!
                  </p>
                  <button
                    onClick={() => {
                      sfx.gearClunk();
                      setTimeout(() => sfx.puzzleSolved(), 300);
                      if (onDoorEscape) onDoorEscape();
                    }}
                    className="px-6 py-3 bg-[#7a2e22] hover:bg-[#963728] text-white font-bold rounded-lg shadow-xl text-lg uppercase tracking-wider animate-bounce"
                  >
                    Turn Master Key &amp; Escape Office!
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border-2 border-amber-600 rounded-lg text-amber-900 text-sm">
                  The deadbolt is firmly engaged. You must decode Whitmore&apos;s cryptex to retrieve the master key first!
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#3d2b1c] text-[#efe3cf] rounded hover:bg-[#573e28] text-xs font-bold"
          >
            Back to Office
          </button>
        </div>
      </div>
    </div>
  );
};
