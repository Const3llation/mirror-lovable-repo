"use client";

import { FormField } from "@/components/form-field";
import IconBadgeDialog from "@/components/icon-badge-dialog";
import { Body } from "@/components/ui/body";
import { Button } from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { contactFormSchema } from "@/features/contact/schemas/contact-form-schema";
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, MailIcon, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * API function to submit the contact form
 */
const submitContactForm = async (data: ContactFormData) => {
	const response = await fetch("/api/contact", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Failed to submit contact form");
	}

	return response.json();
};

export default function ContactForm() {
	const [isSubmitted, setIsSubmitted] = useState(false);

	const { register, control, handleSubmit, formState, reset } =
		useForm<ContactFormData>({
			resolver: zodResolver(contactFormSchema),
			defaultValues: {
				firstName: "",
				lastName: "",
				workEmail: "",
				subjectOfInquiry: "",
				message: "",
				privacyPolicy: false,
			},
			mode: "onSubmit",
			reValidateMode: "onSubmit",
		});

	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: submitContactForm,
		onSuccess: () => {
			reset();
			setIsSubmitted(true);
		},
		onError: (err) => {
			console.error("Contact form submission error:", err);
		},
	});

	const handleSendMessage = handleSubmit((data) => {
		mutate(data);
	});

	if (isSubmitted) {
		return (
			<div className="flex flex-col items-center justify-center gap-2">
				<IconBadgeDialog icon={"Send"} />
				<h3 className="text-2xl font-semibold text-center text-text-100">
					Thank You!
				</h3>
				<p className="text-center text-text-300 max-w-[30ch]">
					Your message has been received. We'll get back to you as soon as
					possible.
				</p>
				<Button
					variant="secondary"
					size="md"
					onClick={() => {
						reset();
						setIsSubmitted(false);
					}}
					className="mt-8"
				>
					Send Another Message
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-14 w-full">
			<div className="flex flex-col gap-8 w-full">
				<div className="flex flex-col lg:flex-row gap-6 w-full">
					<FormField
						error={formState.errors.firstName?.message}
						name="firstName"
						label="First Name*"
						register={register}
						className="w-full"
						placeholder="First Name*"
						disabled={isPending}
					/>
					<FormField
						error={formState.errors.lastName?.message}
						name="lastName"
						label="Last Name*"
						register={register}
						className="w-full"
						placeholder="Last Name*"
						disabled={isPending}
					/>
				</div>
				<FormField
					error={formState.errors.workEmail?.message}
					name="workEmail"
					label="Work email*"
					register={register}
					className="w-full"
					icon={<MailIcon size={18} className="text-primary-100" />}
					type="email"
					placeholder="Work email*"
					disabled={isPending}
				/>
				<FormField
					error={formState.errors.subjectOfInquiry?.message}
					name="subjectOfInquiry"
					label="Subject of Inquiry*"
					register={register}
					className="w-full"
					placeholder="Subject of Inquiry*"
					disabled={isPending}
				/>
				<Controller
					name="message"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<Textarea
							{...field}
							id={field.name}
							maxLength={300}
							label="Message*"
							error={error?.message}
							placeholder="Message*"
							disabled={isPending}
						/>
					)}
				/>
				<Controller
					name="privacyPolicy"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<div className="flex flex-col gap-2">
							<div className="flex flex-row gap-2">
								<Checkbox
									id={field.name}
									checked={field.value}
									onChange={field.onChange}
									onClick={(e) => e.stopPropagation()}
									disabled={isPending}
								/>
								<Body
									variants="14-medium"
									className={cn(
										error?.message ? "text-red-500" : "text-text-300",
									)}
								>
									I accept the{" "}
									<Link
										href="/privacy-policy"
										className="underline"
										target="_blank"
									>
										Privacy Policy.
									</Link>
								</Body>
							</div>
							{error?.message && (
								<Body variants="14-regular" className="text-red-500">
									{error.message}
								</Body>
							)}
						</div>
					)}
				/>

				{isError && (
					<div className="flex items-center gap-2 text-red-500 mt-2">
						<XCircle size={16} />
						<span className="text-sm">
							{error instanceof Error
								? error.message
								: "An error occurred. Please try again."}
						</span>
					</div>
				)}
			</div>
			<div className="mx-auto">
				<Button
					type="submit"
					variant="primary"
					size="lg"
					className="px-20"
					onClick={handleSendMessage}
					disabled={isPending}
				>
					{isPending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Sending...
						</>
					) : (
						<Body variants="16-regular" className="text-text-100">
							Contact us
						</Body>
					)}
				</Button>
			</div>
		</div>
	);
}
