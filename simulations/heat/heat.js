const N = 600;
const H = 1.0;
let u = [];
let nextU = [];
for (let i = 0; i < N; i++) {
    u[i] = [];
    nextU[i] = [];
    for (let j = 0; j < N; j++) {
        u[i][j] = 0;
        nextU[i][j] = 0;
    }
}

let isDrawing = false;
let canvas;
let context;

window.onload = function() {
    canvas = document.getElementById('heatCanvas');
    context = canvas.getContext('2d');
    canvas.width = N;
    canvas.height = N;
    canvas.onmousedown = () => isDrawing = true;
    window.onmouseup = () => isDrawing = false;
    canvas.onmousemove = function(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = N / rect.width;
        const scaleY = N / rect.height;
        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);
        const brushRadius = 5;
        for (let dy = -brushRadius; dy <= brushRadius; dy++) {
            for (let dx = -brushRadius; dx <= brushRadius; dx++) {
                let targetX = x + dx;
                let targetY = y + dy;
                if (targetX > 0 && targetX < N - 1 && targetY > 0 && targetY < N - 1) {
                    if (dx * dx + dy * dy <= brushRadius * brushRadius) {
                        u[targetY][targetX] = 200;
                    }
                }
            }
        }
    };

    document.getElementById('clearBtn').onclick = function() {
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) u[i][j] = 0;
        }
    };

    document.getElementById('resetBtn').onclick = function() {
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) u[i][j] = 0;
        }
        u[N / 2][N / 2] = 500000;
    };
    requestAnimationFrame(loop);
};

function loop() {
    updatePhysics();
    render();
    requestAnimationFrame(loop);
}

function updatePhysics() {
    const a = parseFloat(document.getElementById('paramA').value) || 1.0;
    const dt = 0.02;
    let lambda = (a * dt) / (H * H);
    for (let i = 1; i < N - 1; i++) {
        for (let j = 1; j < N - 1; j++) {
            const diffX = u[i + 1][j] - 2 * u[i][j] + u[i - 1][j];
            const diffY = u[i][j + 1] - 2 * u[i][j] + u[i][j - 1];
            nextU[i][j] = u[i][j] + lambda * (diffX + diffY);
        }
    }

    for (let i = 0; i < N; i++) {
        nextU[i][0] = 0;
        nextU[i][N - 1] = 0;
        nextU[0][i] = 0;
        nextU[N - 1][i] = 0;
    }

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            u[i][j] = nextU[i][j];
        }
    }
}

function render() {
    const imgData = context.createImageData(N, N);
    for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
            const value = u[y][x];
            const pixelIndex = (y * N + x) * 4;
            imgData.data[pixelIndex] = Math.min(255, value * 2);
            imgData.data[pixelIndex + 1] = Math.min(255, value / 2);
            imgData.data[pixelIndex + 2] = Math.min(255, 255 - value);
            imgData.data[pixelIndex + 3] = 255;
        }
    }
    context.putImageData(imgData, 0, 0);
}