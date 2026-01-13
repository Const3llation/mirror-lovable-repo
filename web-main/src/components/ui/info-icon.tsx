"use client";

import { cn } from "@/utils/cn";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";
import { useState } from "react";

interface InfoTooltipProps extends Tooltip.TooltipProps {
	content: React.ReactNode;
	iconClassName?: string;
	className?: string;
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function InfoTooltip({
	content,
	iconClassName,
	className,
	delayDuration = 0,
	defaultOpen,
	open: controlledOpen,
	onOpenChange,
	...props
}: InfoTooltipProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(
		defaultOpen || false,
	);

	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : uncontrolledOpen;

	const handleOpenChange = (newOpen: boolean) => {
		if (!isControlled) {
			setUncontrolledOpen(newOpen);
		}
		onOpenChange?.(newOpen);
	};

	return (
		<Tooltip.Provider>
			<Tooltip.Root
				{...props}
				open={open}
				onOpenChange={handleOpenChange}
				defaultOpen={defaultOpen}
				delayDuration={delayDuration}
			>
				<Tooltip.Trigger asChild>
					<button
						type="button"
						className={cn(
							"inline-flex items-center justify-center",
							"text-primary-100 hover:text-primary-100 transition-colors",
							iconClassName,
						)}
						onClick={() => handleOpenChange(!open)}
					>
						<Info className="h-4 w-4" />
					</button>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content
						className={cn(
							"z-50 overflow-hidden",
							"bg-primary-300 border border-stroke-25 rounded-lg",
							"px-4 py-3 text-sm text-text-100 text-center",
							"shadow-lg",
							"animate-in fade-in-0 zoom-in-95",
							"max-w-[300px]",
							className,
						)}
						sideOffset={5}
					>
						{content}
						<Tooltip.Arrow className="fill-background-input" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}
