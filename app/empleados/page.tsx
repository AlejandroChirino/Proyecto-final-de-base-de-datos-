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
import { Plus, Search, Filter, User, Edit, Trash2, MapPin, Car } from "lucide-react"
import type { Empleado, Gestores, Repartidores, Zonas_Cobertura_Repartidores, EmpleadoCompleto } from "@/types/database"
import {
  empleados as empleadosIniciales,
  gestores as gestoresIniciales,
  repartidores as repartidoresIniciales,
  zonas_cobertura_repartidores as zonasIniciales,
} from "@/data/mockData"

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>(empleadosIniciales)
  const [gestores, setGestores] = useState<Gestores[]>(gestoresIniciales)
  const [repartidores, setRepartidores] = useState<Repartidores[]>(repartidoresIniciales)
  const [zonasCobertura, setZonasCobertura] = useState<Zonas_Cobertura_Repartidores[]>(zonasIniciales)

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmpleado, setEditingEmpleado] = useState<EmpleadoCompleto | null>(null)
  const [formData, setFormData] = useState({
    carnet_empleado: "",
    nombre_emp: "",
    tipo_empleado: "",
    jerarquía: "",
    area_gestion: "",
    tipo_vehiculo: "",
    zonas_cobertura: "",
  })

  // Combinar datos para vista completa
  const empleadosCompletos: EmpleadoCompleto[] = empleados.map((emp) => {
    const gestor = gestores.find((g) => g.Empleado_carnet_empleado === emp.carnet_empleado)
    const repartidor = repartidores.find((r) => r.Empleado_carnet_empleado === emp.carnet_empleado)
    const zonas = zonasCobertura.filter((z) => z.Empleado_carnet_empleado === emp.carnet_empleado)

    return {
      ...emp,
      gestor,
      repartidor,
      zonas_cobertura: zonas,
    }
  })

  const filteredEmpleados = empleadosCompletos.filter(
    (empleado) =>
      empleado.nombre_emp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empleado.carnet_empleado.toString().includes(searchTerm),
  )

  const getTipoEmpleado = (empleado: EmpleadoCompleto): string => {
    if (empleado.gestor) return "Gestor"
    if (empleado.repartidor) return "Repartidor"
    return "Empleado"
  }

  const getRolColor = (tipo: string) => {
    switch (tipo) {
      case "Gestor":
        return "bg-blue-600"
      case "Repartidor":
        return "bg-orange-600"
      default:
        return "bg-gray-600"
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const nuevoEmpleado: Empleado = {
      carnet_empleado: editingEmpleado?.carnet_empleado || Number.parseInt(formData.carnet_empleado),
      nombre_emp: formData.nombre_emp,
    }

    if (editingEmpleado) {
      setEmpleados(empleados.map((e) => (e.carnet_empleado === editingEmpleado.carnet_empleado ? nuevoEmpleado : e)))
    } else {
      setEmpleados([...empleados, nuevoEmpleado])
    }

    // Manejar datos específicos según tipo de empleado
    const carnet = nuevoEmpleado.carnet_empleado

    if (formData.tipo_empleado === "Gestor") {
      const nuevoGestor: Gestores = {
        Empleado_carnet_empleado: carnet,
        jerarquía: formData.jerarquía,
        area_gestion: formData.area_gestion,
      }

      if (editingEmpleado?.gestor) {
        setGestores(gestores.map((g) => (g.Empleado_carnet_empleado === carnet ? nuevoGestor : g)))
      } else {
        setGestores([...gestores, nuevoGestor])
      }

      // Remover de repartidores si existía
      setRepartidores(repartidores.filter((r) => r.Empleado_carnet_empleado !== carnet))
      setZonasCobertura(zonasCobertura.filter((z) => z.Empleado_carnet_empleado !== carnet))
    } else if (formData.tipo_empleado === "Repartidor") {
      const nuevoRepartidor: Repartidores = {
        Empleado_carnet_empleado: carnet,
        tipo_vehiculo: formData.tipo_vehiculo,
      }

      if (editingEmpleado?.repartidor) {
        setRepartidores(repartidores.map((r) => (r.Empleado_carnet_empleado === carnet ? nuevoRepartidor : r)))
      } else {
        setRepartidores([...repartidores, nuevoRepartidor])
      }

      // Manejar zonas de cobertura
      if (formData.zonas_cobertura) {
        const nuevaZona: Zonas_Cobertura_Repartidores = {
          Empleado_carnet_empleado: carnet,
          zonas_cobertura: formData.zonas_cobertura,
        }

        setZonasCobertura([...zonasCobertura.filter((z) => z.Empleado_carnet_empleado !== carnet), nuevaZona])
      }

      // Remover de gestores si existía
      setGestores(gestores.filter((g) => g.Empleado_carnet_empleado !== carnet))
    }

    setFormData({
      carnet_empleado: "",
      nombre_emp: "",
      tipo_empleado: "",
      jerarquía: "",
      area_gestion: "",
      tipo_vehiculo: "",
      zonas_cobertura: "",
    })
    setEditingEmpleado(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (empleado: EmpleadoCompleto) => {
    setEditingEmpleado(empleado)
    setFormData({
      carnet_empleado: empleado.carnet_empleado.toString(),
      nombre_emp: empleado.nombre_emp,
      tipo_empleado: getTipoEmpleado(empleado),
      jerarquía: empleado.gestor?.jerarquía || "",
      area_gestion: empleado.gestor?.area_gestion || "",
      tipo_vehiculo: empleado.repartidor?.tipo_vehiculo || "",
      zonas_cobertura: empleado.zonas_cobertura?.[0]?.zonas_cobertura || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (carnet_empleado: number) => {
    setEmpleados(empleados.filter((e) => e.carnet_empleado !== carnet_empleado))
    setGestores(gestores.filter((g) => g.Empleado_carnet_empleado !== carnet_empleado))
    setRepartidores(repartidores.filter((r) => r.Empleado_carnet_empleado !== carnet_empleado))
    setZonasCobertura(zonasCobertura.filter((z) => z.Empleado_carnet_empleado !== carnet_empleado))
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
                  carnet_empleado: "",
                  nombre_emp: "",
                  tipo_empleado: "",
                  jerarquía: "",
                  area_gestion: "",
                  tipo_vehiculo: "",
                  zonas_cobertura: "",
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
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
                  <Label htmlFor="carnet_empleado" className="text-right">
                    Carnet
                  </Label>
                  <Input
                    id="carnet_empleado"
                    type="number"
                    value={formData.carnet_empleado}
                    onChange={(e) => setFormData({ ...formData, carnet_empleado: e.target.value })}
                    className="col-span-3"
                    disabled={!!editingEmpleado}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombre_emp" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="nombre_emp"
                    value={formData.nombre_emp}
                    onChange={(e) => setFormData({ ...formData, nombre_emp: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tipo_empleado" className="text-right">
                    Tipo
                  </Label>
                  <Select
                    value={formData.tipo_empleado}
                    onValueChange={(value) => setFormData({ ...formData, tipo_empleado: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Empleado">Empleado</SelectItem>
                      <SelectItem value="Gestor">Gestor</SelectItem>
                      <SelectItem value="Repartidor">Repartidor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.tipo_empleado === "Gestor" && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="jerarquía" className="text-right">
                        Jerarquía
                      </Label>
                      <Input
                        id="jerarquía"
                        value={formData.jerarquía}
                        onChange={(e) => setFormData({ ...formData, jerarquía: e.target.value })}
                        className="col-span-3"
                        placeholder="ej. Supervisor, Director"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="area_gestion" className="text-right">
                        Área Gestión
                      </Label>
                      <Select
                        value={formData.area_gestion}
                        onValueChange={(value) => setFormData({ ...formData, area_gestion: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Seleccionar área" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Administración">Administración</SelectItem>
                          <SelectItem value="Ventas">Ventas</SelectItem>
                          <SelectItem value="Logística">Logística</SelectItem>
                          <SelectItem value="Almacén">Almacén</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {formData.tipo_empleado === "Repartidor" && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tipo_vehiculo" className="text-right">
                        Vehículo
                      </Label>
                      <Select
                        value={formData.tipo_vehiculo}
                        onValueChange={(value) => setFormData({ ...formData, tipo_vehiculo: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Seleccionar vehículo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Motocicleta">Motocicleta</SelectItem>
                          <SelectItem value="Bicicleta">Bicicleta</SelectItem>
                          <SelectItem value="Automóvil">Automóvil</SelectItem>
                          <SelectItem value="Camión">Camión</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="zonas_cobertura" className="text-right">
                        Zona Cobertura
                      </Label>
                      <Select
                        value={formData.zonas_cobertura}
                        onValueChange={(value) => setFormData({ ...formData, zonas_cobertura: value })}
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
                  </>
                )}
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
            <CardTitle className="text-sm font-medium">Gestores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{gestores.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Repartidores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{repartidores.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Zonas Cubiertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Set(zonasCobertura.map((z) => z.zonas_cobertura)).size}
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
                  placeholder="Buscar empleados por nombre o carnet..."
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
                <TableHead>Carnet</TableHead>
                <TableHead>Nombre Empleado</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Jerarquía/Área</TableHead>
                <TableHead>Zona/Vehículo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmpleados.map((empleado) => (
                <TableRow key={empleado.carnet_empleado}>
                  <TableCell className="font-medium">{empleado.carnet_empleado}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 ${getRolColor(getTipoEmpleado(empleado))} rounded-full flex items-center justify-center`}
                      >
                        <User className="h-4 w-4 text-white" />
                      </div>
                      {empleado.nombre_emp}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getTipoEmpleado(empleado)}</Badge>
                  </TableCell>
                  <TableCell>
                    {empleado.gestor && (
                      <div>
                        <p className="font-medium">{empleado.gestor.jerarquía}</p>
                        <p className="text-sm text-muted-foreground">{empleado.gestor.area_gestion}</p>
                      </div>
                    )}
                    {!empleado.gestor && !empleado.repartidor && <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell>
                    {empleado.repartidor && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Car className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{empleado.repartidor.tipo_vehiculo}</span>
                        </div>
                        {empleado.zonas_cobertura?.map((zona, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{zona.zonas_cobertura}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {!empleado.repartidor && <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(empleado)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(empleado.carnet_empleado)}>
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
