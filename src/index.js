import "./style.css";
import { display } from "./display.js";
import { play } from "./game.js";
import { playButton, welcomeContainer, mainContainer, shipsContainer, midHero } from "./dom.js";

display.loadingScreen();

playButton.addEventListener("click", async () => {
  if (playButton.textContent === "Start The Game !") {
    alert("game is starting");
    display.generateComputerShips();
    mainContainer.style.display = "grid";
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
