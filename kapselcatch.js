import { playSound, playBackgroundMusic, speedUpBackgroundMusic } from '/AudioHandler.js';

let inSlowEffect = false;
let preSlowLevelSpeed;
let preSlowCirclesCaptured;
let multiplier = 1;
let alive = true;
let gameLost = false;
let levelRunning = false;
let score = 0;
let circlesCaptured = 0;
let circleCount = 0;
let interval;
let gameInterval;
let missed = 0;
let gameSlowed = false;
let streakSize = 0;
let currentLevelSpeed = 750;
let music = new Audio("imgs/game/backgroundMusic.mp3");
let kapselCapturedSound = new Audio("imgs/game/kapselBark.mp3");
let youLostSound = new Audio("imgs/game/youLost.mp3");
let bonusCircleSound = new Audio("imgs/game/meow.mp3");
let bonusPointsSound =  new Audio("imgs/game/bonuspoints.mp3");
let impressiveSound =  new Audio("imgs/game/impressive.mp3");
let trapClickedSound = new Audio("imgs/game/trapclicked.mp3");
let trapClicked2Sound = new Audio("imgs/game/trapclicked2.mp3");
let trapClicked3Sound = new Audio("imgs/game/trapclicked3.mp3");
let notImpressiveSound = new Audio("imgs/game/notimpressive.mp3");
let powerUpMultiplier = new Audio("imgs/game/powerupmultiplier.mp3");
let powerUpSlow = new Audio("imgs/game/powerupslow.mp3");
let slowedDownBackground = new Audio("imgs/game/powerupslow.mp3");

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
        console.log(foundElement);
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
        circleCount++;
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

function spawnExplosion(clickedElement)
{
    let gameContainer = document.querySelector(".game-container");
    let explosionElements = [];
    for(let i = 0; i <200; i ++)
    {
        let explosionElement = document.createElement("div");
        let leftOffset = Math.random() * 105;
        let topOffset = Math.random() * 105;
        explosionElement.classList.add("explosion-element");
        if(i < 25)
        {
            explosionElement.style.left = `${clickedElement.offsetLeft + leftOffset}px`;
            explosionElement.style.top = `${clickedElement.offsetTop + topOffset}px`;
            explosionElement.classList.add("explosion-element-dr")
        }
        if(i > 24 && i < 50)
        {
            explosionElement.style.left = `${clickedElement.offsetLeft + leftOffset}px`;
            explosionElement.style.top = `${clickedElement.offsetTop - topOffset}px`;
            explosionElement.classList.add("explosion-element-ur")
        }
        if(i > 49 && i < 75)
        {
            explosionElement.style.left = `${clickedElement.offsetLeft - leftOffset}px`;
            explosionElement.style.top = `${clickedElement.offsetTop + topOffset}px`;
            explosionElement.classList.add("explosion-element-dl")
        }
        if(i > 74 && i < 100)
        {
            explosionElement.style.left = `${clickedElement.offsetLeft - leftOffset}px`;
            explosionElement.style.top = `${clickedElement.offsetTop - topOffset}px`;
            explosionElement.classList.add("explosion-element-ul")
        }
        if(i > 99 && i < 125)
        {
            if(i > 112)
            {
                explosionElement.style.left = `${clickedElement.offsetLeft + leftOffset}px`;
            }
            else
            {
                explosionElement.style.left = `${clickedElement.offsetLeft - leftOffset}px`;
            }
            explosionElement.style.top = `${clickedElement.offsetTop + topOffset}px`;
            explosionElement.classList.add("explosion-element-u")
        }
        if(i > 124 && i < 150)
        {
            if(i > 135)
            {
                explosionElement.style.left = `${clickedElement.offsetLeft + leftOffset}px`;
            }
            else
            {
                explosionElement.style.left = `${clickedElement.offsetLeft - leftOffset}px`;
            }
            explosionElement.style.top = `${clickedElement.offsetTop - topOffset}px`;
            explosionElement.classList.add("explosion-element-d")
        }
        if(i > 149 && i < 175)
        {
            explosionElement.style.left = `${clickedElement.offsetLeft - leftOffset}px`;
            explosionElement.style.top = `${clickedElement.offsetTop + topOffset}px`;
            explosionElement.classList.add("explosion-element-r")
        }
        if(i > 174)
        {
            explosionElement.style.left = `${clickedElement.offsetLeft - leftOffset}px`;
            explosionElement.style.top = `${clickedElement.offsetTop - topOffset}px`;
            explosionElement.classList.add("explosion-element-l")
        }
        gameContainer.append(explosionElement);
        setTimeout(() => {
            explosionElement.remove();
        }, 200 + Math.random() * 50);
    }

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

function decreaseScore(amount)
{
    score -= amount;
    let scoreCounter = document.querySelector(".score");
    scoreCounter.innerHTML = 'Score: ' + parseInt(score);
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

function increaseMissed()
{
    streakSize = 0;
    missed++;
    let missedCounter = document.querySelector(".missed");
    missedCounter.innerHTML = "Missed: " + missed;
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
    //spawnExplosion(element);
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
    music.pause();
    gameSlowed = true;
    playSound('slowedDownBackground');
    setTimeout(() => {
        gameSlowed = false;
        inSlowEffect = false;
        music.play();
        slowedDownBackground.pause();
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

function increaseScore(element)
{
    circlesCaptured++;
    let scoreChange = 1 * multiplier;
    score = score + scoreChange;
    let scoreCounter = document.querySelector(".score");
    scoreCounter.innerHTML = 'Score: ' + parseInt(score);
    circleCount--;
    spawnClickResult(element,'circle',scoreChange);
}

function increaseScoreBonus()
{
    score = score + (5 * multiplier);
    let scoreCounter = document.querySelector(".score");
    scoreCounter.innerHTML = 'Score: ' + parseInt(score);
    circleCount--;
    playSound('bonusPointsSound');
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
        showHighScores();
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

function showHighScores()
{
    let youLostElement = document.querySelector(".you-lost");
    youLostElement.remove();
   let result = fetchScores();
   let resultsMap = parseScores(result);
   let mainContainer = document.querySelector(".game-container");
   let highScoresElement = document.createElement("div");
   highScoresElement.classList.add("high-scores");
   //highScoresElement.innerHTML = htmlifyScores(result);
   mainContainer.append(highScoresElement);
   
   let header = document.createElement("div");
   header.classList.add("scores-text");
   header.classList.add("header-element");
   header.innerHTML = 'HIGHSCORES:';
   highScoresElement.append(header);

   let scoresElement = document.createElement("div");
   scoresElement.classList.add("scores-text");
   scoresElement.classList.add("scores-element");
   scoresElement.innerHTML = htmlifyScores(result);
   highScoresElement.append(scoresElement);

   let nameInput = document.createElement("input");
   nameInput.classList.add("name-input");
   nameInput.setAttribute("maxlength","3")
   nameInput.setAttribute("minlength", "3");
   highScoresElement.append(nameInput);

   let nameSubmitButton = document.createElement("div");
   nameSubmitButton.classList.add("name-submit-button");
   nameSubmitButton.innerHTML = 'Submit';
   nameSubmitButton.setAttribute("onclick","handleButtonClick()");
   highScoresElement.append(nameSubmitButton);
}

function handleButtonClick()
{

    let button = document.querySelector(".name-submit-button");
    let input = document.querySelector(".name-input");
    if(input.value.length === 3)
    {
        let result = postScore(input);
        button.remove();
        input.remove();
        updateScores(result);
    }
    
}

function updateScores(result)
{
    let scoresElement = document.querySelector(".scores-element");
    scoresElement.innerHTML = result;
}

function postScore(input)
{
    let scoreObj = {};
    scoreObj.data = {};
    scoreObj.data.name = input.value;
    scoreObj.data.score = score;
    let result = null;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", 'https://kajtekimona.pl/scores/', false);
    xmlhttp.setRequestHeader('Content-type', 'application/json');
    xmlhttp.send(JSON.stringify(scoreObj));
    if (xmlhttp.status==200) {
      result = xmlhttp.responseText;
    }
    return result;
}

function htmlifyScores(scores)
{
    let resultArr = scores.split(",");
    let resultHtml = "";
    resultArr.forEach((element) =>{
        resultHtml += element + "<br>";
    })
    return resultHtml;
}

function parseScores(scoresFileOutput)
{
    let arraysMap = new Map();
    let scoresArray = scoresFileOutput.split(",");
    scoresArray.forEach(element => {
        let splitElement = element.split("-");
        if(arraysMap.has(splitElement[0]))
        {
            if(arraysMap.get(splitElement[0]) < splitElement[1])
            {
                arraysMap.set(splitElement[0], splitElement[1])
            }
        }
        else
        {
            arraysMap.set(splitElement[0], splitElement[1]);
        }
    })
    return arraysMap;
}

function fetchScores()
{
    let result = null;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", '/scores', false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
      result = xmlhttp.responseText;
    }
    return result;
}


