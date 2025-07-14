export function convertJSONtoCSV(json: Record<string, unknown>[], charset?: 'utf-8' | 'utf-16le' | 'utf-8,%EF%BB%BF' | 'windows-1252') {
    const fields = Object.keys(json[0]);
    const replacer = (key: unknown, value: unknown) => (value === null ? '' : value);
    const csvFields = json.map((row: Record<string, unknown>) => fields.map((fieldName) => row[fieldName] ? JSON.stringify(row[fieldName], replacer).replace(/\\"/gi, '""') : JSON.stringify("", replacer)).join(';'));
    csvFields.unshift(fields.join(';'));
    const csv: string = csvFields.join('\r\n');

    const outputType = charset ? `text/csv;charset=${charset};` : 'text/csv;charset=utf-8;';
    const BOM = '\uFEFF';

    return new Blob([BOM + csv], { type: outputType });
}
