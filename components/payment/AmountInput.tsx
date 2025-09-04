import { View, Text, TextInput, StyleSheet, useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function AmountInput({ value, onChange, error }: AmountInputProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [formattedValue, setFormattedValue] = useState(value);

  useEffect(() => {
    // Format the value with commas
    const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setFormattedValue(formatted);
  }, [value]);

  const handleChange = (text: string) => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    onChange(numericValue);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, isDark && styles.labelDark]}>Amount</Text>
      <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
        <Text style={[styles.currency, isDark && styles.currencyDark]}>৳</Text>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={formattedValue}
          onChangeText={handleChange}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor={isDark ? '#A6A6A6' : '#6B6B6B'}
          maxLength={10}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  labelDark: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  inputContainerDark: {
    backgroundColor: '#1E1E1E',
    borderColor: '#2E2E2E',
  },
  currency: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2C2C2C',
    marginRight: 8,
  },
  currencyDark: {
    color: '#FFFFFF',
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2C2C2C',
    padding: 0,
  },
  inputDark: {
    color: '#FFFFFF',
  },
  error: {
    color: '#FF4D4F',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
  },
});