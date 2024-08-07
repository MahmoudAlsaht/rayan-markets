import Banner from "./_components/Banner";
import SectionsHomeContainer from "./_components/SectionsHomeContainer";
import ProductsHomeContainer from "./_components/ProductsHomeContainer";

export default async function Home() {
  return (
    <main dir="rtl">
      <Banner type="main" />
      <div>
        <SectionsHomeContainer type="categories" />

        <ProductsHomeContainer type="purchases" />
        {/* <ProductsHomeContainer type="views" /> */}
        <ProductsHomeContainer type="newest offers" />

        <SectionsHomeContainer type="brands" />
      </div>

      <div className="h-24"></div>
    </main>
  );
}
