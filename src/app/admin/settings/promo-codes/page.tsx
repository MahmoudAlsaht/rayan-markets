import BackButtonNav from "@/components/BackButtonNav";
import PageHeader from "@/components/PageHeader";
import { getAllPromos } from "./_actions/getAllPromos";
import PromosTable from "./_components/PromosTable";

export default async function PromosSettingsPage() {
  const brands = await getAllPromos();

  return (
    <main dir="rtl">
      <BackButtonNav href="/admin" />
      <PageHeader title="إعدادات كوبونات الخصم" />

      <PromosTable data={brands} />
      <div className="h-20"></div>
    </main>
  );
}
