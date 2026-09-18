import { GameBoard, gameBoard } from "./board.js";
import { ships } from "./ship.js";
import { playerBoard, computerBoard, shipsContainer } from "./dom.js";
import battleshipImg from "./ships-img/ShipBattleshipHull.png";
import carrierImg from "./ships-img/ShipCarrierHull.png";
import cruiserImg from "./ships-img/ShipCruiserHull.png";
import submarineImg from "./ships-img/ShipSubMarineHull.png";
import destroyerImg from "./ships-img/ShipDestroyerHull.png";
class Display {
  constructor() {
    this.draggedShip = null;
    this.draggedDirection = null;
    this.highlightedBox = [];
    this.setOfShips = [];
  }

  showBoard() {
    for (let row = 0; row < gameBoard.board.length; row++) {
      for (let col = 0; col < gameBoard.board[row].length; col++) {
        const playerBox = document.createElement("div");
        playerBox.classList.add("box");

        const computerBox = document.createElement("div");
        computerBox.classList.add("box");

        playerBox.dataset.row = row;
        playerBox.dataset.col = col;

        computerBox.dataset.row = row;
        computerBox.dataset.col = col;

        playerBox.addEventListener("dragover", (event) => {
          event.preventDefault();

          for (const box of this.highlightedBox) {
            box.style.backgroundColor = "";
          }

          this.highlightedBox = [];

          const ship = this.draggedShip;
          const direction = this.draggedDirection;

          const row = Number(playerBox.dataset.row);
          const col = Number(playerBox.dataset.col);

          const shipLength = ships.ships[ship].length;

          for (let i = 0; i < shipLength; i++) {
            let targetRow = row;
            let targetCol = col;

            if (direction === "vertical") {
              targetRow = row + i;
            } else {
              targetCol = col + i;
            }

            const box = playerBoard.querySelector(
              `.box[data-row="${targetRow}"][data-col="${targetCol}"]`
            );

            if (box) {
              box.style.backgroundColor = "red";

              this.highlightedBox.push(box);
            }
          }
        });

        playerBox.addEventListener("drop", (event) => {
          if (this.setOfShips.length > 5) {
            return;
          }
          console.log(this.setOfShips);
          const ship = event.dataTransfer.getData("ship");

          const shipRemoveContent = shipsContainer.querySelector(
            `[data-ship="${this.draggedShip}"]`
          );

          if (shipRemoveContent) {
            shipsContainer.removeChild(shipRemoveContent);
          }
          let direction = event.dataTransfer.getData("direction");
          const row = Number(playerBox.dataset.row);
          const col = Number(playerBox.dataset.col);
          console.log(ship, row, col, direction);
          const placed = gameBoard.shipsPosition(ship, row, col, direction);

          this.setOfShips.push(placed);
          console.log(this.setOfShips);
          const shipLength = ships.ships[ship].length;

          if (direction === "vertical") {
            if (row + shipLength > gameBoard.board.length) {
              alert("This ain't valid, try again");
              return;
            }
          }

          if (direction === "horizontal") {
            if (col + shipLength > gameBoard.board[row].length) {
              alert("This ain't valid, try again");
              return;
            }
          }
          if (placed) {
            const boxes = playerBoard.querySelectorAll(".box");
            for (const box of boxes) {
              const boxRow = Number(box.dataset.row);
              const boxCol = Number(box.dataset.col);
              if (gameBoard.board[boxRow][boxCol] !== null) {
                box.style.backgroundColor = "red";
              }
            }
            const placedShip = document.createElement("img");
            const shipImages = {
              carrier: carrierImg,
              battleship: battleshipImg,
              cruiser: cruiserImg,
              submarine: submarineImg,
              destroyer: destroyerImg,
            };

            placedShip.src = shipImages[ship];
            placedShip.draggable = true;

            const shipLength = ships.ships[ship].length;

            if (direction === "vertical") {
              placedShip.style.gridRow = `${row + 1} / span ${shipLength}`;
              placedShip.style.position = "absolute";
              placedShip.style.gridColumn = `${col + 1}`;
              placedShip.style.height = "100%";
            } else {
              placedShip.style.gridRow = `${row + 1}`;
              placedShip.style.position = "absolute";
              placedShip.style.gridColumn = `${col + 1} / span ${shipLength}`;
              placedShip.style.transform = "rotate(90deg) translateY(-100%)";
              placedShip.style.transformOrigin = "top left";
              placedShip.style.translate = "-1px 0";
              /*  placedShip.style.width = `${shipLength * 100}%`; */
            }

            placedShip.addEventListener("click", () => {
              const offSet = Math.floor(shipLength / 2);
              let newCol = null;
              let newRow = null;
              if (direction === "vertical") {
                newRow = row + offSet;
                newCol = col - offSet;

                if (newCol + ship.length <= 11) {
                  const newPlacement = gameBoard.shipsPosition(ship, newRow, newCol, direction);
                  console.log(newPlacement);
                  console.log(gameBoard.board);
                  for (let i = 0; i < ship.length; i++) {
                    gameBoard.board[row + i][col] = null;
                  }
                }
                direction = "horizontal";
                placedShip.style.gridRow = `${row + 1}`;
                placedShip.style.gridColumn = `${col + 1} / span ${shipLength}`;
                placedShip.style.transform = "rotate(90deg)";
              } else {
                newRow = row - offSet;
                newCol = col + offSet;
                // Change to vertical

                if (newRow + ship.length <= 11) {
                  const newPlacement = gameBoard.shipsPosition(ship, newRow, newCol, direction);
                  console.log(newPlacement);
                  console.log(gameBoard.board);
                  for (let i = 0; i < ship.length; i++) {
                    gameBoard.board[row][col + i] = null;
                  }
                }
                direction = "vertical";
                placedShip.style.gridRow = `${row + 1} / span ${shipLength}`;
                placedShip.style.gridColumn = `${col + 1}`;
                placedShip.style.transform = "rotate(0deg)";
              }
            });

            placedShip.addEventListener("dragstart", (e) => {
              console.log("dragging");
            });

            placedShip.addEventListener("drop", (e) => {
              const newShip = this.draggedShip;
              const newDirection = this.draggedDirection;

              const newPlacement = this.setOfShips(newShip, row, col, newDirection);
              console.log(newPlacement);
            });
            console.log(playerBoard.children.length);
            playerBoard.append(placedShip);
          }
        });

        computerBoard.append(computerBox);
        playerBoard.append(playerBox);
      }
    }
  }
  displayShips() {
    const carrier = document.createElement("img");
    carrier.src = carrierImg;
    const battleship = document.createElement("img");
    battleship.src = battleshipImg;
    const cruiser = document.createElement("img");
    cruiser.src = cruiserImg;
    const submarine = document.createElement("img");
    submarine.src = submarineImg;
    const destroyer = document.createElement("img");
    destroyer.src = destroyerImg;

    carrier.dataset.ship = "carrier";
    battleship.dataset.ship = "battleship";
    cruiser.dataset.ship = "cruiser";
    submarine.dataset.ship = "submarine";
    destroyer.dataset.ship = "destroyer";

    const ships = [carrier, battleship, cruiser, submarine, destroyer];

    for (const ship of ships) {
      ship.draggable = true;
      ship.dataset.direction = "vertical";

      ship.addEventListener("click", () => {
        if (ship.dataset.direction === "vertical") {
          ship.dataset.direction = "horizontal";
          ship.style.transform = "rotate(90deg)";
          console.log("image rotated");
        } else {
          ship.dataset.direction = "vertical";
          ship.style.transform = "rotate(0deg)";
          console.log("image rotated");
        }
      });

      ship.addEventListener("dragstart", (event) => {
        this.draggedShip = ship.dataset.ship;
        this.draggedDirection = ship.dataset.direction;

        event.dataTransfer.setData("ship", this.draggedShip);
        event.dataTransfer.setData("direction", this.draggedDirection);
      });
    }

    shipsContainer.append(carrier, battleship, cruiser, submarine, destroyer);
  }
}

export const display = new Display();
