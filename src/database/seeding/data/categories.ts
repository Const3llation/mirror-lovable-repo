// @ts-nocheck

import type { Category } from "@/types/payload";

const createSlug = (name: string): string =>
	name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");

export const categoriesSeed: Category[] = [
	{
		name: "Marketing",
		slug: "marketing",
		icon: "Ads",
		subCategories: [
			{ name: "KOL Marketing" },
			{ name: "Social Media Management & Content Creation" },
			{ name: "PR & Brand Strategy" },
			{ name: "Community Management" },
			{ name: "SEO" },
			{ name: "Paid Advertisement" },
		],
	},
	{
		name: "Legal",
		slug: "legal",
		icon: "Notepad",
		subCategories: [
			{ name: "Regulatory Compliance" },
			{ name: "Intellectual Property and Contractual Law" },
			{ name: "Data Protection and Privacy" },
			{ name: "Risk and Governance" },
		],
	},
	{
		name: "Accounting & Finance",
		slug: "accounting-finance",
		icon: "WalletCards",
		subCategories: [
			{ name: "Tax Advisory" },
			{ name: "Financial Planning" },
			{ name: "Audits & Assurance" },
			{ name: "Investor Relations & Capital Management" },
		],
	},
	{
		name: "Design & Development",
		slug: "design-development",
		icon: "Pencil",
		subCategories: [
			{ name: "UI/UX Design" },
			{ name: "User Experience & Customer Insights" },
			{ name: "Web & App Development" },
			{ name: "Smart Contract Development" },
			{ name: "NFT & Digital Asset Creation" },
			{ name: "Blockchain Development & Integration" },
		],
	},
	{
		name: "Security & Auditing",
		slug: "security-auditing",
		icon: "ShieldCheck",
		subCategories: [
			{ name: "Smart Contract Security Audits" },
			{ name: "Security Compliance & Risk Assessment" },
			{ name: "Quality Assurance (QA) Testing" },
		],
	},
	{
		name: "Growth & Strategy",
		slug: "growth-strategy",
		icon: "PresentationCharts",
		subCategories: [
			{ name: "Business Development & Partnerships" },
			{ name: "Go-to-Market Strategy" },
			{ name: "Market Research & Analysis" },
			{ name: "Data & Analytics" },
			{ name: "Accelerators and Incubators" },
		],
	},
	{
		name: "Operations & Management",
		slug: "operations-management",
		icon: "ContactRound",
		subCategories: [
			{ name: "Project Management" },
			{ name: "Supply Chain Management (for physical products or NFTs)" },
			{ name: "Human Resources & Recruiting" },
			{ name: "Event Management" },
		],
	},
	{
		name: "Customer Support",
		slug: "customer-support",
		icon: "Headset",
		subCategories: [],
	},
	{
		name: "Sales & Business Development",
		slug: "sales-business-development",
		icon: "Tag",
		subCategories: [
			{ name: "Lead Generation & Prospecting" },
			{ name: "Account Management" },
		],
	},
	{
		name: "Fundraising & Venture Support",
		slug: "fundraising-venture-support",
		icon: "HandCoins",
		subCategories: [
			{ name: "Venture Capital & Investor Relations" },
			{ name: "Crowdfunding & Token Sale Advisory" },
		],
	},
	{
		name: "Token Listings",
		slug: "token-listings",
		icon: "CoinsStack",
		subCategories: [
			{ name: "Centralized Exchanges" },
			{ name: "Decentralized Exchanges" },
			{ name: "Crypto data aggregators (e.g., coinmarketcap)" },
		],
	},
	{
		name: "Market-Making",
		slug: "market-making",
		icon: "Ads",
		subCategories: [
			{ name: "Liquidity provision" },
			{ name: "Algorithmic Trading" },
		],
	},
];
