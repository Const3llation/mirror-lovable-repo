"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const JoinButton = () => {
	const router = useRouter();
	const handleNavigateToJoin = () => {
		router.push("/providers/register");
	};
	return (
		<Button onClick={() => handleNavigateToJoin()} variant="primary" size="md">
			JOIN
		</Button>
	);
};

export default JoinButton;
