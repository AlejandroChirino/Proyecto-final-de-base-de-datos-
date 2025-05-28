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
import { Plus, Search, Filter, Mail, Phone, Edit, Trash2, MapPin } from "lucide-react"

interface Cliente {
  id: string
  nombre: string
  email: string
  telefono: string
  direccion: string
  pedidos: number
  totalGastado: number
  estado: "Activo" | "Inactivo"
  fechaRegistro: string
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: "1",
      nombre: "María García",
      email: "maria.garcia@email.com",
      telefono: "+1 234 567 8901",
      direccion: "Av. Principal 123, Ciudad",
      pedidos: 12,
      totalGastado: 1250.0,
      estado: "Activo",
      fechaRegistro: "2023-06-15",
    },
    {
      id: "2",
      nombre: "Juan Pérez",
      email: "juan.perez@email.com",
      telefono: "+1 234 567 8902",
      direccion: "Calle Secundaria 456, Ciudad",
      pedidos: 8,
      totalGastado: 890.5,
      estado: "Activo",
      fechaRegistro: "2023-08-22",
    },
    {
      id: "3",
      nombre: "Ana López",
      email: "ana.lopez@email.com",
      telefono: "+1 234 567 8903",
      direccion: "Plaza Central 789, Ciudad",
      pedidos: 3,
      totalGastado: 320.0,
      estado: "Inactivo",
      fechaRegistro: "2023-12-10",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
  })

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const nuevoCliente: Cliente = {
      id: editingCliente?.id || Date.now().toString(),
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      direccion: formData.direccion,
      pedidos: editingCliente?.pedidos || 0,
      totalGastado: editingCliente?.totalGastado || 0,
      estado: "Activo",
      fechaRegistro: editingCliente?.fechaRegistro || new Date().toISOString().split("T")[0],
    }

    if (editingCliente) {
      setClientes(clientes.map((c) => (c.id === editingCliente.id ? nuevoCliente : c)))
    } else {
      setClientes([...clientes, nuevoCliente])
    }

    setFormData({ nombre: "", email: "", telefono: "", direccion: "" })
    setEditingCliente(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setFormData({
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setClientes(clientes.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Gestiona la información de tus clientes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCliente(null)
                setFormData({ nombre: "", email: "", telefono: "", direccion: "" })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingCliente ? "Editar Cliente" : "Agregar Nuevo Cliente"}</DialogTitle>
              <DialogDescription>
                {editingCliente ? "Modifica la información del cliente." : "Completa la información del nuevo cliente."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
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
                <Button type="submit">{editingCliente ? "Actualizar" : "Agregar"} Cliente</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas de clientes */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientes.length}</div>
            <p className="text-xs text-muted-foreground">+19% este mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {clientes.filter((c) => c.estado === "Activo").length}
            </div>
            <p className="text-xs text-muted-foreground">Últimos 30 días</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Promedio de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {(clientes.reduce((sum, c) => sum + c.pedidos, 0) / clientes.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Por cliente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${(clientes.reduce((sum, c) => sum + c.totalGastado, 0) / clientes.length).toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">Por cliente</p>
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
                  placeholder="Buscar clientes..."
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

      {/* Tabla de clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>Información completa de todos los clientes registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Pedidos</TableHead>
                <TableHead>Total Gastado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-medium">{cliente.nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        Registrado: {new Date(cliente.fechaRegistro).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{cliente.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{cliente.telefono}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{cliente.direccion}</span>
                    </div>
                  </TableCell>
                  <TableCell>{cliente.pedidos}</TableCell>
                  <TableCell>${cliente.totalGastado.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={cliente.estado === "Activo" ? "default" : "secondary"}>{cliente.estado}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(cliente)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(cliente.id)}>
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
