import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

interface FAQItem {
  id: string;
  question: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    id: "open-locker",
    question: "Làm thế nào để nhận tủ và mở cửa tủ?",
  },
  {
    id: "extend-rental",
    question: "Tôi có thể gia hạn thời gian thuê không?",
  },
  {
    id: "what-is-open-limit",
    question: "Lượt mở tủ là gì và hoạt động thế nào?",
  },
  {
    id: "forget-otp",
    question: "Tôi phải làm gì nếu gặp sự cố hoặc quên OTP?",
  },
  {
    id: "pricing",
    question: "Chi phí thuê tủ được tính như thế nào?",
  },
];

export default function FAQListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSelectFAQ = (faqId: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/faq/${faqId}` as any);
  };

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
        <Text className="text-h3 text-white font-bold ml-three">Hỏi đáp & Hỗ trợ</Text>
      </View>

      <ScrollView
        className="flex-1 px-four py-four"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-body-bold text-white mb-four">Các câu hỏi thường gặp</Text>

        <View className="bg-surface border border-border rounded-panel overflow-hidden">
          {FAQ_LIST.map((faq, index) => {
            const isLast = index === FAQ_LIST.length - 1;
            return (
              <Pressable
                key={faq.id}
                onPress={() => handleSelectFAQ(faq.id)}
                className={`flex-row justify-between items-center px-four py-four active:bg-surface-elevated ${
                  !isLast ? "border-b border-border/40" : ""
                }`}
              >
                <Text className="text-small-bold text-white flex-1 pr-four">
                  {faq.question}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color="#A1A1A0"
                />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
