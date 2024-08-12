import ProductCard, { ProductCardProps } from "./ProductCard";

export default function ProductsContainer({
  products,
  handleCloseSearch,
}: {
  products: ProductCardProps[];
  handleCloseSearch?: () => void;
}) {
  return (
    <main dir="rtl" className="hidden sm:block">
      <section className="mb-5 grid w-full grid-cols-2 gap-x-0 gap-y-5 bg-inherit py-6 sm:mx-auto sm:grid-cols-3 sm:gap-x-2 sm:gap-y-5 md:grid-cols-4 md:gap-2 lg:grid-cols-5">
        {products?.map((product) => (
          <ProductCard
            handleCloseSearch={handleCloseSearch}
            key={product.id}
            product={product}
          />
        ))}
      </section>
    </main>
  );
}
