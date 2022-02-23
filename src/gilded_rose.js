class Item {
  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
    this.isLegendary = false;
    this.isBetterWhenGetOdler = false;
    this.isConjured = false;
    this.expireSpeed = 1;
  }

  getStatus() {
    if (this.name.includes('Backstage', 0) || this.name.includes('Aged Brie', 0)) {
      this.isBetterWhenGetOdler = true;
    } else if (this.name.includes('Sulfuras', 0)) {
      this.isLegendary = true;
    } else if (this.name.includes('Conjured', 0)) {
      this.isConjured = true;
      this.expireSpeed = 2;
    }
  }

  ifQualityMinMaxExceed() {
    if (this.quality >= 50 || this.quality <= 0) {
      if (this.quality > 50) this.quality = 50;
      if (this.quality < 0) this.quality = 0;
    }
  }

  ifIsExpired() {
    if (this.sellIn <= 0) {
      if (this.isBetterWhenGetOdler) {
        this.quality = 0;
      } else {
        this.expireSpeed = 2;

        if (this.isConjured) this.expireSpeed = 4;

        this.quality -= this.expireSpeed;
        this.ifQualityMinMaxExceed();
      }
      this.sellIn--;
      return true;
    }
    return false;
  }

  countADay() {
    if (this.isLegendary) {
      return;
    }

    if (this.ifIsExpired()) return;

    if (this.isBetterWhenGetOdler) {
      if (this.sellIn <= 10 && this.sellIn > 5) {
        this.quality += 2;
      } else if (this.sellIn <= 5) {
        this.quality += 3;
      } else this.quality++;
    } else {
      this.quality -= this.expireSpeed;
    }
    this.ifQualityMinMaxExceed();
    this.sellIn--;
  }
}

class Shop {
  constructor(items = []) {
    this.items = items;
  }

  updateQuality() {
    this.items.forEach((product) => {
      product.getStatus();
      product.countADay();
    });

    return this.items;
  }
}

module.exports = {
  Item,
  Shop,
};
