import type { Config } from "tailwindcss";

export default {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/features/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			animation: {
				"spin-slow": "spin 700s linear infinite",
				slideUp: "slideUp 2s cubic-bezier(0.33, 1, 0.68, 1)",
				"slideUp-2": "slideUp 2s cubic-bezier(0.33, 1, 0.68, 1)",
			},
			keyframes: {
				"spin-slow": {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
				slideUp: {
					"0%": { transform: "translateY(100%)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
			},
			colors: {
				white: "#FFFFFF",
				primary: {
					100: "#9382FF",
					150: "#776ACE",
					200: "#5043A3",
					250: "#473C8F",
					300: "#342B6F",
				},
				text: {
					100: "#F4F0FF",
					200: "#E8E6E9",
					300: "rgba(239, 237, 253, 0.7)",
				},
				stroke: {
					5: "rgba(255, 255, 255, 0.05)",
					25: "rgba(255, 255, 255, 0.12)",
					50: "rgba(255, 255, 255, 0.22)",
					100: "#72707A", // hex equals to this rgba(255 255 255, 0.44)
					200: "#6952B8",
					300: "rgba(37, 29, 53, 1)",
				},
				background: {
					base: "#030014",
					input: "#120F22",
					100: "#1D1A2F",
					200: "rgba(255, 255, 255, 0.15)",
					300: "#190930",
					secondary: "#161B26",
					"black-5": "rgba(0, 0, 0, 0.05)",
					"black-11": "rgba(0, 0, 0, 0.11)",
				},
				status: {
					yellow: {
						100: "#E0CC75",
						200: "#EFF225",
					},
					red: {
						100: "#E07575",
						200: "#9C3C3C",
					},
					green: {
						100: "#75E0A7",
						200: "#085D3A",
						300: "#053321",
					},
				},
			},
			backgroundImage: {
				"gradient-1":
					"linear-gradient(180deg, rgba(255, 255, 255, 0.00) 17.71%, rgba(255, 255, 255, 0.12) 100%), rgba(255, 255, 255, 0.01)",
				"gradient-2":
					"linear-gradient(90deg, rgba(229, 156, 255, 0.24) 0.01%, rgba(186, 156, 255, 0.24) 50.01%, rgba(156, 178, 255, 0.24) 100%)",
				"gradient-3":
					"linear-gradient(180deg, #844BE0 0%, color-mix(in oklab, #844BE0, #221C86) 50%, #221C86 100%)",
				"gradient-4":
					"linear-gradient(180deg, rgba(37, 29, 53, 0.57) 0%, rgba(108, 85, 155, 0.01) 100%)",
				"gradient-hr":
					"linear-gradient(90deg, #030014 0%, rgba(255, 255, 255, 0.15) 51.51%, #030014 100%)",
				"gradient-5":
					"linear-gradient(0deg, var(--Primary-300, #342B6F), var(--Primary-300, #342B6F)), linear-gradient(180deg, #3F338E 14.8%, #120D2B 100%)",
			},
			boxShadow: {
				icon: "0px 1.92px 86px 0px #4900C382",
			},
			zIndex: {
				dropdown: "50",
				sticky: "100",
				modal: "200",
				popover: "300",
				tooltip: "400",
				toast: "500",
				overlay: "900",
				header: "1000",
				dialog: "1500",
			},
		},
		screens: {
			sm: "576px",
			md: "768px",
			lg: "992px",
			xl: "1200px",
		},
		container: {
			center: true,
			padding: {
				DEFAULT: "1rem",
				sm: "1rem",
			},
			screens: {
				xl: "1296px",
			},
		},
	},
	plugins: [],
} satisfies Config;
