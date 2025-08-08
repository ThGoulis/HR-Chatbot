// handlers/handleStep3.js
export function handleStep3(msg, conversation, addBubble, isValidDate) {
    if (!isValidDate(msg)) {
        addBubble("❌ Λάθος μορφή ημερομηνίας! Δώστε ημερομηνία σε μορφή DD-MM-YYYY.");
        return false;
    }

    const [day, month, year] = msg.split('-').map(Number);
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Μηδενισμός χρόνου
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (inputDate < tomorrow) {
        addBubble("❌ Η ημερομηνία βάρδιας πρέπει να είναι από αύριο και μετά. Δοκιμάστε ξανά.");
        return false;
    }

    conversation.slots.shift_date = msg;
    conversation.step = 31;
    addBubble("Ποια είναι η τρέχουσα ώρα έναρξης βάρδιας; (π.χ. 07:00)");

    return true;
}
