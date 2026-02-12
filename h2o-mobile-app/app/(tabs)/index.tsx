import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'react-native';
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
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDrop}>
            <View style={styles.dropletTop} />
            <View style={styles.dropletBottom} />
            <View style={styles.dropletShine} />
          </View>
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      </ThemedView>
    );

  const specialProducts = [
    { id: '1', name: 'Pure Life', volume: '10L, 10L', size: '10 L', price: '1,500', image: require('../../assets/images/pure-life-bottle.png') },
    { id: '2', name: 'Sparkling', volume: '330ml', size: '330ml', price: '500', image: require('../../assets/images/evian-bottle.png'), discount: '25% OFF' },
    { id: '3', name: 'Premium', volume: '5L', size: '5 L', price: '800', image: require('../../assets/images/pure-life-bottle.png') },
    { id: '4', name: 'Classic', volume: '1.5L', size: '1.5 L', price: '350', image: require('../../assets/images/evian-bottle.png') },
    { id: '5', name: 'Mini Pack', volume: '500ml x 6', size: '500ml', price: '1,200', image: require('../../assets/images/pure-life-bottle.png'), discount: '15% OFF' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Creative Header Section */}
        <LinearGradient
          colors={['#0d47a1', '#1976d2', '#42a5f5']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Animated water drops */}
          <View style={styles.waterDrop1} />
          <View style={styles.waterDrop2} />
          <View style={styles.waterDrop3} />
          <View style={styles.waterDrop4} />
          <View style={styles.waterDrop5} />
          
          <View style={styles.headerTop}>
            <View style={styles.brandContainer}>
              <View style={styles.logoCircle}>
                <View style={styles.waterDropletLogo}>
                  <View style={styles.dropletTop} />
                  <View style={styles.dropletBottom} />
                  <View style={styles.dropletShine} />
                </View>
              </View>
              <View>
                <ThemedText style={styles.brandName}>Rainal Global</ThemedText>
                <ThemedText style={styles.brandTagline}>Pure Hydration, Every Drop</ThemedText>
              </View>
            </View>
            
            <View style={styles.headerIcons}>
              <Pressable style={styles.iconButton}>
                <IconSymbol name="bell.fill" size={22} color="#fff" />
                <View style={styles.notificationDot} />
              </Pressable>
              
              <View style={styles.mascotContainer}>
                <View style={styles.mascotCircle}>
                  <View style={styles.mascot}>
                    <View style={styles.mascotBody}>
                      <View style={styles.mascotEyeLeft}>
                        <View style={styles.mascotPupil} />
                      </View>
                      <View style={styles.mascotEyeRight}>
                        <View style={styles.mascotPupil} />
                      </View>
                      <View style={styles.mascotSmile} />
                      <View style={styles.mascotBlush1} />
                      <View style={styles.mascotBlush2} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.headerWelcome}>
            <ThemedText style={styles.welcomeText}>Welcome back! 👋</ThemedText>
            <ThemedText style={styles.welcomeSubtext}>Stay hydrated, stay healthy</ThemedText>
          </View>
        </LinearGradient>

        {/* Wavy Background Decoration */}
        <View style={styles.wavyBackground}>
          <View style={styles.wave1} />
          <View style={styles.wave2} />
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Specially for You Section */}
          <Animated.View entering={FadeIn.duration(800).delay(200)}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View style={styles.titleAccent} />
                <ThemedText style={styles.sectionTitle}>Specially for You</ThemedText>
              </View>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.speciallyCards}
            >
              {specialProducts.slice(0, 3).map((item, index) => (
                <Pressable key={item.id} style={styles.productCard}>
                  {item.discount && (
                    <View style={styles.discountBadge}>
                      <IconSymbol name="tag.fill" size={10} color="#fff" style={{ marginRight: 4 }} />
                      <ThemedText style={styles.discountText}>{item.discount}</ThemedText>
                    </View>
                  )}
                  <View style={styles.cardImageSection}>
                    <Image 
                      source={item.image} 
                      style={styles.cardBottleImage}
                      resizeMode="contain"
                    />
                    <View style={styles.bubbleDecoration1} />
                    <View style={styles.bubbleDecoration2} />
                    <View style={styles.bubbleDecoration3} />
                  </View>
                  
                  <View style={styles.cardInfo}>
                    <View style={styles.cardTopRow}>
                      <View style={styles.sizeTag}>
                        <ThemedText style={styles.sizeTagText}>{item.size}</ThemedText>
                      </View>
                    </View>
                    <ThemedText style={styles.bottleName}>{item.name}</ThemedText>
                    <ThemedText style={styles.bottleVolume}>{item.volume}</ThemedText>
                    
                    <View style={styles.cardFooter}>
                      <View style={styles.priceContainer}>
                        <ThemedText style={styles.priceLabel}>Price</ThemedText>
                        <ThemedText style={styles.bottlePrice}>₦{item.price}</ThemedText>
                      </View>
                      <View style={styles.stockIndicator}>
                        <View style={styles.stockDot} />
                        <ThemedText style={styles.stockText}>In Stock</ThemedText>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Catalog Section */}
          <Animated.View entering={FadeIn.duration(800).delay(400)} style={styles.catalogSection}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.titleAccent} />
              <ThemedText style={styles.sectionTitle}>Catalog</ThemedText>
            </View>
            
            <View style={styles.catalogGrid}>
              <Pressable style={styles.catalogCard}>
                <View style={styles.catalogIconContainer}>
                  <Image 
                    source={require('../../assets/images/bottled-water-icon.png')} 
                    style={styles.catalogIcon}
                    resizeMode="contain"
                  />
                </View>
                <ThemedText style={styles.catalogTitle}>Bottled</ThemedText>
                <ThemedText style={styles.catalogSubtitle}>Water</ThemedText>
                <View style={styles.catalogArrow}>
                  <IconSymbol name="chevron.right" size={14} color="#1e88e5" />
                </View>
              </Pressable>

              <Pressable style={styles.catalogCard}>
                <View style={styles.catalogIconContainer}>
                  <Image 
                    source={require('../../assets/images/large-can-icon.png')} 
                    style={styles.catalogIcon}
                    resizeMode="contain"
                  />
                </View>
                <ThemedText style={styles.catalogTitle}>Large Water</ThemedText>
                <ThemedText style={styles.catalogSubtitle}>Cans</ThemedText>
                <View style={styles.catalogArrow}>
                  <IconSymbol name="chevron.right" size={14} color="#1e88e5" />
                </View>
              </Pressable>

              <Pressable style={styles.catalogCard}>
                <View style={styles.catalogIconContainer}>
                  <Image 
                    source={require('../../assets/images/dispenser-icon.png')} 
                    style={styles.catalogIcon}
                    resizeMode="contain"
                  />
                </View>
                <ThemedText style={styles.catalogTitle}>Water</ThemedText>
                <ThemedText style={styles.catalogSubtitle}>Dispensers</ThemedText>
                <View style={styles.catalogArrow}>
                  <IconSymbol name="chevron.right" size={14} color="#1e88e5" />
                </View>
              </Pressable>

              <Pressable style={styles.catalogCard}>
                <View style={styles.catalogIconContainer}>
                  <Image 
                    source={require('../../assets/images/accessories-icon.png')} 
                    style={styles.catalogIcon}
                    resizeMode="contain"
                  />
                </View>
                <ThemedText style={styles.catalogTitle}>Accessories</ThemedText>
                <ThemedText style={styles.catalogSubtitle}>& More</ThemedText>
                <View style={styles.catalogArrow}>
                  <IconSymbol name="chevron.right" size={14} color="#1e88e5" />
                </View>
              </Pressable>
            </View>
          </Animated.View>

          {/* Available Now Section */}
          <Animated.View entering={FadeIn.duration(800).delay(600)} style={styles.orderSection}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.titleAccent} />
              <ThemedText style={styles.sectionTitle}>Available Now</ThemedText>
            </View>
            
            <View style={styles.availableCard}>
              <LinearGradient
                colors={['#e1f5fe', '#b3e5fc', '#81d4fa']}
                style={styles.availableGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.availableContent}>
                  <View style={styles.availableLeft}>
                    <View style={styles.productImageContainer}>
                      <Image 
                        source={{ uri: product.img }} 
                        style={styles.availableBottleImage}
                        resizeMode="contain"
                      />
                      <View style={styles.imageGlow} />
                    </View>
                  </View>

                  <View style={styles.availableRight}>
                    <View style={styles.productBadge}>
                      <IconSymbol name="star.fill" size={12} color="#ffd700" />
                      <ThemedText style={styles.badgeText}>Featured</ThemedText>
                    </View>
                    
                    <ThemedText style={styles.availableSize}>{product.name}</ThemedText>
                    
                    <View style={styles.stockBadge}>
                      <View style={styles.stockDotLarge} />
                      <ThemedText style={styles.availableStock}>
                        {product.available ? '5 units available' : 'Out of stock'}
                      </ThemedText>
                    </View>
                    
                    <ThemedText style={styles.availableDescription}>
                      {product.description}
                    </ThemedText>

                    <View style={styles.priceQtyRow}>
                      <View style={styles.priceSection}>
                        <ThemedText style={styles.priceLabelSmall}>Price</ThemedText>
                        <ThemedText style={styles.availablePrice}>₦{product.price.toFixed(2)}</ThemedText>
                      </View>
                      
                      <View style={styles.qtyControls}>
                        <Pressable
                          style={[styles.qtyButton, qty === 1 && styles.qtyButtonDisabled]}
                          onPress={() => setQty(Math.max(1, qty - 1))}
                        >
                          <IconSymbol name="minus" size={16} color={qty === 1 ? '#999' : '#1e88e5'} />
                        </Pressable>
                        
                        <ThemedText style={styles.qtyValue}>{qty}</ThemedText>
                        
                        <Pressable 
                          style={styles.qtyButton} 
                          onPress={() => setQty(qty + 1)}
                        >
                          <IconSymbol name="plus" size={16} color="#1e88e5" />
                        </Pressable>
                      </View>
                    </View>

                    <Pressable 
                      style={styles.orderNowButton}
                      onPress={() => router.push({ pathname: '/checkout', params: { productId: product.id, qty } })}
                    >
                      <IconSymbol name="cart.fill" size={18} color="#fff" style={styles.orderIcon} />
                      <ThemedText style={styles.orderNowText}>Order Now</ThemedText>
                      <IconSymbol name="arrow.right" size={16} color="#fff" />
                    </Pressable>
                  </View>
                </View>

                {/* Decorative waves */}
                <View style={styles.cardWaveDecor1} />
                <View style={styles.cardWaveDecor2} />
              </LinearGradient>
            </View>
          </Animated.View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f0f8ff',
  },
  
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  loadingDrop: {
    width: 50,
    height: 60,
    position: 'relative',
  },
  loadingText: {
    fontSize: 16,
    color: '#1e88e5',
    fontWeight: '600',
  },
  
  // Creative Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  waterDrop1: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: 35,
    right: 25,
  },
  waterDrop2: {
    position: 'absolute',
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: 75,
    right: 110,
  },
  waterDrop3: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    bottom: 15,
    left: 15,
  },
  waterDrop4: {
    position: 'absolute',
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: 55,
    right: 45,
  },
  waterDrop5: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    top: 120,
    left: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 10,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  waterDropletLogo: {
    width: 28,
    height: 34,
    position: 'relative',
  },
  dropletTop: {
    position: 'absolute',
    top: 0,
    left: 9,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dropletBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
  },
  dropletShine: {
    position: 'absolute',
    top: 16,
    left: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  brandName: {
    fontSize: 21,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  brandTagline: {
    fontSize: 11,
    color: '#e3f2fd',
    fontWeight: '500',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 22,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#ff5252',
    borderWidth: 2,
    borderColor: '#0d47a1',
  },
  mascotContainer: {
    width: 50,
    height: 50,
  },
  mascotCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  mascot: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotBody: {
    width: 36,
    height: 40,
    backgroundColor: '#42a5f5',
    borderRadius: 18,
    position: 'relative',
  },
  mascotEyeLeft: {
    position: 'absolute',
    top: 10,
    left: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  mascotEyeRight: {
    position: 'absolute',
    top: 10,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  mascotPupil: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0d47a1',
    position: 'absolute',
    top: 2,
    left: 2,
  },
  mascotSmile: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    width: 16,
    height: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    borderTopWidth: 0,
  },
  mascotBlush1: {
    position: 'absolute',
    top: 18,
    left: 4,
    width: 6,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#ff8a80',
    opacity: 0.6,
  },
  mascotBlush2: {
    position: 'absolute',
    top: 18,
    right: 4,
    width: 6,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#ff8a80',
    opacity: 0.6,
  },
  headerWelcome: {
    marginTop: 8,
    zIndex: 10,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 15,
    color: '#e3f2fd',
    fontWeight: '500',
  },

  // Wavy Background
  wavyBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    overflow: 'hidden',
    zIndex: 0,
  },
  wave1: {
    position: 'absolute',
    top: 180,
    left: -50,
    right: -50,
    height: 200,
    backgroundColor: '#e3f2fd',
    borderRadius: 200,
    transform: [{ scaleX: 2 }],
  },
  wave2: {
    position: 'absolute',
    top: 220,
    left: -50,
    right: -50,
    height: 200,
    backgroundColor: '#bbdefb',
    borderRadius: 200,
    transform: [{ scaleX: 2 }],
    opacity: 0.5,
  },

  // Main Content
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    zIndex: 5,
  },

  // Section Headers
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  titleAccent: {
    width: 4,
    height: 24,
    backgroundColor: '#1e88e5',
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e88e5',
  },

  // Specially for You Cards
  speciallyCards: {
    gap: 16,
    paddingBottom: 24,
  },
  productCard: {
    width: 170,
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#1e88e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e3f2fd',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  cardImageSection: {
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 20,
    backgroundColor: '#f8fcff',
  },
  cardBottleImage: {
    width: '70%',
    height: '100%',
    zIndex: 2,
  },
  bubbleDecoration1: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#64b5f6',
    opacity: 0.12,
    top: 15,
    right: 20,
  },
  bubbleDecoration2: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#42a5f5',
    opacity: 0.1,
    top: 45,
    right: 12,
  },
  bubbleDecoration3: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#90caf9',
    opacity: 0.08,
    bottom: 20,
    left: 15,
  },
  cardInfo: {
    padding: 16,
    gap: 6,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sizeTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sizeTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e88e5',
  },
  bottleName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#263238',
  },
  bottleVolume: {
    fontSize: 13,
    color: '#78909c',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  priceContainer: {
    gap: 2,
  },
  priceLabel: {
    fontSize: 11,
    color: '#78909c',
    fontWeight: '500',
  },
  bottlePrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e88e5',
  },
  stockIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4caf50',
  },
  stockText: {
    fontSize: 11,
    color: '#4caf50',
    fontWeight: '600',
  },

  // Catalog Section
  catalogSection: {
    marginTop: 8,
  },
  catalogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  catalogCard: {
    width: (width - 52) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#1e88e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e3f2fd',
    position: 'relative',
  },
  catalogIconContainer: {
    marginBottom: 12,
    backgroundColor: '#f0f8ff',
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catalogIcon: {
    width: 36,
    height: 36,
  },
  catalogTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#263238',
  },
  catalogSubtitle: {
    fontSize: 14,
    color: '#78909c',
  },
  catalogArrow: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Available Now Section
  orderSection: {
    marginTop: 8,
  },
  availableCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#1e88e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  availableGradient: {
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  availableContent: {
    flexDirection: 'row',
    gap: 16,
    zIndex: 2,
  },
  availableLeft: {
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImageContainer: {
    position: 'relative',
  },
  availableBottleImage: {
    width: 110,
    height: 160,
    zIndex: 2,
  },
  imageGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    opacity: 0.3,
    bottom: 10,
    left: 5,
    zIndex: 1,
  },
  availableRight: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  productBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#263238',
  },
  availableSize: {
    fontSize: 24,
    fontWeight: '800',
    color: '#263238',
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockDotLarge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4caf50',
  },
  availableStock: {
    fontSize: 14,
    color: '#546e7a',
    fontWeight: '600',
  },
  availableDescription: {
    fontSize: 13,
    color: '#607d8b',
    lineHeight: 18,
  },
  priceQtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 12,
  },
  priceSection: {
    gap: 2,
  },
  priceLabelSmall: {
    fontSize: 12,
    color: '#78909c',
    fontWeight: '500',
  },
  availablePrice: {
    fontSize: 26,
    fontWeight: '800',
    color: '#263238',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1e88e5',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  qtyButtonDisabled: {
    opacity: 0.4,
  },
  qtyValue: {
    marginHorizontal: 16,
    fontSize: 17,
    fontWeight: '700',
    color: '#263238',
  },
  orderNowButton: {
    backgroundColor: '#1e88e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignSelf: 'stretch',
    shadowColor: '#1e88e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  orderIcon: {
    marginRight: -4,
  },
  orderNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  cardWaveDecor1: {
    position: 'absolute',
    bottom: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  cardWaveDecor2: {
    position: 'absolute',
    bottom: -20,
    right: -60,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});