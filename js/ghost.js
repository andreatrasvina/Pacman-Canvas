class Ghost {
    constructor(x, y, w, h, imgSrc, name) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.image = new Image();
        this.image.src = imgSrc;
        this.speed = 2;
        this.direction = this.getRandomDirection();
        this.name = name;

        this.initialX = x;
        this.initialY = y;
    }

    resetPosition() {
        this.x = this.initialX;
        this.y = this.initialY;
    
    }

    getRandomDirection() {
        const directions = ["up", "down", "left", "right"];
        return directions[Math.floor(Math.random() * directions.length)];
    }

    move(walls) {
        let oldX = this.x;
        let oldY = this.y;

        switch (this.direction) {
            case "up":
                this.y -= this.speed;
                break;
            case "down":
                this.y += this.speed;
                break;
            case "left":
                this.x -= this.speed;
                break;
            case "right":
                this.x += this.speed;
                break;
        }

        let colision = walls.some(wall => this.colision(wall));

        if (colision) {
            this.x = oldX;
            this.y = oldY;
            this.direction = this.getRandomDirection();
        }

        //cada cuanto se actualiza el movimiento
        if (Math.random() < 0.02) {
            this.direction = this.getRandomDirection();
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }

    colision(obj) {
        return (
            this.x < obj.x + obj.w &&
            this.x + this.w > obj.x &&
            this.y < obj.y + obj.h &&
            this.y + this.h > obj.y
        );
    }
}

export { Ghost };
