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
import { Plus, Search, Filter, Mail, Phone, Edit, Trash2, MapPin } from "lucide-react"
import type { Cliente } from "@/types/database"
import { clientes as clientesIniciales } from "@/data/mockData"

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [formData, setFormData] = useState({
    id_cliente: "",
    nombre_cliente: "",
    "direccion-num_casa": "",
    "direccion-calle": "",
    "direccion-municipio": "",
    "direccion-provincia": "",
    telefono: "",
    email_cliente: "",
  })

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email_cliente.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const nuevoCliente: Cliente = {
      id_cliente: editingCliente?.id_cliente || Number.parseInt(formData.id_cliente),
      nombre_cliente: formData.nombre_cliente,
      "direccion-num_casa": Number.parseInt(formData["direccion-num_casa"]),
      "direccion-calle": formData["direccion-calle"],
      "direccion-municipio": formData["direccion-municipio"],
      "direccion-provincia": formData["direccion-provincia"],
      telefono: Number.parseInt(formData.telefono),
      email_cliente: formData.email_cliente,
    }

    if (editingCliente) {
      setClientes(clientes.map((c) => (c.id_cliente === editingCliente.id_cliente ? nuevoCliente : c)))
    } else {
      setClientes([...clientes, nuevoCliente])
    }

    setFormData({
      id_cliente: "",
      nombre_cliente: "",
      "direccion-num_casa": "",
      "direccion-calle": "",
      "direccion-municipio": "",
      "direccion-provincia": "",
      telefono: "",
      email_cliente: "",
    })
    setEditingCliente(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setFormData({
      id_cliente: cliente.id_cliente.toString(),
      nombre_cliente: cliente.nombre_cliente,
      "direccion-num_casa": cliente["direccion-num_casa"].toString(),
      "direccion-calle": cliente["direccion-calle"],
      "direccion-municipio": cliente["direccion-municipio"],
      "direccion-provincia": cliente["direccion-provincia"],
      telefono: cliente.telefono.toString(),
      email_cliente: cliente.email_cliente,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id_cliente: number) => {
    setClientes(clientes.filter((c) => c.id_cliente !== id_cliente))
  }

  const getDireccionCompleta = (cliente: Cliente) => {
    return `${cliente["direccion-calle"]} #${cliente["direccion-num_casa"]}, ${cliente["direccion-municipio"]}, ${cliente["direccion-provincia"]}`
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
                setFormData({
                  id_cliente: "",
                  nombre_cliente: "",
                  "direccion-num_casa": "",
                  "direccion-calle": "",
                  "direccion-municipio": "",
                  "direccion-provincia": "",
                  telefono: "",
                  email_cliente: "",
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingCliente ? "Editar Cliente" : "Agregar Nuevo Cliente"}</DialogTitle>
              <DialogDescription>
                {editingCliente ? "Modifica la información del cliente." : "Completa la información del nuevo cliente."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="id_cliente" className="text-right">
                    ID Cliente
                  </Label>
                  <Input
                    id="id_cliente"
                    type="number"
                    value={formData.id_cliente}
                    onChange={(e) => setFormData({ ...formData, id_cliente: e.target.value })}
                    className="col-span-3"
                    disabled={!!editingCliente}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombre_cliente" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="nombre_cliente"
                    value={formData.nombre_cliente}
                    onChange={(e) => setFormData({ ...formData, nombre_cliente: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="direccion-calle" className="text-right">
                    Calle
                  </Label>
                  <Input
                    id="direccion-calle"
                    value={formData["direccion-calle"]}
                    onChange={(e) => setFormData({ ...formData, "direccion-calle": e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="direccion-num_casa" className="text-right">
                    Número
                  </Label>
                  <Input
                    id="direccion-num_casa"
                    type="number"
                    value={formData["direccion-num_casa"]}
                    onChange={(e) => setFormData({ ...formData, "direccion-num_casa": e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="direccion-municipio" className="text-right">
                    Municipio
                  </Label>
                  <Input
                    id="direccion-municipio"
                    value={formData["direccion-municipio"]}
                    onChange={(e) => setFormData({ ...formData, "direccion-municipio": e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="direccion-provincia" className="text-right">
                    Provincia
                  </Label>
                  <Input
                    id="direccion-provincia"
                    value={formData["direccion-provincia"]}
                    onChange={(e) => setFormData({ ...formData, "direccion-provincia": e.target.value })}
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
                    type="number"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email_cliente" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email_cliente"
                    type="email"
                    value={formData.email_cliente}
                    onChange={(e) => setFormData({ ...formData, email_cliente: e.target.value })}
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
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Provincias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Set(clientes.map((c) => c["direccion-provincia"])).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Municipios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Set(clientes.map((c) => c["direccion-municipio"])).size}
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
                  placeholder="Buscar clientes por nombre o email..."
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
                <TableHead>ID</TableHead>
                <TableHead>Nombre Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id_cliente}>
                  <TableCell className="font-medium">{cliente.id_cliente}</TableCell>
                  <TableCell>{cliente.nombre_cliente}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{cliente.email_cliente}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{cliente.telefono}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">{getDireccionCompleta(cliente)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(cliente)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(cliente.id_cliente)}>
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
