import { setupChat } from './conversation.js';

document.addEventListener('DOMContentLoaded', () => {
  setupChat();
});

function showInstructionsModal() {
    document.getElementById('instructions-text').innerHTML = `
    <h3>Οδηγίες Χρήσης Chatbot</h3>
    <ul>
      <li><b>Άδεια:</b> Γράψτε "άδεια" και το bot θα σας ζητήσει ημερομηνίες και αιτιολογία.</li>
      <li><b>Αλλαγή βάρδιας για μία ημέρα:</b> Γράψτε "βάρδιας" και δηλώστε ποια βάρδια και πότε.</li>
      <li><b>Αλλαγή βάρδιών εβδομάδας:</b> Γράψτε "εβδομάδα", στην συνέχεια πληκτρολογήστε μία ημέρα εκείνης της εβδομάδα που αφορά το πρόγραμμά σας π.χ. 01-08-2025 και \
      θα εμφανιστεί το πρόγραμμά σας για εκείνη την εβδομάδα. Στην συνέχεια θα πρέπει \
      θα πρέπει να εισάγεται την ημέρα που επιθυμείτε αλλαγή με την μορφή dd-mm-yyyy και στην συνέχεια την λέξη <b>"ρεπο"</b> ή <b>"άδεια"</b> ή ωράριο με την μορφή <b>HH:MM-HH:MM</b>\n
      Παράδειγμα χρήσης: \n
      <ul><li>01-08-2025 ρεπο</li></ul>
      <ul><li>02-08-2025 09:00-17:00</li></ul>
      </li>
      <li>Μπορείτε να διορθώσετε κάθε βήμα πριν την υποβολή.</li>
      <li>Χρησιμοποιήστε <b>DD-MM-YYYY</b> για ημερομηνίες.</li>
      <li>Για βοήθεια, πατήστε το κουμπί "Οδηγίες"</li>
    </ul>
    <p>Αν έχετε απορίες διαβάστε ξανά τις οδηγίες. \nΑν έχετε επιπλέον απορίες είστε άξιοι να δουλεύτε στην Mediatel</p>
    `;
    document.getElementById('instructions-modal').style.display = 'flex';
}
document.getElementById('help-btn').onclick = showInstructionsModal;
document.getElementById('close-instructions').onclick = function() {
    document.getElementById('instructions-modal').style.display = 'none';
};