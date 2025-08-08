// /handler/handleEmployeeIdInput.js
import { fetchShiftByMitroo } from '../api.js';

export async function handleEmployeeIdInput(msg, conversation, addBubble) {
    const id = msg.trim();

    if (!/^\d+$/.test(id)) {
        addBubble("❌ Ο αριθμός μητρώου πρέπει να περιλαμβάνει μόνο αριθμούς. Προσπαθήστε ξανά.");
        return false;  // παραμονή στο ίδιο βήμα
    }

    if (!/^\d{4,10}$/.test(id)) {
        addBubble("❌ Ο αριθμός μητρώου πρέπει να περιέχει μόνο αριθμούς (4-10 ψηφία). Προσπαθήστε ξανά.");
        return false;
    }

    const shift = await fetchShiftByMitroo(id);

    console.log('Step:', shift);

    if (!shift || !Array.isArray(shift) || shift.length === 0) {
        addBubble("❌ Δεν βρέθηκε υπάλληλος με αυτόν τον Αρ. Μητρ. Προσπαθήστε ξανά.");
        return false;
    }

    const emp = shift[0];

    // Αν βρεθεί, αποθηκεύεις στοιχεία και προχωράς
    conversation.employee_id = id;
    conversation.employee_data = shift;  // Προαιρετικά, για να έχεις τα στοιχεία στον διάλογο
    
    addBubble(`Γεια σου: ${emp.fullname} (${emp.team_name})`);
    addBubble("Πώς μπορώ να σας βοηθήσω; Περιγράψτε το αίτημά σας με μία πρόταση.");

    conversation.step = 1;

    return true;
}
