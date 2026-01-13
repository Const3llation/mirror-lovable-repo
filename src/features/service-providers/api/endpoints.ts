const servicesProviderEndpoint = {
	method: "GET",
	path: "/service-providers",
	handler: handleGetServiceProviders,
};

export const endpoints = [servicesProviderEndpoint];
