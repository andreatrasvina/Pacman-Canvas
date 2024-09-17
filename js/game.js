import { Player } from './player.js';
import { Food } from './food.js';
import { Wall } from './wall.js';
import { Ghost } from './ghost.js';
import { map } from './map.js';

let gameState = "start";

const canvas = document.getElementById("my_canvas");
const ctx = canvas.getContext('2d');

const illuminationRadius = 180; 

const backgroundImage = new Image();
backgroundImage.src = 'assets/images/mapcopia.png'; 

const tileSize = 32; 

let direction = "";
let score = 0;
let speed = 1;
let pause = false;

let countdown = 0;
let restarting = false;


let player = new Player(32, 64, 32, 32, 'assets/images/puckman.png');

let walls = [];
let foods = [];

let ghosts = [
    new Ghost(580, 382 , 64, 64, 'assets/images/selene_delgado.png', "Selene Delgado"),
    new Ghost(96, 610, 64, 64, 'assets/images/obunga.png', "Obunga"),
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

function create() {
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            const tile = map[row][col];
            const x = col * tileSize;
            const y = row * tileSize;
            
            
            //pared
            if (tile === 1) {
                walls.push(new Wall(x, y, tileSize, tileSize, 'pink'));
            
            //comida
            } else if (tile === 2 ) {
                foods.push(new Food(x, y, tileSize, tileSize, 'assets/images/comida.png'));
            }

            //pastilla
            else if (tile === 3) {
                foods.push(new Food(x, y, tileSize, tileSize, 'assets/images/player2.png', true));
            }

            //
            else if (tile === 4) {
                foods.push(new Food(x, y, tileSize, tileSize, 'assets/images/plato.png', true));
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

                score++;
                totalFoods--; 

                foods.splice(index, 1); 

                if (food.isPill) {
                    food.effect(player);
                }

                if (totalFoods === 0) {
                    console.log("ya ganastes");
                    pause = true; // Pausar el juego al ganar
                    
                }
            }
        });

        ghosts.forEach(ghost => {
            ghost.move(walls);

            if (player.colision(ghost)) {
                player.loseLife();
                console.log(`Vidas restantes: ${player.lives}`);

                if (player.lives > 0) {
                    resetGame();
                } else {
                    gameState = "gameOver";
                }
            }
        });
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("PACMAN'S NEXTBOTS", 380, canvas.height / 2 - 50);
    ctx.font = "20px Arial";
    ctx.fillText("Press ENTER to start", canvas.width / 2 - 90, canvas.height / 2);
}

document.addEventListener('keydown', function(e) {
    if (gameState === "start" && e.keyCode === 13) { //ENTER
        gameState = "playing";
        resetGame(); 
    }
});

function drawGameOverScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2 - 50);
    ctx.font = "20px Arial";
    ctx.fillText("Press R to restart", canvas.width / 2 - 90, canvas.height / 2);
}

document.addEventListener('keydown', function(e) {
    if (gameState === "gameOver" && e.keyCode === 82) { //R
        gameState = "playing";
        player.lives = 3;
        resetGame();
    }
});

function resetGame() {
    pause = true;
    restarting = true;

    player.resetPosition();
    ghosts.forEach(ghost => ghost.resetPosition());

    setTimeout(() => {
        pause = false;
        countdown = 0;
        restarting = false;
        gameState = "playing";
    }, 3000);
}

function draw() {
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
    ctx.fillText("SCORE: " + score, 20, 20);
    ctx.fillText("LIVES: " + player.lives, 1050, 20);

    //reinicio
    if (restarting && countdown > 0) {
        ctx.fillStyle = "red";
        ctx.font = "90px Arial";
        ctx.fillText(countdown, canvas.width / 2 - 10, canvas.height / 2);
    }

    if (pause && !restarting) {
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("PAUSE", canvas.width / 2 - 60, canvas.height / 2);
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
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();