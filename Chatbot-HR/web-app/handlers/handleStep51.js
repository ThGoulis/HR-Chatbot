// handlers/handleStep51.js
export async function handleStep51(msg, conversation, addBubble, previewAndConfirmWeekly) {
    const input = msg.trim().toLowerCase();

    if (["ολοκλήρωση", "ok", "τέλος", "υποβολή"].includes(input)) {
        await previewAndConfirmWeekly();
        conversation.step = 99;
        return true;
    }

    const changePattern = /^(\d{1,2}-\d{1,2}-\d{2,4})\s+((\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})|ρεπό|ρεπο|rep[oό]|off|day\s*off|leave)$/i;
    const match = msg.match(changePattern);

    if (!match) {
        addBubble("❌ Μη έγκυρη μορφή! Σωστή μορφή 01-01-25 07:00-15:00 ή 01-01-25 ρεπό. Προσπαθήστε ξανά.");
        return false;
    }

    const [ , date, rest, start, end ] = match;

    if (!conversation.changes) conversation.changes = [];
    if (conversation.changes.some(change => change.date === date)) {
        addBubble(`❌ Έχετε ήδη δηλώσει αλλαγή για τη μέρα ${date}. Αν θέλετε να τη διορθώσετε, πρώτα διαγράψτε τη προηγούμενη.`);
        return false;
    }

    if (start && end) {
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        if ((eh < sh) || (eh === sh && em <= sm)) {
            addBubble("❌ Η ώρα λήξης πρέπει να είναι μετά την ώρα έναρξης! Προσπαθήστε ξανά.");
            return false;
        }
    }

    if (rest.toLowerCase().includes("ρεπ") && conversation.schedule) {
        const progRow = conversation.schedule.find(r => r.date === date);
        if (progRow && progRow.status && progRow.status.toUpperCase().includes("ΡΕΠΟ")) {
            addBubble(`ℹ️ Προσοχή: Η μέρα ${date} είναι ήδη ρεπό στο πρόγραμμα σας.`);
        }
    }

    if (rest.toLowerCase().includes("ρεπ") || rest.toLowerCase().includes("off") || rest.toLowerCase().includes("leave")) {
        conversation.changes.push({ date, request_type: "day_off" });
    } else {
        conversation.changes.push({ date, new_start_time: start, new_end_time: end, request_type: "change_shift" });
    }

    addBubble("Η αλλαγή καταχωρήθηκε. Θέλετε να δηλώσετε άλλη αλλαγή για την εβδομάδα; Πληκτρολογήστε 'Ολοκλήρωση' για να προχωρήσετε ή εισάγετε επόμενη αλλαγή.");
    conversation.step = 51;
    return true;
}
