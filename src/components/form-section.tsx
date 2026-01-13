import { Heading } from "@/components/ui/heading";

type FormSectionProps = {
	title?: string;
	children: React.ReactNode;
};

export function FormSection({ title, children }: FormSectionProps) {
	return (
		<div className="flex flex-col gap-6 mb-14">
			{title && (
				<Heading as="h2" variants={"h4"} className="text-center text-text-300">
					{title}
				</Heading>
			)}
			<div className="flex flex-col gap-8">{children}</div>
		</div>
	);
}
