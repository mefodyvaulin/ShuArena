import Drawer from './Drawer.js';

class WaveSimulator{
    constructor(wave= null){
        this.wave = wave;
        this.animationId = null;
        this.isRunning = false;
        this.isDrawing = false;
        this.stepsPerFrame = 100;
    }

    setWave(wave){
        this.wave = wave;
    }

    startWave = () =>  {
        if (!this.isRunning) {
            this.isRunning = true;
            this.wave.currentPos = new Float64Array(this.wave.dotsCount);
            this.wave.fillFirstLayer();
            this.waveStep();
        }
    }
    waveStep = () => {
        if (!this.isRunning) return;
        for (let s = 0; s < this.stepsPerFrame; s++) {
            this.wave.calculateNext();
        }
        Drawer.drawCurve(this.wave.currentPos);
        this.animationId = requestAnimationFrame(() => this.waveStep());
    }
    stopWave = () => {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    mouseDownHandler = () => {
        this.isDrawing = true;
    }
    mouseMoveHandler = (e) => {
        if (this.isDrawing && !this.isRunning) {
            const rect = Drawer.canvas.getBoundingClientRect();
            const mouseX = this.wave.dotsCount * (e.clientX - rect.left) / Drawer.canvas.clientWidth;
            const mouseY = (e.clientY - rect.top) / Drawer.canvas.clientHeight * 100 - Drawer.deltaH
            for (let i = 1; i < this.wave.dotsCount - 1; i++) {
                if (Math.abs(i - mouseX) < 30 && Math.abs(this.wave.currentPos[i] - mouseY) < 30) {
                    this.wave.currentPos[i] = mouseY;
                }
            }
            this.wave.smooth();
            Drawer.drawCurve(this.wave.currentPos);
        }
    }
    mouseUpHandler = () =>{
        this.isDrawing = false;
    }
}

export default WaveSimulator;