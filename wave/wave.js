const dotCount = 500;
const dots = [];
let lastPos = [];
let currentPos = [];
const dt = 0.005;
const startG = new Array(dotCount).fill(0.01);
const dotSize = 100 / dotCount;
const c = 0.1;
const r = c * dt / dotSize;
const deltaH = 50;
alert(r)
function init(){
    const container = document.querySelector('.wave')


    for (let i= 0; i < dotCount; i++){
        let dot = document.createElement("div");
        dots[i] = dot;
        dot.className = "wave-item";
        dot.style.left = `${i * dotSize}%`;
        dot.style.width = `${dotSize}%`;
        dot.style.height = `3px`;
        const startPos = deltaH + Math.sin(i * dotSize) *3;
        dot.style.top = `${startPos}%`;
        lastPos[i] = startPos;

        container.appendChild(dot)
    }

    for (let i= 0; i < dotCount; i++){
        if (i === 0 || i === dotCount - 1){
            currentPos[i] = deltaH;
            continue;
        }
        currentPos[i] = lastPos[i] + dt * startG[i] + r * r * (lastPos[i + 1] - 2 * lastPos[i] + lastPos[i - 1]);
    }
}

function wave(){
    for (let i= 0; i < 1000; i++){
        requestAnimationFrame(waveStep);
    }
}

function waveStep(){
    const nextPos = []
    for (let i= 0; i < dotCount; i++){
        dots[i].style.top = `${currentPos[i]}%`;

        if (i === 0 || i === dotCount - 1){
            nextPos[i] = 50;
            continue;
        }
        nextPos[i] = 2 * currentPos[i] - lastPos[i] +
            (r * r) * (currentPos[i + 1] - 2 * currentPos[i] + currentPos[i - 1]);
    }
    lastPos = [...currentPos];
    currentPos = [...nextPos];

    requestAnimationFrame(waveStep);
}

init();
wave();