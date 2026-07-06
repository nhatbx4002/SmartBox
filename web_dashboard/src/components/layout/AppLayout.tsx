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
    <div className="min-h-[100dvh] bg-background">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-200 ease-spring',
          'lg:ml-16',
          !sidebarCollapsed && 'lg:ml-56',
        )}
      >
        <Header />
        <main className="px-3 pb-4 lg:px-4 lg:pb-4">
          <div className="mx-auto pt-2 lg:pt-3">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
