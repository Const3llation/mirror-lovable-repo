import "@testing-library/jest-dom/vitest";
import { Icon } from "@/components/ui/icon";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Input } from "../input";

describe("Input Component", () => {
	beforeEach(() => {
		cleanup();
	});

	describe("Basic Rendering", () => {
		it("renders input element with default props", () => {
			render(<Input placeholder="Test input" />);
			const input = screen.getByPlaceholderText("Test input");

			expect(input).toBeInTheDocument();
			expect(input).toHaveAttribute("type", "text");
			expect(input).toHaveClass(
				"bg-background-input",
				"border",
				"border-stroke-25",
			);
		});

		it("applies custom className correctly", () => {
			render(<Input className="custom-class" />);
			const input = screen.getByRole("textbox");

			expect(input).toHaveClass("custom-class");
		});

		it("passes through standard input props", async () => {
			const handleChange = vi.fn();
			render(
				<Input
					value="test value"
					onChange={handleChange}
					disabled={true}
					maxLength={10}
				/>,
			);

			const input = screen.getByRole("textbox");
			expect(input).toHaveValue("test value");
			expect(input).toBeDisabled();
			expect(input).toHaveAttribute("maxLength", "10");
		});
	});

	// Icon Tests
	describe("Icon Functionality", () => {
		it("renders left icon correctly", () => {
			render(
				<Input
					icon={<Icon name="MailIcon" data-testid="mail-icon" />}
					iconPosition="left"
				/>,
			);

			const icon = screen.getByTestId("mail-icon");
			expect(icon).toBeInTheDocument();
			const iconWrapper = icon.parentElement;
			expect(iconWrapper).toHaveClass("absolute", "left-4");
		});

		it("renders right icon correctly", () => {
			render(
				<Input
					icon={<Icon name="MailIcon" data-testid="mail-icon" />}
					iconPosition="left"
				/>,
			);

			const icon = screen.getByTestId("mail-icon");
			expect(icon).toBeInTheDocument();
		});

		it("adds correct padding class when left icon is present", () => {
			render(<Input icon={<Icon name="MailIcon" />} iconPosition="left" />);
			const input = screen.getByRole("textbox");

			expect(input).toHaveClass("pl-12");
		});
	});

	// Connected Element Tests
	describe("Connected Element Functionality", () => {
		it("renders connected right element correctly", () => {
			render(
				<Input
					connected={true}
					rightElement={
						<button type="button" data-testid="right-button">
							Click
						</button>
					}
				/>,
			);

			const button = screen.getByTestId("right-button");
			expect(button).toBeInTheDocument();
			const buttonWrapper = button.parentElement;
			expect(buttonWrapper).toHaveClass("absolute", "right-1");
		});

		it("applies correct styles when connected element is present", () => {
			render(
				<Input
					connected={true}
					rightElement={<button type="button">Click</button>}
				/>,
			);

			const input = screen.getByRole("textbox");
			expect(input.style.getPropertyValue("--connected-element-width")).toBe(
				"var(--actual-element-width, 120px)",
			);
		});
	});

	// User Interaction Tests
	describe("User Interactions", () => {
		it("handles user input correctly", async () => {
			const handleChange = vi.fn();
			render(<Input onChange={handleChange} />);

			const input = screen.getByRole("textbox");
			await userEvent.type(input, "test");

			expect(handleChange).toHaveBeenCalled();
			expect(input).toHaveValue("test");
		});

		it("maintains focus state correctly", async () => {
			render(<Input />);
			const input = screen.getByRole("textbox");

			await userEvent.click(input);
			expect(input).toHaveFocus();

			await userEvent.tab();
			expect(input).not.toHaveFocus();
		});
	});

	// Edge Cases
	describe("Edge Cases", () => {
		it("handles empty icon prop correctly", () => {
			render(<Input icon={null} />);
			const input = screen.getByRole("textbox");
			expect(input).not.toHaveClass("pl-12");
		});

		it("handles empty rightElement prop correctly", () => {
			render(<Input connected={true} rightElement={null} />);
			const input = screen.getByRole("textbox");
			expect(input.style.getPropertyValue("--connected-element-width")).toBe(
				"0px",
			);
		});

		it("handles missing className prop correctly", () => {
			render(<Input />);
			const input = screen.getByRole("textbox");
			expect(input).toHaveClass("bg-background-input");
		});
	});
});
