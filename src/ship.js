export class Ship {
  constructor() {
    this.ships = {
      carrier: Array(5).fill("Ca"),
      battleship: Array(4).fill("B"),
      cruiser: Array(3).fill("Cr"),
      submarine: Array(3).fill("S"),
      destroyer: Array(2).fill("D"),
    };
  }
}

export const ships = new Ship();
