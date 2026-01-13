import {
	CRYPTO_OPTIONS,
	SERVICE_PROVIDER_BUDGET_OPTIONS,
	SERVICE_PROVIDER_TIMELINE_OPTIONS,
} from "@/config/consts";
import { COMPANY_SIZE_OPTIONS } from "@/features/service-providers/config/consts";
import {
	isAdmin,
	isInfrastructure,
} from "@/features/auth/api/access/baseAccess";
import { revalidationHook } from "@/hooks/revalidation";
import { getSupportedCountriesOptions } from "@/utils/country";
import stringToSlug from "@/utils/string-to-slug";
import {
	createPayloadEmailValidator,
	createPayloadStringLengthValidator,
	createPayloadUrlValidator,
} from "@/utils/validators";
import type { CollectionConfig } from "payload";
const SERVICE_PROVIDERS_GROUP = "Service providers";

const FIELD_NAMES = {
	PROVIDER_NAME: "providerName",
	SLUG: "slug",
	CASE_STUDY_SLUG: "caseStudySlug",
	REGISTRATION_PROCESS_STATUS: "registrationProcessStatus",
	FOUNDED_YEAR: "foundedYear",
	LOGO: "logo",
	EMAIL: "email",
	PHONE_NUMBER: "phoneNumber",
	TELEGRAM_USERNAME: "telegramUsername",
	COMPANY_SIZE: "companySize",
	PROVIDER_SHORT_DESCRIPTION: "providerShortDescription",
	PROVIDER_DESCRIPTION: "providerDescription",
	WEBSITE_URL: "websiteUrl",
	STATUS: "status",
	PUBLISHED: "published",
	FEATURED: "featured",
	WAITING_FOR_MODERATION: "waitingForModeration",
	CREATED_BY: "createdBy",
	MINIMUM_BUDGET: "minimumBudget",
	CASE_STUDIES: "caseStudies",
	CATEGORIES: "categories",
	SUB_CATEGORIES: "subCategories",
	TEAM_MEMBERS: "teamMembers",
	SOCIAL_MEDIA_LINKS: "socialMediaLinks",
	ADDRESSES: "addresses",
	CREATED_AT: "createdAt",
	UPDATED_AT: "updatedAt",
	FINDINGS: "findings",
	REVIEWS_COUNT: "reviewsCount",
	REVIEWS_AVERAGE: "reviewsAverage",
} as const;

export const ServiceProviders: CollectionConfig = {
	slug: "service-providers",
	defaultSort: "-createdAt",
	access: {
		read: (req) => isAdmin(req) || isInfrastructure(req),
		create: (req) => isAdmin(req) || isInfrastructure(req),
		update: (req) => isAdmin(req) || isInfrastructure(req),
		delete: (req) => isAdmin(req) || isInfrastructure(req),
	},
	admin: {
		group: SERVICE_PROVIDERS_GROUP,
		defaultColumns: [
			FIELD_NAMES.PROVIDER_NAME,
			FIELD_NAMES.STATUS,
			FIELD_NAMES.PUBLISHED,
			FIELD_NAMES.WAITING_FOR_MODERATION,
			FIELD_NAMES.CREATED_BY,
			FIELD_NAMES.CREATED_AT,
			FIELD_NAMES.UPDATED_AT,
		],
		listSearchableFields: [FIELD_NAMES.PROVIDER_NAME],
		useAsTitle: FIELD_NAMES.PROVIDER_NAME,
	},
	fields: [
		{
			name: FIELD_NAMES.CREATED_BY,
			type: "select",
			options: ["Admin", "Service provider"],
			defaultValue: "Admin",
			admin: {
				readOnly: true,
			},
		},
		{
			name: FIELD_NAMES.REGISTRATION_PROCESS_STATUS,
			type: "select",
			options: ["In Progress", "Completed"],
			defaultValue: "In Progress",
			admin: {
				description:
					"This field helps us figure out which providers are still in the process of registering their profile.",
			},
		},
		{
			name: FIELD_NAMES.PROVIDER_NAME,
			label: "Company Name",
			type: "text",
			required: true,
			unique: true,
		},
		{
			name: FIELD_NAMES.SLUG,
			type: "text",
			admin: {
				readOnly: true,
				description:
					"This field is automatically generated from the company name. eg. My Company -> my-company",
			},
			hooks: {
				beforeChange: [
					({ siblingData }) => {
						if (siblingData.providerName) {
							return stringToSlug(siblingData.providerName);
						}
						return undefined;
					},
				],
			},
		},
		{
			name: FIELD_NAMES.FOUNDED_YEAR,
			type: "number",
		},
		{
			name: FIELD_NAMES.LOGO,
			label: "Logo",
			type: "relationship",
			relationTo: ["image-uploads", "remote-file-uploads"],
			filterOptions: ({ relationTo }) => {
				if (relationTo === "remote-file-uploads") {
					return {
						type: { equals: "image" },
					};
				}
				return true;
			},
		},
		{
			name: FIELD_NAMES.PROVIDER_SHORT_DESCRIPTION,
			type: "textarea",
			label: "Short description",
		},
		{
			name: FIELD_NAMES.PROVIDER_DESCRIPTION,
			type: "textarea",
			label: "Description",
		},
		{
			name: FIELD_NAMES.WEBSITE_URL,
			type: "text",
			label: "Website URL",
			validate: createPayloadUrlValidator(),
		},
		{
			name: FIELD_NAMES.EMAIL,
			type: "email",
			label: "Work email",
			validate: createPayloadEmailValidator(),
			required: true,
			unique: true,
		},
		// TODO: Maybe country selection for phone number
		{
			name: FIELD_NAMES.PHONE_NUMBER,
			type: "text",
			label: "Phone Number",
		},
		{
			name: FIELD_NAMES.TELEGRAM_USERNAME,
			type: "text",
			label: "Telegram Username",
		},
		{
			name: FIELD_NAMES.SOCIAL_MEDIA_LINKS,
			type: "group",
			fields: [
				{
					name: "linkedin",
					label: "LinkedIn",
					type: "text",
					validate: createPayloadUrlValidator({ optional: true }),
				},
				{
					name: "twitter",
					label: "Twitter",
					type: "text",
					validate: createPayloadUrlValidator({ optional: true }),
				},
				{
					name: "youtube",
					label: "YouTube",
					type: "text",
					validate: createPayloadUrlValidator({ optional: true }),
				},
				{
					name: "facebook",
					label: "Facebook",
					type: "text",
					validate: createPayloadUrlValidator({ optional: true }),
				},
				{
					name: "instagram",
					label: "Instagram",
					type: "text",
					validate: createPayloadUrlValidator({ optional: true }),
				},
				{
					name: "behance",
					label: "Behance",
					type: "text",
					validate: createPayloadUrlValidator({ optional: true }),
				},
				{
					name: "github",
					label: "GitHub",
					type: "text",
					validate: createPayloadUrlValidator({ optional: true }),
				},
				{
					name: "customWeb",
					label: "Custom Website",
					type: "text",
					validate: createPayloadUrlValidator({ optional: true }),
				},
			],
		},
		{
			name: FIELD_NAMES.ADDRESSES,
			type: "array",
			fields: [
				{
					name: "addressType",
					type: "select",
					options: ["Headquarters", "Branch"],
				},
				{
					name: "streetAddress1",
					label: "Street Address 1",
					type: "text",
				},
				{
					name: "streetAddress2",
					label: "Street Address 2 (optional)",
					type: "text",
				},
				{
					name: "city",
					type: "text",
				},
				{
					name: "state",
					type: "text",
				},
				{
					name: "postalCode",
					type: "text",
				},
				{
					name: "country",
					type: "select",
					options: getSupportedCountriesOptions(),
				},
			],
		},
		{
			name: FIELD_NAMES.MINIMUM_BUDGET,
			type: "select",
			options: SERVICE_PROVIDER_BUDGET_OPTIONS,
		},
		{
			name: FIELD_NAMES.CASE_STUDIES,
			type: "array",
			admin: {
				description: "Add case studies for this service provider",
			},
			fields: [
				{
					name: "clientName",
					type: "text",
				},
				{
					name: "title",
					label: "Project name",
					type: "text",
				},
				{
					name: "budget",
					type: "select",
					options: SERVICE_PROVIDER_BUDGET_OPTIONS,
				},
				{
					name: "timeline",
					type: "select",
					options: SERVICE_PROVIDER_TIMELINE_OPTIONS,
				},

				{
					name: FIELD_NAMES.CASE_STUDY_SLUG,
					type: "text",
					admin: {
						readOnly: true,
						description:
							"This field is automatically generated from the project name. eg. My Project -> my-project",
					},
					hooks: {
						beforeChange: [
							({ siblingData }) => {
								if (siblingData.title) {
									return siblingData.title
										.toLowerCase()
										.replace(/[^a-zA-Z0-9]/g, "-")
										.replace(/-+/g, "-")
										.replace(/^-|-$/g, "");
								}
								return undefined;
							},
						],
					},
				},
				{
					name: "description",
					label: "Project description",
					type: "textarea",
				},
				{
					name: "projectUrl",
					label: "Project URL",
					type: "text",
					validate: createPayloadUrlValidator({ optional: true }),
				},
				{
					name: "files",
					label: "Attached files",
					type: "relationship",
					relationTo: ["file-uploads", "remote-file-uploads"],
					hasMany: true,
					filterOptions: ({ relationTo }) => {
						if (relationTo === "remote-file-uploads") {
							return {
								type: { equals: "document" },
							};
						}
						return true;
					},
				},
				{
					name: "images",
					label: "Attached images",
					type: "relationship",
					relationTo: ["image-uploads", "remote-file-uploads"],
					hasMany: true,
					filterOptions: ({ relationTo }) => {
						if (relationTo === "remote-file-uploads") {
							return {
								type: { equals: "image" },
							};
						}
						return true;
					},
				},
				{
					name: "serviceCategories",
					type: "group",
					fields: [
						{
							name: "categories",
							type: "relationship",
							relationTo: "categories",
							hasMany: true,
							admin: {
								description:
									"Select the service categories this case study belongs to",
							},
						},
						{
							name: "subCategories",
							type: "relationship",
							relationTo: "sub-categories",
							hasMany: true,
							admin: {
								description:
									"Select the sub-categories this case study belongs to",
							},
						},
					],
				},
				{
					name: "achievedMetrics",
					type: "array",
					fields: [
						{
							name: "metric",
							type: "text",
							validate: createPayloadStringLengthValidator({
								min: 10,
								max: 600,
								errorMessage:
									"Metrics text must be between 10 and 600 characters long.",
							}),
						},
					],
				},
			],
		},
		{
			name: FIELD_NAMES.COMPANY_SIZE,
			type: "select",
			options: COMPANY_SIZE_OPTIONS,
		},
		{
			name: FIELD_NAMES.TEAM_MEMBERS,
			type: "array",
			admin: {
				description: "Add team members for this service provider",
			},
			fields: [
				{
					name: "firstName",
					type: "text",
				},
				{
					name: "lastName",
					type: "text",
				},
				{
					name: "position",
					type: "text",
				},
				{
					name: "image",
					type: "relationship",
					relationTo: ["image-uploads", "remote-file-uploads"],
					filterOptions: ({ relationTo }) => {
						if (relationTo === "remote-file-uploads") {
							return {
								type: { equals: "image" },
							};
						}
						return true;
					},
				},
			],
		},
		{
			name: "visibility",
			type: "group",
			fields: [
				{
					name: FIELD_NAMES.FEATURED,
					type: "select",
					options: ["Yes", "No"],
					defaultValue: "No",
				},
				{
					name: FIELD_NAMES.STATUS,
					type: "select",
					options: ["Verified", "Unverified"],
					defaultValue: "Unverified",
				},

				{
					name: FIELD_NAMES.PUBLISHED,
					type: "select",
					options: ["Yes", "No"],
					defaultValue: "No",
				},
				{
					name: FIELD_NAMES.WAITING_FOR_MODERATION,
					type: "select",
					options: ["Yes", "No"],
					defaultValue: "Yes",
				},
			],
		},
		{
			name: "categories",
			type: "group",
			fields: [
				{
					name: "categories",
					type: "relationship",
					relationTo: "categories",
					hasMany: true,
					admin: {
						description:
							"Select the categories this service provider belongs to",
					},
				},
				{
					name: "subCategories",
					type: "relationship",
					relationTo: "sub-categories",
					hasMany: true,
					admin: {
						description:
							"Select the sub-categories this service provider belongs to",
					},
				},
			],
		},
		{
			name: FIELD_NAMES.FINDINGS,
			type: "array",
			fields: [
				{
					name: "title",
					type: "text",
					required: true,
				},
				{
					name: "text",
					type: "text",
					required: true,
				},
			],
		},
		{
			name: FIELD_NAMES.REVIEWS_COUNT,
			type: "number",
			admin: {
				readOnly: true,
			},
		},
		{
			name: FIELD_NAMES.REVIEWS_AVERAGE,
			type: "number",
			admin: {
				readOnly: true,
			},
		},
	],
	hooks: {
		beforeDelete: [
			async ({ req, id }) => {
				try {
					await req.payload.delete({
						collection: "provider-reviews",
						where: {
							serviceProvider: { equals: id },
						},
						overrideAccess: true,
					});
				} catch (error) {
					console.error("Error deleting provider reviews:", error);
				}
			},
		],
		afterChange: [revalidationHook],
	},
};

export const VerifyProvidersForm: CollectionConfig = {
	slug: "verify-providers",
	labels: {
		plural: "Verification requests",
		singular: "Verification request",
	},
	admin: {
		group: SERVICE_PROVIDERS_GROUP,
		defaultColumns: [
			"firstName",
			"lastName",
			"workEmail",
			"jobPosition",
			"createdAt",
		],
		useAsTitle: "workEmail",
	},
	fields: [
		{
			name: "firstName",
			type: "text",
			required: true,
		},
		{
			name: "lastName",
			type: "text",
			required: true,
		},
		{
			name: "workEmail",
			type: "email",
			required: true,
		},
		{
			name: "jobPosition",
			type: "text",
			required: true,
		},
		{
			name: "serviceProvider",
			type: "relationship",
			relationTo: "service-providers",
			required: true,
			admin: {
				description:
					"Select the service provider this verification request is for",
			},
		},
		{
			name: "note",
			type: "textarea",
			required: true,
		},
		{
			name: "status",
			type: "select",
			defaultValue: "Pending",
			options: ["Pending", "Approved", "Rejected"],
			admin: {
				description: "Status of the verification request",
			},
		},
	],
	access: {
		create: () => true,
		read: () => true,
	},
	hooks: {
		afterChange: [
			async ({ doc, operation, previousDoc, req }) => {
				// Only proceed if this is an update operation and status changed to "Approved"
				if (
					operation === "update" &&
					doc.status === "Approved" &&
					previousDoc.status !== "Approved"
				) {
					try {
						await req.payload.update({
							collection: "service-providers",
							id: doc.serviceProvider,
							data: {
								visibility: {
									status: "Verified",
								},
							},
						});
					} catch (error) {
						console.error(
							"Error updating service provider verification status:",
							error,
						);
					}
				}
			},
		],
	},
};

export const VerifyProvidersEmail: CollectionConfig = {
	slug: "verify-providers-email",
	admin: {
		group: SERVICE_PROVIDERS_GROUP,
		defaultColumns: ["email", "status", "createdAt", "expiresAt"],
	},
	labels: {
		plural: "Verified e-mails",
		singular: "Verified e-mail",
	},
	fields: [
		{
			name: "email",
			type: "email",
			required: true,
		},
		{
			name: "verificationCode",
			type: "text",
			required: true,
			maxLength: 5,
			minLength: 5,
			admin: {
				description: "5-digit verification code sent to user's email",
				readOnly: true,
			},
		},
		{
			name: "attempts",
			type: "number",
			defaultValue: 0,
			admin: {
				description: "Number of failed verification attempts",
				readOnly: true,
			},
		},
		{
			name: "maxAttempts",
			type: "number",
			defaultValue: 3,
			admin: {
				description:
					"Maximum allowed verification attempts before code invalidation",
				readOnly: true,
			},
		},
		{
			name: "status",
			type: "select",
			options: ["Pending", "Verified", "Expired", "MaxAttemptsReached"],
			defaultValue: "Pending",
			admin: {
				description: "Status of the verification request",
			},
		},
		{
			name: "createdAt",
			type: "date",
			admin: {
				readOnly: true,
				date: {
					pickerAppearance: "dayAndTime",
					displayFormat: "MMM d, yyyy h:mm a",
				},
			},
		},
		{
			name: "expiresAt",
			type: "date",
			admin: {
				description:
					"Verification code expiry timestamp (15 minutes from creation)",
				readOnly: true,
				date: {
					pickerAppearance: "dayAndTime",
					displayFormat: "MMM d, yyyy h:mm a",
				},
			},
		},
	],
	hooks: {
		beforeChange: [
			({ data }) => {
				// Set expiry to 15 minutes from now for new verification requests
				if (!data.expiresAt) {
					const expiryDate = new Date();
					expiryDate.setMinutes(expiryDate.getMinutes() + 15);
					data.expiresAt = expiryDate;
				}
				return data;
			},
		],
	},
	access: {
		create: () => true,
		read: () => true,
		update: () => true,
		// TODO: Authorized
		delete: () => true,
	},
};

export const ProviderReviews: CollectionConfig = {
	slug: "provider-reviews",
	admin: {
		group: SERVICE_PROVIDERS_GROUP,
		defaultColumns: [
			"firstName",
			"lastName",
			"email",
			"serviceProvider",
			"rating",
			"createdAt",
		],
		useAsTitle: "email",
	},
	labels: {
		plural: "Reviews",
		singular: "Review",
	},
	fields: [
		{
			name: "serviceProvider",
			type: "relationship",
			relationTo: "service-providers",
			required: true,
			admin: {
				description: "Select the service provider this review is for",
			},
		},

		// Basic Information
		{
			name: "firstName",
			type: "text",
			required: true,
		},
		{
			name: "lastName",
			type: "text",
			required: true,
		},
		{
			name: "email",
			type: "email",
			required: true,
		},
		{
			name: "phoneNumber",
			type: "text",
			required: true,
		},
		{
			name: "telegramUsername",
			type: "text",
			required: true,
		},

		// Project Information
		{
			name: "project",
			type: "group",
			fields: [
				{
					name: "description",
					type: "textarea",
					required: true,
				},
				{
					name: "budget",
					type: "select",
					required: true,
					options: SERVICE_PROVIDER_BUDGET_OPTIONS,
				},
				{
					name: "timeline",
					type: "select",
					required: true,
					options: SERVICE_PROVIDER_TIMELINE_OPTIONS,
				},
				{
					name: "services",
					type: "relationship",
					relationTo: ["categories", "sub-categories"],
					hasMany: true,
					required: true,
				},
				{
					name: "proofOfPaymentUrl",
					type: "text",
				},
				{
					name: "file",
					type: "relationship",
					relationTo: ["file-uploads", "image-uploads", "remote-file-uploads"],
					filterOptions: ({ relationTo }) => {
						if (relationTo === "remote-file-uploads") {
							return {
								type: { equals: "document" },
							};
						}
					},
				},
			],
		},

		// Review Information
		{
			name: "review",
			type: "group",
			fields: [
				{
					name: "rating",
					type: "number",
					required: true,
					min: 1,
					max: 5,
				},
				{
					name: "review",
					type: "textarea",
					required: true,
				},
			],
		},

		// Cashback Information
		{
			name: "cashback",
			type: "group",
			fields: [
				{
					name: "crypto",
					type: "select",
					required: true,
					options: CRYPTO_OPTIONS,
				},
				{
					name: "walletAddress",
					type: "text",
					required: true,
				},
			],
		},

		{
			name: "status",
			type: "select",
			defaultValue: "pending",
			options: [
				{ label: "Pending", value: "pending" },
				{ label: "Verified", value: "verified" },
				{ label: "Rejected", value: "rejected" },
			],
		},

		// Metadata
		{
			name: "createdAt",
			type: "date",
			admin: {
				readOnly: true,
				date: {
					pickerAppearance: "dayAndTime",
					displayFormat: "MMM d, yyyy h:mm a",
				},
			},
		},
	],
	hooks: {
		afterChange: [
			async ({ doc, operation, req }) => {
				if (
					operation !== "create" &&
					operation !== "update" &&
					doc.status !== "Verified"
				)
					return;

				const serviceProviderId =
					doc?.serviceProvider?.id ?? doc?.serviceProvider;
				const currentRating = doc?.review?.rating;

				if (!serviceProviderId || !currentRating) return;

				// Run the statistics update asynchronously
				// TODO: Add a queue to handle this
				void (async () => {
					try {
						const reviews = await req.payload.find({
							collection: "provider-reviews",
							where: {
								and: [
									{ serviceProvider: { equals: serviceProviderId } },
									{ id: { not_equals: doc.id } },
								],
							},
							overrideAccess: true,
						});

						const reviewsCount = reviews.totalDocs + 1;
						const totalRating = reviews.docs.reduce(
							(sum, review) => sum + (review.review?.rating || 0),
							currentRating,
						);
						const reviewsAverage = totalRating / reviewsCount;

						await req.payload.update({
							collection: "service-providers",
							id: serviceProviderId,
							data: {
								reviewsCount,
								reviewsAverage: Number(reviewsAverage.toFixed(2)),
							},
						});
					} catch (error) {
						console.error("Error updating provider statistics:", error);
					}
				})();
			},
		],
		afterDelete: [
			async ({ doc, req }) => {
				const serviceProviderId = doc.serviceProvider?.id;
				const currentRating = doc.review?.rating;

				if (!serviceProviderId || !currentRating) return;

				// Run the statistics update asynchronously
				void (async () => {
					try {
						const reviews = await req.payload.find({
							collection: "provider-reviews",
							where: {
								serviceProvider: { equals: serviceProviderId },
							},
							overrideAccess: true,
						});

						const reviewsCount = reviews.totalDocs - 1;

						const reviewsAverage =
							reviewsCount === 0
								? 0
								: Number(
										(
											reviews.docs.reduce(
												(sum, review) => sum + (review.review?.rating || 0),
												0,
											) / reviewsCount
										).toFixed(2),
									);

						await req.payload.update({
							collection: "service-providers",
							id: serviceProviderId,
							data: {
								reviewsCount,
								reviewsAverage,
							},
						});
					} catch (error) {
						console.error(
							"Error updating provider statistics after delete:",
							error,
						);
					}
				})();
			},
		],
	},
	access: {
		create: () => true,
		read: () => true,
	},
};

export const ProviderContacts: CollectionConfig = {
	slug: "provider-contacts",
	admin: {
		group: SERVICE_PROVIDERS_GROUP,
		defaultColumns: [
			"firstName",
			"lastName",
			"email",
			"serviceProvider",
			"rating",
			"createdAt",
		],
		useAsTitle: "email",
	},
	labels: {
		plural: "Contacts",
		singular: "Contact",
	},
	fields: [
		{
			name: "serviceProvider",
			type: "relationship",
			relationTo: "service-providers",
			required: true,
			admin: {
				description: "Select the service provider this review is for",
			},
		},

		// Basic Information
		{
			name: "firstName",
			type: "text",
			required: true,
		},
		{
			name: "lastName",
			type: "text",
			required: true,
		},
		{
			name: "email",
			type: "email",
			required: true,
		},
		{
			name: "telegramUsername",
			type: "text",
			required: true,
		},

		// Project Information
		{
			name: "project",
			type: "group",
			fields: [
				{
					name: "description",
					type: "textarea",
					required: true,
				},
				{
					name: "additionalDescription",
					type: "textarea",
					required: true,
				},
				{
					name: "budget",
					type: "select",
					required: true,
					options: SERVICE_PROVIDER_BUDGET_OPTIONS,
				},
				{
					name: "timeline",
					type: "select",
					required: true,
					options: SERVICE_PROVIDER_TIMELINE_OPTIONS,
				},
				{
					name: "services",
					type: "relationship",
					relationTo: ["categories", "sub-categories"],
					hasMany: true,
					required: true,
				},
				{
					name: "file",
					type: "relationship",
					relationTo: ["file-uploads", "image-uploads", "remote-file-uploads"],
					filterOptions: ({ relationTo }) => {
						if (relationTo === "remote-file-uploads") {
							return {
								type: { equals: "document" },
							};
						}
					},
				},
			],
		},

		// Cashback Information
		{
			name: "cashback",
			type: "group",
			fields: [
				{
					name: "crypto",
					type: "select",
					required: true,
					options: CRYPTO_OPTIONS,
				},
				{
					name: "walletAddress",
					type: "text",
					required: true,
				},
			],
		},

		// Metadata
		{
			name: "status",
			type: "select",
			defaultValue: "pending",
			options: [
				{ label: "Pending", value: "pending" },
				{ label: "Completed", value: "completed" },
			],
		},
		{
			name: "completedAt",
			type: "date",
			admin: {
				readOnly: true,
			},
		},
		{
			name: "createdAt",
			type: "date",
			admin: {
				readOnly: true,
				date: {
					pickerAppearance: "dayAndTime",
					displayFormat: "MMM d, yyyy h:mm a",
				},
			},
		},
	],
	access: {
		create: () => true,
		read: () => true,
	},
};
