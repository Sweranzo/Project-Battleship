import { cBoard, gameBoard } from "./board.js";
import { display } from "./display.js";
import { computerBoard, playerBoard } from "./dom.js";

class GameController {
  constructor() {
    this.currentTurn = "human";
    this.playerWinChecker = 0;
    this.computerWinChecker = 0;
  }

  createMark() {
    const mark = document.createElement("p");
    mark.classList.add("mark");
    mark.textContent = "X";
    return mark;
  }

  checkPlayerWin() {
    if (this.playerWinChecker >= 17) {
      alert("Player Win, Computer Lose");
      this.currentTurn = null;
      return true;
    }

    return false;
  }

  checkComputerWin() {
    if (this.computerWinChecker >= 17) {
      alert("Computer Win, Player Lose");
      this.currentTurn = null;
      return true;
    }

    return false;
  }

  computerMove() {
    if (this.currentTurn !== "computer") {
      return;
    }

    const boxes = playerBoard.querySelectorAll(".box");

    let randomRow;
    let randomCol;
    let selectedBox;

    // Find a random unselected box
    do {
      randomRow = Math.floor(Math.random() * 11);
      randomCol = Math.floor(Math.random() * 11);

      for (const box of boxes) {
        if (Number(box.dataset.row) === randomRow && Number(box.dataset.col) === randomCol) {
          selectedBox = box;
          break;
        }
      }
    } while (selectedBox.dataset.selected === "true");

    selectedBox.dataset.selected = "true";
    selectedBox.append(this.createMark());

    // MISS
    if (gameBoard.board[randomRow][randomCol] === null) {
      this.currentTurn = "human";
      return;
    }

    // HIT
    this.computerWinChecker++;

    if (this.checkComputerWin()) {
      return;
    }

    // Look for a neighboring target
    const neighbors = [
      [randomRow - 1, randomCol], // top
      [randomRow + 1, randomCol], // bottom
      [randomRow, randomCol + 1], // right
      [randomRow, randomCol - 1], // left
    ];

    let nextBox = null;

    for (const [row, col] of neighbors) {
      // Outside board
      if (row < 0 || row > 10 || col < 0 || col > 10) {
        continue;
      }

      for (const box of boxes) {
        if (
          Number(box.dataset.row) === row &&
          Number(box.dataset.col) === col &&
          box.dataset.selected !== "true"
        ) {
          nextBox = box;
          break;
        }
      }

      if (nextBox !== null) {
        break;
      }
    }

    // No available neighbor
    if (nextBox === null) {
      this.currentTurn = "human";
      return;
    }

    const nextRow = Number(nextBox.dataset.row);
    const nextCol = Number(nextBox.dataset.col);

    nextBox.dataset.selected = "true";
    nextBox.append(this.createMark());

    // Neighbor is a MISS
    if (gameBoard.board[nextRow][nextCol] === null) {
      this.currentTurn = "human";
      return;
    }

    // Neighbor is a HIT
    this.computerWinChecker++;

    if (this.checkComputerWin()) {
      return;
    }

    // Computer continues
    this.computerMove();
  }

  playGame() {
    const boxes = computerBoard.querySelectorAll(".box");

    boxes.forEach((box) => {
      box.addEventListener("click", () => {
        if (display.setOfShips.length < 5) {
          alert("add all the remaining ships");
          return;
        }
        // Only player can shoot during player's turn
        if (this.currentTurn !== "human") {
          return;
        }

        // Don't shoot the same box twice
        if (box.dataset.selected === "true") {
          return;
        }

        const row = Number(box.dataset.row);
        const col = Number(box.dataset.col);

        box.dataset.selected = "true";
        box.append(this.createMark());

        // MISS
        if (cBoard.board[row][col] === null) {
          this.currentTurn = "computer";
          this.computerMove();
          return;
        }

        // HIT
        this.playerWinChecker++;

        if (this.checkPlayerWin()) {
          return;
        }

        // Hit means player gets another shot
        this.currentTurn = "human";
      });
    });
  }
}

export const play = new GameController();
