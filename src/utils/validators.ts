import { z } from "zod";

export const emailValidator = z.string().email();

export const urlValidator = z.string().url();

export const stringLengthValidator = (min: number, max: number) =>
	z.string().min(min).max(max);

export const createUrlSchema = (fieldName = "URL") =>
	z
		.string()
		.min(1, `${fieldName} is required`)
		.transform((val) => val.trim().toLowerCase())
		.refine((val) => {
			const urlPattern =
				/^(?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?:\/[^\s]*)?$/i;
			return urlPattern.test(val);
		}, `Please enter a valid ${fieldName.toLowerCase()}`)
		.transform((val) => {
			if (!val.startsWith("http://") && !val.startsWith("https://")) {
				return `https://${val}`;
			}
			return val;
		});

type CreatePayloadEmailValidatorOptions = {
	requiredMessage?: string;
	errorMessage?: string;
};
export const createPayloadEmailValidator = ({
	requiredMessage = "Email is required",
	errorMessage = "Invalid email format",
}: CreatePayloadEmailValidatorOptions = {}) => {
	return (value: string | string[] | null | undefined) => {
		if (!value || Array.isArray(value)) return requiredMessage;
		return emailValidator.safeParse(value).success || errorMessage;
	};
};

export const createPayloadUrlValidator = (options?: { optional: boolean }) => {
	return (value: string | string[] | null | undefined) => {
		if (options?.optional && (!value || value === "")) return true;

		if (!value || Array.isArray(value)) return "URL is required";

		return urlValidator.safeParse(value).success || "Invalid URL format";
	};
};

export const createPayloadStringLengthValidator = ({
	min,
	max,
	requiredMessage = "String is required",
	errorMessage = "Invalid string length",
}: {
	min: number;
	max: number;
	requiredMessage?: string;
	errorMessage?: string;
}) => {
	return (value: string | string[] | null | undefined) => {
		if (!value) return requiredMessage;
		return (
			stringLengthValidator(min, max).safeParse(value).success || errorMessage
		);
	};
};
