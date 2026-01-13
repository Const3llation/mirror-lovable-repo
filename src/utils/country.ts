import { type TCountryCode, countries } from "countries-list";
import { match } from "ts-pattern";

export enum Regions {
	NORTH_AMERICA = "North America",
	SOUTH_AMERICA = "South America",
	EUROPE = "Europe",
	ASIA = "Asia",
	AFRICA = "Africa",
	OCEANIA = "Oceania",
}

const BLACKLISTED_COUNTRIES: TCountryCode[] = ["IR", "KP"]; // Iran, North Korea

/**
 * Returns a list of supported countries
 * @param blacklisted - A list of country codes to exclude
 * @returns
 */
export const getSupportedCountries = ({
	blacklisted = BLACKLISTED_COUNTRIES,
}: { blacklisted?: string[] } = {}) => {
	return Object.keys(countries).filter((code) => {
		return !blacklisted || !blacklisted.includes(code);
	});
};

/**
 * Returns a list of options for the country field in the service provider collection
 * @returns
 */
export const getSupportedCountriesOptions = () => {
	return getSupportedCountries().map((code) => ({
		label: countries[code as keyof typeof countries].name,
		value: code,
	}));
};

/**
 * Returns the region for a given country code
 * @param countryCode
 * @returns
 */
export const getRegionForCountry = (countryCode: TCountryCode): Regions => {
	const country = countries[countryCode];

	return match(country.continent)
		.with("NA", () => Regions.NORTH_AMERICA)
		.with("SA", () => Regions.SOUTH_AMERICA)
		.with("EU", () => Regions.EUROPE)
		.with("AS", () => Regions.ASIA)
		.with("AF", () => Regions.AFRICA)
		.with("OC", () => Regions.OCEANIA)
		.otherwise(() => {
			throw new Error(`Unknown region for country code: ${countryCode}`);
		});
};

/**
 * Returns the country name for a given country code
 * @param countryCode
 * @returns
 */
export const getCountryForCode = (countryCode: TCountryCode) => {
	return countries[countryCode as keyof typeof countries].name;
};
