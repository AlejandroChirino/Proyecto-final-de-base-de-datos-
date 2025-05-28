"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react"
import type { Producto } from "@/types/database"
import { productos as productosIniciales } from "@/data/mockData"

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null)
  const [formData, setFormData] = useState({
    codigo: "",
    nombre_prod: "",
    precio: "",
    cant_stock: "",
  })

  const filteredProductos = productos.filter(
    (producto) =>
      producto.nombre_prod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.codigo.toString().includes(searchTerm),
  )

  const getEstadoStock = (cantStock: number): string => {
    if (cantStock === 0) return "Agotado"
    if (cantStock < 10) return "Stock Bajo"
    return "En Stock"
  }

  const getStockBadgeVariant = (estado: string) => {
    switch (estado) {
      case "En Stock":
        return "default"
      case "Stock Bajo":
        return "destructive"
      case "Agotado":
        return "secondary"
      default:
        return "default"
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const nuevoProducto: Producto = {
      codigo: editingProducto?.codigo || Number.parseInt(formData.codigo),
      nombre_prod: formData.nombre_prod,
      precio: Number.parseFloat(formData.precio),
      cant_stock: Number.parseInt(formData.cant_stock),
    }

    if (editingProducto) {
      setProductos(productos.map((p) => (p.codigo === editingProducto.codigo ? nuevoProducto : p)))
    } else {
      setProductos([...productos, nuevoProducto])
    }

    setFormData({ codigo: "", nombre_prod: "", precio: "", cant_stock: "" })
    setEditingProducto(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto)
    setFormData({
      codigo: producto.codigo.toString(),
      nombre_prod: producto.nombre_prod,
      precio: producto.precio.toString(),
      cant_stock: producto.cant_stock.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (codigo: number) => {
    setProductos(productos.filter((p) => p.codigo !== codigo))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">Gestiona todos los productos de tu tienda</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingProducto(null)
                setFormData({ codigo: "", nombre_prod: "", precio: "", cant_stock: "" })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingProducto ? "Editar Producto" : "Agregar Nuevo Producto"}</DialogTitle>
              <DialogDescription>
                {editingProducto
                  ? "Modifica la información del producto."
                  : "Completa la información del nuevo producto."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="codigo" className="text-right">
                    Código
                  </Label>
                  <Input
                    id="codigo"
                    type="number"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    className="col-span-3"
                    disabled={!!editingProducto}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombre_prod" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="nombre_prod"
                    value={formData.nombre_prod}
                    onChange={(e) => setFormData({ ...formData, nombre_prod: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="precio" className="text-right">
                    Precio
                  </Label>
                  <Input
                    id="precio"
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cant_stock" className="text-right">
                    Stock
                  </Label>
                  <Input
                    id="cant_stock"
                    type="number"
                    value={formData.cant_stock}
                    onChange={(e) => setFormData({ ...formData, cant_stock: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingProducto ? "Actualizar" : "Agregar"} Producto</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {productos.filter((p) => getEstadoStock(p.cant_stock) === "En Stock").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {productos.filter((p) => getEstadoStock(p.cant_stock) === "Stock Bajo").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Agotados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {productos.filter((p) => getEstadoStock(p.cant_stock) === "Agotado").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar productos por nombre o código..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de productos */}
      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
          <CardDescription>Lista completa de productos en inventario</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre Producto</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Cantidad Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProductos.map((producto) => (
                <TableRow key={producto.codigo}>
                  <TableCell className="font-medium">{producto.codigo}</TableCell>
                  <TableCell>{producto.nombre_prod}</TableCell>
                  <TableCell>${producto.precio.toFixed(2)}</TableCell>
                  <TableCell>{producto.cant_stock}</TableCell>
                  <TableCell>
                    <Badge variant={getStockBadgeVariant(getEstadoStock(producto.cant_stock))}>
                      {getEstadoStock(producto.cant_stock)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(producto)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(producto.codigo)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
