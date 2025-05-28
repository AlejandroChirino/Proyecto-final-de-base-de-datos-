import type {
  Producto,
  Proveedor,
  Cliente,
  Pedido,
  Producto_has_Pedido,
  Inventario,
  Empleado,
  Gestores,
  Repartidores,
  Zonas_Cobertura_Repartidores,
  Empleado_has_Empleado,
  Pedido_has_Empleado,
  Informe_Venta,
} from "@/types/database"

// Datos de ejemplo siguiendo el esquema ER

export const productos: Producto[] = [
  {
    codigo: 1001,
    nombre_prod: "Laptop HP Pavilion",
    precio: 899.99,
    cant_stock: 5,
  },
  {
    codigo: 1002,
    nombre_prod: "Mouse Logitech MX",
    precio: 79.99,
    cant_stock: 25,
  },
  {
    codigo: 1003,
    nombre_prod: "Teclado Mecánico",
    precio: 129.99,
    cant_stock: 0,
  },
  {
    codigo: 1004,
    nombre_prod: "Monitor 4K Samsung",
    precio: 299.99,
    cant_stock: 12,
  },
]

export const proveedores: Proveedor[] = [
  {
    id_prov: "PROV001",
    Producto_codigo: 1001,
    nombre_prov: "TechSupply Corp",
    email: "ventas@techsupply.com",
  },
  {
    id_prov: "PROV002",
    Producto_codigo: 1002,
    nombre_prov: "Office Solutions",
    email: "ventas@officesolutions.com",
  },
  {
    id_prov: "PROV003",
    Producto_codigo: 1004,
    nombre_prov: "Global Imports",
    email: "info@globalimports.com",
  },
]

export const clientes: Cliente[] = [
  {
    id_cliente: 1,
    nombre_cliente: "María García",
    "direccion-num_casa": 123,
    "direccion-calle": "Av. Principal",
    "direccion-municipio": "Centro",
    "direccion-provincia": "Ciudad Capital",
    telefono: 12345678901,
    email_cliente: "maria.garcia@email.com",
  },
  {
    id_cliente: 2,
    nombre_cliente: "Juan Pérez",
    "direccion-num_casa": 456,
    "direccion-calle": "Calle Secundaria",
    "direccion-municipio": "Norte",
    "direccion-provincia": "Ciudad Capital",
    telefono: 12345678902,
    email_cliente: "juan.perez@email.com",
  },
  {
    id_cliente: 3,
    nombre_cliente: "Ana López",
    "direccion-num_casa": 789,
    "direccion-calle": "Plaza Central",
    "direccion-municipio": "Sur",
    "direccion-provincia": "Ciudad Capital",
    telefono: 12345678903,
    email_cliente: "ana.lopez@email.com",
  },
]

export const empleados: Empleado[] = [
  {
    carnet_empleado: 2001,
    nombre_emp: "Carlos Rodríguez",
  },
  {
    carnet_empleado: 2002,
    nombre_emp: "Laura Martínez",
  },
  {
    carnet_empleado: 2003,
    nombre_emp: "Miguel Torres",
  },
  {
    carnet_empleado: 2004,
    nombre_emp: "Ana Fernández",
  },
  {
    carnet_empleado: 2005,
    nombre_emp: "Roberto Silva",
  },
]

export const gestores: Gestores[] = [
  {
    Empleado_carnet_empleado: 2001,
    jerarquía: "Director General",
    area_gestion: "Administración",
  },
  {
    Empleado_carnet_empleado: 2002,
    jerarquía: "Supervisor de Ventas",
    area_gestion: "Ventas",
  },
]

export const repartidores: Repartidores[] = [
  {
    Empleado_carnet_empleado: 2003,
    tipo_vehiculo: "Motocicleta",
  },
  {
    Empleado_carnet_empleado: 2004,
    tipo_vehiculo: "Bicicleta",
  },
]

export const zonas_cobertura_repartidores: Zonas_Cobertura_Repartidores[] = [
  {
    Empleado_carnet_empleado: 2003,
    zonas_cobertura: "Zona Norte",
  },
  {
    Empleado_carnet_empleado: 2004,
    zonas_cobertura: "Zona Sur",
  },
]

export const empleado_has_empleado: Empleado_has_Empleado[] = [
  {
    Empleado_carnet_empleado: 2001, // Carlos es supervisor
    Empleado_id_empleado: 2002, // de Laura
  },
  {
    Empleado_carnet_empleado: 2002, // Laura es supervisora
    Empleado_id_empleado: 2005, // de Roberto
  },
]

export const pedidos: Pedido[] = [
  {
    id_pedido: 1234,
    fecha: "2024-01-15",
    total_prod: 3,
    Cliente_id_cliente: 1,
  },
  {
    id_pedido: 1235,
    fecha: "2024-01-15",
    total_prod: 2,
    Cliente_id_cliente: 2,
  },
  {
    id_pedido: 1236,
    fecha: "2024-01-14",
    total_prod: 1,
    Cliente_id_cliente: 3,
  },
]

export const producto_has_pedido: Producto_has_Pedido[] = [
  {
    Producto_codigo: 1001,
    Pedido_id_pedido: 1234,
    importe_total: 1799, // 2 laptops
  },
  {
    Producto_codigo: 1002,
    Pedido_id_pedido: 1234,
    importe_total: 79, // 1 mouse
  },
  {
    Producto_codigo: 1002,
    Pedido_id_pedido: 1235,
    importe_total: 159, // 2 mouse
  },
  {
    Producto_codigo: 1004,
    Pedido_id_pedido: 1235,
    importe_total: 299, // 1 monitor
  },
]

export const pedido_has_empleado: Pedido_has_Empleado[] = [
  {
    Empleado_carnet_empleado: 2002,
    Pedido_id_pedido: 1234,
  },
  {
    Empleado_carnet_empleado: 2005,
    Pedido_id_pedido: 1235,
  },
  {
    Empleado_carnet_empleado: 2003,
    Pedido_id_pedido: 1236,
  },
]

export const inventarios: Inventario[] = [
  {
    id_inventario: 1,
    producto_codigo: 1001,
    id_pedido: 1234,
    fecha_actualización: "2024-01-15",
    estado: "Stock Bajo",
  },
  {
    id_inventario: 2,
    producto_codigo: 1002,
    id_pedido: 1235,
    fecha_actualización: "2024-01-15",
    estado: "En Stock",
  },
  {
    id_inventario: 3,
    producto_codigo: 1003,
    id_pedido: 0,
    fecha_actualización: "2024-01-10",
    estado: "Agotado",
  },
]

export const informes_venta: Informe_Venta[] = [
  {
    id_informe: 1,
    id_cliente: 1,
    id_pedido: 1234,
    carnet_empleado: 2002,
    fecha_generacion: "2024-01-15",
    periodo_tiempo: 30,
  },
  {
    id_informe: 2,
    id_cliente: 2,
    id_pedido: 1235,
    carnet_empleado: 2005,
    fecha_generacion: "2024-01-15",
    periodo_tiempo: 30,
  },
]
