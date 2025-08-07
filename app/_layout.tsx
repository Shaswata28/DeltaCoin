require('react-native-get-random-values');
import React, { useEffect } from 'react';
import { Stack, useSegments, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { isAuthenticated } from '@/supabase/auth';
import { LoadingProvider, setGlobalLoadingFunctions, useLoading } from '@/components/common/LoadingContext';
import { SimpleLoadingIndicator } from '@/components/common/SimpleLoadingIndicator';


// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthed = await isAuthenticated();
      const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup' || segments[0] === 'forgot-password';

      if (!isAuthed && !inAuthGroup) {
        // Redirect to login if not authenticated
        router.replace('/login');
      } else if (isAuthed && inAuthGroup) {
        // Redirect to home if authenticated and trying to access auth screens
        router.replace('/(tabs)');
      }
    };

    checkAuth();
  }, [segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}

function AppContent() {
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    // Set global loading functions for use in non-component files
    setGlobalLoadingFunctions(showLoading, hideLoading);
  }, [showLoading, hideLoading]);

  return (
    <>
      <RootLayoutNav />
      <SimpleLoadingIndicator />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <LoadingProvider>
      <AppContent />
      <StatusBar style="auto" />
    </LoadingProvider>
  );
}