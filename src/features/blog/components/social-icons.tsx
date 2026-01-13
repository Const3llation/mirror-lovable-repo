"use client";

import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SocialIcons() {
	const pathname = usePathname();
	const [url, setUrl] = useState("");

	useEffect(() => {
		if (typeof window !== "undefined") {
			const baseUrl = window.location.origin;
			setUrl(`${baseUrl}${pathname}`);
		}
	}, [pathname]);

	if (!url) return null;

	return (
		<div style={{ display: "flex", gap: "10px" }}>
			<Link
				href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Share on Facebook"
			>
				<div className="w-6 h-6 flex flex-col justify-center align-middle text-center rounded bg-gradient-3">
					<Icon name="Facebook" className="w-[18px] h-[18px] mx-auto" />
				</div>
			</Link>
			<Link
				href={`https://x.com/intent/tweet?url=${encodeURIComponent(url)}`}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Share on X"
			>
				<div className="w-6 h-6 flex flex-col justify-center align-middle rounded bg-gradient-3">
					<Icon name="X" className="w-[18px] h-[18px] mx-auto" />
				</div>
			</Link>
			<Link
				href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Share on LinkedIn"
			>
				<div className="w-6 h-6 flex flex-col justify-center align-middle rounded bg-gradient-3">
					<Icon name="LinkedIn" className="w-[18px] h-[18px mx-auto" />
				</div>
			</Link>
		</div>
	);
}
