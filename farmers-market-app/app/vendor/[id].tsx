import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Badge } from '../../components/ui/Badge';
import { ProductCard } from '../../components/ProductCard';
import { vendors } from '../../data/vendors';
import { products } from '../../data/products';

export default function VendorProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [bioExpanded, setBioExpanded] = useState(false);

  const vendor = vendors.find((v) => v.id === id);
  const vendorProducts = products.filter((p) => p.vendorId === id);

  if (!vendor) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Vendor not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleMessage = () => {
    if (vendor.email) {
      Linking.openURL(`mailto:${vendor.email}?subject=Order inquiry from Shefa`);
    } else {
      Alert.alert('Messaging Coming Soon', 'In-app vendor messaging will be available in a future update.');
    }
  };

  const handleInstagram = () => {
    if (vendor.instagram) {
      Linking.openURL(`https://instagram.com/${vendor.instagram}`);
    }
  };

  const leftProducts = vendorProducts.filter((_, i) => i % 2 === 0);
  const rightProducts = vendorProducts.filter((_, i) => i % 2 !== 0);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover image with back button */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: vendor.coverImage }}
            style={styles.cover}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.coverOverlay} />
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: vendor.avatarImage }}
              style={styles.avatar}
              contentFit="cover"
            />
          </View>
        </View>

        <View style={styles.content}>
          {/* Vendor info */}
          <View style={styles.vendorHeader}>
            <Text style={styles.vendorName}>{vendor.name}</Text>
            <View style={styles.badgeRow}>
              <Badge category={vendor.category} />
              <View style={styles.boothBadge}>
                <Ionicons name="location-outline" size={12} color={Colors.textSecondary} />
                <Text style={styles.boothText}>Booth {vendor.booth}</Text>
              </View>
            </View>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#F4B942" />
              <Text style={styles.rating}>{vendor.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({vendor.reviewCount} reviews)</Text>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.yearsText}>{vendor.yearsAtMarket} yrs at market</Text>
            </View>
          </View>

          {/* Bio */}
          <View style={styles.bioSection}>
            <Text style={styles.bio} numberOfLines={bioExpanded ? undefined : 3}>
              {vendor.bio}
            </Text>
            <TouchableOpacity onPress={() => setBioExpanded(!bioExpanded)} activeOpacity={0.7}>
              <Text style={styles.bioToggle}>
                {bioExpanded ? 'Show less' : 'Read more'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleMessage} activeOpacity={0.8}>
              <Ionicons name="mail-outline" size={18} color={Colors.primaryGreen} />
              <Text style={styles.actionBtnText}>Message Vendor</Text>
            </TouchableOpacity>
            {vendor.instagram && (
              <TouchableOpacity style={styles.actionBtn} onPress={handleInstagram} activeOpacity={0.8}>
                <Ionicons name="logo-instagram" size={18} color={Colors.primaryGreen} />
                <Text style={styles.actionBtnText}>Instagram</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Products */}
          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>Available This Saturday</Text>
            <View style={styles.productsGrid}>
              <View style={styles.productsCol}>
                {leftProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </View>
              <View style={styles.productsCol}>
                {rightProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </View>
            </View>
          </View>

          {/* About */}
          <View style={styles.aboutSection}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.aboutCard}>
              <View style={styles.aboutRow}>
                <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.aboutText}>{vendor.location}</Text>
              </View>
              <View style={styles.aboutRow}>
                <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.aboutText}>
                  {vendor.yearsAtMarket} year{vendor.yearsAtMarket !== 1 ? 's' : ''} at Barton Creek FM
                </Text>
              </View>
              {vendor.certifications.map((cert) => (
                <View key={cert} style={styles.aboutRow}>
                  <Ionicons name="checkmark-circle-outline" size={16} color={Colors.primaryGreen} />
                  <Text style={styles.aboutText}>{cert}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontFamily: 'Outfit_400Regular', fontSize: 16, color: Colors.textSecondary },
  backLink: { fontFamily: 'Outfit_600SemiBold', fontSize: 15, color: Colors.primaryGreen },
  coverContainer: { position: 'relative', height: 220 },
  cover: { width: '100%', height: 220, backgroundColor: Colors.lightGreen },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -28,
    left: 20,
    borderWidth: 3,
    borderColor: Colors.white,
    borderRadius: 32,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.lightGreen,
  },
  content: { paddingTop: 40, paddingHorizontal: 20, paddingBottom: 40 },
  vendorHeader: { gap: 8, marginBottom: 12 },
  vendorName: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 30,
    color: Colors.textPrimary,
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  boothBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  boothText: { fontFamily: 'Outfit_500Medium', fontSize: 11, color: Colors.textSecondary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { fontFamily: 'Outfit_600SemiBold', fontSize: 13, color: Colors.textPrimary },
  reviewCount: { fontFamily: 'Outfit_400Regular', fontSize: 13, color: Colors.textSecondary },
  dot: { color: Colors.textSecondary, fontSize: 13 },
  yearsText: { fontFamily: 'Outfit_400Regular', fontSize: 13, color: Colors.textSecondary },
  bioSection: { gap: 4, marginBottom: 16 },
  bio: { fontFamily: 'Outfit_400Regular', fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  bioToggle: { fontFamily: 'Outfit_600SemiBold', fontSize: 13, color: Colors.primaryGreen, marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.primaryGreen,
    backgroundColor: Colors.white,
  },
  actionBtnText: { fontFamily: 'Outfit_600SemiBold', fontSize: 13, color: Colors.primaryGreen },
  productsSection: { marginBottom: 24 },
  sectionTitle: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 22,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  productsGrid: { flexDirection: 'row', gap: 0 },
  productsCol: { flex: 1 },
  aboutSection: { marginBottom: 8 },
  aboutCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 12,
  },
  aboutRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  aboutText: { fontFamily: 'Outfit_400Regular', fontSize: 14, color: Colors.textSecondary, flex: 1 },
});
