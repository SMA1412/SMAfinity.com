document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            // Handle case where target is just '#' for home
            const targetElement = targetId === '#' ? document.getElementById('home') : document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lab Access Modal Logic
    const labModal = document.getElementById('labModal');
    const accessLabBtn = document.getElementById('accessLabBtn');
    const closeModalBtn = labModal.querySelector('.close-button');
    const labAccessScreen = document.getElementById('lab-access-screen');
    const labAiInterface = document.getElementById('lab-ai-interface');
    const passwordInput = document.getElementById('passwordInput');
    const visualKeyboard = document.getElementById('visualKeyboard');

    const CORRECT_PASSWORD = 'Sma@finity@1412';
    let typedPassword = ''; // Stores the characters typed by the user

    // Function to generate visual keyboard (only for mobile)
    function generateVisualKeyboard() {
        visualKeyboard.innerHTML = ''; // Clear existing
        // All possible characters in the password + common keyboard keys
        const keys = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
            'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
            'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
            'z', 'x', 'c', 'v', 'b', 'n', 'm',
            '@', 'Backspace', 'Enter'
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

    // Function to handle password input from visual or physical keyboard
    function handlePasswordInput(key) {
        if (key === 'Backspace') {
            typedPassword = typedPassword.slice(0, -1);
        } else if (key === 'Enter') {
            checkPassword();
        } else if (key.length === 1) { // Only add single characters
            typedPassword += key;
        }
        // IMPORTANT: No visual feedback is given to the user for typedPassword
        // This is for security as requested.
        // For debugging, you can use: console.log("Current typed:", typedPassword);
    }

    function checkPassword() {
        if (typedPassword === CORRECT_PASSWORD) {
            console.log("Password Correct! Opening AI Lab."); // For dev console
            labAccessScreen.classList.add('hidden'); // Hide access screen
            labAiInterface.classList.remove('hidden'); // Show AI interface
            typedPassword = ''; // Reset password buffer
        } else {
            console.log("Password Incorrect. No feedback given."); // For dev console
            typedPassword = ''; // Reset on incorrect attempt
            // No visual feedback (error message, shake, etc.) is given to the user, as requested.
        }
    }

    // Event listener for physical keyboard input (for PC users)
    // Listens on the document because the input field is effectively hidden
    document.addEventListener('keydown', (e) => {
        // Only process if the modal is open and lab access screen is visible
        if (labModal.style.display === 'flex' && !labAccessScreen.classList.contains('hidden')) {
            handlePasswordInput(e.key); // Pass the key directly
            e.preventDefault(); // Prevent default browser actions (like backspace navigating back)
        }
    });

    // Open Lab Modal button click handler
    accessLabBtn.addEventListener('click', () => {
        labModal.style.display = 'flex'; // Show modal
        labAccessScreen.classList.remove('hidden'); // Ensure access screen is visible
        labAiInterface.classList.add('hidden'); // Ensure AI interface is hidden
        typedPassword = ''; // Clear any previous typed password

        // Check if it's a mobile device to show visual keyboard
        // A simple check: if window width is small enough or if touch events are supported
        if (window.innerWidth <= 768 || ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
            generateVisualKeyboard();
            visualKeyboard.style.display = 'grid'; // Show it
        } else {
            visualKeyboard.style.display = 'none'; // Hide it on larger screens (PC)
        }
        
        // For accessibility and physical keyboard input, focus the (hidden) input field
        passwordInput.focus();
    });

    // Close Modal button click handler
    closeModalBtn.addEventListener('click', () => {
        labModal.style.display = 'none';
        typedPassword = ''; // Clear password on close
        passwordInput.blur(); // Remove focus from the hidden input
    });

    // Close Modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === labModal) {
            labModal.style.display = 'none';
            typedPassword = ''; // Clear password on outside click
            passwordInput.blur(); // Remove focus
        }
    });

    // Initial placeholder for asset preview console
    const assetPreview = document.getElementById('assetPreview');
    if (assetPreview.innerHTML.trim() === '') {
        assetPreview.textContent = 'Uploaded assets will appear here...';
    }
});
