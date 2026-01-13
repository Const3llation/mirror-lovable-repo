import Image from "next/image";

type LogoProps = {
	width?: number;
	height?: number;
	className?: string;
};

const Logo = ({ width = 150, height = 50, className }: LogoProps) => {
	return (
		<Image
			src="/logo.webp"
			alt="Logo"
			width={width}
			height={height}
			className={className}
			fetchPriority="high"
			quality={100}
		/>
	);
};

export default Logo;
