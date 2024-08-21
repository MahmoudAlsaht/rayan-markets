import db from "@/db/db";
import { Plus } from "lucide-react";
import React from "react";
import DeleteContact from "./_components/DeleteContact";
import ContactCard from "./_components/ContactCard";

export default async function ContactsPage({
  params: { profileId },
}: {
  params: { profileId: string };
}) {
  const contacts = await db.contact.findMany({
    where: { profileId },
    select: {
      id: true,
      contactNumber: true,
      defaultContact: true,
      district: { select: { name: true } },
    },
  });

  return <ContactsContainer profileId={profileId} contacts={contacts} />;
}

export function ContactsContainer({
  profileId,
  contacts,
}: {
  profileId: string;
  contacts: {
    defaultContact: boolean;
    id: string;
    contactNumber: string | null;
    district: { name: string } | null;
  }[];
}) {
  return (
    <div className="container mx-auto grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
      <ContactCard href={`/account/${profileId}/contacts/new`}>
        <Plus className="mx-auto mt-8 size-10" />
      </ContactCard>
      {contacts.map((contact, index) => (
        <section key={contact.id}>
          <ContactCard
            profileId={profileId}
            contactId={contact.id}
            isEditable
            href={`/account/${profileId}/contacts/${contact.id}`}
            className={`${contact.defaultContact && "scale-105 bg-rayanPrimary-light bg-opacity-20 shadow-lg"}`}
          >
            <div>العنوان - {index + 1}</div>
            <div>{contact.district?.name}</div>
            <div>{contact.contactNumber}</div>
          </ContactCard>
          <DeleteContact contactId={contact.id} />
        </section>
      ))}
    </div>
  );
}
