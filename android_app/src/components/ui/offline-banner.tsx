import { View, Text } from 'react-native';
import { useIsOnline } from '../../hooks/useIsOnline';

export function OfflineBanner() {
  const isOnline = useIsOnline();
  if (isOnline) return null;
  return (
    <View className="bg-error/90 px-four py-two items-center">
      <Text className="text-small-bold text-white">Không có kết nối mạng</Text>
    </View>
  );
}
