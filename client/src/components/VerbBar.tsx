import React from 'react';
import { Verb, InventoryItem } from '@/game/types';
import { sfx } from '@/lib/audio';

interface VerbBarProps {
  currentVerb: Verb;
  onSelectVerb: (verb: Verb) => void;
  inventory: InventoryItem[];
  selectedItem: InventoryItem | null;
  onSelectItem: (item: InventoryItem) => void;
  onInspectItem: (item: InventoryItem) => void;
  filmGrainEnabled: boolean;
  onToggleFilmGrain: () => void;
  onResetGame: () => void;
}

const VERBS: { id: Verb; label: string; icon: string }[] = [
  { id: 'look', label: 'Look at', icon: '🔍' },
  { id: 'pickup', label: 'Pick up', icon: '✋' },
  { id: 'talk', label: 'Talk / Felix', icon: '💬' },
  { id: 'use', label: 'Use item', icon: '⚙' },
];

export const VerbBar: React.FC<VerbBarProps> = ({
  currentVerb,
  onSelectVerb,
  inventory,
  selectedItem,
  onSelectItem,
  onInspectItem,
  filmGrainEnabled,
  onToggleFilmGrain,
  onResetGame,
}) => {
  return (
    <footer className="w-full bg-[#20150d] border-t-4 border-[#422d1c] p-2 text-[#d9c7a7] font-serif shadow-2xl flex flex-col md:flex-row items-stretch justify-between gap-2 select-none z-30">
      {/* 90s LucasArts Verb Commands */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 md:w-5/12 bg-[#170e08] p-1.5 rounded border border-[#382415]">
        {VERBS.map((v) => {
          const isActive = currentVerb === v.id;
          return (
            <button
              key={v.id}
              onClick={() => {
                sfx.click();
                onSelectVerb(v.id);
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-xs font-bold tracking-wider uppercase transition-all ${
                isActive
                  ? 'bg-[#8c6747] text-white shadow ring-2 ring-[#d4af37]'
                  : 'bg-[#2b1b11] hover:bg-[#3d2719] text-[#c9b79b] border border-[#4a3220]'
              }`}
            >
              <span>{v.icon}</span>
              <span>{v.label}</span>
            </button>
          );
        })}
      </div>

      {/* Inventory Slots (Day of the Tentacle style) */}
      <div className="flex-1 bg-[#170e08] p-1.5 rounded border border-[#382415] flex items-center gap-2 overflow-x-auto min-h-[52px]">
        <span className="text-[10px] uppercase font-bold text-[#7a593c] px-1 writing-vertical md:writing-horizontal">
          Case Bag:
        </span>

        {inventory.length === 0 ? (
          <span className="text-xs text-[#593f2b] italic px-2">
            (Pockets are empty. Inspect the office for tools &amp; keys)
          </span>
        ) : (
          inventory.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  sfx.click();
                  onSelectItem(item);
                }}
                onDoubleClick={() => {
                  sfx.click();
                  onInspectItem(item);
                }}
                title={`${item.name} - ${item.description} (Double click to inspect)`}
                className={`relative flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer border text-xs font-mono transition-all ${
                  isSelected
                    ? 'bg-[#d4af37]/25 border-[#d4af37] text-white shadow-md'
                    : 'bg-[#2b1b11] hover:bg-[#3d2719] border-[#4a3220] text-[#ecdcc8]'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="truncate max-w-[100px]">{item.name}</span>
                {item.canInspect && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sfx.click();
                      onInspectItem(item);
                    }}
                    className="ml-1 text-[10px] bg-[#3d2719] px-1 rounded hover:bg-[#5e3c27]"
                    title="Inspect item"
                  >
                    👁
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Retro Polish Toggles */}
      <div className="flex items-center gap-2 md:w-3/12 justify-end px-2">
        <button
          onClick={() => {
            sfx.click();
            onToggleFilmGrain();
          }}
          className={`px-2.5 py-1 text-[11px] font-bold rounded border transition-colors flex items-center gap-1 ${
            filmGrainEnabled
              ? 'bg-[#5e3c27] text-[#fff] border-[#916241]'
              : 'bg-[#26170d] text-[#856a52] border-[#422c1b]'
          }`}
          title="Toggle 1930s Film Grain & Projector Dust effect"
        >
          <span>📽</span> Grain: {filmGrainEnabled ? 'ON' : 'OFF'}
        </button>

        <button
          onClick={() => {
            sfx.click();
            onResetGame();
          }}
          className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#381f18] hover:bg-[#52291f] text-[#f2b9ac] border border-[#693123]"
          title="Restart detective scenario"
        >
          Restart
        </button>
      </div>
    </footer>
  );
};
