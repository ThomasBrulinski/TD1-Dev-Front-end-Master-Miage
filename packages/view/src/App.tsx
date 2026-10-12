import { Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { Toaster } from "@/components/ui/toast"

export function App() {
  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
        <Toaster />
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}
