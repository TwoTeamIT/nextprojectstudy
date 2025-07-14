export function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

export function stringAvatar(name: string) {
    const nameParts = name.split(' ');
    const firstInitial = nameParts[0][0];
    const secondInitial = nameParts.length > 1 ? nameParts[1][0] : '';

    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${firstInitial}${secondInitial}`,
    };
}

export async function getFavicon(url: string) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const iconLink = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]');

        if (iconLink) {
            const iconLinkUrl = iconLink.getAttribute('href')?.toString();
            if (iconLinkUrl) return new URL(iconLinkUrl, url).href
        }

        return `${new URL(url).origin}/favicon.ico`;
    } catch (error) {
        console.error('Error fetching favicon:', error);
        return `${new URL(url).origin}/favicon.ico`; // Fallback
    }
}
