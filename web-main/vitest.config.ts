import path from "node:path";
import react from "@vitejs/plugin-react";
/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: true,
		// setupFiles: ["./src/tests/setup.ts"],
		// This is the key part - we need to include these specific options
		environmentOptions: {
			jsdom: {
				// Enable features that React needs
				pretendToBeVisual: true,
			},
		},
		deps: {
			// Handle external deps properly
			inline: ["@testing-library/user-event"],
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
