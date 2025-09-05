import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Fingerprint, Shield, Smartphone, Key } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SecuritySettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

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
        <Text style={[styles.title, isDark && styles.titleDark]}>Security Settings</Text>
      </View>

      <View style={styles.content}>
        <Animated.View 
          entering={FadeInDown.delay(100).duration(400)}
          style={[styles.list, isDark && styles.listDark]}
        >
          <TouchableOpacity style={[styles.listItem, isDark && styles.listItemDark]}>
            <View style={styles.itemContent}>
              <Key size={20} color="#FFD700" />
              <View style={styles.itemText}>
                <Text style={[styles.itemTitle, isDark && styles.itemTitleDark]}>
                  Change Password
                </Text>
                <Text style={[styles.itemDescription, isDark && styles.itemDescriptionDark]}>
                  Update your account password
                </Text>
              </View>
              <ArrowLeft size={20} color={isDark ? '#A6A6A6' : '#6B6B6B'} style={{ transform: [{ rotate: '180deg' }] }} />
            </View>
          </TouchableOpacity>

          <View style={[styles.listItem, isDark && styles.listItemDark]}>
            <View style={styles.itemContent}>
              <Fingerprint size={20} color="#4D9FFF" />
              <View style={styles.itemText}>
                <Text style={[styles.itemTitle, isDark && styles.itemTitleDark]}>
                  Biometric Login
                </Text>
                <Text style={[styles.itemDescription, isDark && styles.itemDescriptionDark]}>
                  Use fingerprint or face recognition
                </Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: '#767577', true: '#4D9FFF' }}
                thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>

          <View style={[styles.listItem, isDark && styles.listItemDark]}>
            <View style={styles.itemContent}>
              <Smartphone size={20} color="#10B981" />
              <View style={styles.itemText}>
                <Text style={[styles.itemTitle, isDark && styles.itemTitleDark]}>
                  Two-Factor Authentication
                </Text>
                <Text style={[styles.itemDescription, isDark && styles.itemDescriptionDark]}>
                  Additional security layer
                </Text>
              </View>
              <Switch
                value={twoFactorEnabled}
                onValueChange={setTwoFactorEnabled}
                trackColor={{ false: '#767577', true: '#10B981' }}
                thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(200).duration(400)}
          style={[styles.infoCard, isDark && styles.infoCardDark]}
        >
          <Text style={[styles.infoTitle, isDark && styles.infoTitleDark]}>
            Security Tips
          </Text>
          <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
            • Use a strong, unique password{'\n'}
            • Enable two-factor authentication{'\n'}
            • Never share your PIN or password{'\n'}
            • Update your security settings regularly
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
  list: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  listDark: {
    backgroundColor: '#1E1E1E',
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 16,
  },
  listItemDark: {
    borderBottomColor: '#2E2E2E',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2C2C2C',
    marginBottom: 2,
  },
  itemTitleDark: {
    color: '#FFFFFF',
  },
  itemDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B6B6B',
  },
  itemDescriptionDark: {
    color: '#A6A6A6',
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