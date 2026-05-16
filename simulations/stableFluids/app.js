import { StableFluidsSolver } from './StableFluidsSolver.js';

const canvas = document.getElementById('view');
const ctx = canvas.getContext('2d', { alpha: false });

const simCanvas = document.createElement('canvas');
const simCtx = simCanvas.getContext('2d');

const width = 300;
const aspect = 9 / 16;

const vorticitySlider = document.getElementById('vorticity-slider');
const vorticitySpan = document.getElementById('vorticity-value');
const viscositySlider = document.getElementById('viscosity-slider');
const viscositySpan = document.getElementById('viscosity-value');
const resetButton = document.getElementById('reset-button');

document.addEventListener('DOMContentLoaded', () => {
    const helpButton = document.getElementById('help-button');
    const helpOverlay = document.getElementById('help-overlay');
    const helpClose = document.getElementById('help-close');

    if (!helpButton || !helpOverlay || !helpClose) return;

    const openHelp = () => {
        helpOverlay.classList.add('open');
        helpOverlay.setAttribute('aria-hidden', 'false');
    };

    const closeHelp = () => {
        helpOverlay.classList.remove('open');
        helpOverlay.setAttribute('aria-hidden', 'true');
    };

    helpButton.addEventListener('click', openHelp);
    helpClose.addEventListener('click', closeHelp);

    helpOverlay.addEventListener('click', (e) => {
        if (e.target === helpOverlay) {
            closeHelp();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && helpOverlay.classList.contains('open')) {
            closeHelp();
        }
    });
});

const solver = new StableFluidsSolver({
    width: width,
    height: Math.floor(width * aspect),
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

function updateVorticityDisplay() {
    const val = parseFloat(vorticitySlider.value).toFixed(2);
    vorticitySpan.textContent = val;
}

function updateViscosityDisplay() {
    const raw = viscositySlider.value;

    if (raw === '') {
        viscositySpan.textContent = '';
        return;
    }

    const val = parseFloat(raw);
    //viscositySpan.textContent = Number.isNaN(val) ? '' : val.toFixed(2);
}

function applyParametersToSolver() {
    const vorticity = parseFloat(vorticitySlider.value);
    solver.parameters.vorticity = Number.isNaN(vorticity) ? 0 : vorticity;

    const rawViscosity = viscositySlider.value;
    const viscosity = rawViscosity === '' ? 0 : parseFloat(rawViscosity);

    if (!Number.isNaN(viscosity)) {
        solver.parameters.viscosity = Math.min(2.0, Math.max(0, viscosity)) + 1e-5;
    }
}

function commitViscosityValue() {
    let value = parseFloat(viscositySlider.value);

    if (Number.isNaN(value)) {
        value = 0;
    }

    value = Math.min(2.0, Math.max(0, value));
    viscositySlider.value = value.toFixed(2);

    updateViscosityDisplay();
    applyParametersToSolver();
}

viscositySlider.addEventListener('input', () => {
    updateViscosityDisplay();
    applyParametersToSolver();
});

viscositySlider.addEventListener('blur', commitViscosityValue);
viscositySlider.addEventListener('change', commitViscosityValue);

vorticitySlider.addEventListener('input', () => {
    updateVorticityDisplay();
    applyParametersToSolver();
});

function resetSimulation() {
    applyParametersToSolver();
    solver.fillZeros();
}

resetButton.addEventListener('click', resetSimulation);

updateVorticityDisplay();
updateViscosityDisplay();
applyParametersToSolver();