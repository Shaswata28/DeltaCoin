import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, useColorScheme } from 'react-native';

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

export function PinInput({ 
  value, 
  onChange, 
  length = 5,
  disabled = false 
}: PinInputProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    // Focus the first empty input
    const firstEmptyIndex = value.length;
    if (firstEmptyIndex < length) {
      inputRefs.current[firstEmptyIndex]?.focus();
    }
  }, [value, length]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      // Handle paste
      const newValue = text.slice(0, length);
      onChange(newValue);
      return;
    }

    const newValue = value.split('');
    newValue[index] = text;
    onChange(newValue.join(''));
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index]) {
      // Move to previous input on backspace if current is empty
      const prevIndex = index - 1;
      if (prevIndex >= 0) {
        inputRefs.current[prevIndex]?.focus();
      }
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) inputRefs.current[index] = ref;
          }}
          style={[
            styles.input,
            isDark && styles.inputDark,
            value[index] && styles.inputFilled,
            value[index] && isDark && styles.inputFilledDark,
          ]}
          value={value[index] || ''}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="numeric"
          maxLength={1}
          secureTextEntry
          editable={!disabled}
          selectTextOnFocus
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  input: {
    width: 40,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  inputDark: {
    borderColor: '#374151',
    color: '#FFFFFF',
    backgroundColor: '#1F2937',
  },
  inputFilled: {
    borderColor: '#4D9FFF',
    backgroundColor: '#F0F7FF',
  },
  inputFilledDark: {
    borderColor: '#4D9FFF',
    backgroundColor: '#1E3A8A',
  },
}); 