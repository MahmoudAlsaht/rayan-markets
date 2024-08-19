"use server";

import db from "@/db/db";

export async function deleteContact(contactId: string) {
  const contact = await db.contact.findUnique({
    where: { id: contactId },
    select: { districtId: true, profileId: true },
  });
  await db.district.update({
    where: { id: contact?.districtId as string },
    data: {
      contacts: {
        disconnect: { id: contactId },
      },
    },
  });

  await db.profile.update({
    where: { id: contact?.profileId as string },
    data: {
      contacts: {
        delete: { id: contactId },
      },
    },
  });
}
