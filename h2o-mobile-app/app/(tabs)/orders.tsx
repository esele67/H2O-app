import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Your Orders',
      headerShadowVisible: false,
      headerStyle: { backgroundColor: '#f5f7fa' },
      headerLeft: () => (
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </Pressable>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      if (!user) return;
      console.log('Fetching orders for user:', user);
      const o = await api.getOrders(user._id);
      setOrders(o || []);
    })();
  }, [user]);

  const calculateTotal = (items: any[]) => {
    return items.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
  };

  if (!orders.length) {
    return (
      <ThemedView style={[styles.container, styles.emptyContainer]}>
        <View style={styles.emptyIconContainer}>
          <Image source={require('@/assets/images/water-drop-icon.png')} style={styles.emptyIcon} />
        </View>
        <ThemedText type="title" style={styles.emptyTitle}>No Orders Yet</ThemedText>
        <ThemedText style={styles.emptyText}>
          Start by ordering fresh water from our catalog.{'\n'}
          Your order history will appear here.
        </ThemedText>
        <Pressable 
          style={({ pressed }) => [
            styles.shopButton,
            pressed && styles.shopButtonPressed
          ]} 
          onPress={() => router.push('/(tabs)')}
        >
          <Ionicons name="water" size={20} color="#fff" style={styles.buttonIcon} />
          <ThemedText style={styles.shopButtonText}>Browse Catalog</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable 
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed
            ]} 
            onPress={() => router.push(`/order/${item.id}`)}
          >
            {/* Card Header with Order ID and Status */}
            <View style={styles.cardHeader}>
              <View style={styles.orderIdContainer}>
                <Ionicons name="receipt-outline" size={18} color="#1e5a8e" style={styles.orderIcon} />
                <ThemedText type="subtitle" style={styles.orderId}>
                  Order #{item.id.slice(0, 8).toUpperCase()}
                </ThemedText>
              </View>
              <View style={[
                styles.statusBadge, 
                (styles as any)[`status_${item.status.toLowerCase() as string}`]
              ]}>
                <View style={[
                  styles.statusDot,
                  (styles as any)[`statusDot_${item.status.toLowerCase() as string}`]
                ]} />
                <ThemedText style={[
                  styles.statusText,
                  (styles as any)[`statusTextColor_${item.status.toLowerCase() as string}`]
                ]}>
                  {item.status}
                </ThemedText>
              </View>
            </View>

            {/* Order Info Section */}
            <View style={styles.orderInfo}>
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Ionicons name="calendar-outline" size={14} color="#666" />
                  <ThemedText style={styles.infoLabel}>Date</ThemedText>
                </View>
                <ThemedText style={styles.infoValue}>
                  {new Date(item.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </ThemedText>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Ionicons name="cube-outline" size={14} color="#666" />
                  <ThemedText style={styles.infoLabel}>Items</ThemedText>
                </View>
                <ThemedText style={styles.infoValue}>
                  {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
                </ThemedText>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Ionicons name="cash-outline" size={14} color="#666" />
                  <ThemedText style={styles.infoLabel}>Total</ThemedText>
                </View>
                <ThemedText style={styles.totalValue}>
                  ₱{calculateTotal(item.items).toFixed(2)}
                </ThemedText>
              </View>
            </View>

            {/* Items Preview */}
            <View style={styles.itemsSection}>
              <ThemedText style={styles.itemsSectionTitle}>Order Items</ThemedText>
              <View style={styles.itemList}>
                {item.items.map((orderItem: any, index: number) => (
                  <View key={index} style={styles.item}>
                    <View style={styles.itemImageContainer}>
                      <Image
                        source={{ 
                          uri: orderItem.raw?.product?.img || 
                               orderItem.raw?.product?.image || 
                               orderItem.raw?.productId?.img 
                        }}
                        style={styles.itemImage}
                      />
                    </View>
                    <View style={styles.itemInfo}>
                      <ThemedText style={styles.itemName} numberOfLines={1}>
                        {orderItem.raw?.product?.name || 
                         orderItem.raw?.productId?.name || 
                         'Water'}
                      </ThemedText>
                      <View style={styles.itemDetails}>
                        <View style={styles.quantityBadge}>
                          <ThemedText style={styles.itemQuantity}>
                            Qty: {orderItem.qty}
                          </ThemedText>
                        </View>
                        <ThemedText style={styles.itemPrice}>
                          ₱{((orderItem.price || 0) * (orderItem.qty || 1)).toFixed(2)}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* View Details Footer */}
            <View style={styles.cardFooter}>
              <ThemedText style={styles.viewDetailsText}>View Order Details</ThemedText>
              <Ionicons name="chevron-forward" size={18} color="#1e5a8e" />
            </View>
          </Pressable>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f7fa' 
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  list: {
    padding: 16,
    paddingBottom: 120,
  },
  
  // Empty State Styles
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 26,
    marginBottom: 12,
    color: '#1a1a1a',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    fontSize: 15,
    lineHeight: 22,
  },
  shopButton: {
    backgroundColor: '#1e5a8e',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#1e5a8e',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  shopButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonIcon: {
    marginRight: 4,
  },
  shopButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  
  // Card Styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  
  // Card Header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderIcon: {
    opacity: 0.8,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.3,
  },
  
  // Status Badge
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  status_pending: {
    backgroundColor: '#fff7e6',
  },
  statusDot_pending: {
    backgroundColor: '#fa8c16',
  },
  statusTextColor_pending: {
    color: '#d46b08',
  },
  status_processing: {
    backgroundColor: '#e6f7ff',
  },
  statusDot_processing: {
    backgroundColor: '#1890ff',
  },
  statusTextColor_processing: {
    color: '#096dd9',
  },
  status_completed: {
    backgroundColor: '#f6ffed',
  },
  statusDot_completed: {
    backgroundColor: '#52c41a',
  },
  statusTextColor_completed: {
    color: '#389e0d',
  },
  status_cancelled: {
    backgroundColor: '#fff1f0',
  },
  statusDot_cancelled: {
    backgroundColor: '#f5222d',
  },
  statusTextColor_cancelled: {
    color: '#cf1322',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  
  // Order Info
  orderInfo: {
    backgroundColor: '#fafbfc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoLabel: {
    color: '#666',
    fontSize: 13,
  },
  infoValue: {
    fontWeight: '600',
    color: '#1a1a1a',
    fontSize: 13,
  },
  totalValue: {
    fontWeight: '700',
    color: '#1e5a8e',
    fontSize: 15,
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#e8e8e8',
    marginVertical: 4,
  },
  
  // Items Section
  itemsSection: {
    marginBottom: 12,
  },
  itemsSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemList: {
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fafbfc',
    padding: 10,
    borderRadius: 10,
  },
  itemImageContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 14,
    color: '#1a1a1a',
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityBadge: {
    backgroundColor: '#e8e8e8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  itemQuantity: {
    color: '#555',
    fontSize: 12,
    fontWeight: '600',
  },
  itemPrice: {
    color: '#1e5a8e',
    fontSize: 13,
    fontWeight: '700',
  },
  
  // Card Footer
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 6,
  },
  viewDetailsText: {
    color: '#1e5a8e',
    fontSize: 14,
    fontWeight: '600',
  },
});