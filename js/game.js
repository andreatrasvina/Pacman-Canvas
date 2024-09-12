import { Player } from './player.js';
import { Food } from './food.js';
import { Wall } from './wall.js';
import { Ghost } from './ghost.js';

const canvas = document.getElementById("my_canvas");
const ctx = canvas.getContext('2d');

let direction = "";
let score = 0;
let speed = 5;
let pause = false;

let player = new Player(250, 250, 40, 40, 'assets/images/esponga.png');
let food = new Food(300,300,40, 40, 'assets/images/plato.png');

let walls = [
    new Wall(80, 350, 320, 40, 'pink'),
    new Wall(80, 100, 320, 40, 'pink')
];

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

function update() {
    if (!pause) {
        player.move(direction, speed, canvas);
        
        ghosts.forEach(ghost => {
            ghost.move();
            
        });

    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    player.draw(ctx);
    food.draw(ctx);

    walls.forEach(wall => {
        wall.draw(ctx);
      });

    ghosts.forEach(ghost => {

        ghost.draw(ctx);
    });

}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();