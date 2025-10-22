import { auth } from "@/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Badge, Calendar, Package, ShoppingCart, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function ProfilePage() {
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
                                Por favor, inicia sesión para ver tu perfil.
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

    // Si hay sesión, mostrar información del usuario
    return (
        <div className="container mx-auto px-4 pt-4">
            <h1 className="text-2xl font-bold mb-4">Perfil de Usuario</h1>
            <Card className="bg-bg-card p-6 mb-6">
                <CardHeader>
                    <div className="flex items-center space-x-4">
                      {session.user?.image ? (
                        <div className="relative">
                          <Image
                            src={session.user.image}
                            alt={session.user.name || "Usuario"}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover"
                            priority
                          />
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-bg-card"></div>
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center relative">
                          <User className="w-8 h-8 text-white" />
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-primary-500"></div>
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-xl text-text-primary">
                          {session.user?.name || "Usuario"}
                        </CardTitle>
                        <p className="text-text-secondary text-sm flex items-center">
                          <Badge className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          Miembro desde {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-text-secondary" />
                        <div>
                            <p className="text-sm text-text-secondary">Email</p>
                            <p className="text-text-primary font-medium">
                                {session.user?.email}
                            </p>
                        </div>
                    </div>


                    <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-text-secondary" />
                        <div>
                            <p className="text-sm text-text-secondary">Último Acceso</p>
                            <p className="text-text-primary font-medium">
                                {new Date().toLocaleString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sección de acciones rápidas */}
            <Card className="bg-bg-card p-6">
              <CardHeader>
                <CardTitle className="text-lg text-text-primary flex items-center mb-2">
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3">
                <Link href="/orders">
                  <Button variant="outline" className="w-full justify-start h-12 group hover:border-primary-500 transition-colors">
                    <Package className="w-5 h-5 mr-3 text-primary-500 group-hover:text-primary-600" />
                    <div className="text-left">
                      <p className="font-medium">Mis Órdenes</p>
                      <p className="text-xs text-text-secondary">Ver historial de compras</p>
                    </div>
                  </Button>
                </Link>
                
                <Link href="/checkout">
                  <Button variant="outline" className="w-full justify-start h-12 group hover:border-primary-500 transition-colors">
                    <ShoppingCart className="w-5 h-5 mr-3 text-primary-500 group-hover:text-primary-600" />
                    <div className="text-left">
                      <p className="font-medium">Checkout</p>
                      <p className="text-xs text-text-secondary">Finalizar compra</p>
                    </div>
                  </Button>
                </Link>
                
                <Link href="/">
                  <Button variant="outline" className="w-full justify-start h-12 group hover:border-primary-500 transition-colors">
                    <Home className="w-5 h-5 mr-3 text-primary-500 group-hover:text-primary-600" />
                    <div className="text-left">
                      <p className="font-medium">Tienda</p>
                      <p className="text-xs text-text-secondary">Explorar productos</p>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Nota informativa */}
            <div className="text-center text-sm text-text-secondary mt-6">
                <p>¿Necesitas ayuda? Contacta a soporte@min-commerce.com</p>
            </div>

        </div>
    )
}