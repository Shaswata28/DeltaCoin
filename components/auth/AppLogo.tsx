import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { useEffect } from 'react';
import { Coins } from 'lucide-react-native';

export function AppLogo() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withSequence(
      withTiming(-10, { duration: 300, easing: Easing.elastic(1.5) }),
      withTiming(10, { duration: 600, easing: Easing.elastic(1.5) }),
      withTiming(0, { duration: 300, easing: Easing.elastic(1.5) })
    );
    
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(1, { duration: 1000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoWrapper, animatedStyle, isDark && styles.logoWrapperDark]}>
        <View style={[styles.logoBackground, isDark && styles.logoBackgroundDark]}>
          <Coins color="#FFD700" size={48} strokeWidth={2} />
        </View>
      </Animated.View>
      <Text style={[styles.appName, isDark && styles.appNameDark]}>Delta Coin</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoWrapperDark: {
    backgroundColor: '#1E1E1E',
    shadowOpacity: 0.2,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBackgroundDark: {
    backgroundColor: '#1E1E1E',
  },
  appName: {
    color: '#FFD700',
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  appNameDark: {
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
  }
});