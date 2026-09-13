import { gameBoard } from "./board.js";
import { ships } from "./ship.js";
import { playerBoard, computerBoard, shipsContainer } from "./dom.js";
import battleshipImg from "./ships-img/ShipBattleshipHull.png";
import carrierImg from "./ships-img/ShipCarrierHull.png";
import cruiserImg from "./ships-img/ShipCruiserHull.png";
import submarineImg from "./ships-img/ShipSubMarineHull.png";
import destroyerImg from "./ships-img/ShipDestroyerHull.png";
class Display {
  constructor() {}

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
        playerBox.addEventListener("dragover", (e) => {
          e.preventDefault();
        });

        playerBox.addEventListener("drop", (event) => {
          const ship = event.dataTransfer.getData("ship");
          const direction = event.dataTransfer.getData("direction");
          const row = Number(playerBox.dataset.row);
          const col = Number(playerBox.dataset.col);
          gameBoard.shipsPosition(ship, row, col, direction);
          console.log(ship, row, col, direction);
          if (gameBoard.board[row][col] !== null) {
            const placedShip = document.createElement("img");
            const shipImages = {
              carrier: carrierImg,
              battleship: battleshipImg,
              cruiser: cruiserImg,
              submarine: submarineImg,
              destroyer: destroyerImg,
            };

            placedShip.src = shipImages[ship];

            const shipLength = ships.ships[ship].length;

            if (direction === "vertical") {
              placedShip.style.gridRow = `${row + 1} / span ${shipLength}`;
              placedShip.style.gridColumn = `${col + 1}`;
            } else {
              placedShip.style.gridRow = `${row + 1}`;
              placedShip.style.gridColumn = `${col + 1} / span ${shipLength}`;
            }

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
        event.dataTransfer.setData("ship", ship.dataset.ship);
        event.dataTransfer.setData("direction", ship.dataset.direction);
      });
    }

    shipsContainer.append(carrier, battleship, cruiser, submarine, destroyer);
  }
}

export const display = new Display();
