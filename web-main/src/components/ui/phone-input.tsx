import { cn } from "@/utils/cn";
import { forwardRef } from "react";
import { PhoneInput as InternationalPhoneInput } from "react-international-phone";

import "react-international-phone/style.css";
import "@/styles/phone-input.css";

/**
 * Props for the PhoneInput component.
 * Extends native input attributes while maintaining type safety.
 */
interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	/**
	 * Additional CSS classes to apply to the phone input container
	 */
	className?: string;

	/**
	 * Label text to display above the input
	 */
	label?: string;

	/**
	 * Error message to display below the input
	 */
	error?: string;

	/**
	 * Phone number value in E.164 format (e.g., "+12345678900")
	 */
	value?: string;

	/**
	 * Default country code in ISO 3166-1 alpha-2 format (e.g., "US", "GB")
	 */
	defaultCountry?: string;
}

/**
 * PhoneInput component that provides international phone number input functionality.
 * Wraps react-international-phone with custom styling and react-hook-form compatibility.
 *
 * @example
 * // Basic usage
 * <PhoneInput placeholder="Enter phone number" />
 *
 * @example
 * // With label and error
 * <PhoneInput
 *   label="Phone Number"
 *   error="Please enter a valid phone number"
 *   placeholder="Enter phone number"
 * />
 *
 * @example
 * // With react-hook-form
 * <PhoneInput
 *   {...register("phoneNumber", { required: true })}
 *   label="Phone Number"
 *   error={errors.phoneNumber?.message}
 *   aria-invalid={errors.phoneNumber ? "true" : "false"}
 * />
 */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
	(
		{ className, onChange, label, error, id, value, defaultCountry, ...props },
		ref,
	) => {
		/**
		 * Generate a unique ID for the input if none is provided
		 */
		const inputId =
			id || `phone-input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

		/**
		 * Transforms the phone input value into a synthetic event
		 * to maintain compatibility with react-hook-form's onChange handler
		 */
		const handleChange = (phone: string) => {
			const syntheticEvent = {
				target: {
					value: phone,
				},
			};

			onChange?.(
				syntheticEvent as unknown as React.ChangeEvent<HTMLInputElement>,
			);
		};

		return (
			<div className="w-full">
				{label && (
					<label
						htmlFor={inputId}
						className="mb-3 block text-sm font-medium text-text-100 text-left"
					>
						{label}
					</label>
				)}
				<InternationalPhoneInput
					value={value}
					defaultCountry={defaultCountry}
					onChange={handleChange}
					className={cn(
						"phone-input-container",
						"border rounded-lg",
						error ? "border-red-500" : "border-stroke-25",
						className,
					)}
					inputProps={{
						// @ts-expect-error react-international-phone types are incomplete
						ref,
						id: inputId,
						...props,
					}}
				/>
				{error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
			</div>
		);
	},
);

PhoneInput.displayName = "PhoneInput";
