class Food {
    constructor(x, y, w, h, imgSrc, isPill = false, effectType) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.image = new Image();
        this.image.src = imgSrc;
        this.isPill = isPill;
        this.effectType = effectType;

    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
}

export { Food };