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
