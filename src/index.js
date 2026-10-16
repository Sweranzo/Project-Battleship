import "./style.css";
import { display } from "./display.js";
import { play } from "./game.js";
import {
  playButton,
  welcomeContainer,
  mainContainer,
  shipsContainer,
  midHero,
  computerBoard,
  playerBoard,
  playerBoardSetup,
  boardContainer,
} from "./dom.js";

display.loadingScreen();

playButton.addEventListener("click", async () => {
  if (playButton.textContent === "Start The Game !") {
    welcomeContainer.style.display = "none";
    alert("game is starting");
    computerBoard.classList.add("display");
    mainContainer.style.display = "grid";
    playerBoard.append(playerBoardSetup);
    playerBoardSetup.classList.add("placed");
    display.resizePlayerShips();
    play.playGame();

    return;
  }
  display.gameStart();
  /*  midHero.classList.toggle("remove");
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      midHero.remove();
      resolve();
    }, 2000);
  });
  shipsContainer.style.display = "flex";
  welcomeContainer.style.display = "none";
  mainContainer.style.display = "grid";
  display.showBoard();
  display.displayShips();
  play.playGame(); */
});
