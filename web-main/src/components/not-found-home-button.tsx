"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function HomeButton() {
	const router = useRouter();

	return (
		<Button
			size="md"
			variant="primary"
			onClick={() => router.push("/")}
			className="w-full md:w-auto"
		>
			Go to homepage
		</Button>
	);
}
