import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

import { FormInput } from '@/components/common/FormInput';
import { Button } from '@/components/common/Button';
import { CheckBox } from '@/components/common/CheckBox';
import { signIn } from '@/supabase/auth';

export function LoginForm() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });

  const handleLogin = async () => {
    setErrors({ email: '', password: '', general: '' });
    
    let isValid = true;
    const newErrors = { email: '', password: '', general: '' };
    
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    if (!isValid) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { user } = await signIn({
        email,
        password
      });

      if (user) {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      setErrors({ 
        ...newErrors, 
        general: error.message || 'Invalid email or password. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <Animated.View 
      entering={FadeInLeft.delay(200).springify()} 
      style={styles.container}
    >
      <FormInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={errors.email}
      />

      <FormInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry={!showPassword}
        rightElement={
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            {showPassword ? 
              <Eye size={20} color={isDark ? '#A6A6A6' : '#6B6B6B'} /> : 
              <EyeOff size={20} color={isDark ? '#A6A6A6' : '#6B6B6B'} />
            }
          </TouchableOpacity>
        }
        error={errors.password}
      />

      {errors.general ? (
        <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
          {errors.general}
        </Text>
      ) : null}

      <View style={styles.optionsContainer}>
        <CheckBox
          label="Remember me"
          checked={rememberMe}
          onToggle={() => setRememberMe(!rememberMe)}
        />
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={[styles.forgotPassword, isDark && styles.forgotPasswordDark]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Login"
        onPress={handleLogin}
        loading={isLoading}
        style={styles.loginButton}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  forgotPassword: {
    color: '#007AFF',
    fontSize: 14,
  },
  forgotPasswordDark: {
    color: '#0A84FF',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
  errorTextDark: {
    color: '#FF453A',
  },
  loginButton: {
    marginTop: 24,
  },
  eyeButton: {
    padding: 8,
  },
});