import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Linking, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Info, Mail, Globe, Copyright, Shield, Zap, Users, CreditCard, Award, Heart } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { AppLogo } from '../components/auth/AppLogo';


const { width: screenWidth } = Dimensions.get('window');

export default function AboutScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleEmailContact = () => {
    Linking.openURL('mailto:support@deltacoin.edu.bd');
  };

  const handleWebsiteVisit = () => {
    Linking.openURL('https://eastdelta.edu.bd');
  };

  const features = [
    {
      icon: <Shield size={24} color="#4D9FFF" />,
      title: 'Secure Transactions',
      description: 'Bank-level security with encrypted payments and PIN protection'
    },
    {
      icon: <Zap size={24} color="#10B981" />,
      title: 'Instant Payments',
      description: 'Lightning-fast transactions across campus facilities'
    },
    {
      icon: <Users size={24} color="#A78BFA" />,
      title: 'Social Features',
      description: 'Send money to friends and manage group expenses easily'
    },
    {
      icon: <CreditCard size={24} color="#F59E0B" />,
      title: 'Multiple Top-up Options',
      description: 'Add funds via bank transfer, cards, or mobile banking'
    },
    {
      icon: <Award size={24} color="#EF4444" />,
      title: 'Smart Analytics',
      description: 'Track spending patterns and manage budgets effectively'
    },
    {
      icon: <Heart size={24} color="#EC4899" />,
      title: 'Student-Centric',
      description: 'Designed specifically for university life and needs'
    }
  ];

  return (
    <ScrollView 
      style={[styles.container, isDark && styles.containerDark]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View 
        entering={FadeInUp.duration(600)}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#2C2C2C'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>About</Text>
        <View style={styles.headerSpacer} />
      </Animated.View>

      {/* App Logo and Version */}
      <Animated.View 
        entering={FadeInDown.delay(200).duration(600)}
        style={styles.logoSection}
      >
        <AppLogo />
        <Text style={[styles.appVersion, isDark && styles.appVersionDark]}>
          Version 1.0.0
        </Text>
        <Text style={[styles.appTagline, isDark && styles.appTaglineDark]}>
          Your Digital Campus Wallet
        </Text>
      </Animated.View>

      

      {/* Description */}
      <Animated.View 
        entering={FadeInDown.delay(600).duration(600)}
        style={[styles.section, isDark && styles.sectionDark]}
      >
        <View style={styles.sectionHeader}>
          <Info size={20} color="#FFD700" />
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            About Delta Coin
          </Text>
        </View>
        <Text style={[styles.description, isDark && styles.descriptionDark]}>
          Delta Coin is the official digital payment solution for East Delta University students. 
          Designed to simplify campus life, our app enables seamless transactions across all 
          university facilities including canteens, libraries, labs, and student clubs.
        </Text>
        <Text style={[styles.description, isDark && styles.descriptionDark]}>
          Built with cutting-edge technology and student-first design principles, Delta Coin 
          transforms how you manage money on campus while providing powerful analytics to 
          help you budget and spend wisely.
        </Text>
      </Animated.View>

      {/* Key Features */}
      <Animated.View 
        entering={FadeInDown.delay(800).duration(600)}
        style={[styles.section, isDark && styles.sectionDark]}
      >
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          Key Features
        </Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(1000 + index * 100).duration(400)}
              style={[styles.featureCard, isDark && styles.featureCardDark]}
            >
              <View style={styles.featureIcon}>
                {feature.icon}
              </View>
              <Text style={[styles.featureTitle, isDark && styles.featureTitleDark]}>
                {feature.title}
              </Text>
              <Text style={[styles.featureDescription, isDark && styles.featureDescriptionDark]}>
                {feature.description}
              </Text>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* University Information */}
      <Animated.View 
        entering={FadeInDown.delay(1400).duration(600)}
        style={[styles.section, isDark && styles.sectionDark]}
      >
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          East Delta University
        </Text>
        <Text style={[styles.description, isDark && styles.descriptionDark]}>
          East Delta University is a leading private university in Bangladesh, committed to 
          providing quality education and fostering innovation. Delta Coin represents our 
          dedication to embracing technology for enhanced student experiences.
        </Text>
        <TouchableOpacity 
          style={[styles.linkButton, isDark && styles.linkButtonDark]}
          onPress={handleWebsiteVisit}
        >
          <Globe size={20} color="#4D9FFF" />
          <Text style={[styles.linkText, isDark && styles.linkTextDark]}>
            Visit University Website
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Contact & Support */}
      <Animated.View 
        entering={FadeInDown.delay(1600).duration(600)}
        style={[styles.section, isDark && styles.sectionDark]}
      >
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          Contact & Support
        </Text>
        <Text style={[styles.description, isDark && styles.descriptionDark]}>
          Need help or have questions? Our support team is here to assist you with any 
          issues or inquiries about Delta Coin.
        </Text>
        
        <View style={styles.contactOptions}>
          <TouchableOpacity 
            style={[styles.contactButton, isDark && styles.contactButtonDark]}
            onPress={handleEmailContact}
          >
            <Mail size={20} color="#10B981" />
            <View style={styles.contactInfo}>
              <Text style={[styles.contactTitle, isDark && styles.contactTitleDark]}>
                Email Support
              </Text>
              <Text style={[styles.contactDetail, isDark && styles.contactDetailDark]}>
                support@deltacoin.edu.bd
              </Text>
            </View>
          </TouchableOpacity>

          <View style={[styles.contactButton, isDark && styles.contactButtonDark]}>
            <Info size={20} color="#F59E0B" />
            <View style={styles.contactInfo}>
              <Text style={[styles.contactTitle, isDark && styles.contactTitleDark]}>
                Office Hours
              </Text>
              <Text style={[styles.contactDetail, isDark && styles.contactDetailDark]}>
                Sunday - Thursday, 9:00 AM - 5:00 PM
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Legal & Privacy */}
      <Animated.View 
        entering={FadeInDown.delay(1800).duration(600)}
        style={[styles.section, isDark && styles.sectionDark]}
      >
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          Privacy & Security
        </Text>
        <Text style={[styles.description, isDark && styles.descriptionDark]}>
          Your privacy and security are our top priorities. Delta Coin employs industry-standard 
          encryption and security measures to protect your personal information and financial data.
        </Text>
        <Text style={[styles.description, isDark && styles.descriptionDark]}>
          All transactions are processed securely, and we never store sensitive payment information 
          on our servers. Your data is handled in accordance with international privacy standards.
        </Text>
      </Animated.View>

      {/* Footer */}
      <Animated.View 
        entering={FadeInDown.delay(2000).duration(600)}
        style={styles.footer}
      >
        <View style={styles.footerContent}>
          <Copyright size={16} color={isDark ? '#A6A6A6' : '#6B7280'} />
          <Text style={[styles.footerText, isDark && styles.footerTextDark]}>
            2025 East Delta University. All rights reserved.
          </Text>
        </View>
        <Text style={[styles.footerSubtext, isDark && styles.footerSubtextDark]}>
          Made with ❤️ for EDU students
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2C2C2C',
  },
  headerTitleDark: {
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  appVersion: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 16,
  },
  appVersionDark: {
    color: '#A6A6A6',
  },
  appTagline: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#4D9FFF',
    marginTop: 8,
    textAlign: 'center',
  },
  appTaglineDark: {
    color: '#82B1FF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionDark: {
    backgroundColor: '#1E1E1E',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#2C2C2C',
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  descriptionDark: {
    color: '#D1D5DB',
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  featureCardDark: {
    backgroundColor: '#2E2E2E',
    borderColor: '#374151',
  },
  featureIcon: {
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  featureTitleDark: {
    color: '#FFFFFF',
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  featureDescriptionDark: {
    color: '#A6A6A6',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  linkButtonDark: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E40AF',
  },
  linkText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#4D9FFF',
  },
  linkTextDark: {
    color: '#82B1FF',
  },
  contactOptions: {
    gap: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactButtonDark: {
    backgroundColor: '#2E2E2E',
    borderColor: '#374151',
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  contactTitleDark: {
    color: '#FFFFFF',
  },
  contactDetail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  contactDetailDark: {
    color: '#A6A6A6',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  footerTextDark: {
    color: '#A6A6A6',
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  footerSubtextDark: {
    color: '#6B7280',
  },
});