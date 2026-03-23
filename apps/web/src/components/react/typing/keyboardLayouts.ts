export type Layout = 'en' | 'tr'

export interface KeyDef {
  key: string        // the character produced
  label: string      // what to show on the keycap
  width?: number     // width multiplier (default 1)
  finger: number     // 0-9 (left pinky=0 to right pinky=9)
}

// Standard finger color mapping
export const fingerColors: Record<number, string> = {
  0: 'bg-rose-500/20 border-rose-500/40',       // left pinky
  1: 'bg-orange-500/20 border-orange-500/40',    // left ring
  2: 'bg-amber-500/20 border-amber-500/40',      // left middle
  3: 'bg-yellow-500/20 border-yellow-500/40',     // left index
  4: 'bg-green-500/20 border-green-500/40',       // left thumb (space)
  5: 'bg-green-500/20 border-green-500/40',       // right thumb (space)
  6: 'bg-cyan-500/20 border-cyan-500/40',         // right index
  7: 'bg-blue-500/20 border-blue-500/40',         // right middle
  8: 'bg-indigo-500/20 border-indigo-500/40',     // right ring
  9: 'bg-purple-500/20 border-purple-500/40',     // right pinky
}

export const fingerActiveColors: Record<number, string> = {
  0: 'bg-rose-500 border-rose-400 text-white',
  1: 'bg-orange-500 border-orange-400 text-white',
  2: 'bg-amber-500 border-amber-400 text-white',
  3: 'bg-yellow-500 border-yellow-400 text-black',
  4: 'bg-green-500 border-green-400 text-white',
  5: 'bg-green-500 border-green-400 text-white',
  6: 'bg-cyan-500 border-cyan-400 text-white',
  7: 'bg-blue-500 border-blue-400 text-white',
  8: 'bg-indigo-500 border-indigo-400 text-white',
  9: 'bg-purple-500 border-purple-400 text-white',
}

// EN QWERTY layout
const enRows: KeyDef[][] = [
  // Row 1: number row (simplified)
  [
    { key: '`', label: '`', finger: 0 },
    { key: '1', label: '1', finger: 0 },
    { key: '2', label: '2', finger: 1 },
    { key: '3', label: '3', finger: 2 },
    { key: '4', label: '4', finger: 3 },
    { key: '5', label: '5', finger: 3 },
    { key: '6', label: '6', finger: 6 },
    { key: '7', label: '7', finger: 6 },
    { key: '8', label: '8', finger: 7 },
    { key: '9', label: '9', finger: 8 },
    { key: '0', label: '0', finger: 9 },
    { key: '-', label: '-', finger: 9 },
    { key: '=', label: '=', finger: 9 },
  ],
  // Row 2: QWERTY
  [
    { key: 'q', label: 'Q', finger: 0 },
    { key: 'w', label: 'W', finger: 1 },
    { key: 'e', label: 'E', finger: 2 },
    { key: 'r', label: 'R', finger: 3 },
    { key: 't', label: 'T', finger: 3 },
    { key: 'y', label: 'Y', finger: 6 },
    { key: 'u', label: 'U', finger: 6 },
    { key: 'i', label: 'I', finger: 7 },
    { key: 'o', label: 'O', finger: 8 },
    { key: 'p', label: 'P', finger: 9 },
    { key: '[', label: '[', finger: 9 },
    { key: ']', label: ']', finger: 9 },
    { key: '\\', label: '\\', finger: 9 },
  ],
  // Row 3: home row
  [
    { key: 'a', label: 'A', finger: 0 },
    { key: 's', label: 'S', finger: 1 },
    { key: 'd', label: 'D', finger: 2 },
    { key: 'f', label: 'F', finger: 3 },
    { key: 'g', label: 'G', finger: 3 },
    { key: 'h', label: 'H', finger: 6 },
    { key: 'j', label: 'J', finger: 6 },
    { key: 'k', label: 'K', finger: 7 },
    { key: 'l', label: 'L', finger: 8 },
    { key: ';', label: ';', finger: 9 },
    { key: "'", label: "'", finger: 9 },
  ],
  // Row 4: bottom row
  [
    { key: 'z', label: 'Z', finger: 0 },
    { key: 'x', label: 'X', finger: 1 },
    { key: 'c', label: 'C', finger: 2 },
    { key: 'v', label: 'V', finger: 3 },
    { key: 'b', label: 'B', finger: 3 },
    { key: 'n', label: 'N', finger: 6 },
    { key: 'm', label: 'M', finger: 6 },
    { key: ',', label: ',', finger: 7 },
    { key: '.', label: '.', finger: 8 },
    { key: '/', label: '/', finger: 9 },
  ],
  // Row 5: space
  [
    { key: ' ', label: 'Space', width: 6, finger: 4 },
  ],
]

// TR Q layout (Turkish Q keyboard)
const trRows: KeyDef[][] = [
  [
    { key: '"', label: '"', finger: 0 },
    { key: '1', label: '1', finger: 0 },
    { key: '2', label: '2', finger: 1 },
    { key: '3', label: '3', finger: 2 },
    { key: '4', label: '4', finger: 3 },
    { key: '5', label: '5', finger: 3 },
    { key: '6', label: '6', finger: 6 },
    { key: '7', label: '7', finger: 6 },
    { key: '8', label: '8', finger: 7 },
    { key: '9', label: '9', finger: 8 },
    { key: '0', label: '0', finger: 9 },
    { key: '*', label: '*', finger: 9 },
    { key: '-', label: '-', finger: 9 },
  ],
  [
    { key: 'q', label: 'Q', finger: 0 },
    { key: 'w', label: 'W', finger: 1 },
    { key: 'e', label: 'E', finger: 2 },
    { key: 'r', label: 'R', finger: 3 },
    { key: 't', label: 'T', finger: 3 },
    { key: 'y', label: 'Y', finger: 6 },
    { key: 'u', label: 'U', finger: 6 },
    { key: 'ı', label: 'I', finger: 7 },
    { key: 'o', label: 'O', finger: 8 },
    { key: 'p', label: 'P', finger: 9 },
    { key: 'ğ', label: 'Ğ', finger: 9 },
    { key: 'ü', label: 'Ü', finger: 9 },
  ],
  [
    { key: 'a', label: 'A', finger: 0 },
    { key: 's', label: 'S', finger: 1 },
    { key: 'd', label: 'D', finger: 2 },
    { key: 'f', label: 'F', finger: 3 },
    { key: 'g', label: 'G', finger: 3 },
    { key: 'h', label: 'H', finger: 6 },
    { key: 'j', label: 'J', finger: 6 },
    { key: 'k', label: 'K', finger: 7 },
    { key: 'l', label: 'L', finger: 8 },
    { key: 'ş', label: 'Ş', finger: 9 },
    { key: 'i', label: 'İ', finger: 9 },
    { key: ',', label: ',', finger: 9 },
  ],
  [
    { key: 'z', label: 'Z', finger: 0 },
    { key: 'x', label: 'X', finger: 1 },
    { key: 'c', label: 'C', finger: 2 },
    { key: 'v', label: 'V', finger: 3 },
    { key: 'b', label: 'B', finger: 3 },
    { key: 'n', label: 'N', finger: 6 },
    { key: 'm', label: 'M', finger: 6 },
    { key: 'ö', label: 'Ö', finger: 7 },
    { key: 'ç', label: 'Ç', finger: 8 },
    { key: '.', label: '.', finger: 9 },
  ],
  [
    { key: ' ', label: 'Space', width: 6, finger: 4 },
  ],
]

export const layouts: Record<Layout, KeyDef[][]> = {
  en: enRows,
  tr: trRows,
}

// Helper to find which key and finger for a given character
export function findKey(layout: Layout, char: string): KeyDef | undefined {
  const rows = layouts[layout]
  for (const row of rows) {
    for (const key of row) {
      if (key.key === char.toLowerCase()) return key
    }
  }
  return undefined
}
