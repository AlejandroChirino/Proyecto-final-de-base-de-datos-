"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Building, Edit, Trash2, Package } from "lucide-react"
import type { Proveedor } from "@/types/database"
import { proveedores as proveedoresIniciales, productos } from "@/data/mockData"

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>(proveedoresIniciales)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null)
  const [formData, setFormData] = useState({
    id_prov: "",
    Producto_codigo: "",
    nombre_prov: "",
    email: "",
  })

  const filteredProveedores = proveedores.filter(
    (proveedor) =>
      proveedor.nombre_prov.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getProductoNombre = (codigo: number): string => {
    const producto = productos.find((p) => p.codigo === codigo)
    return producto?.nombre_prod || "Producto no encontrado"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const nuevoProveedor: Proveedor = {
      id_prov: editingProveedor?.id_prov || formData.id_prov,
      Producto_codigo: Number.parseInt(formData.Producto_codigo),
      nombre_prov: formData.nombre_prov,
      email: formData.email,
    }

    if (editingProveedor) {
      setProveedores(proveedores.map((p) => (p.id_prov === editingProveedor.id_prov ? nuevoProveedor : p)))
    } else {
      setProveedores([...proveedores, nuevoProveedor])
    }

    setFormData({
      id_prov: "",
      Producto_codigo: "",
      nombre_prov: "",
      email: "",
    })
    setEditingProveedor(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor)
    setFormData({
      id_prov: proveedor.id_prov,
      Producto_codigo: proveedor.Producto_codigo.toString(),
      nombre_prov: proveedor.nombre_prov,
      email: proveedor.email,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id_prov: string) => {
    setProveedores(proveedores.filter((p) => p.id_prov !== id_prov))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proveedores</h1>
          <p className="text-muted-foreground">Gestiona las relaciones con tus proveedores</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingProveedor(null)
                setFormData({
                  id_prov: "",
                  Producto_codigo: "",
                  nombre_prov: "",
                  email: "",
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingProveedor ? "Editar Proveedor" : "Agregar Nuevo Proveedor"}</DialogTitle>
              <DialogDescription>
                {editingProveedor
                  ? "Modifica la información del proveedor."
                  : "Completa la información del nuevo proveedor."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="id_prov" className="text-right">
                    ID Proveedor
                  </Label>
                  <Input
                    id="id_prov"
                    value={formData.id_prov}
                    onChange={(e) => setFormData({ ...formData, id_prov: e.target.value })}
                    className="col-span-3"
                    disabled={!!editingProveedor}
                    placeholder="ej. PROV001"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombre_prov" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="nombre_prov"
                    value={formData.nombre_prov}
                    onChange={(e) => setFormData({ ...formData, nombre_prov: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="Producto_codigo" className="text-right">
                    Producto
                  </Label>
                  <Select
                    value={formData.Producto_codigo}
                    onValueChange={(value) => setFormData({ ...formData, Producto_codigo: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {productos.map((producto) => (
                        <SelectItem key={producto.codigo} value={producto.codigo.toString()}>
                          {producto.codigo} - {producto.nombre_prod}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingProveedor ? "Actualizar" : "Agregar"} Proveedor</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas de proveedores */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Proveedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proveedores.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Productos Abastecidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Set(proveedores.map((p) => p.Producto_codigo)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Proveedores Únicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Set(proveedores.map((p) => p.nombre_prov)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar proveedores por nombre o email..."
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

      {/* Tabla de proveedores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
          <CardDescription>Información de todos los proveedores registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Proveedor</TableHead>
                <TableHead>Nombre Proveedor</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Producto que Abastece</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProveedores.map((proveedor) => (
                <TableRow key={proveedor.id_prov}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Building className="h-4 w-4 text-white" />
                      </div>
                      {proveedor.id_prov}
                    </div>
                  </TableCell>
                  <TableCell>{proveedor.nombre_prov}</TableCell>
                  <TableCell>{proveedor.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Código: {proveedor.Producto_codigo}</p>
                        <p className="text-sm text-muted-foreground">{getProductoNombre(proveedor.Producto_codigo)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(proveedor)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(proveedor.id_prov)}>
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
