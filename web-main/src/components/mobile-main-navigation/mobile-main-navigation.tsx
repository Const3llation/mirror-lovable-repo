"use client";

import CashbackInfoBanner from "@/components/cashback-info-banner";
import Logo from "@/components/logo";
import MobileNavLinks from "@/components/mobile-main-navigation/mobile-nav-links";
import { Icon, type IconName } from "@/components/ui/icon";
import Search from "@/features/explore/components/search";
import usePayloadGlobals from "@/hooks/use-payload-globals";
import { cn } from "@/utils/cn";
import NextLink from "next/link";
import { useEffect, useState } from "react";

type MobileMainNavigationProps = {
	showCashbackInfo?: boolean;
	className?: string;
};

const MobileMainNavigation = ({
	showCashbackInfo = false,
	className,
}: MobileMainNavigationProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
	const { data: mainNavigation } = usePayloadGlobals({
		slug: "main-navigation",
	});
	const categoriesLinks = mainNavigation?.navItems?.find(
		(navItem) => navItem["is-categories"] === "yes",
	);

	// Handle body scroll lock
	useEffect(() => {
		if (!isMenuOpen) {
			setIsCategoriesOpen(false);
		}

		if (isMenuOpen || isCategoriesOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [isMenuOpen, isCategoriesOpen]);

	const handleCategoriesSidebarToggle = () => {
		setIsCategoriesOpen((state) => !state);
	};

	const handleClose = () => {
		setIsMenuOpen(false);
		setIsCategoriesOpen(false);
	};

	return (
		<>
			<header
				id="main-navigation"
				className={cn(
					"lg:hidden fixed top-0 left-0 right-0 z-header border-b border-stroke-25 bg-background-base/80 backdrop-blur-md bg-gradient-hr bg-[length:100%_1px] bg-bottom bg-no-repeat",
					className,
				)}
			>
				{showCashbackInfo && <CashbackInfoBanner />}

				{/* Mobile Navigation */}
				<div className="container mx-auto py-4 px-4">
					<div className="flex items-center justify-between">
						{/* Logo */}
						<a href="/" className="z-10">
							<Logo
								width={196}
								height={12}
								className="max-w-[196px] md:max-w-[213px]"
							/>
						</a>

						{/* Custom Hamburger Menu Button */}
						<button
							type="button"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="z-10 w-8 h-8 flex flex-col justify-center items-center lg:hidden"
							aria-label="Toggle menu"
						>
							<div className="relative w-6 h-6">
								<span
									className={cn(
										"absolute w-6 h-0.5 bg-text-100 transition-all duration-300",
										isMenuOpen ? "top-3 rotate-45" : "top-1",
									)}
								/>
								<span
									className={cn(
										"absolute top-3 w-6 h-0.5 bg-text-100 transition-all duration-300",
										isMenuOpen && "opacity-0",
									)}
								/>
								<span
									className={cn(
										"absolute w-6 h-0.5 bg-text-100 transition-all duration-300",
										isMenuOpen ? "top-3 -rotate-45" : "top-5",
									)}
								/>
							</div>
						</button>
					</div>
				</div>
			</header>

			{/* Sliding Menu - adjusted background to match blur effect */}
			<div
				className={cn(
					"fixed inset-0 z-modal bg-background-base/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
					isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none",
				)}
				onClick={() => setIsMenuOpen(false)}
			/>

			<div
				className={cn(
					"fixed left-0 right-0 top-[92px] max-w-[100vw] bottom-0 z-modal bg-background-base/95 backdrop-blur-md transform transition-transform duration-300 ease-out lg:hidden",
					isMenuOpen ? "translate-x-0" : "translate-x-full",
					showCashbackInfo && "top-[128px]",
				)}
			>
				<div className="h-full w-full overflow-y-auto">
					<div className="px-4 py-6">
						<div className="mb-6">
							<Search />
						</div>

						<MobileNavLinks
							links={mainNavigation?.navItems}
							onCategoriesTrigger={handleCategoriesSidebarToggle}
							onNavigate={handleClose}
						/>
					</div>
				</div>
			</div>

			{/* Categories Submenu - added matching blur effect */}
			<div
				className={cn(
					"fixed left-0 right-0 top-[92px] max-w-[100vw] bottom-0 z-modal bg-background-base/95 backdrop-blur-md transform transition-transform duration-300 ease-out lg:hidden",
					isCategoriesOpen ? "translate-x-0" : "translate-x-full",
					showCashbackInfo && "top-[128px]",
				)}
			>
				<div className="h-full w-full overflow-y-auto">
					<div className="px-4 py-6">
						<button
							type="button"
							onClick={handleCategoriesSidebarToggle}
							className="flex items-center gap-2 text-text-100 text-base font-medium "
						>
							<Icon name="ArrowLeft" className="w-6 h-6" />
							Go back
						</button>

						<ul className="flex flex-col mt-8">
							{categoriesLinks?.categoryItems?.map(({ id, category }) => {
								if (!category) return null;

								return (
									<li key={category.id} className="border-b border-stroke-25">
										<NextLink
											href={`/explore/${category.slug}`}
											className="flex items-center gap-3 py-4 transition-colors text-text-100"
											onClick={handleClose}
										>
											<Icon
												name={category.icon as IconName}
												className="w-6 h-6 text-primary-100 flex-shrink-0"
											/>
											<span className="text-base font-medium">
												{category.name}
											</span>
										</NextLink>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		</>
	);
};

export default MobileMainNavigation;
