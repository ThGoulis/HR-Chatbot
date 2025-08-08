// handlers/handleStep50.js
export async function handleStep50(msg, conversation, addBubble, isValidDate, fetchWeekSchedule) {
    if (!isValidDate(msg)) {
        addBubble("❌ Δώστε ημερομηνία σε μορφή DD-MM-YYYY.");
        return false;
    }

    const [day, month, year] = msg.split('-').map(Number);
    const inputDate = new Date(year < 100 ? 2000 + year : year, month - 1, day);
    inputDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate < today) {
        addBubble("❌ Δεν μπορείτε να επιλέξετε εβδομάδα που ξεκινάει σε παρελθοντική ημερομηνία.");
        return false;
    }

    const maxFuture = new Date(today);
    maxFuture.setMonth(today.getMonth() + 2);
    if (inputDate > maxFuture) {
        addBubble("❌ Δεν μπορείτε να επιλέξετε εβδομάδα τόσο μακριά στο μέλλον.");
        return false;
    }

    conversation.week_date = msg;
    const schedule = await fetchWeekSchedule(conversation.employee_id, msg);

    if (!Array.isArray(schedule) || schedule.length === 0) {
        addBubble("❌ Δεν βρέθηκε πρόγραμμα για την εβδομάδα.");
        conversation.schedule = [];
        conversation.step = 51;
        return true;
    }

    conversation.schedule = schedule; // για επόμενα steps

    let html = `<b>Το πρόγραμμά σας για την εβδομάδα:</b><br><table border="1"><tr>
        <th>Ημερομηνία</th><th>Κατάσταση</th><th>Ώρα Έναρξης</th><th>Ώρα Λήξης</th></tr>`;

    schedule.forEach(row => {
        html += `<tr>
            <td>${row.the_date || row.date}</td>
            <td>${row.status_name || row.status}</td>
            <td>${row.the_start_time || row.start || '-'}</td>
            <td>${row.the_end_time || row.end || '-'}</td>
        </tr>`;
    });

    html += `</table>`;
    addBubble(html);

    conversation.step = 51;
    return true;
}
