export interface VimEntry {
  key: string
  description: string
  descriptionTr: string
  example?: string
  why?: string
  whyTr?: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
}

export const categories = [
  'Motions',
  'Operators',
  'Text Objects',
  'Visual Mode',
  'Registers',
  'Macros',
  'Windows/Tabs',
  'Search/Replace',
] as const

export type Category = (typeof categories)[number]

export const cheatsheetData: VimEntry[] = [
  // === MOTIONS ===
  { key: 'h', description: 'Move left', descriptionTr: 'Sola git', category: 'Motions', level: 'beginner' },
  { key: 'j', description: 'Move down', descriptionTr: 'Aşağı git', category: 'Motions', level: 'beginner' },
  { key: 'k', description: 'Move up', descriptionTr: 'Yukarı git', category: 'Motions', level: 'beginner' },
  { key: 'l', description: 'Move right', descriptionTr: 'Sağa git', category: 'Motions', level: 'beginner' },
  { key: 'w', description: 'Jump to start of next word', descriptionTr: 'Sonraki kelimenin başına git', example: 'w → "hello |world"', why: 'Navigate word by word', whyTr: 'Kelime kelime gezin', category: 'Motions', level: 'beginner' },
  { key: 'b', description: 'Jump to start of previous word', descriptionTr: 'Önceki kelimenin başına git', category: 'Motions', level: 'beginner' },
  { key: 'e', description: 'Jump to end of word', descriptionTr: 'Kelimenin sonuna git', category: 'Motions', level: 'beginner' },
  { key: 'W', description: 'Jump to next WORD (whitespace-delimited)', descriptionTr: 'Sonraki WORD\'e git (boşluk sınırlı)', why: 'Skips punctuation', whyTr: 'Noktalama atlar', category: 'Motions', level: 'intermediate' },
  { key: 'B', description: 'Jump to previous WORD', descriptionTr: 'Önceki WORD\'e git', category: 'Motions', level: 'intermediate' },
  { key: 'E', description: 'Jump to end of WORD', descriptionTr: 'WORD sonuna git', category: 'Motions', level: 'intermediate' },
  { key: '0', description: 'Go to start of line', descriptionTr: 'Satır başına git', category: 'Motions', level: 'beginner' },
  { key: '$', description: 'Go to end of line', descriptionTr: 'Satır sonuna git', category: 'Motions', level: 'beginner' },
  { key: '^', description: 'Go to first non-blank character', descriptionTr: 'İlk boşluk olmayan karaktere git', category: 'Motions', level: 'beginner' },
  { key: 'gg', description: 'Go to first line', descriptionTr: 'İlk satıra git', category: 'Motions', level: 'beginner' },
  { key: 'G', description: 'Go to last line', descriptionTr: 'Son satıra git', category: 'Motions', level: 'beginner' },
  { key: '{number}G', description: 'Go to line number', descriptionTr: 'Satır numarasına git', example: '10G → go to line 10', category: 'Motions', level: 'beginner' },
  { key: '{', description: 'Jump to previous paragraph', descriptionTr: 'Önceki paragrafa git', category: 'Motions', level: 'intermediate' },
  { key: '}', description: 'Jump to next paragraph', descriptionTr: 'Sonraki paragrafa git', category: 'Motions', level: 'intermediate' },
  { key: '%', description: 'Jump to matching bracket', descriptionTr: 'Eşleşen paranteze git', why: 'Essential for code navigation', whyTr: 'Kod gezintisi için temel', category: 'Motions', level: 'intermediate' },
  { key: 'f{char}', description: 'Find char forward on line', descriptionTr: 'Satırda ileri karakter bul', example: 'f( → jump to next (', why: 'Fast in-line navigation', whyTr: 'Hızlı satır içi gezinti', category: 'Motions', level: 'intermediate' },
  { key: 'F{char}', description: 'Find char backward on line', descriptionTr: 'Satırda geri karakter bul', category: 'Motions', level: 'intermediate' },
  { key: 't{char}', description: 'Move to before char forward', descriptionTr: 'Karakterden önceye git (ileri)', category: 'Motions', level: 'intermediate' },
  { key: 'T{char}', description: 'Move to after char backward', descriptionTr: 'Karakterden sonraya git (geri)', category: 'Motions', level: 'intermediate' },
  { key: ';', description: 'Repeat last f/F/t/T', descriptionTr: 'Son f/F/t/T tekrarla', category: 'Motions', level: 'intermediate' },
  { key: ',', description: 'Repeat last f/F/t/T in reverse', descriptionTr: 'Son f/F/t/T ters yönde tekrarla', category: 'Motions', level: 'intermediate' },
  { key: 'Ctrl+d', description: 'Scroll half page down', descriptionTr: 'Yarım sayfa aşağı kaydır', category: 'Motions', level: 'beginner' },
  { key: 'Ctrl+u', description: 'Scroll half page up', descriptionTr: 'Yarım sayfa yukarı kaydır', category: 'Motions', level: 'beginner' },
  { key: 'H', description: 'Move to top of screen', descriptionTr: 'Ekranın üstüne git', category: 'Motions', level: 'intermediate' },
  { key: 'M', description: 'Move to middle of screen', descriptionTr: 'Ekranın ortasına git', category: 'Motions', level: 'intermediate' },
  { key: 'L', description: 'Move to bottom of screen', descriptionTr: 'Ekranın altına git', category: 'Motions', level: 'intermediate' },

  // === OPERATORS ===
  { key: 'd', description: 'Delete (operator)', descriptionTr: 'Sil (operatör)', example: 'dw → delete word', why: 'Combine with motions: dd, d$, dG', whyTr: 'Hareketlerle birleştir: dd, d$, dG', category: 'Operators', level: 'beginner' },
  { key: 'c', description: 'Change (delete + insert)', descriptionTr: 'Değiştir (sil + insert)', example: 'cw → change word', why: 'Most used operator for editing', whyTr: 'Düzenleme için en çok kullanılan operatör', category: 'Operators', level: 'beginner' },
  { key: 'y', description: 'Yank (copy)', descriptionTr: 'Kopyala (yank)', example: 'yy → yank line', category: 'Operators', level: 'beginner' },
  { key: 'p', description: 'Paste after cursor', descriptionTr: 'İmleçten sonra yapıştır', category: 'Operators', level: 'beginner' },
  { key: 'P', description: 'Paste before cursor', descriptionTr: 'İmleçten önce yapıştır', category: 'Operators', level: 'beginner' },
  { key: 'dd', description: 'Delete entire line', descriptionTr: 'Tüm satırı sil', category: 'Operators', level: 'beginner' },
  { key: 'cc', description: 'Change entire line', descriptionTr: 'Tüm satırı değiştir', category: 'Operators', level: 'beginner' },
  { key: 'yy', description: 'Yank entire line', descriptionTr: 'Tüm satırı kopyala', category: 'Operators', level: 'beginner' },
  { key: 'D', description: 'Delete to end of line', descriptionTr: 'Satır sonuna kadar sil', category: 'Operators', level: 'beginner' },
  { key: 'C', description: 'Change to end of line', descriptionTr: 'Satır sonuna kadar değiştir', category: 'Operators', level: 'beginner' },
  { key: 'x', description: 'Delete character under cursor', descriptionTr: 'İmlecin altındaki karakteri sil', category: 'Operators', level: 'beginner' },
  { key: 'r', description: 'Replace single character', descriptionTr: 'Tek karakter değiştir', example: 'ra → replace with a', category: 'Operators', level: 'beginner' },
  { key: '~', description: 'Toggle case', descriptionTr: 'Büyük/küçük harf değiştir', category: 'Operators', level: 'intermediate' },
  { key: 'gu', description: 'Lowercase (operator)', descriptionTr: 'Küçük harf (operatör)', example: 'guw → lowercase word', category: 'Operators', level: 'intermediate' },
  { key: 'gU', description: 'Uppercase (operator)', descriptionTr: 'Büyük harf (operatör)', example: 'gUw → uppercase word', category: 'Operators', level: 'intermediate' },
  { key: '>', description: 'Indent right (operator)', descriptionTr: 'Sağa girintile (operatör)', example: '>> → indent line', category: 'Operators', level: 'beginner' },
  { key: '<', description: 'Indent left (operator)', descriptionTr: 'Sola girintile (operatör)', category: 'Operators', level: 'beginner' },
  { key: '.', description: 'Repeat last change', descriptionTr: 'Son değişikliği tekrarla', why: 'The most powerful vim command', whyTr: 'En güçlü vim komutu', category: 'Operators', level: 'beginner' },
  { key: 'u', description: 'Undo', descriptionTr: 'Geri al', category: 'Operators', level: 'beginner' },
  { key: 'Ctrl+r', description: 'Redo', descriptionTr: 'Yinele', category: 'Operators', level: 'beginner' },

  // === TEXT OBJECTS ===
  { key: 'iw', description: 'Inner word', descriptionTr: 'İç kelime', example: 'diw → delete inner word', why: 'Works regardless of cursor position in word', whyTr: 'İmleç konumuna bakılmaksızın çalışır', category: 'Text Objects', level: 'beginner' },
  { key: 'aw', description: 'A word (includes surrounding space)', descriptionTr: 'Bir kelime (çevreleyen boşluk dahil)', category: 'Text Objects', level: 'beginner' },
  { key: 'i"', description: 'Inner double quotes', descriptionTr: 'Çift tırnak içi', example: 'ci" → change inside quotes', why: 'Perfect for editing strings', whyTr: 'String düzenlemek için mükemmel', category: 'Text Objects', level: 'beginner' },
  { key: "i'", description: 'Inner single quotes', descriptionTr: 'Tek tırnak içi', category: 'Text Objects', level: 'beginner' },
  { key: 'i)', description: 'Inner parentheses', descriptionTr: 'Parantez içi', example: 'ci) → change inside parens', category: 'Text Objects', level: 'beginner' },
  { key: 'i]', description: 'Inner brackets', descriptionTr: 'Köşeli parantez içi', category: 'Text Objects', level: 'beginner' },
  { key: 'i}', description: 'Inner braces', descriptionTr: 'Süslü parantez içi', category: 'Text Objects', level: 'beginner' },
  { key: 'it', description: 'Inner tag (HTML)', descriptionTr: 'HTML tag içi', example: 'cit → change inside tag', why: 'Essential for HTML editing', whyTr: 'HTML düzenleme için temel', category: 'Text Objects', level: 'intermediate' },
  { key: 'ip', description: 'Inner paragraph', descriptionTr: 'İç paragraf', category: 'Text Objects', level: 'intermediate' },
  { key: 'is', description: 'Inner sentence', descriptionTr: 'İç cümle', category: 'Text Objects', level: 'intermediate' },
  { key: 'a"', description: 'A double quoted string (includes quotes)', descriptionTr: 'Tırnaklı string (tırnaklar dahil)', category: 'Text Objects', level: 'intermediate' },
  { key: 'a)', description: 'A parenthesized block (includes parens)', descriptionTr: 'Parantezli blok (parantezler dahil)', category: 'Text Objects', level: 'intermediate' },

  // === VISUAL MODE ===
  { key: 'v', description: 'Enter visual mode (character)', descriptionTr: 'Görsel moda gir (karakter)', category: 'Visual Mode', level: 'beginner' },
  { key: 'V', description: 'Enter visual line mode', descriptionTr: 'Görsel satır moduna gir', category: 'Visual Mode', level: 'beginner' },
  { key: 'Ctrl+v', description: 'Enter visual block mode', descriptionTr: 'Görsel blok moduna gir', why: 'Edit multiple lines at once', whyTr: 'Birden çok satırı aynı anda düzenle', category: 'Visual Mode', level: 'intermediate' },
  { key: 'o', description: 'Move to other end of selection', descriptionTr: 'Seçimin diğer ucuna git', category: 'Visual Mode', level: 'intermediate' },
  { key: 'gv', description: 'Reselect last visual selection', descriptionTr: 'Son görsel seçimi yeniden seç', category: 'Visual Mode', level: 'intermediate' },

  // === REGISTERS ===
  { key: '"a', description: 'Use register a', descriptionTr: 'a kaydını kullan', example: '"ayy → yank line into register a', why: 'Multiple clipboards', whyTr: 'Birden çok pano', category: 'Registers', level: 'intermediate' },
  { key: '"0', description: 'Last yank register', descriptionTr: 'Son kopyalama kaydı', why: 'Paste what you yanked, not what you deleted', whyTr: 'Sildiğinizi değil, kopyaladığınızı yapıştırın', category: 'Registers', level: 'intermediate' },
  { key: '"+', description: 'System clipboard register', descriptionTr: 'Sistem panosu kaydı', category: 'Registers', level: 'intermediate' },
  { key: ':reg', description: 'Show all registers', descriptionTr: 'Tüm kayıtları göster', category: 'Registers', level: 'advanced' },

  // === MACROS ===
  { key: 'q{a-z}', description: 'Start recording macro to register', descriptionTr: 'Kaydı kaydetmeye başla', example: 'qa → start recording to a', why: 'Automate repetitive edits', whyTr: 'Tekrarlayan düzenlemeleri otomatikleştir', category: 'Macros', level: 'intermediate' },
  { key: 'q', description: 'Stop recording macro', descriptionTr: 'Makro kaydını durdur', category: 'Macros', level: 'intermediate' },
  { key: '@{a-z}', description: 'Play macro from register', descriptionTr: 'Kayıttan makro çalıştır', example: '@a → play macro a', category: 'Macros', level: 'intermediate' },
  { key: '@@', description: 'Replay last macro', descriptionTr: 'Son makroyu tekrarla', category: 'Macros', level: 'intermediate' },
  { key: '{n}@{a-z}', description: 'Play macro n times', descriptionTr: 'Makroyu n kez çalıştır', example: '10@a → play macro a 10 times', category: 'Macros', level: 'advanced' },

  // === WINDOWS/TABS ===
  { key: ':sp', description: 'Horizontal split', descriptionTr: 'Yatay böl', category: 'Windows/Tabs', level: 'intermediate' },
  { key: ':vsp', description: 'Vertical split', descriptionTr: 'Dikey böl', category: 'Windows/Tabs', level: 'intermediate' },
  { key: 'Ctrl+w h/j/k/l', description: 'Navigate between splits', descriptionTr: 'Bölümler arası gezin', category: 'Windows/Tabs', level: 'intermediate' },
  { key: 'Ctrl+w =', description: 'Equalize split sizes', descriptionTr: 'Bölüm boyutlarını eşitle', category: 'Windows/Tabs', level: 'advanced' },
  { key: ':tabnew', description: 'Open new tab', descriptionTr: 'Yeni sekme aç', category: 'Windows/Tabs', level: 'advanced' },
  { key: 'gt / gT', description: 'Next / previous tab', descriptionTr: 'Sonraki / önceki sekme', category: 'Windows/Tabs', level: 'advanced' },

  // === SEARCH/REPLACE ===
  { key: '/{pattern}', description: 'Search forward', descriptionTr: 'İleri ara', category: 'Search/Replace', level: 'beginner' },
  { key: '?{pattern}', description: 'Search backward', descriptionTr: 'Geri ara', category: 'Search/Replace', level: 'beginner' },
  { key: 'n', description: 'Next search result', descriptionTr: 'Sonraki arama sonucu', category: 'Search/Replace', level: 'beginner' },
  { key: 'N', description: 'Previous search result', descriptionTr: 'Önceki arama sonucu', category: 'Search/Replace', level: 'beginner' },
  { key: '*', description: 'Search word under cursor forward', descriptionTr: 'İmlecin altındaki kelimeyi ileri ara', category: 'Search/Replace', level: 'intermediate' },
  { key: '#', description: 'Search word under cursor backward', descriptionTr: 'İmlecin altındaki kelimeyi geri ara', category: 'Search/Replace', level: 'intermediate' },
  { key: ':s/old/new/', description: 'Replace first on line', descriptionTr: 'Satırdaki ilkini değiştir', category: 'Search/Replace', level: 'intermediate' },
  { key: ':s/old/new/g', description: 'Replace all on line', descriptionTr: 'Satırdaki tümünü değiştir', category: 'Search/Replace', level: 'intermediate' },
  { key: ':%s/old/new/g', description: 'Replace all in file', descriptionTr: 'Dosyadaki tümünü değiştir', why: 'Global find and replace', whyTr: 'Genel bul ve değiştir', category: 'Search/Replace', level: 'intermediate' },
  { key: ':%s/old/new/gc', description: 'Replace all with confirmation', descriptionTr: 'Onaylamalı tümünü değiştir', category: 'Search/Replace', level: 'advanced' },
]
