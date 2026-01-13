export const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => {
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
			<title>Chevron down icon</title>
			<g clipPath="url(#clip0_175_4607)">
				<path
					d="M4 6L8 10L12 6"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_175_4607">
					<rect width="16" height="16" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
};
