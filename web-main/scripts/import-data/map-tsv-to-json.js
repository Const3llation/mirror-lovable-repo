import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getLocation(location) {
	if (location === "") {
		return null;
	}

	const [city, stateOrCountry] = location
		.split(" , ")
		.map((item) => item.trim());

	// if stateOrCountry has 2 uppercase letters, it's state
	if (stateOrCountry?.match(/[A-Z]{2}/)) {
		return {
			city,
			state: stateOrCountry,
			country: "USA",
		};
	}

	return {
		city,
		state: null,
		country: stateOrCountry,
	};
}

function tsvToJson(tsvFilePath) {
	const tsvData = fs.readFileSync(tsvFilePath, "utf-8");

	const rows = tsvData
		.split("\n")
		.map((row) => row.trim())
		.filter((row) => row.length > 0);
	const headers = rows[0].split("\t").map((header) => header.trim());
	// biome-ignore lint/correctness/noSelfAssign: <explanation>
	headers[0] = headers[0];

	const jsonData = rows.slice(1).map((row) => {
		const values = row.split("\t").map((value) => value.trim());
		const obj = {};
		headers.forEach((header, index) => {
			if (index > 4) {
				if (!obj.Categories) {
					obj.Categories = values[index]
						?.split(" ")
						.map((item) => item.trim())
						.join(",");
				} else {
					const value = values[index]
						?.split(" ")
						.map((item) => item.trim())
						.join(",");
					if (value) obj.Categories = `${obj.Categories},${value}`;
				}
			} else {
				obj[header] = values[index];
			}
		});
		return obj;
	});

	const data = jsonData.map((item) => {
		const categories = item.Categories.split(",")
			.map((category) => category.trim())
			.filter((category) => category.length > 0);
		const uniqueCategories = [...new Set(categories)];

		return {
			providerName: item["Company name"],
			websiteUrl: item["Company website"],
			logo: item["Logo link"],
			location: getLocation(item.Location),
			description: item.Description,
			categories: uniqueCategories,
		};
	});

	return data;
}

const tsvFilePath = path.join(__dirname, "data.tsv");
const jsonData = tsvToJson(tsvFilePath);

fs.writeFileSync(
	path.join(__dirname, "output.json"),
	JSON.stringify(jsonData, null, 2),
);
