'use strict';
const GAME_DURATION_SEC = 15;
let WHITE_CIRCLE_COUNT = 5;
let RED_CIRCLE_COUNT = 1;

const game_start_screen = document.querySelector('.start_screen')
const gameStartBtn = document.querySelector('.gamestartbtn')
const soundbtn = document.querySelector('.soundbtn');
const game_screen = document.querySelector('.game_screen')

const stopbtn = document.querySelector('.stopbtn');
const timeIndicator = document.querySelector('.game_timer');
const field = document.querySelector('.game_field');
const fieldRect = field.getBoundingClientRect();
const white_score = document.querySelector('.white_score');

const bgsound = new Audio('./sound/bg1.mp3');
const whitecirclesound = new Audio('./sound/circle1.wav');
const redcirclesound = new Audio('./sound/circle_red.wav');
const winsound = new Audio('./sound/win.mp3');

const hint = document.querySelector('.hint');
const hint_text = document.querySelector('.hint_text');
const popup = document.querySelector('.game_field_finish');
const finish_message = document.querySelector('.finish_message');
const restartBtn = document.querySelector('.restartbtn');

const circle = document.querySelectorAll('.circle');

let ACTIVE = 0;
let started = false;
let timer = undefined;
let sound = true;
let level = 1;
const soundArr = [bgsound, whitecirclesound, redcirclesound, winsound];



field.addEventListener('click', onFieldClick);

gameStartBtn.addEventListener('click',()=>{
    console.log(fieldRect);
    game_start_screen.classList.add('hide');
    game_screen.classList.add('show');
    startGame(); 
    
})

restartBtn.addEventListener('click',()=>{
    startGame();
    popup.classList.remove('show');
    stopbtn.classList.remove('active');
}
)

stopbtn.addEventListener('click',()=>{
    stopGame();
})

soundbtn.addEventListener('click',()=>{
    if(sound){
        soundArr.forEach(el => el.muted = true);
        sound = false;
        showsoundMute();
        
    }else{
        soundArr.forEach(el => el.muted = false);
        sound = true;
        showsoundOn();
    }
})

hint.addEventListener('click',()=>{
    moveDifferently();
    hint_text.classList.add('show');

    setTimeout(()=>{
        hint_text.classList.remove('show')
    },3000);
})

function moveDifferently(){
      const white = document.querySelectorAll('.circle');
      white.forEach((white)=>  white.animate([
        { transform: 'rotate(0deg)' }, 
        { transform: 'rotate(360deg)' }
      ], { 
        duration: 3000,
        iterations: Infinity
      }));

      const red = document.querySelector('.red');
      red.animate([
          { transform: 'rotate(0deg)' }, 
          { transform: 'rotate(-360deg)' }
        ], { 
          duration: 3000,
          iterations: Infinity
        });
  
     
}

function onFieldClick(event){
    const target = event.target;
    if(target.className === 'circle'){
        circleActive();
        ACTIVE++;
        playSound(whitecirclesound);
        updateScore();
        if(ACTIVE === WHITE_CIRCLE_COUNT){
            finishGame(true)
        }
    }else if(target.className === 'circle red'){
        circleActive();
        playSound(redcirclesound);
        finishGame(false)
        preventClick(event);
    }

}

function initGame(){
    ACTIVE = 0;
    field.innerHTML = '';
    addItem('circle', WHITE_CIRCLE_COUNT);
    addItem('circle red', RED_CIRCLE_COUNT);
}

function addItem(className, count){
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - 100;
    const y2 = fieldRect.height - 200;
    for(let i = 0; i < count; i++){
        (function(x){
            setTimeout(function(){
                const item = document.createElement('div');
                item.setAttribute('class', className);
                const x = randomNumber(x1, x2);
                const y = randomNumber(y1, y2);
                item.style.left = `${x}px`;
                item.style.top =`${y}px`;
                field.appendChild(item);
            }, 300*x)
            })(i);    
    }
}

function randomNumber(min, max){
    return Math.random() * (max - min) + min;

}

function startGame(){
    startGameTimer();
    initGame();
    playSound(bgsound);
    updateScore();
    
}

function stopGame(){
    showFinishText('Replay?', 'Replay');
    stopgametimer();
    stopSound(bgsound);
    stopbtnActive();
}

function finishGame(win){
    if(win){;
        playSound(winsound);
    }
    setTimeout(()=> {
        showFinishText(win ? 'You live this time!' : 'You Lost! Try again?', 'Try again' );
        
    }, 500)
    
    stopgametimer();
    
}

function showFinishText(text, button){
    popup.classList.add('show');
    finish_message.innerText = text;
    restartBtn.innerText = button;

}

function preventClick(e){
    if(e.target.className=="circle"){
        e.stopPropagation();
        e.preventDefault();
}}


function startGameTimer(){
    let remainingTimeSec = GAME_DURATION_SEC;
    updateTimerText(remainingTimeSec);
    timer = setInterval(()=> {
        if(remainingTimeSec <= 0){
            clearInterval(timer);
            finishGame(ACTIVE === WHITE_CIRCLE_COUNT);
            return;
        }
        updateTimerText(--remainingTimeSec)
    }, 1000);

}

function stopgametimer(){
    clearInterval(timer);
}


function stopbtnActive(){
    stopbtn.classList.add('active');
}


function updateScore(){
    const REMAINING_WHITE = WHITE_CIRCLE_COUNT - ACTIVE;
    white_score.textContent = `WHITE: ${REMAINING_WHITE} `;
}
function circleActive(){
    event.target.classList.add('active')

}

function updateTimerText(time){
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? `0${seconds}` : seconds
    timeIndicator.innerHTML = `${minutes}:${seconds}`;
}


function showsoundOn(){
    const icon = soundbtn.querySelector('.fas');
    icon.classList.add('fa-volume-up');
    icon.classList.remove('fa-volume-mute');
}

function showsoundMute(){
    const icon = soundbtn.querySelector('.fas');
    icon.classList.add('fa-volume-mute');
    icon.classList.remove('fa-volume-up');
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
  }

  function stopSound(sound){
    sound.pause();
  }