import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, ViewStyle, TextStyle, useColorScheme, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';
import { Eye, EyeOff } from 'lucide-react-native';

type FormInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  autoComplete?: 'off' | 'email' | 'password' | 'name' | 'username';
  maxLength?: number;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  multiline?: boolean; // Added multiline prop
  numberOfLines?: number; // Added numberOfLines prop for multiline support
}

export function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  disabled = false,
  style,
  inputStyle,
  autoComplete,
  maxLength,
  leftIcon,
  rightElement,
  multiline = false, // Default to false
  numberOfLines = 1, // Default to 1 line
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(
        error
          ? isDark ? '#FF6B6B' : '#FF4D4F'
          : isFocused 
            ? isDark ? '#82B1FF' : '#4D9FFF'
            : isDark ? '#2E2E2E' : '#E0E0E0',
        { duration: 150 }
      ),
    };
  });
  
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, isDark && styles.labelDark]}>{label}</Text>
      
      <Animated.View style={[
        styles.inputContainer,
        isDark && styles.inputContainerDark,
        multiline && styles.inputContainerMultiline,
        animatedBorderStyle
      ]}>
        <TextInput
          style={[
            styles.input,
            isDark && styles.inputDark,
            multiline && styles.inputMultiline,
            inputStyle,
            rightElement ? styles.inputWithIcon : null
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#A6A6A6' : '#6B6B6B'}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoComplete={autoComplete}
          maxLength={maxLength}
          multiline={multiline} // Pass multiline to TextInput
          numberOfLines={multiline ? numberOfLines : 1} // Set numberOfLines for multiline
          textAlignVertical={multiline ? 'top' : 'center'} // Align text to top for multiline
        />
        
        {rightElement}
      </Animated.View>
      
      {error ? (
        <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2C2C2C',
    marginBottom: 6,
  },
  labelDark: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    minHeight: 48,
  },
  inputContainerDark: {
    backgroundColor: '#1E1E1E',
    borderColor: '#2E2E2E',
  },
  inputContainerMultiline: {
    alignItems: 'flex-start',
    paddingVertical: 12,
    minHeight: 80, // Increased min height for multiline
  },
  input: {
    flex: 1,
    color: '#2C2C2C',
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    ...(Platform.OS === 'web' ? {
      paddingTop: 14,
      paddingBottom: 14,
    } : {})
  } as TextStyle,
  inputMultiline: {
    minHeight: 60, // Minimum height for multiline input
    maxHeight: 120, // Maximum height to prevent excessive growth
    paddingTop: Platform.OS === 'ios' ? 8 : 4,
    paddingBottom: Platform.OS === 'ios' ? 8 : 4,
  } as TextStyle,
  inputWithIcon: {
    paddingRight: 40,
  } as TextStyle,
  inputDark: {
    color: '#FFFFFF',
  },
  errorText: {
    color: '#FF4D4F',
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  errorTextDark: {
    color: '#FF6B6B',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});