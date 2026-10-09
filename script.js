const nav = document.querySelector('.tabs');
const tabs = Array.from(nav.querySelectorAll('a'));
const sections = Array.from(document.querySelectorAll('.tab-section'));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const LEAVE_MS = 240;

// Sliding glass pill behind the active tab
const pill = document.createElement('span');
pill.className = 'tab-pill';
pill.setAttribute('aria-hidden', 'true');
nav.prepend(pill);

function movePill(animate = true) {
    const active = tabs.find(t => t.getAttribute('aria-selected') === 'true');
    if (!active) return;
    if (!animate) pill.style.transition = 'none';
    pill.style.width = active.offsetWidth + 'px';
    pill.style.height = active.offsetHeight + 'px';
    pill.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
    if (!animate) {
        void pill.offsetWidth;
        pill.style.transition = '';
    }
}

let currentId = null;
let swapTimer = null;

function showSection(id, { updateHash = true, focusTab = false, instant = false } = {}) {
    const target = document.getElementById(id);
    if (!target || !target.classList.contains('tab-section')) return;

    tabs.forEach(tab => {
        const isActive = tab.getAttribute('href') === '#' + id;
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
        if (isActive && focusTab) tab.focus();
    });
    movePill(!instant);

    if (updateHash) history.replaceState(null, '', '#' + id);
    if (id === currentId) return;

    const current = sections.find(s => !s.hidden);
    clearTimeout(swapTimer);

    const swap = () => {
        sections.forEach(s => {
            s.hidden = s !== target;
            s.classList.remove('leaving');
        });
        currentId = id;
    };

    if (instant || reduceMotion || !current) {
        swap();
    } else {
        // Old section fades out first, then the new one rises in
        current.classList.add('leaving');
        swapTimer = setTimeout(swap, LEAVE_MS);
    }
}

tabs.forEach((tab, index) => {
    tab.addEventListener('click', event => {
        event.preventDefault();
        showSection(tab.getAttribute('href').substring(1));
    });

    // Arrow keys move between tabs
    tab.addEventListener('keydown', event => {
        let next = null;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (next === null) return;
        event.preventDefault();
        showSection(tabs[next].getAttribute('href').substring(1), { focusTab: true });
    });
});

// Open the section from the URL if there is one, otherwise start on About
const startId = location.hash.substring(1);
showSection(document.getElementById(startId) ? startId : 'about', { updateHash: false, instant: true });

window.addEventListener('hashchange', () => {
    const id = location.hash.substring(1);
    if (document.getElementById(id)) showSection(id, { updateHash: false });
});

// Keep the pill lined up when the layout shifts
window.addEventListener('resize', () => movePill(false));
window.addEventListener('load', () => movePill(false));
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => movePill(false));

// Light that follows the pointer on glass surfaces
document.querySelectorAll('.glass, .card').forEach(el => {
    el.addEventListener('pointermove', event => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', (event.clientX - rect.left) + 'px');
        el.style.setProperty('--my', (event.clientY - rect.top) + 'px');
    });
});

document.getElementById('year').textContent = new Date().getFullYear();