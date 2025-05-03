// NAVBAR HAMBURGER MOBILE TOGGLE
function toggleNavBar() {
    const navLinks = document.querySelector('#Navlinks_Container');
    navLinks.classList.toggle('open');
}

document.addEventListener('click', function(event) {
    const navLinksContainer = document.querySelector('#Navlinks_Container');
    const navToggle = document.querySelector('.nav-toggle');

    if (!navLinksContainer.contains(event.target) && !navToggle.contains(event.target)) {
        navLinksContainer.classList.remove('open');
    }
});

// NAVBAR PROJECTS DROPDOWN TOGGLE
function openDropdownLinksContainer() {
    const dropdownContainer = document.querySelector('.dropdown-container');
    const caretDown = dropdownContainer.querySelector('.fa-caret-down');
    const caretUp = dropdownContainer.querySelector('.fa-caret-up');

    dropdownContainer.classList.toggle('open');

    if (dropdownContainer.classList.contains('open')) {
        caretDown.classList.add('display-none');
        caretUp.classList.remove('display-none');
    }
    else {
        caretDown.classList.remove('display-none');
        caretUp.classList.add('display-none');
    }
}

document.addEventListener('click', function(event) {
    const dropdownContainer = document.querySelector('.dropdown-container');
    const caretDown = dropdownContainer.querySelector('.fa-caret-down');
    const caretUp = dropdownContainer.querySelector('.fa-caret-up');

    if (!dropdownContainer.contains(event.target)) {
        dropdownContainer.classList.remove('open');
        caretDown.classList.remove('display-none');
        caretUp.classList.add('display-none');
    }
});

