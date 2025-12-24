// This script runs before React hydration to prevent flash of incorrect theme
(function () {
    const theme = localStorage.getItem('theme');
    const isDark = theme === 'dark' ||
        (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
})();
