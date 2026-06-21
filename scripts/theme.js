const THEME_STORAGE_KEY = 'theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';
const DEFAULT_THEME = DARK_THEME;

const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

const savedTheme = 
    storedTheme === DARK_THEME || storedTheme === LIGHT_THEME 
        ? storedTheme
        : DEFAULT_THEME;

document.documentElement.dataset.theme = savedTheme;

function switchTheme() {
    const currentTheme = document.documentElement.dataset.theme;

    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;

    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);

    updateThemeButton(newTheme);

    window.dispatchEvent(new CustomEvent('themechange', {
        detail: {
            theme: newTheme
        }
    }));
}

function updateThemeButton(theme) {
    const themeButton = document.querySelector('.theme-switch');

    const isDark = theme === DARK_THEME;

    themeButton.textContent = isDark ? '☀' : '☾';
    themeButton.setAttribute(
        'aria-label',
        isDark 
        ? 'Включить светлую тему'
        : 'Включить тёмную тему'
    );

    themeButton.title = themeButton.getAttribute('aria-label');
}

function connectThemeButton() {
    const themeButton = document.querySelector('.theme-switch');

    themeButton.addEventListener('click', switchTheme);

    updateThemeButton(document.documentElement.dataset.theme);
}

document.addEventListener(
    'DOMContentLoaded',
    connectThemeButton
);