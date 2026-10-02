import { ships } from "./ship.js";

export class GameBoard {
  constructor() {
    this.board = Array.from({ length: 11 }, () => Array(11).fill(null));
    this.entryCount = 0;
  }

  getBoard() {
    return this.board;
  }

  shipsPosition(ship, row, col, direction) {
    const typeOfShip = ships.ships[ship];
    if (!typeOfShip) return false;

    const length = typeOfShip.length;

    // Global boundary checks (prevent negative indices or values >= 11)
    if (row < 0 || col < 0 || row >= 11 || col >= 11) {
      return false;
    }

    if (direction === "vertical") {
      // Check vertical overflow
      if (row + length > 11) {
        return false;
      }

      // Check collision safely
      for (let i = 0; i < length; i++) {
        if (this.board[row + i] === undefined || this.board[row + i][col] !== null) {
          return false;
        }
      }

      // Place ship
      for (let i = 0; i < length; i++) {
        this.board[row + i][col] = ship;
      }

      this.entryCount++;
      return true;
    } else if (direction === "horizontal") {
      // Check horizontal overflow
      if (col + length > 11) {
        return false;
      }

      // Check collision safely
      for (let i = 0; i < length; i++) {
        if (this.board[row][col + i] !== null) {
          return false;
        }
      }

      // Place ship
      for (let i = 0; i < length; i++) {
        this.board[row][col + i] = ship;
      }

      this.entryCount++;
      return true;
    } else {
      return false;
    }
  }
}

export const gameBoard = new GameBoard();
export const cBoard = new GameBoard();
console.log(gameBoard.board);
console.log(cBoard.board);

/* const position = gameBoard.shipsPosition("battleship", 2, 5);
console.log(position); */
