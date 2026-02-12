import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing, useSharedValue } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { storage } from '@/services/storage';

export default function Splash() {
  const router = useRouter();

  // Animated values for water droplets
  const droplet1 = useSharedValue(0);
  const droplet2 = useSharedValue(0);
  const droplet3 = useSharedValue(0);

  useEffect(() => {
    // Droplet animations
    droplet1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }),
        withTiming(0, { duration: 0 })
      ),
      -1,
      false
    );
    droplet2.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 400 }),
        withTiming(1, { duration: 1200, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }),
        withTiming(0, { duration: 0 })
      ),
      -1,
      false
    );
    droplet3.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 800 }),
        withTiming(1, { duration: 1200, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }),
        withTiming(0, { duration: 0 })
      ),
      -1,
      false
    );

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

  const droplet1Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: droplet1.value * 30 },
      { scale: 1 - droplet1.value * 0.3 }
    ],
    opacity: 1 - droplet1.value,
  }));

  const droplet2Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: droplet2.value * 30 },
      { scale: 1 - droplet2.value * 0.3 }
    ],
    opacity: 1 - droplet2.value,
  }));

  const droplet3Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: droplet3.value * 30 },
      { scale: 1 - droplet3.value * 0.3 }
    ],
    opacity: 1 - droplet3.value,
  }));

  return (
    <ThemedView style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#0d47a1', '#1976d2', '#42a5f5']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Animated water drops background */}
        <View style={styles.waterDrop1} />
        <View style={styles.waterDrop2} />
        <View style={styles.waterDrop3} />
        <View style={styles.waterDrop4} />
        <View style={styles.waterDrop5} />

        {/* Main Logo */}
        <Animated.View entering={FadeIn.duration(1000)} style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <View style={styles.waterDropletLogo}>
              <View style={styles.dropletTop} />
              <View style={styles.dropletBottom} />
              <View style={styles.dropletShine} />
            </View>
          </View>
        </Animated.View>

        {/* Brand Text */}
        <Animated.View entering={FadeInDown.duration(800).delay(400)} style={styles.textContainer}>
          <ThemedText style={styles.brandName}>Rainal Global</ThemedText>
          <ThemedText style={styles.tagline}>Pure Hydration, Every Drop</ThemedText>
        </Animated.View>

        {/* Animated Droplets Loader */}
        <Animated.View 
          entering={FadeInUp.duration(600).delay(800)} 
          style={styles.loaderContainer}
        >
          <View style={styles.dropletsRow}>
            <Animated.View style={[styles.loaderDroplet, droplet1Style]} />
            <Animated.View style={[styles.loaderDroplet, droplet2Style]} />
            <Animated.View style={[styles.loaderDroplet, droplet3Style]} />
          </View>
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </Animated.View>

        {/* Bottom Wave Decoration */}
        <View style={styles.bottomWave}>
          <View style={styles.wave1} />
          <View style={styles.wave2} />
        </View>
      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  // Water drops background
  waterDrop1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: 80,
    right: -30,
  },
  waterDrop2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: 180,
    right: 100,
  },
  waterDrop3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: 150,
    left: -20,
  },
  waterDrop4: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    top: 250,
    left: 40,
  },
  waterDrop5: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    bottom: 280,
    right: 60,
  },

  // Logo Container
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
    zIndex: 10,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  waterDropletLogo: {
    width: 70,
    height: 84,
    position: 'relative',
  },
  dropletTop: {
    position: 'absolute',
    top: 0,
    left: 30,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1e88e5',
  },
  dropletBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1e88e5',
  },
  dropletShine: {
    position: 'absolute',
    top: 42,
    left: 20,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },

  // Brand Text
  textContainer: {
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  brandName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#e3f2fd',
    fontWeight: '500',
    letterSpacing: 0.5,
  },

  // Loader
  loaderContainer: {
    marginTop: 48,
    alignItems: 'center',
    gap: 16,
    zIndex: 10,
  },
  dropletsRow: {
    flexDirection: 'row',
    gap: 12,
    height: 40,
    alignItems: 'flex-start',
  },
  loaderDroplet: {
    width: 12,
    height: 16,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    color: '#e3f2fd',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // Bottom Wave Decoration
  bottomWave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    overflow: 'hidden',
  },
  wave1: {
    position: 'absolute',
    bottom: -20,
    left: -50,
    right: -50,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 150,
    transform: [{ scaleX: 2 }],
  },
  wave2: {
    position: 'absolute',
    bottom: -40,
    left: -50,
    right: -50,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 150,
    transform: [{ scaleX: 2 }],
  },
});