// @ts-nocheck

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";
import React from "react";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface FormFieldProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	label?: ReactNode | string;
	register: UseFormRegister<TFormValues>;
	error?: string;
	type?: "text" | "email" | "tel" | "password" | "number";
	inputMode?:
		| "text"
		| "numeric"
		| "decimal"
		| "search"
		| "tel"
		| "url"
		| "email"
		| "none";
	required?: boolean;
	children?: ReactNode;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	icon?: ReactNode;
	iconPosition?: "left" | "right";
	decorator?: ReactNode;
}

export function FormField<TFormValues extends FieldValues>({
	name,
	label,
	register,
	error,
	type = "text",
	required,
	children,
	inputMode,
	placeholder,
	disabled,
	className,
	icon,
	iconPosition = "left",
	decorator,
}: FormFieldProps<TFormValues>) {
	const fieldProps = {
		...register(name),
		id: name,
		type,
		inputMode,
		"aria-invalid": error ? "true" : ("false" as const),
		"aria-describedby": error ? `${name}-error` : undefined,
		className: cn(error && "border-red-500 focus:ring-red-500"),
		placeholder,
		disabled,
		icon,
	};

	return (
		<div className={cn("flex flex-col gap-3", className)}>
			<Label
				htmlFor={name}
				className={cn("text-left", error && "text-red-500")}
			>
				{label}
				{required && <span className="text-red-500 ml-1">*</span>}
			</Label>

			<div className="relative">
				{children ? (
					React.cloneElement(children as React.ReactElement, fieldProps)
				) : (
					<Input {...fieldProps} iconPosition={iconPosition} />
				)}

				{decorator}
			</div>

			{error && (
				<p
					id={`${name}-error`}
					className="text-sm text-red-500 mt-[-6px] text-left formFieldError"
					role="alert"
				>
					{error}
				</p>
			)}
		</div>
	);
}
