class CurveForm{
    static line(array) {
        for (let i = 0; i < array.length; i++) {
            array[i] = 0;
        }
    }

    static sin(array) {
        const mode = 16;
        const mode2 = Math.PI;
        for (let i = 0; i < array.length; i++) {
            const progress = i / (array.length - 1);
            const amplitude = 10 * Math.sin(mode2 * Math.PI * progress);
            array[i] = amplitude * Math.sin(mode * Math.PI * progress);

        }
        array[0] = 0;
        array[array.length - 1] = 0;
    }

    static smoothSquare(array) {
        const amp = 15;
        const freq = 6;
        const sharpness = 10; // Чем выше, тем ближе к квадрату, но без разрывов
        for (let i = 0; i < array.length; i++) {
            const t = i / (array.length - 1);
            const edgeFix = Math.sin(Math.PI * t);
            const val = Math.tanh(sharpness * Math.sin(freq * Math.PI * t));

            array[i] = edgeFix * amp * val;
        }
    }

    static modulated(array) {
        const amp = 25;
        for (let i = 0; i < array.length; i++) {
            const t = i / (array.length - 1);
            const edgeFix = Math.sin(Math.PI * t);
            const carrier = Math.sin(60 * Math.PI * t);
            const modulator = 0.5 + 0.5 * Math.sin(4 * Math.PI * t);

            array[i] = edgeFix * amp * carrier * modulator;
        }
    }

    static bell(array) {
        const amp = 40;
        for (let i = 0; i < array.length; i++) {
            const t = i / (array.length - 1);
            const curve = Math.exp(-Math.pow((t - 0.5) * 6, 2));
            array[i] = amp * curve * Math.sin(Math.PI * t);
        }
    }
}

export default CurveForm;