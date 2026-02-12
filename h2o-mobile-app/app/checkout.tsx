import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import api from '../services/api';

export default function Checkout() {
  const { productId, qty: qtyParam } = useLocalSearchParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState(Number(qtyParam) || 1);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const p = await api.getProduct(productId as string);
      setProduct(p);
    })();
  }, [productId]);

  const handleConfirm = async () => {
    if (!deliveryAddress.trim()) return alert('Please enter delivery address');
    if (!product) return;

    const order = await api.postOrder({
      userId: user?._id,
      addressId: deliveryAddress,
      items: [{ productId: product.id, qty }],
      paymentMethod: 'COD',
    });

    router.replace(`/order/${order.id}`);
  };

  const handlePaystack = () => {
    if (!deliveryAddress.trim()) return alert('Please enter delivery address');

    const path =
      `/payments/paystack?productId=${encodeURIComponent(product.id)}` +
      `&qty=${encodeURIComponent(String(qty))}` +
      `&addressId=${encodeURIComponent(deliveryAddress)}` +
      `&notes=${encodeURIComponent(notes || '')}`;

    router.push(path as any);
  };

  if (!product) return null;

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>Checkout</ThemedText>

        {/* Order Summary Card */}
        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Order Summary</ThemedText>
          
          <View style={styles.row}>
            <ThemedText style={styles.label}>Item</ThemedText>
            <ThemedText style={styles.value}>{product.name}</ThemedText>
          </View>

          <View style={styles.row}>
            <ThemedText style={styles.label}>Quantity</ThemedText>
            <ThemedText style={styles.value}>{qty}</ThemedText>
          </View>

          <View style={styles.row}>
            <ThemedText style={styles.label}>Unit Price</ThemedText>
            <ThemedText style={styles.value}>₦{product.price.toFixed(2)}</ThemedText>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <ThemedText style={styles.totalLabel}>Total</ThemedText>
            <ThemedText style={styles.totalValue}>
              ₦{(product.price * qty).toFixed(2)}
            </ThemedText>
          </View>
        </View>

        {/* Delivery Details Card */}
        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Delivery Details</ThemedText>

          <TextInput
            placeholder="Enter your full delivery address"
            placeholderTextColor="#90c9f9"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            style={styles.input}
            multiline
            numberOfLines={3}
          />

          <TextInput
            placeholder="Delivery notes (optional)"
            placeholderTextColor="#90c9f9"
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
          />
        </View>

        {/* Payment Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonPrimary} onPress={handlePaystack}>
            <Ionicons name="card-outline" size={20} color="#ffffff" style={styles.buttonIcon} />
            <ThemedText style={styles.buttonPrimaryText}>Pay with Paystack</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSecondary} onPress={handleConfirm}>
            <Ionicons name="cash-outline" size={20} color="#1e88e5" style={styles.buttonIcon} />
            <ThemedText style={styles.buttonSecondaryText}>Cash on Delivery</ThemedText>
          </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e88e5',
    marginBottom: 24,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#1e88e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e88e5',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 15,
    color: '#1e88e5',
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1565c0',
  },
  divider: {
    height: 1,
    backgroundColor: '#bbdefb',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e88e5',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e88e5',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#bbdefb',
    backgroundColor: '#f5faff',
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    fontSize: 15,
    color: '#1565c0',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 12,
  },
  buttonPrimary: {
    backgroundColor: '#1e88e5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#1e88e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1e88e5',
  },
  buttonSecondaryText: {
    color: '#1e88e5',
    fontSize: 16,
    fontWeight: '600',
  },
});