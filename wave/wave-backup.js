const dotsCount = 10000;
let lastPos = new Float64Array(dotsCount);
let currentPos = new Float64Array(dotsCount);
let nextPos = new Float64Array(dotsCount);

const dt = 0.0001;
const startG = new Float64Array(dotsCount).fill(0);
const c = 0.1;
const dx = 1 / (dotsCount - 1);
const r = c * dt / dx;
const stepsPerFrame = 100;

const deltaH = 50;


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function drawCurrent() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'white';
    for (let i = 0; i < dotsCount; i++) {
        const x = (i / (dotsCount - 1)) * w;
        const y = ((currentPos[i] + deltaH) / 100) * h;
        ctx.fillRect(x, y, 2, 2);
    }
}

function calculateNext() {
    nextPos[0] = 0;
    nextPos[dotsCount - 1] = 0;
    for (let i = 1; i < dotsCount - 1; i++) {
        nextPos[i] =
            2 * currentPos[i] - lastPos[i] +
            (r * r) * (currentPos[i + 1] - 2 * currentPos[i] + currentPos[i - 1]);
    }
    lastPos.set(currentPos);
    currentPos.set(nextPos);
}

let animationId = null;
let isRunning = false;


function startWave() {
    if (!isRunning) {
        isRunning = true;
        waveStep();
    }
}
function waveStep() {
    if (!isRunning) return;
    for (let s = 0; s < stepsPerFrame; s++) {
        calculateNext();
    }
    drawCurrent();
    animationId = requestAnimationFrame(waveStep);
}
function stopWave() {
    isRunning = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

function line() {
    for (let i = 0; i < lastPos.length; i++) {
        lastPos[i] = 0;
    }
}
function sin() {
    const mode = 16;
    const mode2 = Math.PI;
    for (let i = 0; i < lastPos.length; i++) {
        const progress = i / (lastPos.length - 1);
        const amplitude = 10 * Math.sin(mode2 * Math.PI * progress);
        lastPos[i] = amplitude * Math.sin(mode * Math.PI * progress);

    }
    lastPos[0] = 0;
    lastPos[lastPos.length - 1] = 0;
}

function fillFormLayer() {
    sin()
}

let isDrawing = false;
document.addEventListener('mousedown', mouseDownHandler);
function mouseDownHandler(e) {
    isDrawing = true;
}

canvas.addEventListener("mousemove", mouseMoveHandler, false);

function smooth() {
    for (let i = 1; i < 1000; i++) {
        currentPos[0] = 0;
        currentPos[dotsCount - 1] = 0;
        for (let i = 1; i < dotsCount - 1; i++) {
            currentPos[i] =
                2 * currentPos[i] - currentPos[i] +
                (r * r) * (currentPos[i + 1] - 2 * currentPos[i] + currentPos[i - 1]);
        }
    }

    drawCurrent();
    lastPos.set(currentPos);
}

function mouseMoveHandler(e) {
    if (isDrawing && !isRunning) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = dotsCount * (e.clientX - rect.left) / canvas.clientWidth;
        const mouseY = (e.clientY - rect.top) / canvas.clientHeight * 100 - deltaH
        for (let i = 1; i < dotsCount - 1; i++) {
            if (Math.abs(i - mouseX) < 20 && Math.abs(currentPos[i] - mouseY) < 10) {
                currentPos[i] = mouseY;
            }
        }
        smooth();
    }
}

document.addEventListener('mouseup', mouseUpHandler);
function mouseUpHandler() {
    isDrawing = false;
}

function fillFirstLayer() {
    currentPos[0] = 0;
    currentPos[dotsCount - 1] = 0;

    for (let i = 1; i < dotsCount - 1; i++) {
        currentPos[i] =
            lastPos[i] +
            dt * startG[i] +
            (r * r) / 2 * (lastPos[i + 1] - 2 * lastPos[i] + lastPos[i - 1]);
    }
}

function resizeCanvas(){
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
fillFormLayer();
fillFirstLayer();
drawCurrent();

document.getElementById('start').addEventListener('click', (e) =>{
    if (isRunning) {
        stopWave();
    }
    else {
        currentPos = new Float64Array(dotsCount);
        fillFirstLayer();
        startWave();
    }
});

