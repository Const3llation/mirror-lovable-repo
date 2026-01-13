import { Body } from "@/components/ui/body";
import { cn } from "@/utils/cn";

type Props = {
	imageUrl: string;
	title: string;
	category: string;
	isRelated?: boolean;
};

export const BlogPost = ({ imageUrl, title, category, isRelated }: Props) => {
	return (
		<div className="flex flex-col rounded-xl h-full">
			<img src={imageUrl} alt={title} className="rounded-t-xl" />
			<div
				className={cn(
					"p-4 bg-background-input rounded-b-xl flex-1 flex flex-col gap-2",
					isRelated ? "bg-background-100" : "bg-background-input",
				)}
			>
				<Body variants="14-regular" className="text-text-300">
					{category}
				</Body>
				<Body as="h5" variants="20-medium" className="text-text-100 font-bold">
					{title}
				</Body>
			</div>
		</div>
	);
};
