import ProductList from '../../app/components/ProductList';
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User } from "lucide-react";
import Link from "next/link";

export default async function CatalogPage() {
    const session = await auth();
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
            throw new Error(`Fallo al cargar productos: Status ${res.status}`);
        }

        const products = await res.json();

        return (
            <div className="container mx-auto px-4 pt-4">
                {/* Header del catálogo */}
                <h1 className="text-2xl font-bold mb-2">Catalogo de Productos</h1>


                {/* Lista de productos */}
                <ProductList products={products} />

                {/* Footer para usuarios no autenticados */}
                {!session && (
                    <Card className="mt-8 bg-bg-card">
                        <CardContent className="text-center p-6">
                            <User className="w-12 h-12 mx-auto mb-4 text-text-secondary" />
                            <h3 className="text-lg font-semibold text-text-primary mb-2">
                                ¿Quieres comprar?
                            </h3>
                            <p className="text-text-secondary mb-4">
                                Inicia sesión para agregar productos a tu carrito y realizar compras.
                            </p>
                            <div className="flex space-x-4 justify-center">
                                <Link href="/">
                                    <Button variant="outline">
                                        Volver al Inicio
                                    </Button>
                                </Link>
                                <Link href="/api/auth/signin">
                                    <Button>
                                        Iniciar Sesión
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        );
    } catch (error) {
        console.error("Error en la obtención de datos:", error);
        return <div className="p-4 text-red-500">Error al cargar el catálogo. Por favor, inténtelo de nuevo más tarde.</div>;
    }
}