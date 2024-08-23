"use server";

import db from "@/db/db";
import { notFound } from "next/navigation";
import { checkUser } from "../../auth/_actions/isAuthenticated";

export async function rejectOrCancelOrder(
  id: string,
  status: "rejected" | "canceled",
) {
  const order = await db.order.findUnique({ where: { id } });
  if (!order) return notFound();

  const currUser = await checkUser();

  if (!currUser) return notFound();

  const customer = await db.user.findFirst({
    where: { profileId: order.profileId },
  });

  if (
    (!customer || customer.id !== currUser.id) &&
    currUser.role !== "admin" &&
    currUser.role !== "editor"
  )
    return notFound();

  await db.order.update({ where: { id }, data: { status } });
}

export async function completeOrder(id: string, status: "finished") {
  const order = await db.order.findUnique({ where: { id } });
  if (!order) return notFound();

  const currUser = await checkUser();

  if (!currUser || currUser.role === "customer") return notFound();

  if (
    currUser.role !== "admin" &&
    currUser.role !== "editor" &&
    currUser.role !== "staff"
  )
    return notFound();

  await db.order.update({ where: { id }, data: { status } });
}
