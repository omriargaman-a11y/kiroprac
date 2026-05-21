import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { CategoryChip } from '../../components/CategoryChip';
import { VendorCard } from '../../components/VendorCard';
import { markets } from '../../data/markets';
import { vendors } from '../../data/vendors';
import { Category } from '../../types';

const CATEGORIES: Array<Category | 'all'> = [
  'all', 'produce', 'meat_dairy', 'baked_goods', 'prepared_foods', 'plants', 'specialty',
];

export default function MarketDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const market = markets.find((m) => m.id === id);
  const marketVendors = vendors.filter((v) => v.marketId === id);
  const filtered = activeCategory === 'all'
    ? marketVendors
    : marketVendors.filter((v) => v.category === activeCategory);

  const nextDate = market ? new Date(market.nextDate).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  }) : '';

  if (!market) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Market not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Image
            source={require('../../assets/Shefa lettermark logo (S) (no background).png')}
            style={styles.lettermark}
            resizeMode="contain"
          />
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Market info card */}
        <View style={styles.infoCard}>
          <Text style={styles.marketName}>{market.name}</Text>
          <View style={styles.infoRows}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="calendar-outline" size={15} color={Colors.primaryGreen} />
              </View>
              <Text style={styles.infoText}>{nextDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="time-outline" size={15} color={Colors.primaryGreen} />
              </View>
              <Text style={styles.infoText}>{market.schedule}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="location-outline" size={15} color={Colors.primaryGreen} />
              </View>
              <Text style={styles.infoText}>{market.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="storefront-outline" size={15} color={Colors.primaryGreen} />
              </View>
              <Text style={styles.infoText}>{market.vendorCount} vendors this week</Text>
            </View>
          </View>

          <View style={styles.preOrderBanner}>
            <Ionicons name="time-outline" size={14} color={Colors.primaryGreen} />
            <Text style={styles.preOrderText}>
              Pre-order by <Text style={styles.preOrderBold}>{market.preOrderCutoff}</Text> for Saturday pickup
            </Text>
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/map')}
            activeOpacity={0.85}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="map-outline" size={22} color={Colors.primaryGreen} />
            </View>
            <Text style={styles.actionLabel}>Booth Map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/search')}
            activeOpacity={0.85}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="search-outline" size={22} color={Colors.primaryGreen} />
            </View>
            <Text style={styles.actionLabel}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/cart')}
            activeOpacity={0.85}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="bag-outline" size={22} color={Colors.primaryGreen} />
            </View>
            <Text style={styles.actionLabel}>My Cart</Text>
          </TouchableOpacity>
        </View>

        {/* Vendor section */}
        <View style={styles.vendorSection}>
          <Text style={styles.sectionTitle}>Vendors</Text>

          {/* Category filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat}
                category={cat}
                active={activeCategory === cat}
                onPress={() => setActiveCategory(cat)}
              />
            ))}
          </ScrollView>

          {/* Vendor list */}
          <View style={styles.vendorList}>
            {filtered.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🌿</Text>
                <Text style={styles.emptyTitle}>No vendors in this category</Text>
              </View>
            ) : (
              filtered.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { fontFamily: 'Outfit_400Regular', fontSize: 16, color: Colors.textSecondary },

  header: {
    backgroundColor: Colors.primaryGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  lettermark: { height: 32, width: 32 },

  scroll: { paddingBottom: 40 },

  infoCard: {
    margin: 16,
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  marketName: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 26,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  infoRows: { gap: 10, marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  preOrderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.lightGreen,
    borderRadius: 12,
    padding: 12,
  },
  preOrderText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: Colors.primaryGreen,
    flex: 1,
  },
  preOrderBold: { fontFamily: 'Outfit_700Bold' },

  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 8,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
    color: Colors.textPrimary,
  },

  vendorSection: { paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 26,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  chips: { paddingBottom: 12 },
  vendorList: { paddingTop: 4 },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyEmoji: { fontSize: 36 },
  emptyTitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    color: Colors.textSecondary,
  },
});
