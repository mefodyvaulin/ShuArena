import ThreeBodyProblem from "./threeBodyProblem.js";
import Displaying from "./displaying.js";
import initUI from "./ui.js";


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width, height;
function resizeCanvas() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const simulationSettingsButton = document.querySelector('#simulation-settings-button');
simulationSettingsButton.addEventListener('click', resizeCanvas);

const orbits = {
    'Восьмёрка': {
        position: { first: {x: -0.97000436, y: 0.24308753 }, second: {x: 0.97000436, y: -0.24308753 }, third: {x: 0, y: 0 } },
        velocity: { first: {x: 0.46620368, y: 0.43236573 }, second: {x: 0.46620368, y: 0.43236573 }, third: {x: -0.93240737, y: -0.86473146 } }
    },
    'Коллинеарная орбита': {
        position: { first: {x: -1, y: 0 }, second: {x: 0, y: 0 }, third: {x: 1, y: 0 } },
        velocity: { first: {x: 0, y: 1.11803399 }, second: {x: 0, y: 0 }, third: {x: 0, y: -1.11803399 } }
    },
    'Равносторонний треугольник': {
        position: { first: {x: 1.15470054, y: 0 }, second: {x: -0.57735027, y: 1 }, third: {x: -0.57735027, y: -1 } },
        velocity: { first: {x: 0, y: 0.70710678 }, second: {x: -0.61237244, y: -0.35355339 }, third: {x: 0.61237244, y: -0.35355339 } }
    }
}

const defaultOrbit = 'Восьмёрка';
const orbit = orbits[defaultOrbit];
const bodies = [
    { number: 1, color: 'rgb(255, 0, 0)', mass: 1,
        position: orbit.position.first, velocity: orbit.velocity.first },
    { number: 2, color: 'rgb(0, 255, 0)', mass: 1,
        position: orbit.position.second, velocity: orbit.velocity.second },
    { number: 3, color: 'rgb(0, 0, 255)', mass: 1,
        position: orbit.position.third, velocity: orbit.velocity.third }
];

const startConfig = {
    bodies: structuredClone(bodies),
    G: 1,
    dt: 0.001,
    isPaused: false,
    timeSpeed: 1,
    fieldBorders: false,
    bodiesNumbering: true,
    trailLength: 30,
}

const radius = 10;

const config = structuredClone(startConfig);
config.bodies.forEach(body => {
    body.displaying = new Displaying(ctx, radius, config.trailLength, body.color, body.number);
});

initUI(config, startConfig, orbits);

const scale = 100;
const threeBodyProblem = new ThreeBodyProblem(config);
const stepsPerFrame = 30;

const animate = () => {
    ctx.clearRect(0, 0, width, height);
    for (const body of threeBodyProblem.config.bodies) {
        body.displaying.radius = radius;
    }

    if (!config.isPaused) {
        const stepsCount = Math.floor(config.timeSpeed * stepsPerFrame);

        for (let i = 0; i < stepsCount; i++) {
            threeBodyProblem.update();
        }
    }

    for (const body of threeBodyProblem.config.bodies) {
        const x = width / 2 + body.position.x * scale;
        const y = height / 2 + body.position.y * scale;

        body.displaying.displayBody(x, y);

        if (config.fieldBorders) {
            if (x < radius || x > width - radius) body.velocity.x = -body.velocity.x;
            if (y < radius || y > height - radius) body.velocity.y = -body.velocity.y;
        }
    }

    requestAnimationFrame(animate);
}

animate();