export async function handleStep4(msg, conversation, addBubble, isValidDate, toISO, previewAndConfirm) {
    if (!isValidDate(msg)) {
        addBubble("❌ Λάθος μορφή ημερομηνίας! Δώστε ημερομηνία σε μορφή DD-MM-YYYY.");
        return false;
    }

    const startDateISO = toISO(conversation.slots.start_date);
    const endDateISO = toISO(msg);

    if (new Date(endDateISO) < new Date(startDateISO)) {
        addBubble("❌ Η ημερομηνία λήξης δεν μπορεί να είναι πριν την ημερομηνία έναρξης!");
        return false;
    }

    conversation.slots.end_date = msg;
    await previewAndConfirm();
    return true;
}
