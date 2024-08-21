import { checkUser } from "../../auth/_actions/isAuthenticated";
import AnonymousForm from "../_components/AnonymousForm";
import SelectContact from "../_components/SelectContact";
import SelectPayment from "../_components/SelectPayment";

export default async function CheckoutPage({
  params: { step },
}: {
  params: { step: string };
}) {
  const user = await checkUser();

  return (
    <>
      {step === "contact" ? (
        !user ? (
          <AnonymousForm />
        ) : (
          <SelectContact profileId={user.profile?.id as string} />
        )
      ) : step === "payment-method" ? (
        <SelectPayment />
      ) : (
        step
      )}
      <div className="h-20" />
    </>
  );
}
