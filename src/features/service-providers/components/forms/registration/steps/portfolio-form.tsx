"use client";

import { Body } from "@/components/ui/body";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import Hr from "@/components/ui/hr";
import { InfoTooltip } from "@/components/ui/info-icon";
import { Select } from "@/components/ui/select";
import { SERVICE_PROVIDER_BUDGET_OPTIONS } from "@/config/consts";
import CaseStudyItem from "@/features/service-providers/components/forms/registration/case-study-item";
import type { serviceProviderFormSchema } from "@/features/service-providers/schemas/registration";
import { useEffect } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { z } from "zod";

const emptyCaseStudy = {
	clientName: "",
	title: "",
	description: "",
	projectUrl: "",
	serviceCategories: [],
	achievedMetrics: [],
	files: [],
	images: [],
};

export default function PortfolioForm() {
	const {
		register,
		control,
		formState: { errors },
	} = useFormContext<z.infer<typeof serviceProviderFormSchema>>();

	const {
		fields: caseStudies,
		append: handleAddCaseStudy,
		remove: handleRemoveCaseStudy,
	} = useFieldArray({
		control,
		name: "portfolio.caseStudies",
	});

	useEffect(() => {
		if (caseStudies.length === 0) {
			handleAddCaseStudy(emptyCaseStudy);
		}
	}, [handleAddCaseStudy, caseStudies.length]);

	return (
		<div className="max-w-3xl mx-auto">
			<div className="text-center space-y-8 mb-14">
				<Heading as="h1" variants="h3">
					Build Your Portfolio
				</Heading>

				<div className="py-6">
					<p className="text-text-200 text-left mb-2 text-sm">
						What is the minimum price your services start at?
					</p>
					<Controller
						name="portfolio.minimumBudget"
						control={control}
						render={({ field }) => (
							<Select
								placeholder="Minimum budget"
								options={SERVICE_PROVIDER_BUDGET_OPTIONS}
								error={errors?.portfolio?.minimumBudget?.message}
								defaultValue={field.value}
								{...field}
							/>
						)}
					/>
				</div>

				<Body
					variants="20-medium"
					className="text-text-300 max-w-[40ch] mx-auto mb-8"
				>
					Add case studies to your profile page
				</Body>
				<Hr />

				<div className="flex flex-col gap-8">
					{caseStudies.map((caseStudy, index) => (
						<div key={caseStudy.id}>
							<CaseStudyItem
								caseStudy={caseStudy}
								isFirstItem={index === 0}
								index={index}
								removeCaseStudy={handleRemoveCaseStudy}
								register={register}
								errors={errors}
								control={control}
							/>

							{index + 1 !== caseStudies.length && <Hr />}
						</div>
					))}
				</div>

				<Hr />
				<div className="flex flex-col gap-4 items-center">
					<Button
						type="button"
						variant="primary"
						onClick={() =>
							caseStudies.length < 5 && handleAddCaseStudy(emptyCaseStudy)
						}
						className="w-full max-w-[340px]"
						size="lg"
						disabled={caseStudies.length >= 5}
					>
						Add a new case study
					</Button>
					<div className="flex items-center gap-1">
						<InfoTooltip content="Add up to 5 case studies to showcase your work and expertise." />
						<Body variants="16-medium" className="text-text-300">
							A maximum of 5 case studies can be added
						</Body>
					</div>
				</div>
			</div>
		</div>
	);
}
