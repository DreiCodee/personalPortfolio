const links = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('.tab-section');
const wrapper = document.querySelector('.content-wrapper');

links.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);

        sections.forEach(section => section.classList.remove('active'));

        void target.offsetWidth;

        target.classList.add('active');

        wrapper.classList.add('revealed');
    });
});

// nothing shown by default — page starts empty until a button is clicked

const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', function() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }
});