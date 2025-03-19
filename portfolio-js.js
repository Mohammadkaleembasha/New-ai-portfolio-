// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Make sections visible on load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll("section").forEach(section => {
        setTimeout(() => {
            section.style.opacity = 1;
            section.style.transform = "translateY(0px)";
        }, 200);
    });
});

// Scroll Animation
window.addEventListener('scroll', () => {
    let sections = document.querySelectorAll("section");
    let scrollPos = window.scrollY + window.innerHeight / 1.5;
    sections.forEach(section => {
        if (scrollPos > section.offsetTop) {
            section.style.opacity = 1;
            section.style.transform = "translateY(0px)";
        }
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});