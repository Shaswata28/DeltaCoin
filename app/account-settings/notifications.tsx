import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Mail, Smartphone, CreditCard } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: '1',
      title: 'Push Notifications',
      description: 'Receive alerts on your device',
      icon: <Bell size={20} color="#FFD700" />,
      enabled: true,
    },
    {
      id: '2',
      title: 'Email Notifications',
      description: 'Get updates in your inbox',
      icon: <Mail size={20} color="#4D9FFF" />,
      enabled: true,
    },
    {
      id: '3',
      title: 'Transaction Alerts',
      description: 'Real-time payment notifications',
      icon: <CreditCard size={20} color="#10B981" />,
      enabled: true,
    },
    {
      id: '4',
      title: 'SMS Alerts',
      description: 'Get text message updates',
      icon: <Smartphone size={20} color="#A78BFA" />,
      enabled: false,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
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
        <Text style={[styles.title, isDark && styles.titleDark]}>Notifications</Text>
      </View>

      <View style={styles.content}>
        <Animated.View 
          entering={FadeInDown.delay(100).duration(400)}
          style={[styles.list, isDark && styles.listDark]}
        >
          {settings.map((setting, index) => (
            <Animated.View
              key={setting.id}
              entering={FadeInDown.delay(index * 100).duration(400)}
              style={[
                styles.listItem,
                isDark && styles.listItemDark,
                index === settings.length - 1 && styles.lastItem
              ]}
            >
              <View style={styles.itemContent}>
                {setting.icon}
                <View style={styles.itemText}>
                  <Text style={[styles.itemTitle, isDark && styles.itemTitleDark]}>
                    {setting.title}
                  </Text>
                  <Text style={[styles.itemDescription, isDark && styles.itemDescriptionDark]}>
                    {setting.description}
                  </Text>
                </View>
                <Switch
                  value={setting.enabled}
                  onValueChange={() => toggleSetting(setting.id)}
                  trackColor={{ false: '#767577', true: setting.id === '1' ? '#FFD700' : setting.id === '2' ? '#4D9FFF' : setting.id === '3' ? '#10B981' : '#A78BFA' }}
                  thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(200).duration(400)}
          style={[styles.infoCard, isDark && styles.infoCardDark]}
        >
          <Text style={[styles.infoTitle, isDark && styles.infoTitleDark]}>
            About Notifications
          </Text>
          <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
            Stay informed about your account activity, transactions, and important updates. You can customize your notification preferences anytime.
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
  lastItem: {
    borderBottomWidth: 0,
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