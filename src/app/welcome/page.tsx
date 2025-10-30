import { auth } from "@/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Badge, Calendar, Package, ShoppingCart, Home, Settings, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import RoleIndicator from "@/components/RoleIndicator"

export default async function WelcomePage() {
    const session = await auth()

    // Si no hay sesión, mostrar mensaje de acceso denegado
    if (!session) {
        return (
            <div className="container mx-auto px-4 pt-4">
                <div className="max-w-md mx-auto text-center">
                    <Card className="bg-bg-card p-8 text-center">
                        <CardHeader>
                            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <User className="w-8 h-8 text-gray-400" />
                            </div>
                            <CardTitle className="text-xl text-text-primary">
                                Acceso Denegado
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-text-secondary mb-6">
                                Por favor, inicia sesión para acceder a la plataforma.
                            </p>
                            <Link href="/">
                                <Button className="w-full">
                                    Volver al Inicio
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    // Si hay sesión, mostrar página de bienvenida personalizada
    const isAdmin = session.user?.role === "admin"
    const welcomeMessage = isAdmin 
        ? "¡Bienvenido Administrador!" 
        : "¡Bienvenido a Min-Commerce!"

    const userRoleText = isAdmin ? "Administrador" : "Usuario"

    return (
        <div className="container mx-auto px-4 pt-4">
            <div className="max-w-4xl mx-auto">
                {/* Header de bienvenida */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-text-primary mb-4">
                        {welcomeMessage}
                    </h1>
                    <p className="text-xl text-text-secondary mb-2">
                        Has iniciado sesión como <span className="font-semibold text-primary-600">{userRoleText}</span>
                    </p>
                    <p className="text-text-secondary">
                        {new Date().toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>

                {/* Información del usuario */}
                <Card className="bg-bg-card p-6 mb-8">
                    <CardHeader>
                        <div className="flex items-center space-x-4 space-y-2">
                            {session.user?.image ? (
                                <div className="relative">
                                    <Image
                                        src={session.user.image}
                                        alt={session.user.name || "Usuario"}
                                        width={80}
                                        height={80}
                                        className="w-20 h-20 rounded-full object-cover"
                                        priority
                                    />
                                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-bg-card"></div>
                                </div>
                            ) : (
                                <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center relative">
                                    <User className="w-10 h-10 text-white" />
                                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-primary-500"></div>
                                </div>
                            )}
                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <CardTitle className="text-2xl text-text-primary">
                                        {session.user?.name || "Usuario"}
                                    </CardTitle>
                                    <RoleIndicator role={session.user?.role} size="md" />
                                </div>
                                <p className="text-text-secondary flex items-center">
                                    <Badge className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                                    {session.user?.email}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Mail className="w-6 h-6 text-text-secondary" />
                            <div>
                                <p className="text-sm text-text-secondary">Email</p>
                                <p className="text-text-primary font-medium">
                                    {session.user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Calendar className="w-6 h-6 text-text-secondary" />
                            <div>
                                <p className="text-sm text-text-secondary">Último Acceso</p>
                                <p className="text-text-primary font-medium">
                                    {new Date().toLocaleString('es-ES')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Acciones rápidas según rol */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Acciones para administradores */}
                    {isAdmin && (
                        <Card className="bg-bg-card p-6">
                            <CardHeader>
                                <CardTitle className="text-lg text-text-primary flex items-center mb-4">
                                    <Settings className="w-6 h-6 mr-2 text-primary-500" />
                                    Panel de Administración
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href="/admin">
                                    <Button variant="default" className="w-full justify-start h-12 group bg-primary-600 hover:bg-primary-700 text-white">
                                        <Settings className="w-5 h-5 mr-3" />
                                        <div className="text-left">
                                            <p className="font-medium">Dashboard Admin</p>
                                            <p className="text-xs opacity-90">Gestionar el sistema</p>
                                        </div>
                                    </Button>
                                </Link>
                                
                                <Link href="/admin/logs">
                                    <Button variant="outline" className="w-full justify-start h-12 group hover:border-primary-500 transition-colors">
                                            <Package className="w-5 h-5 mr-3 text-primary-500 group-hover:text-primary-600" />
                                            <div className="text-left">
                                                <p className="font-medium">Logs de Sesión</p>
                                                <p className="text-xs text-text-secondary">Ver actividad de usuarios</p>
                                            </div>
                                        </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    {/* Acciones para todos los usuarios */}
                    <Card className="bg-bg-card p-6">
                        <CardHeader>
                            <CardTitle className="text-lg text-text-primary flex items-center mb-4">
                                <ShoppingBag className="w-6 h-6 mr-2 text-primary-500" />
                                Tienda
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href="/catalog">
                                <Button variant="default" className="w-full justify-start h-12 group bg-primary-600 hover:bg-primary-700 text-white">
                                    <ShoppingBag className="w-5 h-5 mr-3" />
                                    <div className="text-left">
                                        <p className="font-medium">Catálogo de Productos</p>
                                        <p className="text-xs opacity-90">Explorar nuestros productos</p>
                                    </div>
                                </Button>
                            </Link>
                            
                            <Link href="/orders">
                                <Button variant="outline" className="w-full justify-start h-12 group hover:border-primary-500 transition-colors">
                                    <Package className="w-5 h-5 mr-3 text-primary-500 group-hover:text-primary-600" />
                                    <div className="text-left">
                                        <p className="font-medium">Mis Órdenes</p>
                                        <p className="text-xs text-text-secondary">Ver historial de compras</p>
                                    </div>
                                </Button>
                            </Link>
                            
                            <Link href="/cart">
                                <Button variant="outline" className="w-full justify-start h-12 group hover:border-primary-500 transition-colors">
                                    <ShoppingCart className="w-5 h-5 mr-3 text-primary-500 group-hover:text-primary-600" />
                                    <div className="text-left">
                                        <p className="font-medium">Mi Carrito</p>
                                        <p className="text-xs text-text-secondary">Ver productos seleccionados</p>
                                    </div>
                                </Button>
                            </Link>
                            
                            <Link href="/profile">
                                <Button variant="outline" className="w-full justify-start h-12 group hover:border-primary-500 transition-colors">
                                    <User className="w-5 h-5 mr-3 text-primary-500 group-hover:text-primary-600" />
                                    <div className="text-left">
                                        <p className="font-medium">Mi Perfil</p>
                                        <p className="text-xs text-text-secondary">Gestionar mi cuenta</p>
                                    </div>
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Mensaje informativo */}
                <div className="text-center text-sm text-text-secondary mt-8">
                    <p>¿Necesitas ayuda? Contacta a soporte@min-commerce.com</p>
                </div>
            </div>
        </div>
    )
}