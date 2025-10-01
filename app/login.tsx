import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!identifier || !password) return alert('Fill required fields');
    try {
      await login({ identifier, password });
      router.replace('/(tabs)');
    } catch (e) {}
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View entering={FadeInDown.duration(1000)} style={styles.header}>
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} contentFit="contain" />
        <ThemedText type="title" style={styles.title}>Welcome back</ThemedText>
        <ThemedText style={styles.subtitle}>Sign in to continue</ThemedText>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(1000).delay(200)} style={styles.form}>
        <View style={styles.inputContainer}>
          <IconSymbol name="person.fill" size={20} color="#0a7ea4" style={styles.inputIcon} />
          <TextInput
            placeholder="Email"
            value={identifier}
            onChangeText={setIdentifier}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <IconSymbol name="lock.fill" size={20} color="#0a7ea4" style={styles.inputIcon} />
          <TextInput 
            placeholder="Password" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        <Pressable style={styles.button} onPress={handleLogin}>
          <ThemedText style={styles.buttonText}>Login</ThemedText>
        </Pressable>

        <Link href="/register" style={styles.link}>
          <ThemedText style={styles.linkText}>New user? Create account</ThemedText>
        </Link>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    color: '#0a7ea4',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: { 
    width: '100%',
    gap: 16,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: { 
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  linkText: {
    color: '#0a7ea4',
    fontSize: 16,
  },
});
