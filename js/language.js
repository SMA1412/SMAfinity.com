// Language management logic

const languageSwitcher = document.getElementById('language-switcher');
let translations = {}; // This will hold all loaded translations

// Function to load translations from JSON files
async function loadTranslations(lang) {
    try {
        const response = await fetch(`assets/translations/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translation for ${lang}`);
        }
        translations = await response.json();
        applyTranslations();
        // Update placeholders which have data-translate-placeholder attribute
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (translations[key]) {
                element.placeholder = translations[key];
            }
        });
        // Special handling for the AI Console Ready message if on lab page
        const aiConsole = document.getElementById('aiOutputConsole');
        if (aiConsole && aiConsole.getAttribute('data-translate') === 'aiConsoleReady') {
            aiConsole.textContent = translations['aiConsoleReady'];
        }
        // Re-initialize chatbot message after language change
        if (typeof displayMessage === 'function' && typeof getChatbotTranslation === 'function') {
            const chatbotMessagesDiv = document.getElementById('chatbot-messages');
            if (chatbotMessagesDiv) {
                // Clear existing messages and display new greeting
                chatbotMessagesDiv.innerHTML = '';
                displayMessage(getChatbotTranslation('botGreeting'), 'bot');
            }
        }
        // Re-translate game/app details if their modals are open (or data is loaded)
        if (typeof gamesData !== 'undefined' && typeof appDetailsModal !== 'undefined' && appDetailsModal.style.display === 'flex') {
            // Re-apply translation for current open modal if applicable
            // This would require storing the current open game/app ID and re-populating the modal
            // For simplicity, it might just update on next modal open or refresh.
            // More complex: if (currentOpenGameId) populateGameDetails(currentOpenGameId, lang);
        }

    } catch (error) {
        console.error("Error loading translations:", error);
    }
}

// Function to apply translations to elements
function applyTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
}

// Event listener for language switcher
languageSwitcher.addEventListener('change', (event) => {
    const selectedLang = event.target.value;
    localStorage.setItem('selectedLanguage', selectedLang); // Save preference
    loadTranslations(selectedLang);
});

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en'; // Default to English
    languageSwitcher.value = savedLang; // Set dropdown to saved language
    loadTranslations(savedLang); // Load and apply translations
});

