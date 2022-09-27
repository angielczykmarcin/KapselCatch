export { decreaseScore, increaseScore, increaseScoreBonus, circleCount, score, circlesCaptured, multiplier, increaseCircleCount, increaseMissed, streakSize, missed, increaseStreakSize, increaseMultiplier, handleStreakBonus };
import { playSound } from '/AudioHandler.js';
import { spawnClickResult } from '/SpawnHandler.js';

let score = 0;
let circlesCaptured = 0;
let multiplier = 1;
let circleCount = 0;
let streakSize = 0;
let missed = 0;

function decreaseScore(amount)
{
    score -= amount;
    let scoreCounter = document.querySelector(".score");
    scoreCounter.innerHTML = 'Score: ' + parseInt(score);
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

function increaseCircleCount(){
    circleCount++;
}

function increaseMissed()
{
    streakSize = 0;
    missed++;
    let missedCounter = document.querySelector(".missed");
    missedCounter.innerHTML = "Missed: " + missed;
}

function increaseStreakSize(){
    streakSize += 1;
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