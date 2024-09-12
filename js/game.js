import { Player } from './player.js';
import { Food } from './food.js';

const canvas = document.getElementById("my_canvas");
const ctx = canvas.getContext('2d');

let direction = "";
let score = 0;
let speed = 5;
let pause = false;

let player = new Player(250, 250, 40, 40, 'assets/images/esponga.png');
let food = new Food(300,300,40, 40, 'assets/images/plato.png');

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

function update() {
    if (!pause) {
        player.move(direction, speed, canvas);
        
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    player.draw(ctx);
    food.draw(ctx);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();