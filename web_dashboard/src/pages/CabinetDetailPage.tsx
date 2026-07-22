import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Check, Lock, Pencil, Plus, Power, RefreshCw, Trash2, Zap, Cpu, Calendar, MapPin, Hash,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button, Input, Modal, Select } from '@/components/ui'
import { cabinetsApi } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Compartment, McpDevice, CompartmentSize } from '@/types'

function formatTime(dateStr?: string): string {
  if (!dateStr) return '\u2014'
  return new Date(dateStr).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function BreathingDot({ status }: { status: string }) {
  const active = status === 'ACTIVE' || status === 'ONLINE'
  return (
    <span className="relative inline-flex h-2 w-2 shrink-0">
      {active && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />}
      <span className={cn(
        'relative inline-flex h-2 w-2 rounded-full',
        active ? 'bg-emerald-400' : status === 'OFFLINE' ? 'bg-red-400' : status === 'CONFIGURING' ? 'bg-amber-400' : 'bg-zinc-600',
      )} />
    </span>
  )
}

function InfoChip({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="group rounded-xl border border-zinc-800/50 bg-zinc-900/40 p-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-zinc-700/60 hover:bg-zinc-900/60">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80">
          <Icon className="h-3.5 w-3.5 text-zinc-400" strokeWidth={1.5} />
        </div>
        <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">{label}</span>
      </div>
      <div className="text-sm text-zinc-200">{value}</div>
    </div>
  )
}

function StatusBadgeInline({ status }: { status: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    ACTIVE:      { label: 'Online',    cls: 'bg-emerald-500/10 text-emerald-300' },
    ONLINE:      { label: 'Online',    cls: 'bg-emerald-500/10 text-emerald-300' },
    OFFLINE:     { label: 'Offline',   cls: 'bg-red-500/10 text-red-300' },
    INACTIVE:    { label: 'T\u1EAFt',  cls: 'bg-zinc-800 text-zinc-400' },
    CONFIGURING: { label: 'C\u1EA5u h\u00ECnh', cls: 'bg-amber-500/10 text-amber-300' },
  }
  const c = cfg[status] ?? { label: status, cls: 'bg-zinc-800 text-zinc-400' }
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wider uppercase', c.cls)}>
      <BreathingDot status={status} />
      {c.label}
    </span>
  )
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

  const activateCabinet = useMutation({
    mutationFn: () => cabinetsApi.activate(id!),
    onSuccess: () => { toast.success('Cabinet activated'); queryClient.invalidateQueries({ queryKey: ['cabinet', id] }) },
    onError: (err) => { toast.error(err instanceof Error ? err.message : 'Activation failed') },
    onSettled: () => setActivateLoading(false),
  })

  const deactivateCabinet = useMutation({
    mutationFn: () => cabinetsApi.deactivate(id!),
    onSuccess: () => { toast.success('Cabinet deactivated'); queryClient.invalidateQueries({ queryKey: ['cabinet', id] }) },
    onError: (err) => { toast.error(err instanceof Error ? err.message : 'Deactivation failed') },
    onSettled: () => setDeactivateLoading(false),
  })

  const testOpen = useMutation({
    mutationFn: (compId: string) => cabinetsApi.testOpen(id!, compId),
    onSuccess: (result) => { toast.success(`Test open: ${result.compartmentName}`) },
    onError: (err) => { toast.error(err instanceof Error ? err.message : 'Test open failed') },
    onSettled: () => setTestLoading(null),
  })

  const deleteCompartment = useMutation({
    mutationFn: (compId: string) => cabinetsApi.deleteCompartment(id!, compId),
    onSuccess: () => { toast.success('Compartment deleted'); queryClient.invalidateQueries({ queryKey: ['cabinet', id] }) },
    onError: (err) => { toast.error(err instanceof Error ? err.message : 'Delete failed') },
  })

  if (isLoading) {
    return (
      <div className="space-y-5 py-2" style={{ animation: 'enter 0.35s ease-out both' }}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-zinc-800" />
          <div className="space-y-2">
            <div className="h-5 w-40 animate-pulse rounded bg-zinc-800" />
            <div className="h-3 w-56 animate-pulse rounded bg-zinc-800/60" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-zinc-800/50 bg-zinc-900/40 p-4">
              <div className="mb-2 h-3 w-16 rounded bg-zinc-800" />
              <div className="h-4 w-28 rounded bg-zinc-800/60" />
            </div>
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl border border-zinc-800/50 bg-zinc-900/40" />
      </div>
    )
  }

  if (!cabinet) {
    return (
      <div className="flex flex-col items-center justify-center py-28">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60">
          <Zap className="h-6 w-6 text-zinc-600" strokeWidth={1.5} />
        </div>
        <p className="text-base font-medium text-zinc-400">Cabinet not found</p>
        <button onClick={() => navigate('/cabinets')} className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-400 transition-all duration-200 hover:bg-zinc-800 hover:text-zinc-200 active:scale-[0.97]">
          Go back
        </button>
      </div>
    )
  }

  const mcpDevices: McpDevice[] = Array.isArray(cabinet.mcpDevices) ? cabinet.mcpDevices : []
  const isConfigurable = cabinet.status === 'CONFIGURING'
  const isActive = cabinet.status === 'ACTIVE' || cabinet.status === 'ONLINE'
  const canAddCompartment = isConfigurable || isActive || cabinet.status === 'OFFLINE'
  const canActivate = isConfigurable && (cabinet.compartments?.length ?? 0) > 0
  const isInactive = cabinet.status === 'INACTIVE'
  const compartments = cabinet.compartments ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4" style={{ animation: 'enter 0.4s ease-out both' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/cabinets')} className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 transition-all duration-200 hover:bg-zinc-800 hover:text-zinc-200 active:scale-90">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-zinc-100">{cabinet.name}</h1>
              <StatusBadgeInline status={cabinet.status} />
            </div>
            <p className="mt-0.5 text-xs text-zinc-500">{cabinet.locationName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canActivate && (
            <Button variant="primary" size="sm" onClick={() => { setActivateLoading(true); activateCabinet.mutate() }} loading={activateLoading}>
              <Check className="mr-1.5 h-4 w-4" /> Complete config
            </Button>
          )}
          {isInactive && (
            <Button variant="primary" size="sm" onClick={() => { setActivateLoading(true); activateCabinet.mutate() }} loading={activateLoading}>
              <Power className="mr-1.5 h-4 w-4" /> Activate
            </Button>
          )}
          {isActive && (
            <Button variant="outline" size="sm" onClick={() => { setDeactivateLoading(true); deactivateCabinet.mutate() }} loading={deactivateLoading}>
              <Power className="mr-1.5 h-4 w-4" /> Deactivate
            </Button>
          )}
          <button onClick={() => refetch()} className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-all duration-200 hover:bg-zinc-800 hover:text-zinc-200 active:scale-90">
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Configuring banner */}
      {isConfigurable && (
        <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.04] px-5 py-3.5" style={{ animation: 'enter 0.4s ease-out 0.05s both' }}>
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <Zap className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-300/90">Configuration in progress</p>
              <p className="mt-0.5 text-xs leading-relaxed text-amber-400/60">
                Add compartments, wire MCP23017 pins, use TEST to verify connections, then finalize configuration.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bento info grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3" style={{ animation: 'enter 0.4s ease-out 0.08s both' }}>
        <InfoChip icon={Hash} label="Serial" value={<span className="font-mono text-xs tracking-tight">{cabinet.hardwareSerial || '\u2014'}</span>} />
        <InfoChip icon={MapPin} label="Location" value={<span className="text-sm">{cabinet.locationName}</span>} />
        <InfoChip icon={Cpu} label="MCP Devices" value={
          mcpDevices.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {mcpDevices.map((m) => (
                <span key={m.id} className="rounded-md border border-zinc-800 bg-zinc-900/80 px-1.5 py-0.5 font-mono text-[11px] text-zinc-400">
                  Bus {m.bus} @ 0x{m.address.toString(16).toUpperCase().padStart(2, '0')}
                </span>
              ))}
            </div>
          ) : <span className="text-zinc-600">None detected</span>
        } />
        <InfoChip icon={Lock} label="Compartments" value={<span className="font-mono text-sm">{cabinet.availableCompartments}/{cabinet.totalCompartments}</span>} />
        <InfoChip icon={Calendar} label="Created" value={<span className="font-mono text-xs">{formatTime(cabinet.createdAt)}</span>} />
        <InfoChip icon={Zap} label="Status" value={
          <span className={cn(
            'text-sm font-medium',
            isActive ? 'text-emerald-400' : isConfigurable ? 'text-amber-400' : cabinet.status === 'OFFLINE' ? 'text-red-400' : 'text-zinc-500',
          )}>
            {STATUS_LABEL(cabinet.status)}
          </span>
        } />
      </div>

      {/* Compartments */}
      <div className="space-y-4" style={{ animation: 'enter 0.4s ease-out 0.12s both' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-200">Compartments ({compartments.length})</h2>
          {canAddCompartment && (
            <Button variant="primary" size="sm" onClick={() => setAddModal(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> Add compartment
            </Button>
          )}
        </div>

        {compartments.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-zinc-800/60 py-16 text-center transition-all duration-300">
            <div className="mb-3 text-zinc-600">
              <Plus className="mx-auto h-8 w-8" strokeWidth={1} />
            </div>
            {isConfigurable ? (
              <>
                <p className="text-sm font-medium text-zinc-400">No compartments yet</p>
                <p className="mt-0.5 text-xs text-zinc-600">Click "Add compartment" to start configuring</p>
              </>
            ) : (
              <p className="text-sm text-zinc-500">This cabinet has no compartments</p>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-800/50">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800/40 bg-zinc-900/50">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wider text-zinc-500 uppercase" style={{ width: '10%' }}>Name</th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold tracking-wider text-zinc-500 uppercase" style={{ width: '8%' }}>Size</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wider text-zinc-500 uppercase" style={{ width: '25%' }}>Lock MCP / Pin</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold tracking-wider text-zinc-500 uppercase" style={{ width: '25%' }}>Sensor MCP / Pin</th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold tracking-wider text-zinc-500 uppercase" style={{ width: '16%' }}>Status</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold tracking-wider text-zinc-500 uppercase" style={{ width: '16%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {compartments.map((comp, i) => (
                  <tr
                    key={comp.id}
                    className="border-b border-zinc-800/30 transition-colors duration-150 last:border-0 hover:bg-zinc-800/20"
                    style={{ animation: `enter 0.3s ease-out ${0.15 + i * 0.05}s both` }}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-zinc-200">{comp.name}</td>
                    <td className="px-4 py-3 text-center text-xs text-zinc-500">{comp.size === 'LARGE' ? 'L' : 'S'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                      {comp.lockMcpDevice
                        ? `0x${comp.lockMcpDevice.address.toString(16).toUpperCase().padStart(2, '0')} / P${comp.mcp23017PinLock}`
                        : '\u2014'}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                      {comp.sensorMcpDevice
                        ? `0x${comp.sensorMcpDevice.address.toString(16).toUpperCase().padStart(2, '0')} / P${comp.mcp23017PinSensor}`
                        : '\u2014'}
                    </td>
                    <td className="px-4 py-3 text-center"><Chip status={comp.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-0.5">
                        <button
                          onClick={() => { setTestLoading(comp.id); testOpen.mutate(comp.id) }}
                          disabled={testLoading === comp.id}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-all duration-200 hover:bg-zinc-800 hover:text-zinc-200 active:scale-90 disabled:opacity-50"
                        >
                          {testLoading === comp.id
                            ? <RefreshCw className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                            : <Lock className="h-3.5 w-3.5" strokeWidth={1.5} />}
                        </button>
                        {(isConfigurable || isActive) && (
                          <>
                            <button onClick={() => setEditCompartment(comp)} className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-all duration-200 hover:bg-zinc-800 hover:text-zinc-200 active:scale-90">
                              <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                            <button onClick={() => { if (confirm(`Xóa ngăn "${comp.name}"?`)) deleteCompartment.mutate(comp.id) }} className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 active:scale-90">
                              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CompartmentFormModal
        open={addModal}
        onOpenChange={(open) => !open && setAddModal(false)}
        cabinetId={cabinet.id}
        mcpDevices={mcpDevices}
        onSuccess={() => { setAddModal(false); queryClient.invalidateQueries({ queryKey: ['cabinet', id] }) }}
      />
      <CompartmentFormModal
        open={!!editCompartment}
        onOpenChange={(open) => !open && setEditCompartment(null)}
        cabinetId={cabinet.id}
        mcpDevices={mcpDevices}
        compartment={editCompartment ?? undefined}
        onSuccess={() => { setEditCompartment(null); queryClient.invalidateQueries({ queryKey: ['cabinet', id] }) }}
      />

      <style>{`@keyframes enter{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}

function Chip({ status }: { status: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    AVAILABLE:   { label: 'Available',  cls: 'bg-emerald-500/10 text-emerald-300' },
    OCCUPIED:    { label: 'Occupied',   cls: 'bg-amber-500/10 text-amber-300' },
    MAINTENANCE: { label: 'Maintenance', cls: 'bg-red-500/10 text-red-300' },
    RESERVED:    { label: 'Reserved',   cls: 'bg-blue-500/10 text-blue-300' },
  }
  const c = cfg[status] ?? { label: status, cls: 'bg-zinc-800 text-zinc-400' }
  return <span className={cn('inline-block rounded-md px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase', c.cls)}>{c.label}</span>
}

function STATUS_LABEL(s: string): string {
  const map: Record<string, string> = { ACTIVE: 'Online', ONLINE: 'Online', OFFLINE: 'Offline', INACTIVE: 'Inactive', CONFIGURING: 'Configuring' }
  return map[s] ?? s
}

interface CompartmentFormData {
  name: string; size: CompartmentSize; lockMcpDeviceId: string; mcp23017PinLock: number; sensorMcpDeviceId: string; mcp23017PinSensor: number
}

function CompartmentFormModal({
  open, onOpenChange, cabinetId, mcpDevices, compartment, onSuccess,
}: {
  open: boolean; onOpenChange: (open: boolean) => void; cabinetId: string; mcpDevices: McpDevice[]; compartment?: Compartment; onSuccess: () => void
}) {
  const isEdit = !!compartment
  const queryClient = useQueryClient()
  const [form, setForm] = React.useState<CompartmentFormData>({
    name: '', size: 'SMALL', lockMcpDeviceId: '', mcp23017PinLock: 0, sensorMcpDeviceId: '', mcp23017PinSensor: 0,
  })

  React.useEffect(() => {
    if (open) {
      if (compartment) {
        setForm({
          name: compartment.name, size: compartment.size,
          lockMcpDeviceId: compartment.lockMcpDeviceId ?? '', mcp23017PinLock: compartment.mcp23017PinLock ?? 0,
          sensorMcpDeviceId: compartment.sensorMcpDeviceId ?? '', mcp23017PinSensor: compartment.mcp23017PinSensor ?? 0,
        })
      } else {
        setForm({ name: '', size: 'SMALL', lockMcpDeviceId: '', mcp23017PinLock: 0, sensorMcpDeviceId: '', mcp23017PinSensor: 0 })
      }
    }
  }, [open, compartment])

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        name: form.name.trim(), size: form.size,
        lockMcpDeviceId: form.lockMcpDeviceId, mcp23017PinLock: form.mcp23017PinLock,
        sensorMcpDeviceId: form.sensorMcpDeviceId, mcp23017PinSensor: form.mcp23017PinSensor,
      }
      return isEdit && compartment
        ? cabinetsApi.updateCompartment(cabinetId, compartment.id, payload)
        : cabinetsApi.addCompartment(cabinetId, payload)
    },
    onSuccess: () => { toast.success(isEdit ? 'Compartment updated' : 'Compartment added'); queryClient.invalidateQueries({ queryKey: ['cabinet', cabinetId] }); onSuccess() },
    onError: (err) => { toast.error(err instanceof Error ? err.message : 'Save failed') },
  })

  const mcpOptions = mcpDevices.map((m) => ({
    value: m.id,
    label: `Bus ${m.bus} @ 0x${m.address.toString(16).toUpperCase().padStart(2, '0')}`,
  }))

  const pinOptions = Array.from({ length: 16 }, (_, i) => ({ value: String(i), label: String(i) }))

  const validate = () => {
    if (!form.name.trim()) { toast.error('Compartment name required'); return false }
    if (!form.lockMcpDeviceId) { toast.error('Select MCP for lock'); return false }
    if (!form.sensorMcpDeviceId) { toast.error('Select MCP for sensor'); return false }
    return true
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={isEdit ? 'Edit compartment' : 'Add compartment'} description="Configure MCP23017 pin mapping for this compartment">
      <div className="space-y-4 py-2">
        <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value.toUpperCase() }))} placeholder="A1, B2, C3" />
        <div>
          <label className="mb-2 block text-xs font-medium text-zinc-400">Size</label>
          <div className="flex gap-4">
            {(['SMALL', 'LARGE'] as CompartmentSize[]).map((size) => (
              <label key={size} className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="size" value={size} checked={form.size === size} onChange={() => setForm((f) => ({ ...f, size }))} className="accent-brand" />
                <span className="text-sm text-zinc-200">{size === 'SMALL' ? 'Small' : 'Large'}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Lock MCP" options={mcpOptions} value={form.lockMcpDeviceId} onValueChange={(v) => setForm((f) => ({ ...f, lockMcpDeviceId: v }))} placeholder="Select MCP" />
          <Select label="Lock Pin (0-15)" options={pinOptions} value={String(form.mcp23017PinLock)} onValueChange={(v) => setForm((f) => ({ ...f, mcp23017PinLock: Number(v) }))} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Sensor MCP" options={[{ value: '', label: 'None' }, ...mcpOptions]} value={form.sensorMcpDeviceId} onValueChange={(v) => setForm((f) => ({ ...f, sensorMcpDeviceId: v }))} placeholder="Select MCP" />
          <Select label="Sensor Pin (0-15)" options={pinOptions} value={String(form.mcp23017PinSensor)} onValueChange={(v) => setForm((f) => ({ ...f, mcp23017PinSensor: Number(v) }))} />
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
          <p className="text-xs text-zinc-500">Use TEST after saving to verify wiring.</p>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button variant="primary" onClick={() => { if (validate()) saveMutation.mutate() }} loading={saveMutation.isPending}>
          {isEdit ? 'Save changes' : 'Add compartment'}
        </Button>
      </div>
    </Modal>
  )
}
