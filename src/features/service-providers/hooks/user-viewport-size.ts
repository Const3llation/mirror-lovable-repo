import { useEffect, useState } from "react";

export const useViewportSize = () => {
	const [isDesktop, setIsDesktop] = useState(false);

	useEffect(() => {
		const checkSize = () => {
			setIsDesktop(window.innerWidth >= 992);
		};

		checkSize();

		window.addEventListener("resize", checkSize);

		return () => window.removeEventListener("resize", checkSize);
	}, []);

	return { isDesktop };
};
