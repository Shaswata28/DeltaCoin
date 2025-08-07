import React from 'react';
import { View, ActivityIndicator, StyleSheet, useColorScheme } from 'react-native';
import { useLoading } from './LoadingContext';

export function SimpleLoadingIndicator() {
  const { isLoading } = useLoading();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (!isLoading) {
    return null;
  }

  return (
    <View style={[styles.overlay, isDark && styles.overlayDark]}>
      <View style={[styles.container, isDark && styles.containerDark]}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  overlayDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  containerDark: {
    backgroundColor: '#1E1E1E',
  },
});