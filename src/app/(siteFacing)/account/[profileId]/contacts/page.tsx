import { LoadingLink } from "@/context/LoadingContext";
import db from "@/db/db";
import { Plus } from "lucide-react";
import React, { ReactNode } from "react";
import DeleteContact from "./_components/DeleteContact";

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
      district: { select: { name: true } },
    },
  });

  return (
    <div className="container mx-auto grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
      <ContactCard href={`/account/${profileId}/contacts/new`}>
        <Plus className="mx-auto mt-8 size-10" />
      </ContactCard>
      {contacts.map((contact, index) => (
        <section key={contact.id}>
          <ContactCard href={`/account/${profileId}/contacts/${contact.id}`}>
            <div className="">العنوان - {index + 1}</div>
            <div className="">{contact.district?.name}</div>
            <div>{contact.contactNumber}</div>
          </ContactCard>
          <DeleteContact contactId={contact.id} />
        </section>
      ))}
    </div>
  );
}

function ContactCard({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <LoadingLink
      href={href}
      className="h-32 cursor-pointer rounded-2xl bg-white p-4 duration-500 hover:scale-105"
    >
      {children}
    </LoadingLink>
  );
}
