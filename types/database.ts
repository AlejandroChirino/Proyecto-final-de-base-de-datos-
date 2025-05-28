// Definición del esquema de base de datos según el modelo ER

export interface Producto {
  codigo: number // PK
  nombre_prod: string
  precio: number
  cant_stock: number
}

export interface Proveedor {
  id_prov: string // PK
  Producto_codigo: number // FK → Producto.codigo
  nombre_prov: string
  email: string
}

export interface Cliente {
  id_cliente: number // PK
  nombre_cliente: string
  "direccion-num_casa": number
  "direccion-calle": string
  "direccion-municipio": string
  "direccion-provincia": string
  telefono: number
  email_cliente: string
}

export interface Pedido {
  id_pedido: number // PK
  fecha: string // DATE
  total_prod: number
  Cliente_id_cliente: number // FK → Cliente.id_cliente
}

export interface Producto_has_Pedido {
  Producto_codigo: number // FK → Producto.codigo
  Pedido_id_pedido: number // FK → Pedido.id_pedido
  importe_total: number
}

export interface Inventario {
  id_inventario: number // PK
  producto_codigo: number // FK → Producto.codigo
  id_pedido: number // FK → Pedido.id_pedido
  fecha_actualización: string // DATE
  estado: string
}

export interface Empleado {
  carnet_empleado: number // PK
  nombre_emp: string
}

export interface Empleado_has_Empleado {
  Empleado_carnet_empleado: number // FK → Empleado.carnet_empleado
  Empleado_id_empleado: number // FK → Empleado.carnet_empleado
}

export interface Pedido_has_Empleado {
  Empleado_carnet_empleado: number // FK
  Pedido_id_pedido: number // FK
}

export interface Gestores {
  Empleado_carnet_empleado: number // FK → Empleado.carnet_empleado
  jerarquía: string
  area_gestion: string
}

export interface Repartidores {
  Empleado_carnet_empleado: number // FK → Empleado.carnet_empleado
  tipo_vehiculo: string
}

export interface Zonas_Cobertura_Repartidores {
  Empleado_carnet_empleado: number // FK → Empleado.carnet_empleado
  zonas_cobertura: string
}

export interface Informe_Venta {
  id_informe: number // PK
  id_cliente: number // FK → Cliente.id_cliente
  id_pedido: number // FK → Pedido.id_pedido
  carnet_empleado: number // FK → Empleado.carnet_empleado
  fecha_generacion: string // DATE
  periodo_tiempo: number
}

// Tipos extendidos para vistas con joins
export interface ProductoConProveedor extends Producto {
  proveedor?: Proveedor
}

export interface PedidoCompleto extends Pedido {
  cliente?: Cliente
  productos?: Producto_has_Pedido[]
  empleados?: Empleado[]
}

export interface EmpleadoCompleto extends Empleado {
  gestor?: Gestores
  repartidor?: Repartidores
  zonas_cobertura?: Zonas_Cobertura_Repartidores[]
  subordinados?: Empleado[]
  supervisor?: Empleado
}
