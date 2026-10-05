import { GameBoard, gameBoard, cBoard } from "./board.js";
import { ships } from "./ship.js";
import {
  playerBoard,
  computerBoard,
  shipsContainer,
  loadingScreen,
  mainContainer,
  midHero,
  welcomeContainer,
  targetLine,
  targetLine1,
  targetLine2,
  targetLine3,
  playButton,
  loadingOrbit,
  progressBar,
} from "./dom.js";
import battleshipImg from "./assets/ships-img/ShipBattleshipHull.png";
import carrierImg from "./assets/ships-img/ShipCarrierHull.png";
import cruiserImg from "./assets/ships-img/ShipCruiserHull.png";
import submarineImg from "./assets/ships-img/ShipSubMarineHull.png";
import destroyerImg from "./assets/ships-img/ShipDestroyerHull.png";
import targetCursor from "./assets/ships-img/target.png";
import welcomeBackground from "./assets/ships-img/sea.jpg";
import arrowUp from "./assets/ships-img/up-chevron.png";
import oceanAmbient from "./assets/music/dragon-studio-soothing-ocean-waves-372489.mp3";
import heroVideos from "./assets/video/Battleship animations.mp4";
import batlleshipGif from "./assets/ships-img/node-navy.gif";
import newShipBackground from "./assets/ships-img/newship.png";

class Display {
  constructor() {
    this.draggedShip = null;
    this.draggedDirection = null;
    this.highlightedBox = [];
    this.shipIsSunk = null;
    this.setOfShips = [];
    this.oldShipRow = null;
    this.oldShipCol = null;
    this.oldShipDirection = null;
    this.isRelocating = false;
    this.draggedShipElement = null;
  }

  //ships resizer

  positionShipInWrapper(wrapper, image, board, row, col, length, direction) {
    wrapper.style.position = "absolute";
    wrapper.style.inset = "0";
    wrapper.style.zIndex = "2";
    wrapper.style.pointerEvents = "none";
    wrapper.style.gridRow =
      direction === "vertical" ? `${row + 1} / span ${length}` : `${row + 1} / span 1`;
    wrapper.style.gridColumn =
      direction === "horizontal" ? `${col + 1} / span ${length}` : `${col + 1} / span 1`;

    const cell = board.querySelector(`.box[data-row="${row}"][data-col="${col}"]`);
    if (!cell) return;

    const { width: cellWidth, height: cellHeight } = cell.getBoundingClientRect();
    image.style.position = "absolute";
    image.style.left = "50%";
    image.style.top = "50%";
    image.style.transformOrigin = "center";
    image.style.objectFit = "fill";
    image.style.pointerEvents = board === playerBoard ? "auto" : "none";
    image.style.width = `${direction === "horizontal" ? cellHeight : cellWidth}px`;
    image.style.height = `${length * (direction === "horizontal" ? cellWidth : cellHeight)}px`;
    image.style.transform =
      direction === "horizontal" ? "translate(-50%, -50%) rotate(90deg)" : "translate(-50%, -50%)";
  }

  //element loader

  loadElement(element) {
    return new Promise((resolve, reject) => {
      if (element instanceof HTMLImageElement) {
        // If already loaded/cached
        if (element.complete) {
          return resolve();
        }
        element.onload = () => resolve();
        element.onerror = () => reject(new Error(`Failed to load image: ${element.src}`));
      } else if (element instanceof HTMLVideoElement || element instanceof HTMLAudioElement) {
        // readyState >= 3 means HAVE_FUTURE_DATA (can play)
        if (element.readyState >= 3) {
          return resolve();
        }
        element.oncanplay = () => resolve();
        element.onerror = () => reject(new Error(`Failed to load media: ${element.src}`));
      } else {
        resolve();
      }
    });
  }

  loadingBar() {}

  //loading screen async

  async loadingScreen() {
    const loadingPara = document.createElement("p");
    loadingScreen.append(loadingPara);

    const imageGif = document.createElement("img");
    imageGif.src = batlleshipGif;
    imageGif.classList.add("gif");
    loadingOrbit.append(imageGif);

    try {
      welcomeContainer.style.opacity = "0";
      loadingPara.textContent = "Initializing Game...";
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Now correctly awaits all render media loading
      await this.render();

      progressBar.style.width = "100%";
      loadingPara.textContent = "Succeed";

      // Wait 2 seconds before removing loading screen
      await new Promise((resolve) => setTimeout(resolve, 2000));

      loadingScreen.remove();
      const newShipDesign = document.querySelector(".newship");
      newShipDesign.classList.add("show");
      midHero.classList.add("show-hero");

      welcomeContainer.style.opacity = "1";
      document.body.style.backdropFilter = "none";
    } catch (error) {
      loadingPara.textContent = error.message;
    }
  }
  //resource render

  async render() {
    const assetsToLoad = [];

    const newShipDeployed = document.createElement("img");
    newShipDeployed.classList.add("newship");
    newShipDeployed.src = newShipBackground;
    welcomeContainer.append(newShipDeployed);

    assetsToLoad.push(this.loadElement(newShipDeployed));

    // Ocean music
    const oceanMusic = document.createElement("audio");
    oceanMusic.src = oceanAmbient;
    oceanMusic.autoplay = true;
    oceanMusic.loop = true;
    welcomeContainer.append(oceanMusic);
    assetsToLoad.push(this.loadElement(oceanMusic));

    // Target cursor asset
    const target = document.createElement("img");
    target.src = targetCursor;
    target.classList.add("target-cursor");
    welcomeContainer.append(target);
    assetsToLoad.push(this.loadElement(target));

    // Wait for all assets to finish loading before continuing
    await Promise.all(assetsToLoad);

    // Set up event listeners after assets are ready
    const targetRect = targetLine.getBoundingClientRect();
    const target1Rect = targetLine1.getBoundingClientRect();
    const target3Rect = targetLine3.getBoundingClientRect();
    const containerRect = targetLine2.getBoundingClientRect();

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

      // Target line 3
      const target3StartX = target3Rect.left;
      const target3StartY = target3Rect.top + target3Rect.height / 2;
      const target3Dx = event.clientX - target3StartX;
      const target3Dy = event.clientY - target3StartY;

      const target3Angle = Math.atan2(target3Dy, target3Dx);
      const target3Distance = Math.hypot(target3Dx, target3Dy);

      targetLine3.style.width = `${target3Distance}px`;
      targetLine3.style.transform = `rotate(${target3Angle}rad)`;
    });

    // Moved mouseenter/mouseleave outside mousemove listener
    playButton.addEventListener("mouseenter", () => {
      target.style.transform = "translate(-50%, -50%) scale(2)";
    });

    playButton.addEventListener("mouseleave", () => {
      target.style.transform = "translate(-50%, -50%) scale(1)";
    });
  }

  //resetting board
  resetBoard() {
    // 1. Reset state tracking properties
    this.draggedShip = null;
    this.draggedDirection = null;
    this.highlightedBox = [];
    this.setOfShips = [];
    this.oldShipRow = null;
    this.oldShipCol = null;
    this.oldShipDirection = null;
    this.isRelocating = false;
    this.draggedShipElement = null;

    // 2. Clear backend game board arrays
    for (let r = 0; r < gameBoard.board.length; r++) {
      for (let c = 0; c < gameBoard.board[r].length; c++) {
        gameBoard.board[r][c] = null;
        if (cBoard && cBoard.board) {
          cBoard.board[r][c] = null;
        }
      }
    }

    // 3. Remove all placed ship images from both boards
    const playerShips = playerBoard.querySelectorAll(".ship-placement");
    playerShips.forEach((img) => img.remove());

    const computerShips = computerBoard.querySelectorAll(".ship-placement");
    computerShips.forEach((img) => img.remove());

    // 4. Remove hit/miss marks or custom elements inside boxes
    const allBoxes = document.querySelectorAll(".box");
    allBoxes.forEach((box) => {
      box.style.backgroundColor = "";
      box.textContent = ""; // Clears text marks like 'X' or 'O'
      box.className = "box"; // Resets extra classes (e.g., .hit, .miss)

      // Remove mark elements or SVGs added inside boxes
      const marks = box.querySelectorAll(".mark, svg, span");
      marks.forEach((mark) => mark.remove());
    });

    // 5. Repopulate the sidebar ship selection container

    shipsContainer.innerHTML = "";
    this.displayShips();
    this.generateComputerShips();
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
                box.style.backgroundColor = "transparent";
              }
            }
            const shipWrapper = document.createElement("div");
            shipWrapper.classList.add("ship-placement");
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
            this.positionShipInWrapper(
              shipWrapper,
              placedShip,
              playerBoard,
              row,
              col,
              shipLength,
              direction
            );
            shipWrapper.append(placedShip);

            placedShip.addEventListener("click", () => {
              const shipLength = ships.ships[ship].length;
              const offSet = Math.floor(shipLength / 2);

              let newDirection = direction === "vertical" ? "horizontal" : "vertical";
              let newRow = direction === "vertical" ? row + offSet : row - offSet;
              let newCol = direction === "vertical" ? col - offSet : col + offSet;

              // Pre-validate boundaries before touching the board array
              if (
                newRow < 0 ||
                newCol < 0 ||
                (newDirection === "vertical" && newRow + shipLength > 11) ||
                (newDirection === "horizontal" && newCol + shipLength > 11)
              ) {
                alert("Cannot rotate ship here - out of bounds!");
                return;
              }

              // 1. Clear old placement from array temporarily
              for (let i = 0; i < shipLength; i++) {
                if (direction === "vertical") {
                  gameBoard.board[row + i][col] = null;
                } else {
                  gameBoard.board[row][col + i] = null;
                }
              }

              // 2. Validate position on board
              const newPlacement = gameBoard.shipsPosition(ship, newRow, newCol, newDirection);

              if (!newPlacement) {
                // Restore original position if rotation collides with another ship
                gameBoard.shipsPosition(ship, row, col, direction);
                alert("Cannot rotate ship here - blocked by another ship!");
                return;
              }

              // 3. Update current ship placement variables
              direction = newDirection;
              row = newRow;
              col = newCol;

              // 4. Re-apply styles/transforms
              this.positionShipInWrapper(
                shipWrapper,
                placedShip,
                playerBoard,
                row,
                col,
                shipLength,
                direction
              );

              // 5. Update board highlighting
              const boxes = playerBoard.querySelectorAll(".box");
              for (const box of boxes) {
                const bRow = Number(box.dataset.row);
                const bCol = Number(box.dataset.col);
                box.style.backgroundColor =
                  gameBoard.board[bRow][bCol] !== null ? "transparent" : "";
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
              this.draggedShipElement = shipWrapper;
              this.isRelocating = true;
            });
            console.log(playerBoard.children.length);
            playerBoard.append(shipWrapper);
          }
        });

        computerBoard.append(computerBox);
        playerBoard.append(playerBox);
      }
    }
    this.generateComputerShips();
  }

  generateComputerShips() {
    const computerShips = computerBoard.querySelectorAll(".ship-placement");
    computerShips.forEach((shipWrapper) => shipWrapper.remove());

    if (cBoard && cBoard.board) {
      for (let r = 0; r < cBoard.board.length; r++) {
        for (let c = 0; c < cBoard.board[r].length; c++) {
          cBoard.board[r][c] = null;
        }
      }
    }

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
          const shipWrapper = document.createElement("div");
          shipWrapper.classList.add("ship-placement", "computer-ship");
          shipWrapper.dataset.ship = ship;
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
          this.positionShipInWrapper(
            shipWrapper,
            placedImage,
            computerBoard,
            randomRow,
            randomCol,
            shipLength,
            cdirection
          );
          shipWrapper.append(placedImage);
          computerBoard.append(shipWrapper);
        }
      }
    }
  }
  displayShips() {
    const arrowImage = document.createElement("img");
    arrowImage.classList.add("up-image");
    arrowImage.src = arrowUp;
    arrowImage.addEventListener("click", () => {
      shipsContainer.classList.toggle("hidden");
    });
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

    shipsContainer.append(arrowImage, carrier, battleship, cruiser, submarine, destroyer);
  }
}

export const display = new Display();
