"use client";

import * as React from "react";
import {
  ArrowLeftCircle,
  ArrowLeftFromLine,
  ArrowRightFromLine,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ContactCard from "./ContactCard";
import DeleteContact from "./DeleteContact";

export function CollapsibleContacts({
  contacts,
  profileId,
}: {
  contacts: {
    defaultContact: boolean;
    id: string;
    contactNumber: string | null;
    district: { name: string } | null;
  }[];
  profileId: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const activeContact = contacts.find((contact) => contact.defaultContact);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="container grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7"
    >
      <ContactCard href={`/account/${profileId}/contacts/new`}>
        <Plus className="mx-auto mt-8 size-10" />
      </ContactCard>

      <section>
        <ContactCard
          profileId={profileId}
          contactId={activeContact?.id}
          isEditable
          href={`/account/${profileId}/contacts/${activeContact?.id}`}
          isDefault={activeContact?.defaultContact}
        >
          <div>العنوان الافتراضي</div>
          <div>{activeContact?.district?.name}</div>
          <div>{activeContact?.contactNumber}</div>
        </ContactCard>
        <DeleteContact contactId={activeContact?.id as string} />
      </section>

      {isOpen &&
        contacts.map(
          (contact, index) =>
            !contact.defaultContact && (
              <section key={contact.id}>
                <ContactCard
                  profileId={profileId}
                  contactId={contact.id}
                  isEditable
                  href={`/account/${profileId}/contacts/${contact.id}`}
                  isDefault={contact.defaultContact}
                >
                  <div>العنوان - {index + 1}</div>
                  <div>{contact.district?.name}</div>
                  <div>{contact.contactNumber}</div>
                </ContactCard>
                <DeleteContact contactId={contact.id} />
              </section>
            ),
        )}

      {contacts.length > 1 && (
        <CollapsibleTrigger
          asChild
          className="h-32 w-1/3 cursor-pointer rounded-2xl bg-white p-4 duration-500"
        >
          {isOpen ? <ArrowRightFromLine /> : <ArrowLeftFromLine />}
        </CollapsibleTrigger>
      )}
    </Collapsible>
  );
}
