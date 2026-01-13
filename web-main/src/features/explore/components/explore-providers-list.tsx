import { Heading } from "@/components/ui/heading";
import ExploreFilters from "@/features/explore/components/explore-filters";

type ExploreProvidersListProps = {
	initialService?: string;
	initialSubService?: string;
};

const ExploreProvidersList = ({
	initialService,
	initialSubService,
}: ExploreProvidersListProps) => {
	return (
		<div>
			<Heading as="h3" className="mb-8">
				Search for partners by service, category, or specialty
			</Heading>

			<ExploreFilters
				initialService={initialService}
				initialSubService={initialSubService}
			/>
		</div>
	);
};

export default ExploreProvidersList;
