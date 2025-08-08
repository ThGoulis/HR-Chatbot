// handlers/handleStep31.js
export function handleStep31(msg, conversation, addBubble) {
    const value = msg.trim();

    if (!/^\d{2}:\d{2}$/.test(value)) {
        addBubble("❌ Η ώρα πρέπει να είναι σε μορφή HH:MM (π.χ. 07:00). Προσπαθήστε ξανά.");
        return false;
    }

    conversation.slots.current_start_time = value;
    conversation.step = 32;
    addBubble("Ποια είναι η νέα επιθυμητή ώρα έναρξης βάρδιας; (π.χ. 15:00)");

    return true;
}
