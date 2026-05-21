import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Colors } from '../../constants/colors';
import { vendors } from '../../data/vendors';
import { products } from '../../data/products';
import { Category } from '../../types';

const CATEGORIES: Array<{ key: Category; emoji: string; label: string }> = [
  { key: 'produce', emoji: '🥬', label: 'Produce' },
  { key: 'meat_dairy', emoji: '🥩', label: 'Meat & Dairy' },
  { key: 'baked_goods', emoji: '🥖', label: 'Baked Goods' },
  { key: 'prepared_foods', emoji: '🍱', label: 'Prepared Foods' },
  { key: 'plants', emoji: '🌱', label: 'Plants' },
  { key: 'specialty', emoji: '✨', label: 'Specialty' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const addRecent = (q: string) => {
    if (!q.trim()) return;
    setRecentSearches((prev) => [q, ...prev.filter((s) => s !== q)].slice(0, 5));
  };

  const handleSubmit = () => {
    if (query.trim()) addRecent(query.trim());
  };

  const handleRecentPress = (s: string) => {
    setQuery(s);
  };

  const matchingVendors = query.trim()
    ? vendors.filter(
        (v) =>
          v.name.toLowerCase().includes(query.toLowerCase()) ||
          v.tagline.toLowerCase().includes(query.toLowerCase()) ||
          v.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchingProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const hasResults = matchingVendors.length > 0 || matchingProducts.length > 0;
  const showEmpty = query.trim() && !hasResults;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <Image
          source={require('../../assets/Shefa lettermark logo (S) (no background).png')}
          style={styles.lettermark}
          resizeMode="contain"
        />
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
        <TextInput
          style={styles.input}
          placeholder="Search vendors, products…"
          placeholderTextColor={Colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {!query.trim() && (
          <>
            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent</Text>
                  <TouchableOpacity onPress={() => setRecentSearches([])}>
                    <Text style={styles.clearText}>Clear</Text>
                  </TouchableOpacity>
                </View>
                {recentSearches.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={styles.recentRow}
                    onPress={() => handleRecentPress(s)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.recentText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Browse by category */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Browse by Category</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.key}
                    style={styles.categoryCard}
                    activeOpacity={0.8}
                    onPress={() => setQuery(cat.label)}
                  >
                    <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Search results */}
        {query.trim() && hasResults && (
          <>
            {matchingVendors.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Vendors ({matchingVendors.length})
                </Text>
                {matchingVendors.map((vendor) => (
                  <TouchableOpacity
                    key={vendor.id}
                    style={styles.resultRow}
                    onPress={() => {
                      addRecent(query);
                      router.push(`/vendor/${vendor.id}`);
                    }}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: vendor.avatarImage }}
                      style={styles.resultAvatar}
                      contentFit="cover"
                    />
                    <View style={styles.resultInfo}>
                      <Text style={styles.resultName}>{vendor.name}</Text>
                      <Text style={styles.resultSub} numberOfLines={1}>
                        {vendor.tagline}
                      </Text>
                    </View>
                    <View style={styles.boothTag}>
                      <Text style={styles.boothText}>{vendor.booth}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={Colors.border} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {matchingProducts.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Products ({matchingProducts.length})
                </Text>
                {matchingProducts.map((product) => {
                  const vendor = vendors.find((v) => v.id === product.vendorId);
                  return (
                    <TouchableOpacity
                      key={product.id}
                      style={styles.resultRow}
                      onPress={() => {
                        addRecent(query);
                        router.push(`/vendor/${product.vendorId}`);
                      }}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{ uri: product.image }}
                        style={styles.resultAvatar}
                        contentFit="cover"
                      />
                      <View style={styles.resultInfo}>
                        <Text style={styles.resultName}>{product.name}</Text>
                        <Text style={styles.resultSub} numberOfLines={1}>
                          {vendor?.name} · ${(product.price / 100).toFixed(2)} {product.unit}
                        </Text>
                      </View>
                      {!product.inStock && (
                        <View style={styles.outBadge}>
                          <Text style={styles.outText}>Out</Text>
                        </View>
                      )}
                      <Ionicons name="chevron-forward" size={16} color={Colors.border} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </>
        )}

        {showEmpty && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No results</Text>
            <Text style={styles.emptyText}>
              Try searching for a vendor name, product, or category.
            </Text>
          </View>
        )}
      </ScrollView>
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
  headerTitle: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 24,
    color: Colors.white,
  },
  lettermark: { width: 32, height: 32 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
  },
  scroll: { paddingBottom: 32 },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  clearText: { fontFamily: 'Outfit_500Medium', fontSize: 13, color: Colors.primaryGreen },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  recentText: { fontFamily: 'Outfit_400Regular', fontSize: 14, color: Colors.textPrimary },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  categoryEmoji: { fontSize: 28 },
  categoryLabel: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 11,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultAvatar: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: Colors.lightGreen,
  },
  resultInfo: { flex: 1 },
  resultName: { fontFamily: 'Outfit_600SemiBold', fontSize: 14, color: Colors.textPrimary },
  resultSub: { fontFamily: 'Outfit_400Regular', fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  boothTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: Colors.lightGreen,
  },
  boothText: { fontFamily: 'Outfit_600SemiBold', fontSize: 12, color: Colors.primaryGreen },
  outBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  outText: { fontFamily: 'Outfit_600SemiBold', fontSize: 11, color: Colors.error },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 22, color: Colors.textPrimary },
  emptyText: { fontFamily: 'Outfit_400Regular', fontSize: 14, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 32 },
});
