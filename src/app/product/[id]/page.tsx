import ProductDetailPage from "../../pages/ProductDetailPage";

interface ProductPageProps {
  params: {
    id: string; 
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = params; 

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  
  if (!BASE_URL) {
      throw new Error("NEXT_PUBLIC_BASE_URL no está configurada.");
  }
  
  const apiUrl = `${BASE_URL}/api/products/${id}`; 

  const res = await fetch(apiUrl, { 
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`Error fetching product ${id}: Status ${res.status}`, errorBody);
    throw new Error(`Failed to fetch product: ${res.status}`);
  }

  const product = await res.json();

  return <ProductDetailPage product={product} />;
}