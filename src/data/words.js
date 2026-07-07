// Word database. Put a picture for a word at public/assets/images/<word>.png
// If the image is missing, the emoji is shown instead.
export const WORDS = [
  // ANIMALS
  { word: 'cow',      emoji: '🐄', cat: 'animals' },
  { word: 'pig',      emoji: '🐷', cat: 'animals' },
  { word: 'sheep',    emoji: '🐑', cat: 'animals' },
  { word: 'chicken',  emoji: '🐔', cat: 'animals' },
  { word: 'horse',    emoji: '🐴', cat: 'animals' },
  { word: 'rabbit',   emoji: '🐰', cat: 'animals' },
  { word: 'wolf',     emoji: '🐺', cat: 'animals' },
  { word: 'cat',      emoji: '🐱', cat: 'animals' },
  { word: 'fish',     emoji: '🐟', cat: 'animals' },
  { word: 'bee',      emoji: '🐝', cat: 'animals' },
  { word: 'spider',   emoji: '🕷️', cat: 'animals' },
  { word: 'bat',      emoji: '🦇', cat: 'animals' },

  // NATURE
  { word: 'tree',     emoji: '🌳', cat: 'nature' },
  { word: 'flower',   emoji: '🌸', cat: 'nature' },
  { word: 'grass',    emoji: '🌿', cat: 'nature' },
  { word: 'water',    emoji: '💧', cat: 'nature' },
  { word: 'stone',    emoji: '🪨', cat: 'nature' },
  { word: 'wood',     emoji: '🪵', cat: 'nature' },
  { word: 'mountain', emoji: '⛰️', cat: 'nature' },
  { word: 'snow',     emoji: '❄️', cat: 'nature' },
  { word: 'rain',     emoji: '🌧️', cat: 'nature' },
  { word: 'sun',      emoji: '☀️', cat: 'nature' },
  { word: 'moon',     emoji: '🌙', cat: 'nature' },
  { word: 'star',     emoji: '⭐', cat: 'nature' },
  { word: 'fire',     emoji: '🔥', cat: 'nature' },

  // ITEMS
  { word: 'axe',      emoji: '🪓', cat: 'items' },
  { word: 'sword',    emoji: '⚔️', cat: 'items' },
  { word: 'bucket',   emoji: '🪣', cat: 'items' },
  { word: 'torch',    emoji: '🔦', cat: 'items' },
  { word: 'bed',      emoji: '🛏️', cat: 'items' },
  { word: 'door',     emoji: '🚪', cat: 'items' },
  { word: 'boat',     emoji: '🛶', cat: 'items' },
  { word: 'ladder',   emoji: '🪜', cat: 'items' },
  { word: 'map',      emoji: '🗺️', cat: 'items' },
  { word: 'book',     emoji: '📖', cat: 'items' },
  { word: 'clock',    emoji: '⏰', cat: 'items' },
  { word: 'chest',    emoji: '📦', cat: 'items' },
  { word: 'key',      emoji: '🔑', cat: 'items' },
  { word: 'arrow',    emoji: '🏹', cat: 'items' },

  // FOOD
  { word: 'apple',    emoji: '🍎', cat: 'food' },
  { word: 'bread',    emoji: '🍞', cat: 'food' },
  { word: 'carrot',   emoji: '🥕', cat: 'food' },
  { word: 'potato',   emoji: '🥔', cat: 'food' },
  { word: 'milk',     emoji: '🥛', cat: 'food' },
  { word: 'cake',     emoji: '🎂', cat: 'food' },
  { word: 'cookie',   emoji: '🍪', cat: 'food' },
  { word: 'watermelon', emoji: '🍉', cat: 'food' },
  { word: 'egg',      emoji: '🥚', cat: 'food' },
  { word: 'mushroom', emoji: '🍄', cat: 'food' },
];

export const CATEGORIES = [
  { id: 'all',     label: 'All',     icon: '🌍' },
  { id: 'animals', label: 'Animals', icon: '🐷' },
  { id: 'nature',  label: 'Nature',  icon: '🌳' },
  { id: 'items',   label: 'Items',   icon: '🪓' },
  { id: 'food',    label: 'Food',    icon: '🍎' },
];

export function getWords(cat) {
  return cat === 'all' ? [...WORDS] : WORDS.filter(w => w.cat === cat);
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
