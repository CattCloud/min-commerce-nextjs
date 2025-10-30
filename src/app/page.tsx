import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
    const session = await auth();

    // Si hay sesión, redirigir según el rol
    if (session) {
        if (session.user?.role === "admin") {
            // Redirigir administradores al dashboard
            return (
                <div className="min-h-screen flex items-center justify-center bg-bg-body">
                    <Card className="w-full max-w-md p-8 text-center">
                        <CardHeader>
                            <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Lock className="w-8 h-8 text-primary-600" />
                            </div>
                            <CardTitle className="text-xl text-text-primary">
                                Redirigiendo al Panel de Administración
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-text-secondary mb-4">
                                Como administrador, estás siendo redirigido a tu panel de control.
                            </p>
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        </CardContent>
                    </Card>
                </div>
            );
        } else {
            // Redirigir usuarios al catálogo
            return (
                <div className="min-h-screen flex items-center justify-center bg-bg-body">
                    <Card className="w-full max-w-md p-8 text-center">
                        <CardHeader>
                            <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <ShoppingBag className="w-8 h-8 text-primary-600" />
                            </div>
                            <CardTitle className="text-xl text-text-primary">
                                Redirigiendo al Catálogo
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-text-secondary mb-4">
                                Como usuario, estás siendo redirigido al catálogo de productos.
                            </p>
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        </CardContent>
                    </Card>
                </div>
            );
        }
    }

    // Página de bienvenida para usuarios no autenticados
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
            <div className="container mx-auto px-4 pt-8">
                <div className="mx-auto">
                    {/* Header principal */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold text-primary-600 mb-4">
                            Min-Commerce
                        </h1>
                        <p className="text-xl text-shadow-text-secondary mb-8">
                            Tu tienda online de confianza
                        </p>
                    </div>

                    {/* Sección de autenticación */}
                    <div className="gap-8 mb-12">
                        <Card className="bg-bg-card p-8">
                            <CardHeader>
                                <CardTitle className="text-2xl text-text-primary flex items-center mb-4">
                                    <User className="w-8 h-8 mr-3 text-primary-500" />
                                    ¿Ya tienes cuenta?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-text-secondary mb-6">
                                    Inicia sesión para acceder a tu catálogo personalizado y realizar compras.
                                </p>
                                <Link href="/api/auth/signin">
                                    <Button className="w-full h-12 text-lg group bg-primary-600 hover:bg-primary-700 text-white">
                                        Iniciar Sesión
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Características principales */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <Card className="bg-bg-card p-6 text-center">
                            <div className="w-12 h-12 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-primary-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">
                                Catálogo Exclusivo
                            </h3>
                            <p className="text-text-secondary">
                                Accede a productos seleccionados solo para miembros registrados.
                            </p>
                        </Card>

                        <Card className="bg-bg-card p-6 text-center">
                            <div className="w-12 h-12 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Lock className="w-6 h-6 text-primary-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">
                                Compras Seguras
                            </h3>
                            <p className="text-text-secondary">
                                Tu información y pagos siempre protegidos.
                            </p>
                        </Card>

                        <Card className="bg-bg-card p-6 text-center">
                            <div className="w-12 h-12 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <User className="w-6 h-6 text-primary-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">
                                Experiencia Personalizada
                            </h3>
                            <p className="text-text-secondary">
                                Recomendaciones basadas en tu historial de compras.
                            </p>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}

