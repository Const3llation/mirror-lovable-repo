/**
 * Capitalizes the first letter of a given string
 * @param text - The string to capitalize
 * @returns The string with its first letter capitalized
 * @example
 * capitalizeFirstLetter('hello') // returns 'Hello'
 * capitalizeFirstLetter('') // returns ''
 */
export const capitalizeFirstLetter = (text: string): string => {
	if (!text) return text;
	return text.charAt(0).toUpperCase() + text.slice(1);
};
