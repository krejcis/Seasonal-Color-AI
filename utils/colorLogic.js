
const analyzeColor = (r, g, b) => {
  // 1. Normalize RGB
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  // 2. Convert to HSV/HSL for easier analysis
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const d = max - min;
  
  let h = 0;
  if (d === 0) h = 0;
  else if (max === rNorm) h = (gNorm - bNorm) / d % 6;
  else if (max === gNorm) h = (bNorm - rNorm) / d + 2;
  else h = (rNorm - gNorm) / d + 4;
  
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  // 3. Determine Undertone (Cool vs Warm)
  // Simplified logic: 
  // Warm: Yellow/Gold undertones. Hues 0-60 (Red-Yellow) or 330-360.
  // Cool: Blue/Pink undertones. Hues 180-300 (Cyan-Magenta).
  // Green/Purple are borderline.
  
  // Actually, skin tone analysis is more about "Golden" vs "Rosy".
  // If R > B significantly, it's often warm.
  
  const isWarm = (r > b) && (g > b); // Rudimentary check

  // 4. Determine Contrast (High vs Low) / Value (Light vs Dark)
  const isLight = l > 0.5;

  // 5. Assign Season
  // Spring: Warm + Light
  // Autumn: Warm + Dark
  // Summer: Cool + Light
  // Winter: Cool + Dark

  let season = "Winter"; // Default
  if (isWarm) {
    if (isLight) season = "Spring";
    else season = "Autumn";
  } else {
    if (isLight) season = "Summer";
    else season = "Winter";
  }

  return {
    season,
    details: {
      hue: h,
      saturation: s.toFixed(2),
      lightness: l.toFixed(2),
      isWarm,
      isLight
    }
  };
};

const getSeasonPalette = (season) => {
  switch(season) {
    case 'Spring':
      return ['#FF7F50', '#FFD700', '#98FB98', '#E0FFFF', '#FFA07A']; // Coral, Gold, PaleGreen, LightCyan, LightSalmon
    case 'Autumn':
      return ['#8B4513', '#D2691E', '#DAA520', '#556B2F', '#CD853F']; // SaddleBrown, Chocolate, GoldenRod, DarkOliveGreen, Peru
    case 'Summer':
      return ['#ADD8E6', '#FFB6C1', '#E6E6FA', '#F08080', '#F5FFFA']; // LightBlue, LightPink, Lavender, LightCoral, MintCream
    case 'Winter':
      return ['#000080', '#DC143C', '#FFFFFF', '#000000', '#2F4F4F']; // Navy, Crimson, White, Black, DarkSlateGray
    default:
      return [];
  }
};

const getSeasonDescription = (season) => {
  switch(season) {
    case 'Spring':
      return "You shine in warm, fresh, and clear colors. Think tropical islands!";
    case 'Autumn':
      return "You look best in warm, rich, and earthy tones. Think falling leaves.";
    case 'Summer':
      return "Your best colors are cool, soft, and muted. Think a hazy summer day.";
    case 'Winter':
      return "You stun in cool, deep, and vivid colors. Think high contrast.";
    default:
      return "";
  }
};

const getPremiumContent = (season) => {
  const content = {
    Spring: {
      shoppingList: [
        'Coral sundress',
        'Gold jewelry',
        'Light beige trench coat',
        'Turquoise scarf',
        'Cream silk blouse'
      ],
      beauty: {
        makeup: ['Peach blush', 'Warm coral lipstick', 'Bronze eyeliner', 'Gold shimmer eyeshadow'],
        hair: ['Golden blonde', 'Strawberry blonde', 'Light auburn', 'Honey brown']
      },
      styleGuide: "Embrace light, warm, and clear colors. Your style should be fresh and lively. Think about flowy fabrics, floral prints, and gold accessories to highlight your natural warmth."
    },
    Summer: {
      shoppingList: [
        'Powder blue blazer',
        'Silver accessories',
        'Soft lavender blouse',
        'Pearl earrings',
        'Grey tailored trousers'
      ],
      beauty: {
        makeup: ['Rose pink blush', 'Mauve lipstick', 'Soft grey eyeliner', 'Cool berry gloss'],
        hair: ['Ash blonde', 'Cool light brown', 'Platinum blonde', 'Soft grey']
      },
      styleGuide: "Opt for cool, muted, and soft tones. Your look is elegant and understated. Silver jewelry, pearls, and soft, dusty colors like rose, mauve, and slate blue complement your complexion beautifully."
    },
    Autumn: {
      shoppingList: [
        'Rust orange sweater',
        'Gold hoop earrings',
        'Olive green cargo pants',
        'Mustard yellow scarf',
        'Brown leather boots'
      ],
      beauty: {
        makeup: ['Terracotta blush', 'Brick red lipstick', 'Warm brown eyeshadow', 'Copper highlighter'],
        hair: ['Rich chestnut', 'Auburn', 'Warm chocolate brown', 'Coppery red']
      },
      styleGuide: "Rich, warm, and earthy tones are your best friends. Your style exudes warmth and depth. Layer textures like wool, leather, and suede in colors like burnt orange, olive, and chocolate brown."
    },
    Winter: {
      shoppingList: [
        'Navy wool coat',
        'Silver statement necklace',
        'Crisp white shirt',
        'Black leather jacket',
        'Royal blue dress'
      ],
      beauty: {
        makeup: ['Cool red lipstick', 'Black liquid eyeliner', 'Silver eyeshadow', 'Berry cheek stain'],
        hair: ['Jet black', 'Ash brown', 'Cool dark brown', 'Silver/Grey']
      },
      styleGuide: "You shine in high-contrast, cool, and vivid colors. Go for bold, sharp looks. Black, white, and jewel tones like emerald green and royal blue are stunning on you. Silver jewelry adds a sleek finish."
    }
  };

  return content[season] || null;
};

module.exports = { analyzeColor, getSeasonPalette, getSeasonDescription, getPremiumContent };
