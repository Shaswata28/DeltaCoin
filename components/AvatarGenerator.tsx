import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, useColorScheme, Alert } from 'react-native';
import { Image } from 'react-native';
import { RefreshCw } from 'lucide-react-native';
import { supabase } from '@/supabase/client';
import { getCurrentUser } from '@/supabase/auth';

export default function AvatarGenerator() {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const isDark = useColorScheme() === 'dark';

  const generateAvatar = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) throw new Error('No user logged in');
      console.log('Starting avatar generation for user:', user.id);

      // Try multiple avatar services as fallback
      const avatarServices = [
        `https://api.dicebear.com/7.x/avataaars/png?seed=${user.id}&size=200`,
        `https://api.dicebear.com/7.x/personas/png?seed=${user.id}&size=200`,
        `https://robohash.org/${user.id}.png?size=200x200`,
        `https://ui-avatars.com/api/?name=${user.id}&size=200&background=random`
      ];

      let imageResponse: Response | null = null;
      let usedService = '';

      // Try each service until one works
      for (let i = 0; i < avatarServices.length; i++) {
        try {
          console.log(`Trying avatar service ${i + 1}:`, avatarServices[i]);
          const response = await fetch(avatarServices[i], {
            method: 'GET',
            headers: {
              'Accept': 'image/png, image/jpeg, image/*',
              'User-Agent': 'DeltaCoin-App/1.0'
            }
          });
          console.log(`Service ${i + 1} response status:`, response.status);
          if (response.ok) {
            imageResponse = response;
            usedService = avatarServices[i];
            console.log(`Successfully got image from service ${i + 1}`);
            break;
          }
        } catch (serviceError) {
          console.log(`Service ${i + 1} failed:`, serviceError);
          continue;
        }
      }

      if (!imageResponse) {
        throw new Error('Failed to generate avatar from all services');
      }

      // Test Supabase storage access first
      try {
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        if (bucketsError) throw new Error(`Storage access failed: ${bucketsError.message}`);
        console.log('Storage accessible, buckets:', buckets?.map(b => b.name));
      } catch (storageError) {
        console.error('Storage test failed:', storageError);
        throw new Error('Cannot access storage. Please check your connection.');
      }

      // Upload with unique filename to avoid conflicts
      const timestamp = Date.now();
      const filePath = `avatar-${user.id}-${timestamp}.png`;
      console.log('Uploading to path:', filePath);

      // Convert response to blob and upload directly
      const blob = await imageResponse.blob();
      
      // Upload the blob directly
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, {
          cacheControl: '3600',
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;
      console.log('Public URL generated:', publicUrl);

      // Update user profile
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_picture_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        // Don't fail completely - image is uploaded
        Alert.alert(
          'Partial Success',
          'Avatar uploaded but profile update failed. Please refresh the app.'
        );
      } else {
        console.log('Profile updated successfully');
      }

      setAvatarUrl(publicUrl);
      Alert.alert(
        'Success',
        `New avatar generated using ${
          usedService.includes('dicebear')
            ? 'DiceBear'
            : usedService.includes('robohash')
            ? 'RoboHash'
            : 'UI Avatars'
        }!`
      );
    } catch (err: any) {
      console.error('Avatar generation error:', err);
      let errorMessage = 'Failed to generate avatar. ';
      if (err.message.includes('Network request failed') || err.message.includes('fetch')) {
        errorMessage += 'Please check your internet connection and try again.';
      } else if (err.message.includes('Storage')) {
        errorMessage += 'Storage service unavailable. Please try again later.';
      } else if (err.message.includes('auth') || err.message.includes('JWT')) {
        errorMessage += 'Authentication expired. Please log out and log back in.';
      } else {
        errorMessage += err.message || 'Please try again later.';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ alignItems: 'center', marginTop: 16 }}>
      {avatarUrl && (
        <Image
          source={{ uri: avatarUrl }}
          style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 12 }}
        />
      )}
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isDark ? '#1E3A8A' : '#F0F7FF',
          borderColor: isDark ? '#1E40AF' : '#E0F2FE',
          borderWidth: 1,
          borderRadius: 12,
          paddingVertical: 10,
          paddingHorizontal: 16,
        }}
        onPress={generateAvatar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#4D9FFF" />
        ) : (
          <>
            <RefreshCw size={16} color="#4D9FFF" style={{ marginRight: 6 }} />
            <Text style={{ color: '#4D9FFF', fontFamily: 'Inter-SemiBold' }}>
              Generate Avatar
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}