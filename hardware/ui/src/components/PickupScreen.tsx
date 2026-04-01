import { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Button,
  TextInput,
  PinInput,
  Paper,
} from "@mantine/core";
import {
  ArrowLeft,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowUpFromLine,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Step = "phone" | "otp" | "confirm";

const STEP_ORDER: Step[] = ["phone", "otp", "confirm"];

export default function PickupScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [assignedLocker] = useState("L06");
  const stepIndex = STEP_ORDER.indexOf(step);

  const goBack = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setStep(STEP_ORDER[prevIndex]);
    } else {
      navigate("/");
    }
  };

  const handlePhoneSubmit = () => {
    if (phone.length >= 9) setStep("otp");
  };

  const handleOtpComplete = async (value: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setOtp(value);
    setIsLoading(false);
    setStep("confirm");
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);
    setIsSuccess(true);
  };

  const getHeaderProps = () => {
    const map: Record<Step, { title: string; subtitle: string }> = {
      phone: { title: "Nhận đồ", subtitle: "Nhập số điện thoại đã sử dụng khi gửi" },
      otp: { title: "Xác minh", subtitle: "Nhập mã OTP để xác nhận nhận đồ" },
      confirm: { title: "Mở tủ lấy đồ", subtitle: "Kiểm tra và xác nhận thông tin" },
    };
    return map[step];
  };

  const header = getHeaderProps();

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
      <Box style={{ padding: "12px 16px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <Flex align="center" gap={10}>
          <Button
            variant="subtle"
            color="gray"
            size="sm"
            leftSection={<ArrowLeft size={18} />}
            onClick={goBack}
            styles={{ root: { padding: "4px 8px", minWidth: "auto" } }}
          >
            Quay lại
          </Button>
          <Box
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(59,130,246,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 4,
            }}
          >
            <ArrowUpFromLine size={16} color="#3b82f6" />
          </Box>
          <Text fw={700} size="sm" c="white">{header.title}</Text>
        </Flex>
      </Box>

      {/* Step indicator */}
      <Box style={{ padding: "8px 16px 0", flexShrink: 0 }}>
        <Flex gap={4} align="center">
          {STEP_ORDER.map((s, i) => (
            <Box key={s} style={{ flex: 1, display: "flex", alignItems: "center", gap: 4 }}>
              <Box
                style={{
                  height: 3,
                  flex: 1,
                  borderRadius: 2,
                  background: i <= stepIndex
                    ? i === stepIndex ? "#3b82f6" : "#22c55e"
                    : "rgba(255,255,255,0.1)",
                  transition: "background 300ms ease",
                }}
              />
              {i < STEP_ORDER.length - 1 && (
                <Box
                  style={{
                    height: 3,
                    flex: 1,
                    borderRadius: 2,
                    background: i < stepIndex ? "#22c55e" : "rgba(255,255,255,0.1)",
                    transition: "background 300ms ease",
                  }}
                />
              )}
            </Box>
          ))}
        </Flex>
      </Box>

      {/* Content */}
      <Box style={{ padding: "16px", flex: 1, overflow: "auto" }}>
        {/* Phone step */}
        {step === "phone" && (
          <Flex direction="column" align="center" gap={16} mt={40}>
            <Box
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(59,130,246,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Smartphone size={32} color="#3b82f6" />
            </Box>
            <Text fw={600} size="sm" c="white" ta="center">
              Nhập số điện thoại
            </Text>
            <TextInput
              placeholder="0901234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              size="lg"
              maxLength={11}
              styles={{
                input: {
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                  textAlign: "center",
                  fontSize: 20,
                  width: 240,
                },
              }}
              onKeyDown={(e) => e.key === "Enter" && handlePhoneSubmit()}
            />
            <Button
              size="lg"
              disabled={phone.length < 9}
              onClick={handlePhoneSubmit}
              fullWidth
              style={{ maxWidth: 240 }}
              onMouseDown={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(0.98)")}
              onMouseUp={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
            >
              Tiếp tục
            </Button>
          </Flex>
        )}

        {/* OTP step */}
        {step === "otp" && (
          <Flex direction="column" align="center" gap={16} mt={40}>
            <Box
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(245,158,11,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck size={32} color="#f59e0b" />
            </Box>
            <Text fw={600} size="sm" c="white" ta="center">
              Mã OTP đã gửi đến
            </Text>
            <Text size="sm" c="#3b82f6" fw={500}>{phone}</Text>
            <PinInput
              length={6}
              type="number"
              oneTimeCode
              size="lg"
              styles={{
                input: {
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                  fontSize: 20,
                },
              }}
              onComplete={handleOtpComplete}
            />
            {isLoading && <Text size="xs" c="dimmed">Đang xác minh...</Text>}
          </Flex>
        )}

        {/* Confirm step */}
        {step === "confirm" && !isSuccess && (
          <Flex direction="column" align="center" gap={16} mt={20}>
            <Paper
              style={{
                width: "100%",
                maxWidth: 360,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              p={16}
            >
              <Flex direction="column" gap={10}>
                <Flex justify="space-between" align="center">
                  <Text size="xs" c="dimmed">Số điện thoại</Text>
                  <Text size="sm" fw={600} c="white">{phone}</Text>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text size="xs" c="dimmed">Mã giao dịch</Text>
                  <Text size="sm" fw={600} c="white">TX003</Text>
                </Flex>
                <Box style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
                <Flex justify="space-between" align="center">
                  <Text size="sm" fw={600} c="white">Tủ cần mở</Text>
                  <Text size="sm" fw={700} c="#3b82f6">{assignedLocker}</Text>
                </Flex>
              </Flex>
            </Paper>

            <Button
              color="blue"
              size="lg"
              onClick={handleConfirm}
              loading={isLoading}
              fullWidth
              style={{ maxWidth: 360 }}
              onMouseDown={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(0.98)")}
              onMouseUp={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
            >
              Mở tủ và nhận đồ
            </Button>
          </Flex>
        )}

        {/* Success */}
        {isSuccess && (
          <Flex direction="column" align="center" gap={16} mt={40}>
            <Box
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(59,130,246,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircle2 size={40} color="#3b82f6" />
            </Box>
            <Text fw={700} size="lg" c="white">Nhận đồ thành công!</Text>
            <Paper
              style={{
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
                padding: "12px 24px",
              }}
            >
              <Flex align="center" gap={12}>
                <Box>
                  <Text size="xs" c="dimmed">Mở tủ</Text>
                  <Text fw={700} size="xl" c="#3b82f6">{assignedLocker}</Text>
                </Box>
                <Box style={{ width: 1, height: 40, background: "rgba(255,255,255,0.1)" }} />
                <Box>
                  <Text size="xs" c="dimmed">Mã giao dịch</Text>
                  <Text fw={500} size="sm" c="white">TX003</Text>
                </Box>
              </Flex>
            </Paper>
            <Flex align="center" gap={6}>
              <Clock size={14} color="#94a3b8" />
              <Text size="xs" c="dimmed">Tự động đóng sau 30 giây</Text>
            </Flex>
            <Button
              variant="light"
              color="gray"
              onClick={() => navigate("/")}
              size="md"
            >
              Quay về màn hình chính
            </Button>
          </Flex>
        )}
      </Box>
    </Box>
  );
}
