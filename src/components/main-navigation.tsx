import CashbackInfoBanner from "@/components/cashback-info-banner";
import Logo from "@/components/logo";
import MainNavSearch from "@/components/main-nav-search";
import MainNavigationLinks from "@/components/main-navigation-links";
import JoinButton from "@/components/main-navigation/join-button";
import Hr from "@/components/ui/hr";
import { cn } from "@/utils/cn";

type MainNavigationProps = {
	showCashbackInfo?: boolean;
	className?: string;
};

const MainNavigation = async ({
	showCashbackInfo = false,
	className,
}: MainNavigationProps) => {
	return (
		<header
			id="main-navigation"
			className={cn(
				"top-0 left-0 right-0 z-header border-b border-transparent bg-gradient-hr bg-[length:100%_1px] bg-bottom bg-no-repeat fixed hidden lg:block",
				"backdrop-blur-md bg-background-base/20",
				className,
			)}
		>
			{showCashbackInfo && <CashbackInfoBanner />}
			<div className="container mx-auto py-6 px-4 flex items-center relative justify-between">
				<a href="/" className="z-10">
					<Logo width={213} height={13} className="max-w-[213px]" />
				</a>

				<MainNavigationLinks />

				<div className="flex items-center gap-4 z-10 lg:ml-auto relative">
					<MainNavSearch />
					<JoinButton />
				</div>
			</div>
			<Hr />
		</header>
	);
};

export default MainNavigation;
