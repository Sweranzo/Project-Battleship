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

function positionShipInWrapper(wrapper, image, board, row, col, length, direction) {
  wrapper.style.position = "absolute";
  wrapper.style.inset = "0";
  wrapper.style.zIndex = "2";
  wrapper.style.pointerEvents = "none";
  wrapper.style.gridRow = direction === "vertical"
    ? `${row + 1} / span ${length}`
    : `${row + 1} / span 1`;
  wrapper.style.gridColumn = direction === "horizontal"
    ? `${col + 1} / span ${length}`
    : `${col + 1} / span 1`;

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
  image.style.transform = direction === "horizontal"
    ? "translate(-50%, -50%) rotate(90deg)"
    : "translate(-50%, -50%)";
}

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

  loadElement(element) {
    if (element instanceof HTMLImageElement) {
      return new Promise((resolve, reject) => {
        element.onload = () => {
          resolve();
        };

        element.onerror = () => {
          reject(new Error("Image failed to load"));
        };
      });
    } else if (element instanceof HTMLVideoElement) {
      return new Promise((resolve, reject) => {
        element.oncanplay = () => {
          resolve();
        };
        element.onerror = () => {
          reject(new Error("Video Failed to load"));
        };
      });
    } else if (element instanceof HTMLAudioElement) {
      return new Promise((resolve, reject) => {
        element.oncanplay = () => {
          resolve();
        };
        element.onerror = () => {
          reject(new Error("Audio Faile to load"));
        };
      });
    }
  }

  async loadingScreen() {
    try {
      await this.render();
      loadingScreen.textContent = "All Display Resources Successfully loaded!";
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });

      loadingScreen.remove();
      welcomeContainer.style.filter = "none";
    } catch (error) {
      loadingScreen.textContent = error.message;
    }
  }

  async render() {
    // hero ship vid//
    const heroVideo = document.createElement("video");
    heroVideo.src = heroVideos;
    heroVideo.autoplay = true;
    heroVideo.muted = true;
    heroVideo.loop = true;
    heroVideo.classList.add("hero-vid");
    midHero.append(heroVideo);
    midHero.style.display = "flex";
    loadingScreen.textContent = "Loading resources....";

    await this.loadElement(heroVideo);
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    loadingScreen.textContent = "loading video";
    // sea background //
    const seaBackground = document.createElement("img");
    seaBackground.src = welcomeBackground;
    seaBackground.classList.add("sea-background");
    welcomeContainer.append(seaBackground);

    await this.loadElement(seaBackground);
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    loadingScreen.textContent = "loading background image";

    // ocean music //

    const oceanMusic = document.createElement("audio");
    oceanMusic.src = oceanAmbient;
    oceanMusic.autoplay = true;
    oceanMusic.loop = true;
    welcomeContainer.append(oceanMusic);
    await this.loadElement(oceanMusic);
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    loadingScreen.textContent = "loading audio";

    // target cursor //

    const target = document.createElement("img");
    target.src = targetCursor;
    target.classList.add("target-cursor");
    welcomeContainer.append(target);
    console.log(targetLine);
    const targetRect = targetLine.getBoundingClientRect();
    const target1Rect = targetLine1.getBoundingClientRect();
    const target3Rect = targetLine3.getBoundingClientRect();
    const containerRect = targetLine2.getBoundingClientRect();
    console.log(targetLine3.offsetParent);

    welcomeContainer.addEventListener("mousemove", (event) => {
      console.log(`${event.clientY},${event.clientX}`);
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
            positionShipInWrapper(shipWrapper, placedShip, playerBoard, row, col, shipLength, direction);
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
              positionShipInWrapper(shipWrapper, placedShip, playerBoard, row, col, shipLength, direction);

              // 5. Update board highlighting
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
    const computerShips = computerBoard.querySelectorAll("img");
    computerShips.forEach((img) => img.remove());

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
          const boxes = computerBoard.querySelectorAll(".box");
          for (const box of boxes) {
            const row = Number(box.dataset.row);
            const col = Number(box.dataset.col);
            if (cBoard.board[row][col] !== null) {
              box.style.backgroundColor = "red";
            }
          }
          const shipWrapper = document.createElement("div");
          shipWrapper.classList.add("ship-placement");
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
          positionShipInWrapper(shipWrapper, placedImage, computerBoard, randomRow, randomCol, shipLength, cdirection);
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
