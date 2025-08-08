// handlers/handleStep32.js
export async function handleStep32(msg, conversation, addBubble, previewAndConfirm) {
    const value = msg.trim();

    if (!/^\d{2}:\d{2}$/.test(value)) {
        addBubble("❌ Η ώρα πρέπει να είναι σε μορφή HH:MM (π.χ. 15:00). Προσπαθήστε ξανά.");
        return false;
    }

    conversation.slots.new_start_time = value;
    await previewAndConfirm();

    return true;
}
