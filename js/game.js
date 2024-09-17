import { Player } from './player.js';
import { Food } from './food.js';
import { Wall } from './wall.js';
import { Ghost } from './ghost.js';
import { map } from './map.js';

const canvas = document.getElementById("my_canvas");
const ctx = canvas.getContext('2d');

const illuminationRadius = 180; 

const backgroundImage = new Image();
backgroundImage.src = 'assets/images/map.png'; 

const tileSize = 32; 

let direction = "";
let score = 0;
let speed = 1;
let pause = false;


let player = new Player(32, 64, 32, 32, 'assets/images/player4.png');

let walls = [];
let foods = [];

let ghosts = [
    new Ghost(100, 100, 40, 40, 'green'),
    new Ghost(400, 400, 40, 40, 'yellow')
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
                foods.push(new Food(x, y, tileSize, tileSize, 'assets/images/01.png'));
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
                    //aqui pondre algo para finalizar el juego
                }

            }

            
        });

        // ghosts.forEach(ghost => {
        //     ghost.move();
            
        // });

    }
}

function drawLight() {
    ctx.globalCompositeOperation = 'destination-over'; // iluminación debajo
    
    // Fondo oscuro
    ctx.fillStyle = 'rgba(0, 0, 0, .7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Luz difuminada alrededor del jugador
    ctx.globalCompositeOperation = 'destination-in';
    
    const gradient = ctx.createRadialGradient(
        player.x + player.w / 2, // Posición x del centro del gradiente
        player.y + player.h / 2, // Posición y del centro del gradiente
        0,                       // Radio inicial del gradiente (centro)
        player.x + player.w / 2, // Posición x del borde externo del gradiente
        player.y + player.h / 2, // Posición y del borde externo del gradiente
        illuminationRadius       // Radio máximo del gradiente (borde difuminado)
    );
    
    // Añade los colores para el gradiente (difuminado de blanco a transparente)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');  // Centro del círculo blanco
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');  // Borde del círculo transparente

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(player.x + player.w / 2, player.y + player.h / 2, illuminationRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.globalCompositeOperation = 'source-over'; // Restaura la composición normal
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    
    foods.forEach(food => food.draw(ctx));
   
    
    
    // ghosts.forEach(ghost => {

    //     ghost.draw(ctx);
    // });

    drawLight();

    player.draw(ctx);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("SCORE: " + score, 20, 20);

    if (pause) {
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("PAUSE", canvas.width / 2 - 60, canvas.height / 2);
    }
}


function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();