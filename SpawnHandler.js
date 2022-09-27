export { spawnClickResult };

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