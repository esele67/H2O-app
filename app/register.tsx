import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleRegister = async () => {
    if (!name || !password || !email) return alert('Fill required fields');
    if (password.length < 6) return alert('Password too short');
    if (password !== confirm) return alert('Passwords do not match');
    try {
      await register({ name, email, phone, password });
      router.replace('/(tabs)');
    } catch (e) {}
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View entering={FadeInDown.duration(1000)} style={styles.header}>
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} contentFit="contain" />
        <ThemedText type="title" style={styles.title}>Create account</ThemedText>
        <ThemedText style={styles.subtitle}>Join H2O water delivery</ThemedText>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(1000).delay(200)} style={styles.form}>
        <View style={styles.inputContainer}>
          <IconSymbol name="person.fill" size={20} color="#0a7ea4" style={styles.inputIcon} />
          <TextInput
            placeholder="Full name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <IconSymbol name="envelope.fill" size={20} color="#0a7ea4" style={styles.inputIcon} />
          <TextInput
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <IconSymbol name="phone.fill" size={20} color="#0a7ea4" style={styles.inputIcon} />
          <TextInput
            placeholder="Phone number"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            placeholderTextColor="#999"
            keyboardType="phone-pad"
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

        <View style={styles.inputContainer}>
          <IconSymbol name="lock.fill" size={20} color="#0a7ea4" style={styles.inputIcon} />
          <TextInput 
            placeholder="Confirm password" 
            value={confirm} 
            onChangeText={setConfirm} 
            secureTextEntry 
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        <Pressable style={styles.button} onPress={handleRegister}>
          <ThemedText style={styles.buttonText}>Create account</ThemedText>
        </Pressable>

        <Link href="/login" style={styles.link}>
          <ThemedText style={styles.linkText}>Already have an account? Sign in</ThemedText>
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
    marginBottom: 32,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 16,
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
    gap: 12,
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
