import { TITLE } from "@/configs";

export function downloadExcel(base64String: string, defaultFileName: string, autoFormat: boolean = false) {
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);

    const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const fileName = autoFormat ? getFormattedFileName(defaultFileName) : defaultFileName;
    return saveFile(blob, fileName);
}

function saveFile(blob: Blob, fileName: string) {
    const a = document.createElement('a');
    a.style.display = 'none';
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }, 0);
}

function getFormattedFileName(fileName: string): string {
    const now = new Date();

    const [name, ext] = fileName.split('.');

    return `${TITLE}-${name}-${now.toISOString()}.${ext}`;
}
