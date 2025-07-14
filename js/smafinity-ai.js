// This file contains the client-side logic for the SMAfinity AI interface within the Lab Modal.
// The core AI interaction (like calling ChatGPT/Gemini) and actual game/app updates
// would typically happen on a secure backend server to protect API keys and modify actual files.
// For this demo, we will SIMULATE the AI's responses and actions.

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('lab-ai-interface')) {
        // Only run this script if we are on the lab page and AI interface exists
        return;
    }

    const aiCommandInput = document.getElementById('aiCommandInput');
    const aiSendCommandBtn = document.getElementById('aiSendCommand');
    const aiUndoBtn = document.getElementById('aiUndoBtn');
    const aiRedoBtn = document.getElementById('aiRedoBtn');
    const aiOutputConsole = document.getElementById('aiOutputConsole');
    const assetUploadInput = document.getElementById('assetUploadInput');
    const uploadAssetsBtn = document.getElementById('uploadAssetsBtn');
    const assetPreview = document.getElementById('assetPreview');

    let commandHistory = []; // Stores a list of executed commands for undo/redo
    let historyPointer = -1; // Pointer to the current position in commandHistory

    // Function to get translated messages for AI Lab
    function getAILabTranslation(key) {
        const currentLang = localStorage.getItem('selectedLanguage') || 'en';
        const translations = {
            en: {
                aiConsoleReady: "SMAfinity AI Console Ready. Awaiting commands...",
                enterCommand: "Please enter a command to execute.",
                logUserCommand: "USER COMMAND:",
                logError: "ERROR:",
                logSuccess: "SUCCESS:",
                logInfo: "AI LOG:",
                commandProcessing: "Processing your command... (Simulation)",
                smacraftUpdateSuccess: "Successfully created and integrated 'Shadow Lurker' into SMACRAFT Level 3. Game update in progress...",
                smaroyalUpdateSuccess: "SMA ROYAL BATTLE character 'Player_01' movement speed adjusted globally. Please perform in-game testing.",
                calendarProUpdateSuccess: "Calendar β Pro: AI-driven task prioritization algorithm updated. Deploying new version...",
                calendarPlusUpdateSuccess: "Calendar β Plus: UI theme 'Ocean Breeze' applied. Deploying new version...",
                generateAssetInfo: "AI initiated asset generation for your request. Stand by...",
                assetGeneratedSuccess: "Asset 'Cyber_Blade_FX.png' generated and stored. Ready for deployment!",
                deletionRestricted: "Security Protocol Engaged: Deletion of core game/app files is restricted. Action denied.",
                performanceOptimizeSuccess: "Running performance optimization algorithms across current project assets. Expect minor improvements.",
                genericAIResponse: "AI received \"{command}\". Simulating advanced AI-driven game/app update logic. This would involve real-time code/asset manipulation.",
                noFilesSelected: "No files selected for upload.",
                uploadInitiated: "Initiating upload of {count} asset(s)...",
                uploadSuccess: "Assets uploaded and processed by AI. Ready for integration into games/apps!",
                assetPreviewPlaceholder: "Uploaded assets will appear here...",
                undoCommand: "Undoing last command: \"{command}\". (Simulation: A real undo would revert project state)",
                redoCommand: "Redoing command: \"{command}\". (Simulation: A real redo would re-apply project state)"
            },
            hi: {
                aiConsoleReady: "स्माफिनिटी एआई कंसोल तैयार है। कमांड का इंतजार है...",
                enterCommand: "कृपया निष्पादित करने के लिए एक कमांड दर्ज करें।",
                logUserCommand: "उपयोगकर्ता कमांड:",
                logError: "त्रुटि:",
                logSuccess: "सफलता:",
                logInfo: "एआई लॉग:",
                commandProcessing: "आपके कमांड को प्रोसेस कर रहा हूँ... (सिमुलेशन)",
                smacraftUpdateSuccess: "स्म्राक्राफ्ट लेवल 3 में 'शैडो लर्कर' सफलतापूर्वक बनाया और एकीकृत किया गया। गेम अपडेट प्रगति पर है...",
                smaroyalUpdateSuccess: "स्मा रॉयल बैटल कैरेक्टर 'प्लेयर_01' की गति वैश्विक स्तर पर समायोजित की गई। कृपया इन-गेम परीक्षण करें।",
                calendarProUpdateSuccess: "कैलेंडर β प्रो: एआई-संचालित कार्य प्राथमिकता एल्गोरिथम अपडेट किया गया। नया संस्करण डिप्लॉय कर रहा हूँ...",
                calendarPlusUpdateSuccess: "कैलेंडर β प्लस: यूआई थीम 'ओशन ब्रीज' लागू की गई। नया संस्करण डिप्लॉय कर रहा हूँ...",
                generateAssetInfo: "एआई ने आपके अनुरोध के लिए एसेट जनरेशन शुरू किया। प्रतीक्षा करें...",
                assetGeneratedSuccess: "एसेट 'साइबर_ब्लेड_एफएक्स.png' जनरेट और स्टोर किया गया। डिप्लॉयमेंट के लिए तैयार!",
                deletionRestricted: "सुरक्षा प्रोटोकॉल लागू: कोर गेम/ऐप फाइलों का विलोपन प्रतिबंधित है। कार्रवाई अस्वीकृत।",
                performanceOptimizeSuccess: "वर्तमान प्रोजेक्ट संपत्तियों में प्रदर्शन अनुकूलन एल्गोरिदम चला रहा हूँ। मामूली सुधार की उम्मीद है।",
                genericAIResponse: "एआई को \"{command}\" प्राप्त हुआ। उन्नत एआई-संचालित गेम/ऐप अपडेट लॉजिक का सिमुलेशन कर रहा हूँ। इसमें वास्तविक समय कोड/एसेट हेरफेर शामिल होगा।",
                noFilesSelected: "अपलोड के लिए कोई फाइल नहीं चुनी गई।",
                uploadInitiated: "{count} एसेट(ओं) का अपलोड शुरू कर रहा हूँ...",
                uploadSuccess: "एसेट अपलोड और एआई द्वारा प्रोसेस किए गए। गेम्स/ऐप्स में एकीकरण के लिए तैयार!",
                assetPreviewPlaceholder: "अपलोड किए गए एसेट यहां दिखाई देंगे...",
                undoCommand: "अंतिम कमांड को पूर्ववत कर रहा हूँ: \"{command}\"। (सिमुलेशन: एक वास्तविक पूर्ववत परियोजना की स्थिति को वापस कर देगा)",
                redoCommand: "कमांड को फिर से कर रहा हूँ: \"{command}\"। (सिमुलेशन: एक वास्तविक फिर से लागू करने से परियोजना की स्थिति फिर से लागू हो जाएगी)"
            }
        };
        return translations[currentLang][key] || translations['en'][key];
    }


    // Function to log messages to the AI console
    function logToConsole(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        let formattedMessage = `[${timestamp}] `;
        
        let textColor = '#add8e6'; // Default light blue for AI info
        if (type === 'error') {
            textColor = '#ff6b6b'; // Red
        } else if (type === 'success') {
            textColor = '#64ffda'; // Accent green
        } else if (type === 'user-command') {
            textColor = '#00e0ff'; // Primary blue
        }

        const logEntry = document.createElement('span');
        logEntry.textContent = formattedMessage + message + '\n';
        logEntry.style.color = textColor;
        
        aiOutputConsole.appendChild(logEntry);
        aiOutputConsole.scrollTop = aiOutputConsole.scrollHeight;
    }

    // --- AI Command Execution Simulation ---
    async function executeAICommand() {
        const command = aiCommandInput.value.trim();
        if (!command) {
            logToConsole(getAILabTranslation('enterCommand'), 'error');
            return;
        }

        logToConsole(`${getAILabTranslation('logUserCommand')} "${command}"`, 'user-command');
        aiCommandInput.value = '';

        // Add command to history for undo/redo.
        commandHistory = commandHistory.slice(0, historyPointer + 1);
        commandHistory.push(command);
        historyPointer = commandHistory.length - 1;
        updateUndoRedoButtons();

        // --- Simulate AI processing and response ---
        // REAL API CALL Placeholder:
        /*
        try {
            const response = await fetch('/api/smafinity-ai-command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: command, project: 'global', authToken: 'YOUR_AUTH_TOKEN_HERE' })
            });
            const result = await response.json();
            if (response.ok && result.status === 'success') {
                logToConsole(result.message || getAILabTranslation('commandExecutedSuccess'), 'success');
                if (result.newAssets && result.newAssets.length > 0) {
                    result.newAssets.forEach(assetUrl => {
                        const img = document.createElement('img');
                        img.src = assetUrl;
                        img.alt = 'AI Generated Asset';
                        assetPreview.innerHTML = assetPreview.getAttribute('data-translate'); // Clear placeholder text with translated placeholder
                        assetPreview.appendChild(img);
                    });
                }
            } else {
                logToConsole(result.message || getAILabTranslation('aiCommandFailed'), 'error');
            }
        } catch (error) {
            logToConsole(`${getAILabTranslation('logError')} Network or API Error: ${error.message}. Is your backend running?`, 'error');
        }
        */

        // --- MOCK AI RESPONSE (for client-side demo) ---
        logToConsole(getAILabTranslation('commandProcessing'), 'info'); // Initial processing message
        setTimeout(() => {
            let aiResponse = "";
            let responseType = 'info';
            const lowerCaseCommand = command.toLowerCase();

            if (lowerCaseCommand.includes("add new enemy") && lowerCaseCommand.includes("smacraft")) {
                aiResponse = getAILabTranslation('smacraftUpdateSuccess');
                responseType = 'success';
            } else if (lowerCaseCommand.includes("change character speed") && lowerCaseCommand.includes("sma royal battle")) {
                aiResponse = getAILabTranslation('smaroyalUpdateSuccess');
                responseType = 'success';
            } else if (lowerCaseCommand.includes("update") && lowerCaseCommand.includes("calendar b pro")) {
                aiResponse = getAILabTranslation('calendarProUpdateSuccess');
                responseType = 'success';
            } else if (lowerCaseCommand.includes("update") && lowerCaseCommand.includes("calendar b plus")) {
                aiResponse = getAILabTranslation('calendarPlusUpdateSuccess');
                responseType = 'success';
            } else if (lowerCaseCommand.includes("generate asset")) {
                aiResponse = getAILabTranslation('generateAssetInfo');
                responseType = 'info';
                setTimeout(() => {
                    aiResponse = getAILabTranslation('assetGeneratedSuccess');
                    responseType = 'success';
                    logToConsole(aiResponse, responseType);
                    const img = document.createElement('img');
                    img.src = 'https://via.placeholder.com/100x100/00e0ff/0a192f?text=AI_ASSET'; // Techy placeholder image
                    img.alt = 'AI Generated Asset';
                    assetPreview.innerHTML = ''; // Clear placeholder text
                    assetPreview.appendChild(img);
                }, 2500);
                return;
            } else if (lowerCaseCommand.includes("delete level") || lowerCaseCommand.includes("delete app")) {
                aiResponse = getAILabTranslation('deletionRestricted');
                responseType = 'error';
            } else if (lowerCaseCommand.includes("optimize performance")) {
                aiResponse = getAILabTranslation('performanceOptimizeSuccess');
                responseType = 'success';
            } else {
                aiResponse = getAILabTranslation('genericAIResponse').replace('{command}', command);
                responseType = 'info';
            }
            logToConsole(aiResponse, responseType);
        }, 1500); // Simulate AI processing time
    }

    aiSendCommandBtn.addEventListener('click', executeAICommand);
    aiCommandInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            executeAICommand();
        }
    });

    // --- Undo/Redo Functionality (Client-side simulation) ---
    function updateUndoRedoButtons() {
        aiUndoBtn.disabled = historyPointer < 0;
        aiRedoBtn.disabled = historyPointer >= commandHistory.length - 1;
    }

    aiUndoBtn.addEventListener('click', () => {
        if (historyPointer >= 0) {
            const undoneCommand = commandHistory[historyPointer];
            logToConsole(getAILabTranslation('undoCommand').replace('{command}', undoneCommand), 'info');
            historyPointer--;
            updateUndoRedoButtons();
            // Optionally: aiCommandInput.value = commandHistory[historyPointer] || '';
        }
    });

    aiRedoBtn.addEventListener('click', () => {
        if (historyPointer < commandHistory.length - 1) {
            historyPointer++;
            const redoneCommand = commandHistory[historyPointer];
            logToConsole(getAILabTranslation('redoCommand').replace('{command}', redoneCommand), 'info');
            updateUndoRedoButtons();
            // Optionally: aiCommandInput.value = commandHistory[historyPointer] || '';
        }
    });

    // --- Asset Upload/Management Simulation ---
    uploadAssetsBtn.addEventListener('click', () => {
        if (assetUploadInput.files.length === 0) {
            logToConsole(getAILabTranslation('noFilesSelected'), 'error');
            return;
        }

        logToConsole(getAILabTranslation('uploadInitiated').replace('{count}', assetUploadInput.files.length), 'info');
        assetPreview.innerHTML = ''; // Clear any previous preview or placeholder text

        // Display selected files as previews
        Array.from(assetUploadInput.files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = file.name;
                    assetPreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            } else {
                const fileDiv = document.createElement('div');
                fileDiv.textContent = file.name;
                fileDiv.style.color = '#8892b0';
                fileDiv.style.fontSize = '0.9rem';
                assetPreview.appendChild(fileDiv);
            }
        });

        setTimeout(() => {
            logToConsole(getAILabTranslation('uploadSuccess'), 'success');
            assetUploadInput.value = '';
        }, 2000);
    });

    // Initial state setup
    updateUndoRedoButtons();
    // Set initial placeholder if empty
    if (aiOutputConsole.textContent.trim() === '') {
        aiOutputConsole.textContent = getAILabTranslation('aiConsoleReady');
    }
});
