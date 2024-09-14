import { Player } from './player.js';
import { Food } from './food.js';
import { Wall } from './wall.js';
import { Ghost } from './ghost.js';
import { map } from './map.js';

const canvas = document.getElementById("my_canvas");
const ctx = canvas.getContext('2d');

const tileSize = 32; 

let direction = "";
let score = 0;
let speed = 1;
let pause = false;

let player = new Player(250, 250, 32, 32, 'assets/images/esponga.png');

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
            
            if (tile === 1) {
                //pared
                walls.push(new Wall(x, y, tileSize, tileSize, 'pink'));
            } else if (tile === 2) {
                //comida
                foods.push(new Food(x, y, tileSize, tileSize, 'assets/images/plato.png'));
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
                console.log("el pepe")
            }
        });
        
        // ghosts.forEach(ghost => {
        //     ghost.move();
            
        // });

    }
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    player.draw(ctx);
    
    walls.forEach(wall => wall.draw(ctx));
    
    foods.forEach(food => food.draw(ctx));

    
    //food.draw(ctx);
    
    //drawMap();
    // walls.forEach(wall => {
    //     wall.draw(ctx);
    //   });

    // ghosts.forEach(ghost => {

    //     ghost.draw(ctx);
    // });

}


function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();