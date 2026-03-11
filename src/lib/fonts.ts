export const DECORATIVE_FONTS = [
  { name: 'Great Vibes', family: 'Great Vibes', style: 'cursive' },
  { name: 'Dancing Script', family: 'Dancing Script', style: 'cursive' },
  { name: 'Playfair Display', family: 'Playfair Display', style: 'serif' },
  { name: 'Cormorant Garamond', family: 'Cormorant Garamond', style: 'serif' },
  { name: 'Cinzel Decorative', family: 'Cinzel Decorative', style: 'serif' },
  { name: 'Parisienne', family: 'Parisienne', style: 'cursive' },
  { name: 'Allura', family: 'Allura', style: 'cursive' },
  { name: 'Sacramento', family: 'Sacramento', style: 'cursive' },
  { name: 'Pinyon Script', family: 'Pinyon Script', style: 'cursive' },
  { name: 'Alex Brush', family: 'Alex Brush', style: 'cursive' },
  { name: 'Arizonia', family: 'Arizonia', style: 'cursive' },
  { name: 'Berkshire Swash', family: 'Berkshire Swash', style: 'cursive' },
];

export const GOOGLE_FONTS_URL = `https://fonts.googleapis.com/css2?${DECORATIVE_FONTS.map(
  (f) => `family=${f.family.replace(/ /g, '+')}`
).join('&')}&display=swap`;
