import "./style.css";
import { display } from "./display.js";
import { play } from "./game.js";
import { playButton, welcomeContainer, mainContainer, shipsContainer } from "./dom.js";

display.render();

playButton.addEventListener("click", () => {
  console.log("play now clicked!");
  shipsContainer.style.display = "flex";
  welcomeContainer.style.display = "none";
  mainContainer.style.display = "grid";
  display.showBoard();
  display.displayShips();
  play.playGame();
});
