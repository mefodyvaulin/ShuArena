export default class Displaying {
    constructor(ctx, radius) {
        this.ctx = ctx;
        this.radius = radius;
    }

    displayBody(x, y, color) {
        this.ctx.beginPath()
        this.ctx.arc(
            x,
            y,
            this.radius,
            0,
            2 * Math.PI
        );
        this.ctx.fillStyle = color;

        this.ctx.fill();
    }
}