import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { CartItemRow } from '../../components/CartItemRow';
import { useCartStore } from '../../stores/cartStore';
import { vendors } from '../../data/vendors';
import { products } from '../../data/products';

const SERVICE_FEE_RATE = 0.05;

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function CartScreen() {
  const items = useCartStore((s) => s.items);

  const vendorGroups = vendors
    .map((vendor) => ({
      vendor,
      items: items.filter((i) => i.vendorId === vendor.id),
    }))
    .filter((g) => g.items.length > 0);

  const subtotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const total = subtotal + serviceFee;

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cart</Text>
          <Image
            source={require('../../assets/Shefa lettermark logo (S) (no background).png')}
            style={styles.lettermark}
            resizeMode="contain"
          />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🛍️</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add items from your favorite vendors to get started.</Text>
          <Button label="Browse Markets" onPress={() => router.push('/(tabs)/')} style={styles.browseBtn} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart</Text>
        <Image
          source={require('../../assets/Shefa lettermark logo (S) (no background).png')}
          style={styles.lettermark}
          resizeMode="contain"
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {vendorGroups.map(({ vendor, items: vendorItems }) => {
          const vendorSubtotal = vendorItems.reduce((sum, item) => {
            const product = products.find((p) => p.id === item.productId);
            return sum + (product?.price ?? 0) * item.quantity;
          }, 0);
          return (
            <View key={vendor.id} style={styles.vendorGroup}>
              <View style={styles.vendorGroupHeader}>
                <Ionicons name="storefront-outline" size={15} color={Colors.primaryGreen} />
                <Text style={styles.vendorGroupName}>{vendor.name}</Text>
                <Text style={styles.vendorSubtotal}>{formatPrice(vendorSubtotal)}</Text>
              </View>
              {vendorItems.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;
                return <CartItemRow key={item.productId} item={item} product={product} />;
              })}
            </View>
          );
        })}

        <View style={styles.pickupCard}>
          <Ionicons name="location-outline" size={18} color={Colors.primaryGreen} />
          <View style={styles.pickupInfo}>
            <Text style={styles.pickupTitle}>Pickup at vendor booth</Text>
            <Text style={styles.pickupSub}>Saturday 9AM–1PM · 2525 Bee Cave Rd, Austin, TX</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.feeRow}>
              <Text style={styles.summaryLabel}>Service fee</Text>
              <Text style={styles.feeNote}>(Supports the app)</Text>
            </View>
            <Text style={styles.summaryValue}>{formatPrice(serviceFee)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed CTA pinned above tab bar */}
      <View style={styles.ctaContainer}>
        <Button
          label={`Reserve My Order · ${formatPrice(total)}`}
          size="lg"
          onPress={() => router.push('/checkout')}
          style={{ width: '100%' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primaryGreen,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 24, color: Colors.white },
  lettermark: { width: 32, height: 32 },
  scroll: { padding: 16, paddingBottom: 120, gap: 12 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 24, color: Colors.textPrimary },
  emptyText: { fontFamily: 'Outfit_400Regular', fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  browseBtn: { marginTop: 8, paddingHorizontal: 32 },
  vendorGroup: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  vendorGroupHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  vendorGroupName: { flex: 1, fontFamily: 'Outfit_600SemiBold', fontSize: 14, color: Colors.textPrimary },
  vendorSubtotal: { fontFamily: 'Outfit_600SemiBold', fontSize: 14, color: Colors.textSecondary },
  pickupCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.lightGreen,
    borderRadius: 14,
    padding: 14,
  },
  pickupInfo: { flex: 1 },
  pickupTitle: { fontFamily: 'Outfit_600SemiBold', fontSize: 14, color: Colors.primaryGreen },
  pickupSub: { fontFamily: 'Outfit_400Regular', fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 10,
  },
  summaryTitle: { fontFamily: 'Outfit_600SemiBold', fontSize: 15, color: Colors.textPrimary, marginBottom: 4 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  feeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  summaryLabel: { fontFamily: 'Outfit_400Regular', fontSize: 14, color: Colors.textSecondary },
  feeNote: { fontFamily: 'Outfit_400Regular', fontSize: 11, color: Colors.textSecondary, fontStyle: 'italic' },
  summaryValue: { fontFamily: 'Outfit_500Medium', fontSize: 14, color: Colors.textPrimary },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10, marginTop: 4 },
  totalLabel: { fontFamily: 'Outfit_700Bold', fontSize: 16, color: Colors.textPrimary },
  totalValue: { fontFamily: 'Outfit_700Bold', fontSize: 18, color: Colors.primaryGreen },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: 16,
    paddingBottom: 100,
  },
});
