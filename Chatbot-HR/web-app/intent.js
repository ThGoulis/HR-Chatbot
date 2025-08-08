export function matchAlias(msg, aliases) {
    const norm = msg
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return aliases.some(alias =>
        norm.includes(
            alias.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        )
    );
}
