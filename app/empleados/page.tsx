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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Mail, Phone, User, Edit, Trash2, MapPin } from "lucide-react"

interface Empleado {
  id: string
  nombre: string
  email: string
  telefono: string
  rol: "Gestor" | "Repartidor" | "Administrador" | "Vendedor"
  departamento: string
  zonaCobertura?: string
  jerarquia: string
  estado: "Activo" | "Inactivo" | "Vacaciones"
  fechaIngreso: string
}

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([
    {
      id: "1",
      nombre: "Carlos Rodríguez",
      email: "carlos.rodriguez@mercadovirtual.com",
      telefono: "+1 234 567 8901",
      rol: "Administrador",
      departamento: "Administración",
      jerarquia: "Director General",
      estado: "Activo",
      fechaIngreso: "2022-01-15",
    },
    {
      id: "2",
      nombre: "Laura Martínez",
      email: "laura.martinez@mercadovirtual.com",
      telefono: "+1 234 567 8902",
      rol: "Gestor",
      departamento: "Ventas",
      jerarquia: "Supervisor de Ventas",
      estado: "Activo",
      fechaIngreso: "2022-03-20",
    },
    {
      id: "3",
      nombre: "Miguel Torres",
      email: "miguel.torres@mercadovirtual.com",
      telefono: "+1 234 567 8903",
      rol: "Repartidor",
      departamento: "Logística",
      zonaCobertura: "Zona Norte",
      jerarquia: "Repartidor Senior",
      estado: "Vacaciones",
      fechaIngreso: "2022-06-10",
    },
    {
      id: "4",
      nombre: "Ana Fernández",
      email: "ana.fernandez@mercadovirtual.com",
      telefono: "+1 234 567 8904",
      rol: "Repartidor",
      departamento: "Logística",
      zonaCobertura: "Zona Sur",
      jerarquia: "Repartidor",
      estado: "Activo",
      fechaIngreso: "2023-02-14",
    },
    {
      id: "5",
      nombre: "Roberto Silva",
      email: "roberto.silva@mercadovirtual.com",
      telefono: "+1 234 567 8905",
      rol: "Vendedor",
      departamento: "Ventas",
      jerarquia: "Vendedor Senior",
      estado: "Activo",
      fechaIngreso: "2023-05-08",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    rol: "",
    departamento: "",
    zonaCobertura: "",
    jerarquia: "",
  })

  const filteredEmpleados = empleados.filter(
    (empleado) =>
      empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empleado.rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empleado.departamento.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const nuevoEmpleado: Empleado = {
      id: editingEmpleado?.id || Date.now().toString(),
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      rol: formData.rol as Empleado["rol"],
      departamento: formData.departamento,
      zonaCobertura: formData.zonaCobertura || undefined,
      jerarquia: formData.jerarquia,
      estado: "Activo",
      fechaIngreso: editingEmpleado?.fechaIngreso || new Date().toISOString().split("T")[0],
    }

    if (editingEmpleado) {
      setEmpleados(empleados.map((e) => (e.id === editingEmpleado.id ? nuevoEmpleado : e)))
    } else {
      setEmpleados([...empleados, nuevoEmpleado])
    }

    setFormData({ nombre: "", email: "", telefono: "", rol: "", departamento: "", zonaCobertura: "", jerarquia: "" })
    setEditingEmpleado(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (empleado: Empleado) => {
    setEditingEmpleado(empleado)
    setFormData({
      nombre: empleado.nombre,
      email: empleado.email,
      telefono: empleado.telefono,
      rol: empleado.rol,
      departamento: empleado.departamento,
      zonaCobertura: empleado.zonaCobertura || "",
      jerarquia: empleado.jerarquia,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setEmpleados(empleados.filter((e) => e.id !== id))
  }

  const getRolColor = (rol: string) => {
    switch (rol) {
      case "Administrador":
        return "bg-blue-600"
      case "Gestor":
        return "bg-green-600"
      case "Repartidor":
        return "bg-orange-600"
      case "Vendedor":
        return "bg-purple-600"
      default:
        return "bg-gray-600"
    }
  }

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Activo":
        return "default"
      case "Vacaciones":
        return "secondary"
      case "Inactivo":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empleados</h1>
          <p className="text-muted-foreground">Gestiona el equipo de trabajo de Mercado Virtual</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingEmpleado(null)
                setFormData({
                  nombre: "",
                  email: "",
                  telefono: "",
                  rol: "",
                  departamento: "",
                  zonaCobertura: "",
                  jerarquia: "",
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingEmpleado ? "Editar Empleado" : "Agregar Nuevo Empleado"}</DialogTitle>
              <DialogDescription>
                {editingEmpleado
                  ? "Modifica la información del empleado."
                  : "Completa la información del nuevo empleado."}
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
                  <Label htmlFor="rol" className="text-right">
                    Rol
                  </Label>
                  <Select value={formData.rol} onValueChange={(value) => setFormData({ ...formData, rol: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrador">Administrador</SelectItem>
                      <SelectItem value="Gestor">Gestor</SelectItem>
                      <SelectItem value="Repartidor">Repartidor</SelectItem>
                      <SelectItem value="Vendedor">Vendedor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="departamento" className="text-right">
                    Departamento
                  </Label>
                  <Select
                    value={formData.departamento}
                    onValueChange={(value) => setFormData({ ...formData, departamento: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administración">Administración</SelectItem>
                      <SelectItem value="Ventas">Ventas</SelectItem>
                      <SelectItem value="Logística">Logística</SelectItem>
                      <SelectItem value="Almacén">Almacén</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.rol === "Repartidor" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="zonaCobertura" className="text-right">
                      Zona
                    </Label>
                    <Select
                      value={formData.zonaCobertura}
                      onValueChange={(value) => setFormData({ ...formData, zonaCobertura: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Seleccionar zona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Zona Norte">Zona Norte</SelectItem>
                        <SelectItem value="Zona Sur">Zona Sur</SelectItem>
                        <SelectItem value="Zona Este">Zona Este</SelectItem>
                        <SelectItem value="Zona Oeste">Zona Oeste</SelectItem>
                        <SelectItem value="Centro">Centro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="jerarquia" className="text-right">
                    Jerarquía
                  </Label>
                  <Input
                    id="jerarquia"
                    value={formData.jerarquia}
                    onChange={(e) => setFormData({ ...formData, jerarquia: e.target.value })}
                    className="col-span-3"
                    placeholder="ej. Supervisor, Senior, Junior"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingEmpleado ? "Actualizar" : "Agregar"} Empleado</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas de empleados */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{empleados.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {empleados.filter((e) => e.rol === "Administrador").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Repartidores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {empleados.filter((e) => e.rol === "Repartidor").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {empleados.filter((e) => e.estado === "Activo").length}
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
                  placeholder="Buscar empleados..."
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

      {/* Tabla de empleados */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Empleados</CardTitle>
          <CardDescription>Información del personal de Mercado Virtual</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Jerarquía/Zona</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmpleados.map((empleado) => (
                <TableRow key={empleado.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 ${getRolColor(empleado.rol)} rounded-full flex items-center justify-center`}
                      >
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{empleado.nombre}</p>
                        <p className="text-sm text-muted-foreground">
                          Desde: {new Date(empleado.fechaIngreso).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{empleado.rol}</Badge>
                  </TableCell>
                  <TableCell>{empleado.departamento}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{empleado.jerarquia}</p>
                      {empleado.zonaCobertura && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{empleado.zonaCobertura}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{empleado.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{empleado.telefono}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getEstadoBadgeVariant(empleado.estado)}>{empleado.estado}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(empleado)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(empleado.id)}>
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
