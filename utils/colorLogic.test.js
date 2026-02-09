
const { analyzeColor, getSeasonPalette, getPremiumContent } = require('./colorLogic');

describe('Color Logic', () => {
  test('Spring detection (Warm + Light)', () => {
    // Light Warm color
    const r = 255, g = 200, b = 150;
    const result = analyzeColor(r, g, b);
    expect(result.season).toBe('Spring');
  });

  test('Winter detection (Cool + Dark)', () => {
    // Dark Cool color
    const r = 0, g = 0, b = 50; 
    const result = analyzeColor(r, g, b);
    expect(result.season).toBe('Winter');
  });

  test('Palette generation', () => {
    const palette = getSeasonPalette('Spring');
    expect(palette.length).toBeGreaterThan(0);
    expect(palette).toContain('#FF7F50');
  });

  test('Premium Content generation', () => {
    const content = getPremiumContent('Spring');
    expect(content).toHaveProperty('shoppingList');
    expect(content).toHaveProperty('beauty');
    expect(content).toHaveProperty('styleGuide');
    expect(content.shoppingList.length).toBeGreaterThan(0);
  });
});
