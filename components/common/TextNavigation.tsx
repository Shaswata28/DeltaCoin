import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';

interface TextNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  backText?: string;
  nextText?: string;
  disabled?: boolean;
}

export function TextNavigation({
  onBack,
  onNext,
  backText = '← Back',
  nextText = 'Next →',
  disabled = false,
}: TextNavigationProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity 
          onPress={disabled ? undefined : onBack}
          style={styles.link}
          disabled={disabled}
        >
          <Text style={[
            styles.text,
            isDark && styles.textDark,
            disabled && styles.disabled
          ]}>
            {backText}
          </Text>
        </TouchableOpacity>
      )}
      {onNext && (
        <TouchableOpacity 
          onPress={disabled ? undefined : onNext}
          style={[styles.link, styles.nextLink]}
          disabled={disabled}
        >
          <Text style={[
            styles.text,
            isDark && styles.textDark,
            disabled && styles.disabled
          ]}>
            {nextText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
  },
  link: {
    padding: 8,
  },
  nextLink: {
    marginLeft: 'auto',
  },
  text: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#2C2C2C',
  },
  textDark: {
    color: '#FFFFFF',
  },
  disabled: {
    opacity: 0.5,
  },
});