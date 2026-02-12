import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!user) return;
      setIsLoading(true);
      setError(null);
      try {
        const o = await api.getOrders(user._id);
        setOrders(o || []);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err?.error || 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user]);

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
          {/* Animated water drops background */}
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
                <ThemedText style={styles.brandName}>Profile</ThemedText>
                <ThemedText style={styles.brandTagline}>Manage your account</ThemedText>
              </View>
            </View>
            
            <Pressable onPress={() => router.push('/support')} style={styles.supportBtn}>
              <Ionicons name="help-circle-outline" size={24} color="#fff" />
            </Pressable>
          </View>

          {/* User Profile Section */}
          <View style={styles.userSection}>
            <View style={styles.mascotContainer}>
              <View style={styles.mascotCircle}>
                {/* Cute Water Drop Character */}
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

            <View style={styles.userInfo}>
              <ThemedText style={styles.userName}>{user?.name || 'Guest'}</ThemedText>
              <ThemedText style={styles.userEmail}>{user?.email || ''}</ThemedText>
            </View>
          </View>
        </LinearGradient>

        {/* Content Section */}
        <View style={styles.content}>
          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Pressable style={styles.quickAction} onPress={() => router.push('/addresses')}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="location" size={24} color="#1e88e5" />
              </View>
              <ThemedText style={styles.quickActionText}>Addresses</ThemedText>
            </Pressable>

            <Pressable style={styles.quickAction} onPress={() => router.push('/orders')}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="receipt" size={24} color="#1e88e5" />
              </View>
              <ThemedText style={styles.quickActionText}>All Orders</ThemedText>
            </Pressable>

            <Pressable style={styles.quickAction} onPress={() => router.push('/support')}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="chatbubbles" size={24} color="#1e88e5" />
              </View>
              <ThemedText style={styles.quickActionText}>Support</ThemedText>
            </Pressable>
          </View>

          {/* Recent Orders Section */}
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Recent Orders</ThemedText>
            <Pressable onPress={() => router.push('/orders')}>
              <ThemedText style={styles.viewAll}>View all →</ThemedText>
            </Pressable>
          </View>

          {isLoading ? (
            <View style={styles.emptyState}>
              <Ionicons name="hourglass-outline" size={48} color="#90CAF9" />
              <ThemedText style={styles.emptyText}>Loading orders...</ThemedText>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#e64a4a" />
              <ThemedText style={styles.errorText}>{error}</ThemedText>
              <Pressable onPress={() => router.push('/(tabs)')} style={styles.retryButton}>
                <ThemedText style={styles.retryText}>Go to Home</ThemedText>
              </Pressable>
            </View>
          ) : orders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cart-outline" size={48} color="#90CAF9" />
              <ThemedText style={styles.emptyText}>No orders yet</ThemedText>
              <ThemedText style={styles.emptySubtext}>Start shopping to see your orders here</ThemedText>
              <Pressable onPress={() => router.push('/(tabs)')} style={styles.shopButton}>
                <ThemedText style={styles.shopButtonText}>Start Shopping</ThemedText>
              </Pressable>
            </View>
          ) : (
            orders.slice(0, 3).map((o) => (
              <Pressable key={o.id} style={styles.orderCard} onPress={() => router.push(`/order/${o.id}`)}>
                <View style={styles.orderHeader}>
                  <View style={styles.orderIdContainer}>
                    <Ionicons name="receipt-outline" size={16} color="#1e88e5" />
                    <ThemedText style={styles.orderId}>#{(o.orderId || o.id).slice(0, 8)}</ThemedText>
                  </View>
                  <View style={[styles.statusBadge, (styles as any)[`status_${o.status.toLowerCase()}`]]}>
                    <ThemedText style={styles.statusText}>{o.status}</ThemedText>
                  </View>
                </View>

                <View style={styles.orderRow}>
                  <Image 
                    source={{ uri: (o.items?.[0]?.raw?.product?.img) || (o.items?.[0]?.raw?.product?.image) || (o.items?.[0]?.raw?.productId?.img) || undefined }} 
                    style={styles.orderImage} 
                  />
                  <View style={styles.orderDetails}>
                    <ThemedText style={styles.orderItems} numberOfLines={2}>
                      {o.items?.map((it: any) => `${it.qty} × ${it.raw?.product?.name || it.raw?.productId?.name || it.productId || ''}`).join(', ')}
                    </ThemedText>
                    <View style={styles.orderMeta}>
                      <Ionicons name="calendar-outline" size={14} color="#666" />
                      <ThemedText style={styles.orderDate}>
                        {new Date(o.createdAt).toLocaleDateString()}
                      </ThemedText>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </View>
              </Pressable>
            ))
          )}

          {/* Logout Button */}
          <Pressable 
            style={styles.logoutButton} 
            onPress={() => { 
              logout(); 
              router.replace('/login'); 
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#e64a4a" />
            <ThemedText style={styles.logoutText}>Logout</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#e3f2fd',
  },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'ios' ? 60 : 50, 
    paddingBottom: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  
  // Water drops background
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
    marginBottom: 24,
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
  supportBtn: { 
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 22,
  },

  userSection: {
    alignItems: 'center',
    zIndex: 10,
  },
  mascotContainer: {
    width: 90,
    height: 90,
    marginBottom: 16,
  },
  mascotCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  mascot: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotBody: {
    width: 60,
    height: 70,
    backgroundColor: '#42a5f5',
    borderRadius: 30,
    position: 'relative',
  },
  mascotEyeLeft: {
    position: 'absolute',
    top: 18,
    left: 14,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  mascotEyeRight: {
    position: 'absolute',
    top: 18,
    right: 14,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  mascotPupil: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0d47a1',
    position: 'absolute',
    top: 3,
    left: 3,
  },
  mascotSmile: {
    position: 'absolute',
    bottom: 15,
    left: 18,
    width: 24,
    height: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 2.5,
    borderColor: '#fff',
    borderTopWidth: 0,
  },
  mascotBlush1: {
    position: 'absolute',
    top: 28,
    left: 8,
    width: 10,
    height: 6,
    borderRadius: 5,
    backgroundColor: '#ff8a80',
    opacity: 0.6,
  },
  mascotBlush2: {
    position: 'absolute',
    top: 28,
    right: 8,
    width: 10,
    height: 6,
    borderRadius: 5,
    backgroundColor: '#ff8a80',
    opacity: 0.6,
  },

  userInfo: { 
    alignItems: 'center',
  },
  userName: { 
    color: '#fff', 
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: { 
    color: '#e3f2fd', 
    fontSize: 14,
    opacity: 0.9,
  },

  content: { 
    padding: 20, 
    paddingBottom: 100,
  },

  quickActionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...Platform.select({ 
      ios: { 
        shadowColor: '#1e88e5', 
        shadowOpacity: 0.1, 
        shadowOffset: { width: 0, height: 2 }, 
        shadowRadius: 8,
      }, 
      android: { 
        elevation: 3,
      },
    }),
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e88e5',
    textAlign: 'center',
  },

  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '700',
    color: '#1e88e5',
  },
  viewAll: { 
    color: '#1e88e5', 
    fontWeight: '600',
    fontSize: 14,
  },

  orderCard: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12,
    ...Platform.select({ 
      ios: { 
        shadowColor: '#1e88e5', 
        shadowOpacity: 0.08, 
        shadowOffset: { width: 0, height: 2 }, 
        shadowRadius: 8,
      }, 
      android: { 
        elevation: 2,
      },
    }),
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderId: { 
    fontSize: 14, 
    fontWeight: '600',
    color: '#1e88e5',
  },
  orderRow: { 
    flexDirection: 'row', 
    gap: 12, 
    alignItems: 'center',
  },
  orderImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 12, 
    backgroundColor: '#f0f0f0',
  },
  orderDetails: {
    flex: 1,
    gap: 6,
  },
  orderItems: { 
    fontSize: 14, 
    color: '#333', 
    lineHeight: 20,
  },
  orderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orderDate: { 
    color: '#666', 
    fontSize: 12,
  },

  statusBadge: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12,
  },
  status_pending: { 
    backgroundColor: '#fff3e0',
  },
  status_processing: { 
    backgroundColor: '#e3f2fd',
  },
  status_completed: { 
    backgroundColor: '#e8f5e9',
  },
  status_cancelled: { 
    backgroundColor: '#ffebee',
  },
  statusText: { 
    fontSize: 11, 
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#1e88e5',
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: '#1e88e5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  shopButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  errorContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#e64a4a',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: '#1e88e5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ffcdd2',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  logoutText: {
    color: '#e64a4a',
    fontWeight: '600',
    fontSize: 16,
  },
});