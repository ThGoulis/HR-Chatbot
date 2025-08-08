import { toISO } from './validation.js';

export async function submitRequest(conversation) {
    let body, endpoint;
    if (conversation.intent === 'leave_request') {
        body = {
            employee_id: conversation.employee_id,
            leave_type: 'annual',
            start_date: toISO(conversation.slots.start_date),
            end_date: toISO(conversation.slots.end_date),
            reason: conversation.details
        };
        endpoint = 'http://127.0.0.1:8000/api/leave';
    } else if (conversation.intent === 'change_shift') {
        body = {
            employee_id: conversation.employee_id,
            request_type: 'change_shift',
            details: `Αλλαγή βάρδιας για ${conversation.slots.shift_date}: 
            Τρέχουσα ώρα έναρξης: ${conversation.slots.current_start_time}, 
            Νέα ώρα έναρξης: ${conversation.slots.new_start_time}, 
            Λεπτομέρειες: ${conversation.details || "-"}`,
            shift_date: conversation.slots.shift_date,
            current_start_time: conversation.slots.current_start_time,
            new_start_time: conversation.slots.new_start_time
        };
        endpoint = 'http://127.0.0.1:8000/api/chatbot/message';
    } else if (conversation.intent === 'weekly_shift_change') {
        body = {
            employee_id: conversation.employee_id,
            changes: conversation.changes || []
        };
        endpoint = 'http://127.0.0.1:8000/api/chatbot/weekly_shift_change';
    } else {
        body = {
            employee_id: conversation.employee_id,
            request_type: conversation.intent,
            details: conversation.details
        };
        endpoint = 'http://127.0.0.1:8000/api/chatbot/message';
    }

    try {
        console.log("POST to", endpoint, "with body", body);
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return res; // ΕΠΙΣΤΡΕΦΕΙΣ ΜΟΝΟ ΤΟ ΑΠΟΤΕΛΕΣΜΑ
    } catch (err) {
        throw err; // Κάνε throw για να χειριστείς το error στο conversation.js
    }
}

export async function detectIntent(msg) {
    const intentRes = await fetch('http://127.0.0.1:8000/api/chatbot/detect_intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
    });
    if (!intentRes.ok) return null;
    return await intentRes.json();
}

export async function fetchShiftByMitroo(mitroo) {
    const url = `http://localhost:8000/api/shifts/${encodeURIComponent(mitroo)}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
}

export async function fetchWeekSchedule(mitroo, from_date) {
    const url = `http://localhost:8000/api/shifts/${mitroo}/week?date_str=${from_date}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
}