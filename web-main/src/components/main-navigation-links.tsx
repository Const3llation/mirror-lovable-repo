import MainMenuCategories from "@/components/main-menu-categories";
import payload from "@/lib/payload";
import NextLink from "next/link";

const Link = ({
	children,
	...props
}: React.ComponentProps<typeof NextLink>) => {
	return (
		<NextLink
			className="text-text-100 hover:text-primary-200 transition-colors inline-flex py-3"
			{...props}
		>
			{children}
		</NextLink>
	);
};

const MainNavigationLinks = async () => {
	const data = await payload.findGlobal({
		slug: "main-navigation",
	});

	return (
		<nav
			aria-label="Main Navigation"
			className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex items-center gap-4 border border-stroke-300 rounded-full px-8"
		>
			<ul className="flex items-center gap-8">
				{data?.navItems?.map((item) => {
					const isCategoriesItem = item["is-categories"] === "yes";
					const pageSlug = item["page-slug"] || "/";
					const pageSlugPath = pageSlug.startsWith("/")
						? pageSlug
						: `/${pageSlug}`;

					if (isCategoriesItem) {
						return (
							<li key={item.id} className="relative group">
								<span className="text-text-100 hover:text-primary-200 transition-colors inline-flex py-3 cursor-pointer">
									{item.title}
								</span>
								<div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[960px] bg-background-input rounded-lg border border-stroke-300 shadow-lg overflow-hidden z-dropdown transition-all duration-200">
									<MainMenuCategories categories={item.categoryItems} />
								</div>
							</li>
						);
					}

					return (
						<li key={item.id}>
							<Link href={pageSlugPath}>{item.title}</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};

export default MainNavigationLinks;
