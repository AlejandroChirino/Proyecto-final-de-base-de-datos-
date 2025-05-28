"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Cliente {
  id: string
  nombre: string
  email: string
}

interface Producto {
  id: string
  nombre: string
  precio: number
  stock: number
}

interface ItemPedido {
  producto: Producto
  cantidad: number
  subtotal: number
}

export default function NuevoPedidoPage() {
  const [clientes] = useState<Cliente[]>([
    { id: "1", nombre: "María García", email: "maria.garcia@email.com" },
    { id: "2", nombre: "Juan Pérez", email: "juan.perez@email.com" },
    { id: "3", nombre: "Ana López", email: "ana.lopez@email.com" },
  ])

  const [productos] = useState<Producto[]>([
    { id: "1", nombre: "Laptop HP Pavilion", precio: 899.99, stock: 5 },
    { id: "2", nombre: "Mouse Logitech MX", precio: 79.99, stock: 25 },
    { id: "3", nombre: "Teclado Mecánico", precio: 129.99, stock: 15 },
    { id: "4", nombre: "Monitor 4K Samsung", precio: 299.99, stock: 12 },
  ])

  const [clienteSeleccionado, setClienteSeleccionado] = useState("")
  const [productoSeleccionado, setProductoSeleccionado] = useState("")
  const [cantidad, setCantidad] = useState(1)
  const [items, setItems] = useState<ItemPedido[]>([])

  const agregarItem = () => {
    const producto = productos.find((p) => p.id === productoSeleccionado)
    if (!producto || cantidad <= 0 || cantidad > producto.stock) return

    const itemExistente = items.find((item) => item.producto.id === producto.id)

    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + cantidad
      if (nuevaCantidad <= producto.stock) {
        setItems(
          items.map((item) =>
            item.producto.id === producto.id
              ? { ...item, cantidad: nuevaCantidad, subtotal: nuevaCantidad * producto.precio }
              : item,
          ),
        )
      }
    } else {
      setItems([
        ...items,
        {
          producto,
          cantidad,
          subtotal: cantidad * producto.precio,
        },
      ])
    }

    setProductoSeleccionado("")
    setCantidad(1)
  }

  const actualizarCantidad = (productoId: string, nuevaCantidad: number) => {
    const producto = productos.find((p) => p.id === productoId)
    if (!producto || nuevaCantidad <= 0 || nuevaCantidad > producto.stock) return

    setItems(
      items.map((item) =>
        item.producto.id === productoId
          ? { ...item, cantidad: nuevaCantidad, subtotal: nuevaCantidad * producto.precio }
          : item,
      ),
    )
  }

  const eliminarItem = (productoId: string) => {
    setItems(items.filter((item) => item.producto.id !== productoId))
  }

  const total = items.reduce((sum, item) => sum + item.subtotal, 0)

  const procesarPedido = () => {
    if (!clienteSeleccionado || items.length === 0) return

    // Aquí se procesaría el pedido
    alert(
      `Pedido creado exitosamente!\nCliente: ${clientes.find((c) => c.id === clienteSeleccionado)?.nombre}\nTotal: $${total.toFixed(2)}`,
    )

    // Limpiar formulario
    setClienteSeleccionado("")
    setItems([])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/pedidos">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Pedido</h1>
          <p className="text-muted-foreground">Crea un nuevo pedido para un cliente</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información del cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
            <CardDescription>Selecciona el cliente para este pedido</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <Select value={clienteSeleccionado} onValueChange={setClienteSeleccionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre} - {cliente.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Agregar productos */}
        <Card>
          <CardHeader>
            <CardTitle>Agregar Productos</CardTitle>
            <CardDescription>Selecciona productos y cantidades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="producto">Producto</Label>
              <Select value={productoSeleccionado} onValueChange={setProductoSeleccionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {productos.map((producto) => (
                    <SelectItem key={producto.id} value={producto.id}>
                      {producto.nombre} - ${producto.precio.toFixed(2)} (Stock: {producto.stock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(Number.parseInt(e.target.value) || 1)}
              />
            </div>
            <Button onClick={agregarItem} disabled={!productoSeleccionado} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Agregar al Pedido
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Lista de productos en el pedido */}
      <Card>
        <CardHeader>
          <CardTitle>Productos en el Pedido</CardTitle>
          <CardDescription>Revisa y modifica los productos seleccionados</CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No hay productos en el pedido</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Precio Unitario</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.producto.id}>
                    <TableCell className="font-medium">{item.producto.nombre}</TableCell>
                    <TableCell>${item.producto.precio.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.cantidad}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                          disabled={item.cantidad >= item.producto.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>${item.subtotal.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => eliminarItem(item.producto.id)}>
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Resumen del pedido */}
      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-lg">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>IVA (16%):</span>
                <span>${(total * 0.16).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-2">
                <span>Total:</span>
                <span>${(total * 1.16).toFixed(2)}</span>
              </div>
            </div>
            <Button
              onClick={procesarPedido}
              disabled={!clienteSeleccionado || items.length === 0}
              className="w-full mt-4"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Procesar Pedido
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
