// handleStartDateInput.js
export function handleStartDateInput(msg, conversation, addBubble, isValidDate) {
    if (!isValidDate(msg)) {
        addBubble("❌ Λάθος μορφή ημερομηνίας! Δώστε ημερομηνία σε μορφή DD-MM-YYYY.");
        return false;  // αποτυχία, δεν αλλάζει βήμα
    }

    conversation.slots.start_date = msg;
    conversation.step = 4;
    addBubble("Ποια ημερομηνία λήγει η άδειά σας; (πχ 24-06-2025)");
    return true;  // επιτυχής καταχώρηση
}
