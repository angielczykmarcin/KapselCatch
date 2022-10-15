export { changeBackground, startGame, startLevel, handleCircleClick, handleBonusCircleClick, getRandomNumberRange, handleTrapClick, slowDownGame, inSlowEffect, handlePlay, moveGameTitle, changeTitleText };
import { increaseCircleCount, missed, circlesCaptured, increaseStreakSize, increaseScore, increaseMultiplier, decreaseScore, increaseScoreBonus, score, handleStreakBonus} from './ScoreHandler.js';
import { spawnCircle, spawnTrap, spawnBonusCircle, spawnClickResult, spawnReplayButton, despawnElementByClassName, removeElement, spawnScore, spawnMultiplier} from './SpawnHandler.js';
import { playSound, speedUpBackgroundMusic, pauseSound, playBackgroundMusic } from './AudioHandler.js';

let currentLevelSpeed = 750;
let levelRunning = false;
let gameLost = false;
let gameSlowed = false;
let interval;
let gameInterval;
let inSlowEffect = false;
let preSlowLevelSpeed;
let preSlowCirclesCaptured;
let alive = true;

function handlePlay()
{
    let gameContainer = document.querySelector(".game-container");
    let centeredText = document.createElement("div");
    centeredText.classList.add("centered-text");
    centeredText.classList.add("text-focus-in");
    gameContainer.append(centeredText);
    
    moveGameTitle();
    despawnElementByClassName([".play-btn"]);
    changeTitleText(centeredText, 'Ready?',1000, gameContainer)
     changeTitleText(centeredText, 'Go!',3000, gameContainer)
     removeElement(centeredText,5000);
     spawnScore(6000);
     spawnMultiplier(6000);
     setTimeout(() =>{
        startGame(750, 25);
     },6500)
     
     setTimeout(() => {
        playBackgroundMusic();
     },500);
     handleStreakBonus();
     changeBackground();
}

function moveGameTitle()
{
    let gameContainer = document.querySelector(".game-container");
    let gameTitleElement = document.querySelector(".game-title");
    gameTitleElement.remove()
    let newGameTitleElement = document.createElement("div");
    newGameTitleElement.innerHTML = "Kapsel Catch";
    newGameTitleElement.classList.add("game-title");
    newGameTitleElement.classList.add("move-to-top");
    gameContainer.append(newGameTitleElement);
}

function changeTitleText(element, newTitle, delay, parent)
{
    setTimeout(() =>{
        element.remove();
        parent.append(element);
        element.innerHTML = newTitle;
    }, delay)
}

function changeBackground()
{
    setInterval(() => {
        let bodyElement = document.querySelector("body");
        if(currentLevelSpeed == 650)
        {
            bodyElement.classList.remove("stage-1-color");
            bodyElement.classList.add("stage-2-color");
        }
        if(currentLevelSpeed == 550)
        {
            bodyElement.classList.remove("stage-2-color");
            bodyElement.classList.add("stage-3-color");
        }
        if(currentLevelSpeed == 450)
        {
            bodyElement.classList.remove("stage-3-color");
            bodyElement.classList.add("stage-4-color");
        }
        if(currentLevelSpeed == 350)
        {
            bodyElement.classList.remove("stage-4-color");
            bodyElement.classList.add("stage-5-color");
        }
        if(currentLevelSpeed == 250)
        {
            bodyElement.classList.remove("stage-5-color");
            bodyElement.classList.add("stage-6-color");
        }
    },100)
}

function startGame(levelSpeed, scoreBreakpoint)
{
        currentLevelSpeed = levelSpeed;
        gameInterval = setInterval( () =>{
        if(!levelRunning)
        {
            levelRunning = true;
            startLevel(levelSpeed);
        }
        else
        {
            if(Math.random() > 0.96 && !gameLost)
            {
                spawnTrap();
            }
            if(Math.random() > 0.96 && !gameLost)
            {
                spawnBonusCircle();
            }
            if(gameSlowed)
            {
                let bodyElement = document.querySelector("body");
                preSlowLevelSpeed = levelSpeed;
                preSlowCirclesCaptured = circlesCaptured;
                clearInterval(interval);
                clearInterval(gameInterval);
                levelRunning = false;
                startGame(750, circlesCaptured + 25);
                gameSlowed = false;

                setTimeout(() => {
                    bodyElement.classList.remove("color-change-2x")
                    clearInterval(interval);
                    clearInterval(gameInterval);
                    levelRunning = false;
                    startGame(preSlowLevelSpeed, preSlowCirclesCaptured + 25);
                    
                }, 10000);

            }
            if(circlesCaptured > scoreBreakpoint)
            {
                clearInterval(interval);
                clearInterval(gameInterval);
                speedUpBackgroundMusic();
                levelRunning = false;
                startGame(levelSpeed - 100 >= 250 ? levelSpeed - 100 : 250, circlesCaptured + 25);
            }
        }  
        },500)
}

function startLevel(delay)
{
    interval = setInterval(() => {
        increaseCircleCount();
        if(missed < 5)
        {
            spawnCircle();
        }
        else
        {
            youLost(interval);
            alive = false;
        }
    },delay)
}

function handleCircleClick(element)
{
    increaseStreakSize();
    element.classList.remove("roll-in-left");
    element.classList.remove("roll-in-right");
    element.classList.add("slide-out-tl");
    setTimeout(() =>{
        element.remove();
    },500);
    

    increaseScore(element);
    playSound('kapselCapturedSound');
}

function handleBonusCircleClick(element, bonusNo, bonusType)
{
    spawnClickResult(element,bonusType);
    element.remove();
    if(bonusNo === 1)
    {
        increaseScoreBonus();
        increaseMultiplier();
    }
    if(bonusNo === 2)
    {
        increaseScoreBonus();
        slowDownGame();
        let bodyElement = document.querySelector("body");
        bodyElement.classList.add("color-change-2x")
    }
}

function handleTrapClick(element)
{
    element.classList.remove("roll-in-left");
    element.classList.remove("roll-in-right");
    element.classList.add("rotate-out-center");
    spawnClickResult(element,'trap', 10);
    setTimeout(() =>{
        element.remove();
    },500);
    
    decreaseScore(10);
    let rand = Math.random();
    if(rand < 0.33)
    {
        playSound('trapClickedSound');
    }
    else if (rand > 0.32 && rand < 0.66)
    {
        playSound('trapClicked2Sound');
    }
    else
    {
        playSound('trapClicked3Sound');
    }
    
    
}

function slowDownGame()
{
    inSlowEffect = true
    pauseSound('music');
    gameSlowed = true;
    playSound('slowedDownBackground');
    setTimeout(() => {
        gameSlowed = false;
        inSlowEffect = false;
        playSound('music');
        pauseSound('slowedDownBackground');
    }, 10000);
}

function getRandomNumberRange(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function youLost(interval)
{
    gameLost = true;
    let mainContainer = document.querySelector(".game-container");
    let circles = document.querySelectorAll(".circle");
    circles.forEach((element) => {
        element.remove();
    })

    let youLostElement = document.createElement("div");
    youLostElement.classList.add("you-lost");
    youLostElement.innerHTML = 'Kapsel escaped!!';
    mainContainer.append(youLostElement);
    clearInterval(interval);
    playSound('youLostSound');
    if(score > 50)
    {
        playSound('impressiveSound');
    }
    else
    {
        playSound('notImpressiveSound');
    }

    setTimeout(() => {
        spawnReplayButton();
    },2000);
}
