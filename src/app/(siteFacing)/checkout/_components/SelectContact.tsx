import db from "@/db/db";
import { ContactsContainer } from "../../account/[profileId]/contacts/page";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SelectContact({
  profileId,
}: {
  profileId: string;
}) {
  const contacts = await db.contact.findMany({
    where: { profileId },
    select: {
      id: true,
      contactNumber: true,
      defaultContact: true,
      district: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <>
      <ContactsContainer profileId={profileId} contacts={contacts} />;
      {contacts?.some((contact) => contact.defaultContact) && (
        <Button>
          <Link href="/checkout/payment-method">متابعة للدفع</Link>
        </Button>
      )}
    </>
  );
}
