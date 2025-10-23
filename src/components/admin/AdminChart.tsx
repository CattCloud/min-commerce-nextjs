"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'
import { useMemo } from 'react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface ChartData {
  status?: string
  count?: number
  name?: string
  totalSold?: number
  date?: string
  sales?: number
}

interface AdminChartProps {
  data: ChartData[]
  type?: "bar" | "pie" | "line"
}

export function AdminChart({ data, type = "bar" }: AdminChartProps) {
  // Colores para diferentes estados
  const colors = useMemo(() => ({
    'pending': '#f59e0b',    // amber-500
    'processing': '#3b82f6', // blue-500
    'shipped': '#8b5cf6',    // violet-500
    'delivered': '#10b981',  // emerald-500
    'cancelled': '#ef4444',  // red-500
  }), [])

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: []
      }
    }

    if (type === "line") {
      // Para gráfico de línea (ventas diarias)
      return {
        labels: data.map(item => item.date || '').filter(Boolean),
        datasets: [
          {
            label: 'Ventas',
            data: data.map(item => item.sales || 0).filter(val => val !== undefined),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      }
    } else {
      // Para gráfico de barras (productos populares)
      return {
        labels: data.map(item => {
          if (item.name) return item.name
          const statusLabels = {
            'pending': 'Pendiente',
            'processing': 'Procesando',
            'shipped': 'Enviado',
            'delivered': 'Entregado',
            'cancelled': 'Cancelado'
          }
          return statusLabels[item.status as keyof typeof statusLabels] || item.status || 'Desconocido'
        }).filter(Boolean),
        datasets: [
          {
            label: type === "pie" ? 'Productos' : 'Cantidad',
            data: data.map(item => item.count || item.totalSold || 0),
            backgroundColor: [
              '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'
            ],
            borderColor: [
              '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'
            ],
            borderWidth: 1,
          },
        ],
      }
    }
  }, [data, type, colors])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: type === "pie",
        position: 'bottom' as const,
      },
      title: {
        display: false,
      },
    },
    scales: type === "bar" ? {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    } : undefined,
  }), [type])

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No hay datos disponibles
      </div>
    )
  }

  return (
    <div className="h-64">
      {type === "pie" ? (
        <Pie data={chartData} options={options} />
      ) : type === "line" ? (
        <Line data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  )
}