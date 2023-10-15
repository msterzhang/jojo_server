if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage))) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}