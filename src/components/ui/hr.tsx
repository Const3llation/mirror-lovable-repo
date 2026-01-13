import { cn } from "@/utils/cn";

interface HrProps extends React.HTMLAttributes<HTMLHRElement> {}

export const Hr = ({ className, ...props }: HrProps) => {
	return (
		<hr
			className={cn(
				"h-[1px] border-0 bg-[linear-gradient(90deg,#030014_0%,rgba(255,255,255,0.15)_51.51%,#030014_100%)]",
				className,
			)}
			{...props}
		/>
	);
};

export default Hr;
