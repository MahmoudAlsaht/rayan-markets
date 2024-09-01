import Privacy from "../../../components/Privacy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
};

export default function PrivacyPolicy() {
  return (
    <div className="container h-full w-8/12 overflow-scroll p-5" dir="rtl">
      <Privacy />
    </div>
  );
}
