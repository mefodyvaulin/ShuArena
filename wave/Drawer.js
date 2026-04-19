class Drawer{

    static canvas =  document.getElementById('canvas');
    static deltaH = 50;
    static ctx = canvas.getContext('2d');

    static drawCurve(array) {
        Drawer.resizeCanvas()
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        this.ctx.clearRect(0, 0, w, h);
        this.ctx.fillStyle = 'black';
        for (let i = 0; i < array.length; i++) {
            const x = (i / (array.length - 1)) * w;
            const y = ((array[i] + this.deltaH) / 100) * h;
            this.ctx.fillRect(x, y, 2, 2);
        }
    }

    static resizeCanvas(){
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
}

export default Drawer;