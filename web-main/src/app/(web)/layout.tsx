import { ReactQueryProvider } from "@/providers/react-query-provider";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/index.css";
import DialogsContainer from "@/components/dialogs";
import Footer from "@/components/footer";
import MainNavigation from "@/components/main-navigation";
import MobileMainNavigation from "@/components/mobile-main-navigation/mobile-main-navigation";
import TailwindScreenSize from "@/components/tailwind-screen-size";
import { stickyNavigationScript } from "@/lib/scripts/sticky-navigation";
import { DialogProvider } from "@/providers/dialog-providers";
import Script from "next/script";

const jakartaSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-jakarta-sans",
});

export const metadata: Metadata = {
	title: "Const3llation | Home",
	description: "Find industry-leading partners for your Web3 business",
	icons: {
		icon: "/favicon.ico",
	},
};

export default function WebLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={jakartaSans.variable}>
			<body
				className={`${jakartaSans.className} bg-background-base relative w-full overflow-x-hidden`}
			>
				<Script
					id="sticky-nav"
					strategy="afterInteractive"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: we have to load script this way
					dangerouslySetInnerHTML={{ __html: stickyNavigationScript }}
				/>
				<ReactQueryProvider>
					<DialogProvider>
						<MainNavigation showCashbackInfo />
						<MobileMainNavigation showCashbackInfo />
						<DialogsContainer />
						{children}
						{process.env.NODE_ENV === "development" && <TailwindScreenSize />}
						<Footer />
					</DialogProvider>
				</ReactQueryProvider>
			</body>
		</html>
	);
}
