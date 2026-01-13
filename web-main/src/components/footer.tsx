import Logo from "@/components/logo";
import { Icon } from "@/components/ui/icon";
import payload from "@/lib/payload";
import NextLink from "next/link";

const Footer = async () => {
	const data = await payload.findGlobal({
		slug: "footer",
	});

	return (
		<footer className="bg-background-base py-8 lg:py-16 border-t border-white/5 z-50">
			<div className="container">
				{/* <div className="flex flex-col items-center md:items-center md:flex-row md:relative gap-8 md:gap-0"> */}
				<div className="flex flex-col xl:flex-row items-center gap-10 md:gap-8  xl:justify-between">
					{/* Logo */}
					<div className="flex justify-center md:w-[213px]">
						<a href="/" className="z-10">
							<Logo width={160} className="w-full max-w-[214]" />
						</a>
					</div>

					{/* Navigation */}
					<nav aria-label="Footer secondary links navigation">
						<ul className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
							{data?.navItems
								?.filter((p) => p.visible === "show")
								.map((page) => (
									<NextLink
										key={page.id}
										className="text-sm lg:text-base text-text-100 hover:text-primary-200 transition-colors inline-flex md:py-3"
										href={`/${page.slug}`}
									>
										{page.title}
									</NextLink>
								))}
						</ul>
					</nav>

					{/* Social Icons */}
					<div className="flex justify-center gap-6">
						{data?.socials
							?.filter((p) => p.visible === "show")
							.map((page) => (
								<NextLink
									key={page.id}
									className="text-sm lg:text-base text-text-100 hover:text-primary-200 transition-colors inline-flex md:py-3"
									href={page.link}
									target="_blank"
								>
									<Icon name={page.icon} width={26} height={26} />
								</NextLink>
							))}
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
