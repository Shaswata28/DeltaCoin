import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { FormInput } from '@/components/common/FormInput';
import { Button } from '@/components/common/Button';
import { getCurrentUserProfile, updateUserProfile } from '@/supabase/auth';
import { User } from '@/supabase/client';
import { validateName, validatePhone } from '@/utils/validation';

export default function EditProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    contact_number: '',
  });
  const [errors, setErrors] = useState({
    full_name: '',
    contact_number: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getCurrentUserProfile();
        if (profile) {
          setProfileData(profile);
          setFormData({
            full_name: profile.full_name,
            contact_number: profile.contact_number,
          });
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data.');
      }
    };

    fetchProfile();
  }, []);

  const validateForm = (): boolean => {
    const newErrors = {
      full_name: '',
      contact_number: '',
    };

    if (!validateName(formData.full_name)) {
      newErrors.full_name = 'Please enter a valid full name (letters and spaces only)';
    }

    if (!validatePhone(formData.contact_number)) {
      newErrors.contact_number = 'Please enter a valid Bangladesh phone number';
    }

    setErrors(newErrors);
    return !newErrors.full_name && !newErrors.contact_number;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    // Check if any changes were made
    if (
      formData.full_name === profileData?.full_name &&
      formData.contact_number === profileData?.contact_number
    ) {
      Alert.alert('No Changes', 'No changes were made to save.');
      return;
    }

    try {
      await updateUserProfile({
        full_name: formData.full_name,
        contact_number: formData.contact_number,
      });
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      Alert.alert('Error', err.message || 'Failed to update profile.');
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer, isDark && styles.containerDark]}>
        <Text style={[styles.errorText, isDark && styles.errorTextDark]}>{error}</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

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
        <Text style={[styles.title, isDark && styles.titleDark]}>Edit Profile</Text>
      </View>

      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        style={styles.content}
      >
        <View style={[styles.profileCard, isDark && styles.profileCardDark]}>
          {/* Editable Fields */}
          <View style={[styles.editableSection, isDark && styles.editableSectionDark]}>
            <FormInput
              label="Full Name"
              value={formData.full_name}
              onChangeText={(text) => handleInputChange('full_name', text)}
              placeholder="Enter your full name"
              error={errors.full_name}
              style={styles.formInput}
            />
            
            <FormInput
              label="Contact Number"
              value={formData.contact_number}
              onChangeText={(text) => handleInputChange('contact_number', text)}
              placeholder="Enter your contact number"
              keyboardType="phone-pad"
              error={errors.contact_number}
              style={styles.formInput}
            />
          </View>

          {/* Divider */}
          <View style={[styles.divider, isDark && styles.dividerDark]} />

        

          {/* Read-Only Fields */}
          <View style={styles.readOnlySection}>
            <View style={[styles.readOnlyField, isDark && styles.readOnlyFieldDark]}>
              <Text style={[styles.fieldLabel, isDark && styles.fieldLabelDark]}>Student ID</Text>
              <Text style={[styles.fieldValue, isDark && styles.fieldValueDark]}>
                {profileData?.student_id}
              </Text>
            </View>
            
            <View style={[styles.readOnlyField, isDark && styles.readOnlyFieldDark]}>
              <Text style={[styles.fieldLabel, isDark && styles.fieldLabelDark]}>University Email</Text>
              <Text style={[styles.fieldValue, isDark && styles.fieldValueDark]}>
                {profileData?.student_id}@eastdelta.edu.bd
              </Text>
            </View>
            
            <View style={[styles.readOnlyField, isDark && styles.readOnlyFieldDark]}>
              <Text style={[styles.fieldLabel, isDark && styles.fieldLabelDark]}>Username</Text>
              <Text style={[styles.fieldValue, isDark && styles.fieldValueDark]}>
                {profileData?.username}
              </Text>
            </View>
          </View>
        </View>

        <Button
          title='Save Changes'
          onPress={handleSave}
          style={styles.saveButton}
          variant="secondary"
        />
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileCardDark: {
    backgroundColor: '#1E1E1E',
  },
  editableSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  editableSectionDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#374151',
  },
  formInput: {
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  dividerDark: {
    backgroundColor: '#374151',
  },
  readOnlySection: {
    gap: 16,
  },
  readOnlyField: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  readOnlyFieldDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#374151',
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  fieldLabelDark: {
    color: '#9CA3AF',
  },
  fieldValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2C2C2C',
  },
  fieldValueDark: {
    color: '#FFFFFF',
  },
  saveButton: {
    marginTop: 16,
    marginBottom: 20,
  },
});