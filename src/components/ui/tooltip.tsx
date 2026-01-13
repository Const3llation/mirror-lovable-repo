import { cn } from "@/utils/cn";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

interface TooltipProps extends TooltipPrimitive.TooltipProps {
	content: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}

export function Tooltip({
	content,
	children,
	className,
	delayDuration = 0,
	...props
}: TooltipProps) {
	return (
		<TooltipPrimitive.Provider>
			<TooltipPrimitive.Root {...props}>
				<TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
				<TooltipPrimitive.Portal>
					<TooltipPrimitive.Content
						className={cn(
							"z-50 overflow-hidden",
							"bg-background-input border border-stroke-25 rounded-lg",
							"px-4 py-3 text-sm text-text-100",
							"shadow-lg",
							"animate-in fade-in-0 zoom-in-95",
							className,
						)}
						sideOffset={5}
					>
						{content}
						<TooltipPrimitive.Arrow className="fill-background-input" />
					</TooltipPrimitive.Content>
				</TooltipPrimitive.Portal>
			</TooltipPrimitive.Root>
		</TooltipPrimitive.Provider>
	);
}
