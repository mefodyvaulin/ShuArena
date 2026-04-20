export default function initUI(config, bodies) {
    const bindFloatInput = (selector, func) => {
        const element = document.querySelector(selector);
        if (!element) return;

        element.addEventListener('input', (e) => {
            if (e.target.value === '') return;

            const value = parseFloat(e.target.value);
            func(value)
        });
    }

    const bindClick = (selector, action) => {
        const element = document.querySelector(selector);
        if (element) element.addEventListener('click', action);
    };

    const syncUi = () => {
        document.querySelector('#input-g').value = config.G;
        document.querySelector('#input-dt').value = config.dt;
        document.querySelector('#input-timeSpeed').value = config.timeSpeed;

        bodies.forEach((body, index) => {
            const name = bodyNames[index];
            document.querySelector(`#input-${name}BodyMass`).value = config.bodies[index].mass;
            document.querySelector(`#input-${name}BodyPositionX`).value = config.bodies[index].position.x;
            document.querySelector(`#input-${name}BodyPositionY`).value = config.bodies[index].position.y;
            document.querySelector(`#input-${name}BodyVelocityX`).value = config.bodies[index].velocity.x;
            document.querySelector(`#input-${name}BodyVelocityY`).value = config.bodies[index].velocity.y;
        });
    }

    bindFloatInput('#input-g', val => config.G = val);
    bindFloatInput('#input-dt', val => config.dt = val);
    bindFloatInput('#input-timeSpeed', val => config.timeSpeed = val);

    const bodyNames = ['first', 'second', 'third'];
    bodies.forEach((body, index) => {
        const name = bodyNames[index];
        bindFloatInput(`#input-${name}BodyMass`, val => config.bodies[index].mass = val);
        bindFloatInput(`#input-${name}BodyPositionX`, val => config.bodies[index].position.x = val);
        bindFloatInput(`#input-${name}BodyPositionY`, val => config.bodies[index].position.y = val);
        bindFloatInput(`#input-${name}BodyVelocityX`, val => config.bodies[index].velocity.x = val);
        bindFloatInput(`#input-${name}BodyVelocityY`, val => config.bodies[index].velocity.y = val);
    });

    bindClick('#pause-button', () => { config.isPaused = true; });
    bindClick('#continue-button', () => { config.isPaused = false; });
    bindClick('#reset-button', () => {
        for (let i = 0; i < config.bodies.length; i++) {
            config.bodies[i].position = {...bodies[i].position };
            config.bodies[i].velocity = {...bodies[i].velocity };
            config.bodies[i].mass = bodies[i].mass;
        }
        syncUi();
    });

    document.querySelector('#field-borders').addEventListener('change', (e) => {
        config.fieldBorders = e.target.checked;
    });

    syncUi();
}