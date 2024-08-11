import Banner from "./_components/Banner";
import ProductsHomeContainer from "./_components/ProductsHomeContainer";
import SectionsHomeContainer from "./_components/SectionsHomeContainer";

export default async function Home() {
  return (
    <main>
      <Banner type="main" />
      <SectionsHomeContainer type="categories" />

      <ProductsHomeContainer type="purchases" />
      {/* <ProductsHomeContainer type="views" /> */}
      <ProductsHomeContainer type="newest offers" />

      <SectionsHomeContainer type="brands" />

      <div className="h-20"></div>
    </main>
  );
}
