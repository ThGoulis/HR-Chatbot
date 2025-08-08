// handleIntentDetection.js
export async function handleIntentDetection(msg, conversation, addBubble, previewAndConfirm) {
    conversation.details = msg;
    try {
        const intentRes = await fetch('http://127.0.0.1:8000/api/chatbot/detect_intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });

        if (intentRes.ok) {
            const data = await intentRes.json();
            conversation.intent = data.intent;

            switch (data.intent) {
                case 'leave_request':
                    addBubble("Για ποια ημερομηνία ξεκινά η άδειά σας; (πχ 24-06-2025)");
                    conversation.step = 2;
                    break;
                case 'change_shift':
                    addBubble("Για ποια ημερομηνία θέλετε αλλαγή βάρδιας;");
                    conversation.step = 3;
                    break;
                case 'weekly_shift_change':
                    addBubble("Ποια εβδομάδα θέλετε να δείτε/αλλάξετε; Δώστε μία ημερομηνία με την μορφή 01-01-2025)");
                    conversation.step = 50;
                    break;
                default:
                    await previewAndConfirm();
            }
        } else {
            addBubble("Δεν κατάλαβα το αίτημά σας. Δοκιμάστε ξανά.");
        }
    } catch (err) {
        addBubble("❌ Σφάλμα στην επικοινωνία με το backend.");
        console.error(err);
    }

    return;
}
