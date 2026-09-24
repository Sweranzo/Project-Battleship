import { GameBoard, gameBoard, cBoard } from "./board.js";
import { ships } from "./ship.js";
import {
  playerBoard,
  computerBoard,
  shipsContainer,
  mainContainer,
  midHero,
  welcomeContainer,
  targetLine,
  targetLine1,
  targetLine2,
  targetLine3,
  playButton,
} from "./dom.js";
import battleshipImg from "./assets/ships-img/ShipBattleshipHull.png";
import carrierImg from "./assets/ships-img/ShipCarrierHull.png";
import cruiserImg from "./assets/ships-img/ShipCruiserHull.png";
import submarineImg from "./assets/ships-img/ShipSubMarineHull.png";
import destroyerImg from "./assets/ships-img/ShipDestroyerHull.png";
import targetCursor from "./assets/ships-img/target.png";
import welcomeBackground from "./assets/ships-img/sea.jpg";
import oceanAmbient from "./assets/music/dragon-studio-soothing-ocean-waves-372489.mp3";
import heroVideos from "./assets/video/Battleship animations.mp4";

class Display {
  constructor() {
    this.draggedShip = null;
    this.draggedDirection = null;
    this.highlightedBox = [];
    this.setOfShips = [];
    this.oldShipRow = null;
    this.oldShipCol = null;
    this.oldShipDirection = null;
    this.isRelocating = false;
    this.draggedShipElement = null;
  }

  render() {
    // hero ship vid//
    const heroVideo = document.createElement("video");
    heroVideo.src = heroVideos;
    heroVideo.autoplay = true;
    heroVideo.muted = true;
    heroVideo.loop = true;
    heroVideo.classList.add("hero-vid");
    midHero.append(heroVideo);

    // sea background //

    const seaBackground = document.createElement("img");
    seaBackground.src = welcomeBackground;
    seaBackground.classList.add("sea-background");
    welcomeContainer.append(seaBackground);

    // ocean music //

    const oceanMusic = document.createElement("audio");
    oceanMusic.src = oceanAmbient;
    oceanMusic.autoplay = true;
    oceanMusic.loop = true;
    welcomeContainer.append(oceanMusic);

    // target cursor //

    const target = document.createElement("img");
    target.src = targetCursor;
    target.classList.add("target-cursor");
    welcomeContainer.append(target);
    const targetRect = targetLine.getBoundingClientRect();
    const target1Rect = targetLine1.getBoundingClientRect();
    const target3Rect = targetLine3.getBoundingClientRect();
    const containerRect = targetLine2.getBoundingClientRect();
    console.log(targetLine3.offsetParent);

    welcomeContainer.addEventListener("mousemove", (event) => {
      target.style.left = `${event.clientX}px`;
      target.style.top = `${event.clientY}px`;

      const startX = targetRect.left;
      const startY = targetRect.top + targetRect.height / 2;

      const newStartX = target1Rect.right;
      const newStartY = target1Rect.bottom + target1Rect.height / 2;
      const newDx = event.clientX - newStartX;
      const newDy = event.clientY - newStartY;

      const newAngle = Math.atan2(newDy, newDx);
      const newDistance = Math.hypot(newDx, newDy);

      const dx = event.clientX - startX;
      const dy = event.clientY - startY;

      const angle = Math.atan2(dy, dx);
      const distance = Math.hypot(dx, dy);

      targetLine.style.width = `${distance}px`;
      targetLine.style.transform = `rotate(${angle}rad)`;

      targetLine1.style.width = `${newDistance}px`;
      targetLine1.style.transform = `rotate(${newAngle}rad)`;

      // Target line 2
      const target2StartX = containerRect.left;
      const target2StartY = containerRect.top + containerRect.height / 2;

      const target2Dx = event.clientX - target2StartX;
      const target2Dy = event.clientY - target2StartY;

      const target2Angle = Math.atan2(target2Dy, target2Dx);
      const target2Distance = Math.hypot(target2Dx, target2Dy);

      targetLine2.style.width = `${target2Distance}px`;
      targetLine2.style.transform = `rotate(${target2Angle}rad)`;

      //target line 3

      const target3StartX = target3Rect.left;
      const target3StartY = target3Rect.top + target3Rect.height / 2;

      const target3Dx = event.clientX - target3StartX;
      const target3Dy = event.clientY - target3StartY;

      const target3Angle = Math.atan2(target3Dy, target3Dx);
      const target3Distance = Math.hypot(target3Dx, target3Dy);

      targetLine3.style.width = `${target3Distance}px`;
      targetLine3.style.transform = `rotate(${target3Angle}rad)`;
      console.log("left:", target3Rect.left);
      console.log("right:", target3Rect.right);
      console.log("top:", target3Rect.top);
      console.log("height:", target3Rect.height);

      console.log(target3StartX);

      // play button enlargement
      playButton.addEventListener("mouseenter", () => {
        target.style.transform = "translate(-50%, -50%) scale(2)";
      });

      playButton.addEventListener("mouseleave", () => {
        target.style.transform = "translate(-50%, -50%) scale(1)";
      });
    });
  }

  showBoard() {
    for (let row = 0; row < gameBoard.board.length; row++) {
      for (let col = 0; col < gameBoard.board[row].length; col++) {
        console.log(`this is col ${col}`);
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
          const ship = event.dataTransfer.getData("ship");
          let direction = event.dataTransfer.getData("direction");
          let isRelocating = this.isRelocating;
          const removeShip = document.querySelector(`.ships-container [data-ship="${ship}"]`);

          if (!isRelocating && this.setOfShips.length >= 5) {
            this.isRelocating = false;
            return;
          }
          let row = Number(playerBox.dataset.row);
          let col = Number(playerBox.dataset.col);
          const shipLength = ships.ships[ship].length;

          // Remove old position
          if (isRelocating) {
            for (let i = 0; i < shipLength; i++) {
              if (this.oldShipDirection === "vertical") {
                gameBoard.board[this.oldShipRow + i][this.oldShipCol] = null;
              } else {
                gameBoard.board[this.oldShipRow][this.oldShipCol + i] = null;
              }
            }
          }

          const placed = gameBoard.shipsPosition(ship, row, col, direction);

          console.log(this.setOfShips);

          if (!placed) {
            // If relocation failed, restore previous position on the board grid array
            if (isRelocating) {
              gameBoard.shipsPosition(
                ship,
                this.oldShipRow,
                this.oldShipCol,
                this.oldShipDirection
              );
            }
            this.isRelocating = false;
            alert("Invalid placement!");
            return;
          }

          if (isRelocating && this.draggedShipElement) {
            this.draggedShipElement.remove();
          } else {
            // New ship from sidebar
            const sidebarShip = shipsContainer.querySelector(`[data-ship="${ship}"]`);
            if (sidebarShip) sidebarShip.remove();
            this.setOfShips.push(placed);
          }

          this.isRelocating = false;

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
            placedShip.dataset.ship = ship;

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
            }

            placedShip.addEventListener("click", () => {
              const shipLength = ships.ships[ship].length;
              const offSet = Math.floor(shipLength / 2);

              let newDirection;
              let newRow;
              let newCol;

              if (direction === "vertical") {
                newDirection = "horizontal";
                newRow = row + offSet;
                newCol = col - offSet;
              } else {
                newDirection = "vertical";
                newRow = row - offSet;
                newCol = col + offSet;
              }

              // 1. Temporarily clear old placement from board array to avoid self-collision
              for (let i = 0; i < shipLength; i++) {
                if (direction === "vertical") {
                  gameBoard.board[row + i][col] = null;
                } else {
                  gameBoard.board[row][col + i] = null;
                }
              }

              // 2. Validate new position with the NEW direction
              const newPlacement = gameBoard.shipsPosition(ship, newRow, newCol, newDirection);

              if (!newPlacement) {
                // Revert board array back to original position if rotation fails
                gameBoard.shipsPosition(ship, row, col, direction);
                alert("Cannot rotate ship here!");
                return;
              }

              // 3. Update local state variables for future clicks / drags
              direction = newDirection;
              row = newRow;
              col = newCol;

              // 4. Update element positioning and transforms
              if (direction === "horizontal") {
                placedShip.style.gridRow = `${row + 1}`;
                placedShip.style.gridColumn = `${col + 1} / span ${shipLength}`;
                placedShip.style.transform = "rotate(90deg) translateY(-100%)";
                placedShip.style.transformOrigin = "top left";
                placedShip.style.translate = "-1px 0";
                placedShip.style.height = "";
              } else {
                placedShip.style.gridRow = `${row + 1} / span ${shipLength}`;
                placedShip.style.gridColumn = `${col + 1}`;
                placedShip.style.transform = "rotate(0deg)";
                placedShip.style.transformOrigin = "";
                placedShip.style.translate = "";
                placedShip.style.height = "100%";
              }

              // 5. Update board cell background highlighting
              const boxes = playerBoard.querySelectorAll(".box");
              for (const box of boxes) {
                const bRow = Number(box.dataset.row);
                const bCol = Number(box.dataset.col);
                box.style.backgroundColor = gameBoard.board[bRow][bCol] !== null ? "red" : "";
              }
            });
            placedShip.addEventListener("dragstart", (e) => {
              e.dataTransfer.setData("ship", ship);
              e.dataTransfer.setData("direction", direction);
              this.oldShipRow = row;
              this.oldShipCol = col;
              this.oldShipDirection = direction;
              this.draggedShip = ship;
              this.draggedDirection = direction;
              this.draggedShipElement = placedShip;
              this.isRelocating = true;
            });
            console.log(playerBoard.children.length);
            playerBoard.append(placedShip);
          }
        });

        computerBoard.append(computerBox);
        playerBoard.append(playerBox);
      }
    }

    //computer move generation //
    const randomShip = ["cruiser", "battleship", "carrier", "submarine", "destroyer"];

    for (const ship of randomShip) {
      let randomRow;
      let randomCol;
      let cdirection;
      let placeComputerShip = false;

      while (!placeComputerShip) {
        randomRow = Math.floor(Math.random() * 11);
        randomCol = Math.floor(Math.random() * 11);

        cdirection = Math.random() < 0.5 ? "vertical" : "horizontal";

        placeComputerShip = cBoard.shipsPosition(ship, randomRow, randomCol, cdirection);
        if (placeComputerShip) {
          const boxes = computerBoard.querySelectorAll(".box");
          for (const box of boxes) {
            const row = Number(box.dataset.row);
            const col = Number(box.dataset.col);
            if (cBoard.board[row][col] !== null) {
              box.style.backgroundColor = "red";
            }
          }
          const placedImage = document.createElement("img");
          const shipImages = {
            carrier: carrierImg,
            battleship: battleshipImg,
            cruiser: cruiserImg,
            submarine: submarineImg,
            destroyer: destroyerImg,
          };

          placedImage.src = shipImages[ship];

          const shipLength = ships.ships[ship].length;

          if (cdirection === "vertical") {
            placedImage.style.gridRow = `${randomRow + 1} / span ${shipLength}`;
            placedImage.style.position = "absolute";
            placedImage.style.gridColumn = `${randomCol + 1}`;
            placedImage.style.height = "100%";
          } else {
            placedImage.style.gridRow = `${randomRow + 1}`;
            placedImage.style.position = "absolute";
            placedImage.style.gridColumn = `${randomCol + 1} / span ${shipLength}`;
            placedImage.style.transform = "rotate(90deg) translateY(-100%)";
            placedImage.style.transformOrigin = "top left";
            placedImage.style.translate = "-1px 0";
            /*  placedShip.style.width = `${shipLength * 100}%`; */
          }

          computerBoard.append(placedImage);
        }
      }

      console.log(ship, randomRow, randomCol, cdirection);
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
          //Computer Moves Generation//
          ship.style.transform = "rotate(90deg)";
          console.log("image rotated");
        } else {
          ship.dataset.direction = "vertical";
          ship.style.transform = "rotate(0deg)";
          console.log("image rotated");
        }
      });

      ship.addEventListener("dragstart", (event) => {
        this.isRelocating = false;
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
