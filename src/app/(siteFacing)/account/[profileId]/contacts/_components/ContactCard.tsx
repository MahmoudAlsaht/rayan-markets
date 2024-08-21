"use client";

import { LoadingLink } from "@/context/LoadingContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode, useTransition } from "react";
import { editDefaultContacts } from "../_actions/editDefaultContacts";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ContactCard({
  href,
  children,
  isEditable = false,
  className,
  contactId,
  profileId,
}: {
  href: string;
  children: ReactNode;
  isEditable?: boolean;
  className?: string;
  contactId?: string;
  profileId?: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleUpdate = () => {
    startTransition(async () => {
      profileId &&
        contactId &&
        (await editDefaultContacts(profileId, contactId));

      router.refresh();
    });
  };

  return !isEditable ? (
    <LoadingLink
      href={href}
      className="h-32 cursor-pointer rounded-2xl bg-white p-4 duration-500 hover:scale-105"
    >
      {children}
    </LoadingLink>
  ) : (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <div
          className={`h-32 cursor-pointer rounded-2xl bg-white p-4 duration-500 hover:scale-105 ${className}`}
        >
          {!pending ? (
            children
          ) : (
            <Loader2 className="mx-auto size-20 animate-spin text-rayanPrimary-dark dark:text-rayanPrimary-light" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleUpdate}>
          تعيين كعنوان افتراضي
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LoadingLink href={href}>تعديل</LoadingLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
