class Food {
    constructor(x, y, w, h, imgSrc, isPill = false) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.image = new Image();
        this.image.src = imgSrc;
        this.isPill = isPill;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }

    effect(player) {
        if (this.isPill) {

            //aqui crear el efecto especial de comer pastilla
            setTimeout(() => {
                console.log("te comiste una pastilla loca")
            }, 5000);
        }
    }
}

export { Food };