export default function initUI(config, startConfig) {
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

    const bodyNames = ['first', 'second', 'third'];

    const syncUi = () => {
        document.querySelector('#input-g').value = config.G;
        document.querySelector('#input-dt').value = config.dt;
        document.querySelector('#input-timeSpeed').value = config.timeSpeed;
        document.querySelector('#trail-length').value = config.trailLength;

        bodyNames.forEach((name, index) => {
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

    bodyNames.forEach((name, index) => {
        bindFloatInput(`#input-${name}BodyMass`, val => config.bodies[index].mass = val);
        bindFloatInput(`#input-${name}BodyPositionX`, val => config.bodies[index].position.x = val);
        bindFloatInput(`#input-${name}BodyPositionY`, val => config.bodies[index].position.y = val);
        bindFloatInput(`#input-${name}BodyVelocityX`, val => config.bodies[index].velocity.x = val);
        bindFloatInput(`#input-${name}BodyVelocityY`, val => config.bodies[index].velocity.y = val);
    });

    bindClick('#pause-continue-button', () => {
        if (!config.isPaused) {
            config.isPaused = true;
            document.querySelector('#pause-continue-button').textContent = "Продолжить";
        } else {
            config.isPaused = false;
            document.querySelector('#pause-continue-button').textContent = "Пауза";
        }
    });

    bindClick('#reset-config-button', () => {
        config.bodies.forEach((body, index) => {
            body.mass = startConfig.bodies[index].mass;
            body.position.x = startConfig.bodies[index].position.x;
            body.position.y = startConfig.bodies[index].position.y;
            body.velocity.x = startConfig.bodies[index].velocity.x;
            body.velocity.y = startConfig.bodies[index].velocity.y;
        });
        config.G = startConfig.G;
        config.dt = startConfig.dt;
        config.timeSpeed = startConfig.timeSpeed;
        config.fieldBorders = startConfig.fieldBorders;

        syncUi();
    });

    bindClick('#reset-button', () => {
        config.bodies.forEach((body, index) => {
            const name = bodyNames[index];

            const mass = parseFloat(document.querySelector(`#input-${name}BodyMass`).value);
            const positionX = parseFloat(document.querySelector(`#input-${name}BodyPositionX`).value);
            const positionY = parseFloat(document.querySelector(`#input-${name}BodyPositionY`).value);
            const velocityX = parseFloat(document.querySelector(`#input-${name}BodyVelocityX`).value);
            const velocityY = parseFloat(document.querySelector(`#input-${name}BodyVelocityY`).value);

            body.mass = isNaN(mass) ? body.mass : mass;
            body.position.x = isNaN(positionX) ? body.position.x : positionX;
            body.position.y = isNaN(positionY) ? body.position.y : positionY;
            body.velocity.x = isNaN(velocityX) ? body.velocity.x : velocityX;
            body.velocity.y = isNaN(velocityY) ? body.velocity.y : velocityY;
        });
    });

    document.querySelector('#field-borders').addEventListener('change', (e) => {
        config.fieldBorders = e.target.checked;
    });

    document.querySelector('#trail-length').addEventListener('input', (e) => {
        config.trailLength = parseInt(e.target.value)

        config.bodies.forEach(body => {
            if (body.displaying) {
                body.displaying.trailLength = config.trailLength;
            }
        })
    });

    syncUi();
}