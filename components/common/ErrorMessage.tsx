import React from 'react';
import { Text, StyleSheet, useColorScheme } from 'react-native';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
      {message}
    </Text>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 8,
  },
  errorTextDark: {
    color: '#EF4444',
  },
}); 