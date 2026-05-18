export default class Displaying {
    constructor(ctx, radius, trailLength, color) {
        this.ctx = ctx;

        this.radius = radius;

        this.trailLength = trailLength;

        this.color = color;

        this.positions = []
    }

    storePosition(x, y) {
        this.positions.push({x, y});

        while (this.positions.length > this.trailLength) {
            this.positions.shift();
        }
    }

    displayBody(x, y) {
        this.storePosition(x, y);

        const positionsLength = this.positions.length;


        for (let i = 0; i < positionsLength - 1; i++) {
            const currentPoint = this.positions[i];
            const nextPoint = this.positions[i + 1];

            const scaleFactor = (i + 1) / positionsLength;

            this.ctx.beginPath()
            this.ctx.moveTo(currentPoint.x, currentPoint.y)
            this.ctx.lineTo(nextPoint.x, nextPoint.y);

            this.ctx.strokeStyle = this.color;

            this.ctx.lineWidth = scaleFactor * (this.radius * 2);

            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';

            this.ctx.globalAlpha = scaleFactor / 2;
            this.ctx.stroke();
        }

        this.ctx.globalAlpha = 1;

        const head = this.positions[positionsLength - 1];
        this.ctx.beginPath()
        this.ctx.arc(
            head.x,
            head.y,
            this.radius,
            0,
            2 * Math.PI
        );
        this.ctx.fillStyle = this.color;

        this.ctx.fill();
    }
}