import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FAQItem {
  id: string;
  question: string;
  answer: string[];
}

const FAQ_DATA: Record<string, FAQItem> = {
  "open-locker": {
    id: "open-locker",
    question: "Làm thế nào để nhận tủ và mở cửa tủ?",
    answer: [
      "Thực hiện thanh toán thành công dịch vụ thuê tủ qua ứng dụng.",
      "Hệ thống sẽ gửi mã PIN (OTP) 6 chữ số và mã QR truy cập trực tiếp trên thiết bị của bạn.",
      "Di chuyển tới vị trí trạm tủ Kiosk tương ứng.",
      "Quét mã QR trước mắt đọc camera của Kiosk hoặc nhập mã PIN trên màn hình cảm ứng để cửa tủ tự động mở khóa."
    ],
  },
  "extend-rental": {
    id: "extend-rental",
    question: "Tôi có thể gia hạn thời gian thuê không?",
    answer: [
      "Bạn hoàn toàn có thể gia hạn thời hạn sử dụng tủ bất kỳ lúc nào trực tiếp trên ứng dụng.",
      "Nên thực hiện gia hạn trước khi gói thuê hiện tại hết hạn để đảm bảo tủ không bị khóa tự động.",
      "Hỗ trợ chuyển đổi linh hoạt sang các gói dài hạn hơn (Theo ngày hoặc Theo tháng) để tiết kiệm chi phí."
    ],
  },
  "what-is-open-limit": {
    id: "what-is-open-limit",
    question: "Lượt mở tủ là gì và hoạt động thế nào?",
    answer: [
      "Gói Một lần (Single): Chỉ cho phép mở tủ 1 lần duy nhất để cất/lấy đồ. Khi bạn đóng tủ, phiên thuê tủ sẽ lập tức kết thúc.",
      "Gói Theo ngày (Daily): Cho phép mở tủ tối đa 3 lần trong vòng 24 giờ. Thích hợp cho nhu cầu cất và lấy đồ nhiều lần trong ngày.",
      "Gói Theo tháng (Monthly): Sử dụng tủ liên tục và không giới hạn số lượt mở tủ trong suốt thời hạn thuê."
    ],
  },
  "forget-otp": {
    id: "forget-otp",
    question: "Tôi phải làm gì nếu gặp sự cố hoặc quên OTP?",
    answer: [
      "Mã PIN (OTP) và mã QR luôn được hiển thị trong mục 'Tủ của tôi' -> chọn tủ đang hoạt động trên ứng dụng.",
      "Mã OTP vẫn có hiệu lực kể cả khi điện thoại của bạn không có kết nối mạng internet tạm thời.",
      "Nếu gặp lỗi kẹt khóa cơ học hoặc tủ không phản hồi, hãy liên hệ ngay hotline hỗ trợ khẩn cấp 24/7: 1900 1234 56 để được nhân viên hỗ trợ từ xa."
    ],
  },
  "pricing": {
    id: "pricing",
    question: "Chi phí thuê tủ được tính như thế nào?",
    answer: [
      "Chi phí thuê tủ được tính dựa trên kích cỡ ngăn tủ bạn lựa chọn (Tủ Nhỏ hoặc Tủ Lớn).",
      "Giá dịch vụ thay đổi tương ứng theo gói thời gian (Thuê một lần, thuê theo ngày, hoặc thuê theo tháng).",
      "Các gói thuê dài hạn (ngày, tháng) được áp dụng mức giá ưu đãi đặc biệt tối ưu cho học sinh, sinh viên."
    ],
  },
};

export default function FAQDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();

  const faq = FAQ_DATA[id as string] || FAQ_DATA["open-locker"];

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-four py-three border-b border-border/40 bg-surface/50">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center bg-surface border border-border"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </Pressable>
        <Text className="text-h3 text-white font-bold ml-three">Chi tiết Hỏi đáp</Text>
      </View>

      <ScrollView
        className="flex-1 px-five py-six"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Question Title - Direct to page layout */}
        <Text className="text-h2 text-white font-bold leading-eight mb-four">
          {faq.question}
        </Text>
        
        {/* Simple thin separator */}
        <View className="h-[1px] bg-border/40 mb-five" />
        
        {/* Answer Text - Listed as bullet points for seamless flow */}
        <View className="gap-three">
          {faq.answer.map((point, index) => (
            <View key={index} className="flex-row items-start">
              <View className="w-1.5 h-1.5 rounded-full bg-brand mt-two mr-three" />
              <Text className="flex-1 text-body text-text-secondary leading-six font-sans">
                {point}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
