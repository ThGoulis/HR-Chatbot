// handlers/handleStep2.js
export function handleDateValidation(msg, conversation, addBubble, isValidDate) {
    if (!isValidDate(msg)) {
        addBubble("❌ Λάθος μορφή ημερομηνίας! Δώστε ημερομηνία σε μορφή DD-MM-YYYY.");
        return false; // παραμονή στο ίδιο βήμα
    }

    conversation.slots.start_date = msg;
    conversation.step = 41;
    addBubble("Ποια ημερομηνία λήγει η άδειά σας; (πχ 24-06-2025)");

    return false; // επιτυχής μετάβαση
}
