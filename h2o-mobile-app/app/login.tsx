import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, TextInput, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeInDown, FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Water wave animation values
  const wave1 = useSharedValue(0);
  const wave2 = useSharedValue(0);
  const wave3 = useSharedValue(0);
  const droplet1 = useSharedValue(0);
  const droplet2 = useSharedValue(0);
  const droplet3 = useSharedValue(0);

  useEffect(() => {
    if (loading) {
      // Wave animations
      wave1.value = withRepeat(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      wave2.value = withRepeat(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      wave3.value = withRepeat(
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );

      // Droplet animations
      droplet1.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      );
      droplet2.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 300 }),
          withTiming(1, { duration: 800, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      );
      droplet3.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 600 }),
          withTiming(1, { duration: 800, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      );
    } else {
      wave1.value = 0;
      wave2.value = 0;
      wave3.value = 0;
      droplet1.value = 0;
      droplet2.value = 0;
      droplet3.value = 0;
    }
  }, [loading]);

  const wave1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: wave1.value * -8 }],
    opacity: 0.6 + wave1.value * 0.4,
  }));

  const wave2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: wave2.value * -6 }],
    opacity: 0.5 + wave2.value * 0.5,
  }));

  const wave3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: wave3.value * -10 }],
    opacity: 0.4 + wave3.value * 0.6,
  }));

  const droplet1Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: droplet1.value * 20 },
      { scale: 1 - droplet1.value * 0.5 }
    ],
    opacity: 1 - droplet1.value,
  }));

  const droplet2Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: droplet2.value * 20 },
      { scale: 1 - droplet2.value * 0.5 }
    ],
    opacity: 1 - droplet2.value,
  }));

  const droplet3Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: droplet3.value * 20 },
      { scale: 1 - droplet3.value * 0.5 }
    ],
    opacity: 1 - droplet3.value,
  }));

  const handleLogin = async () => {
    if (!identifier || !password) return alert('Fill required fields');
    setLoading(true);
    try {
      await login({ identifier, password });
      router.replace('/(tabs)');
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Gradient */}
          <LinearGradient
            colors={['#0d47a1', '#1976d2', '#42a5f5']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Animated water drops background */}
            <View style={styles.waterDrop1} />
            <View style={styles.waterDrop2} />
            <View style={styles.waterDrop3} />
            <View style={styles.waterDrop4} />

            <Animated.View entering={FadeIn.duration(1000)} style={styles.logoContainer}>
              {/* Water Droplet Logo */}
              <View style={styles.logoCircle}>
                <View style={styles.waterDropletLogo}>
                  <View style={styles.dropletTop} />
                  <View style={styles.dropletBottom} />
                  <View style={styles.dropletShine} />
                </View>
              </View>

              <ThemedText style={styles.brandName}>Rainal Global</ThemedText>
              <ThemedText style={styles.brandTagline}>Pure Hydration, Every Drop</ThemedText>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(1000).delay(200)} style={styles.welcomeSection}>
              <ThemedText style={styles.welcomeTitle}>Welcome Back!</ThemedText>
              <ThemedText style={styles.welcomeSubtitle}>Sign in to continue your hydration journey</ThemedText>
            </Animated.View>
          </LinearGradient>

          {/* Login Form */}
          <Animated.View entering={FadeInDown.duration(1000).delay(400)} style={styles.formContainer}>
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <ThemedText style={styles.inputLabel}>Email Address</ThemedText>
                <View style={styles.inputContainer}>
                  <IconSymbol name="person.fill" size={20} color="#1e88e5" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Email"
                    value={identifier}
                    onChangeText={setIdentifier}
                    style={styles.input}
                    placeholderTextColor="#90CAF9"
                  />
                </View>
              </View>
              
              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <ThemedText style={styles.inputLabel}>Password</ThemedText>
                <View style={styles.inputContainer}>
                  <IconSymbol name="lock.fill" size={20} color="#1e88e5" style={styles.inputIcon} />
                  <TextInput 
                    placeholder="Password" 
                    value={password} 
                    onChangeText={setPassword} 
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    placeholderTextColor="#90CAF9"
                  />
                  <Pressable 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <IconSymbol 
                      name={showPassword ? "eye.slash.fill" : "eye.fill"} 
                      size={20} 
                      color="#1e88e5" 
                    />
                  </Pressable>
                </View>
              </View>

              {/* Login Button */}
              <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
                <LinearGradient
                  colors={loading ? ['#90CAF9', '#64B5F6'] : ['#1e88e5', '#1976d2']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <View style={styles.loaderContainer}>
                      <View style={styles.waterLoader}>
                        <Animated.View style={[styles.wave, styles.wave1, wave1Style]} />
                        <Animated.View style={[styles.wave, styles.wave2, wave2Style]} />
                        <Animated.View style={[styles.wave, styles.wave3, wave3Style]} />
                      </View>
                      <View style={styles.dropletsContainer}>
                        <Animated.View style={[styles.droplet, styles.droplet1, droplet1Style]} />
                        <Animated.View style={[styles.droplet, styles.droplet2, droplet2Style]} />
                        <Animated.View style={[styles.droplet, styles.droplet3, droplet3Style]} />
                      </View>
                      <ThemedText style={styles.buttonText}>Loading...</ThemedText>
                    </View>
                  ) : (
                    <View style={styles.buttonContent}>
                      <IconSymbol name="arrow.right.circle.fill" size={20} color="#fff" />
                      <ThemedText style={styles.buttonText}>Login</ThemedText>
                    </View>
                  )}
                </LinearGradient>
              </Pressable>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <ThemedText style={styles.dividerText}>or</ThemedText>
                <View style={styles.dividerLine} />
              </View>

              {/* Register Link */}
              <Link href="/register" style={styles.link}>
                <ThemedText style={styles.linkText}>New user? Create account</ThemedText>
              </Link>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#e3f2fd',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Header Section
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },

  // Water drops background
  waterDrop1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: 30,
    right: -20,
  },
  waterDrop2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: 100,
    right: 80,
  },
  waterDrop3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: 20,
    left: -10,
  },
  waterDrop4: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    top: 150,
    left: 30,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    zIndex: 10,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  waterDropletLogo: {
    width: 50,
    height: 60,
    position: 'relative',
  },
  dropletTop: {
    position: 'absolute',
    top: 0,
    left: 20,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dropletBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  dropletShine: {
    position: 'absolute',
    top: 30,
    left: 15,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 14,
    color: '#e3f2fd',
    fontWeight: '500',
  },

  welcomeSection: {
    alignItems: 'center',
    zIndex: 10,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#e3f2fd',
    textAlign: 'center',
    opacity: 0.9,
  },

  // Form Container
  formContainer: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  form: { 
    width: '100%',
    gap: 20,
    paddingBottom: 40,
  },

  // Input Fields
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e88e5',
    marginLeft: 4,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#bbdefb',
    paddingHorizontal: 16,
    shadowColor: '#1e88e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: { 
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#1565c0',
    fontWeight: '500',
  },
  eyeButton: {
    padding: 8,
  },

  // Button
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#1e88e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

  // Loader
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  waterLoader: {
    width: 24,
    height: 24,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wave: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  wave1: {
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  wave2: {
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  wave3: {
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  dropletsContainer: {
    flexDirection: 'row',
    gap: 4,
    height: 24,
    alignItems: 'flex-start',
  },
  droplet: {
    width: 6,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 3,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  droplet1: {
    marginTop: 2,
  },
  droplet2: {
    marginTop: 0,
  },
  droplet3: {
    marginTop: 4,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#bbdefb',
  },
  dividerText: {
    fontSize: 14,
    color: '#90CAF9',
    fontWeight: '500',
  },

  // Register Link
  link: {
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  linkText: {
    color: '#1e88e5',
    fontSize: 16,
    fontWeight: '600',
  },
});