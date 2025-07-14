// This chatbot is simulated for client-side demo purposes.
// For a real AI chatbot (Gemini/ChatGPT), you MUST use a backend server
// to handle API keys and make requests, then send responses to the client.

const chatbotWidget = document.getElementById('chatbot-widget');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSendBtn = document.getElementById('chatbot-send-btn');

let conversationHistory = []; // To store chat messages (for mock purposes)

// Function to toggle chatbot visibility
function toggleChatbot() {
    chatbotWidget.classList.toggle('chatbot-closed');
    // Scroll to bottom when opening and focus input
    if (!chatbotWidget.classList.contains('chatbot-closed')) {
        setTimeout(() => {
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            chatbotInput.focus();
        }, 300); // Small delay for smooth transition
    }
}

// Function to display messages in the chat window
function displayMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = message;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto scroll to bottom
}

// Function to get translated messages for chatbot
function getChatbotTranslation(key) {
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';
    const translations = {
        en: {
            thinking: "Thinking...",
            botGreeting: "Hi there! I'm SMAfinity Bot. How can I assist you today?",
            gamesQuery: "Our games section features SMACRAFT and SMA ROYAL BATTLE. More are coming soon!",
            appsQuery: "Check out our innovative apps like Calendar Beta Pro and Plus versions. Designed for your productivity!",
            labQuery: "The SMAfinity AI Lab is a secure area for managing and updating our projects with advanced AI.",
            updateQuery: "Updates are handled securely through the SMAfinity AI Lab. It's a cutting-edge system!",
            helloGreeting: "Hello there! Glad to see you. What's on your mind?",
            howAreYou: "I'm doing great, thanks for asking! Always ready to help.",
            thankYou: "You're most welcome! Is there anything else I can help with?"
        },
        hi: {
            thinking: "सोच रहा हूँ...",
            botGreeting: "नमस्ते! मैं स्माफिनिटी बॉट हूँ। आज मैं आपकी कैसे सहायता कर सकता हूँ?",
            gamesQuery: "हमारे गेम्स सेक्शन में स्माक्राफ्ट और स्मा रॉयल बैटल जैसे रोमांचक शीर्षक हैं। और भी जल्द आ रहे हैं!",
            appsQuery: "हमारे इनोवेटिव ऐप्स जैसे कैलेंडर बीटा प्रो और प्लस वर्जन देखें। ये आपकी उत्पादकता के लिए डिज़ाइन किए गए हैं!",
            labQuery: "स्माफिनिटी एआई लैब एक सुरक्षित क्षेत्र है जहाँ उन्नत एआई के साथ हमारे प्रोजेक्ट्स का प्रबंधन और अपडेट किया जाता है।",
            updateQuery: "अपडेट स्माफिनिटी एआई लैब के माध्यम से सुरक्षित रूप से संभाले जाते हैं। यह एक अत्याधुनिक प्रणाली है!",
            helloGreeting: "नमस्ते! आपको देखकर खुशी हुई। क्या चल रहा है?",
            howAreYou: "मैं ठीक हूँ, पूछने के लिए धन्यवाद! हमेशा मदद के लिए तैयार।",
            thankYou: "आपका बहुत स्वागत है! क्या मैं और कुछ मदद कर सकता हूँ?"
        }
    };
    return translations[currentLang][key] || translations['en'][key];
}

// Function to send user message and get a simulated bot response
async function sendChatMessage() {
    const userMessage = chatbotInput.value.trim();
    if (!userMessage) return;

    displayMessage(userMessage, 'user');
    conversationHistory.push({ role: 'user', content: userMessage });
    chatbotInput.value = '';

    displayMessage(getChatbotTranslation('thinking'), 'bot'); // Show thinking message

    setTimeout(() => {
        // Remove "Thinking..." message
        if (chatbotMessages.lastChild && chatbotMessages.lastChild.textContent === getChatbotTranslation('thinking')) {
            chatbotMessages.lastChild.remove();
        }

        let botResponse = getChatbotTranslation('botGreeting');

        const lowerCaseMessage = userMessage.toLowerCase();

        if (lowerCaseMessage.includes("game") || lowerCaseMessage.includes("games") || lowerCaseMessage.includes("smacraft") || lowerCaseMessage.includes("royal battle")) {
            botResponse = getChatbotTranslation('gamesQuery');
        } else if (lowerCaseMessage.includes("app") || lowerCaseMessage.includes("apps") || lowerCaseMessage.includes("calendar")) {
            botResponse = getChatbotTranslation('appsQuery');
        } else if (lowerCaseMessage.includes("lab") || lowerCaseMessage.includes("ai")) {
            botResponse = getChatbotTranslation('labQuery');
        } else if (lowerCaseMessage.includes("update")) {
            botResponse = getChatbotTranslation('updateQuery');
        } else if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi") || lowerCaseMessage.includes("hey")) {
            botResponse = getChatbotTranslation('helloGreeting');
        } else if (lowerCaseMessage.includes("how are you")) {
            botResponse = getChatbotTranslation('howAreYou');
        } else if (lowerCaseMessage.includes("thank") || lowerCaseMessage.includes("thanks")) {
            botResponse = getChatbotTranslation('thankYou');
        }
        
        displayMessage(botResponse, 'bot');
        conversationHistory.push({ role: 'bot', content: botResponse });

    }, 1500); // Simulate network delay
}

// Event listeners for sending messages
chatbotSendBtn.addEventListener('click', sendChatMessage);
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
});

// Initial bot greeting message when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Only display initial greeting if chatbot messages are empty
    if (chatbotMessages.children.length === 0) {
        displayMessage(getChatbotTranslation('botGreeting'), 'bot');
    }
});

// Expose toggleChatbot to the global window object so HTML's onclick can access it
window.toggleChatbot = toggleChatbot;

      
