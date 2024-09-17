class Ghost {
    constructor(x, y, w, h, imgSrc) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.image = new Image();
        this.image.src = imgSrc;
        this.speed = 2; // Velocidad de movimiento
        this.direction = this.getRandomDirection();
    }

    getRandomDirection() {
        const directions = ["up", "down", "left", "right"];
        return directions[Math.floor(Math.random() * directions.length)];
    }

    move(walls) {
        let oldX = this.x;
        let oldY = this.y;

        // Mover fantasma en la dirección actual
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

        // Verificar colisión con las paredes
        let collided = walls.some(wall => this.colision(wall));

        // Si colisiona, revertir el movimiento y cambiar de dirección
        if (collided) {
            this.x = oldX;
            this.y = oldY;
            this.direction = this.getRandomDirection();
        }

        // Cambiar dirección aleatoriamente después de moverse un poco
        if (Math.random() < 0.02) {
            this.direction = this.getRandomDirection();
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }

    // Colisión con cualquier objeto (pared o jugador)
    colision(entity) {
        return (
            this.x < entity.x + entity.w &&
            this.x + this.w > entity.x &&
            this.y < entity.y + entity.h &&
            this.y + this.h > entity.y
        );
    }
}

export { Ghost };
