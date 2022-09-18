export { playSound, playBackgroundMusic, speedUpBackgroundMusic };

const audio = {
    music: new Audio("imgs/game/backgroundMusic.mp3"),
    kapselCapturedSound: new Audio("imgs/game/kapselBark.mp3"),
    youLostSound: new Audio("imgs/game/youLost.mp3"),
    bonusCircleSound: new Audio("imgs/game/meow.mp3"),
    bonusPointsSound: new Audio("imgs/game/bonuspoints.mp3"),
    impressiveSound: new Audio("imgs/game/impressive.mp3"),
    trapClickedSound: new Audio("imgs/game/trapclicked.mp3"),
    trapClicked2Sound: new Audio("imgs/game/trapclicked2.mp3"),
    trapClicked3Sound: new Audio("imgs/game/trapclicked3.mp3"),
    notImpressiveSound: new Audio("imgs/game/notimpressive.mp3"),
    powerUpMultiplier: new Audio("imgs/game/powerupmultiplier.mp3"),
    powerUpSlow: new Audio("imgs/game/powerupslow.mp3"),
    slowedDownBackground: new Audio("imgs/game/powerupslow.mp3")
};

function playSound(sound)
{
    audio[sound].currentTime = 0;
    audio[sound].play();
}

function playBackgroundMusic() {
    audio['music'].loop = true;
    audio['music'].play();
}

function speedUpBackgroundMusic(){
    audio['music'].playbackRate += 0.25;
}