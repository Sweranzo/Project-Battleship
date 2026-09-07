import { gameBoard } from "./board.js";
import { playerBoard, computerBoard } from "./dom.js";

class Display {
  constructor() {}

  showBoard() {
    for (const arr of gameBoard.board) {
      for (const el of arr) {
        const playerBox = document.createElement("div");
        playerBox.classList.add("box");

        const computerBox = document.createElement("div");
        computerBox.classList.add("box");

        computerBoard.append(computerBox);
        playerBoard.append(playerBox);
      }
    }
  }
}

export const display = new Display();
