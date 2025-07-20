import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';

export function SignUpLink() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <Text style={[styles.text, isDark && styles.textDark]}>
        Don't have an account?{' '}
      </Text>
      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={[styles.link, isDark && styles.linkDark]}>
          Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B6B6B',
  },
  textDark: {
    color: '#A6A6A6',
  },
  link: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4D9FFF',
  },
  linkDark: {
    color: '#82B1FF',
  },
});