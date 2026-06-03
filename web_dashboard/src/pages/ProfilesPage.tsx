import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button, DataTable, Badge, Modal, Input, Select, type Column } from '@/components/ui'
import { cn } from '@/lib/utils'
import { profilesApi, provisioningApi } from '@/lib/api'
import type { CompartmentSize, ProvisionProfile, ProvisionMcpDevice, ProvisioningConfig } from '@/types'

const modeLabels: Record<ProvisionProfile['mode'], string> = {
  ALLOW_NEW: 'Allow New',
  CHECK_EXISTING: 'Check Existing',
}

function buildDefaultSizes(rows: number, cols: number): CompartmentSize[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 'SMALL' as CompartmentSize)
  )
}

function configUpdatedLabel(config: ProvisioningConfig) {
  if (!config.updatedAt) return 'ENV fallback'
  return new Date(config.updatedAt).toLocaleString('vi-VN')
}

export default function ProfilesPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [showModal, setShowModal] = React.useState(false)
  const [editingProfile, setEditingProfile] = React.useState<ProvisionProfile | null>(null)
  const [showDetailModal, setShowDetailModal] = React.useState(false)
  const [detailProfile, setDetailProfile] = React.useState<ProvisionProfile | null>(null)

  // --- List view ---
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => profilesApi.list(),
  })

  const { data: provisioningConfig } = useQuery({
    queryKey: ['provisioning-config'],
    queryFn: () =>
      provisioningApi.getConfig().catch((err: { response?: { status?: number } }) => {
        if (err.response?.status === 401 || err.response?.status === 403) return null
        throw err
      }),
    retry: false,
  })

  // --- Detail view ---
  const { data: detail } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => profilesApi.get(id as string),
    enabled: Boolean(id),
  })

  React.useEffect(() => {
    if (detail) setDetailProfile(detail)
  }, [detail])

  // --- Delete ---
  const deleteMutation = useMutation({
    mutationFn: (profileId: string) => profilesApi.delete(profileId),
    onSuccess: () => {
      toast.success('Profile deleted')
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
      if (id) navigate('/profiles')
    },
    onError: () => toast.error('Could not delete profile'),
  })

  // --- Form state ---
  const [form, setForm] = React.useState({
    name: '',
    provisionKey: '',
    provisionSecret: '',
    mode: 'ALLOW_NEW' as ProvisionProfile['mode'],
    templateRows: '4',
    templateCols: '6',
    templateSizes: buildDefaultSizes(4, 6),
    mcpDevices: [
      { bus: 1, address: 32, role: 'SENSOR' as const, name: 'MCP-SENSOR' },
      { bus: 1, address: 33, role: 'LOCK' as const, name: 'MCP-LOCK' },
    ],
  })

  const resetForm = React.useCallback(() => {
    setForm({
      name: '',
      provisionKey: '',
      provisionSecret: '',
      mode: 'ALLOW_NEW',
      templateRows: '4',
      templateCols: '6',
      templateSizes: buildDefaultSizes(4, 6),
      mcpDevices: [
        { bus: 1, address: 32, role: 'SENSOR', name: 'MCP-SENSOR' },
        { bus: 1, address: 33, role: 'LOCK', name: 'MCP-LOCK' },
      ],
    })
    setEditingProfile(null)
  }, [])

  const openEdit = React.useCallback((profile: ProvisionProfile) => {
    setEditingProfile(profile)
    setForm({
      name: profile.name,
      provisionKey: profile.provisionKey,
      provisionSecret: profile.provisionSecret ?? '',
      mode: profile.mode,
      templateRows: String(profile.templateRows),
      templateCols: String(profile.templateCols),
      templateSizes: profile.templateSizes,
      mcpDevices: profile.mcpDevices.map(d => ({
        bus: d.bus,
        address: d.address,
        role: d.role,
        name: d.name ?? '',
      })),
    })
    setShowModal(true)
  }, [])

  const handleMatrixResize = React.useCallback(() => {
    const rows = Math.max(1, parseInt(form.templateRows) || 1)
    const cols = Math.max(1, parseInt(form.templateCols) || 1)
    const sizes = buildDefaultSizes(rows, cols)
    setForm(prev => ({ ...prev, templateSizes: sizes }))
  }, [form.templateRows, form.templateCols])

  const handleTemplateRowsChange = (val: string) => {
    setForm(prev => ({ ...prev, templateRows: val }))
  }
  const handleTemplateColsChange = (val: string) => {
    setForm(prev => ({ ...prev, templateCols: val }))
  }

  const addMcpDevice = () => {
    setForm(prev => ({
      ...prev,
      mcpDevices: [...prev.mcpDevices, { bus: 1, address: 32, role: 'SENSOR', name: '' }],
    }))
  }

  const removeMcpDevice = (index: number) => {
    setForm(prev => ({
      ...prev,
      mcpDevices: prev.mcpDevices.filter((_, i) => i !== index),
    }))
  }

  const updateMcpDevice = (index: number, field: keyof ProvisionMcpDevice, value: string | number) => {
    setForm(prev => ({
      ...prev,
      mcpDevices: prev.mcpDevices.map((d, i) =>
        i === index ? { ...d, [field]: field === 'address' || field === 'bus' ? parseInt(String(value)) || 0 : value } : d
      ),
    }))
  }

  // --- Save ---
  const saveMutation = useMutation({
    mutationFn: (data: unknown) =>
      editingProfile ? profilesApi.update(editingProfile.id, data) : profilesApi.create(data),
    onSuccess: () => {
      toast.success(editingProfile ? 'Profile updated' : 'Profile created')
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
      setShowModal(false)
      resetForm()
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || 'Could not save profile'
      toast.error(msg)
    },
  })

  const handleSave = () => {
    if (!form.name.trim()) return toast.error('Name is required')
    if (!form.provisionKey.trim()) return toast.error('Provision key is required')
    const rows = parseInt(form.templateRows) || 4
    const cols = parseInt(form.templateCols) || 6

    saveMutation.mutate({
      name: form.name.trim(),
      provisionKey: form.provisionKey.trim(),
      provisionSecret: form.provisionSecret.trim() || null,
      mode: form.mode,
      templateRows: rows,
      templateCols: cols,
      templateSizes: form.templateSizes,
      mcpDevices: form.mcpDevices.map(d => ({
        bus: d.bus,
        address: d.address,
        role: d.role,
        name: d.name || undefined,
      })),
    })
  }

  // --- Columns ---
  const columns: Column<ProvisionProfile>[] = [
    {
      key: 'name',
      header: 'Name',
      width: '180px',
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: 'provisionKey',
      header: 'Key',
      width: '160px',
      render: (row) => (
        <code className="text-xs bg-surface-elevated px-2 py-0.5 rounded text-text-secondary">{row.provisionKey}</code>
      ),
    },
    {
      key: 'mode',
      header: 'Mode',
      width: '140px',
      render: (row) => (
        <Badge variant={row.mode === 'ALLOW_NEW' ? 'success' : 'warning'}>
          {modeLabels[row.mode]}
        </Badge>
      ),
    },
    {
      key: 'template',
      header: 'Template',
      width: '120px',
      render: (row) => (
        <span className="text-sm text-text-secondary">{row.templateRows}×{row.templateCols}</span>
      ),
    },
    {
      key: 'mcpDevices',
      header: 'MCP',
      width: '60px',
      render: (row) => <span>{row.mcpDevices.length}</span>,
    },
    {
      key: 'cabinetCount',
      header: 'Cabinets',
      width: '90px',
      render: (row) => <span>{row.cabinetCount}</span>,
    },
    {
      key: 'isActive',
      header: 'Status',
      width: '90px',
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'muted'} dot>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '48px',
      render: (row) => (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="p-1 rounded hover:bg-surface-elevated transition-colors cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4 text-text-muted" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="bg-surface border border-border rounded-lg shadow-xl p-1 min-w-36 z-50" align="end">
              <DropdownMenu.Item
                onClick={() => { setDetailProfile(row); setShowDetailModal(true) }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary rounded-md cursor-pointer hover:bg-surface-elevated outline-none"
              >
                View
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => openEdit(row)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary rounded-md cursor-pointer hover:bg-surface-elevated outline-none"
              >
                <Pencil className="h-4 w-4" /> Edit
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-border my-1" />
              <DropdownMenu.Item
                onClick={() => deleteMutation.mutate(row.id)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-error rounded-md cursor-pointer hover:bg-error/10 outline-none"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      ),
    },
  ]

  // --- Render ---
  if (id) {
    // Detail view
    if (!detailProfile) {
      return (
        <div className="space-y-4 animate-fade-in">
          <Button variant="ghost" onClick={() => navigate('/profiles')}>
            <ArrowLeft className="h-4 w-4" /> Back to profiles
          </Button>
          <p className="text-sm text-text-muted">Loading...</p>
        </div>
      )
    }

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/profiles')} className="p-2 rounded-lg hover:bg-surface-elevated transition-colors cursor-pointer">
              <ArrowLeft className="h-4 w-4 text-text-secondary" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">{detailProfile.name}</h2>
              <p className="text-sm text-text-secondary">{detailProfile.provisionKey}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => openEdit(detailProfile)}>
              <Pencil className="h-4 w-4" /> Edit
            </Button>
            <Button variant="danger" size="sm" loading={deleteMutation.isPending} onClick={() => deleteMutation.mutate(detailProfile.id)}>
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Name', value: detailProfile.name },
            { label: 'Provision Key', value: detailProfile.provisionKey },
            { label: 'Mode', value: <Badge variant={detailProfile.mode === 'ALLOW_NEW' ? 'success' : 'warning'}>{modeLabels[detailProfile.mode]}</Badge> },
            { label: 'Status', value: <Badge variant={detailProfile.isActive ? 'success' : 'muted'} dot>{detailProfile.isActive ? 'Active' : 'Inactive'}</Badge> },
            { label: 'Template', value: `${detailProfile.templateRows} rows × ${detailProfile.templateCols} cols` },
            { label: 'MCP Devices', value: detailProfile.mcpDevices.length.toString() },
            { label: 'Cabinets', value: detailProfile.cabinetCount.toString() },
            { label: 'Created', value: new Date(detailProfile.createdAt).toLocaleDateString('vi-VN') },
          ].map((item, i) => {
            const tints = ['hover:bg-brand/5', 'hover:bg-info/5', 'hover:bg-success/5', 'hover:bg-warning/5', 'hover:bg-error/5', 'hover:bg-brand/5', 'hover:bg-info/5', 'hover:bg-success/5']
            return (
              <div key={item.label} className={`group bg-surface rounded-xl border border-border p-4 transition-colors ${tints[i]}`}>
                <p className="text-label text-text-muted uppercase mb-1.5">{item.label}</p>
                <p className="text-sm font-semibold text-text-primary">{item.value}</p>
              </div>
            )
          })}
        </div>

        {/* MCP Devices */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-text-primary">MCP Devices</h3>
          </div>
          <div className="space-y-2">
            {detailProfile.mcpDevices.map((device) => (
              <div key={device.id} className="flex items-center gap-4 px-4 py-3 bg-surface-elevated rounded-lg border border-border">
                <code className="text-xs text-brand font-mono font-semibold">0x{device.address.toString(16).toUpperCase().padStart(2, '0')}</code>
                <Badge variant={device.role === 'LOCK' ? 'error' : 'info'}>{device.role}</Badge>
                <span className="text-sm text-text-secondary">bus {device.bus}</span>
                {device.name && <span className="text-sm text-text-muted">{device.name}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Template Sizes Preview */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-text-primary">Template Layout</h3>
            <div className="flex gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-info/25 border border-info/50" /> Small</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-warning/25 border border-warning/50" /> Large</span>
            </div>
          </div>
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${detailProfile.templateCols}, 1fr)` }}
          >
            {detailProfile.templateSizes.flat().map((size, i) => (
              <div
                key={i}
                className={cn(
                  'h-12 rounded-xl border flex items-center justify-center text-xs font-bold',
                  size === 'SMALL' ? 'bg-info/10 border-info/40 text-info' : 'bg-warning/10 border-warning/40 text-warning'
                )}
              >
                {size === 'SMALL' ? 'S' : 'L'}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // List view
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Profiles</h2>
        <Button size="sm" onClick={() => { resetForm(); setShowModal(true) }}>
          <Plus className="h-4 w-4" /> New Profile
        </Button>
      </div>

      {provisioningConfig && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Strategy', value: provisioningConfig.strategy },
            { label: 'Global Key', value: provisioningConfig.provisionKey },
            { label: 'Secret', value: provisioningConfig.provisionSecret ? 'Configured' : 'Not set' },
            { label: 'Updated', value: configUpdatedLabel(provisioningConfig) },
          ].map((item) => (
            <div key={item.label} className="bg-surface rounded-xl border border-border p-4">
              <p className="text-label text-text-muted uppercase mb-1">{item.label}</p>
              <p className="text-sm font-semibold text-text-primary truncate">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <DataTable
          columns={columns}
          data={profiles}
          loading={isLoading}
          rowKey={(row) => row.id}
          onRowClick={(row) => navigate(`/profiles/${row.id}`)}
          emptyMessage="No profiles found. Create one to get started."
        />
      </div>

      {/* Profile Form Modal */}
      <Modal
        open={showModal}
        onOpenChange={(open) => { if (!open) { setShowModal(false); resetForm() } }}
        title={editingProfile ? 'Edit Profile' : 'New Profile'}
        size="lg"
      >
        <div className="space-y-5 max-h-[80vh] overflow-y-auto pr-1">
          {/* Basic info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-text-primary border-b border-border pb-2">Basic Info</h4>
            <Input
              label="Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="VD: SmartBox-24-v1"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Provision Key *"
                value={form.provisionKey}
                onChange={(e) => setForm({ ...form, provisionKey: e.target.value })}
                placeholder="VD: smartbox-24-prod"
              />
              <Input
                label="Provision Secret"
                value={form.provisionSecret}
                onChange={(e) => setForm({ ...form, provisionSecret: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <Select
              label="Mode"
              value={form.mode}
              onValueChange={(v) => setForm({ ...form, mode: v as ProvisionProfile['mode'] })}
              options={[
                { value: 'ALLOW_NEW', label: 'Allow New — Pi tự tạo cabinet' },
                { value: 'CHECK_EXISTING', label: 'Check Existing — Admin pre-tạo cabinet' },
              ]}
            />
          </div>

          {/* Template definition */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text-primary border-b border-border pb-2">Template Layout</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Rows"
                type="number"
                min={1}
                max={10}
                value={form.templateRows}
                onChange={(e) => handleTemplateRowsChange(e.target.value)}
                onBlur={handleMatrixResize}
              />
              <Input
                label="Cols"
                type="number"
                min={1}
                max={10}
                value={form.templateCols}
                onChange={(e) => handleTemplateColsChange(e.target.value)}
                onBlur={handleMatrixResize}
              />
            </div>

            {/* Template sizes grid editor */}
            <div>
              <p className="text-sm font-medium text-text-secondary mb-3">
                Click each cell to toggle size
              </p>
              <div
                className="grid gap-1.5"
                style={{ gridTemplateColumns: `repeat(${parseInt(form.templateCols) || 6}, 1fr)` }}
              >
                {form.templateSizes.map((row, r) =>
                  row.map((cell, c) => (
                    <button
                      key={`${r}-${c}`}
                      type="button"
                      onClick={() => {
                        const sizes = form.templateSizes.map((rowArr) => [...rowArr])
                        sizes[r][c] = sizes[r][c] === 'SMALL' ? 'LARGE' : 'SMALL'
                        setForm({ ...form, templateSizes: sizes })
                      }}
                      className={cn(
                        'h-11 rounded-xl border text-xs font-bold flex items-center justify-center cursor-pointer transition-all duration-100',
                        'hover:scale-105 hover:shadow-md',
                        cell === 'SMALL'
                          ? 'bg-info/10 border-info/50 text-info'
                          : 'bg-warning/10 border-warning/50 text-warning'
                      )}
                    >
                      {cell === 'SMALL' ? 'S' : 'L'}
                    </button>
                  ))
                )}
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-4 text-xs text-text-muted">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-info/25 border border-info/50" /> Small</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-warning/25 border border-warning/50" /> Large</span>
                </div>
                <p className="text-xs text-text-muted font-mono">
                  {form.templateSizes.flat().filter(s => s === 'SMALL').length}S / {form.templateSizes.flat().filter(s => s === 'LARGE').length}L
                </p>
              </div>
            </div>
          </div>

          {/* MCP Devices */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h4 className="text-sm font-semibold text-text-primary">MCP Devices</h4>
              <button
                type="button"
                onClick={addMcpDevice}
                className="text-xs font-medium text-brand hover:text-brand-hover cursor-pointer transition-colors"
              >
                + Add device
              </button>
            </div>
            {form.mcpDevices.length === 0 && (
              <p className="text-sm text-text-muted">No MCP devices. Click "+ Add device" to add one.</p>
            )}
            <div className="space-y-2">
              {form.mcpDevices.map((device, i) => (
                <div key={i} className="grid grid-cols-[80px_100px_100px_1fr_auto] gap-2 items-end">
                  <Input
                    label="Bus"
                    type="number"
                    min={0}
                    value={String(device.bus)}
                    onChange={(e) => updateMcpDevice(i, 'bus', e.target.value)}
                  />
                  <Input
                    label="Address"
                    value={'0x' + device.address.toString(16).toUpperCase().padStart(2, '0')}
                    onChange={(e) => {
                      const val = e.target.value.replace('0x', '').replace('0X', '')
                      updateMcpDevice(i, 'address', parseInt(val, 16) || 0)
                    }}
                    placeholder="0x20"
                  />
                  <Select
                    label="Role"
                    value={device.role}
                    onValueChange={(v) => updateMcpDevice(i, 'role', v)}
                    options={[
                      { value: 'SENSOR', label: 'SENSOR' },
                      { value: 'LOCK', label: 'LOCK' },
                    ]}
                  />
                  <Input
                    label="Name"
                    value={device.name ?? ''}
                    onChange={(e) => updateMcpDevice(i, 'name', e.target.value)}
                    placeholder="Optional"
                  />
                  {form.mcpDevices.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMcpDevice(i)}
                      className="mb-1 p-2 text-error hover:bg-error/10 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <Button variant="ghost" onClick={() => { setShowModal(false); resetForm() }}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saveMutation.isPending}>
              {editingProfile ? 'Save changes' : 'Create Profile'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal (quick view from list) */}
      <Modal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        title={detailProfile?.name ?? 'Profile'}
        size="sm"
      >
        {detailProfile && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-elevated rounded-lg p-3">
                <p className="text-label text-text-muted uppercase mb-1.5">Key</p>
                <code className="text-xs font-mono text-brand">{detailProfile.provisionKey}</code>
              </div>
              <div className="bg-surface-elevated rounded-lg p-3">
                <p className="text-label text-text-muted uppercase mb-1.5">Mode</p>
                <Badge variant={detailProfile.mode === 'ALLOW_NEW' ? 'success' : 'warning'}>
                  {modeLabels[detailProfile.mode]}
                </Badge>
              </div>
            </div>
            <div className="bg-surface-elevated rounded-lg p-3">
              <p className="text-label text-text-muted uppercase mb-1.5">Template</p>
              <p className="text-sm font-semibold">{detailProfile.templateRows} × {detailProfile.templateCols}</p>
            </div>
            <div className="bg-surface-elevated rounded-lg p-3">
              <p className="text-label text-text-muted uppercase mb-2">MCP Devices</p>
              <div className="space-y-1.5">
                {detailProfile.mcpDevices.map(d => (
                  <div key={d.id} className="flex items-center gap-2 text-sm">
                    <code className="text-xs font-mono text-brand">0x{d.address.toString(16).toUpperCase().padStart(2, '0')}</code>
                    <Badge variant={d.role === 'LOCK' ? 'error' : 'info'}>{d.role}</Badge>
                    <span className="text-text-muted">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <Button variant="secondary" className="flex-1" onClick={() => { setShowDetailModal(false); navigate(`/profiles/${detailProfile.id}`) }}>
                View full details
              </Button>
              <Button variant="ghost" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
