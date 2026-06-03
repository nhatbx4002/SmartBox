import React from 'react';
import { Stack, ThemeProvider, DarkTheme } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

// Override the Navigation theme colors to match our dark palette
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0A0A0A',
    card: '#0A0A0A',
    text: '#FFFFFF',
    border: '#333332',
  },
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={CustomDarkTheme}>
        <StatusBar style="light" backgroundColor="#0A0A0A" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#0A0A0A' },
          }}
        >
          {/* Splash screen checking auth state */}
          <Stack.Screen name="index" />
          
          {/* Auth group */}
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="reset-password" />
          
          {/* App screens */}
          <Stack.Screen name="home" />
          <Stack.Screen name="rent" />
          <Stack.Screen name="rental-detail" />
          <Stack.Screen name="notifications" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
