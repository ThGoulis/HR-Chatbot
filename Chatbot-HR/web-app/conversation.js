import { chatForm, chatInput, addBubble, showAlert } from './ui.js';
import { isValidDate, toISO } from './validation.js';
import { matchAlias } from './intent.js';
import { fetchWeekSchedule, submitRequest } from './api.js';

import {
    handleFieldChange,
    handleFieldInput,
    handleEmployeeIdInput,
    handleIntentDetection,
    handleDateValidation,
    handleStep3,
    handleStep4,
    handleStep31,
    handleStep32,
    handleStep50,
    handleStep51
} from './handlers/index.js';


let conversation = {
    employee_id: null,
    intent: null,
    details: null,
    slots: {},
    changes: [],
    schedule: [],
    step: 0
};

let confirmPreview = false;
let fieldToEdit = null;

export function setupChat() {
    startChat();
    chatForm.addEventListener('submit', onUserInput);
}

function startChat() {
    addBubble("👋 Καλησπέρα! Ποιος είναι ο αριθμός μητρώου σας στην εταιρία;");
    conversation.step = 0;
}

// --- Κεντρικός Χειριστής Εισόδου Χρήστη ---
async function onUserInput(e) {
    e.preventDefault();
    const msg = chatInput.value.trim();
    if (!msg) return;
    addBubble(msg, 'user');
    chatInput.value = '';

    console.log('Step:', conversation.step, '| Message:', msg);

    if (conversation.step === 0) {
        const ok = handleEmployeeIdInput(msg, conversation, addBubble);
        if (!ok) return;
        return;
    }
    if (conversation.step === 1) {
        await handleIntentDetection(msg, conversation, addBubble, previewAndConfirm);
        return;
    }
    if (conversation.step === 2) {
        const ok = handleDateValidation(msg, conversation, addBubble, isValidDate);
        if (!ok) return;
        
    }
    if (conversation.step === 3) {
        const ok = handleStep3(msg, conversation, addBubble, isValidDate);
        if (!ok) return;
        return;
    }
    if (conversation.step === 41) {
        const ok = await handleStep4(msg, conversation, addBubble, isValidDate, toISO, previewAndConfirm);
        if (!ok) return;
        return;
    }
    if (conversation.step === 31) {
        const ok = handleStep31(msg, conversation, addBubble);
        if (!ok) return;
        return;
    }
    if (conversation.step === 32) {
        const ok = await handleStep32(msg, conversation, addBubble, previewAndConfirm);
        if (!ok) return;
        return;
    }
    if (conversation.step === 50) {
        const ok = await handleStep50(msg, conversation, addBubble, isValidDate, fetchWeekSchedule);
        if (!ok) return;
        return;
    }
    if (conversation.step === 51) {
        const ok = await handleStep51(msg, conversation, addBubble, previewAndConfirmWeekly);
        if (!ok) return;
        return;
    }
    if (conversation.step === 99) {
        const trimmed = msg.trim().toLowerCase();

        // Αν πατήσει Ολοκλήρωση/submit
        if (["ολοκλήρωση", "ok", "submit", "υποβολή", "τέλος"].includes(trimmed)) {
            const res = await submitRequest(conversation);
            if (res && res.ok) {
                addBubble("✅ Το αίτημά σας καταχωρήθηκε επιτυχώς! Θέλετε να υποβάλετε άλλο αίτημα;");
                showAlert("✅ Το αίτημά σας στάλθηκε με επιτυχία!");
                resetConversation();
            } else {
                addBubble("❌ Παρουσιάστηκε σφάλμα στην καταχώρηση του αιτήματος.");
                showAlert("❌ Παρουσιάστηκε σφάλμα κατά την αποστολή του αιτήματος.");
            }
            return;
        }
        // Αν πατήσει ακύρωση ή κενό (ή άλλο άκυρο)
        if (["ακύρωση", "cancel", ""].includes(trimmed)) {
            addBubble("❎ Η διαδικασία ακυρώθηκε. Για να ξεκινήσετε νέο αίτημα, εισάγετε αριθμό μητρώου.");
            resetConversation();
            return;
        }
        // Αν πατήσει οποιοδήποτε άλλο, υποθέτεις ότι θέλει αλλαγή πεδίου:
        const field = handleFieldChange(msg, conversation, addBubble, showAlert, matchAlias);
        if (field) {
            fieldToEdit = field;
        }
        return;
    }

    if (conversation.step === 100) {
        fieldToEdit = await handleFieldInput(fieldToEdit, msg, conversation, addBubble, previewAndConfirm);
        return;
    }

    // --- Fallback για ακατανόητη κατάσταση ---
    addBubble("❓ Δεν κατάλαβα το αίτημά σας. Πληκτρολογήστε 'Βοήθεια' για να δείτε οδηγίες ή ξεκινήστε από την αρχή.");
    return;
}

// --- Υποστηρικτικές συναρτήσεις ---

async function previewAndConfirm() {
    let summary = "";
    if (conversation.intent === 'leave_request') {
        summary = `<b>Επιβεβαίωση αιτήματος άδειας:</b><br>
            <b>ID υπαλλήλου:</b> ${conversation.employee_id}<br>
            <b>Τύπος άδειας:</b> annual<br>
            <b>Αιτιολογία:</b> ${conversation.details}<br>
            <b>Ημερομηνία έναρξης:</b> ${conversation.slots.start_date}<br>
            <b>Ημερομηνία λήξης:</b> ${conversation.slots.end_date}<br>`;
        summary += `<br>Πατήστε <b>Ολοκλήρωση</b> για υποβολή ή γράψτε το όνομα πεδίου που θέλετε να τροποποιήσετε (π.χ. "Ημερομηνία έναρξης", "Ημερομηνία λήξης", "Αιτιολογία").`;
    } else if (conversation.intent === 'change_shift') {
        summary = `<b>Επιβεβαίωση αιτήματος αλλαγής βάρδιας:</b><br>
            <b>ID υπαλλήλου:</b> ${conversation.employee_id}<br>
            <b>Ημερομηνία βάρδιας:</b> ${conversation.slots.shift_date}<br>
            <b>Τρέχουσα ώρα έναρξης:</b> ${conversation.slots.current_start_time}<br>
            <b>Νέα ώρα έναρξης:</b> ${conversation.slots.new_start_time}<br>
            <b>Λεπτομέρειες:</b> ${conversation.details || "-"}<br>`;
        summary += `<br>Πατήστε <b>Ολοκλήρωση</b> για υποβολή ή γράψτε "Βάρδια", "Τρέχουσα ώρα", "Νέα ώρα" ή "Λεπτομέρειες" για τροποποίηση.`;
    } else {
        summary = `<b>Επιβεβαίωση αιτήματος:</b><br>
            <b>ID υπαλλήλου:</b> ${conversation.employee_id}<br>
            <b>Τύπος:</b> ${conversation.intent}<br>
            <b>Λεπτομέρειες:</b> ${conversation.details}<br>`;
        summary += `<br>Πληκτρολογήστε <b>Ολοκλήρωση</b> για υποβολή ή γράψτε "Λεπτομέρειες" για τροποποίηση.`;
    }
    addBubble(summary);
    conversation.step = 99;
    confirmPreview = true;
}

async function previewAndConfirmWeekly() {
    let summary = `<b>Επιβεβαίωση αιτήματος εβδομαδιαίων αλλαγών βαρδιών:</b><br>
        <b>ID υπαλλήλου:</b> ${conversation.employee_id}<br>`;
    if (conversation.changes && conversation.changes.length > 0) {
        conversation.changes.forEach((change, idx) => {
            if (change.request_type === "day_off") {
                summary += `• <b>${change.date}</b>: Αίτημα για <b>ΡΕΠΟ</b><br>`;
            } else if (change.request_type === "change_shift") {
                summary += `• <b>${change.date}</b>: Νέα ώρα <b>${change.new_start_time}-${change.new_end_time}</b><br>`;
            }
        });
    } else {
        summary += "Δεν έχουν δηλωθεί αλλαγές.<br>";
    }
    summary += `<br>Πατήστε <b>Ολοκλήρωση</b> για υποβολή ή εισάγετε νέα αλλαγή για διόρθωση/συμπλήρωση.`;
    addBubble(summary);
    conversation.step = 99;
    confirmPreview = true;
}

function resetConversation() {
    conversation = {
        employee_id: null,
        intent: null,
        details: null,
        slots: {},
        changes: [],
        schedule: [],
        step: 0
    };
    confirmPreview = false;
    fieldToEdit = null;
    startChat();
}
