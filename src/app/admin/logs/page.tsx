'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SessionLog {
  id: string
  action: string
  provider?: string
  timestamp: string
  user: {
    email: string
    name?: string
  }
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<SessionLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/admin/session-logs')
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        setLogs(data.logs || [])
      } catch (error) {
        console.error('Error fetching logs:', error)
        setError(error instanceof Error ? error.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActionBadge = (action: string) => {
    return action === 'login' ? (
      <Badge className="bg-success text-white border-[var(--color-success)]">
        Login
      </Badge>
    ) : (
      <Badge className="bg-error text-white border-[var(--color-error)]">
        Logout
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando logs de sesión...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 pt-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Error al cargar logs
              </h2>
              <p className="text-gray-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Reintentar
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className=" min-h-screen">
      <div className="container mx-auto px-4 ">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Logs de Sesión
            </h1>
            <p className="mt-2 text-gray-600">
              Historial de actividad de login y logout de usuarios.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white border-border-default">
              <CardContent className="pt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-success)]">
                    {logs.filter(log => log.action === 'login').length}
                  </div>
                  <div className="text-sm text-gray-600">Logins</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-border-default">
              <CardContent className="pt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-error)]">
                    {logs.filter(log => log.action === 'logout').length}
                  </div>
                  <div className="text-sm text-gray-600">Logouts</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-border-default">
              <CardContent className="pt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-info)]">
                    {new Set(logs.map(log => log.user.email)).size}
                  </div>
                  <div className="text-sm text-gray-600">Usuarios únicos</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Logs Table */}
          <Card className="bg-white  p-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                Actividad de Sesiones
                {logs.length > 0 && (
                  <Badge variant="outline" className="border-border-default text-gray-600">
                    {logs.length} eventos
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No hay logs de sesión disponibles.
                  <br />
                  <span className="text-sm">
                    Los logs aparecerán aquí después de que los usuarios hagan login o logout.
                  </span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full ">
                    <thead>
                      <tr className="border-b border-gray-500 text-gray-700">
                        <th className="text-left p-3 font-medium ">Usuario</th>
                        <th className="text-left p-3 font-medium ">Acción</th>
                        <th className="text-left p-3 font-medium ">Proveedor</th>
                        <th className="text-left p-3 font-medium ">Fecha y Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id} className="border-b border-gray-200">
                          <td className="p-3">
                            <div>
                              <div className="font-medium text-gray-600">
                                {log.user.name || 'Usuario sin nombre'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {log.user.email}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            {getActionBadge(log.action)}
                          </td>
                          <td className="p-3">
                            <span className="text-sm text-gray-700">
                              {log.provider || 'N/A'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm text-gray-700">
                              {formatDate(log.timestamp)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}