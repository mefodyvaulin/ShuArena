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
}

export default CurveForm;