export default function isNotEmpty(
	value: unknown[] | null | undefined,
): value is unknown[] {
	return Array.isArray(value) && value.length > 0;
}
