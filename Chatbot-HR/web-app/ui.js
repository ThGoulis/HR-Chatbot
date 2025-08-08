export const chatWindow = document.getElementById('chat-window');
export const chatForm = document.getElementById('chat-form');
export const chatInput = document.getElementById('chat-input');

export function addBubble(text, sender = "bot") {
    const bubble = document.createElement('div');
    bubble.className = 'bubble ' + sender;
    bubble.innerHTML = text;
    chatWindow.appendChild(bubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

export function clearChat() {
    chatWindow.innerHTML = '';
}

export function showModal(message) {
    document.getElementById('modal-message').innerHTML = message;
    document.getElementById('modal').style.display = "flex";
}

export function closeModal() {
    document.getElementById('modal').style.display = "none";
}

export function showAlert(msg) {
    alert(msg);
}
