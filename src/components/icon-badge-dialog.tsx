import { Icon, type IconName } from "@/components/ui/icon";

type IconBadgeDialogProps = {
	icon: IconName;
};

const IconBadgeDialog = ({ icon }: IconBadgeDialogProps) => {
	return (
		<div
			aria-label="Icon badge"
			className="flex items-center justify-center w-[197px] h-[137px] bg-[url('/dialogs/dialog-grid-bg.webp')] bg-cover bg-no-repeat bg-center"
		>
			<div className="flex items-center justify-center w-14 h-14 rounded-lg text-text-100 bg-gradient-3">
				<Icon name={icon} aria-hidden="true" />
			</div>
		</div>
	);
};

export default IconBadgeDialog;
