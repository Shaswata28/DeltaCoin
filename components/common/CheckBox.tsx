import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, useColorScheme } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

type CheckBoxProps = {
  label: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function CheckBox({
  label,
  checked,
  onToggle,
  disabled = false,
  style,
}: CheckBoxProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const checkmarkOpacity = useSharedValue(checked ? 1 : 0);
  const backgroundColorValue = useSharedValue(checked ? 1 : 0);
  
  const animatedCheckStyle = useAnimatedStyle(() => {
    checkmarkOpacity.value = withTiming(checked ? 1 : 0, { duration: 150 });
    return {
      opacity: checkmarkOpacity.value,
    };
  });
  
  const animatedBoxStyle = useAnimatedStyle(() => {
    backgroundColorValue.value = withTiming(checked ? 1 : 0, { duration: 150 });
    return {
      backgroundColor: interpolateColor(
        backgroundColorValue.value,
        [0, 1],
        ['transparent', isDark ? '#82B1FF' : '#4D9FFF']
      ),
      borderColor: interpolateColor(
        backgroundColorValue.value,
        [0, 1],
        [isDark ? '#2E2E2E' : '#E0E0E0', isDark ? '#82B1FF' : '#4D9FFF']
      ),
    };
  });
  
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={disabled ? undefined : onToggle}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Animated.View style={[styles.checkbox, animatedBoxStyle]}>
        <Animated.View style={animatedCheckStyle}>
          <Check size={14} color="#FFF" strokeWidth={3} />
        </Animated.View>
      </Animated.View>
      
      <Text style={[
        styles.label,
        isDark && styles.labelDark,
        disabled && styles.disabledLabel
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#2C2C2C',
  },
  labelDark: {
    color: '#FFFFFF',
  },
  disabledLabel: {
    color: '#A6A6A6',
  }
});