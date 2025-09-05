import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useColorScheme, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, CreditCard, Trash2, Wallet } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button } from '@/components/common/Button';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  name: string;
  number: string;
  expiryDate?: string;
  isDefault: boolean;
}

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4242',
      number: '•••• •••• •••• 4242',
      expiryDate: '12/24',
      isDefault: true,
    },
    {
      id: '2',
      type: 'bank',
      name: 'Bank Account',
      number: '•••• •••• •••• 5678',
      isDefault: false,
    },
  ]);

  const [autoTopup, setAutoTopup] = useState(false);

  const handleAddPaymentMethod = () => {
    // Implement add payment method logic
    console.log('Add payment method');
  };

  const handleRemovePaymentMethod = (id: string) => {
    // Implement remove payment method logic
    console.log('Remove payment method', id);
  };

  const handleSetDefault = (id: string) => {
    // Implement set default payment method logic
    console.log('Set default payment method', id);
  };

  const handleAutoTopupToggle = (value: boolean) => {
    setAutoTopup(value);
  };

  return (
    <ScrollView 
      style={[styles.container, isDark && styles.containerDark]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#2C2C2C'} />
        </TouchableOpacity>
        <Text style={[styles.title, isDark && styles.titleDark]}>Payment Methods</Text>
      </View>

      <View style={styles.content}>
        <Animated.View 
          entering={FadeInDown.delay(100).duration(400)}
          style={[styles.section, isDark && styles.sectionDark]}
        >
          {paymentMethods.map((method, index) => (
            <Animated.View
              key={method.id}
              entering={FadeInDown.delay(index * 100).duration(400)}
              style={[styles.paymentCard, isDark && styles.paymentCardDark]}
            >
              <View style={styles.paymentCardContent}>
                <CreditCard size={24} color="#FFD700" />
                <View style={styles.paymentInfo}>
                  <Text style={[styles.paymentName, isDark && styles.paymentNameDark]}>
                    {method.name}
                  </Text>
                  <Text style={[styles.paymentNumber, isDark && styles.paymentNumberDark]}>
                    {method.number}
                  </Text>
                  {method.expiryDate && (
                    <Text style={[styles.paymentExpiry, isDark && styles.paymentExpiryDark]}>
                      Expires {method.expiryDate}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.paymentActions}>
                {!method.isDefault && (
                  <React.Fragment>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleSetDefault(method.id)}
                    >
                      <Text style={styles.actionButtonText}>Set Default</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.removeButton]}
                      onPress={() => handleRemovePaymentMethod(method.id)}
                    >
                      <Trash2 size={20} color="#FF4D4F" />
                    </TouchableOpacity>
                  </React.Fragment>
                )}
                {method.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(150).duration(400)}
          style={[styles.paymentCard, isDark && styles.paymentCardDark]}
        >
          <View style={styles.paymentCardContent}>
            <Wallet size={24} color="#A78BFA" />
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentName, isDark && styles.paymentNameDark]}>Auto Top-up</Text>
              <Text style={[styles.paymentNumber, isDark && styles.paymentNumberDark]}>Automatically add funds when balance is low</Text>
            </View>
            <Switch
              value={autoTopup}
              onValueChange={handleAutoTopupToggle}
              trackColor={{ false: '#767577', true: '#A78BFA' }}
              thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </Animated.View>

        <Button
          title="Add Payment Method"
          onPress={handleAddPaymentMethod}
          style={styles.addButton}
          leftIcon={<Plus size={20} color="#FFFFFF" />}
        />

        <Animated.View 
          entering={FadeInDown.delay(200).duration(400)}
          style={[styles.infoCard, isDark && styles.infoCardDark]}
        >
          <Text style={[styles.infoTitle, isDark && styles.infoTitleDark]}>
            Secure Payments
          </Text>
          <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
            Your payment information is encrypted and stored securely. We never share your financial details with anyone.
          </Text>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2C2C2C',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
    gap: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionDark: {
    backgroundColor: '#1E1E1E',
  },
  paymentCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  paymentCardDark: {
    backgroundColor: '#2E2E2E',
  },
  paymentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2C2C2C',
    marginBottom: 2,
  },
  paymentNameDark: {
    color: '#FFFFFF',
  },
  paymentNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B6B6B',
    marginBottom: 2,
  },
  paymentNumberDark: {
    color: '#A6A6A6',
  },
  paymentExpiry: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B6B6B',
  },
  paymentExpiryDark: {
    color: '#A6A6A6',
  },
  paymentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F0F9FF',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4D9FFF',
  },
  removeButton: {
    backgroundColor: '#FFF2F0',
  },
  defaultBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#E6F4FF',
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#4D9FFF',
  },
  addButton: {
    marginVertical: 8,
  },
  infoCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 20,
  },
  infoCardDark: {
    backgroundColor: '#1A2234',
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2C2C2C',
    marginBottom: 12,
  },
  infoTitleDark: {
    color: '#FFFFFF',
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B6B6B',
    lineHeight: 24,
  },
  infoTextDark: {
    color: '#A6A6A6',
  },
});