import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import api from '../../services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const p = await api.getProducts();
      setProduct(p[0]);
    })();
  }, []);

  if (!product)
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section with Gradient */}
        <LinearGradient
          colors={['#1e5a8e', '#2d7ab8', '#4a9fd8']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <Image 
              source={require('@/assets/images/logo-white.png')} 
              style={styles.logo}
              contentFit="contain"
            />
            <View style={styles.topIcons}>
              <Pressable style={styles.iconButton}>
                <IconSymbol name="bell" size={24} color="#fff" />
              </Pressable>
              <Pressable style={styles.iconButton}>
                <Image 
                  source={require('@/assets/images/water-drop-icon.png')} 
                  style={styles.waterDropIcon}
                  contentFit="contain"
                />
              </Pressable>
            </View>
          </View>

          {/* Hero Content */}
          <View style={styles.heroContent}>
            <View style={styles.heroText}>
              <ThemedText style={styles.heroTitle}>Hydrated</ThemedText>
              <ThemedText style={styles.heroTitle}>All Along</ThemedText>
              <ThemedText style={styles.heroSubtitle}>Nestle</ThemedText>
              <ThemedText style={styles.heroTagline}>Pure Life</ThemedText>
            </View>
            <View style={styles.heroImageContainer}>
              <Image 
                source={require('@/assets/images/hero-water-bottle.png')} 
                style={styles.heroImage}
                contentFit="contain"
              />
            </View>
          </View>

          {/* Decorative Elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
        </LinearGradient>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Specially for you Card */}
          <Animated.View entering={FadeIn.duration(800).delay(200)}>
            <ThemedText style={styles.sectionTitle}>Specially for you</ThemedText>
            <Pressable style={styles.promoCard}>
              <LinearGradient
                colors={['#00b4d8', '#0096c7', '#0077b6']}
                style={styles.promoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.promoContent}>
                  <View style={styles.promoImages}>
                    <Image 
                      source={require('@/assets/images/promo-bottle-1.png')} 
                      style={styles.promoBottle1}
                      contentFit="contain"
                    />
                    <Image 
                      source={require('@/assets/images/promo-bottle-2.png')} 
                      style={styles.promoBottle2}
                      contentFit="contain"
                    />
                  </View>
                  <View style={styles.promoTextContainer}>
                    <ThemedText style={styles.promoText}>Makes your</ThemedText>
                    <ThemedText style={styles.promoText}>life better</ThemedText>
                    <ThemedText style={styles.promoPrice}>from $0.5</ThemedText>
                    <ThemedText style={styles.promoDiscount}>$1.4</ThemedText>
                  </View>
                </View>
                {/* Water Drop Background */}
                <Image 
                  source={require('@/assets/images/water-drop-bg.png')} 
                  style={styles.waterDropBg}
                  contentFit="cover"
                />
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Catalog Section */}
          <Animated.View entering={FadeIn.duration(800).delay(400)}>
            <View style={styles.catalogHeader}>
              <ThemedText style={styles.sectionTitle}>Catalog</ThemedText>
              <Pressable>
                <ThemedText style={styles.viewAllText}>View all</ThemedText>
              </Pressable>
            </View>
            
            <View style={styles.catalogGrid}>
              <Pressable style={styles.catalogItem}>
                <Image 
                  source={require('@/assets/images/catalog-gallon.png')} 
                  style={styles.catalogImage}
                  contentFit="contain"
                />
              </Pressable>
              <Pressable style={styles.catalogItem}>
                <Image 
                  source={require('@/assets/images/catalog-bottle.png')} 
                  style={styles.catalogImage}
                  contentFit="contain"
                />
              </Pressable>
              <Pressable style={styles.catalogItem}>
                <Image 
                  source={require('@/assets/images/catalog-small.png')} 
                  style={styles.catalogImage}
                  contentFit="contain"
                />
              </Pressable>
            </View>
          </Animated.View>

          {/* Order Section with Original Functionality */}
          <Animated.View entering={FadeIn.duration(800).delay(600)} style={styles.orderSection}>
            <View style={styles.orderCard}>
              <View style={styles.productImageContainer}>
                <Image source={{ uri: product.img }} style={styles.productImage} contentFit="contain" />
                {product.available && (
                  <View style={styles.badge}>
                    <ThemedText style={styles.badgeText}>Available</ThemedText>
                  </View>
                )}
              </View>

              <View style={styles.orderContent}>
                <ThemedText type="subtitle" style={styles.productName}>{product.name}</ThemedText>
                <ThemedText style={styles.description}>{product.description}</ThemedText>
                
                <View style={styles.priceRow}>
                  <ThemedText type="subtitle" style={styles.price}>₦{product.price.toFixed(2)}</ThemedText>
                  <View style={styles.qtyContainer}>
                    <Pressable
                      style={[styles.qtyBtn, qty === 1 && styles.qtyBtnDisabled]}
                      onPress={() => setQty(Math.max(1, qty - 1))}
                    >
                      <IconSymbol name="minus" size={20} color={qty === 1 ? '#999' : '#0a7ea4'} />
                    </Pressable>
                    
                    <ThemedText style={styles.qtyText}>{qty}</ThemedText>
                    
                    <Pressable style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
                      <IconSymbol name="plus" size={20} color="#0a7ea4" />
                    </Pressable>
                  </View>
                </View>

                <Pressable 
                  style={styles.orderButton}
                  onPress={() => router.push({ pathname: '/checkout', params: { productId: product.id, qty } })}
                >
                  <IconSymbol name="cart.fill" size={20} color="#fff" style={styles.orderIcon} />
                  <ThemedText style={styles.orderText}>Order Now</ThemedText>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem}>
          <IconSymbol name="house.fill" size={24} color="#0a7ea4" />
          <ThemedText style={styles.navTextActive}>Home</ThemedText>
        </Pressable>
        <Pressable style={styles.navItem}>
          <IconSymbol name="cart" size={24} color="#999" />
          <ThemedText style={styles.navText}>Cart</ThemedText>
        </Pressable>
        <Pressable style={styles.navItem}>
          <IconSymbol name="person" size={24} color="#999" />
          <ThemedText style={styles.navText}>Profile</ThemedText>
        </Pressable>
        <Pressable style={styles.navItem}>
          <IconSymbol name="clock" size={24} color="#999" />
          <ThemedText style={styles.navText}>History</ThemedText>
        </Pressable>
        <Pressable style={styles.navItem}>
          <IconSymbol name="ellipsis" size={24} color="#999" />
          <ThemedText style={styles.navText}>More</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f7fa',
  },
  
  // Header Gradient Section
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 30,
  },
  topIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterDropIcon: {
    width: 24,
    height: 24,
  },
  
  // Hero Section
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 42,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#fff',
    marginTop: 8,
    fontWeight: '600',
  },
  heroTagline: {
    fontSize: 14,
    color: '#e0f4ff',
    marginTop: 2,
  },
  heroImageContainer: {
    width: 180,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  
  // Decorative Elements
  decorativeCircle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: -30,
    right: -40,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    bottom: 20,
    left: -20,
  },
  
  // Main Content
  mainContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  
  // Promo Card
  promoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  promoGradient: {
    padding: 20,
    height: 140,
    position: 'relative',
    overflow: 'hidden',
  },
  promoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  promoImages: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  promoBottle1: {
    width: 50,
    height: 90,
  },
  promoBottle2: {
    width: 45,
    height: 100,
  },
  promoTextContainer: {
    alignItems: 'flex-end',
  },
  promoText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 24,
  },
  promoPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginTop: 4,
  },
  promoDiscount: {
    fontSize: 14,
    color: '#e0f4ff',
    textDecorationLine: 'line-through',
  },
  waterDropBg: {
    position: 'absolute',
    width: 120,
    height: 120,
    right: -20,
    bottom: -20,
    opacity: 0.2,
  },
  
  // Catalog Section
  catalogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#0a7ea4',
    fontWeight: '500',
  },
  catalogGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  catalogItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  catalogImage: {
    width: 50,
    height: 60,
  },
  
  // Order Section
  orderSection: {
    marginTop: 8,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  productImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  productImage: { 
    width: 180, 
    height: 180,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 20,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  orderContent: {
    gap: 12,
  },
  productName: {
    fontSize: 22,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 26,
    color: '#0a7ea4',
    fontWeight: '700',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderRadius: 10,
    padding: 6,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  qtyBtnDisabled: {
    opacity: 0.5,
  },
  qtyText: {
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  orderButton: {
    backgroundColor: '#0a7ea4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  orderIcon: {
    marginRight: 8,
  },
  orderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 11,
    color: '#999',
  },
  navTextActive: {
    fontSize: 11,
    color: '#0a7ea4',
    fontWeight: '600',
  },
});