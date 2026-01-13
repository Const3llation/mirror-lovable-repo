"use client";

import CashbackDialog from "@/components/cashback-dailog";
import ContinueWithExistingData from "@/features/service-providers/components/dialogs/continue-with-existing-data";
import CreateServiceProviderProfileStepsDialog from "@/features/service-providers/components/dialogs/create-profile-steps";
import ReviewsDialog from "@/features/service-providers/components/profile/reviews-dialog";

const DialogsContainer = () => {
	return (
		<>
			<CreateServiceProviderProfileStepsDialog />
			<CashbackDialog />
			<ContinueWithExistingData />
			<ReviewsDialog />
		</>
	);
};

export default DialogsContainer;
