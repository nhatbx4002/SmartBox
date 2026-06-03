import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout'
import {
  LoginPage,
  DashboardPage,
  CabinetListPage,
  CabinetDetailPage,
  RentalsPage,
  RentalDetailPage,
  LocationsPage,
  NotificationsPage,
  AuditLogsPage,
  ProfilesPage,
} from '@/pages'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/cabinets" element={<CabinetListPage />} />
        <Route path="/cabinets/:id" element={<CabinetDetailPage />} />
        <Route path="/profiles" element={<ProfilesPage />} />
        <Route path="/profiles/:id" element={<ProfilesPage />} />
        <Route path="/rentals" element={<RentalsPage />} />
        <Route path="/rentals/:id" element={<RentalDetailPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/audit-logs" element={<AuditLogsPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
