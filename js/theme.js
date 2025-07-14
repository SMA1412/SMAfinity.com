// Theme management logic

const themeSwitcher = document.getElementById('theme-switcher');
const body = document.body;
const sunIcon = themeSwitcher.querySelector('.fa-sun');
const moonIcon = themeSwitcher.querySelector('.fa-moon');

// Function to set theme
function setTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'inline-block';
    } else { // light theme
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
        sunIcon.style.display = 'inline-block';
        moonIcon.style.display = 'none';
    }
    localStorage.setItem('selectedTheme', theme); // Save preference
}

// Event listener for theme switcher button
themeSwitcher.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
        setTheme('light');
    } else {
        setTheme('dark');
    }
});

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('selectedTheme') || 'dark'; // Default to dark theme
    setTheme(savedTheme);
});
