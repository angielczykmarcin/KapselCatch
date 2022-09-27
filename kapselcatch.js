import { playSound, playBackgroundMusic, speedUpBackgroundMusic, pauseSound } from '/AudioHandler.js';
import { decreaseScore, score, circlesCaptured, multiplier, increaseScore, increaseScoreBonus, circleCount, increaseCircleCount, increaseMissed, streakSize, missed } from '/ScoreHandler.js';
import { spawnClickResult } from '/SpawnHandler.js';

let inSlowEffect = false;
let preSlowLevelSpeed;
let preSlowCirclesCaptured;
//let multiplier = 1;
let gameLost = false;
let levelRunning = false;
//let score = 0;
let alive = true;
//let circleCount = 0;
//let circlesCaptured = 0;
let interval;
let gameInterval;
//let missed = 0;
let gameSlowed = false;
//let streakSize = 0;
let currentLevelSpeed = 750;

window.onload = (event) => {
    let bodyElement = document.querySelector("body");
    bodyElement.classList.add("stage-1-color");
    spawnGameTitle();
    spawnPlayButton();
  };

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

function despawnElementByClassName(elementClasses)
{
    elementClasses.forEach((elementClass) =>{
        let foundElement = document.querySelector(elementClass);
        foundElement.remove();
    })
}

function handleStreakBonus()
{
    setInterval(() => {
        if(streakSize > 30)
        {
            streakSize = 0;
            increaseMultiplier();
        }
    }, 250);
}

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


function changeTitleText(element, newTitle, delay, parent)
{
    setTimeout(() =>{
        element.remove();
        parent.append(element);
        element.innerHTML = newTitle;
    }, delay)
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

function handleTrapClick(element)
{
    element.classList.remove("roll-in-left");
    element.classList.remove("roll-in-right");
    element.classList.add("rotate-out-center");
    spawnClickResult(element,'trap', 5);
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

function getRandomNumberRange(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function handleCircleClick(element)
{
    streakSize += 1;
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

function increaseMultiplier()
{
    multiplier += 1;
    let gameContainer = document.querySelector(".header-container");
    let multiplierElement = document.querySelector(".multiplier");
    multiplierElement.remove();
    let newMultiplierElement = document.createElement("div");
    newMultiplierElement.innerHTML = 'X' + multiplier;
    if(multiplier > 1)
    {
        newMultiplierElement.style.color = "green";   
    }
    if(multiplier > 2)
    {
        newMultiplierElement.style.color = "blue";   
    }
    if(multiplier > 3)
    {
        newMultiplierElement.style.color = "red";   
    }
    newMultiplierElement.classList.add("multiplier");
    newMultiplierElement.classList.add("flip-scale-up-hor");
    gameContainer.append(newMultiplierElement);
    setTimeout(() => {
        multiplier--;
        let headerContainer = document.querySelector(".header-container");
        let multiplierElement = document.querySelector(".multiplier");
        multiplierElement.remove();
        let newMultiplierElement = document.createElement("div");
        newMultiplierElement.innerHTML = 'X' + multiplier;
        if(multiplier > 1)
        {
            newMultiplierElement.style.color = "green";   
        }
        if(multiplier > 2)
        {
            newMultiplierElement.style.color = "blue";   
        }
        if(multiplier > 3)
        {
            newMultiplierElement.style.color = "red";   
        }
        newMultiplierElement.classList.add("flip-scale-up-hor");
        newMultiplierElement.classList.add("multiplier");
        headerContainer.append(newMultiplierElement);
    }, 10000);
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

function spawnReplayButton()
{
    let headerElement = document.querySelector(".header-container");
    let replayButton = document.createElement("div");
    replayButton.classList.add("replay-btn");
    replayButton.innerHTML = "Play Again!";
    replayButton.setAttribute("onclick","location.reload()");
    headerElement.append(replayButton);
}