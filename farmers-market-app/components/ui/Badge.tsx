import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, CategoryColors } from '../../constants/colors';
import { Category } from '../../types';

const CATEGORY_LABELS: Record<Category, string> = {
  produce: 'Produce',
  meat_dairy: 'Meat & Dairy',
  baked_goods: 'Baked Goods',
  prepared_foods: 'Prepared Foods',
  plants: 'Plants',
  specialty: 'Specialty',
};

interface BadgeProps {
  label?: string;
  category?: Category;
  style?: ViewStyle;
}

export function Badge({ label, category, style }: BadgeProps) {
  const text = label ?? (category ? CATEGORY_LABELS[category] : '');
  const bg = category ? CategoryColors[category] : Colors.lightGreen;

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 11,
    color: Colors.textPrimary,
  },
});
