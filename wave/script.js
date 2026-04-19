import Wave from "./Wave.js";
import WaveSimulator from "./WaveSimulator.js";
import CurveForm from "./CurveForm.js";
import Drawer from "./Drawer.js";


const wave = new Wave(CurveForm.sin, 0, 20000);
Drawer.drawCurve(wave.lastPos);
const waveSimulator = new WaveSimulator(wave);



document.addEventListener('mousedown', waveSimulator.mouseDownHandler);

canvas.addEventListener("mousemove", waveSimulator.mouseMoveHandler, false);

document.addEventListener('mouseup', waveSimulator.mouseUpHandler);

document.getElementById('start').addEventListener('click', waveSimulator.startButtonHandler);
