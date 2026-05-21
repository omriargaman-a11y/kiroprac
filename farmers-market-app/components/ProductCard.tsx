import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';
import { Colors } from '../constants/colors';
import { useCartStore } from '../stores/cartStore';

const TAG_LABELS: Record<string, string> = {
  vegan: '🌱 Vegan',
  vegetarian: '🥦 Vegetarian',
  gluten_free: 'GF',
  organic: '✓ Organic',
  dairy_free: 'Dairy-Free',
  nut_free: 'Nut-Free',
  raw: 'Raw',
  paleo: 'Paleo',
  keto: 'Keto',
  non_gmo: 'Non-GMO',
  sugar_free: 'Sugar-Free',
  local: '📍 Local',
};

interface ProductCardProps {
  product: Product;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQty } = useCartStore();
  const cartItem = items.find((i) => i.productId === product.id);
  const qty = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    addItem({ productId: product.id, vendorId: product.vendorId, quantity: 1 });
  };

  const handleIncrement = () => {
    updateQty(product.id, qty + 1);
  };

  const handleDecrement = () => {
    updateQty(product.id, qty - 1);
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        contentFit="cover"
        transition={200}
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
      />
      {!product.inStock && (
        <View style={styles.outOfStockOverlay}>
          <Text style={styles.outOfStockText}>Out of Stock</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>

        {product.tags && product.tags.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 4 }}
          >
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {product.tags.map((tag) => (
                <View
                  key={tag}
                  style={{
                    backgroundColor: Colors.lightGreen,
                    borderRadius: 10,
                    paddingHorizontal: 7,
                    paddingVertical: 2,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Outfit_500Medium',
                      fontSize: 9,
                      color: Colors.primaryGreen,
                    }}
                  >
                    {TAG_LABELS[tag] ?? tag}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            <Text style={styles.unit}>{product.unit}</Text>
          </View>
          {product.inStock && (
            <>
              {qty === 0 ? (
                <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.8}>
                  <Ionicons name="add" size={18} color={Colors.white} />
                </TouchableOpacity>
              ) : (
                <View style={styles.stepper}>
                  <TouchableOpacity style={styles.stepBtn} onPress={handleDecrement} activeOpacity={0.7}>
                    <Ionicons name="remove" size={16} color={Colors.primaryGreen} />
                  </TouchableOpacity>
                  <Text style={styles.qty}>{qty}</Text>
                  <TouchableOpacity style={styles.stepBtn} onPress={handleIncrement} activeOpacity={0.7}>
                    <Ionicons name="add" size={16} color={Colors.primaryGreen} />
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    margin: 4,
  },
  image: {
    width: '100%',
    height: 110,
    backgroundColor: Colors.lightGreen,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 110,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  content: {
    padding: 10,
    gap: 4,
  },
  name: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
    color: Colors.textPrimary,
  },
  description: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 15,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  price: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: Colors.textPrimary,
  },
  unit: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 10,
    color: Colors.textSecondary,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  stepBtn: {
    padding: 2,
  },
  qty: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
    color: Colors.textPrimary,
    minWidth: 16,
    textAlign: 'center',
  },
});
