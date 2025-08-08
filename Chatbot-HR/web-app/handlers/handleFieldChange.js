// /handler/handleFieldChange.js
export function handleFieldChange(msg, conversation, addBubble, showAlert, matchAlias) {
    let fieldToEdit = null;

    if (conversation.intent === 'leave_request') {
        if (matchAlias(msg, ["έναρξ", "έναρξη", "enark", "enarks", "enarch", "arxi", "arxh"])) {
            fieldToEdit = "start_date";
            conversation.step = 100;
            addBubble("Δώστε νέα ημερομηνία έναρξης άδειας:");
            return fieldToEdit;
        }
        if (matchAlias(msg, ["λήξ", "λήξη", "lix", "lixi", "liksi", "liksh", "lixis"])) {
            fieldToEdit = "end_date";
            conversation.step = 100;
            addBubble("Δώστε νέα ημερομηνία λήξης άδειας:");
            return fieldToEdit;
        }
        if (matchAlias(msg, [
            "αιτιολογ", "αιτιολογία", "aitiolog", "aitiologia", "aitia", "λογ", "λόγος", "log", "logoi", "leptom", "λεπτομερ", "λεπτομέρειες", "details"
        ])) {
            fieldToEdit = "details";
            conversation.step = 100;
            addBubble("Δώστε νέα αιτιολογία άδειας:");
            return fieldToEdit;
        }
    }

    if (conversation.intent === 'change_shift') {
        const shiftDateAliases = [
            "βάρδια", "βαρδια", "vardia", "vardeia", "varthia", "bardia", "varthia", "βάρδιας", "vardias", "αλλαγη", "allagi"
        ];
        const detailsAliases = [
            "λεπτομερ", "λεπτομέρειες", "details", "leptom", "leptomereies", "paratir", "παρατηρ", "sxolia", "σχόλια"
        ];
        const currentTimeAliases = ["τρέχουσα ώρα", "trexousa ora", "current time", "current start", "ora enarxis"];
        const newTimeAliases = ["νέα ώρα", "nea ora", "new time", "new start", "nea enarxis"];

        if (matchAlias(msg, shiftDateAliases)) {
            fieldToEdit = "shift_date";
            conversation.step = 100;
            addBubble("Δώστε νέα ημερομηνία βάρδιας:");
            return fieldToEdit;
        }
        if (matchAlias(msg, currentTimeAliases)) {
            fieldToEdit = "current_start_time";
            conversation.step = 100;
            addBubble("Δώστε νέα τρέχουσα ώρα έναρξης βάρδιας (π.χ. 07:00):");
            return fieldToEdit;
        }
        if (matchAlias(msg, newTimeAliases)) {
            fieldToEdit = "new_start_time";
            conversation.step = 100;
            addBubble("Δώστε νέα ώρα έναρξης βάρδιας (π.χ. 15:00):");
            return fieldToEdit;
        }
        if (matchAlias(msg, detailsAliases)) {
            fieldToEdit = "details";
            conversation.step = 100;
            addBubble("Δώστε νέες λεπτομέρειες:");
            return fieldToEdit;
        }
    }

    addBubble("Δεν κατάλαβα ποιο πεδίο θέλετε να αλλάξετε. Επιλέξτε π.χ. 'Ημερομηνία έναρξης', 'Ημερομηνία λήξης', 'Αιτιολογία'.");
    return null;
}
