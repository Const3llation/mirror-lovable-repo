"use client";

import { GradientText } from "@/components/gradient-text";
import { Body } from "@/components/ui/body";
import { Button } from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { MailIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const NewsletterSection = () => (
	<section className="container text-center pt-20 pb-7 relative overflow-hidden">
		<div className="absolute top-0 left-0 right-0 h-[1px] bg-[linear-gradient(90deg,#030014_0%,rgba(255,255,255,0.15)_51.51%,#030014_100%)]" />

		<Newsletter />
		<div
			className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-primary-300/25 blur-[150px] 
			[background:radial-gradient(circle_at_bottom,theme(colors.primary.300)_0%,transparent_95%)]"
		/>
	</section>
);

const newsletterFormSchema = z.object({
	email: z.string().email("Valid email address required"),
	consent: z.boolean().refine((value) => Boolean(value), {
		message: "You must accept the Privacy Policy",
	}),
});

type SubscribeResponse = {
	message: string;
};

type SubscribeError = {
	error: string;
};

const Newsletter = () => {
	const form = useForm<z.infer<typeof newsletterFormSchema>>({
		resolver: zodResolver(newsletterFormSchema),
		defaultValues: {
			email: "",
			consent: false,
		},
	});

	const subscribeMutation = useMutation({
		mutationFn: async (data: z.infer<typeof newsletterFormSchema>) => {
			const response = await fetch("/api/newsletter/subscribe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: data.email }),
			});

			if (!response.ok) {
				const errorData: SubscribeError = await response.json();
				throw new Error(errorData.error || "Failed to subscribe");
			}

			return response.json() as Promise<SubscribeResponse>;
		},
		onSuccess: () => {
			form.reset();
		},
	});

	const onSubmit = (data: z.infer<typeof newsletterFormSchema>) => {
		subscribeMutation.mutate(data);
	};

	return (
		<div className="relative p-5 inline-flex flex-col z-20">
			<Heading as="h3" variants={"h4"} className="mb-1">
				<GradientText>Subscribe to our newsletter</GradientText>
			</Heading>
			<Body
				variants="16-regular"
				className="text-text-300 max-w-[80%] mx-auto sm:max-w-full sm:mx-0 sm:mb-3"
			>
				Receive weekly updates on new posts and features
			</Body>

			{subscribeMutation.isSuccess ? (
				<motion.div
					className="flex flex-col items-center gap-4 py-4"
					initial="hidden"
					animate="visible"
					variants={{
						hidden: {},
						visible: { transition: { staggerChildren: 0.1 } },
					}}
				>
					<motion.div
						className="rounded-full bg-green-500/10 p-3"
						variants={{
							hidden: { scale: 0, opacity: 0 },
							visible: {
								scale: 1,
								opacity: 1,
								transition: { duration: 0.3, ease: "easeOut" },
							},
						}}
					>
						<MailIcon size={24} className="text-green-500" />
					</motion.div>
					<div>
						<motion.div
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: {
									opacity: 1,
									y: 0,
									transition: { duration: 0.3, delay: 0.2, ease: "easeOut" },
								},
							}}
						>
							<Body variants="16-medium" className="text-green-500">
								Check your inbox
							</Body>
						</motion.div>
						<motion.div
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: {
									opacity: 1,
									y: 0,
									transition: { duration: 0.3, delay: 0.3, ease: "easeOut" },
								},
							}}
						>
							<Body variants="14-regular" className="text-text-300 mt-1">
								Please confirm your subscription via the email we just sent you.
							</Body>
						</motion.div>
					</div>
				</motion.div>
			) : (
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-2"
				>
					<div className="flex flex-col gap-2 items-start mt-5 mb-1 z-50">
						<Input
							{...form.register("email")}
							type="email"
							placeholder="Email address"
							connected
							disabled={subscribeMutation.isPending}
							rightElement={
								<Button
									type="submit"
									variant="primary"
									size="md"
									disabled={subscribeMutation.isPending}
									className="hidden sm:flex"
								>
									{subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
								</Button>
							}
							icon={<MailIcon size={18} className="text-primary-100" />}
							iconPosition="left"
						/>
						{form.formState.errors.email && (
							<span className="text-red-500 text-sm z-100">
								{form.formState.errors.email.message}
							</span>
						)}
					</div>

					<div className="flex gap-2 z-50">
						<Controller
							control={form.control}
							name="consent"
							render={({ field, fieldState: { error } }) => (
								<div className="flex flex-col gap-2">
									<div className="flex flex-row gap-2">
										<Checkbox
											id={field.name}
											checked={field.value}
											onChange={field.onChange}
											onClick={(e) => e.stopPropagation()}
											disabled={subscribeMutation.isPending}
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
					</div>

					<Button
						type="submit"
						variant="primary"
						size="md"
						disabled={subscribeMutation.isPending}
						className="sm:hidden mt-2"
					>
						{subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
					</Button>

					{subscribeMutation.isError && (
						<span className="text-red-500 text-sm z-100">
							{subscribeMutation.error.message}
						</span>
					)}
				</form>
			)}
		</div>
	);
};

export default NewsletterSection;
