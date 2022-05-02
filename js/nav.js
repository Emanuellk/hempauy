/* nav efecto movil */
let icon_menu = document.getElementById('icon-menu');
let ul_nav = document.getElementById('ul__nav');
icon_menu.addEventListener('click', () => {
    ul_nav.classList.toggle('show');
});