import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react-native';
import { FormInput } from '@/components/common/FormInput';
import { Button } from '@/components/common/Button';
import { validateEmail } from '@/utils/validation';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, isDark && styles.containerDark]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#2C2C2C'} />
          </TouchableOpacity>

          <View style={styles.header}>
            <ShieldCheck size={48} color={isDark ? '#82B1FF' : '#4D9FFF'} />
            <Text style={[styles.title, isDark && styles.titleDark]}>Forgot Password</Text>
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
              Enter your email address and we'll send you instructions to reset your password
            </Text>
          </View>

          {success ? (
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>Check Your Email</Text>
              <Text style={styles.successText}>
                We've sent password reset instructions to {email}. Please check your inbox.
              </Text>
              <Button
                title="Back to Login"
                onPress={() => router.replace('/login')}
                style={styles.button}
              />
            </View>
          ) : (
            <View>
              <FormInput
                label="Email Address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError('');
                }}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                error={error}
                disabled={isLoading}
                leftIcon={<Mail size={20} color={isDark ? '#A6A6A6' : '#6B6B6B'} />}
              />

              <Button
                title="Send Reset Instructions"
                onPress={handleResetPassword}
                loading={isLoading}
                style={styles.button}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2C2C2C',
    marginTop: 16,
    marginBottom: 8,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 20,
  },
  subtitleDark: {
    color: '#A6A6A6',
  },
  button: {
    marginTop: 24,
    color: '#2C2C2C',
  },
  successContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F6FFED',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B7EB8F',
  },
  successTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#52C41A',
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#52C41A',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
});