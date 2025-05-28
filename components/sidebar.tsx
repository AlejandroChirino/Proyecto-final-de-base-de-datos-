"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Package, ShoppingCart, Users, UserCheck, Truck, BarChart3, Store } from "lucide-react"

const navigation = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Inventario", href: "/inventario", icon: Package },
  { name: "Pedidos", href: "/pedidos", icon: ShoppingCart },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Empleados", href: "/empleados", icon: UserCheck },
  { name: "Proveedores", href: "/proveedores", icon: Truck },
  { name: "Informes", href: "/informes", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
        <div className="flex items-center space-x-2">
          <Store className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white">Mercado Virtual</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn("w-full justify-start", isActive && "bg-blue-600 text-white hover:bg-blue-700")}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <p className="text-xs text-gray-500 text-center">© 2024 Mercado Virtual</p>
      </div>
    </div>
  )
}
