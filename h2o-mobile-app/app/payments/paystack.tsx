import React, { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PaystackPayment() {
  const { productId, qty: qtyParam, addressId, notes } = useLocalSearchParams();
  const qty = Number(qtyParam) || 1;
  const router = useRouter();
  const webview = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const { user } = useAuth();

  // Paystack public key: app must set globalThis.PAYSTACK_PUBLIC_KEY or replace below
  const PUBLIC_KEY = 'pk_test_164fdfdd4e67f1b421b1c5f541c1526a935394a8';

  // fetch product to calculate amount
  React.useEffect(() => {
    (async () => {
      if (!productId) return;
      const p = await api.getProduct(productId as string);
      setProduct(p);
    })();
  }, [productId]);

  const amountKobo = Math.round(((product?.price || 0) * qty) * 100);

  // Inline HTML to initialize Paystack and open the inline payment
  const html = `
    <!doctype html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://js.paystack.co/v1/inline.js"></script>
    </head>
    <body>
      <script>
        function start(){
          const handler = PaystackPop.setup({
            key: '${PUBLIC_KEY}',
            email: '${user?.email || 'customer@example.com'}',
            amount: ${amountKobo},
            onClose: function(){
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'closed' }));
            },
            callback: function(response){
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'success', reference: response.reference }));
            }
          });
          handler.openIframe();
        }
        // wait a tick to allow RN bridge to be ready
        setTimeout(start, 300);
      </script>
    </body>
    </html>
  `;

  const onMessage = async (e: any) => {
    try {
      const data = JSON.parse(e.nativeEvent.data);
      if (data.type === 'closed') {
        // user closed payment
        router.replace('/(tabs)');
        return;
      }
      if (data.type === 'success') {
        // create order with payment reference
        try {
          const order = await api.postOrder({ userId: user?._id || (user as any)?.id || undefined, addressId, items: [{ productId, qty }], paymentMethod: 'Paystack', notes: (notes || '') + `\nPaymentRef: ${data.reference}` });
          router.replace(`/order/${order.id}`);
        } catch (err) {
          console.error('Failed to create order after payment', err);
          router.replace('/(tabs)');
        }
      }
    } catch (err) {
      console.error('Invalid message from webview', err);
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      )}
      <WebView
        ref={webview}
        originWhitelist={["*"]}
        source={{ html }}
        onMessage={onMessage}
        onLoadEnd={() => setLoading(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({ loading: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' } });
