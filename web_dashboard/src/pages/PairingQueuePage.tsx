import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Search, X, Wifi, Cpu } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Modal, Input, Select, LocationMapPicker } from '@/components/ui'
import { locationsApi, pairingApi } from '@/lib/api'
import { useAuthStore } from '@/store'
import { cn } from '@/lib/utils'
import type { PairingSession, PairingSessionStatus } from '@/types'

function StatusDot({ status, expired }: { status: PairingSessionStatus; expired?: boolean }) {
  const colors: Record<string, string> = {
    PENDING: expired ? 'bg-zinc-600' : 'bg-amber-500',
    APPROVED: 'bg-emerald-500',
    EXPIRED: 'bg-zinc-600',
    REJECTED: 'bg-zinc-600',
  }
  return (
    <span className="relative inline-flex h-2 w-2 shrink-0">
      {status === 'PENDING' && !expired && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500/40" />
      )}
      <span className={cn('relative inline-flex h-2 w-2 rounded-sm', colors[status])} />
    </span>
  )
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

  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationsApi.list({ status: 'ACTIVE' }),
  })

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['pairing-sessions'],
    queryFn: pairingApi.list,
    refetchInterval: 5000,
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

  const handleSearch = React.useCallback(async () => {
    if (!searchCode.trim()) { setSearchByCodeResult(null); return }
    try {
      const result = await pairingApi.getByCode(searchCode.trim())
      setSearchByCodeResult(result)
    } catch {
      setSearchByCodeResult(null)
      toast.error('Không tìm thấy mã ghép này')
    }
  }, [searchCode])

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
      navigate(`/cabinets/${result.cabinetId}`)
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Không thể duyệt ghép tủ'
      toast.error(msg)
    },
  })

  const cancelMutation = useMutation({
    mutationFn: pairingApi.cancel,
    onSuccess: () => {
      toast.success('Đã hủy ghép tủ')
      queryClient.invalidateQueries({ queryKey: ['pairing-sessions'] })
    },
    onError: () => toast.error('Không thể hủy ghép tủ'),
  })

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
    if (!approveForm.cabinetName.trim()) { toast.error('Vui lòng nhập tên tủ'); return }

    let locationId = approveForm.locationId

    if (isCreatingLocation) {
      if (!newLocationForm.name.trim() || !newLocationForm.address.trim()) {
        toast.error('Vui lòng nhập tên và địa chỉ'); return
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
      } catch { toast.error('Không thể tạo địa điểm mới'); return }
    } else if (!locationId) { toast.error('Vui lòng chọn địa điểm'); return }

    approveMutation.mutate({
      sessionId: approveModal.session.id,
      data: { locationId, cabinetName: approveForm.cabinetName.trim() },
    })
  }

  const tabs: { key: PairingSessionStatus; label: string }[] = [
    { key: 'PENDING', label: 'Chờ duyệt' },
    { key: 'APPROVED', label: 'Đã duyệt' },
    { key: 'EXPIRED', label: 'Hết hạn' },
    { key: 'REJECTED', label: 'Đã hủy' },
  ]

  const locationOptions = locations.map((l) => ({ value: l.id, label: l.name }))

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center gap-3" style={{ animation: 'enter 0.4s ease-out both' }}>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Tìm theo mã ghép (VD: A3F7K2)"
            value={searchCode}
            onChange={(e) => { setSearchCode(e.target.value); if (!e.target.value) setSearchByCodeResult(null) }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 pl-9 pr-3 text-xs text-zinc-200 placeholder:text-zinc-600 outline-none transition-all duration-200 focus:border-zinc-700 focus:bg-zinc-900"
          />
        </div>
        {searchCode && (
          <button onClick={() => { setSearchCode(''); setSearchByCodeResult(null) }} className="flex h-9 items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 text-xs font-medium text-zinc-400 transition-colors duration-150 hover:bg-zinc-800 hover:text-zinc-200 active:scale-[0.98]">
            <X className="h-3 w-3" strokeWidth={1.5} /> Xóa
          </button>
        )}
      </div>

      {/* Search result */}
      {searchByCodeResult && (
        <div style={{ animation: 'enter 0.35s ease-out both' }}>
          <span className="mb-3 block text-xs font-medium tracking-wider text-zinc-500 uppercase">Kết quả tìm kiếm</span>
          <SessionCard
            session={searchByCodeResult}
            onApprove={openApprove}
            onCancel={(id) => cancelMutation.mutate(id)}
            isPending={cancelMutation.isPending}
          />
        </div>
      )}

      {/* Tab strip */}
      <div className="flex items-center gap-6 border-b border-zinc-800" style={{ animation: 'enter 0.4s ease-out 0.05s both' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          const count = sessions.filter((s) => s.status === tab.key).length
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'relative pb-2.5 text-xs font-medium tracking-wider uppercase transition-colors duration-150',
                isActive ? 'text-zinc-200' : 'text-zinc-500 hover:text-zinc-400',
              )}
            >
              {tab.label}
              <span className={cn('ml-1.5 text-[10px]', isActive ? 'text-zinc-400' : 'text-zinc-600')}>{count}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-zinc-200" />
              )}
            </button>
          )
        })}
      </div>

      {/* Session list */}
      <div style={{ animation: 'enter 0.4s ease-out 0.1s both' }}>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-5 w-24 rounded bg-zinc-800" />
                  <div className="h-4 w-14 rounded bg-zinc-800/60" />
                </div>
                <div className="h-3 w-48 rounded bg-zinc-800/60" />
              </div>
            ))}
          </div>
        ) : filteredSessions.length === 0 ? (
          <EmptyState tab={activeTab} hasSearch={!!searchCode} searchCode={searchCode} />
        ) : (
          <div className="space-y-2">
            {filteredSessions.map((session, i) => (
              <div key={session.id} style={{ animation: `enter 0.35s ease-out ${0.15 + i * 0.06}s both` }}>
                <SessionCard
                  session={session}
                  onApprove={openApprove}
                  onCancel={(id) => cancelMutation.mutate(id)}
                  isPending={cancelMutation.isPending}
                />
              </div>
            ))}
          </div>
        )}
      </div>

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
          <div className="space-y-5">
            <div className="space-y-2.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Serial</span>
                <span className="font-mono text-zinc-200">{approveModal.session.hardwareSerial}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">MCP Devices</span>
                <div className="flex gap-1.5">
                  {approveModal.session.discoveredMcpDevices.map((mcp, i) => (
                    <span key={i} className="rounded-sm border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                      0x{mcp.address.toString(16).toUpperCase().padStart(2, '0')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-400">Địa điểm</label>
                  {admin?.role === 'SUPER_ADMIN' && (
                    <button
                      type="button"
                      onClick={() => { setIsCreatingLocation(!isCreatingLocation); setNewLocationForm({ name: '', address: '', lat: '', lng: '' }) }}
                      className="text-xs text-zinc-500 transition-colors duration-150 hover:text-zinc-300"
                    >
                      {isCreatingLocation ? 'Chọn địa điểm có sẵn' : 'Tạo địa điểm mới'}
                    </button>
                  )}
                </div>
                {isCreatingLocation ? (
                  <div className="space-y-3">
                    <Input value={newLocationForm.name} onChange={(e) => setNewLocationForm((f) => ({ ...f, name: e.target.value }))} placeholder="Tên địa điểm" />
                    <Input value={newLocationForm.address} onChange={(e) => setNewLocationForm((f) => ({ ...f, address: e.target.value }))} placeholder="Địa chỉ" />
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

            <div className="flex justify-end gap-3 pt-1">
              <button
                onClick={() => {
                  setApproveModal({ open: false, session: null })
                  setApproveForm({ locationId: '', cabinetName: '' })
                  setIsCreatingLocation(false)
                  setNewLocationForm({ name: '', address: '', lat: '', lng: '' })
                }}
                className="rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-400 transition-all duration-150 hover:bg-zinc-800 hover:text-zinc-200 active:scale-[0.98]"
              >
                Hủy
              </button>
              <button
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className="rounded-md bg-zinc-100 px-4 py-2 text-xs font-medium text-zinc-900 transition-all duration-150 hover:bg-zinc-300 active:scale-[0.98] disabled:opacity-50"
              >
                {approveMutation.isPending ? 'Đang duyệt...' : 'Duyệt ghép'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        @keyframes enter {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

function SessionCard({
  session, onApprove, onCancel, isPending,
}: {
  session: PairingSession; onApprove: (s: PairingSession) => void; onCancel: (id: string) => void; isPending: boolean
}) {
  const isExpired = new Date(session.expiresAt) < new Date()

  return (
    <div className="group rounded-lg border border-zinc-800/60 bg-zinc-900/30 px-5 py-4 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-zinc-700/60 hover:bg-zinc-900/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="mt-1">
            <StatusDot status={session.status} expired={isExpired} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-base font-semibold tracking-tight text-zinc-200">{session.pairingCode}</span>
              <StatusBadge status={session.status} expired={isExpired} />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
              <span className="font-mono text-zinc-600">{session.hardwareSerial}</span>
              <span className="text-zinc-700">&middot;</span>
              <span>{formatTimeAgo(session.createdAt)}</span>
              {session.status === 'PENDING' && (
                <>
                  <span className="text-zinc-700">&middot;</span>
                  <span className={isExpired ? 'text-red-400' : 'text-zinc-500'}>
                    Hết hạn: {formatExpiry(session.expiresAt)}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-zinc-600">
                <Cpu className="h-3 w-3" strokeWidth={1.5} />
                <span className="text-[11px]">{session.discoveredMcpDevices.length} MCP23017</span>
              </div>
              <div className="flex gap-1">
                {session.discoveredMcpDevices.map((mcp, i) => (
                  <span key={i} className="rounded-sm border border-zinc-800 bg-zinc-900/80 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
                    0x{mcp.address.toString(16).toUpperCase().padStart(2, '0')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {session.status === 'PENDING' && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => onCancel(session.id)}
              disabled={isPending}
              className="rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-[11px] font-medium text-zinc-400 transition-all duration-150 hover:bg-zinc-800 hover:text-zinc-300 active:scale-[0.97] disabled:opacity-50"
            >
              <X className="mr-1 inline h-3 w-3" strokeWidth={1.5} /> Hủy
            </button>
            <button
              onClick={() => onApprove(session)}
              disabled={isExpired}
              className="rounded-md bg-zinc-100 px-3 py-1.5 text-[11px] font-medium text-zinc-900 transition-all duration-150 hover:bg-zinc-300 active:scale-[0.97] disabled:opacity-50"
            >
              <Check className="mr-1 inline h-3 w-3" strokeWidth={2} /> Duyệt
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status, expired }: { status: PairingSessionStatus; expired: boolean }) {
  const cfg: Record<string, { label: string; classes: string }> = {
    PENDING: { label: 'Chờ duyệt', classes: expired ? 'bg-zinc-800 text-zinc-500' : 'bg-amber-500/10 text-amber-400' },
    APPROVED: { label: 'Đã duyệt', classes: 'bg-emerald-500/10 text-emerald-400' },
    EXPIRED: { label: 'Hết hạn', classes: 'bg-zinc-800 text-zinc-500' },
    REJECTED: { label: 'Đã hủy', classes: 'bg-zinc-800 text-zinc-500' },
  }
  const c = cfg[status] ?? cfg.EXPIRED
  return (
    <span className={`rounded-sm px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${c.classes}`}>
      {c.label}
    </span>
  )
}

function EmptyState({ tab, hasSearch, searchCode }: { tab: PairingSessionStatus; hasSearch: boolean; searchCode: string }) {
  const messages: Record<PairingSessionStatus, { title: string; desc: string }> = {
    PENDING: { title: 'Không có yêu cầu nào', desc: 'Khi Raspberry Pi bắt đầu ghép, yêu cầu sẽ xuất hiện tại đây' },
    APPROVED: { title: 'Chưa có tủ nào được duyệt', desc: 'Các tủ đã duyệt sẽ xuất hiện tại đây' },
    EXPIRED: { title: 'Không có yêu cầu hết hạn', desc: 'Các yêu cầu hết hạn sau 10 phút sẽ xuất hiện tại đây' },
    REJECTED: { title: 'Không có yêu cầu bị hủy', desc: 'Các yêu cầu bị hủy sẽ xuất hiện tại đây' },
  }

  return (
    <div className="flex flex-col items-center justify-center py-20">
      {hasSearch ? (
        <>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60">
            <Search className="h-5 w-5 text-zinc-600" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-zinc-500">Không tìm thấy mã ghép "{searchCode}"</p>
        </>
      ) : (
        <>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60">
            <Wifi className="h-5 w-5 text-zinc-600" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-zinc-500">{messages[tab].desc}</p>
        </>
      )}
    </div>
  )
}
