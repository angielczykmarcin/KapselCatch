export { decreaseScore, increaseScore, increaseScoreBonus, circleCount, score, circlesCaptured, multiplier, increaseCircleCount, increaseMissed, streakSize, missed };
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