import ProductList from '../app/components/ProductList';

export default async function Home() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const apiUrl = `${BASE_URL}/api/products`;

  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_BASE_URL no está configurada en el entorno del servidor.");
  }

  try {
    const res = await fetch(apiUrl, {
      next: {
        revalidate: 3600
      }
    });

    if (!res.ok) {
      // Mejorar el manejo de errores si la API falla
      throw new Error(`Fallo al cargar productos: Status ${res.status}`);
    }

    const products = await res.json();

    return (
      <div className="pt-4">
        <h2 className="text-xl font-extrabold text-text-inverse text-start px-4">
          Catálogo de Productos
        </h2>
        <ProductList products={products} />
      </div>
    );
  } catch (error) {

    console.error("Error en la obtención de datos:", error);
    return <div className="p-4 text-red-500">Error al cargar el catálogo. Por favor, inténtelo de nuevo más tarde.</div>;
  }
}

