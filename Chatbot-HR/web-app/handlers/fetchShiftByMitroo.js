export async function fetchShiftByMitroo(mitroo) {
    const url = `http://localhost:8000/api/shifts/${encodeURIComponent(mitroo)}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
}