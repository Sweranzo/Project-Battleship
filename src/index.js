import "./style.css";
import { display } from "./display.js";
import { playButton, welcomeContainer, mainContainer } from "./dom.js";

playButton.addEventListener("click", () => {
  welcomeContainer.style.display = "none";
  mainContainer.style.display = "grid";
  display.showBoard();
  display.displayShips();
});
