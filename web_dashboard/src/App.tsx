import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout, RequireRole } from '@/components/layout'
import {
  LoginPage,
  DashboardPage,
  CabinetListPage,
  CabinetDetailPage,
  PairingQueuePage,
  RentalsPage,
  RentalDetailPage,
  LocationsPage,
  NotificationsPage,
  AuditLogsPage,
  AdminsPage,
  PricePlansPage,
} from '@/pages'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/pairing" element={<PairingQueuePage />} />
        <Route path="/cabinets" element={<CabinetListPage />} />
        <Route path="/cabinets/:id" element={<CabinetDetailPage />} />
        <Route path="/rentals" element={<RentalsPage />} />
        <Route path="/rentals/:id" element={<RentalDetailPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route element={<RequireRole roles={['SUPER_ADMIN']} />}>
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/audit-logs" element={<AuditLogsPage />} />
          <Route path="/admins" element={<AdminsPage />} />
          <Route path="/price-plans" element={<PricePlansPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
