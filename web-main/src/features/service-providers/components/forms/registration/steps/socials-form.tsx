"use client";

import { FormField } from "@/components/form-field";
import GenericFormError from "@/components/ui/form-error";
import { Heading } from "@/components/ui/heading";
import { LinkInput } from "@/components/ui/link-input";
import type { serviceProviderFormSchema } from "@/features/service-providers/schemas/registration";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";

const SocialsForm = () => {
	const {
		register,
		formState: { errors },
	} = useFormContext<z.infer<typeof serviceProviderFormSchema>>();

	return (
		<div>
			<Heading as="h1" variants={"h3"} className="text-center mb-14 mt-6">
				Social Media
			</Heading>

			{errors.socialMedia?.message && (
				<GenericFormError message={errors.socialMedia.message} />
			)}

			<div className="flex flex-col gap-6 mb-14">
				{/* LinkedIn */}
				<FormField
					name="socialMedia.linkedIn"
					label="LinkedIn"
					register={register}
					error={errors.socialMedia?.linkedIn?.message}
				>
					<LinkInput prefix="linkedin.com/in/" />
				</FormField>

				{/* X (Twitter) */}
				<FormField
					name="socialMedia.x"
					label="X (Twitter)"
					register={register}
					error={errors.socialMedia?.x?.message}
				>
					<LinkInput prefix="twitter.com/" />
				</FormField>

				{/* YouTube */}
				<FormField
					name="socialMedia.youtube"
					label="YouTube"
					register={register}
					error={errors.socialMedia?.youtube?.message}
				>
					<LinkInput prefix="youtube.com/@" />
				</FormField>

				{/* Facebook */}
				<FormField
					name="socialMedia.facebook"
					label="Facebook"
					register={register}
					error={errors.socialMedia?.facebook?.message}
				>
					<LinkInput prefix="facebook.com/" />
				</FormField>

				{/* Instagram */}
				<FormField
					name="socialMedia.instagram"
					label="Instagram"
					register={register}
					error={errors.socialMedia?.instagram?.message}
				>
					<LinkInput prefix="instagram.com/" />
				</FormField>

				{/* Behance */}
				<FormField
					name="socialMedia.behance"
					label="Behance"
					register={register}
					error={errors.socialMedia?.behance?.message}
				>
					<LinkInput prefix="behance.net/" />
				</FormField>

				{/* GitHub */}
				<FormField
					name="socialMedia.github"
					label="GitHub"
					register={register}
					error={errors.socialMedia?.github?.message}
				>
					<LinkInput prefix="github.com/" />
				</FormField>

				{/* TikTok */}
				<FormField
					name="socialMedia.tiktok"
					label="TikTok"
					register={register}
					error={errors.socialMedia?.tiktok?.message}
				>
					<LinkInput prefix="tiktok.com/@" />
				</FormField>

				{/* Additional Website */}
				<FormField
					name="socialMedia.additionalWebsite"
					label="Additional Website"
					register={register}
					error={errors.socialMedia?.additionalWebsite?.message}
				>
					<LinkInput prefix="https://" />
				</FormField>
			</div>
		</div>
	);
};

export default SocialsForm;
