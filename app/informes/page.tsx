"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  FileText,
} from "lucide-react"

interface ReporteVenta {
  fecha: string
  cliente: string
  productos: number
  total: number
  vendedor: string
}

export default function InformesPage() {
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [tipoReporte, setTipoReporte] = useState("")
  const [reporteGenerado, setReporteGenerado] = useState(false)

  const [ventasData] = useState<ReporteVenta[]>([
    { fecha: "2024-01-15", cliente: "María García", productos: 3, total: 1250.0, vendedor: "Laura Martínez" },
    { fecha: "2024-01-15", cliente: "Juan Pérez", productos: 2, total: 890.5, vendedor: "Roberto Silva" },
    { fecha: "2024-01-14", cliente: "Ana López", productos: 1, total: 320.0, vendedor: "Laura Martínez" },
    { fecha: "2024-01-14", cliente: "Carlos Ruiz", productos: 4, total: 1580.75, vendedor: "Roberto Silva" },
    { fecha: "2024-01-13", cliente: "Elena Torres", productos: 2, total: 675.25, vendedor: "Laura Martínez" },
  ])

  const generarReporte = () => {
    if (!fechaInicio || !fechaFin || !tipoReporte) {
      alert("Por favor completa todos los campos")
      return
    }

    // Simular generación de reporte
    setReporteGenerado(true)

    // En una aplicación real, aquí se haría la llamada a la API
    setTimeout(() => {
      alert(`Reporte de ${tipoReporte} generado exitosamente para el período ${fechaInicio} - ${fechaFin}`)
    }, 1000)
  }

  const exportarReporte = (formato: string) => {
    alert(`Exportando reporte en formato ${formato}...`)
  }

  const ventasFiltradas = ventasData.filter((venta) => {
    if (!fechaInicio || !fechaFin) return true
    const fechaVenta = new Date(venta.fecha)
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)
    return fechaVenta >= inicio && fechaVenta <= fin
  })

  const totalVentas = ventasFiltradas.reduce((sum, venta) => sum + venta.total, 0)
  const totalProductos = ventasFiltradas.reduce((sum, venta) => sum + venta.productos, 0)
  const clientesUnicos = new Set(ventasFiltradas.map((venta) => venta.cliente)).size

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Informes de Ventas</h1>
          <p className="text-muted-foreground">Genera reportes detallados con filtros por fecha</p>
        </div>
        <Button onClick={() => exportarReporte("PDF")}>
          <Download className="mr-2 h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      {/* Generador de reportes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generador de Reportes
          </CardTitle>
          <CardDescription>Configura los parámetros para generar tu reporte personalizado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fechaFin">Fecha de Fin</Label>
              <Input id="fechaFin" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="tipoReporte">Tipo de Reporte</Label>
              <Select value={tipoReporte} onValueChange={setTipoReporte}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ventas">Ventas Detalladas</SelectItem>
                  <SelectItem value="productos">Productos Más Vendidos</SelectItem>
                  <SelectItem value="clientes">Análisis de Clientes</SelectItem>
                  <SelectItem value="vendedores">Rendimiento de Vendedores</SelectItem>
                  <SelectItem value="inventario">Estado de Inventario</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={generarReporte} className="w-full">
                <BarChart3 className="mr-2 h-4 w-4" />
                Generar Reporte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas del período seleccionado */}
      {fechaInicio && fechaFin && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas del Período</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalVentas.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{ventasFiltradas.length} transacciones</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProductos}</div>
              <p className="text-xs text-muted-foreground">Unidades totales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Únicos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientesUnicos}</div>
              <p className="text-xs text-muted-foreground">Clientes diferentes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${ventasFiltradas.length > 0 ? (totalVentas / ventasFiltradas.length).toFixed(2) : "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">Por transacción</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabla de ventas detalladas */}
      {fechaInicio && fechaFin && (
        <Card>
          <CardHeader>
            <CardTitle>Ventas Detalladas</CardTitle>
            <CardDescription>
              Transacciones del período seleccionado ({fechaInicio} - {fechaFin})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Vendedor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ventasFiltradas.map((venta, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(venta.fecha).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{venta.cliente}</TableCell>
                    <TableCell>{venta.productos} unidades</TableCell>
                    <TableCell>${venta.total.toFixed(2)}</TableCell>
                    <TableCell>{venta.vendedor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Reportes predefinidos */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes Predefinidos</CardTitle>
          <CardDescription>Descarga reportes comunes con un solo clic</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium">Reporte Mensual</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Resumen completo de ventas, pedidos y clientes del mes actual
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => exportarReporte("PDF")}>
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportarReporte("Excel")}>
                  <Download className="mr-2 h-4 w-4" />
                  Excel
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Package className="h-5 w-5 text-green-600" />
                <h3 className="font-medium">Inventario Actual</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Estado actual del inventario y productos con stock bajo
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => exportarReporte("PDF")}>
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportarReporte("Excel")}>
                  <Download className="mr-2 h-4 w-4" />
                  Excel
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-5 w-5 text-purple-600" />
                <h3 className="font-medium">Top Clientes</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Clientes con mayor volumen de compras y análisis de comportamiento
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => exportarReporte("PDF")}>
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportarReporte("Excel")}>
                  <Download className="mr-2 h-4 w-4" />
                  Excel
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="h-5 w-5 text-orange-600" />
                <h3 className="font-medium">Análisis Financiero</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Ingresos, gastos y análisis de rentabilidad por período
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => exportarReporte("PDF")}>
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportarReporte("Excel")}>
                  <Download className="mr-2 h-4 w-4" />
                  Excel
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <ShoppingCart className="h-5 w-5 text-red-600" />
                <h3 className="font-medium">Rendimiento de Ventas</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Análisis detallado de pedidos y tiempos de entrega</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => exportarReporte("PDF")}>
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportarReporte("Excel")}>
                  <Download className="mr-2 h-4 w-4" />
                  Excel
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <h3 className="font-medium">Proyecciones</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Análisis de tendencias y proyecciones de ventas futuras
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => exportarReporte("PDF")}>
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportarReporte("Excel")}>
                  <Download className="mr-2 h-4 w-4" />
                  Excel
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
