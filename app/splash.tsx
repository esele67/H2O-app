import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { storage } from '@/services/storage';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const token = await storage.getItem('token');
      // small delay to show splash
      setTimeout(() => {
        if (!mounted) return;
        if (token) router.replace('/(tabs)');
        else router.replace('/login');
      }, 3500);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Animated.View entering={FadeIn.duration(1000)} style={styles.logoContainer}>
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} contentFit="contain" />
      </Animated.View>
      <Animated.View entering={FadeInDown.duration(800).delay(400)} style={styles.textContainer}>
        <ThemedText type="title" style={styles.title}>H2O</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>Pure Water Delivery</ThemedText>
      </Animated.View>
      <Animated.View 
        entering={FadeIn.duration(600).delay(800)} 
        style={styles.loader}
      >
        <IconSymbol name="drop.fill" size={24} color="#0a7ea4" />
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0a7ea4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
  },
  textContainer: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#0a7ea4',
  },
  subtitle: {
    color: '#0a7ea4',
    opacity: 0.8,
    fontWeight: '500',
  },
  loader: {
    marginTop: 32,
    opacity: 0.6,
  }
});
