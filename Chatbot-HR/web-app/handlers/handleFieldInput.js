// /handler/handleFieldInput.js
export async function handleFieldInput(fieldToEdit, msg, conversation, addBubble, previewAndConfirm, isValidDate) {
    if (!fieldToEdit) return null;

    const value = msg.trim();
    if (!value) {
        addBubble("❌ Δεν καταχωρήθηκε καμία τιμή. Προσπαθήστε ξανά.");
        return fieldToEdit;
    }

    // Validation για ώρα
    if (fieldToEdit === "current_start_time" || fieldToEdit === "new_start_time") {
        const isValidTime = /^\d{2}:\d{2}$/.test(value);
        if (!isValidTime) {
            addBubble("❌ Η ώρα πρέπει να είναι σε μορφή HH:MM (π.χ. 07:00). Προσπαθήστε ξανά.");
            return fieldToEdit;
        }
        conversation.slots[fieldToEdit] = value;
    }
    // Validation για ημερομηνία (αν έχεις isValidDate ως helper)
    else if (["start_date", "end_date", "shift_date"].includes(fieldToEdit)) {
        if (typeof isValidDate === "function" && !isValidDate(value)) {
            addBubble("❌ Η ημερομηνία πρέπει να είναι σε μορφή DD-MM-YYYY. Προσπαθήστε ξανά.");
            return fieldToEdit;
        }
        conversation.slots[fieldToEdit] = value;
    }
    // Για λεπτομέρειες ή άλλο string
    else if (fieldToEdit === "details") {
        conversation.details = value;
    }
    // Άγνωστο πεδίο
    else {
        addBubble("❌ Το πεδίο που προσπαθείτε να αλλάξετε δεν υποστηρίζεται.");
        return fieldToEdit;
    }

    // Προαιρετικά feedback:
    // addBubble("Το πεδίο ενημερώθηκε.");

    conversation.step = 99; // γυρνάει στην επιβεβαίωση
    await previewAndConfirm();

    return null; // μηδενίζει το fieldToEdit
}
