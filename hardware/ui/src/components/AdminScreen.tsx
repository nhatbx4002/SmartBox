import { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Button,
  SimpleGrid,
  Paper,
  Badge,
  ActionIcon,
  Tabs,
} from "@mantine/core";
import {
  ArrowLeft,
  LayoutDashboard,
  Wrench,
  History,
  AlertTriangle,
  Wifi,
  RefreshCw,
  DollarSign,
  Package,
  ArrowUpFromLine,
  Lock,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateLockers, mockTransactions, getStats } from "../data";
import { LOCKER_SIZE_LABELS, LOCKER_SIZE_COLORS } from "../types";
import type { Locker } from "../types";

const STATUS_COLORS: Record<Locker["status"], string> = {
  available: "#22c55e",
  occupied: "#3b82f6",
  reserved: "#f59e0b",
  maintenance: "#94a3b8",
  error: "#ef4444",
};

const STATUS_LABELS: Record<Locker["status"], string> = {
  available: "Trống",
  occupied: "Đã gửi",
  reserved: "Đặt trước",
  maintenance: "Bảo trì",
  error: "Lỗi",
};

export default function AdminScreen() {
  const navigate = useNavigate();
  const [lockers] = useState(generateLockers());
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const stats = getStats(lockers);

  return (
    <Box
      style={{
        width: 800,
        height: 480,
        background: "linear-gradient(180deg, #0f1117 0%, #161b27 100%)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box style={{ padding: "10px 16px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <Flex align="center" gap={10}>
          <Button
            variant="subtle"
            color="gray"
            size="sm"
            leftSection={<ArrowLeft size={18} />}
            onClick={() => navigate("/")}
            styles={{ root: { padding: "4px 8px", minWidth: "auto" } }}
          >
            Quay lại
          </Button>
          <Box
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(148,163,184,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 4,
            }}
          >
            <Wrench size={14} color="#94a3b8" />
          </Box>
          <Text fw={700} size="sm" c="white">Quản trị hệ thống</Text>
          <Box style={{ flex: 1 }} />
          <Badge
            size="sm"
            variant="dot"
            color="green"
            leftSection={<Wifi size={10} />}
            c="white"
            style={{ border: "none" }}
          >
            Online
          </Badge>
        </Flex>
      </Box>

      {/* Body */}
      <Box style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Tabs
          defaultValue="lockers"
          variant="pills"
          styles={{
            root: { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" },
            panel: { flex: 1, overflow: "auto", padding: "8px 16px" },
            list: { padding: "4px 16px 0", flexShrink: 0 },
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="lockers" leftSection={<LayoutDashboard size={14} />} c="white">
              Tủ đồ
            </Tabs.Tab>
            <Tabs.Tab value="alerts" leftSection={<AlertTriangle size={14} />} c="white">
              Cảnh báo
            </Tabs.Tab>
            <Tabs.Tab value="history" leftSection={<History size={14} />} c="white">
              Lịch sử
            </Tabs.Tab>
          </Tabs.List>

          {/* Locker Management */}
          <Tabs.Panel value="lockers">
            <Flex gap={12} style={{ height: "100%" }}>
              {/* Locker Grid */}
              <Box style={{ flex: 2 }}>
                <Flex justify="space-between" align="center" mb={6}>
                  <Text size="xs" fw={600} c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>
                    Quản lý tủ ({lockers.length})
                  </Text>
                  <Flex gap={6}>
                    {[
                      { color: "#22c55e", label: "Trống", count: stats.available },
                      { color: "#3b82f6", label: "Đã gửi", count: stats.occupied },
                      { color: "#f59e0b", label: "Đặt trước", count: stats.reserved },
                      { color: "#ef4444", label: "Lỗi", count: stats.error + stats.maintenance },
                    ].map((item) => (
                      <Flex key={item.label} align="center" gap={3}>
                        <Box style={{ width: 6, height: 6, borderRadius: "50%", background: item.color }} />
                        <Text size="xs" c="dimmed">{item.count}</Text>
                      </Flex>
                    ))}
                  </Flex>
                </Flex>
                <SimpleGrid cols={6} spacing={5}>
                  {lockers.map((locker) => (
                    <LockerAdminCell
                      key={locker.id}
                      locker={locker}
                      isSelected={selectedLocker?.id === locker.id}
                      onClick={() => setSelectedLocker(locker)}
                    />
                  ))}
                </SimpleGrid>
              </Box>

              {/* Detail Panel */}
              <Box style={{ flex: 1, minWidth: 180 }}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb={6} style={{ letterSpacing: 1 }}>
                  Chi tiết
                </Text>
                {selectedLocker ? (
                  <Paper
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                    p={12}
                  >
                    <Flex direction="column" gap={10}>
                      <Flex justify="space-between" align="center">
                        <Text fw={700} size="md" c="white">{selectedLocker.id}</Text>
                        <Badge
                          size="sm"
                          style={{
                            background: `${STATUS_COLORS[selectedLocker.status]}20`,
                            border: `1px solid ${STATUS_COLORS[selectedLocker.status]}40`,
                            color: STATUS_COLORS[selectedLocker.status],
                          }}
                        >
                          {STATUS_LABELS[selectedLocker.status]}
                        </Badge>
                      </Flex>
                      <Box>
                        <Text size="xs" c="dimmed">Kích thước</Text>
                        <Text size="sm" c="white">{LOCKER_SIZE_LABELS[selectedLocker.size]}</Text>
                      </Box>
                      {selectedLocker.status === "occupied" && (
                        <>
                          <Box>
                            <Text size="xs" c="dimmed">SĐT khách</Text>
                            <Text size="sm" c="white">{selectedLocker.occupantPhone}</Text>
                          </Box>
                          <Box>
                            <Text size="xs" c="dimmed">Mã kiện</Text>
                            <Text size="sm" c="white">{selectedLocker.packageId}</Text>
                          </Box>
                        </>
                      )}
                      <Box style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
                      <Flex gap={6}>
                        <Button
                          variant="light"
                          color="gray"
                          size="xs"
                          leftSection={<RefreshCw size={12} />}
                          flex={1}
                        >
                          Làm mới
                        </Button>
                        <ActionIcon
                          variant="light"
                          color={selectedLocker.status === "maintenance" ? "green" : "yellow"}
                          size="lg"
                          title={selectedLocker.status === "maintenance" ? "Bật tủ" : "Bảo trì"}
                        >
                          {selectedLocker.status === "maintenance" ? (
                            <Lock size={14} />
                          ) : (
                            <Wrench size={14} />
                          )}
                        </ActionIcon>
                      </Flex>
                    </Flex>
                  </Paper>
                ) : (
                  <Paper
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px dashed rgba(255,255,255,0.1)",
                    }}
                    p={12}
                  >
                    <Text size="xs" c="dimmed" ta="center">Chọn tủ để xem chi tiết</Text>
                  </Paper>
                )}
              </Box>
            </Flex>
          </Tabs.Panel>

          {/* Alerts */}
          <Tabs.Panel value="alerts">
            <Flex direction="column" gap={8}>
              {[
                { locker: "L12", type: "error", message: "Cảm biến cửa không hoạt động", time: "2 phút trước" },
                { locker: "L10", type: "warning", message: "Pin dự phòng yếu (23%)", time: "15 phút trước" },
                { locker: "L07", type: "info", message: "Tủ mở quá 5 phút chưa đóng", time: "1 giờ trước" },
                { locker: "L03", type: "info", message: "Mất kết nối mạng LAN", time: "2 giờ trước" },
              ].map((alert, i) => (
                <Paper
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${alert.type === "error" ? "rgba(239,68,68,0.2)" : alert.type === "warning" ? "rgba(245,158,11,0.2)" : "rgba(59,130,246,0.2)"}`,
                  }}
                  p={10}
                >
                  <Flex align="center" gap={10}>
                    <AlertTriangle
                      size={16}
                      color={alert.type === "error" ? "#ef4444" : alert.type === "warning" ? "#f59e0b" : "#3b82f6"}
                    />
                    <Box style={{ flex: 1 }}>
                      <Text size="xs" fw={500} c="white">
                        {alert.locker} — {alert.message}
                      </Text>
                      <Text size="xxs" c="dimmed">{alert.time}</Text>
                    </Box>
                    <ActionIcon variant="subtle" color="gray" size="sm">
                      <XCircle size={14} color="#94a3b8" />
                    </ActionIcon>
                  </Flex>
                </Paper>
              ))}
            </Flex>
          </Tabs.Panel>

          {/* History */}
          <Tabs.Panel value="history">
            <Flex direction="column" gap={6}>
              {mockTransactions.map((tx) => (
                <Paper
                  key={tx.id}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  p={10}
                >
                  <Flex align="center" gap={10}>
                    <Box
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: tx.type === "deposit"
                          ? "rgba(34,197,94,0.15)"
                          : "rgba(59,130,246,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {tx.type === "deposit" ? (
                        <Package size={14} color="#22c55e" />
                      ) : (
                        <ArrowUpFromLine size={14} color="#3b82f6" />
                      )}
                    </Box>
                    <Box style={{ flex: 1 }}>
                      <Flex align="center" gap={6}>
                        <Text size="xs" fw={600} c="white">{tx.id}</Text>
                        <Badge
                          size="xys"
                          style={{
                            background: `${tx.status === "success" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)"}`,
                            color: tx.status === "success" ? "#22c55e" : "#ef4444",
                            border: "none",
                          }}
                        >
                          {tx.status === "success" ? "Thành công" : "Thất bại"}
                        </Badge>
                      </Flex>
                      <Text size="xxs" c="dimmed">
                        {tx.phone} · Tủ {tx.lockerId} · {LOCKER_SIZE_LABELS[tx.size]}
                      </Text>
                    </Box>
                    <Text size="xxs" c="dimmed">
                      {tx.time.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                    </Text>
                  </Flex>
                </Paper>
              ))}
            </Flex>
          </Tabs.Panel>
        </Tabs>
      </Box>

      {/* Bottom Stats Bar */}
      <Box
        style={{
          padding: "6px 16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <Flex gap={16} align="center">
          {[
            { icon: <Package size={12} />, label: "Giao hôm nay", value: stats.deliveriesToday },
            { icon: <ArrowUpFromLine size={12} />, label: "Nhận hôm nay", value: stats.pickupsToday },
            { icon: <DollarSign size={12} />, label: "Doanh thu", value: `${stats.revenueToday.toLocaleString("vi-VN")}đ` },
          ].map((item) => (
            <Flex key={item.label} align="center" gap={5}>
              <Box style={{ color: "#94a3b8" }}>{item.icon}</Box>
              <Text size="xs" c="dimmed">{item.label}:</Text>
              <Text size="xs" fw={600} c="white">{item.value}</Text>
            </Flex>
          ))}
          <Box style={{ flex: 1 }} />
          <Text size="xs" c="dimmed">
            CPU 23% · RAM 512MB · WiFi Strong
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}

function LockerAdminCell({
  locker,
  isSelected,
  onClick,
}: {
  locker: Locker;
  isSelected: boolean;
  onClick: () => void;
}) {
  const statusColor = STATUS_COLORS[locker.status];

  return (
    <Paper
      style={{
        background: isSelected
          ? `${statusColor}20`
          : locker.status === "error" || locker.status === "maintenance"
          ? "rgba(239,68,68,0.05)"
          : "rgba(255,255,255,0.03)",
        border: `1.5px solid ${isSelected ? statusColor : `${statusColor}20`}`,
        cursor: "pointer",
        transition: "all 150ms ease",
        position: "relative",
      }}
      onClick={onClick}
      onMouseDown={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(0.95)")}
      onMouseUp={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
    >
      <Box
        style={{
          position: "absolute",
          top: 3,
          right: 3,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: statusColor,
          boxShadow: `0 0 5px ${statusColor}`,
        }}
      />
      <Flex direction="column" align="center" justify="center" py={8} px={4}>
        <Box
          style={{
            width: 22,
            height: 22,
            borderRadius: 4,
            background: `${LOCKER_SIZE_COLORS[locker.size]}20`,
            border: `1px solid ${LOCKER_SIZE_COLORS[locker.size]}40`,
            marginBottom: 4,
          }}
        />
        <Text fw={700} size="xs" c="white">{locker.id}</Text>
        <Text size="xxs" c="dimmed" style={{ textTransform: "capitalize" }}>
          {locker.size}
        </Text>
      </Flex>
    </Paper>
  );
}
