import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, RefreshCw, Search, X, Wifi, WifiOff } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button, Modal, Input, Select, Badge, LocationMapPicker } from '@/components/ui'
import { locationsApi, pairingApi } from '@/lib/api'
import { useAuthStore } from '@/store'
import type { PairingSession, PairingSessionStatus } from '@/types'

const STATUS_LABELS: Record<PairingSessionStatus, string> = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  EXPIRED: 'Đã hết hạn',
  CANCELLED: 'Đã hủy',
}

const STATUS_COLORS: Record<PairingSessionStatus, string> = {
  PENDING: 'warning',
  APPROVED: 'success',
  EXPIRED: 'neutral',
  CANCELLED: 'error',
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Vừa xong'
  if (diffMin < 60) return `${diffMin} phút trước`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH} giờ trước`
  return `${Math.floor(diffH / 24)} ngày trước`
}

function formatExpiry(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  if (diffMs <= 0) return 'Đã hết hạn'
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 60) return `${diffMin} phút`
  return `${Math.floor(diffMin / 60)} giờ`
}

export default function PairingQueuePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = React.useState<PairingSessionStatus>('PENDING')
  const [searchCode, setSearchCode] = React.useState('')
  const [approveModal, setApproveModal] = React.useState<{ open: boolean; session: PairingSession | null }>({
    open: false,
    session: null,
  })
  const [approveForm, setApproveForm] = React.useState({ locationId: '', cabinetName: '' })
  const [searchByCodeResult, setSearchByCodeResult] = React.useState<PairingSession | null>(null)
  const [isCreatingLocation, setIsCreatingLocation] = React.useState(false)
  const [newLocationForm, setNewLocationForm] = React.useState({ name: '', address: '', lat: '', lng: '' })
  const admin = useAuthStore((s) => s.admin)

  // Fetch locations for approve modal
  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationsApi.list({ status: 'ACTIVE' }),
  })

  // Fetch all sessions
  const { data: sessions = [], isLoading, refetch } = useQuery({
    queryKey: ['pairing-sessions'],
    queryFn: pairingApi.list,
    refetchInterval: 5000, // poll every 5s
  })

  const filteredSessions = React.useMemo(() => {
    if (searchCode) {
      const found = sessions.find(
        (s) => s.pairingCode.toLowerCase() === searchCode.toLowerCase(),
      )
      return found ? [found] : []
    }
    return sessions.filter((s) => s.status === activeTab)
  }, [sessions, activeTab, searchCode])

  // Search by code
  const handleSearch = React.useCallback(async () => {
    if (!searchCode.trim()) {
      setSearchByCodeResult(null)
      return
    }
    try {
      const result = await pairingApi.getByCode(searchCode.trim())
      setSearchByCodeResult(result)
    } catch {
      setSearchByCodeResult(null)
      toast.error('Không tìm thấy mã ghép này')
    }
  }, [searchCode])

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: { locationId: string; cabinetName: string } }) =>
      pairingApi.approve(sessionId, data),
    onSuccess: async (result) => {
      toast.success('Đã duyệt ghép tủ thành công')
      queryClient.invalidateQueries({ queryKey: ['pairing-sessions'] })
      queryClient.invalidateQueries({ queryKey: ['cabinets'] })
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      setApproveModal({ open: false, session: null })
      setApproveForm({ locationId: '', cabinetName: '' })
      setIsCreatingLocation(false)
      setNewLocationForm({ name: '', address: '', lat: '', lng: '' })
      // Navigate to cabinet detail for configuration
      navigate(`/cabinets/${result.cabinetId}`)
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Không thể duyệt ghép tủ'
      toast.error(msg)
    },
  })

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: pairingApi.cancel,
    onSuccess: () => {
      toast.success('Đã hủy ghép tủ')
      queryClient.invalidateQueries({ queryKey: ['pairing-sessions'] })
    },
    onError: () => toast.error('Không thể hủy ghép tủ'),
  })

  // Open approve modal
  const openApprove = (session: PairingSession) => {
    setApproveForm({
      locationId: locations[0]?.id ?? '',
      cabinetName: `Tủ ${session.hardwareSerial.slice(-6)}`,
    })
    setIsCreatingLocation(false)
    setNewLocationForm({ name: '', address: '', lat: '', lng: '' })
    setApproveModal({ open: true, session })
  }

  const handleApprove = async () => {
    if (!approveModal.session) return
    if (!approveForm.cabinetName.trim()) {
      toast.error('Vui lòng nhập tên tủ')
      return
    }

    let locationId = approveForm.locationId

    if (isCreatingLocation) {
      if (!newLocationForm.name.trim() || !newLocationForm.address.trim()) {
        toast.error('Vui lòng nhập tên và địa chỉ địa điểm')
        return
      }
      try {
        const newLocation = await locationsApi.create({
          name: newLocationForm.name.trim(),
          address: newLocationForm.address.trim(),
          lat: newLocationForm.lat ? parseFloat(newLocationForm.lat) : undefined,
          lng: newLocationForm.lng ? parseFloat(newLocationForm.lng) : undefined,
          status: 'ACTIVE',
        })
        locationId = newLocation.id
      } catch {
        toast.error('Không thể tạo địa điểm mới')
        return
      }
    } else if (!locationId) {
      toast.error('Vui lòng chọn địa điểm')
      return
    }

    approveMutation.mutate({
      sessionId: approveModal.session.id,
      data: { locationId, cabinetName: approveForm.cabinetName.trim() },
    })
  }

  const tabs: { key: PairingSessionStatus; label: string }[] = [
    { key: 'PENDING', label: 'Chờ duyệt' },
    { key: 'APPROVED', label: 'Đã duyệt' },
    { key: 'EXPIRED', label: 'Đã hết hạn' },
    { key: 'CANCELLED', label: 'Đã hủy' },
  ]

  const locationOptions = locations.map((l) => ({ value: l.id, label: l.name }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Quản lý ghép tủ</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Xem và duyệt các yêu cầu ghép tủ mới từ Raspberry Pi
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Làm mới
        </Button>
      </div>

      {/* Search by code */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Tìm theo mã ghép (VD: A3F7K2)"
            value={searchCode}
            onChange={(e) => {
              setSearchCode(e.target.value)
              if (!e.target.value) setSearchByCodeResult(null)
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50"
          />
        </div>
        {searchCode && (
          <Button variant="ghost" size="sm" onClick={() => { setSearchCode(''); setSearchByCodeResult(null) }}>
            <X className="mr-1 h-4 w-4" /> Xóa
          </Button>
        )}
      </div>

      {/* Search result */}
      {searchByCodeResult && (
        <SearchResultCard
          session={searchByCodeResult}
          onApprove={openApprove}
          onCancel={(id) => cancelMutation.mutate(id)}
          isPending={cancelMutation.isPending}
        />
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.key
                ? 'border-brand text-brand'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.label}
            {tab.key !== 'PENDING' && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-zinc-800 text-zinc-400">
                {sessions.filter((s) => s.status === tab.key).length}
              </span>
            )}
            {tab.key === 'PENDING' && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-orange-500/20 text-orange-400">
                {sessions.filter((s) => s.status === tab.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Session list */}
      {isLoading ? (
        <div className="py-12 text-center text-zinc-500">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
          Đang tải...
        </div>
      ) : filteredSessions.length === 0 ? (
        <EmptyState tab={activeTab} hasSearch={!!searchCode} searchCode={searchCode} />
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onApprove={openApprove}
              onCancel={(id) => cancelMutation.mutate(id)}
              isPending={cancelMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Approve Modal */}
      <Modal
        open={approveModal.open}
        onOpenChange={(open) => {
          if (!open) {
            setApproveModal({ open: false, session: null })
            setApproveForm({ locationId: '', cabinetName: '' })
            setIsCreatingLocation(false)
            setNewLocationForm({ name: '', address: '', lat: '', lng: '' })
          }
        }}
        title="Duyệt ghép tủ"
        description="Xác nhận thông tin trước khi tạo tủ mới"
      >
        {approveModal.session && (
          <div className="space-y-4">
            {/* Session info */}
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Serial</span>
                <span className="font-mono text-zinc-200">{approveModal.session.hardwareSerial}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">MCP Devices</span>
                <div className="flex gap-1.5">
                  {approveModal.session.discoveredMcpDevices.map((mcp, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-zinc-800 text-xs font-mono text-zinc-300">
                      Bus {mcp.bus} @ 0x{mcp.address.toString(16).toUpperCase().padStart(2, '0')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-text-secondary">Địa điểm</label>
                  {admin?.role === 'SUPER_ADMIN' && (
                    <button
                      type="button"
                      onClick={() => { setIsCreatingLocation(!isCreatingLocation); setNewLocationForm({ name: '', address: '', lat: '', lng: '' }) }}
                      className="text-xs text-brand hover:text-brand-hover transition-colors cursor-pointer"
                    >
                      {isCreatingLocation ? '← Chọn địa điểm có sẵn' : '+ Tạo địa điểm mới'}
                    </button>
                  )}
                </div>
                {isCreatingLocation ? (
                  <div className="space-y-3">
                    <Input
                      value={newLocationForm.name}
                      onChange={(e) => setNewLocationForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Tên địa điểm"
                    />
                    <Input
                      value={newLocationForm.address}
                      onChange={(e) => setNewLocationForm((f) => ({ ...f, address: e.target.value }))}
                      placeholder="Địa chỉ"
                    />
                    <LocationMapPicker
                      lat={newLocationForm.lat ? parseFloat(newLocationForm.lat) : undefined}
                      lng={newLocationForm.lng ? parseFloat(newLocationForm.lng) : undefined}
                      onChange={(lat, lng, address) =>
                        setNewLocationForm((f) => ({ ...f, lat: lat.toFixed(6), lng: lng.toFixed(6), address: address ?? f.address }))
                      }
                    />
                  </div>
                ) : (
                  <Select
                    options={locationOptions}
                    value={approveForm.locationId}
                    onValueChange={(v) => setApproveForm((f) => ({ ...f, locationId: v }))}
                    placeholder="Chọn địa điểm"
                  />
                )}
              </div>
              <Input
                label="Tên tủ"
                value={approveForm.cabinetName}
                onChange={(e) => setApproveForm((f) => ({ ...f, cabinetName: e.target.value }))}
                placeholder="VD: Tủ A, Tủ B"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setApproveModal({ open: false, session: null })
                  setApproveForm({ locationId: '', cabinetName: '' })
                  setIsCreatingLocation(false)
                  setNewLocationForm({ name: '', address: '', lat: '', lng: '' })
                }}
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                onClick={handleApprove}
                loading={approveMutation.isPending}
              >
                <Check className="mr-2 h-4 w-4" />
                Duyệt ghép
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function SessionCard({
  session,
  onApprove,
  onCancel,
  isPending,
}: {
  session: PairingSession
  onApprove: (s: PairingSession) => void
  onCancel: (id: string) => void
  isPending: boolean
}) {
  const isExpired = new Date(session.expiresAt) < new Date()

  return (
    <div className="p-5 rounded-xl bg-surface border border-zinc-800 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Status dot */}
          <div className={`mt-1 shrink-0 w-3 h-3 rounded-full ${
            session.status === 'PENDING' ? (isExpired ? 'bg-zinc-500' : 'bg-orange-500 animate-pulse') :
            session.status === 'APPROVED' ? 'bg-green-500' :
            'bg-zinc-600'
          }`} />

          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-semibold text-zinc-100 tracking-wider">
                {session.pairingCode}
              </span>
              <Badge variant={STATUS_COLORS[session.status] as never}>
                {STATUS_LABELS[session.status]}
              </Badge>
              {session.status === 'PENDING' && isExpired && (
                <Badge variant="error">Hết hạn</Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <span className="font-mono">{session.hardwareSerial}</span>
              <span className="text-zinc-600">|</span>
              <span>{formatTimeAgo(session.createdAt)}</span>
              {session.status === 'PENDING' && (
                <>
                  <span className="text-zinc-600">|</span>
                  <span className={isExpired ? 'text-red-400' : 'text-zinc-400'}>
                    Hết hạn: {formatExpiry(session.expiresAt)}
                  </span>
                </>
              )}
            </div>

            {/* MCP devices */}
            <div className="flex items-center gap-2">
              {session.discoveredMcpDevices.length === 1 ? (
                <Wifi className="h-3.5 w-3.5 text-zinc-500" />
              ) : (
                <WifiOff className="h-3.5 w-3.5 text-zinc-500" />
              )}
              <span className="text-xs text-zinc-500">
                {session.discoveredMcpDevices.length} MCP23017
              </span>
              <div className="flex gap-1.5 ml-1">
                {session.discoveredMcpDevices.map((mcp, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-800 text-xs font-mono text-zinc-400">
                    0x{mcp.address.toString(16).toUpperCase().padStart(2, '0')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {session.status === 'PENDING' && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(session.id)}
              disabled={isPending}
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Hủy
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onApprove(session)}
              disabled={isExpired}
            >
              <Check className="mr-1 h-3.5 w-3.5" />
              Duyệt
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function SearchResultCard({
  session,
  onApprove,
  onCancel,
  isPending,
}: {
  session: PairingSession
  onApprove: (s: PairingSession) => void
  onCancel: (id: string) => void
  isPending: boolean
}) {
  return (
    <div className="rounded-xl bg-brand/5 border border-brand/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-brand">Kết quả tìm kiếm</span>
      </div>
      <SessionCard session={session} onApprove={onApprove} onCancel={onCancel} isPending={isPending} />
    </div>
  )
}

function EmptyState({ tab, hasSearch, searchCode }: { tab: PairingSessionStatus; hasSearch: boolean; searchCode: string }) {
  const messages: Record<PairingSessionStatus, { title: string; desc: string }> = {
    PENDING: {
      title: 'Không có yêu cầu nào',
      desc: 'Khi Raspberry Pi bắt đầu ghép, yêu cầu sẽ xuất hiện tại đây',
    },
    APPROVED: {
      title: 'Chưa có tủ nào được duyệt',
      desc: 'Các tủ đã duyệt sẽ xuất hiện tại đây',
    },
    EXPIRED: {
      title: 'Không có yêu cầu hết hạn',
      desc: 'Các yêu cầu hết hạn sau 10 phút sẽ xuất hiện tại đây',
    },
    CANCELLED: {
      title: 'Không có yêu cầu bị hủy',
      desc: 'Các yêu cầu bị hủy sẽ xuất hiện tại đây',
    },
  }

  if (hasSearch) {
    return (
      <div className="py-12 text-center">
        <Search className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
        <p className="text-zinc-400 text-sm">Không tìm thấy mã ghép "{searchCode}"</p>
      </div>
    )
  }

  return (
    <div className="py-16 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800 mb-3">
        <Wifi className="h-5 w-5 text-zinc-600" />
      </div>
      <p className="text-zinc-400 text-sm">{messages[tab].desc}</p>
    </div>
  )
}
