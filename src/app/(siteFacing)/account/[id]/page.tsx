import { customerPermissions } from "@/app/admin/_components/UserPermissions";
import Widget from "@/app/admin/_components/Widget";
import { redirect } from "next/navigation";
import { checkUser } from "../../auth/_actions/isAuthenticated";

export default async function Profile({
  params: { id },
}: {
  params: { id: string };
}) {
  if (id === "unRegisteredUser") redirect("/auth/login");

  const user = await checkUser();

  if (user == null) redirect("/auth/login");

  if (user.profile?.id !== id) redirect("/auth/login");

  return (
    <div
      className="mt-4 grid h-dvh grid-cols-1 gap-4 sm:mt-8 md:grid-cols-2 lg:grid-cols-3"
      dir="rtl"
    >
      {customerPermissions(id || "unRegisteredUser").map(
        (setting) =>
          setting && (
            <Widget
              key={setting.displayName}
              title={setting.displayName}
              href={setting.href}
            />
          ),
      )}

      <div className="h-20"></div>
    </div>
  );
}
