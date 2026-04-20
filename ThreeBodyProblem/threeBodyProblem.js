export default class ThreeBodyProblem {
    constructor(config) {
        this.config = config;
        this.config.bodies = config.bodies;
        this.config.G = config.G;
        this.config.dt = config.dt;

        for (let i = 0; i < config.bodies.length; i++) {
            this.config.bodies[i].distances = {};
            this.config.bodies[i].accelerate = {};
        }
    }

    update() {
        this.updateDistances()
            .updateAccelerations()
            .updatePositions()
            .updateVelocities();
    }

    updateDistances() {
        const dist01 = this.calculateDistance(this.config.bodies[0], this.config.bodies[1]);
        const dist02 = this.calculateDistance(this.config.bodies[0], this.config.bodies[2]);
        const dist12 = this.calculateDistance(this.config.bodies[1], this.config.bodies[2]);

        this.config.bodies[0].distances[1] = dist01;
        this.config.bodies[1].distances[0] = dist01;

        this.config.bodies[0].distances[2] = dist02;
        this.config.bodies[2].distances[0] = dist02;

        this.config.bodies[1].distances[2] = dist12;
        this.config.bodies[2].distances[1] = dist12;

        return this;
    }

    calculateDistance(bodyA, bodyB) {
        const differenceX = bodyB.position.x - bodyA.position.x;
        const differenceY = bodyB.position.y - bodyA.position.y;

        const squareDifferenceX = differenceX * differenceX;
        const squareDifferenceY = differenceY * differenceY;

        return Math.sqrt(squareDifferenceX + squareDifferenceY);
    }

    updateAccelerations() {
        for (let i = 0; i < this.config.bodies.length; i++) {
            const body = this.config.bodies[i];
            const bodyAIndex = (i + 1) % 3;
            const bodyBIndex = (i + 2) % 3;

            body.accelerate.x = this.calculateAcceleration(body, bodyAIndex, bodyBIndex, 'x');
            body.accelerate.y = this.calculateAcceleration(body, bodyAIndex, bodyBIndex, 'y');
        }

        return this;
    }

    calculateAcceleration(body, bodyAIndex, bodyBIndex, axis) {
        const bodyA = this.config.bodies[bodyAIndex];
        const bodyB = this.config.bodies[bodyBIndex];

        const termA = this.config.G
            * bodyA.mass
            * (bodyA.position[axis] - body.position[axis])
            / Math.pow(body.distances[bodyAIndex], 3);

        const termB = this.config.G
            * bodyB.mass
            * (bodyB.position[axis] - body.position[axis])
            / Math.pow(body.distances[bodyBIndex], 3);

        return termA + termB;
    }

    updatePositions() {
        this.config.bodies.forEach((body) => {
            body.position.x = this.calculateCoordinates(body, 'x');
            body.position.y = this.calculateCoordinates(body, 'y');
        });

        return this;
    }

    calculateCoordinates(body, axis) {
        return body.position[axis] + body.velocity[axis] * this.config.dt;
    }

    updateVelocities() {
        this.config.bodies.forEach((body) => {
            body.velocity.x = this.calculateVelocity(body, 'x');
            body.velocity.y = this.calculateVelocity(body, 'y');
        });

        return this;
    }

    calculateVelocity(body, axis) {
        return body.velocity[axis] + body.accelerate[axis] * this.config.dt;
    }
}