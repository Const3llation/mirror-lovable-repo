export const ChevronUp = (props: React.SVGProps<SVGSVGElement>) => {
	const { width, height, ...rest } = props;

	return (
		<svg
			width={width || 32}
			height={height || 32}
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...rest}
		>
			<title>Chevron up icon</title>
			<path
				d="M12 10L8 6L4 10"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
