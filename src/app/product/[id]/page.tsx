import ProductDetailPage from "../../pages/ProductDetailPage";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(`http://localhost:3000/api/products/${params.id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }

  const product = await res.json();

  return <ProductDetailPage product={product} />;
}