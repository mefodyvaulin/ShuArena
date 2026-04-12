const dotCount = 5000;
let lastPos = new Float64Array(dotCount);
let currentPos = new Float64Array(dotCount);
const dt = 0.0005;
const startG = new Float64Array(dotCount).fill(0);
const c = 0.1;
const r = c * dt / (1 / dotCount);
const deltaH = 50;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function drawCurrent() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'blue';
    for (let i = 0; i < dotCount; i++) {
        const x = (i / dotCount) * w;
        const y = (currentPos[i] / 100) * h;
        ctx.fillRect(x, y, 2, 2);
    }
}

function calculateNext() {
    const nextPos = new Float64Array(dotCount);
    for (let i = 0; i < dotCount; i++) {


        nextPos[i] = 2 * currentPos[i] - lastPos[i] +
            (r * r) * (currentPos[i + 1] - 2 * currentPos[i] + currentPos[i - 1]);
        if (i === 0 || i === dotCount - 1) nextPos[i] = deltaH;
    }
    lastPos.set(currentPos);
    currentPos.set(nextPos);
}

function waveStep(){
    drawCurrent();
    calculateNext();

    requestAnimationFrame(waveStep);
}

function fillInitLayer(){
    for (let i = 0; i < dotCount; i++){
        const progress = i / (dotCount - 1);
        const damping = Math.sin(progress * Math.PI);
        lastPos[i] = deltaH + Math.sin(i * 0.1) * 5 * damping;
    }
}

function fillFirstLayer(){
    for (let i = 0; i < dotCount; i++){
        if (i === 0 || i === dotCount - 1){
            currentPos[i] = deltaH;
            continue;
        }
        currentPos[i] = lastPos[i] + dt * startG[i] +
            (r * r) / 2 * (lastPos[i + 1] - 2 * lastPos[i] + lastPos[i - 1]);
    }
}

function init(){
    fillInitLayer();
    fillFirstLayer()
}

function resizeCanvas(){
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);
}

init();
resizeCanvas();
requestAnimationFrame(waveStep);