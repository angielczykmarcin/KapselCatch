import {spawnPlayButton, spawnGameTitle} from './SpawnHandler.js';

window.onload = () => {
    let bodyElement = document.querySelector("body");
    bodyElement.classList.add("stage-1-color");
    spawnGameTitle();
    spawnPlayButton();
  };
