export interface Lesson {
  id: string
  title: string
  titleTr: string
  description: string
  descriptionTr: string
  keys: string[]
  texts: string[]
  textsTr: string[]
}

export const lessons: Lesson[] = [
  {
    id: 'home-row-left',
    title: 'Home Row — Left Hand',
    titleTr: 'Ana Sıra — Sol El',
    description: 'Master the left home row keys: A S D F',
    descriptionTr: 'Sol el ana sıra tuşlarını öğrenin: A S D F',
    keys: ['a', 's', 'd', 'f'],
    texts: [
      'asdf fdsa asdf fdsa asdf',
      'sad fad dad add sass',
      'ads fads dads adds fads',
      'as sad dad fad add dass',
    ],
    textsTr: [
      'asdf fdsa asdf fdsa asdf',
      'saf fas das ads fad',
      'ads das fas saf fad',
      'ad sad fad das ads fads',
    ],
  },
  {
    id: 'home-row-right',
    title: 'Home Row — Right Hand',
    titleTr: 'Ana Sıra — Sağ El',
    description: 'Master the right home row keys: J K L ;',
    descriptionTr: 'Sağ el ana sıra tuşlarını öğrenin: J K L ;',
    keys: ['j', 'k', 'l', ';'],
    texts: [
      'jkl; ;lkj jkl; ;lkj jkl;',
      'lk jl kl jk lj kj jkl',
      'jkl ljk klj jlk kjl lkj',
      'jk kl lj jl kj lk jkl;',
    ],
    textsTr: [
      'jkl jkl lkj lkj jkl',
      'lk jl kl jk lj kj jkl',
      'jkl ljk klj jlk kjl lkj',
      'jk kl lj jl kj lk jkl',
    ],
  },
  {
    id: 'home-row-full',
    title: 'Home Row — Both Hands',
    titleTr: 'Ana Sıra — İki El',
    description: 'Combine left and right home row keys',
    descriptionTr: 'Sol ve sağ el ana sıra tuşlarını birleştirin',
    keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    texts: [
      'ask fall jal lads flask',
      'salad flaskallas flags',
      'ads lads dads flask lass',
      'as all sad fall asks jal',
    ],
    textsTr: [
      'sal dal kas fal jak lak',
      'asal kalas dalak fasla',
      'kas dal sal fal jak lak',
      'al sal dal kas fal jak',
    ],
  },
  {
    id: 'home-row-g-h',
    title: 'Index Fingers — G H',
    titleTr: 'İşaret Parmakları — G H',
    description: 'Add G and H to your home row skills',
    descriptionTr: 'G ve H tuşlarını ana sıraya ekleyin',
    keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    texts: [
      'gash flash glad half hall',
      'shag hag gal has had gash',
      'glass flash half shall gall',
      'glad hall flash shag half',
    ],
    textsTr: [
      'gal hal dag gah has had',
      'saga daha dala gala hala',
      'daha gala hala saga dala',
      'gal hal dag saga daha dal',
    ],
  },
  {
    id: 'top-row',
    title: 'Top Row',
    titleTr: 'Üst Sıra',
    description: 'Learn the top row: Q W E R T Y U I O P',
    descriptionTr: 'Üst sırayı öğrenin: Q W E R T Y U I O P',
    keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    texts: [
      'tire wire poet ripe quit',
      'type your output require',
      'write quiet poetry route',
      'your tower power quote tip',
    ],
    textsTr: [
      'tire yeri peri pire uyku',
      'yurt uyur piri peri tire',
      'uyku peri tire yeri pire',
      'yurt uyur piri tire uyku',
    ],
  },
  {
    id: 'bottom-row',
    title: 'Bottom Row',
    titleTr: 'Alt Sıra',
    description: 'Learn the bottom row: Z X C V B N M',
    descriptionTr: 'Alt sırayı öğrenin: Z X C V B N M',
    keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    texts: [
      'zinc club vex ban mix cub',
      'band zinc calm verb menu',
      'next combine blank move van',
      'box mix can van zen club',
    ],
    textsTr: [
      'can baz naz muz bez vaz',
      'buz can naz muz bez vaz',
      'cam baz naz muz bez vaz',
      'can buz cam naz muz bez',
    ],
  },
  {
    id: 'full-keyboard',
    title: 'Full Keyboard',
    titleTr: 'Tam Klavye',
    description: 'Practice with all letter keys',
    descriptionTr: 'Tüm harf tuşlarıyla pratik yapın',
    keys: [],
    texts: [
      'the quick brown fox jumps over the lazy dog',
      'pack my box with five dozen liquor jugs',
      'how vexingly quick daft zebras jump',
      'the five boxing wizards jump quickly',
    ],
    textsTr: [
      'hızlı kahverengi tilki tembel köpeğin üstünden atlar',
      'pijamalı hasta yağız şoföre çabucak güvendi',
      'şişli bafra coğrafyası düzce vilayetinden güzeldir',
      'programlama dilleri yazılım geliştirme aracıdır',
    ],
  },
  {
    id: 'common-words',
    title: 'Common Words',
    titleTr: 'Sık Kullanılan Kelimeler',
    description: 'Practice the most common English words',
    descriptionTr: 'En sık kullanılan kelimeleri pratik edin',
    keys: [],
    texts: [
      'the and for are but not you all can had',
      'her was one our out day get has him his',
      'how its may new now old see way who boy',
      'did come each from good have help just like',
    ],
    textsTr: [
      'bir ve ile bu da ne var olan her için',
      'ben sen biz siz hem tam çok iyi son yeni',
      'gün gece sabah akşam hafta saat zaman',
      'olmak yapmak gelmek gitmek bilmek istemek',
    ],
  },
]
