export function isValidDate(str) {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (!regex.test(str)) return false;
    const [day, month, year] = str.split('-').map(Number);
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    const date = new Date(year, month - 1, day);
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

export function isValidTime(str) {
    return /^\d{2}:\d{2}$/.test(str.trim());
}

export function isDuplicateChange(date, changes) {
    return changes && changes.some(change => change.date === date);
}

export function toISO(str) {
    const [day, month, year] = str.split('-');
    return `${year}-${month}-${day}`;
}
