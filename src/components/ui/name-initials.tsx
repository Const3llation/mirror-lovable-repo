interface NameInitialsProps {
	name: string;
	width?: number;
	height?: number;
	className?: string;
}

const getInitials = (name: string) => {
	const nameParts = name.trim().split(" ");
	if (nameParts.length === 1) {
		return nameParts[0].charAt(0).toUpperCase();
	}
	const firstName = nameParts[0];
	const lastName = nameParts[nameParts.length - 1];
	return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const NameInitials = ({
	name,
	width = 56,
	height = 56,
	className = "",
}: NameInitialsProps) => {
	return (
		<div
			className={`flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium ${className}`}
			style={{ width: `${width}px`, height: `${height}px` }}
		>
			{getInitials(name)}
		</div>
	);
};

export default NameInitials;
