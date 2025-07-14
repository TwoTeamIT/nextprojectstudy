export function toCamelCase(str: string): string {
    return str
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map((word, index) => {
            if (index === 0) return word.toLowerCase();
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');
}

export function toCapitalize(str: string): string {
    return str.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}
