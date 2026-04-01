import { useState } from "react";
import type { FlexProps } from "@mantine/core";
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
  Package,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowDownToLine,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LOCKER_SIZE_LABELS, LOCKER_SIZE_PRICES, LOCKER_SIZE_COLORS } from "../types";
import type { LockerSize } from "../types";

type Step = "phone" | "size" | "otp" | "confirm";

const STEP_ORDER: Step[] = ["phone", "size", "otp", "confirm"];

const SIZES: LockerSize[] = ["small", "medium", "large", "xlarge"];

export default function DepositScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [selectedSize, setSelectedSize] = useState<LockerSize | null>(null);
  const [, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [assignedLocker] = useState("L04");
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
    if (phone.length >= 9) {
      setStep("size");
    }
  };

  const handleSizeSelect = (size: LockerSize) => {
    setSelectedSize(size);
    setStep("otp");
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
    const map: Record<Step, { title: string; subtitle: string; icon: React.ReactNode }> = {
      phone: { title: "Gửi đồ", subtitle: "Nhập số điện thoại để tiếp tục", icon: <Smartphone size={20} color="#3b82f6" /> },
      size: { title: "Chọn kích thước", subtitle: "Chọn tủ phù hợp với kích thước đồ của bạn", icon: <Package size={20} color="#8b5cf6" /> },
      otp: { title: "Xác minh", subtitle: "Nhập mã OTP đã gửi đến số điện thoại của bạn", icon: <ShieldCheck size={20} color="#f59e0b" /> },
      confirm: { title: "Xác nhận gửi đồ", subtitle: "Kiểm tra thông tin trước khi gửi", icon: <CheckCircle2 size={20} color="#22c55e" /> },
    };
    return map[step];
  };

  const header = getHeaderProps();

  return (
    <ScreenContainer>
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
              background: "rgba(34,197,94,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 4,
            }}
          >
            <ArrowDownToLine size={16} color="#22c55e" />
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
                    ? (i === stepIndex ? "#3b82f6" : "#22c55e")
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
            <Text fw={600} size="sm" c="white" ta="center">Nhập số điện thoại</Text>
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

        {/* Size step */}
        {step === "size" && (
          <Flex direction="column" gap={10} align="center" mt={20}>
            <Text fw={600} size="sm" c="white">Kích thước tủ</Text>
            {SIZES.map((size) => (
              <Paper
                key={size}
                style={{
                  width: "100%",
                  maxWidth: 360,
                  background:
                    selectedSize === size
                      ? `${LOCKER_SIZE_COLORS[size]}20`
                      : "rgba(255,255,255,0.03)",
                  border: `1.5px solid ${LOCKER_SIZE_COLORS[size]}${selectedSize === size ? "CC" : "30"}`,
                  cursor: "pointer",
                  transition: "all 150ms ease",
                }}
                onClick={() => handleSizeSelect(size)}
                onMouseDown={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(0.98)")}
                onMouseUp={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
              >
                <Flex align="center" justify="space-between" p={12}>
                  <Flex align="center" gap={12}>
                    <Box
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: `${LOCKER_SIZE_COLORS[size]}20`,
                        border: `1px solid ${LOCKER_SIZE_COLORS[size]}40`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                    <Box>
                      <Text fw={600} size="sm" c="white">{LOCKER_SIZE_LABELS[size]}</Text>
                      <Text size="xs" c="dimmed">{LOCKER_SIZE_PRICES[size].toLocaleString("vi-VN")}đ / lần</Text>
                    </Box>
                  </Flex>
                    <Box
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: `2px solid ${LOCKER_SIZE_COLORS[size]}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {selectedSize === size && (
                        <Box style={{ width: 10, height: 10, borderRadius: "50%", background: LOCKER_SIZE_COLORS[size] }} />
                      )}
                    </Box>
                </Flex>
              </Paper>
            ))}
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
            {isLoading && (
              <Text size="xs" c="dimmed">Đang xác minh...</Text>
            )}
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
                {[
                  { label: "Số điện thoại", value: phone },
                  { label: "Kích thước", value: selectedSize ? LOCKER_SIZE_LABELS[selectedSize] : "" },
                  { label: "Tủ được gán", value: assignedLocker },
                  { label: "Phí dịch vụ", value: selectedSize ? `${LOCKER_SIZE_PRICES[selectedSize].toLocaleString("vi-VN")}đ` : "" },
                ].map((row) => (
                  <Flex key={row.label} justify="space-between" align="center">
                    <Text size="xs" c="dimmed">{row.label}</Text>
                    <Text size="sm" fw={600} c="white">{row.value}</Text>
                  </Flex>
                ))}
                <Box style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
                <Flex justify="space-between" align="center">
                  <Text size="sm" fw={600} c="white">Tổng cộng</Text>
                  <Text size="sm" fw={700} c="#22c55e">
                    {selectedSize ? LOCKER_SIZE_PRICES[selectedSize].toLocaleString("vi-VN") : "0"}đ
                  </Text>
                </Flex>
              </Flex>
            </Paper>

            <Flex gap={10} style={{ maxWidth: 360, width: "100%" }}>
              <Button
                variant="outline"
                color="gray"
                flex={1}
                onClick={goBack}
                size="md"
              >
                Hủy
              </Button>
              <Button
                color="green"
                flex={2}
                onClick={handleConfirm}
                loading={isLoading}
                size="md"
              >
                Xác nhận gửi đồ
              </Button>
            </Flex>
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
                background: "rgba(34,197,94,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "pulse 1s ease-in-out",
              }}
            >
              <CheckCircle2 size={40} color="#22c55e" />
            </Box>
            <Text fw={700} size="lg" c="white">Gửi đồ thành công!</Text>
            <Paper
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
                padding: "12px 24px",
              }}
            >
              <Flex align="center" gap={12}>
                <Box>
                  <Text size="xs" c="dimmed">Mở tủ</Text>
                  <Text fw={700} size="xl" c="#22c55e">{assignedLocker}</Text>
                </Box>
                <Box style={{ width: 1, height: 40, background: "rgba(255,255,255,0.1)" }} />
                <Box>
                  <Text size="xs" c="dimmed">Mã giao dịch</Text>
                  <Text fw={500} size="sm" c="white">TX{NumericId()}</Text>
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

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </ScreenContainer>
  );
}

function NumericId() {
  return String(Math.floor(Math.random() * 90000 + 10000));
}

function ScreenContainer({ children }: FlexProps) {
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
      {children}
    </Box>
  );
}
