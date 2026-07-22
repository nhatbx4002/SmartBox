import { useNetInfo } from '@react-native-community/netinfo';

export function useIsOnline() {
  const { isConnected } = useNetInfo();
  return isConnected !== false;
}
