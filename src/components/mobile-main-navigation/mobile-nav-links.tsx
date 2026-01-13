"use client";

import { Icon } from "@/components/ui/icon";
import NextLink from "next/link";

type NavItem = {
	id: string;
	title: string;
	"is-categories": "yes" | "no";
	"page-slug"?: string;
};

type MobileNavLinksProps = {
	links?: NavItem[];
	onCategoriesTrigger: () => void;
	onNavigate: () => void;
};

const MobileNavLinks = ({
	links,
	onCategoriesTrigger,
	onNavigate,
}: MobileNavLinksProps) => {
	return (
		<nav>
			<ul>
				{links?.map((link) => {
					if (link["is-categories"] === "yes") {
						return (
							<li key={link.id}>
								<button
									type="button"
									data-categories-trigger
									className={
										"text-text-100 text-base font-medium transition-colors py-4 w-full flex items-center justify-between border-b border-stroke-25"
									}
									onClick={onCategoriesTrigger}
								>
									{link.title}
									<Icon name="ArrowRight" className="h-6 w-6" />
								</button>
							</li>
						);
					}

					return (
						<li key={link.id}>
							<NextLink
								href={link["page-slug"] ?? "/"}
								className={
									"text-text-100 text-base font-medium transition-colors py-4 w-full flex items-center justify-between border-b border-stroke-25"
								}
								onClick={onNavigate}
							>
								{link.title}
							</NextLink>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};

export default MobileNavLinks;
