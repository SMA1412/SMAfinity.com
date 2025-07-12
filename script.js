document.addEventListener('DOMContentLoaded', function() {
    // --- Responsive Navigation Menu Logic ---
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Optional: Close mobile menu when a navigation link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });


    // --- Chatbot UI Logic ---
    const chatbotBubble = document.getElementById('chatbot-bubble');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
    const chatbotBody = document.querySelector('.chatbot-body');

    if (chatbotBubble && chatbotWindow && chatbotCloseBtn && chatbotInput && chatbotSendBtn && chatbotBody) {
        // Toggle chatbot window visibility
        chatbotBubble.addEventListener('click', function() {
            chatbotWindow.classList.toggle('active');
            // Disable input/send for now as AI backend is not connected
            chatbotInput.disabled = true; 
            chatbotSendBtn.disabled = true;
            // Scroll to bottom if opened
            if (chatbotWindow.classList.contains('active')) {
                chatbotBody.scrollTop = chatbotBody.scrollHeight;
            }
        });

        // Close chatbot window
        chatbotCloseBtn.addEventListener('click', function() {
            chatbotWindow.classList.remove('active');
        });

        // Placeholder for sending message (currently does nothing)
        chatbotSendBtn.addEventListener('click', function() {
            const message = chatbotInput.value.trim();
            if (message) {
                // Display user message (for demonstration)
                // const userMsgDiv = document.createElement('p');
                // userMsgDiv.className = 'user-message';
                // userMsgDiv.textContent = message;
                // chatbotBody.appendChild(userMsgDiv);
                
                chatbotInput.value = ''; // Clear input
                chatbotBody.scrollTop = chatbotBody.scrollHeight; // Scroll to bottom

                // IMPORTANT: Real AI integration would go here.
                // For now, these buttons are disabled.
            }
        });

        // Allow sending with Enter key (if input was enabled)
        chatbotInput.addEventListener('keypress', function(event) {
            // if (event.key === 'Enter' && !chatbotInput.disabled) {
            //     chatbotSendBtn.click();
            // }
        });

        // --- IMPORTANT NOTE FOR CHATBOT ---
        // Bhai, abhi yeh chatbot sirf ek UI hai. Isme AI (jaise mera intelligence) ya koi live chat functionality nahi hai.
        // Input field aur Send button disabled hain.
        // Jab hum future mein isko advance banayenge, tab hum Firebase Cloud Functions,
        // ya kisi third-party AI API (jaise Google Gemini API) ka use karke isko "intelligent" banayenge.
        // Uske liye backend setup aur thodi complex coding ki zaroorat padegi, jo abhi hamare low-end PC aur zero-cost focus se bahar hai.
        // Par UI ready hai!
    }
});
