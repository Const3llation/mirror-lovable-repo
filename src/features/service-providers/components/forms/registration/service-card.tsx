import { Body } from "@/components/ui/body";
import Checkbox from "@/components/ui/checkbox";
import { Icon, type IconName } from "@/components/ui/icon";
import IconBadge from "@/components/ui/icon-badge";
import { useCallback, useEffect, useMemo, useReducer } from "react";

type SubService = {
	id: number;
	name: string;
};

type Service = {
	id: number;
	name: string;
	icon: IconName;
	subServices?: SubService[];
};

type ServiceCardProps = {
	service: Service;
	onSelectionChange?: (selection: {
		serviceId: number;
		selectedSubServices: number[];
	}) => void;
	initialSelectedServices?: {
		categories: number[];
		subCategories: number[];
	};
};

type ServiceAction =
	| { type: "TOGGLE_PARENT"; checked: boolean; subServices: SubService[] }
	| { type: "TOGGLE_SUB_SERVICE"; subServiceId: number; checked: boolean }
	| { type: "SET_INITIAL_SERVICES"; services: number[] };

function serviceReducer(
	state: Set<number>,
	action: ServiceAction,
): Set<number> {
	const newState = new Set(state);

	switch (action.type) {
		case "TOGGLE_PARENT": {
			if (action.checked) {
				// Select all sub-services when parent is checked
				return new Set(action.subServices.map((sub) => sub.id));
			}
			return new Set();
		}

		case "TOGGLE_SUB_SERVICE": {
			if (action.checked) {
				newState.add(action.subServiceId);
			} else {
				newState.delete(action.subServiceId);
			}
			return newState;
		}

		case "SET_INITIAL_SERVICES": {
			return new Set(action.services);
		}

		default:
			return state;
	}
}

const ServiceCard = ({
	service,
	onSelectionChange,
	initialSelectedServices = { categories: [], subCategories: [] },
}: ServiceCardProps) => {
	const [selectedSubServices, dispatch] = useReducer(
		serviceReducer,
		new Set<number>(initialSelectedServices.subCategories),
	);
	const subServices = useMemo(
		() => service.subServices || [],
		[service.subServices],
	);

	// Effect to handle initialSelectedServices updates
	useEffect(() => {
		if (initialSelectedServices.subCategories.length > 0) {
			dispatch({
				type: "SET_INITIAL_SERVICES",
				services: initialSelectedServices.subCategories,
			});
		}
	}, [initialSelectedServices]);

	// Calculate parent checked state
	const isParentChecked = useMemo(() => {
		if (!subServices.length) return false;
		// Parent is checked if ANY sub-service is selected
		return subServices.some((sub) => selectedSubServices.has(sub.id));
	}, [subServices, selectedSubServices]);

	// Handle parent checkbox change
	const handleParentChange = useCallback(() => {
		dispatch({
			type: "TOGGLE_PARENT",
			checked: !isParentChecked,
			subServices,
		});

		const newSelectedSubs = !isParentChecked
			? subServices.map((sub) => sub.id)
			: [];

		onSelectionChange?.({
			serviceId: service.id,
			selectedSubServices: newSelectedSubs,
		});
	}, [service.id, subServices, onSelectionChange, isParentChecked]);

	// Handle sub-service checkbox change
	const handleSubServiceChange = useCallback(
		(subServiceId: number, checked: boolean) => {
			dispatch({
				type: "TOGGLE_SUB_SERVICE",
				subServiceId,
				checked,
			});

			const newSelected = new Set(selectedSubServices);
			if (checked) {
				newSelected.add(subServiceId);
			} else {
				newSelected.delete(subServiceId);
			}

			onSelectionChange?.({
				serviceId: service.id,
				selectedSubServices: Array.from(newSelected),
			});
		},
		[service.id, selectedSubServices, onSelectionChange],
	);

	// Check if a sub-service is checked
	const isSubServiceChecked = useCallback(
		(subServiceId: number) => selectedSubServices.has(subServiceId),
		[selectedSubServices],
	);

	return (
		<div className="p-5 rounded-md flex flex-col gap-5">
			<IconBadge size="lg">
				<Icon name={service.icon} width={20} height={20} />
			</IconBadge>
			<fieldset aria-label="Services selection" className="flex flex-col gap-3">
				{/* Parent Service */}
				<li className="flex items-center gap-2 mb-3">
					<Checkbox
						checked={
							isParentChecked ||
							initialSelectedServices.categories.includes(String(service.id))
						}
						onChange={handleParentChange}
						aria-label={`Select ${service.name}`}
						onClick={(e) => e.stopPropagation()}
					/>
					<Body variants="16-medium" className="text-white">
						{service.name}
					</Body>
				</li>

				{/* Sub Services */}
				{subServices.map((subService) => {
					return (
						<li key={subService.id} className="flex items-center gap-2">
							<Checkbox
								checked={isSubServiceChecked(subService.id)}
								onChange={() => {
									handleSubServiceChange(
										subService.id,
										!isSubServiceChecked(subService.id),
									);
								}}
								aria-label={`Select ${subService.name}`}
								className="flex-shrink-0"
								onClick={(e) => {
									e.stopPropagation();
								}}
							/>
							<Body variants="16-medium" className="text-white/50">
								{subService.name}
							</Body>
						</li>
					);
				})}
			</fieldset>
		</div>
	);
};

export default ServiceCard;
