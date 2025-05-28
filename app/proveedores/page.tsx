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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Filter, Phone, Building, Edit, Trash2, Package } from "lucide-react"

interface Proveedor {
  id: string
  nombre: string
  email: string
  telefono: string
  contacto: string
  categoria: string
  productosAbastece: string[]
  ultimaOrden: string
  evaluacion: number
  estado: "Activo" | "Inactivo" | "Pendiente"
  direccion: string
}

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([
    {
      id: "1",
      nombre: "TechSupply Corp",
      email: "ventas@techsupply.com",
      telefono: "+1 234 567 8901",
      contacto: "Roberto Silva",
      categoria: "Electrónicos",
      productosAbastece: ["Laptops", "Monitores", "Accesorios"],
      ultimaOrden: "2024-01-10",
      evaluacion: 4.5,
      estado: "Activo",
      direccion: "Av. Tecnológica 123, Ciudad Tech",
    },
    {
      id: "2",
      nombre: "Office Solutions",
      email: "ventas@officesolutions.com",
      telefono: "+1 234 567 8902",
      contacto: "Carmen López",
      categoria: "Oficina",
      productosAbastece: ["Muebles", "Papelería", "Equipos"],
      ultimaOrden: "2024-01-08",
      evaluacion: 4.2,
      estado: "Activo",
      direccion: "Calle Comercial 456, Zona Empresarial",
    },
    {
      id: "3",
      nombre: "Global Imports",
      email: "info@globalimports.com",
      telefono: "+1 234 567 8903",
      contacto: "David Chen",
      categoria: "Varios",
      productosAbastece: ["Electrónicos", "Hogar", "Deportes"],
      ultimaOrden: "2023-12-28",
      evaluacion: 3.8,
      estado: "Inactivo",
      direccion: "Puerto Industrial 789, Zona Franca",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    contacto: "",
    categoria: "",
    productosAbastece: "",
    direccion: "",
  })

  const filteredProveedores = proveedores.filter(
    (proveedor) =>
      proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.productosAbastece.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const nuevoProveedor: Proveedor = {
      id: editingProveedor?.id || Date.now().toString(),
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      contacto: formData.contacto,
      categoria: formData.categoria,
      productosAbastece: formData.productosAbastece.split(",").map((p) => p.trim()),
      ultimaOrden: editingProveedor?.ultimaOrden || new Date().toISOString().split("T")[0],
      evaluacion: editingProveedor?.evaluacion || 0,
      estado: "Activo",
      direccion: formData.direccion,
    }

    if (editingProveedor) {
      setProveedores(proveedores.map((p) => (p.id === editingProveedor.id ? nuevoProveedor : p)))
    } else {
      setProveedores([...proveedores, nuevoProveedor])
    }

    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      contacto: "",
      categoria: "",
      productosAbastece: "",
      direccion: "",
    })
    setEditingProveedor(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor)
    setFormData({
      nombre: proveedor.nombre,
      email: proveedor.email,
      telefono: proveedor.telefono,
      contacto: proveedor.contacto,
      categoria: proveedor.categoria,
      productosAbastece: proveedor.productosAbastece.join(", "),
      direccion: proveedor.direccion,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setProveedores(proveedores.filter((p) => p.id !== id))
  }

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Activo":
        return "default"
      case "Inactivo":
        return "secondary"
      case "Pendiente":
        return "destructive"
      default:
        return "default"
    }
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
                  nombre: "",
                  email: "",
                  telefono: "",
                  contacto: "",
                  categoria: "",
                  productosAbastece: "",
                  direccion: "",
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
              <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombre" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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
                  <Label htmlFor="telefono" className="text-right">
                    Teléfono
                  </Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contacto" className="text-right">
                    Contacto
                  </Label>
                  <Input
                    id="contacto"
                    value={formData.contacto}
                    onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoria" className="text-right">
                    Categoría
                  </Label>
                  <Input
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="col-span-3"
                    placeholder="ej. Electrónicos, Oficina"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="productos" className="text-right">
                    Productos
                  </Label>
                  <Input
                    id="productos"
                    value={formData.productosAbastece}
                    onChange={(e) => setFormData({ ...formData, productosAbastece: e.target.value })}
                    className="col-span-3"
                    placeholder="Separar con comas"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="direccion" className="text-right">
                    Dirección
                  </Label>
                  <Textarea
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="col-span-3"
                    required
                  />
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
      <div className="grid gap-4 md:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {proveedores.filter((p) => p.estado === "Activo").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{new Set(proveedores.map((p) => p.categoria)).size}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Evaluación Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {(proveedores.reduce((sum, p) => sum + p.evaluacion, 0) / proveedores.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">de 5 estrellas</p>
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
                  placeholder="Buscar proveedores..."
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
                <TableHead>Proveedor</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Productos que Abastece</TableHead>
                <TableHead>Última Orden</TableHead>
                <TableHead>Evaluación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProveedores.map((proveedor) => (
                <TableRow key={proveedor.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Building className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{proveedor.nombre}</p>
                        <p className="text-sm text-muted-foreground">{proveedor.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{proveedor.contacto}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{proveedor.telefono}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{proveedor.categoria}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {proveedor.productosAbastece.map((producto, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <Package className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{producto}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(proveedor.ultimaOrden).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span>{proveedor.evaluacion}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getEstadoBadgeVariant(proveedor.estado)}>{proveedor.estado}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(proveedor)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(proveedor.id)}>
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
