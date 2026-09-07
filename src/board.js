import { ships } from "./ship.js";

export class GameBoard {
  constructor() {
    this.board = Array.from({ length: 11 }, () => Array(11).fill(null));
    this.mark = null;
  }

  getBoard() {
    return this.board;
  }

  shipsPosition() {}

  hitMarker(index, marker) {
    if (this.board[index] !== "") {
      return false;
    }
    this.board[index] = marker;
    return true;
  }
}

export const gameBoard = new GameBoard();
