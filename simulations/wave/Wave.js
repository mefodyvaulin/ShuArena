class Wave{
    constructor(form, startSpeed, dotsCount = 10000) {
        this.dotsCount = dotsCount;

        this.lastPos = new Float64Array(dotsCount);
        this.currentPos = new Float64Array(dotsCount);
        this.nextPos = new Float64Array(dotsCount);
        this.startSpeeds = new Float64Array(dotsCount).fill(startSpeed);

        form(this.lastPos)
        this.currentPos.set(this.lastPos)
        this.dt = 0.0001;
        this.c = 0.1;
        this.dx = 1 / (this.dotsCount - 1);
        this.r = this.c * this.dt / this.dx;

    }

    fillFirstLayer() {
        this.currentPos[0] = 0;
        this.currentPos[this.dotsCount - 1] = 0;

        for (let i = 1; i < this.dotsCount - 1; i++) {
            this.currentPos[i] =
                this.lastPos[i] +
                this.dt * this.startSpeeds[i] +
                (this.r * this.r) / 2 * (this.lastPos[i + 1] - 2 * this.lastPos[i] + this.lastPos[i - 1]);
        }
    }

    calculateNext() {
        this.nextPos[0] = 0;
        this.nextPos[this.dotsCount - 1] = 0;
        for (let i = 1; i < this.dotsCount - 1; i++) {
            this.nextPos[i] =
                2 * this.currentPos[i] - this.lastPos[i] +
                (this.r * this.r) * (this.currentPos[i + 1] - 2 * this.currentPos[i] + this.currentPos[i - 1]);
        }
        this.lastPos.set(this.currentPos);
        this.currentPos.set(this.nextPos);
    }

    smooth() {
        this.lastPos = this.currentPos;
        for (let i = 1; i < 1000; i++) {
            this.currentPos[0] = 0;
            this.currentPos[this.dotsCount - 1] = 0;
            for (let i = 1; i < this.dotsCount - 1; i++) {
                this.lastPos[i] =
                    this.currentPos[i] +
                    (this.r * this.r) * (this.currentPos[i + 1] - 2 * this.currentPos[i] + this.currentPos[i - 1]);
            }
        }
    }
}

export default Wave;