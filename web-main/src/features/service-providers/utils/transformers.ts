import {
	SERVICE_PROVIDER_BUDGET_OPTIONS,
	SERVICE_PROVIDER_TIMELINE_OPTIONS,
} from "@/config/consts";
import { COMPANY_SIZE_OPTIONS } from "@/features/service-providers/config/consts";
import type { serviceProvidersContactFormSchema } from "@/features/service-providers/schemas/contact";
import type { ServiceProvider } from "@/types/payload";
import type { z } from "zod";
import type { serviceProviderFormSchema } from "../schemas/registration";
import type { serviceProvidersReviewFormSchema } from "../schemas/review";

type FormSchema = typeof serviceProviderFormSchema;
type FormData = z.infer<FormSchema>;

type FormDataBody = {
	id?: string;
	registrationProcessStatus?: ServiceProvider["registrationProcessStatus"];
	basicInformation?: [FormData["basicInformation"]];
	branding?: [FormData["branding"]];
	services?: [FormData["services"]];
	portfolio?: [FormData["portfolio"]];
	socialMedia?: [FormData["socialMedia"]];
	team?: [FormData["team"]];
};

// Add new type for review form data
type ReviewFormData = z.infer<typeof serviceProvidersReviewFormSchema> & {
	serviceProviderSlug: string;
};

type ContactFormData = z.infer<typeof serviceProvidersContactFormSchema> & {
	serviceProviderSlug: string;
};

const SOCIAL_MEDIA_BASES = {
	linkedin: "https://linkedin.com/company/",
	x: "https://x.com/",
	youtube: "https://youtube.com/",
	facebook: "https://facebook.com/",
	instagram: "https://instagram.com/",
	behance: "https://behance.net/",
	github: "https://github.com/",
	tiktok: "https://tiktok.com/@",
} as const;

function toFullUrl(
	platform: keyof typeof SOCIAL_MEDIA_BASES,
	value: string,
): string {
	if (!value) return "";
	if (value.startsWith("http")) return value;
	return `${SOCIAL_MEDIA_BASES[platform]}${value}`;
}

function extractUsername(
	platform: keyof typeof SOCIAL_MEDIA_BASES,
	url: string,
): string {
	if (!url) return "";
	if (!url.startsWith("http")) return url;
	return url.replace(SOCIAL_MEDIA_BASES[platform], "");
}

function validateAndFormatUrl(url: string | undefined): string {
	if (!url) return "";
	if (url.trim() === "") return "";

	try {
		// If it's already a valid URL, return it
		new URL(url);
		return url;
	} catch {
		// If it's not a valid URL, try adding https://
		try {
			new URL(`https://${url}`);
			return `https://${url}`;
		} catch {
			return ""; // Return empty string if URL is invalid
		}
	}
}

export function transformFormToCMS(formData: FormDataBody) {
	const transformedData: Partial<ServiceProvider> = {
		...(formData.id && { id: Number(formData.id) }),
		registrationProcessStatus: "In Progress",
	};

	// Handle basicInformation step
	if (formData.basicInformation?.[0]) {
		const basicInfo = formData.basicInformation[0];
		Object.assign(transformedData, {
			createdBy: "Service provider",
			providerName: basicInfo.providerName,
			foundedYear: Number(basicInfo.foundedYear),
			email: basicInfo.email.toLowerCase(),
			phoneNumber: basicInfo.phoneNumber,
			telegramUsername: basicInfo.telegramUsername,
			websiteUrl: basicInfo.websiteUrl?.startsWith("http")
				? basicInfo.websiteUrl
				: `https://${basicInfo.websiteUrl}`,
			addresses: [
				{
					addressType: "Headquarters",
					streetAddress1: basicInfo.streetAddress,
					city: basicInfo.city,
					state: basicInfo.state,
					postalCode: basicInfo.postalCode,
					country: basicInfo.country,
				},
			],
		});
	}

	// Handle branding step
	if (formData.branding?.[0]) {
		const brandingInfo = formData.branding[0];
		Object.assign(transformedData, {
			logo: typeof brandingInfo?.logo === "string" ? brandingInfo.logo : "",
			providerShortDescription: brandingInfo.shortDescription,
			providerDescription: brandingInfo.longDescription,
		});
	}

	// Handle services/categories step
	if (formData.services?.[0]) {
		Object.assign(transformedData, {
			categories: {
				categories: formData.services[0].categories.map(Number), // Parent categories array must exist
				subCategories: formData.services[0].subCategories.map(Number),
			},
		});
	}

	// Handle portfolio step
	if (formData.portfolio?.[0]) {
		const portfolioInfo = formData.portfolio[0];
		Object.assign(transformedData, {
			minimumBudget: portfolioInfo.minimumBudget.value,
			caseStudies: portfolioInfo.caseStudies?.map((study) => ({
				clientName: study.clientName,
				title: study.title,
				description: study.description,
				budget: study.budget.value,
				timeline: study.timeline.value,
				achievedMetrics: Array.isArray(study.achievedMetrics)
					? study.achievedMetrics.map((metric) => ({ metric }))
					: [],
				projectUrl: study.projectUrl
					? study.projectUrl.startsWith("http")
						? study.projectUrl
						: `https://${study.projectUrl}`
					: "",
				serviceCategories: {
					categories: study.serviceCategories
						.filter((category) => category.type === "category")
						.map((category) => Number(category.id)),
					subCategories: study.serviceCategories
						.filter((category) => category.type === "sub-category")
						.map((category) => Number(category.id)),
				},
			})),
		});
	}

	// Handle social media step
	if (formData.socialMedia?.[0]) {
		const socialInfo = formData.socialMedia[0];
		Object.assign(transformedData, {
			socialMediaLinks: {
				linkedin: toFullUrl("linkedin", socialInfo.linkedIn),
				customWeb: validateAndFormatUrl(socialInfo.additionalWebsite),
				twitter: toFullUrl("x", socialInfo.x),
				youtube: toFullUrl("youtube", socialInfo.youtube),
				facebook: toFullUrl("facebook", socialInfo.facebook),
				instagram: toFullUrl("instagram", socialInfo.instagram),
				behance: toFullUrl("behance", socialInfo.behance),
				github: toFullUrl("github", socialInfo.github),
			},
		});
	}

	// Handle team step
	if (formData.team?.[0]) {
		const teamInfo = formData.team[0];
		Object.assign(transformedData, {
			companySize: teamInfo.companySize.value,
			teamMembers: teamInfo.teamMembers?.map((member) => ({
				firstName: member.firstName,
				lastName: member.lastName,
				position: member.position,
				// image: member.image,
			})),
		});
	}

	return transformedData;
}

export function transformCMStoForm(cmsData: ServiceProvider): FormData {
	return {
		basicInformation: {
			providerName: cmsData.providerName,
			email: cmsData.email,
			foundedYear: cmsData?.foundedYear || 0,
			phoneNumber: cmsData.phoneNumber || "",
			telegramUsername: cmsData.telegramUsername || "",
			websiteUrl: (cmsData.websiteUrl || "").replace(/^https?:\/\//, ""),
			country: cmsData.addresses?.[0]?.country || "",
			state: cmsData.addresses?.[0]?.state || "",
			city: cmsData.addresses?.[0]?.city || "",
			streetAddress: cmsData.addresses?.[0]?.streetAddress1 || "",
			postalCode: cmsData.addresses?.[0]?.postalCode || "",
		},
		branding: {
			logo: null,
			shortDescription: cmsData.providerShortDescription || "",
			longDescription: cmsData.providerDescription || "",
		},
		services: {
			categories:
				cmsData.categories?.categories?.map((category) =>
					typeof category === "object" && category !== null
						? String(category.id)
						: String(category),
				) || [],
			subCategories:
				cmsData.categories?.subCategories?.map((subCategory) =>
					typeof subCategory === "object" && subCategory !== null
						? String(subCategory.id)
						: String(subCategory),
				) || [],
		},
		portfolio: {
			minimumBudget: SERVICE_PROVIDER_BUDGET_OPTIONS.find(
				(option) => option.value === cmsData.minimumBudget,
			),
			caseStudies:
				cmsData.caseStudies?.map((study) => ({
					clientName: study.clientName || "",
					title: study.title || "",
					description: study.description || "",
					budget: SERVICE_PROVIDER_BUDGET_OPTIONS.find(
						(option) => option.value === study.budget,
					),
					timeline: SERVICE_PROVIDER_TIMELINE_OPTIONS.find(
						(option) => option.value === study.timeline,
					),
					files: null,
					projectUrl: (study.projectUrl || "").replace(/^https?:\/\//, ""),
					achievedMetrics:
						study.achievedMetrics.map((metric) => metric.metric) || [],
					serviceCategories:
						study.serviceCategories?.categories?.flatMap((category) => [
							{
								id: String(category.id),
								value: String(category.id),
								label: category.name,
								type: "category",
							},
							...category.subCategories.map((subCategory) => ({
								id: String(subCategory.id),
								value: String(subCategory.id),
								label: subCategory.name,
								type: "sub-category",
							})),
						]) || [],
				})) || [],
		},
		socialMedia: {
			linkedIn: extractUsername(
				"linkedin",
				cmsData.socialMediaLinks?.linkedin || "",
			),
			additionalWebsite: (cmsData.socialMediaLinks?.customWeb || "").replace(
				/^https?:\/\//,
				"",
			),
			x: extractUsername("x", cmsData.socialMediaLinks?.twitter || ""),
			youtube: extractUsername(
				"youtube",
				cmsData.socialMediaLinks?.youtube || "",
			),
			facebook: extractUsername(
				"facebook",
				cmsData.socialMediaLinks?.facebook || "",
			),
			instagram: extractUsername(
				"instagram",
				cmsData.socialMediaLinks?.instagram || "",
			),
			behance: extractUsername(
				"behance",
				cmsData.socialMediaLinks?.behance || "",
			),
			github: extractUsername("github", cmsData.socialMediaLinks?.github || ""),
			tiktok: "", // TODO: Not present in CMS data
		},
		team: {
			companySize: COMPANY_SIZE_OPTIONS.find(
				(option) => option.value === cmsData.companySize,
			),
			teamMembers:
				cmsData.teamMembers?.map((member) => ({
					firstName: member.firstName || "",
					lastName: member.lastName || "",
					position: member.position || "",
					image: null,
				})) || [],
		},
	};
}

export function transformReviewFormToCMS(formData: ReviewFormData) {
	return {
		// Basic Information
		firstName: formData.basicInformation.firstName,
		lastName: formData.basicInformation.lastName,
		email: formData.basicInformation.email.toLowerCase(),
		phoneNumber: formData.basicInformation.phoneNumber,
		telegramUsername: formData.basicInformation.telegramUsername.startsWith("@")
			? formData.basicInformation.telegramUsername
			: `@${formData.basicInformation.telegramUsername}`,

		// Project Information
		project: {
			description: formData.project.description,
			budget: formData.project.budget.value as
				| "less_than_1k"
				| "1k_to_5k"
				| "5k_to_10k"
				| "10k_to_50k"
				| "50k_plus",
			timeline: formData.project.timeline.value as
				| "less_than_1_month"
				| "1_to_3_months"
				| "3_to_6_months"
				| "6_to_12_months"
				| "1_year_plus",
			// Transform services to array of relationships
			services: formData.project.services.map((service) => ({
				relationTo:
					service.type === "category" ? "categories" : "sub-categories",
				value: Number(service.value),
			})),
			// file will be handled by the upload flow
			file: null,
			proofOfPaymentUrl: formData.project.proofOfPaymentUrl,
		},

		// Review Information
		review: {
			rating: formData.review.rating,
			review: formData.review.review,
		},

		// Cashback Information
		cashback: {
			crypto: formData.cashback.crypto.value as "BSC" | "ERC-20",
			walletAddress: formData.cashback.walletAddress,
		},

		// Metadata
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};
}

export function transformContactFormToCMS(formData: ContactFormData) {
	return {
		// Basic Information
		firstName: formData.basicInformation.firstName,
		lastName: formData.basicInformation.lastName,
		email: formData.basicInformation.email.toLowerCase(),
		telegramUsername: formData.basicInformation.telegramUsername.startsWith("@")
			? formData.basicInformation.telegramUsername
			: `@${formData.basicInformation.telegramUsername}`,

		// Project Information
		project: {
			description: formData.project.description,
			additionalDescription: formData.project.additionalDetails,
			budget: formData.project.budget?.value as
				| "less_than_1k"
				| "1k_to_5k"
				| "5k_to_10k"
				| "10k_to_50k"
				| "50k_plus",
			timeline: formData.project.timeline?.value as
				| "less_than_1_month"
				| "1_to_3_months"
				| "3_to_6_months"
				| "6_to_12_months"
				| "1_year_plus",
			services: formData.project.services.map((service) => ({
				relationTo:
					service.type === "category" ? "categories" : "sub-categories",
				value: Number(service.value),
			})),
			file: null, // Will be handled by upload flow
		},

		// Cashback Information
		cashback: {
			crypto: formData.cashback.crypto?.value as "BSC" | "ERC-20",
			walletAddress: formData.cashback.walletAddress,
		},

		// Metadata
		createdAt: new Date().toISOString(),
	};
}
