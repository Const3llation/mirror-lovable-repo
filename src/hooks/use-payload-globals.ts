import type { Footer, MainNavigation } from "@/types/payload";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

type GlobalSlug = "main-navigation" | "footer";

interface GlobalTypeMap {
	"main-navigation": MainNavigation;
	footer: Footer;
}

interface ServiceListParams {
	slug: GlobalSlug;
}

const fetchGlobals = async <T extends GlobalSlug>(
	params: ServiceListParams & { slug: T },
): Promise<GlobalTypeMap[T]> => {
	const url = `/api/globals?slug=${params.slug}`;
	const response = await fetch(url);
	return response.json();
};

const usePayloadGlobals = <T extends GlobalSlug>(
	params: ServiceListParams & { slug: T },
): UseQueryResult<GlobalTypeMap[T], Error> => {
	const response = useQuery({
		queryKey: ["globals", "main-navigation"],
		queryFn: () => fetchGlobals(params),
	});

	return response;
};

export default usePayloadGlobals;
