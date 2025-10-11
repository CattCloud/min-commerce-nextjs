import ProductList from '../app/components/ProductList';

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    cache: 'no-store', 
  });
  const products = await res.json();

  return (
    <div className="pt-4">
      <h2 className="text-xl font-extrabold text-text-inverse text-start px-4">
        Catálogo de Productos
      </h2>
      <ProductList products={products} />
    </div>
  );
}

