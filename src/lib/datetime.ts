export class DateTimeConv {
    getDate(stringTime: string): string {
        const date = new Date(stringTime);
        const d = date.getDate();
        const m = date.getMonth() + 1; // Note: Months are zero-based
        const y = date.getFullYear();
        const fullDate = `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
        return fullDate;
    }
}