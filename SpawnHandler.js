export { spawnClickResult, spawnCircle, despawnCircle, spawnTrap, spawnBonusCircle, spawnReplayButton, spawnPlayButton, spawnGameTitle, despawnElementByClassName, removeElement, spawnMultiplier, spawnScore};
import { handleCircleClick, getRandomNumberRange, handleTrapClick, inSlowEffect, handleBonusCircleClick, handlePlay, moveGameTitle, changeTitleText } from './GameFlowHandler.js';
import { increaseMissed } from './ScoreHandler.js';
import { playSound } from './AudioHandler.js';

function spawnGameTitle()
{
    let gameContainer = document.querySelector(".game-container");
    let gameTitleElement = document.createElement("div");
    gameTitleElement.innerHTML = "Kapsel Catch";
    gameTitleElement.classList.add("game-title");
    gameTitleElement.classList.add("text-pop-up-top");
    gameContainer.append(gameTitleElement);
}

function spawnPlayButton()
{
    let gameContainer = document.querySelector(".game-container");
    let playButtonElement = document.createElement("div");
    playButtonElement.classList.add("play-btn");
    playButtonElement.onclick = handlePlay;
    playButtonElement.innerHTML = 'Start!';
    gameContainer.append(playButtonElement);
}

function despawnElementByClassName(elementClasses)
{
    elementClasses.forEach((elementClass) =>{
        let foundElement = document.querySelector(elementClass);
        foundElement.remove();
    })
}

function removeElement(element, delay)
{
    setTimeout(() =>{
        element.remove();
    },delay)
}

function spawnMultiplier(timeout)
{
    setTimeout(() =>{
        let headerElement = document.querySelector(".header-container");
        let multiplierElement = document.createElement("div");
        multiplierElement.classList.add("multiplier");
        multiplierElement.classList.add("flip-scale-up-hor");
        multiplierElement.innerHTML = 'X1';
        headerElement.append(multiplierElement);
    },timeout )
}

function spawnScore(timeout)
{
    setTimeout(() =>{
        let contentRowElement = document.querySelector(".header-container");
        let scoreElement = document.createElement("div");
        scoreElement.classList.add("score");
        scoreElement.classList.add("text-shadow-pop-bottom");
        scoreElement.innerHTML = 'Score: 0';
        contentRowElement.prepend(scoreElement);

        let missedElement = document.createElement("div");
        missedElement.classList.add("missed");
        missedElement.classList.add("text-shadow-pop-bottom");
        missedElement.innerHTML = 'Missed: 0';
        contentRowElement.prepend(missedElement);
    },timeout )
}

function spawnClickResult(clickedElement, type, scoreChange)
{
    let gameContainer = document.querySelector(".game-container");
    let inidcatorElement = document.createElement("div");
    inidcatorElement.style.left = clickedElement.offsetLeft + 'px';
    inidcatorElement.style.top = clickedElement.offsetTop + 'px';
    inidcatorElement.classList.add("slide-out-top");
    if(type === 'circle')
    {   
        inidcatorElement.innerHTML = '+' + scoreChange;
        inidcatorElement.classList.add("score-indicator-increase");
    }
    if(type === 'bonusCircle1')
    {
        inidcatorElement.innerHTML = 'Multiplier +1!'
        inidcatorElement.classList.add("bonus-1-indicator");
    }
    if(type === 'bonusCircle2')
    {
        inidcatorElement.innerHTML = 'Slow Effect!'
        inidcatorElement.classList.add("bonus-2-indicator");
    }
    if(type === 'trap')
    {
        inidcatorElement.innerHTML = '-' + scoreChange;
        inidcatorElement.classList.add("score-indicator-decrease");
    }
    gameContainer.append(inidcatorElement);
    setTimeout(() => {
        inidcatorElement.remove();
    }, 1000);
}

function spawnCircle()
{
    let mainContainer = document.querySelector(".game-container");
    let divEleement = document.createElement("img");
    
    divEleement.setAttribute("draggable", "false");
    divEleement.src = `imgs/game/kapselCircle.jpg`;
    divEleement.classList.add("circle");
    divEleement.style.left = `${(Math.random() * (mainContainer.offsetWidth)) + ((window.innerWidth - mainContainer.offsetWidth) / 6)}px`;
    divEleement.style.top = `${(Math.random() * (mainContainer.offsetHeight)) + ((window.innerHeight - mainContainer.offsetHeight) / 6)}px`;
    divEleement.onclick = () => handleCircleClick(divEleement);
    mainContainer.append(divEleement);
    if(Math.random() > 0.5)
    {
        divEleement.classList.add("roll-in-left");
    }
    else
    {
        divEleement.classList.add("roll-in-right");
    }
    
    setTimeout(() => {
        despawnCircle(divEleement, 'normal');
    },4000)
}

function despawnCircle(element, circleType)
{
    if(document.body.contains(element))
    {
        element.remove();
        if(circleType == 'normal')
        {
            increaseMissed();
        }
    }
}

function spawnTrap()
{
    let gameContainer = document.querySelector(".game-container");
    let trapElement = document.createElement("img");
    trapElement.setAttribute("draggable", "false");
    trapElement.src = `imgs/game/kostka.jpg`;
    trapElement.classList.add("circle");
    trapElement.style.left = `${(Math.random() * (gameContainer.offsetWidth)) + ((window.innerWidth - gameContainer.offsetWidth) / 6)}px`;
    trapElement.style.top = `${(Math.random() * (gameContainer.offsetHeight)) + ((window.innerHeight - gameContainer.offsetHeight) / 6)}px`;
    trapElement.onclick = () => handleTrapClick(trapElement);
    gameContainer.append(trapElement);
    if(Math.random() > 0.5)
    {
        trapElement.classList.add("roll-in-left");
    }
    else
    {
        trapElement.classList.add("roll-in-right");
    }
    setTimeout(() => {
        trapElement.remove();
    },4000)
}

function spawnBonusCircle()
{

    let bonusNo = getRandomNumberRange(1,2);
    let bonusType;
    if(inSlowEffect)
    {
        bonusType = 'bonusCircle1';
        bonusNo = 1;
    }
    else
    {
        bonusType = bonusNo === 1 ? 'bonusCircle1' : 'bonusCircle2';
    }
    
    let mainContainer = document.querySelector(".game-container");
    let divEleement = document.createElement("img");
    divEleement.setAttribute("draggable", "false");
    divEleement.classList.add("bonus-circle");
    divEleement.classList.add("vibrate-1");
    divEleement.src = `imgs/game/bonus${bonusNo}.jpg`;
    divEleement.style.top = `${Math.random() * (window.innerHeight - 500)}px`;
    divEleement.style.left = `${Math.random() * (window.innerWidth - 500)}px`;
    divEleement.onclick = () => handleBonusCircleClick(divEleement, bonusNo, bonusType);
    mainContainer.append(divEleement);
    playSound('bonusCircleSound');
    setTimeout(() => {
        despawnCircle(divEleement, 'bonus');
    },2000)
}

function spawnReplayButton()
{
    let headerElement = document.querySelector(".header-container");
    let replayButton = document.createElement("div");
    replayButton.classList.add("replay-btn");
    replayButton.innerHTML = "Play Again!";
    replayButton.setAttribute("onclick","location.reload()");
    headerElement.append(replayButton);
}
