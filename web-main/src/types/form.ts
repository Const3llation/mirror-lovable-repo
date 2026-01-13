export interface FormStepConfig {
	id: string;
	title: string;
	order: number;
	component: React.ComponentType;
	validation?: string | string[];
}
