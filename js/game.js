import { Player } from './player.js';
import { Food } from './food.js';
import { Wall } from './wall.js';
import { Ghost } from './ghost.js';
import { map } from './map.js';

let gameState = "start";

const canvas = document.getElementById("my_canvas");
const ctx = canvas.getContext('2d');

const backgroundImage = new Image();
backgroundImage.src = 'assets/images/mapcopia.png'; 

const tileSize = 32; 

const eatFood = new Audio('assets/sounds/eat_food.mp3');
const eatPill = new Audio('assets/sounds/eat_pill.mp3');
const pedoAguado = new Audio('assets/sounds/pedo_aguado.mp3');
const perdiste = new Audio('assets/sounds/perdiste.mp3');
const gratula = new Audio('assets/sounds/gratula.mp3');
const elevador = new Audio('assets/sounds/elevador.mp3');
const creepySound = new Audio('assets/sounds/creepy_sound.mp3');
const respawn = new Audio('assets/sounds/respawn.mp3');

const seleneDelgado = new Audio('assets/sounds/selene_delgado.mp3');
const obunga = new Audio('assets/sounds/obunga.mp3');
const aheno = new Audio('assets/sounds/aheno.mp3');
const firebrand = new Audio('assets/sounds/firebrand.mp3');

const ghostSounds = {
    "Selene Delgado": seleneDelgado,
    "Obunga": obunga,
    "Aheno": aheno,
    "Firebrand": firebrand
};

let illuminationRadius=100; 

let direction = "";
let score = 0;
let speed = 1;
let pause = false;

let countdown = 0;
let restarting = false;

let startTime = 0; 
let elapsedTime = 0; 

let player = new Player(32, 64, 32, 32, 'assets/images/puckman.png');

let walls = [];
let foods = [];

let ghosts = [
    new Ghost(650, 382 , 64, 64, 'assets/images/selene_delgado.png', "Selene Delgado"),
    new Ghost(140, 610, 64, 64, 'assets/images/obunga.png', "Obunga"),
    new Ghost(1000, 610, 32, 32, 'assets/images/aheno.png', "Aheno"),
    new Ghost(1000, 64, 32, 32, 'assets/images/firebrand.png', "Firebrand")
];

document.addEventListener('keydown', function(e) {
    switch(e.keyCode) {
        case 37: // LEFT
            direction = "left";
            break;
        case 38: // UP
            direction = "up";
            break;
        case 39: // RIGHT
            direction = "right";
            break;
        case 40: // DOWN
            direction = "down";
            break;
        case 32: // SPACE
            pause = !pause;
            break;
    }
});


document.addEventListener('keydown', function(e) {
    if (gameState === "start" && e.keyCode === 13) { //ENTER
        gameState = "playing";
        startNewGame();  
    } else if (gameState === "gameOver" && e.keyCode === 82) { //R
        gameState = "playing";
        player.lives = 3;
        location.reload(); 
        //resetGame();
    }  else if (gameState === "win" && e.keyCode === 82) { //R
        gameState = "start";
        location.reload(); 
    }
});


function startNewGame() {
    startTime = Date.now(); 
    elapsedTime = 0;

    gameState = "playing";
    score = 0;
    speed = 1;
    illuminationRadius = 100; 
    foods = [];
    create(); 

    player.resetPosition();
    ghosts.forEach(ghost => {
        ghost.resetPosition();
        ghost.speed = 2; 
    });
}

function updateTimer() {
    if (gameState === "playing") {
        elapsedTime = Date.now() - startTime;
    }
}

function drawTimer() {
    const totalSeconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("TIME: " + timeString, 590, 30);
}

function create() {
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            const tile = map[row][col];
            const x = col * tileSize;
            const y = row * tileSize;
            
            if (tile === 1) {
                walls.push(new Wall(x, y, tileSize, tileSize, 'pink'));
            } else if (tile === 2) {
                foods.push(new Food(x, y, tileSize, tileSize, 'assets/images/comida.png'));
            } else if (tile === 3) {
                foods.push(new Food(x, y, tileSize, tileSize, 'assets/images/pastilla.png', true, 'extraLight'));
            } else if (tile === 4) {
                foods.push(new Food(x, y, tileSize, tileSize, 'assets/images/pastilla.png', true, 'extraLife'));
            } else if (tile === 5) {
                foods.push(new Food(x, y, tileSize, tileSize, 'assets/images/pastilla.png', true, 'slowGhosts'));
            } else if (tile === 6) {
                foods.push(new Food(x, y, tileSize, tileSize, 'assets/images/pastilla.png', true, 'superLight'));
            }

        }
    }
}

create();

function update() {
    if (!pause) {
        player.move(direction, speed, canvas);

        walls.forEach(wall => {
            if (player.colision(wall)) {
                switch(direction) {
                    case "left":
                        player.x += speed;
                        break;
                    case "up":
                        player.y += speed;
                        break;
                    case "right":
                        player.x -= speed;
                        break;
                    case "down":
                        player.y -= speed;
                        break;
                }
            }
        });

        foods.forEach((food, index) => {
            let totalFoods = foods.length; 

            if (player.colision(food)) {

                eatFood.play();
                eatFood.volume = 0.7;

                score++;
                totalFoods--; 

                foods.splice(index, 1); 

                if (food.isPill) {

                    eatPill.play();
                    eatPill.volume = 0.7;
                    switch (food.effectType) {
                        case 'extraLight':
                            illuminationRadius = 160;
                            break;
                        case 'extraLife':
                            player.lives++;
                            break;
                        case 'slowGhosts':
                            ghosts.forEach(ghost => ghost.speed = 1);
                            break;
                        case 'superLight':
                            illuminationRadius = 320;
                            break;
                    }
                }

                if (totalFoods === 0) {
                    console.log("ganastes compadre");
                    gameState = "win";
                    
                }
            }
        });

        ghosts.forEach(ghost => {
            ghost.move(walls);

            if (player.colision(ghost)) {
                
                const sound = ghostSounds[ghost.name];
                if (sound) {
                    if (sound.paused || sound.ended) {
                        sound.play();
                        sound.volume = 0.6;
                    }
                }

                player.loseLife();
                console.log(`Vidas restantes: ${player.lives}`);

                if (player.lives > 0) {
                    respawn.play();
                    respawn.volume = 0.5;
                    resetGame();
                } else {
                    gameState = "gameOver";
                    pedoAguado.play();
                    pedoAguado.volume = 0.7;
                }
            }
        });

        updateTimer();
    }
}

function drawLight() {
    ctx.globalCompositeOperation = 'destination-over';//iluminación debajo
    
    //fondo oscuro
    ctx.fillStyle = 'rgba(0, 0, 0, .7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.globalCompositeOperation = 'destination-in'; //luz alrededor del jugador
    
    //config del gradiente !!!asi esta bien!!!
    const gradient = ctx.createRadialGradient(
        player.x + player.w / 2, 
        player.y + player.h / 2, 
        0,                       
        player.x + player.w / 2, 
        player.y + player.h / 2, 
        illuminationRadius    
    );
    
    //colores gradiente 
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); 
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); 

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(player.x + player.w / 2, player.y + player.h / 2, illuminationRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.globalCompositeOperation = 'source-over'; 
}

function drawStartScreen() {
    
    creepySound.pause();

    elevador.play();
    elevador.volume = 0.4;

    // Limpiar el lienzo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PACMAN'S NEXTBOTS", canvas.width / 2, canvas.height / 2 - 80);

    ctx.font = "30px Arial";
    ctx.fillText("Presiona ENTER para empezar", canvas.width / 2, canvas.height / 2);

    ctx.font = "20px Arial";
    ctx.fillText("Controles:", canvas.width / 2, canvas.height / 2 + 40);
    
    ctx.font = "18px Arial";
    ctx.fillText("AWSD - Movimiento", canvas.width / 2, canvas.height / 2 + 70);
    ctx.fillText("SPACE - Pausa", canvas.width / 2, canvas.height / 2 + 100);

    ctx.font = "16px Arial";
    ctx.fillText("¡Come toda la comida para ganar! Solo tienes 3 vidas...", canvas.width / 2, canvas.height / 2 + 140);
}

function drawGameOverScreen() {

    creepySound.pause();

    perdiste.play();
    perdiste.volume = 0.5;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2 - 50);
    ctx.font = "20px Arial";
    ctx.fillText("Presiona R para reanudar", 590, canvas.height / 2);
    score = 0;
    foods = [];

    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            const tile = map[row][col];
            const x = col * tileSize;
            const y = row * tileSize;
            
            if (tile === 1) {
                walls.push(new Wall(x, y, tileSize, tileSize, 'pink'));
            } else if (tile === 2) {
                foods.push(new Food(x, y, tileSize, tileSize, 'assets/images/comida.png'));
            } else if (tile === 3) {
                foods.push(new Food(x, y, tileSize, tileSize, 'assets/images/pastilla.png', true));
            } else if (tile === 4) {
                foods.push(new Food(x, y, tileSize, tileSize, 'assets/images/pastilla.png', true));
            } else if (tile === 5) {
                foods.push(new Food(x, y, tileSize, tileSize, 'assets/images/pastilla.png', true));
            } else if (tile === 6) {
                foods.push(new Food(x, y, tileSize, tileSize, 'assets/images/pastilla.png', true));
            }

        }
    }
}

function drawWinScreen() {

    creepySound.pause();

    gratula.play();
    gratula.volume = 0.5;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "green";
    ctx.font = "40px Arial";
    ctx.fillText("GANASTE", canvas.width / 2 - 80, canvas.height / 2 - 50);
    ctx.font = "20px Arial";
    ctx.fillText("Presiona R para jugar de nuevo", 590, canvas.height / 2);
    score = 0;
    foods = [];
    create();
}

function resetGame() {
    pause = true;
    restarting = true;
    countdown = 3;

    speed = 1;
    illuminationRadius = 100;
    elapsedTime = 0;

    player.resetPosition();
    ghosts.forEach(ghost => {
        ghost.resetPosition();
        ghost.speed = 2; 
    });

    let countdownInterval = setInterval(() => {
        countdown--;

        //reanudar el juego
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            pause = false;
            restarting = false;
            gameState = "playing";
        }
    }, 1000);
}

function draw() {

    elevador.pause();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    
    foods.forEach(food => food.draw(ctx));
   
    ghosts.forEach(ghost => {
        ghost.draw(ctx);
    });

    drawLight();

    player.draw(ctx);
    
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("SCORE: " + score, 70, 20);
    ctx.fillText("LIVES: " + player.lives, 1100, 20);

    drawTimer();

    //reinicio
    if (restarting && countdown > 0) {
        ctx.fillStyle = "red";
        ctx.font = "90px Arial";
        ctx.fillText(countdown, canvas.width / 2 - 10, canvas.height / 2);
    }

    if (pause && !restarting) {        
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("PAUSE", 590, canvas.height / 2);
    }

    if(!pause){
        creepySound.play();
        creepySound.volume = 0.4;
    }

}

function gameLoop() {
    if (gameState === "start") {
        drawStartScreen();
    } else if (gameState === "playing") {
        update();
        draw();
    } else if (gameState === "gameOver") {
        drawGameOverScreen();
    } else if (gameState === "win") {
        drawWinScreen();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();