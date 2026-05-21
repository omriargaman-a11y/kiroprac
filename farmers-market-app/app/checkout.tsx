import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../stores/cartStore';
import { products } from '../data/products';
import { vendors } from '../data/vendors';

const PICKUP_WINDOWS = [
  { id: 'morning', label: 'Morning Pickup', time: '9:00 AM – 11:00 AM' },
  { id: 'midday', label: 'Midday Pickup', time: '11:00 AM – 1:00 PM' },
];

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function Checkout() {
  const [pickupWindow, setPickupWindow] = useState('morning');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);
  const { items, clearCart } = useCartStore();

  const subtotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;

  const handlePlaceOrder = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter your name for vendor pickup.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      Alert.alert('Phone required', 'Please enter a valid 10-digit phone number.');
      return;
    }
    setIsPlacing(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1200));
    clearCart();
    setIsPlacing(false);
    router.replace('/order-confirmed');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Step 1 — Pickup time */}
        <View style={styles.section}>
          <Text style={styles.stepLabel}>1 of 3</Text>
          <Text style={styles.sectionTitle}>Pickup Window</Text>
          <Text style={styles.sectionSub}>Saturday, May 23 · Barton Creek FM</Text>
          <View style={styles.windowOptions}>
            {PICKUP_WINDOWS.map((w) => (
              <TouchableOpacity
                key={w.id}
                style={[styles.windowOption, pickupWindow === w.id && styles.windowActive]}
                onPress={() => setPickupWindow(w.id)}
                activeOpacity={0.8}
              >
                <View style={styles.windowRow}>
                  <View
                    style={[
                      styles.radio,
                      pickupWindow === w.id && styles.radioActive,
                    ]}
                  >
                    {pickupWindow === w.id && <View style={styles.radioDot} />}
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.windowLabel,
                        pickupWindow === w.id && styles.windowLabelActive,
                      ]}
                    >
                      {w.label}
                    </Text>
                    <Text style={styles.windowTime}>{w.time}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Step 2 — Contact */}
        <View style={styles.section}>
          <Text style={styles.stepLabel}>2 of 3</Text>
          <Text style={styles.sectionTitle}>Your Info</Text>
          <Text style={styles.sectionSub}>
            So vendors can identify your order at pickup
          </Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Jane Smith"
              placeholderTextColor={Colors.textSecondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="(512) 555-0123"
              placeholderTextColor={Colors.textSecondary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Step 3 — Payment */}
        <View style={styles.section}>
          <Text style={styles.stepLabel}>3 of 3</Text>
          <Text style={styles.sectionTitle}>Payment</Text>
          <Text style={styles.sectionSub}>Stripe payments coming soon</Text>
          <View style={styles.paymentMock}>
            <Ionicons name="card-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.paymentText}>Card ending in ••••  4242</Text>
            <View style={styles.paymentBadge}>
              <Text style={styles.paymentBadgeText}>Mock</Text>
            </View>
          </View>
        </View>

        {/* Order summary read-only */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;
            return (
              <View key={item.productId} style={styles.summaryItem}>
                <Text style={styles.summaryItemName} numberOfLines={1}>
                  {product.name}
                </Text>
                <Text style={styles.summaryItemQty}>× {item.quantity}</Text>
                <Text style={styles.summaryItemPrice}>
                  {formatPrice(product.price * item.quantity)}
                </Text>
              </View>
            );
          })}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryTotals}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service fee (5%)</Text>
              <Text style={styles.summaryValue}>{formatPrice(serviceFee)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.ctaContainer}>
        <Button
          label={`Place Order · ${formatPrice(total)}`}
          size="lg"
          loading={isPlacing}
          onPress={handlePlaceOrder}
          style={styles.cta}
        />
        <Text style={styles.disclaimer}>
          By placing this order you agree to our terms. Payment is collected at pickup.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 32, gap: 4 },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
    gap: 10,
  },
  stepLabel: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 11,
    color: Colors.primaryGreen,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 22,
    color: Colors.textPrimary,
  },
  sectionSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: -4,
  },
  windowOptions: { gap: 8 },
  windowOption: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  windowActive: {
    borderColor: Colors.primaryGreen,
    backgroundColor: Colors.lightGreen,
  },
  windowRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: Colors.primaryGreen },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primaryGreen,
  },
  windowLabel: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  windowLabelActive: { color: Colors.primaryGreen },
  windowTime: { fontFamily: 'Outfit_400Regular', fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  inputGroup: { gap: 6 },
  inputLabel: { fontFamily: 'Outfit_500Medium', fontSize: 13, color: Colors.textPrimary },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  paymentMock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  paymentText: { flex: 1, fontFamily: 'Outfit_500Medium', fontSize: 14, color: Colors.textPrimary },
  paymentBadge: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  paymentBadgeText: { fontFamily: 'Outfit_500Medium', fontSize: 10, color: Colors.textSecondary },
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  summaryItemName: { flex: 1, fontFamily: 'Outfit_400Regular', fontSize: 13, color: Colors.textSecondary },
  summaryItemQty: { fontFamily: 'Outfit_400Regular', fontSize: 13, color: Colors.textSecondary },
  summaryItemPrice: { fontFamily: 'Outfit_500Medium', fontSize: 13, color: Colors.textPrimary },
  summaryDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  summaryTotals: { gap: 8 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryLabel: { fontFamily: 'Outfit_400Regular', fontSize: 13, color: Colors.textSecondary },
  summaryValue: { fontFamily: 'Outfit_500Medium', fontSize: 13, color: Colors.textPrimary },
  totalRow: { marginTop: 4, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.border },
  totalLabel: { fontFamily: 'Outfit_700Bold', fontSize: 16, color: Colors.textPrimary },
  totalValue: { fontFamily: 'Outfit_700Bold', fontSize: 18, color: Colors.primaryGreen },
  ctaContainer: {
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
    gap: 8,
  },
  cta: { width: '100%' },
  disclaimer: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
