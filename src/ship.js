export class Ships {
  constructor() {
    this.carrier = Array(5).fill(5);
    this.battleShip = Array(4).fill(4);
    this.cruiser = Array(3).fill(3);
    this.submarine = Array(3).fill(3);
    this.destroyer = Array(2).fill(2);
  }
}

export const ships = new Ships();
