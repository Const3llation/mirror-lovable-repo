export const LinkedIn = (props: React.SVGProps<SVGSVGElement>) => {
	const { width = 32, height = 32, ...rest } = props;

	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 24 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...rest}
		>
			<title>LinkedIn logo</title>
			<path
				d="M3 7.5C3 6.43913 3.42143 5.42172 4.17157 4.67157C4.92172 3.92143 5.93913 3.5 7 3.5H17C18.0609 3.5 19.0783 3.92143 19.8284 4.67157C20.5786 5.42172 21 6.43913 21 7.5V17.5C21 18.5609 20.5786 19.5783 19.8284 20.3284C19.0783 21.0786 18.0609 21.5 17 21.5H7C5.93913 21.5 4.92172 21.0786 4.17157 20.3284C3.42143 19.5783 3 18.5609 3 17.5V7.5Z"
				fill="currentColor"
				fillOpacity="0.701961"
			/>
			<path
				d="M8 11.5V16.5"
				stroke="#1D1A2F"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M8 8.5V8.51"
				stroke="#1D1A2F"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M12 16.5V11.5"
				stroke="#1D1A2F"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M16 16.5V13.5C16 12.9696 15.7893 12.4609 15.4142 12.0858C15.0391 11.7107 14.5304 11.5 14 11.5C13.4696 11.5 12.9609 11.7107 12.5858 12.0858C12.2107 12.4609 12 12.9696 12 13.5"
				stroke="#1D1A2F"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
