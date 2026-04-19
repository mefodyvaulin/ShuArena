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

    setBoundaryScalarOpen(field){ // boundary conditions for scalar fields
        for (let i= 1; i <= this.xPoints; i++) {
            field[this.IX(i, 0)] = field[this.IX(i, 1)];
            field[this.IX(i, this.yPoints + 1)] = field[this.IX(i, this.yPoints)];
        }

        for (let j = 1; j <= this.yPoints; j++){
            field[this.IX(0, j)] = field[this.IX(1, j)];
            field[this.IX(this.xPoints + 1, j)] = field[this.IX(this.xPoints, j)];
        }

        field[this.IX(0, 0)] = 0.5 * (field[this.IX(1, 0)] + field[this.IX(0, 1)]);
        field[this.IX(0, this.yPoints + 1)] = 0.5 * (field[this.IX(1, this.yPoints + 1)] + field[this.IX(0, this.yPoints)]);
        field[this.IX(this.xPoints + 1, 0)] = 0.5 * (field[this.IX(this.xPoints, 0)] + field[this.IX(this.xPoints + 1, 1)]);
        field[this.IX(this.xPoints + 1, this.yPoints + 1)] = 0.5 * (field[this.IX(this.xPoints, this.yPoints + 1)] + field[this.IX(this.xPoints + 1, this.yPoints)]);
    }

    setBoundaryVelocityOpen(u, v) { // Open boundary velocity fields, Neumann problem boundary conditions
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

    computeCurl() { // curl is scalar field, curl = ∂v/∂x - ∂u/∂y
        this.setBoundaryVelocityOpen(this.u, this.v);

        for (let i = 1; i <= this.xPoints; i++) {
            for (let j = 1; j <= this.yPoints; j++) {
                const derivativePointIndex = this.IX(i, j);
                this.curl[derivativePointIndex] = 0.5 * (
                    (this.v[derivativePointIndex + 1] - this.v[derivativePointIndex - 1]) -
                    (this.u[derivativePointIndex + this.offset] - this.u[derivativePointIndex - this.offset])
                );
            }
        }

        this.setBoundaryScalarOpen(this.curl);
    }

    applyVorticity() { // computation of vorticity force, F = ∇curl * curl * vorticity * dt
        this.computeCurl();

        for (let i = 2; i < this.xPoints; i++) {
            for (let j = 2; j < this.yPoints; j++) {
                const forcePointIndex = this.IX(i, j);

                let nx = 0.5 * (Math.abs(this.curl[forcePointIndex + 1] - this.curl[forcePointIndex - 1]));
                let ny = 0.5 * (Math.abs(this.curl[forcePointIndex + this.offset] - this.curl[forcePointIndex - this.offset]));

                const len = Math.hypot(nx, ny) + 1e-6;
                nx /= len;
                ny /= len;

                const c = this.curl[forcePointIndex];

                this.u[forcePointIndex] += this.parameters.vorticity * ny * c * this.parameters.dt;
                this.v[forcePointIndex] -= this.parameters.vorticity * nx * c * this.parameters.dt;
            }
        }
    }

    diffuseVelocity(u, v, prevU, prevV, viscosity, dt, diffuseIterations) { /* step where we add viscous forces
    solves system of linear equations by Gauss-Seidel method
    (E - viscosity * dt * ∇ ^ 2) * (new velocity field) = old velocity field
    */
        const h = Math.min(this.xPoints, this.yPoints);
        const a = dt * viscosity * h * h;

        u.set(prevU);
        v.set(prevV);

        for (let k = 0; k <= diffuseIterations; k++) {
            for (let i = 1; i <= this.xPoints; i++) {
                for (let j = 1; j <= this.yPoints; j++) {
                    const pointIndex = this.IX(i, j);

                    u[pointIndex] = (
                        prevU[pointIndex] +
                        a * (
                            u[pointIndex - 1] +
                            u[pointIndex + 1] +
                            u[pointIndex - this.offset] +
                            u[pointIndex + this.offset]
                        )
                    ) / (1 + 4 * a);

                    v[pointIndex] = (
                        prevV[pointIndex] +
                        a * (
                            v[pointIndex - 1] +
                            v[pointIndex + 1] +
                            v[pointIndex - this.offset] +
                            v[pointIndex + this.offset]
                        )
                    ) / (1 + 4 * a);
                }
            }
            this.setBoundaryVelocityOpen(u, v);
        }
    }

    project(u, v, p, div){ /* step of forcing incompressibility according to continuity equation ∇u = 0
    1) solving system: ∇ ^ 2 p = ∇ * old velocity field
    2) applying correction to velocity field: new velocity field = old velocity field - ∇p
    */
        this.setBoundaryVelocityOpen(u, v);

        for (let i = 1; i <= this.xPoints; i++) {
            for (let j = 1; j <= this.yPoints; j++) {
                const pointIndex = this.IX(i, j);
                div[pointIndex] = 0.5 * (
                    (u[pointIndex + 1] - u[pointIndex - 1]) +
                    (v[pointIndex + this.offset] - this.v[pointIndex - this.offset])
                );
            }
        }

        this.setBoundaryScalarOpen(div);
        this.setBoundaryScalarOpen(p);

        for (let k = 0; k < this.params.pressureIters; k++) {
            for (let j = 1; j <= this.H; j++) {
                for (let i = 1; i <= this.W; i++) {
                    const pointIndex = this.IX(i, j);
                    p[pointIndex] = 0.25 * (
                        p[pointIndex - 1] +
                        p[pointIndex + 1] +
                        p[pointIndex - this.offset] +
                        p[pointIndex + this.offset] -
                        div[pointIndex]
                    );
                }
            }
            this.setBoundaryScalarOpen(p);
        }

        for (let j = 1; j <= this.H; j++) {
            for (let i = 1; i <= this.W; i++) {
                const pointIndex = this.IX(i, j);
                u[pointIndex] -= 0.5 * (p[pointIndex + 1] - p[pointIndex - 1]);
                v[pointIndex] -= 0.5 * (p[pointIndex + this.offset] - p[pointIndex - this.offset]);
            }
        }

        this.setBoundaryVelocityOpen(u, v);
    }

    step() { // the algorithm with advancing forward in time is here
        this.applyVorticity();

        this.u0.set(this.u);
        this.v0.set(this.v);
        this.diffuseVelocity(
            this.u,
            this.v,
            this.u0,
            this.v0,
            this.parameters.viscosity,
            this.parameters.dt,
            this.parameters.diffuseIters
        );

        this.project(this.u, this.v, this.p, this.div);
    }
}