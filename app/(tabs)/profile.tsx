import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useColorScheme, ImageBackground, Dimensions, Alert } from 'react-native';
import { User, Shield, Bell, ChevronRight, LogOut, CircleHelp as HelpCircle, Info, Pencil, TrendingUp, Award, RefreshCw } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { signOut, getCurrentUser, getCurrentUserProfile } from '@/supabase/auth';
import { getUserTransactionCount, getCategorySpending } from '@/supabase/db';
import type { User as UserType } from '@/supabase/client';


const { width: screenWidth } = Dimensions.get('window');

interface MenuItem {
  id: string;
  title: string;
  description: string;
  IconComponent: React.ComponentType<{ size: number; color: string }>;
  route: string;
  color: string;
}

interface ProfileData {
  user: any;
  profile: UserType | null;
  transactionCount: number;
  monthlySpent: number;
}

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    user: null,
    profile: null,
    transactionCount: 0,
    monthlySpent: 0,
  });

  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'Security & Privacy',
      description: 'Manage your account security',
      IconComponent: Shield,
      route: '/account-settings/security',
      color: '#4D9FFF',
    },
    {
      id: '2',
      title: 'Notifications',
      description: 'Customize your alerts',
      IconComponent: Bell,
      route: '/account-settings/notifications',
      color: '#10B981',
    },
    {
      id: '3',
      title: 'Help & Support',
      description: 'Get help when you need it',
      IconComponent: HelpCircle,
      route: '/help',
      color: '#EC4899',
    },
    {
      id: '4',
      title: 'About DeltaCoin',
      description: 'App info and version',
      IconComponent: Info,
      route: '/about',
      color: '#6366F1',
    },
  ];

  const fetchProfileData = async () => {
    try {
      setError(null);

      const user = await getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const profile = await getCurrentUserProfile();
      if (!profile) {
        throw new Error('User profile not found');
      }

      const transactionCount = await getUserTransactionCount();

      const currentDate = new Date();
      const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      const categorySpending = await getCategorySpending(currentMonth);
      
      const monthlySpent = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);

      setProfileData({
        user,
        profile,
        transactionCount,
        monthlySpent,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load profile data');
    }
  };


  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleRetry = () => {
    fetchProfileData();
  };

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer, isDark && styles.containerDark]}>
        <Text style={[styles.errorText, isDark && styles.errorTextDark]}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, isDark && styles.containerDark]}
      contentContainerStyle={{ paddingBottom: 85 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Background */}
      <View style={styles.headerContainer}>
        <ImageBackground
          source={require('../../assets/images/dark1.png') // dark mode image
               
          }
          style={styles.headerBackground}
          imageStyle={styles.headerBackgroundImage}
        >
          <LinearGradient
            colors={isDark ? ['rgba(18,18,18,0.7)', 'rgba(18,18,18,0.9)'] : ['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
            style={styles.headerGradient}
          >
            <Animated.View 
              entering={FadeInUp.duration(800).springify()}
              style={styles.profileSection}
            >
              <View style={styles.avatarSection}>
                <View style={[styles.avatarContainer, isDark && styles.avatarContainerDark]}>
                  <Image
                    source={{ 
                      uri: profileData.profile?.profile_picture_url || 'https://via.placeholder.com/150'
                    }}
                    style={styles.avatar}
                  />
                  <TouchableOpacity 
                    style={[styles.editButton, isDark && styles.editButtonDark]}
                    onPress={() => router.push('/account-settings/edit-profile' as any)}
                  >
                    <Pencil size={16} color="#2C2C2C" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.name}>
                  {profileData.profile?.full_name || 'Loading...'}
                </Text>
                <Text style={styles.studentId}>
                  ID: {profileData.profile?.student_id || 'Loading...'}
                </Text>
                <Text style={styles.email}>
                  {profileData.user?.email || 'Loading...'}
                </Text>
              </View>
            </Animated.View>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Stats Cards */}
      <Animated.View 
        entering={FadeInDown.delay(200).duration(600).springify()}
        style={styles.statsSection}
      >
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, isDark && styles.statCardDark]}>
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(77, 159, 255, 0.1)' }]}>
              <TrendingUp size={20} color="#4D9FFF" />
            </View>
            <Text style={[styles.statValue, isDark && styles.textDark]}>
              {profileData.transactionCount}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.textLightDark]}>
              Total Transactions
            </Text>
          </View>

          <View style={[styles.statCard, isDark && styles.statCardDark]}>
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Award size={20} color="#10B981" />
            </View>
            <Text style={[styles.statValue, isDark && styles.textDark]}>
              ৳{profileData.monthlySpent.toFixed(0)}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.textLightDark]}>
              This Month
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>
          Account Settings
        </Text>
        
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(300 + index * 100).duration(400)}
              style={styles.menuItemWrapper}
            >
              <TouchableOpacity
                style={[styles.menuItem, isDark && styles.menuItemDark]}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
                  <item.IconComponent size={20} color={item.color} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemTitle, isDark && styles.textDark]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.menuItemSubtitle, isDark && styles.textLightDark]}>
                    {item.description}
                  </Text>
                </View>
                <ChevronRight size={18} color={isDark ? '#A6A6A6' : '#6B6B6B'} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Logout Section */}
      <Animated.View 
        entering={FadeInDown.delay(700).duration(400)}
        style={styles.logoutSection}
      >

        <TouchableOpacity
          style={[styles.logoutButton, isDark && styles.logoutButtonDark]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <View style={styles.logoutIconContainer}>
            <LogOut size={18} color="#FF4D4F" />
          </View>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={[styles.version, isDark && styles.textLightDark]}>
          DeltaCoin v1.0.0
        </Text>
      </Animated.View>
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
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FF4D4F',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorTextDark: {
    color: '#FF7875',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FFD700',
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2C2C2C',
  },
  
  // Header Section - Significantly reduced height and improved spacing
  headerContainer: {
    height: 270, // Reduced from 220
    marginBottom: -10, // Reduced overlap
  },
  headerBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerBackgroundImage: {
    borderBottomLeftRadius: 24, // Smaller radius
    borderBottomRightRadius: 24,
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 30, // Reduced from 35
    paddingTop: 50, // Added top padding to push content down
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 12, // Reduced from 14
  },
  avatarContainer: {
    width: 90, // Reduced from 100
    height: 90, // Reduced from 100
    borderRadius: 45, // Adjusted for new size
    backgroundColor: '#FFFFFF',
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Reduced shadow
    shadowOpacity: 0.2, // Reduced shadow opacity
    shadowRadius: 8, // Reduced shadow radius
    elevation: 4, // Reduced elevation
  },
  avatarContainerDark: {
    backgroundColor: '#1E1E1E',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 42, // Adjusted for new container size
  },
  editButton: {
    position: 'absolute',
    bottom: 0, // Adjusted for new container size
    right: 0, // Adjusted for new container size
    width: 28, // Smaller
    height: 28, // Smaller
    borderRadius: 14,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Reduced shadow
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  editButtonDark: {
    backgroundColor: '#FFD700',
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 20, // Reduced from 22
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4, // Reduced from 5
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  studentId: {
    fontSize: 13, // Reduced from 14
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2, // Reduced from 3
  },
  email: {
    fontSize: 11, // Reduced from 12
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },

  // Stats Section - Smaller cards
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 24, // Reduced from 28
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14, // Reduced from 16
    padding: 16, // Reduced from 18
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Reduced shadow
    shadowOpacity: 0.06, // Reduced shadow opacity
    shadowRadius: 6, // Reduced shadow radius
    elevation: 2, // Reduced elevation
  },
  statCardDark: {
    backgroundColor: '#1E1E1E',
  },
  statIconContainer: {
    width: 36, // Reduced from 40
    height: 36, // Reduced from 40
    borderRadius: 18, // Adjusted for new size
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8, // Reduced from 10
  },
  statValue: {
    fontSize: 18, // Reduced from 20
    fontFamily: 'Inter-Bold',
    color: '#2C2C2C',
    marginBottom: 2, // Reduced from 3
  },
  statLabel: {
    fontSize: 10, // Reduced from 11
    fontFamily: 'Inter-Medium',
    color: '#6B6B6B',
    textAlign: 'center',
  },

  // Menu Section - Smaller cards
  menuSection: {
    paddingHorizontal: 24,
    marginBottom: 24, // Reduced from 28
  },
  sectionTitle: {
    fontSize: 17, // Reduced from 18
    fontFamily: 'Inter-Bold',
    color: '#2C2C2C',
    marginBottom: 14, // Reduced from 16
  },
  menuGrid: {
    gap: 8, // Reduced from 10
  },
  menuItemWrapper: {
    borderRadius: 12, // Reduced from 14
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // Reduced from 14
    padding: 14, // Reduced from 16
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, // Reduced shadow opacity
    shadowRadius: 4, // Reduced shadow radius
    elevation: 1,
  },
  menuItemDark: {
    backgroundColor: '#1E1E1E',
  },
  menuIconContainer: {
    width: 36, // Reduced from 40
    height: 36, // Reduced from 40
    borderRadius: 18, // Adjusted for new size
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12, // Reduced from 14
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 14, // Reduced from 15
    fontFamily: 'Inter-SemiBold',
    color: '#2C2C2C',
    marginBottom: 2, // Reduced from 3
  },
  menuItemSubtitle: {
    fontSize: 12, // Reduced from 13
    fontFamily: 'Inter-Regular',
    color: '#6B6B6B',
    lineHeight: 16, // Reduced from 18
  },

  // Logout Section - Smaller button
  logoutSection: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  generateAvatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0F2FE',
    width: '100%',
  },
  generateAvatarButtonDark: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E40AF',
  },
  generateAvatarIconContainer: {
    marginRight: 8,
  },
  generateAvatarText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4D9FFF',
  },
  generateAvatarTextDisabled: {
    opacity: 0.6,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 24, // Reduced from 28
    paddingVertical: 12, // Reduced from 14
    borderRadius: 12, // Reduced from 14
    marginBottom: 12, // Reduced from 14
    borderWidth: 1,
    borderColor: '#FECACA',
    width: '100%',
  },
  logoutButtonDark: {
    backgroundColor: '#2C1F1F',
    borderColor: '#7F1D1D',
  },
  logoutIconContainer: {
    marginRight: 8, // Reduced from 10
  },
  logoutText: {
    fontSize: 14, // Reduced from 15
    fontFamily: 'Inter-SemiBold',
    color: '#FF4D4F',
  },
  version: {
    fontSize: 10, // Reduced from 11
    fontFamily: 'Inter-Regular',
    color: '#6B6B6B',
    textAlign: 'center',
  },

  // Common Text Styles
  textDark: {
    color: '#FFFFFF',
  },
  textLightDark: {
    color: '#A6A6A6',
  },
});