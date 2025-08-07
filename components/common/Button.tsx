import React, { ReactNode } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, ViewStyle, TextStyle, useColorScheme } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 100 });
  };
  
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };
  
  const getButtonStyles = () => {
    const buttonStyles: ViewStyle[] = [styles.button, styles[`${size}Button`]];
    
    if (variant === 'primary') {
      buttonStyles.push(isDark ? styles.primaryButtonDark : styles.primaryButton);
    } else if (variant === 'secondary') {
      buttonStyles.push(isDark ? styles.secondaryButtonDark : styles.secondaryButton);
    } else if (variant === 'outline') {
      buttonStyles.push(isDark ? styles.outlineButtonDark : styles.outlineButton);
    }
    
    if (disabled || loading) {
      buttonStyles.push(isDark ? styles.disabledButtonDark : styles.disabledButton);
    }
    
    return buttonStyles;
  };
  
  const getTextStyles = () => {
    const textStyles: any[] = [styles.text, styles[`${size}Text`]];
    
    if (variant === 'primary') {
      textStyles.push(styles.primaryText);
    } else if (variant === 'secondary') {
      textStyles.push(styles.secondaryText);
    } else if (variant === 'outline') {
      textStyles.push(isDark ? styles.outlineTextDark : styles.outlineText);
    }
    
    if (disabled || loading) {
      textStyles.push(isDark ? styles.disabledTextDark : styles.disabledText);
    }
    
    return textStyles;
  };
  
  return (
    <Animated.View style={[animatedStyle, style]}>
      <TouchableOpacity
        style={getButtonStyles()}
        onPress={loading || disabled ? undefined : onPress}
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.contentContainer}>
          {loading ? (
            <ActivityIndicator 
              color={variant === 'outline' ? (isDark ? '#82B1FF' : '#4D9FFF') : '#FFF'} 
              size="small" 
            />
          ) : (
            <>
              {leftIcon}
              <Text style={[
                getTextStyles(),
                leftIcon ? styles.textWithLeftIcon : null,
                rightIcon ? styles.textWithRightIcon : null
              ]}>
                {title}
              </Text>
              {rightIcon}
            </>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  smallButton: {
    height: 36,
    paddingHorizontal: 16,
  },
  mediumButton: {
    height: 48,
    paddingHorizontal: 24,
  },
  largeButton: {
    height: 56,
    paddingHorizontal: 32,
  },
  primaryButton: {
    backgroundColor: '#4D9FFF',
  },
  primaryButtonDark: {
    backgroundColor: '#82B1FF',
  },
  secondaryButton: {
    backgroundColor: '#FFD700',
  },
  secondaryButtonDark: {
    backgroundColor: '#FFD700',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4D9FFF',
  },
  outlineButtonDark: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#82B1FF',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    borderColor: '#E0E0E0',
  },
  disabledButtonDark: {
    backgroundColor: '#2E2E2E',
    borderColor: '#2E2E2E',
  },
  text: {
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  textWithLeftIcon: {
    marginLeft: 4,
  },
  textWithRightIcon: {
    marginRight: 4,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  primaryText: {
    color: '#FFF',
  },
  secondaryText: {
    color: '#2C2C2C',
  },
  outlineText: {
    color: '#4D9FFF',
  },
  outlineTextDark: {
    color: '#82B1FF',
  },
  disabledText: {
    color: '#6B6B6B',
  },
  disabledTextDark: {
    color: '#A6A6A6',
  }
});