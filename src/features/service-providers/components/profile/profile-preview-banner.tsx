"use client";

import { Button } from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import { Heading } from "@/components/ui/heading";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useState } from "react";

interface ProfilePreviewBannerProps {
	onPrevious: () => void;
	onSubmit: () => void;
}

export const ProfilePreviewBanner = ({
	onPrevious,
	onSubmit,
}: ProfilePreviewBannerProps) => {
	const [isPrivacyPolicyAccepted, setIsPrivacyPolicyAccepted] = useState(false);
	const [showErrors, setShowErrors] = useState(false);

	const handleOnSubmit = () => {
		if (!isPrivacyPolicyAccepted) {
			setShowErrors(true);
			return;
		}

		setShowErrors(false);
		onSubmit();
	};

	return (
		<div className="fixed top-[105px] lg:top-[138px] w-full left-0 bg-primary-300 z-50 text-white">
			<div className="container mx-auto py-6 px-4">
				<div className="flex flex-col gap-6 items-start">
					<Heading as="h1" variants={"h3"} className="text-center">
						Profile Preview
					</Heading>

					<div className="flex flex-col sm:mb-8 gap-2">
						<div className="flex gap-2">
							<Checkbox
								id="privacy-policy"
								className={cn(
									"border-white data-[state=checked]:bg-white data-[state=checked]:text-primary-900",
									showErrors && "border-red-500",
								)}
								checked={isPrivacyPolicyAccepted}
								onChange={() => setIsPrivacyPolicyAccepted((prev) => !prev)}
							/>
							<label htmlFor="privacy-policy" className="text-sm">
								I accept the{" "}
								<Link href="/privacy-policy" className="underline">
									Privacy Policy
								</Link>
								.
							</label>
						</div>

						{showErrors && (
							<span className="text-red-500 text-sm">
								You must accept the privacy policy
							</span>
						)}
					</div>

					<div className="flex flex-col sm:flex-row justify-between gap-4 mx-auto w-full">
						<Button
							variant="link"
							size={"md"}
							onClick={onPrevious}
							className="flex-1 text-white"
						>
							Previous step
						</Button>
						<Button
							variant="primary"
							size={"md"}
							onClick={handleOnSubmit}
							className="flex-1"
						>
							Submit
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePreviewBanner;
