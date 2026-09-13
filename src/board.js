import { ships } from "./ship.js";

export class GameBoard {
  constructor() {
    this.board = Array.from({ length: 11 }, () => Array(11).fill(null));
    this.mark = null;
  }

  getBoard() {
    return this.board;
  }

  shipsPosition(ship, row, col, direction) {
    const typeOfShip = ships.ships[ship];

    if (direction === "vertical") {
      if (row + typeOfShip.length <= 11) {
        for (let i = 0; i < typeOfShip.length; i++) {
          if (this.board[row + i][col] !== null) {
            return;
          }
        }

        for (let i = 0; i < typeOfShip.length; i++) {
          this.board[row + i][col] = typeOfShip[i];
        }
      }
    } else if (direction === "horizontal") {
      if (col + typeOfShip.length <= 11) {
        for (let i = 0; i < typeOfShip.length; i++) {
          if (this.board[row][col + i] !== null) {
            return;
          }
        }
        for (let i = 0; i < typeOfShip.length; i++) {
          this.board[row][col + i] = typeOfShip[i];
        }
      }
    } else {
      alert("please select a valid direction");
      return;
    }
    console.log(this.board);
  }

  hitMarker(index, marker) {
    if (this.board[index] !== "") {
      return false;
    }

    this.board[index] = marker;
    return true;
  }
}

export const gameBoard = new GameBoard();

/* const position = gameBoard.shipsPosition("battleship", 2, 5);
console.log(position); */
