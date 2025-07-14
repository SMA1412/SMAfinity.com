document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links within the same page (e.g., #home, #games sections)
    // Note: Links to different HTML pages (games.html, apps.html) are handled by browser's default behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // Only handle smooth scroll for internal section links on the *current* page
            if (targetId.includes('#') && document.querySelector(targetId)) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Highlight active navigation link based on current page
    const currentPath = window.location.pathname.split('/').pop(); // e.g., "index.html", "games.html"
    document.querySelectorAll('.navbar nav ul li a').forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Lab Page specific logic: Password input and modal handling
    if (document.getElementById('lab-access-screen')) { // Only run this if on lab.html
        const labAccessScreen = document.getElementById('lab-access-screen');
        const labAiInterface = document.getElementById('lab-ai-interface');
        const passwordInput = document.getElementById('passwordInput');
        const visualKeyboard = document.getElementById('visualKeyboard');
        const passwordDisplay = document.getElementById('passwordDisplay');
        const errorMessage = document.getElementById('error-message');

        const CORRECT_PASSWORD = 'Sma@finity@1412';
        let typedPassword = ''; // Stores the characters typed by the user

        // Function to generate visual keyboard (only for mobile)
        function generateVisualKeyboard() {
            visualKeyboard.innerHTML = '';
            // Characters likely to be in password: S, m, a, @, f, i, n, i, t, y, 1, 4, 1, 2
            // For a robust visual keyboard, you might need more keys or a full QWERTY simulation.
            // For simplicity, let's include numbers and common special chars needed for YOUR password
            const keys = [
                '1', '2', '3',
                '4', '5', '6',
                '7', '8', '9',
                '0', '@', '.',
                'S', 'm', 'a',
                'f', 'i', 'n',
                't', 'y', '-',
                'Backspace', 'Enter'
            ];

            keys.forEach(key => {
                const button = document.createElement('button');
                button.textContent = key;
                button.className = 'key-btn';
                if (key === 'Backspace') {
                    button.classList.add('delete-key');
                } else if (key === 'Enter') {
                    button.classList.add('enter-key');
                }
                button.addEventListener('click', () => handlePasswordInput(key));
                visualKeyboard.appendChild(button);
            });
        }

        // Function to update the visual password display (dots/stars)
        function updatePasswordDisplay() {
            passwordDisplay.textContent = '*'.repeat(typedPassword.length);
        }

        // Function to handle password input from visual or physical keyboard
        function handlePasswordInput(key) {
            errorMessage.classList.add('hidden'); // Hide error message on new input

            if (key === 'Backspace') {
                typedPassword = typedPassword.slice(0, -1);
            } else if (key === 'Enter') {
                checkPassword();
            } else if (key.length === 1) { // Only add single characters
                typedPassword += key;
            }
            updatePasswordDisplay();
        }

        function checkPassword() {
            if (typedPassword === CORRECT_PASSWORD) {
                console.log("Password Correct! Opening AI Lab."); // For dev console
                labAccessScreen.classList.add('hidden'); // Hide access screen
                labAiInterface.classList.remove('hidden'); // Show AI interface
                typedPassword = ''; // Reset password buffer
                passwordDisplay.textContent = ''; // Clear display
            } else {
                console.log("Password Incorrect. Displaying error."); // For dev console
                errorMessage.classList.remove('hidden'); // Show error message
                typedPassword = ''; // Reset on incorrect attempt
                passwordDisplay.textContent = ''; // Clear display for new attempt
            }
        }

        // Event listener for physical keyboard input (for PC users)
        document.addEventListener('keydown', (e) => {
            // Only process if lab access screen is visible
            if (!labAccessScreen.classList.contains('hidden')) {
                // Ensure only allowed characters are processed if needed, for more security
                handlePasswordInput(e.key);
                e.preventDefault(); // Prevent default browser actions for relevant keys
            }
        });

        // Initialize password display and visual keyboard on page load
        updatePasswordDisplay();
        // Check if it's a mobile device to show visual keyboard
        if (window.innerWidth <= 768 || ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
            generateVisualKeyboard();
            visualKeyboard.style.display = 'grid'; // Show it
        } else {
            visualKeyboard.style.display = 'none'; // Hide it on larger screens (PC)
        }
        
        // Focus the hidden input field for physical keyboard users
        passwordInput.focus();
    }
});
