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
import type { Producto, Pedido, Producto_has_Pedido } from "@/types/database"
import { clientes, productos } from "@/data/mockData"

interface ItemPedido {
  producto: Producto
  cantidad: number
  importe_total: number
}

export default function NuevoPedidoPage() {
  const [clienteSeleccionado, setClienteSeleccionado] = useState("")
  const [productoSeleccionado, setProductoSeleccionado] = useState("")
  const [cantidad, setCantidad] = useState(1)
  const [items, setItems] = useState<ItemPedido[]>([])

  const agregarItem = () => {
    const producto = productos.find((p) => p.codigo.toString() === productoSeleccionado)
    if (!producto || cantidad <= 0 || cantidad > producto.cant_stock) return

    const itemExistente = items.find((item) => item.producto.codigo === producto.codigo)

    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + cantidad
      if (nuevaCantidad <= producto.cant_stock) {
        setItems(
          items.map((item) =>
            item.producto.codigo === producto.codigo
              ? { ...item, cantidad: nuevaCantidad, importe_total: nuevaCantidad * producto.precio }
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
          importe_total: cantidad * producto.precio,
        },
      ])
    }

    setProductoSeleccionado("")
    setCantidad(1)
  }

  const actualizarCantidad = (productoCodigo: number, nuevaCantidad: number) => {
    const producto = productos.find((p) => p.codigo === productoCodigo)
    if (!producto || nuevaCantidad <= 0 || nuevaCantidad > producto.cant_stock) return

    setItems(
      items.map((item) =>
        item.producto.codigo === productoCodigo
          ? { ...item, cantidad: nuevaCantidad, importe_total: nuevaCantidad * producto.precio }
          : item,
      ),
    )
  }

  const eliminarItem = (productoCodigo: number) => {
    setItems(items.filter((item) => item.producto.codigo !== productoCodigo))
  }

  const totalProductos = items.reduce((sum, item) => sum + item.cantidad, 0)
  const totalImporte = items.reduce((sum, item) => sum + item.importe_total, 0)

  const procesarPedido = () => {
    if (!clienteSeleccionado || items.length === 0) return

    const cliente = clientes.find((c) => c.id_cliente.toString() === clienteSeleccionado)

    // Crear el pedido según el esquema ER
    const nuevoPedido: Pedido = {
      id_pedido: Date.now(), // En producción sería generado por la BD
      fecha: new Date().toISOString().split("T")[0],
      total_prod: totalProductos,
      Cliente_id_cliente: Number.parseInt(clienteSeleccionado),
    }

    // Crear las relaciones Producto_has_Pedido
    const productosDelPedido: Producto_has_Pedido[] = items.map((item) => ({
      Producto_codigo: item.producto.codigo,
      Pedido_id_pedido: nuevoPedido.id_pedido,
      importe_total: Math.round(item.importe_total), // Convertir a INTEGER según esquema
    }))

    alert(
      `Pedido creado exitosamente!\n` +
        `ID Pedido: ${nuevoPedido.id_pedido}\n` +
        `Cliente: ${cliente?.nombre_cliente}\n` +
        `Total Productos: ${totalProductos}\n` +
        `Importe Total: $${totalImporte.toFixed(2)}`,
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
                    <SelectItem key={cliente.id_cliente} value={cliente.id_cliente.toString()}>
                      {cliente.id_cliente} - {cliente.nombre_cliente} ({cliente.email_cliente})
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
                    <SelectItem key={producto.codigo} value={producto.codigo.toString()}>
                      {producto.codigo} - {producto.nombre_prod} - ${producto.precio.toFixed(2)} (Stock:{" "}
                      {producto.cant_stock})
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
                  <TableHead>Código</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Precio Unitario</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Importe Total</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.producto.codigo}>
                    <TableCell className="font-medium">{item.producto.codigo}</TableCell>
                    <TableCell>{item.producto.nombre_prod}</TableCell>
                    <TableCell>${item.producto.precio.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => actualizarCantidad(item.producto.codigo, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.cantidad}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => actualizarCantidad(item.producto.codigo, item.cantidad + 1)}
                          disabled={item.cantidad >= item.producto.cant_stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>${item.importe_total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => eliminarItem(item.producto.codigo)}>
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
                <span>Total Productos:</span>
                <span>{totalProductos} unidades</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Subtotal:</span>
                <span>${totalImporte.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>IVA (16%):</span>
                <span>${(totalImporte * 0.16).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-2">
                <span>Total Final:</span>
                <span>${(totalImporte * 1.16).toFixed(2)}</span>
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
