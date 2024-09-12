class Ghost {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
    }

    move() {
        this.x += Math.random() > 0.5 ? 2 : -2;
        this.y += Math.random() > 0.5 ? 2 : -2;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

export { Ghost };