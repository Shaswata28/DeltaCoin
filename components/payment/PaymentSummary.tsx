import { View, Text, StyleSheet, useColorScheme } from 'react-native';

interface PaymentSummaryProps {
  amount: string;
  method?: string;
  destination?: string;
  club?: string;
  details?: string;
}

export function PaymentSummary({ 
  amount, 
  method, 
  destination, 
  club, 
  details 
}: PaymentSummaryProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const formatAmount = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    return `৳${numericValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>Payment Summary</Text>
      
      <View style={styles.row}>
        <Text style={[styles.label, isDark && styles.labelDark]}>Amount</Text>
        <Text style={[styles.value, styles.amount]}>
          {formatAmount(amount)}
        </Text>
      </View>

      {method && (
        <View style={styles.row}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Payment Method</Text>
          <Text style={[styles.value, isDark && styles.valueDark]}>{method}</Text>
        </View>
      )}

      {destination && (
        <View style={styles.row}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Destination</Text>
          <Text style={[styles.value, isDark && styles.valueDark]}>{destination}</Text>
        </View>
      )}

      {club && (
        <View style={styles.row}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Club</Text>
          <Text style={[styles.value, isDark && styles.valueDark]}>{club}</Text>
        </View>
      )}

      {details && (
        <View style={[styles.detailsContainer, isDark && styles.detailsContainerDark]}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Additional Details</Text>
          <Text style={[styles.details, isDark && styles.detailsDark]}>{details}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  containerDark: {
    backgroundColor: '#1E1E1E',
    borderColor: '#2E2E2E',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#2C2C2C',
    marginBottom: 16,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B6B6B',
  },
  labelDark: {
    color: '#A6A6A6',
  },
  value: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2C2C2C',
  },
  valueDark: {
    color: '#FFFFFF',
  },
  amount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#4D9FFF',
  },
  detailsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  detailsContainerDark: {
    backgroundColor: '#2E2E2E',
  },
  details: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#2C2C2C',
    lineHeight: 20,
  },
  detailsDark: {
    color: '#FFFFFF',
  },
});