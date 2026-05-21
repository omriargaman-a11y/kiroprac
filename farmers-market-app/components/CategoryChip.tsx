import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Category } from '../types';

const CATEGORY_EMOJIS: Record<Category | 'all', string> = {
  all: '🌿',
  produce: '🥬',
  meat_dairy: '🥩',
  baked_goods: '🥖',
  prepared_foods: '🍱',
  plants: '🌱',
  specialty: '✨',
};

const CATEGORY_LABELS: Record<Category | 'all', string> = {
  all: 'All',
  produce: 'Produce',
  meat_dairy: 'Meat & Dairy',
  baked_goods: 'Baked Goods',
  prepared_foods: 'Prepared Foods',
  plants: 'Plants',
  specialty: 'Specialty',
};

interface CategoryChipProps {
  category: Category | 'all';
  active?: boolean;
  onPress?: () => void;
}

export function CategoryChip({ category, active = false, onPress }: CategoryChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>{CATEGORY_EMOJIS[category]}</Text>
      <Text style={[styles.label, active && styles.labelActive]}>
        {CATEGORY_LABELS[category]}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: Colors.primaryGreen,
    borderColor: Colors.primaryGreen,
  },
  emoji: { fontSize: 14 },
  label: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: Colors.textPrimary,
  },
  labelActive: { color: Colors.white },
});
