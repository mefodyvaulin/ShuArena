export class StableFluidsSolver {
    constructor(options = {}) {
        this.parameters = { // all we'll need for simulation
            pressureIters: 20,
            diffuseIters: 8,
            dtMax: 0.033,

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
}