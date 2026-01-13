import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { InfoTooltip } from "../info-icon";

// Mock ResizeObserver
beforeAll(() => {
	global.ResizeObserver = class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
});

describe("InfoTooltip Component", () => {
	beforeEach(() => {
		cleanup();
	});

	describe("Basic Rendering", () => {
		it("renders info icon button", () => {
			render(<InfoTooltip content="Test tooltip" />);
			const button = screen.getByRole("button");
			expect(button).toBeInTheDocument();
		});

		it("contains Info icon", () => {
			render(<InfoTooltip content="Test tooltip" />);
			const icon = screen.getByRole("button").querySelector("svg");
			expect(icon).toBeInTheDocument();
		});
	});

	describe("Tooltip Functionality", () => {
		it("shows tooltip content on hover", async () => {
			render(<InfoTooltip content="Test tooltip content" />);
			const button = screen.getByRole("button");

			await userEvent.hover(button);

			const tooltip = await screen.findByRole("tooltip", {
				name: "Test tooltip content",
			});
			expect(tooltip).toBeInTheDocument();
		});

		it("hides tooltip when mouse leaves", async () => {
			render(<InfoTooltip content="Test tooltip content" />);
			const button = screen.getByRole("button");

			await userEvent.hover(button);
			await userEvent.unhover(button);

			const tooltip = screen.queryByRole("tooltip");
			expect(tooltip).not.toBeInTheDocument();
		});

		it("renders complex content in tooltip", async () => {
			const complexContent = (
				<div>
					<h3>Title</h3>
					<p>Description</p>
				</div>
			);

			render(<InfoTooltip content={complexContent} />);
			const button = screen.getByRole("button");

			await userEvent.hover(button);

			const tooltip = await screen.findByRole("tooltip");
			expect(tooltip).toBeInTheDocument();
			expect(tooltip).toHaveTextContent("Title");
			expect(tooltip).toHaveTextContent("Description");
		});
	});

	describe("Accessibility", () => {
		it("maintains focus state correctly", async () => {
			render(<InfoTooltip content="Test tooltip" />);
			const button = screen.getByRole("button");

			await userEvent.tab();
			expect(button).toHaveFocus();

			await userEvent.tab();
			expect(button).not.toHaveFocus();
		});

		it("has correct button type", () => {
			render(<InfoTooltip content="Test tooltip" />);
			const button = screen.getByRole("button");

			expect(button).toHaveAttribute("type", "button");
		});
	});

	describe("Styling", () => {
		it("applies custom icon className correctly", () => {
			render(
				<InfoTooltip
					content="Test tooltip"
					iconClassName="test-custom-class"
				/>,
			);
			const button = screen.getByRole("button");

			expect(button).toHaveClass("test-custom-class");
		});
	});
});
