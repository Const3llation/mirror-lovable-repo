import { useCallback, useEffect, useState } from "react";

// Define the possible screen size keys
type ScreenSize = "sm" | "md" | "lg" | "xl";

const useScreenSize = (): ScreenSize => {
	const [screenSize, setScreenSize] = useState<ScreenSize>("sm");

	// Function to determine the screen size based on width
	const getScreenSize = useCallback((width: number): ScreenSize => {
		if (width < 576) return "sm";
		if (width >= 576 && width < 768) return "sm";
		if (width >= 768 && width < 992) return "md";
		if (width >= 992 && width < 1200) return "lg";
		if (width >= 1200) return "xl";
		return "sm"; // Default fallback
	}, []);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			setScreenSize(getScreenSize(width));
		};

		handleResize();

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, [getScreenSize]);

	return screenSize;
};

export default useScreenSize;
