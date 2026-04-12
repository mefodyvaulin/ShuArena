const dotCount = 500;
const dots = [];
let lastPos = new Float64Array(dotCount);
let currentPos = new Float64Array(dotCount);
const dt = 0.005;
const startG = new Float64Array(dotCount).fill(0);
const dotSize = 100 / dotCount;
const c = 0.1;
const r = c * dt / (1 / dotCount);
const deltaH = 50;
function waveStep(){
    const nextPos = [];
    for (let i = 0; i < dotCount; i++){
        dots[i].style.top = `${currentPos[i]}%`;
        if (i === 0 || i === dotCount - 1){
            nextPos[i] = deltaH;
            continue;
        }
        nextPos[i] = 2 * currentPos[i] - lastPos[i] + (r * r) * (currentPos[i + 1] - 2 * currentPos[i] + currentPos[i - 1]);
    }
    lastPos = [...currentPos];
    currentPos = [...nextPos];
    requestAnimationFrame(waveStep);
}

function init(){
    const container = document.querySelector('.wave');
    for (let i = 0; i < dotCount; i++){
        let dot = document.createElement("div");
        dots[i] = dot;
        dot.className = "wave-item";
        dot.style.left = `${i * dotSize}%`;
        dot.style.width = `${dotSize}%`;

        const progress = i / (dotCount - 1);
        const damping = Math.sin(progress * Math.PI);
        const startPos = deltaH + Math.sin(i * 0.1) * 5 * damping;

        dot.style.top = `${startPos}%`;
        lastPos[i] = startPos;
        container.appendChild(dot);
    }

    for (let i = 0; i < dotCount; i++){
        if (i === 0 || i === dotCount - 1){
            currentPos[i] = deltaH;
            continue;
        }
        currentPos[i] = lastPos[i] + dt * startG[i] + (r * r) / 2 * (lastPos[i + 1] - 2 * lastPos[i] + lastPos[i - 1]);
    }

    requestAnimationFrame(waveStep);
}

init();
