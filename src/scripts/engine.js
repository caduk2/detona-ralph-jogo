const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
    },
    values: {
        timerId: null,
        gameValocity: 500,
        hitPosition: 0,
        result: 0,
        curretTime: 10,
    },
    actions: {
        timerId: setInterval(randomSquare, 1000),
        countDownTimerId: setInterval(countDown, 1000),
    }
};

function playSound(sound, volume) {
    let audio = new Audio(`./src/sounds/${sound}.m4a`);
    audio.volume = volume || 0.2;
    audio.play();
}

function countDown () {
    state.values.curretTime--;
    state.view.timeLeft.textContent = state.values.curretTime;
    
    if ((state.values.curretTime < 1) && (state.values.result > 0)) {
        resetCountDown();
        playSound("wins", 0.5);
        
        setTimeout(() => {
            alert("Parabéns! Sua pontuação foi: " + state.values.result);
            reset();
        }, 100); // Atraso de 100ms para garantir que o som comece a tocar
    } else if (state.values.curretTime < 0) {
        resetCountDown();
        alert("Venha jogar !");        
        reset()          
    }  
}

function resetCountDown() {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
}

let previousSquareIndex = null;

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * 9);
    } while (randomNumber === previousSquareIndex);

    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;

    previousSquareIndex = randomNumber;
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if(square.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit", 0.2);
            } else {
                state.view.lives.textContent--;
                playSound("miss", 0.5);

                if (state.view.lives.textContent < 1) {
                    playSound("end", 0.5);
                    
                    setTimeout(() => {
                    resetCountDown();
                    alert("Game Over! O seu resultado foi: " + state.values.result);
                    reset()                      
                    }, 100); // Atraso de 100ms para garantir que o som comece a tocar
                }
            }            
        });
    });
}

function reset() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    state.actions.timerId = setInterval(randomSquare, 1000);
    state.actions.countDownTimerId = setInterval(countDown, 1000);

    state.values.lives = 3;
    state.values.result = 0;
    state.values.curretTime = 10;

    state.view.score.textContent = state.values.result;
    state.view.lives.textContent = state.values.lives;
    state.view.timeLeft.textContent = state.values.curretTime;
}

function init() {
    randomSquare();
    addListenerHitBox();

    state.view.score.textContent = state.values.result;
    state.view.timeLeft.textContent = state.values.curretTime;
}

init();