export class StableFluidsSolver {
    constructor(options = {}) {
        this.parameters = { // all we'll need for simulation
            pressureIters: 20,
            diffuseIters: 8,
            dt: 0.025,

            viscosity: 0.00003,
            dyeDiffusion: 0.0,

            velocityDissipation: 0.996,
            dyeDissipation: 0.994,

            vorticity: 14.0,

            splatRadius: 6.0,
            forceScale: 0.38,
            dyeAmount: 0.03,

            width: 170,
            height: 120
        }

        if (options !== undefined) {
            this.parameters = options;
        }

        this.xPoints = 0;
        this.yPoints = 0;
        this.offset = 0;
        this.size = 0;

        this.u = null;
        this.v = null;
        this.u0 = null;
        this.v0 = null;
        this.d = null;
        this.d0 = null;
        this.p = null;
        this.div = null;
        this.curl = null;


    }

    initialize(params) { // initialization of fields
        this.xPoints = this.parameters.width;
        this.yPoints = this.parameters.height;
        this.offset = this.xPoints + 2;
        this.size = (this.xPoints + 2) * (this.yPoints + 2);

        this.u = new Float32Array(this.size);
        this.v = new Float32Array(this.size);
        this.u0 = new Float32Array(this.size);
        this.v0 = new Float32Array(this.size);

        this.d = new Float32Array(this.size);
        this.d0 = new Float32Array(this.size);

        this.p = new Float32Array(this.size);
        this.div = new Float32Array(this.size);
        this.curl = new Float32Array(this.size);
    }

    fillZeros(){ // initial state
        this.u.fill(0);
        this.v.fill(0);
        this.u0.fill(0);
        this.v0.fill(0);
        this.d.fill(0);
        this.d0.fill(0);
        this.p.fill(0);
        this.div.fill(0);
        this.curl.fill(0);
    }

    IX(i, j) {
        return i + this.offset * j;
    }

    setBoundaryVelocityOpen(u, v) {
        for (let i = 1; i <= this.xPoints; i++) {
            u[this.IX(i, 0)] = u[this.IX(i, 1)];
            v[this.IX(i, 0)] = Math.min(v[this.IX(i, 1)], 0.0);

            u[this.IX(i, this.yPoints + 1)] = u[this.IX(i, this.yPoints)];
            v[this.IX(i, this.yPoints + 1)] = Math.max(v[this.IX(i, this.yPoints)], 0.0);
        }

        for (let j = 1; j <= this.yPoints; j++) {
            u[this.IX(0, j)] = Math.min(u[this.IX(1, j)], 0.0);
            v[this.IX(0, j)] = v[this.IX(1, j)];

            u[this.IX(this.xPoints + 1, j)] = Math.max(u[this.IX(this.xPoints, j)], 0.0);
            v[this.IX(this.xPoints + 1, j)] = v[this.IX(this.xPoints, j)];
        }

        u[this.IX(0, 0)] = 0.5 * (u[this.IX(1, 0)] + u[this.IX(0, 1)]);
        v[this.IX(0, 0)] = 0.5 * (v[this.IX(1, 0)] + v[this.IX(0, 1)]);

        u[this.IX(0, this.yPoints + 1)] = 0.5 * (u[this.IX(1, this.yPoints + 1)] + u[this.IX(0, this.yPoints)]);
        v[this.IX(0, this.yPoints + 1)] = 0.5 * (v[this.IX(1, this.yPoints + 1)] + v[this.IX(0, this.yPoints)]);

        u[this.IX(this.xPoints+ 1, 0)] = 0.5 * (u[this.IX(this.xPoints, 0)] + u[this.IX(this.xPoints + 1, 1)]);
        v[this.IX(this.xPoints + 1, 0)] = 0.5 * (v[this.IX(this.xPoints, 0)] + v[this.IX(this.xPoints + 1, 1)]);

        u[this.IX(this.xPoints + 1, this.yPoints + 1)] = 0.5 * (u[this.IX(this.xPoints, this.yPoints + 1)] + u[this.IX(this.xPoints + 1, this.yPoints)]);
        v[this.IX(this.xPoints + 1, this.yPoints + 1)] = 0.5 * (v[this.IX(this.xPoints, this.yPoints + 1)] + v[this.IX(this.xPoints + 1, this.yPoints)]);
    }

    computeCurl() {

    }

    applyVorticity() {

    }
    step() {
        this.applyVorticity();
    }
}