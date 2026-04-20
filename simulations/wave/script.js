import Wave from "./Wave.js";
import WaveSimulator from "./WaveSimulator.js";
import CurveForm from "./CurveForm.js";
import Drawer from "./Drawer.js";

let curveForm = 'sin';
let startSpeed = 0;
let dotsCount = 15000;

const waveSimulator = new WaveSimulator();

document.addEventListener('mousedown', waveSimulator.mouseDownHandler);

canvas.addEventListener("mousemove", waveSimulator.mouseMoveHandler, false);

document.addEventListener('mouseup', waveSimulator.mouseUpHandler);

let startResetButton = document.getElementById('start-reset');
const resetSimulation = () => {
    startResetButton.textContent = 'Start'
    waveSimulator.stopWave();
}
const startSimulation = () => {
    startResetButton.textContent = 'Stop'
    waveSimulator.startWave();
}
startResetButton.addEventListener('click', (e) => {
    if (waveSimulator.isRunning) {
        resetSimulation();
    }
    else {
        startSimulation();
    }
});

function init(){
    const wave = new Wave(CurveForm[curveForm], startSpeed, dotsCount);
    Drawer.drawCurve(wave.lastPos);
    waveSimulator.setWave(wave);

}
init();
waveSimulator.startWave();

document.getElementById('curveForm').addEventListener('change', (e) =>{
    resetSimulation();
    curveForm = e.target.value;
    init();
});

document.getElementById('startSpeed').addEventListener('change', (e) =>{
    resetSimulation();
    startSpeed = +e.target.value;
    init();
});
