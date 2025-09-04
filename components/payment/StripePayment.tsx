import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Lock, CreditCard } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import { initializeStripe, createPaymentIntent } from '../../supabase/stripe';

interface StripePaymentProps {
  amount: string;
  method: 'card';
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

export function StripePayment({ amount, method, onSuccess, onCancel }: StripePaymentProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState<any>(null);
  const { confirmPayment } = useConfirmPayment();

  useEffect(() => {
    const initStripe = async () => {
      try {
        await initializeStripe();
        const { clientSecret } = await createPaymentIntent(parseFloat(amount));
        setClientSecret(clientSecret);
        setLoading(false);
      } catch (err) {
        setError('Failed to initialize payment. Please try again.');
        setLoading(false);
      }
    };
    initStripe();
  }, [amount]);

  const handlePayment = async () => {
    if (!clientSecret) {
      setError('Payment setup incomplete. Please try again.');
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });
      if (error) throw error;
      onSuccess(paymentIntent.id);
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container]}>
        <View style={styles.loadingContainer}>
          <View style={[styles.stripeHeader, isDark && styles.stripeHeaderDark]}>
            <View style={styles.stripeLogo}>
              <Text style={styles.stripeLogoText}>stripe</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={[styles.merchantName, isDark && styles.merchantNameDark]}>
                DeltaCoin
              </Text>
              <Text style={[styles.paymentAmount, isDark && styles.paymentAmountDark]}>
                ৳{parseFloat(amount).toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#635BFF" />
            <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
              Initializing secure payment...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            entering={FadeInDown.duration(400)}
            style={styles.paymentContainer}
          >
            <View style={[styles.stripeHeader, isDark && styles.stripeHeaderDark]}>
              <View style={styles.stripeLogo}>
                <Text style={styles.stripeLogoText}>stripe</Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={[styles.merchantName, isDark && styles.merchantNameDark]}>
                  DeltaCoin
                </Text>
                <Text style={[styles.paymentAmount, isDark && styles.paymentAmountDark]}>
                  ৳{parseFloat(amount).toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={[styles.paymentForm, isDark && styles.paymentFormDark]}>
              <View style={styles.methodHeader}>
                <View style={styles.methodIcon}>
                  <CreditCard size={24} color="#635BFF" />
                </View>
                <Text style={[styles.methodTitle, isDark && styles.methodTitleDark]}>
                  Card Information
                </Text>
              </View>
              <CardField
                postalCodeEnabled={false}
                placeholders={{ number: '4242 4242 4242 4242' }}
                cardStyle={{
                  backgroundColor: isDark ? '#333333' : '#F0F0F0',
                  textColor: isDark ? '#FFFFFF' : '#000000',
                }}
                style={{ width: '100%', height: 50, marginVertical: 30 }}
                onCardChange={setCardDetails}
              />
              
              <View style={[styles.securityInfo, isDark && styles.securityInfoDark]}>
                <Lock size={16} color="#10B981" />
                <Text style={[styles.securityText, isDark && styles.securityTextDark]}>
                  Your payment information is encrypted and secure
                </Text>
              </View>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.cancelButton, isDark && styles.cancelButtonDark]}
                onPress={onCancel}
                disabled={processing}
              >
                <Text style={[styles.cancelButtonText, isDark && styles.cancelButtonTextDark]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.payButton,
                  isDark && styles.payButtonDark,
                  (!cardDetails?.complete || processing) && styles.payButtonDisabled
                ]}
                onPress={handlePayment}
                disabled={!cardDetails?.complete || processing}
              >
                {processing ? (
                  <View style={styles.processingContainer}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.payButtonText}>Processing...</Text>
                  </View>
                ) : (
                  <Text style={styles.payButtonText}>
                    Pay ৳{parseFloat(amount).toFixed(2)}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={[styles.footerText, isDark && styles.footerTextDark]}>
                Powered by Stripe
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 16,
  },
  loadingTextDark: {
    color: '#9CA3AF',
  },
  paymentContainer: {
    flex: 1,
    minHeight: 600,
    justifyContent: 'space-between',
  },
  stripeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderColor: '#374151',
    backgroundColor: '#FAFBFC',
    borderRadius: 16,
    marginBottom: 32,
  },
  stripeHeaderDark: {
    borderBottomColor: '#374151',
    backgroundColor: '#111827',
  },
  stripeLogo: {
    backgroundColor: '#635BFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 20,
  },
  stripeLogoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.5,
  },
  headerInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  merchantNameDark: {
    color: '#FFFFFF',
  },
  paymentAmount: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#635BFF',
  },
  paymentAmountDark: {
    color: '#818CF8',
  },
  paymentForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 32,
    flex: 1,
  },
  paymentFormDark: {
    backgroundColor: '#121212',
    borderColor: '#374151',
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  methodIcon: {
    marginRight: 16,
  },
  methodTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  methodTitleDark: {
    color: '#FFFFFF',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    marginTop: 16,
  },
  securityInfoDark: {
    backgroundColor: '#064E3B',
  },
  securityText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    flex: 1,
  },
  securityTextDark: {
    color: '#34D399',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginTop: 16,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonDark: {
    borderColor: '#4B5563',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  cancelButtonTextDark: {
    color: '#9CA3AF',
  },
  payButton: {
    flex: 2,
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: '#635BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonDark: {
    backgroundColor: '#5B52FF',
  },
  payButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  payButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  footerTextDark: {
    color: '#6B7280',
  },
});