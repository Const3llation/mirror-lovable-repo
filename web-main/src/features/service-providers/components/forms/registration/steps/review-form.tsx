"use client";

import { SERVICE_PROVIDER_BUDGET_OPTIONS } from "@/config/consts";
import ProviderProfile from "@/features/service-providers/components/profile/provider-profile";
import ProviderProfileSkeleton from "@/features/service-providers/components/profile/provider-profile-skeleton";
import { useUpload } from "@/features/service-providers/context/upload-context";
import { useDialogContext } from "@/providers/dialog-providers";
import { DialogType } from "@/types/dialogs";
import type {
	Category,
	ServiceProvider,
	SubCategory,
	TeamMember,
} from "@/types/payload";
import stringToSlug from "@/utils/string-to-slug";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

// TODO: This should probably be moved to different folder
// Create a context-based hook to access form navigation
const useFormNavigation = () => {
	const context = useFormContext();

	// Access the form navigation functions from the context
	// These would be set by create-service-provider-form.tsx
	const formNavigation = (context as unknown)?._formNavigation;

	if (!formNavigation) {
		throw new Error("Form navigation context not found");
	}

	return {
		goToNext: formNavigation.goToNext,
		goToPrevious: formNavigation.goToPrevious,
		isSubmitting: formNavigation.isSubmitting,
		openVerifyModal: formNavigation.openVerifyModal,
		handleFormCompletion: formNavigation.handleFormCompletion,
	};
};

// TODO: This should probably be moved to different folder
export const useProviderPreview = (slug: string) => {
	const [data, setData] = useState<ServiceProvider | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_CMS_URL}/api/providers?slug=${slug}&depth=2`,
				);

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const { docs } = await response.json();
				setData(docs[0]);
			} catch (err) {
				setError(
					err instanceof Error
						? err
						: new Error("Failed to fetch provider data"),
				);
			} finally {
				setIsLoading(false);
			}
		};

		if (slug) {
			fetchData();
		}
	}, [slug]);

	return { data, isLoading, error };
};

const getImageToDisplay = (
	filesToUpload: Map<string, { file: File }>,
	index: number,
) => {
	return filesToUpload.get(`portfolio.caseStudies.${index}.images.0`)?.file;
};

const ReviewForm = () => {
	const { watch } = useFormContext();
	const formData = watch();
	const slug = stringToSlug(formData.basicInformation.providerName);
	const { openDialog } = useDialogContext();

	const { data, isLoading, error } = useProviderPreview(slug);
	const { goToPrevious, handleFormCompletion } = useFormNavigation();

	// Portfolio images and files are not saved in the form data, so we need to get them from the upload context
	const { filesToUpload } = useUpload();

	if (error) {
		return <div>Error loading preview: {error.message}</div>;
	}

	if (isLoading || !data) {
		return <ProviderProfileSkeleton />;
	}

	const isVerified = data.visibility?.status === "Verified";

	const handleGoToPreviousStep = () => {
		goToPrevious();
	};

	const handleGoToNextStep = () => {
		openDialog(DialogType.VERIFY_EMAIL, {
			email: formData.basicInformation.email,
			handleFormCompletion: handleFormCompletion,
		});
	};

	return (
		<div className="mt-24 md:mt-14">
			<ProviderProfile
				isPreview={true}
				onPrevious={handleGoToPreviousStep}
				onSubmit={handleGoToNextStep}
				highlights={{
					slug,
					isVerified,
					logo: formData.branding.logo,
					providerName: data.providerName,
					foundedYear: data.foundedYear ?? "Undisclosed",
					location: data.addresses?.[0]?.city ?? "Undisclosed",
					companySize: data.companySize ?? "Undisclosed",
					minimumBudget:
						SERVICE_PROVIDER_BUDGET_OPTIONS.find(
							(budget) => budget.value === data.minimumBudget,
						)?.label ?? "Undisclosed",
					websiteUrl: data.websiteUrl,
					findings: data.findings,
					socialMediaLinks: data.socialMediaLinks,
					description: data.providerDescription,
					teamMembers: data.teamMembers.map(
						(teamMember: unknown, index: number) => ({
							name: `${teamMember.firstName} ${teamMember.lastName}`,
							position: teamMember.position,
							image: formData.team.teamMembers[index].image,
						}),
					) as TeamMember[],
					totalRating: data.reviewsAverage,
				}}
				services={{
					providerName: data.providerName,
					services: data.categories.categories.map((category: Category) => ({
						name: category.name,
						icon: category.icon,
						serviceItems: (category.subCategories as SubCategory[])?.map(
							(subCategory: SubCategory) => subCategory.name,
						),
					})),
				}}
				portfolio={{
					slug,
					items: data.caseStudies.map(
						(
							caseStudy: NonNullable<ServiceProvider["caseStudies"]>[number],
							index: number,
						) => ({
							title: caseStudy.title,
							clientName: caseStudy.clientName,
							category: caseStudy.serviceCategories?.categories?.[0],
							url: caseStudy.projectUrl,
							caseStudySlug: caseStudy.caseStudySlug,
							achievedMetrics: caseStudy.achievedMetrics?.map(
								// @ts-ignore
								({ id, metric }: AchievedMetrics) => ({
									id,
									metric,
								}),
							),
							image: getImageToDisplay(filesToUpload, index),
						}),
					),
				}}
				reviews={{
					slug,
					items: [
						{
							fullName: "John Doe",
							rating: 4.8,
							review:
								"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
							category: "Marketing, PR & Brand",
							createdAt: new Date(),
						},
						{
							fullName: "Jane Smith",
							rating: 4.5,
							review:
								"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
							category: "Marketing, PR & Brand",
							createdAt: new Date("1995-12-17T03:24:00"),
						},
						{
							fullName: "Alice Johnson",
							rating: 4.7,
							review:
								"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
							category: "Marketing, PR & Brand",
							createdAt: new Date(2020, 11, 11),
						},
						{
							fullName: "Bob Brown",
							rating: 4.9,
							review:
								"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
							category: "Marketing, PR & Brand",
							createdAt: new Date(2020, 11, 11),
						},
						{
							fullName: "Charlie Davis",
							rating: 4.6,
							review:
								"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
							category: "Marketing, PR & Brand",
							createdAt: new Date(2020, 11, 11),
						},
						{
							fullName: "Diana Evans",
							rating: 4.8,
							review:
								"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
							category: "Marketing, PR & Brand",
							createdAt: new Date(2020, 11, 11),
						},
					],
				}}
			/>
		</div>
	);
};

export default ReviewForm;
