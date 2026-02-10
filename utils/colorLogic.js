
const analyzeColor = (r, g, b) => {
  // 1. Přesnější výpočet jasu (Luminosity)
  // Váha barev odpovídá citlivosti lidského oka
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // 2. Rozhodnutí o podtónu (Warm vs Cool)
  // Upravená podmínka pro lepší detekci pleti
  const isWarm = (r > b) && (g > (b * 0.9));

  // 3. Rozhodnutí o jasu (Light vs Dark)
  // Práh 0.65 lépe odděluje Summer/Spring od Winter/Autumn
  const isLight = brightness > 0.65;

  // 4. Přiřazení sezóny
  let season = "Winter";
  if (isWarm) {
    season = isLight ? "Spring" : "Autumn";
  } else {
    season = isLight ? "Summer" : "Winter";
  }

  return {
    season,
    details: {
      brightness: brightness.toFixed(2),
      isWarm,
      isLight
    }
  };
};

const getSeasonPalette = (season) => {
  switch (season) {
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
  switch (season) {
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
