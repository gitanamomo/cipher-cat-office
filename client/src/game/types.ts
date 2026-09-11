export type Verb = 'look' | 'pickup' | 'talk' | 'use';

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  detailImage?: string;
  canInspect?: boolean;
}

export interface Hotspot {
  id: string;
  name: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage
  height: number; // percentage
  cursorType?: string;
  examineText: string;
  pickupText?: string;
  requiredItem?: string;
  solvedText?: string;
  isUnlocked?: boolean;
}

export interface DialogueNode {
  speaker: string;
  portrait: string;
  text: string;
  options?: {
    text: string;
    nextNodeId?: string;
    action?: () => void;
  }[];
}

export interface GameProgress {
  hasReadPoster: boolean;
  bookshelfSolved: boolean;
  puzzleBoxUnlocked: boolean;
  safeUnlocked: boolean;
  cryptexUnlocked: boolean;
  hasEscaped: boolean;
  discoveredClues: string[];
}
