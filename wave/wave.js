const dotCount = 5000;
let lastPos = new Float64Array(dotCount);
let currentPos = new Float64Array(dotCount);
const nextPos = new Float64Array(dotCount);

const dt = 0.0001;
const startG = new Float64Array(dotCount).fill(10);
const c = 0.1;
const dx = 1 / (dotCount - 1);
const r = c * dt / dx;

const deltaH = 50;
const stepsPerFrame = 100;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function drawCurrent() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'blue';
    for (let i = 0; i < dotCount; i++) {
        const x = (i / (dotCount - 1)) * w;
        const y = (currentPos[i] / 100) * h;
        ctx.fillRect(x, y, 2, 2);
    }
}

function calculateNext() {
    nextPos[0] = deltaH;
    nextPos[dotCount - 1] = deltaH;
    for (let i = 1; i < dotCount - 1; i++) {
        nextPos[i] =
            2 * currentPos[i] - lastPos[i] +
            (r * r) * (currentPos[i + 1] - 2 * currentPos[i] + currentPos[i - 1]);
    }
    lastPos.set(currentPos);
    currentPos.set(nextPos);
}

function waveStep() {
    for (let s = 0; s < stepsPerFrame; s++) {
        calculateNext();
    }

    drawCurrent();
    requestAnimationFrame(waveStep);
}

function fillFormLayer() {
    const mode = 16;
    const mode2 = Math.PI;
    for (let i = 0; i < dotCount; i++) {
        const progress = i / (dotCount - 1);
        const amplitude = 10 * Math.sin(mode2 * Math.PI * progress);
        const shape = amplitude * Math.sin(mode * Math.PI * progress);
        lastPos[i] = deltaH + shape;
    }
    lastPos[0] = deltaH;
    lastPos[dotCount - 1] = deltaH;
}

function fillFirstLayer() {
    currentPos[0] = deltaH;
    currentPos[dotCount - 1] = deltaH;

    for (let i = 1; i < dotCount - 1; i++) {
        currentPos[i] =
            lastPos[i] +
            dt * startG[i] +
            (r * r) / 2 * (lastPos[i + 1] - 2 * lastPos[i] + lastPos[i - 1]);
    }
}

function init() {
    fillFormLayer();
    fillFirstLayer();
}

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
init();
drawCurrent();
requestAnimationFrame(waveStep);