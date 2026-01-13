type GenericFormErrorProps = {
	message: string;
};

const GenericFormError = ({ message }: GenericFormErrorProps) => {
	return (
		<div className="mt-4 p-3 bg-destructive/10 border border-red-500 rounded-md mb-4">
			<p className="text-destructive text-sm font-medium flex items-center gap-2 text-red-500">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					className="w-4 h-4"
					aria-label="Error icon"
				>
					<title>Error icon</title>
					<path
						fillRule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
						clipRule="evenodd"
					/>
				</svg>
				{message}
			</p>
		</div>
	);
};

export default GenericFormError;
