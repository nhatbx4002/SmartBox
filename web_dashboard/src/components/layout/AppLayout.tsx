import { useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore, useUIStore } from '@/store'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { cn } from '@/lib/utils'
import { connectSocket, disconnectSocket } from '@/lib/socket'

type CabinetStatusEvent = {
  cabinetId?: string
}

type CompartmentStatusEvent = {
  cabinetId?: string
}

export function AppLayout() {
  const { isAuthenticated, token } = useAuthStore()
  const { sidebarCollapsed } = useUIStore()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isAuthenticated || !token) return

    const socket = connectSocket(token)
    const invalidateCabinetQueries = (cabinetId?: string) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['cabinets'] })
      if (cabinetId) {
        queryClient.invalidateQueries({ queryKey: ['cabinet', cabinetId] })
      }
    }
    const handleCabinetStatus = (event: CabinetStatusEvent) => {
      invalidateCabinetQueries(event.cabinetId)
    }
    const handleCompartmentStatus = (event: CompartmentStatusEvent) => {
      invalidateCabinetQueries(event.cabinetId)
    }

    socket.on('cabinet:status', handleCabinetStatus)
    socket.on('compartment:status', handleCompartmentStatus)

    return () => {
      socket.off('cabinet:status', handleCabinetStatus)
      socket.off('compartment:status', handleCompartmentStatus)
      disconnectSocket()
    }
  }, [isAuthenticated, queryClient, token])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn(
        'transition-all duration-300',
        'lg:ml-16',
        !sidebarCollapsed && 'lg:ml-60',
      )}>
        <Header />
        <main className="p-4 lg:p-6 max-w-[1400px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
