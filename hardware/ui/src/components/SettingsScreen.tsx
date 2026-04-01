import { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Button,
  Paper,
  Switch,
  Select,
} from "@mantine/core";
import {
  ArrowLeft,
  Settings,
  Wifi,
  WifiOff,
  Monitor,
  Moon,
  Sun,
  RefreshCw,
  Volume2,
  VolumeX,
  Clock,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SettingsScreen() {
  const navigate = useNavigate();
  const [networkEnabled, setNetworkEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [screenBrightness, setScreenBrightness] = useState("80");
  const [autoLogout, setAutoLogout] = useState("60");
  const [language, setLanguage] = useState("vi");
  const [lockerId] = useState("SB-001-HN");
  const [ipAddress] = useState("192.168.1.100");
  const [macAddress] = useState("AA:BB:CC:DD:EE:FF");
  const [firmwareVersion] = useState("v1.2.3");
  const [uptime] = useState("7 ngày 14 giờ 32 phút");

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
            <Settings size={14} color="#94a3b8" />
          </Box>
          <Text fw={700} size="sm" c="white">Cài đặt hệ thống</Text>
        </Flex>
      </Box>

      {/* Body */}
      <Box style={{ flex: 1, overflow: "auto", padding: "12px 16px" }}>
        {/* Network */}
        <SettingSection title="Kết nối mạng" icon={<Wifi size={14} />}>
          <SettingRow
            label="WiFi"
            description={networkEnabled ? "Đã kết nối — SmartBox_WiFi" : "Đã tắt"}
          >
            <Switch
              checked={networkEnabled}
              onChange={(e) => setNetworkEnabled(e.currentTarget.checked)}
              size="sm"
              color="green"
              onLabel={<Wifi size={12} />}
              offLabel={<WifiOff size={12} />}
            />
          </SettingRow>
          <SettingRow label="Địa chỉ IP" description={ipAddress}>
            <Text size="xs" c="dimmed">{ipAddress}</Text>
          </SettingRow>
          <SettingRow label="MAC Address" description={macAddress}>
            <Text size="xs" c="dimmed">{macAddress}</Text>
          </SettingRow>
        </SettingSection>

        {/* Display */}
        <SettingSection title="Màn hình" icon={<Monitor size={14} />}>
          <SettingRow label="Độ sáng" description={`${screenBrightness}%`}>
            <Flex align="center" gap={8} style={{ width: 140 }}>
              <Moon size={12} color="#94a3b8" />
              <input
                type="range"
                min="20"
                max="100"
                value={screenBrightness}
                onChange={(e) => setScreenBrightness(e.target.value)}
                style={{
                  flex: 1,
                  accentColor: "#3b82f6",
                  cursor: "pointer",
                }}
              />
              <Sun size={12} color="#94a3b8" />
            </Flex>
          </SettingRow>
          <SettingRow label="Tự động đóng màn hình" description={`${autoLogout} giây`}>
            <Select
              value={autoLogout}
              onChange={(v) => v && setAutoLogout(v)}
              data={[
                { value: "30", label: "30 giây" },
                { value: "60", label: "1 phút" },
                { value: "120", label: "2 phút" },
                { value: "300", label: "5 phút" },
                { value: "0", label: "Không tắt" },
              ]}
              size="xs"
              styles={{
                input: {
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                  width: 100,
                },
              }}
            />
          </SettingRow>
        </SettingSection>

        {/* Sound */}
        <SettingSection title="Âm thanh" icon={<Volume2 size={14} />}>
          <SettingRow label="Âm thanh thông báo" description="Phát âm thanh khi có sự kiện">
            <Switch
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.currentTarget.checked)}
              size="sm"
              color="green"
              onLabel={<Volume2 size={12} />}
              offLabel={<VolumeX size={12} />}
            />
          </SettingRow>
          <SettingRow label="Thông báo hệ thống" description="Hiển thị thông báo trên màn hình">
            <Switch
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.currentTarget.checked)}
              size="sm"
              color="green"
            />
          </SettingRow>
        </SettingSection>

        {/* System */}
        <SettingSection title="Hệ thống" icon={<Shield size={14} />}>
          <SettingRow label="Mã thiết bị" description="ID duy nhất của tủ">
            <Text size="xs" c="#3b82f6" fw={500}>{lockerId}</Text>
          </SettingRow>
          <SettingRow label="Phiên bản firmware" description="Phần mềm hệ thống">
            <Text size="xs" c="dimmed">{firmwareVersion}</Text>
          </SettingRow>
          <SettingRow label="Thời gian hoạt động" description="Kể từ lần khởi động cuối">
            <Flex align="center" gap={4}>
              <Clock size={10} color="#94a3b8" />
              <Text size="xs" c="dimmed">{uptime}</Text>
            </Flex>
          </SettingRow>
          <SettingRow label="Ngôn ngữ" description="Ngôn ngữ giao diện">
            <Select
              value={language}
              onChange={(v) => v && setLanguage(v)}
              data={[
                { value: "vi", label: "Tiếng Việt" },
                { value: "en", label: "English" },
              ]}
              size="xs"
              styles={{
                input: {
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                  width: 120,
                },
              }}
            />
          </SettingRow>
        </SettingSection>
      </Box>

      {/* Footer Actions */}
      <Box
        style={{
          padding: "8px 16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <Flex gap={8}>
          <Button
            variant="outline"
            color="gray"
            size="sm"
            leftSection={<RefreshCw size={14} />}
            flex={1}
          >
            Khởi động lại
          </Button>
          <Button
            variant="outline"
            color="yellow"
            size="sm"
            leftSection={<Shield size={14} />}
            flex={1}
          >
            Cập nhật firmware
          </Button>
          <Button
            variant="filled"
            color="gray"
            size="sm"
            onClick={() => navigate("/")}
          >
            Quay về
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

function SettingSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Paper
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        marginBottom: 10,
      }}
    >
      <Flex align="center" gap={8} style={{ padding: "10px 12px 6px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <Box style={{ color: "#94a3b8" }}>{icon}</Box>
        <Text size="xs" fw={600} c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>{title}</Text>
      </Flex>
      <Box style={{ padding: "6px 12px 8px" }}>{children}</Box>
    </Paper>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Flex
      justify="space-between"
      align="center"
      style={{
        padding: "7px 0",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
      }}
    >
      <Box>
        <Text size="xs" fw={500} c="white">{label}</Text>
        {description && <Text size="xxs" c="dimmed">{description}</Text>}
      </Box>
      <Box>{children}</Box>
    </Flex>
  );
}
