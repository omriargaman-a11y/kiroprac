import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { CartItem, Product } from '../types';
import { Colors } from '../constants/colors';
import { useCartStore } from '../stores/cartStore';

interface CartItemRowProps {
  item: CartItem;
  product: Product;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function CartItemRow({ item, product }: CartItemRowProps) {
  const { updateQty, removeItem } = useCartStore();

  return (
    <View style={styles.row}>
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        contentFit="cover"
        transition={150}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.unit}>{product.unit}</Text>
        <View style={styles.stepper}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => updateQty(product.id, item.quantity - 1)}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={14} color={Colors.primaryGreen} />
          </TouchableOpacity>
          <Text style={styles.qty}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => updateQty(product.id, item.quantity + 1)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={14} color={Colors.primaryGreen} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.right}>
        <TouchableOpacity
          onPress={() => removeItem(product.id)}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.price}>
          {formatPrice(product.price * item.quantity)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: Colors.lightGreen,
  },
  info: { flex: 1, gap: 3 },
  name: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  unit: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  stepBtn: { padding: 1 },
  qty: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
    color: Colors.textPrimary,
    minWidth: 16,
    textAlign: 'center',
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingVertical: 2,
  },
  price: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: Colors.textPrimary,
  },
});
