export function formatDateToYYYYMMDD(date?: Date): string {
	if (!date || isNaN(date.getTime())) return 'Invalid Date';
	return date.toISOString().substring(0, 10);
}
