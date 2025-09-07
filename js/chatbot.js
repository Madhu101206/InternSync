// AI Chatbot functionality
function initChatbot() {
    // Initialize chatbot functionality
    console.log("Chatbot initialized");
    
    // Load chat history if exists
    const chatHistory = localStorage.getItem('chatbotHistory');
    if (chatHistory) {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = chatHistory;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
}

function toggleChatbot() {
    const chatbotBody = document.getElementById('chatbot-body');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    
    if (chatbotBody.style.display === 'flex') {
        chatbotBody.style.display = 'none';
        chatbotToggle.textContent = '+';
    } else {
        chatbotBody.style.display = 'flex';
        chatbotToggle.textContent = '-';
        // Scroll to bottom when opening
        setTimeout(() => {
            const messagesContainer = document.getElementById('chatbot-messages');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }
}

function openChatbot() {
    const chatbotBody = document.getElementById('chatbot-body');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    
    chatbotBody.style.display = 'flex';
    chatbotToggle.textContent = '-';
    
    // Scroll to bottom when opening
    setTimeout(() => {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

function sendChatMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (message) {
        // Add user message
        addChatMessage(message, 'user');
        input.value = '';
        
        // Process and get response
        setTimeout(() => {
            const response = getChatbotResponse(message);
            addChatMessage(response, 'bot');
        }, 500);
    }
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `chatbot-message ${sender}-message`;
    messageElement.textContent = message;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Save to history
    localStorage.setItem('chatbotHistory', messagesContainer.innerHTML);
}

function getChatbotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Simple response logic - would be replaced with AI in production
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello! How can I help you with your internship search today?";
    } else if (lowerMessage.includes('internship') || lowerMessage.includes('opportunity')) {
        return "I can help you find internships that match your skills and interests. What field are you interested in?";
    } else if (lowerMessage.includes('technology') || lowerMessage.includes('tech') || lowerMessage.includes('software')) {
        return "We have many opportunities in technology! Are you interested in software development, data science, AI, or another specific area?";
    } else if (lowerMessage.includes('apply') || lowerMessage.includes('application')) {
        return "To apply for internships, please make sure your profile is complete in the student portal. Then you can browse and apply for matched opportunities.";
    } else if (lowerMessage.includes('status') || lowerMessage.includes('application status')) {
        return "You can check your application status in the 'Application Tracking' section of your student dashboard.";
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('qualification')) {
        return "The required skills depend on the internship. Common sought-after skills include programming, data analysis, communication, and problem-solving. What skills do you have?";
    } else if (lowerMessage.includes('stipend') || lowerMessage.includes('payment') || lowerMessage.includes('salary')) {
        return "Stipend amounts vary by organization and role. You can see the stipend information for each internship opportunity in the details.";
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return "You're welcome! Is there anything else I can help you with?";
    } else {
        return "I'm here to help you with the PM Internship Scheme. You can ask me about internships, applications, skills, or anything else related to the program.";
    }
}

// Initialize on load and add event listener for Enter key
document.addEventListener('DOMContentLoaded', function() {
    initChatbot();
    
    const chatInput = document.getElementById('chatbot-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
});

// Export functions for use in other modules
window.toggleChatbot = toggleChatbot;
window.openChatbot = openChatbot;
window.sendChatMessage = sendChatMessage;