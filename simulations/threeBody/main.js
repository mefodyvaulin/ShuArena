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

const bodies = [
    { number: 1, color: 'rgb(255, 0, 0)', mass: 1, position: {x: -0.97000436, y: 0.24308753}, velocity: {x: 0.4662036850, y: 0.4323657300 } },
    { number: 2, color: 'rgb(0, 255, 0)', mass: 1, position: {x: 0.97000436, y: -0.24308753}, velocity: {x: 0.4662036850, y: 0.4323657300 } },
    { number: 3, color: 'rgb(0, 0, 255)', mass: 1, position: {x: 0, y: 0}, velocity: {x: -0.93240737, y: -0.86473146 } }
];

const startConfig = {
    bodies: structuredClone(bodies),
    G: 1,
    dt: 0.001,
    isPaused: false,
    timeSpeed: 1,
    fieldBorders: false
}

const config = structuredClone(startConfig);

initUI(config, startConfig);

const scale = 100;
const radius = 10;
const threeBodyProblem = new ThreeBodyProblem(config);
const displaying = new Displaying(ctx, radius);
const stepsPerFrame = 30;

const animate = () => {
    ctx.clearRect(0, 0, width, height);
    displaying.radius = radius;

    if (!config.isPaused) {
        const stepsCount = Math.floor(config.timeSpeed * stepsPerFrame);

        for (let i = 0; i < stepsCount; i++) {
            threeBodyProblem.update();
        }
    }

    for (const body of threeBodyProblem.config.bodies) {
        const x = width / 2 + body.position.x * scale;
        const y = height / 2 + body.position.y * scale;

        displaying.displayBody(x, y, body.color);

        if (config.fieldBorders) {
            if (x < radius || x > width - radius) body.velocity.x = -body.velocity.x;
            if (y < radius || y > height - radius) body.velocity.y = -body.velocity.y;
        }
    }

    requestAnimationFrame(animate);
}

animate();