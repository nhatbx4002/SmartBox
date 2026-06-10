import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  Lock,
  Pencil,
  Plus,
  Power,
  RefreshCw,
  Trash2,
  Zap,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Badge, Button, Input, Modal, Select } from '@/components/ui'
import { cabinetsApi } from '@/lib/api'
import type { Compartment, McpDevice, CompartmentSize } from '@/types'

const STATUS_CONFIG: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' }> = {
  ACTIVE: { label: 'Hoạt động', variant: 'success' },
  OFFLINE: { label: 'Offline', variant: 'error' },
  INACTIVE: { label: 'Tắt', variant: 'neutral' },
  CONFIGURING: { label: 'Đang cấu hình', variant: 'warning' },
  DRAFT: { label: 'Bản nháp', variant: 'neutral' },
  PENDING_PROVISION: { label: 'Chờ provision', variant: 'warning' },
  PENDING_REGISTRATION: { label: 'Chờ đăng ký', variant: 'warning' },
  PROVISION_FAILED: { label: 'Provision lỗi', variant: 'error' },
}

function formatTime(dateStr?: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function CabinetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: cabinet, isLoading, refetch } = useQuery({
    queryKey: ['cabinet', id],
    queryFn: () => cabinetsApi.get(id!),
    enabled: !!id,
  })

  const [addModal, setAddModal] = React.useState(false)
  const [editCompartment, setEditCompartment] = React.useState<Compartment | null>(null)
  const [testLoading, setTestLoading] = React.useState<string | null>(null)
  const [activateLoading, setActivateLoading] = React.useState(false)
  const [deactivateLoading, setDeactivateLoading] = React.useState(false)

  // Activation
  const activateCabinet = useMutation({
    mutationFn: () => cabinetsApi.activate(id!),
    onSuccess: () => {
      toast.success('Tủ đã được kích hoạt thành công')
      queryClient.invalidateQueries({ queryKey: ['cabinet', id] })
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Kích hoạt thất bại'
      toast.error(msg)
    },
    onSettled: () => setActivateLoading(false),
  })

  const deactivateCabinet = useMutation({
    mutationFn: () => cabinetsApi.deactivate(id!),
    onSuccess: () => {
      toast.success('Tủ đã được tắt')
      queryClient.invalidateQueries({ queryKey: ['cabinet', id] })
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Tắt tủ thất bại'
      toast.error(msg)
    },
    onSettled: () => setDeactivateLoading(false),
  })

  // Test open
  const testOpen = useMutation({
    mutationFn: (compId: string) => cabinetsApi.testOpen(id!, compId),
    onSuccess: (result) => {
      toast.success(`Mở thử ngăn ${result.compartmentName} — đã gửi lệnh`)
    },
    onError: () => {
      toast.error('Mở thử thất bại. Kiểm tra kết nối tủ.')
    },
    onSettled: () => setTestLoading(null),
  })

  const statusCfg = cabinet ? STATUS_CONFIG[cabinet.status] ?? { label: cabinet.status, variant: 'neutral' as const } : null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    )
  }

  if (!cabinet) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-400">Không tìm thấy tủ</p>
        <Button variant="ghost" size="sm" className="mt-4" onClick={() => navigate('/cabinets')}>
          Quay lại
        </Button>
      </div>
    )
  }

  const mcpDevices: McpDevice[] = Array.isArray(cabinet.mcpDevices) ? cabinet.mcpDevices : []
  const isConfigurable = cabinet.status === 'CONFIGURING'
  const isActive = cabinet.status === 'ACTIVE'
  const canAddCompartment = isConfigurable
  const canActivate = isConfigurable && (cabinet.compartments?.length ?? 0) > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/cabinets')}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-zinc-400" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-zinc-100">{cabinet.name}</h1>
              <Badge variant={statusCfg?.variant as never}>{statusCfg?.label}</Badge>
            </div>
            <p className="mt-0.5 text-sm text-zinc-400">{cabinet.locationName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canActivate && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => { setActivateLoading(true); activateCabinet.mutate() }}
              loading={activateLoading}
            >
              <Check className="mr-1.5 h-4 w-4" />
              Hoàn tất cấu hình
            </Button>
          )}
          {isActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setDeactivateLoading(true); deactivateCabinet.mutate() }}
              loading={deactivateLoading}
            >
              <Power className="mr-1.5 h-4 w-4" />
              Tắt tủ
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Configuring banner */}
      {isConfigurable && (
        <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-4 flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            <Zap className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-orange-300">Tủ đang trong giai đoạn cấu hình</p>
            <p className="mt-0.5 text-xs text-orange-400/70">
              Thêm các ngăn bên dưới, đấu nối chân MCP23017, bấm TEST để xác nhận đấu dây, sau đó bấm Hoàn tất cấu hình.
            </p>
          </div>
        </div>
      )}

      {/* Cabinet info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard
          label="Serial"
          value={cabinet.hardwareSerial ? (
            <span className="font-mono">{cabinet.hardwareSerial}</span>
          ) : '—'}
        />
        <InfoCard
          label="Địa điểm"
          value={cabinet.locationName}
        />
        <InfoCard
          label="Phiên bản cấu hình"
          value={cabinet.configVersion != null ? `v${cabinet.configVersion}` : '—'}
        />
        <InfoCard
          label="MCP Devices"
          value={
            mcpDevices.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {mcpDevices.map((m) => (
                  <span key={m.id} className="px-2 py-0.5 rounded bg-zinc-800 text-xs font-mono text-zinc-300">
                    Bus {m.bus} @ 0x{m.address.toString(16).toUpperCase().padStart(2, '0')}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-zinc-600">Chưa phát hiện MCP</span>
            )
          }
        />
        <InfoCard
          label="Tổng ngăn"
          value={`${cabinet.compartments?.length ?? 0} / ${cabinet.totalCompartments}`}
        />
        <InfoCard
          label="Ngày tạo"
          value={formatTime(cabinet.createdAt)}
        />
      </div>

      {/* Compartments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-200">Ngăn ({cabinet.compartments?.length ?? 0})</h2>
          {canAddCompartment && (
            <Button variant="primary" size="sm" onClick={() => setAddModal(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              Thêm ngăn
            </Button>
          )}
        </div>

        {(!cabinet.compartments || cabinet.compartments.length === 0) ? (
          <div className="rounded-xl border-2 border-dashed border-zinc-800 py-12 text-center">
            {isConfigurable ? (
              <>
                <div className="text-zinc-600 mb-2">
                  <Plus className="h-8 w-8 mx-auto" />
                </div>
                <p className="text-zinc-400 text-sm">Chưa có ngăn nào</p>
                <p className="text-zinc-600 text-xs mt-1">Bấm "Thêm ngăn" để bắt đầu cấu hình</p>
              </>
            ) : (
              <p className="text-zinc-500 text-sm">Tủ này chưa có ngăn nào</p>
            )}
          </div>
        ) : (
          <CompartmentTable
            compartments={cabinet.compartments!}
            cabinetId={cabinet.id}
            isConfigurable={isConfigurable}
            onEdit={setEditCompartment}
            onTest={(compId) => { setTestLoading(compId); testOpen.mutate(compId) }}
            testLoading={testLoading}
            onDelete={() => queryClient.invalidateQueries({ queryKey: ['cabinet', id] })}
          />
        )}
      </div>

      {/* Add Compartment Modal */}
      <CompartmentFormModal
        open={addModal}
        onOpenChange={(open) => !open && setAddModal(false)}
        cabinetId={cabinet.id}
        mcpDevices={mcpDevices}
        onSuccess={() => {
          setAddModal(false)
          queryClient.invalidateQueries({ queryKey: ['cabinet', id] })
        }}
      />

      {/* Edit Compartment Modal */}
      <CompartmentFormModal
        open={!!editCompartment}
        onOpenChange={(open) => !open && setEditCompartment(null)}
        cabinetId={cabinet.id}
        mcpDevices={mcpDevices}
        compartment={editCompartment ?? undefined}
        onSuccess={() => {
          setEditCompartment(null)
          queryClient.invalidateQueries({ queryKey: ['cabinet', id] })
        }}
      />
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl bg-surface border border-zinc-800">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <div className="text-sm text-zinc-200">{value}</div>
    </div>
  )
}

function CompartmentTable({
  compartments,
  cabinetId,
  isConfigurable,
  onEdit,
  onTest,
  testLoading,
  onDelete,
}: {
  compartments: Compartment[]
  cabinetId: string
  isConfigurable: boolean
  onEdit: (c: Compartment) => void
  onTest: (id: string) => void
  testLoading: string | null
  onDelete: () => void
}) {
  const deleteCompartment = useMutation({
    mutationFn: (compId: string) => cabinetsApi.deleteCompartment(cabinetId, compId),
    onSuccess: () => {
      toast.success('Đã xóa ngăn')
      onDelete()
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Xóa thất bại'
      toast.error(msg)
    },
  })

  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-zinc-900 border-b border-zinc-800">
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-16">Tên</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-20">Kích cỡ</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-32">MCP Khóa</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-24">Pin Khóa</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-32">MCP Cảm biến</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-24">Pin Cảm biến</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-20">Trạng thái</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider w-40">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {compartments.map((comp) => (
            <tr key={comp.id} className="hover:bg-zinc-900/50 transition-colors">
              <td className="px-4 py-3 font-medium text-zinc-100">{comp.name}</td>
              <td className="px-4 py-3 text-zinc-400">
                <Badge variant={comp.size === 'LARGE' ? 'neutral' : 'neutral'}>
                  {comp.size === 'LARGE' ? 'Lớn' : 'Nhỏ'}
                </Badge>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-400">
                {comp.lockMcpDevice
                  ? `0x${comp.lockMcpDevice.address.toString(16).toUpperCase().padStart(2, '0')}`
                  : '—'}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-400">
                {comp.mcp23017PinLock ?? '—'}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-400">
                {comp.sensorMcpDevice
                  ? `0x${comp.sensorMcpDevice.address.toString(16).toUpperCase().padStart(2, '0')}`
                  : <span className="text-zinc-600">Không có</span>}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-400">
                {comp.mcp23017PinSensor != null ? comp.mcp23017PinSensor : '—'}
              </td>
              <td className="px-4 py-3">
                <CompartmentStatusBadge status={comp.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => onTest(comp.id)}
                    disabled={testLoading === comp.id}
                    title="Mở thử"
                  >
                    {testLoading === comp.id ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Lock className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  {isConfigurable && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => onEdit(comp)}
                        title="Sửa"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => {
                          if (confirm(`Xóa ngăn "${comp.name}"?`)) {
                            deleteCompartment.mutate(comp.id)
                          }
                        }}
                        title="Xóa"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CompartmentStatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' }> = {
    AVAILABLE: { label: 'Trống', variant: 'success' },
    OCCUPIED: { label: 'Đang thuê', variant: 'warning' },
    MAINTENANCE: { label: 'Bảo trì', variant: 'error' },
    RESERVED: { label: 'Đặt trước', variant: 'neutral' },
  }
  const c = cfg[status] ?? { label: status, variant: 'neutral' as const }
  return <Badge variant={c.variant}>{c.label}</Badge>
}

interface CompartmentFormData {
  name: string
  size: CompartmentSize
  lockMcpDeviceId: string
  mcp23017PinLock: number
  sensorMcpDeviceId: string
  mcp23017PinSensor: number
}

function CompartmentFormModal({
  open,
  onOpenChange,
  cabinetId,
  mcpDevices,
  compartment,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  cabinetId: string
  mcpDevices: McpDevice[]
  compartment?: Compartment
  onSuccess: () => void
}) {
  const isEdit = !!compartment
  const queryClient = useQueryClient()

  const [form, setForm] = React.useState<CompartmentFormData>({
    name: '',
    size: 'SMALL',
    lockMcpDeviceId: '',
    mcp23017PinLock: 0,
    sensorMcpDeviceId: '',
    mcp23017PinSensor: 0,
  })

  // Reset form when modal opens/closes or compartment changes
  React.useEffect(() => {
    if (open) {
      if (compartment) {
        setForm({
          name: compartment.name,
          size: compartment.size,
          lockMcpDeviceId: compartment.lockMcpDeviceId ?? '',
          mcp23017PinLock: compartment.mcp23017PinLock ?? 0,
          sensorMcpDeviceId: compartment.sensorMcpDeviceId ?? '',
          mcp23017PinSensor: compartment.mcp23017PinSensor ?? 0,
        })
      } else {
        setForm({ name: '', size: 'SMALL', lockMcpDeviceId: '', mcp23017PinLock: 0, sensorMcpDeviceId: '', mcp23017PinSensor: 0 })
      }
    }
  }, [open, compartment])

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        name: form.name.trim(),
        size: form.size,
        lockMcpDeviceId: form.lockMcpDeviceId || null,
        mcp23017PinLock: form.mcp23017PinLock,
        sensorMcpDeviceId: form.sensorMcpDeviceId || null,
        mcp23017PinSensor: form.mcp23017PinSensor,
      }
      if (isEdit && compartment) {
        return cabinetsApi.updateCompartment(cabinetId, compartment.id, payload)
      }
      return cabinetsApi.addCompartment(cabinetId, payload)
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Đã cập nhật ngăn' : 'Đã thêm ngăn')
      queryClient.invalidateQueries({ queryKey: ['cabinet', cabinetId] })
      onSuccess()
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Lưu thất bại'
      toast.error(msg)
    },
  })

  const mcpOptions = mcpDevices.map((m) => ({
    value: m.id,
    label: `Bus ${m.bus} @ 0x${m.address.toString(16).toUpperCase().padStart(2, '0')}`,
  }))

  const pinOptions = Array.from({ length: 16 }, (_, i) => ({
    value: String(i),
    label: String(i),
  }))

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error('Vui lòng nhập tên ngăn')
      return
    }
    if (!form.lockMcpDeviceId) {
      toast.error('Vui lòng chọn MCP device cho khóa')
      return
    }
    saveMutation.mutate()
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Sửa ngăn' : 'Thêm ngăn'}
      description="Khai báo chân đấu nối MCP23017 cho ngăn này"
    >
      <div className="space-y-4 py-2">
        <Input
          label="Tên ngăn"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value.toUpperCase() }))}
          placeholder="VD: A1, B2, C3"
        />

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2">Kích cỡ</label>
          <div className="flex gap-4">
            {(['SMALL', 'LARGE'] as CompartmentSize[]).map((size) => (
              <label key={size} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="size"
                  value={size}
                  checked={form.size === size}
                  onChange={() => setForm((f) => ({ ...f, size }))}
                  className="accent-brand"
                />
                <span className="text-sm text-zinc-200">{size === 'SMALL' ? 'Nhỏ' : 'Lớn'}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="MCP Khóa"
            options={mcpOptions}
            value={form.lockMcpDeviceId}
            onValueChange={(v) => setForm((f) => ({ ...f, lockMcpDeviceId: v }))}
            placeholder="Chọn MCP"
          />
          <Select
            label="Pin Khóa (0-15)"
            options={pinOptions}
            value={String(form.mcp23017PinLock)}
            onValueChange={(v) => setForm((f) => ({ ...f, mcp23017PinLock: Number(v) }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="MCP Cảm biến"
            options={[{ value: '', label: 'Không có' }, ...mcpOptions]}
            value={form.sensorMcpDeviceId}
            onValueChange={(v) => setForm((f) => ({ ...f, sensorMcpDeviceId: v }))}
            placeholder="Chọn MCP"
          />
          <Select
            label="Pin Cảm biến (0-15)"
            options={pinOptions}
            value={String(form.mcp23017PinSensor)}
            onValueChange={(v) => setForm((f) => ({ ...f, mcp23017PinSensor: Number(v) }))}
          />
        </div>

        <div className="rounded-lg bg-zinc-900 p-3 border border-zinc-800">
          <p className="text-xs text-zinc-500">
            Sau khi lưu, bấm TEST trên hàng ngăn để xác nhận đấu dây đúng với thực tế.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          loading={saveMutation.isPending}
        >
          {isEdit ? 'Lưu thay đổi' : 'Thêm ngăn'}
        </Button>
      </div>
    </Modal>
  )
}
