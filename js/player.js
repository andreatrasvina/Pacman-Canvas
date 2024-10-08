class Player {
    constructor(x, y, w, h, imgSrc) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.image = new Image();
        this.image.src = imgSrc;
        this.lives = 3;

        this.initialX = x;
        this.initialY = y;
    }

    resetPosition() {
        this.x = this.initialX;
        this.y = this.initialY;
    
    }

    move(direction, speed, canvas) {
        switch (direction) {
            case "left":
                this.x -= speed;
                if (this.x < 0) this.x = canvas.width;
                break;
            case "up":
                this.y -= speed;
                if (this.y < 0) this.y = canvas.height;
                break;
            case "right":
                this.x += speed;
                if (this.x > canvas.width) this.x = 0;
                break;
            case "down":
                this.y += speed;
                if (this.y > canvas.height) this.y = 0;
                break;
        }
    }

    loseLife() {
        this.lives--;
        if (this.lives <= 0) {
            console.log("Game Over");
            //terminar el juego o reiniciarlo
        }
    }

    colision(otro) {
        return this.x < otro.x + otro.w &&
               this.x + this.w > otro.x &&
               this.y < otro.y + otro.h &&
               this.y + this.h > otro.y;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }

    
}

export { Player };

