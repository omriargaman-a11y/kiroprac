export const Colors = {
  primaryGreen: '#456F41',
  darkGreen: '#2D5016',
  lightGreen: '#EAF2E9',
  background: '#FAFAF7',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  border: '#E5E5E0',
  error: '#C0392B',
  white: '#FFFFFF',

  // Category colors (subtle tints)
  categoryProduce: '#E8F5E2',
  categoryMeatDairy: '#FFF0E8',
  categoryBakedGoods: '#FFF8E8',
  categoryPreparedFoods: '#E8F0FF',
  categoryPlants: '#E2F5E8',
  categorySpecialty: '#F5E8FF',
} as const;

export const CategoryColors: Record<string, string> = {
  produce: Colors.categoryProduce,
  meat_dairy: Colors.categoryMeatDairy,
  baked_goods: Colors.categoryBakedGoods,
  prepared_foods: Colors.categoryPreparedFoods,
  plants: Colors.categoryPlants,
  specialty: Colors.categorySpecialty,
};
