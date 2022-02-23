const { Shop, Item } = require('../src/gilded_rose.js');

describe('GildedRose shop manager', () => {
  let listItems;

  beforeEach(() => {
    listItems = [];
  });

  it("Baisser de 1 la qualité et sellIn d'item normaux", () => {
    listItems.push(new Item('+5 Dexterity Vest', 10, 20));
    listItems.push(new Item('Mana Cake', 3, 6));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { sellIn: 9, quality: 19 },
      { sellIn: 2, quality: 5 },
    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it('Augmenter la qualité de 1 pour Aged Brie et Backstage pass', () => {
    listItems.push(new Item('Aged Brie', 20, 30));
    listItems.push(new Item('Backstage passes to a TAFKAL80ETC concert', 20, 30));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { sellIn: 19, quality: 31 },
      { sellIn: 19, quality: 31 },
    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it('Augmenter la qualité de 3 quand il reste 5 jours ou moins avant la deadline du brie ou de backstage', () => {
    listItems.push(new Item('Aged Brie', 5, 30));
    listItems.push(new Item('Backstage passes to a TAFKAL80ETC concert', 4, 30));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { sellIn: 4, quality: 33 },
      { sellIn: 3, quality: 33 },
    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it('Ne pas modifier la qualité de Sulfuras', () => {
    listItems.push(new Item('Sulfuras', 5, 80));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { quality: 80 },
    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
    });
  });

  it("Réduire deux fois plus rapidement la qualité des items Conjured", () => {
    listItems.push(new Item('Conjured cat', 10, 20));
    listItems.push(new Item('+5 Astrology Vest', 10, 20));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { sellIn: 9, quality: 18 },
      { sellIn: 9, quality: 19 },

    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it("Réduire deux fois plus rapidement la qualité des items une fois la dates de péremption dépassée", () => {
    listItems.push(new Item('+5 Astrology Vest', 10, 20));
    listItems.push(new Item('Top quality cake', -1, 20));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { sellIn: 9, quality: 19 },
      { sellIn: -2, quality: 18 },

    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it("La qualité ne peux pas passer sous 0", () => {
    listItems.push(new Item('+5 Astrology Vest', 10, 0));
    listItems.push(new Item('Top quality cake', -1, 0));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { quality: 0 },
      { quality: 0 },

    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
    });
  });

  it("La qualité des produits (hors Sulfuras) ne peux pas passer au-dessus de 50", () => {
    listItems.push(new Item('Sulfuras', 10, 80));
    listItems.push(new Item('Aged Brie', 5, 50));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { quality: 80 },
      { quality: 50 },

    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
    });
  });

  it("La qualité des pass Backstage tombe à 0 après le concert", () => {
    listItems.push(new Item('Backstage passes', 0, 20));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    const expected = [
      { sellIn: -1, quality: 0 },

    ];
    expected.forEach((testCase, idx) => {
      expect(items[idx].quality).toBe(testCase.quality);
    });
  });
});