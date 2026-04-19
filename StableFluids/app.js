import { StableFluidsSolver } from './StableFluidsSolver.js';

const canvas = document.getElementById('view');
const ctx = canvas.getContext('2d', { alpha: false });

const simCanvas = document.createElement('canvas');
const simCtx = simCanvas.getContext('2d');

const solver = new StableFluidsSolver({
    width: 250,
    height: 180
});

solver.initialize();
solver.fillZeros();

simCanvas.width = solver.xPoints;
simCanvas.height = solver.yPoints;

const image = simCtx.createImageData(simCanvas.width, simCanvas.height);
const pixels = image.data;

const pointer = {
    down: false,
    x: 0, y: 0,
    px: 0, py: 0
};

function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.floor(innerWidth * dpr);
    canvas.height = Math.floor(innerHeight * dpr);
}
addEventListener('resize', resize);
resize();

function toGrid(e) {
    const r = canvas.getBoundingClientRect();
    return {
        x: 1 + ((e.clientX - r.left) / r.width) * (solver.xPoints - 1),
        y: 1 + ((e.clientY - r.top) / r.height) * (solver.yPoints - 1)
    };
}

canvas.addEventListener('pointerdown', (e) => {
    const p = toGrid(e);
    pointer.down = true;
    pointer.x = pointer.px = p.x;
    pointer.y = pointer.py = p.y;
    canvas.setPointerCapture(e.pointerId);

    solver.addDyeSplat(pointer.x, pointer.y, 0.8, 10);
});

canvas.addEventListener('pointermove', (e) => {
    if (!pointer.down) return;

    const p = toGrid(e);

    const dx = p.x - pointer.x;
    const dy = p.y - pointer.y;

    const fx = (dx / solver.parameters.dt) * solver.parameters.forceScale;
    const fy = (dy / solver.parameters.dt) * solver.parameters.forceScale;

    const amount = solver.parameters.dyeAmount * (1.0 + Math.hypot(dx, dy) * 0.08);

    solver.splatSegment(pointer.x, pointer.y, p.x, p.y, fx, fy, amount);

    pointer.x = p.x;
    pointer.y = p.y;
});

function stop() {
    pointer.down = false;
}
canvas.addEventListener('pointerup', stop);
canvas.addEventListener('pointercancel', stop);
canvas.addEventListener('pointerleave', stop);

addEventListener('keydown', (e) => {
    if (e.key === 'c' || e.key === 'C') solver.fillZeros();
});

function render() {
    let k = 0;

    for (let j = 1; j <= solver.yPoints; j++) {
        for (let i = 1; i <= solver.xPoints; i++) {
            const id = solver.IX(i, j);
            const x = Math.min(1.8, solver.d[id]);

            const r = Math.min(255, x * 180);
            const g = Math.min(255, x * 120);
            const b = Math.min(255, x * 40);

            pixels[k++] = r | 0;
            pixels[k++] = g | 0;
            pixels[k++] = b | 0;
            pixels[k++] = 255;
        }
    }

    simCtx.putImageData(image, 0, 0);

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(simCanvas, 0, 0, canvas.width, canvas.height);
}

function loop() {
    solver.step();
    render();
    requestAnimationFrame(loop);
}

loop();