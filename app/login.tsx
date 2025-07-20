import { useState } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, ScrollView, ImageBackground, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

import { AppLogo } from '@/components/auth/AppLogo';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpLink } from '@/components/auth/SignUpLink';


export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ImageBackground
        source={require('@/assets/images/dark1.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={[styles.overlay, isDark && styles.overlayDark]} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <SafeAreaView style={styles.safeArea}>
              <Animated.View 
                entering={FadeInUp.duration(800).springify()} 
                style={styles.logoContainer}
              >
                <AppLogo />
              </Animated.View>
              
              <Animated.View 
                entering={FadeInDown.delay(300).duration(800).springify()}
                style={[styles.formContainer, isDark && styles.formContainerDark]}
              > 
                <LoginForm />
                <SignUpLink />
              </Animated.View>

             
            </SafeAreaView>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(250, 250, 245, 0.85)',
  },
  overlayDark: {
    backgroundColor: 'rgba(18, 18, 18, 0.85)',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    paddingHorizontal: 24,
    paddingVertical: 32,
    marginBottom: 24,
  },
  formContainerDark: {
    backgroundColor: '#1E1E1E',
    shadowOpacity: 0.2,
  },

});