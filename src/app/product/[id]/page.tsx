import ProductDetailPage from "../../pages/ProductDetailPage";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(`/api/products/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }

  const product = await res.json();

  return <ProductDetailPage product={product} />;
}