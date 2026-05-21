import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { BoothMap } from '../../components/BoothMap';
import { vendors } from '../../data/vendors';
import { markets } from '../../data/markets';

export default function MapScreen() {
  const market = markets[0];
  const marketVendors = vendors.filter((v) => v.marketId === market.id);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Booth Map</Text>
          <Text style={styles.headerSub}>{market.name}</Text>
        </View>
        <Image
          source={require('../../assets/Shefa lettermark logo (S) (no background).png')}
          style={styles.lettermark}
          resizeMode="contain"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.mapCard}>
          <Text style={styles.mapNote}>Tap any booth to see vendor details</Text>
          <BoothMap vendors={marketVendors} />
        </View>

        {/* Vendor quick list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Booths</Text>
          {marketVendors
            .sort((a, b) => a.booth.localeCompare(b.booth))
            .map((vendor) => (
              <View key={vendor.id} style={styles.boothRow}>
                <View style={styles.boothNum}>
                  <Text style={styles.boothNumText}>{vendor.booth}</Text>
                </View>
                <View style={styles.boothInfo}>
                  <Text style={styles.boothName}>{vendor.name}</Text>
                  <Text style={styles.boothCategory}>
                    {vendor.category.replace('_', ' ')}
                  </Text>
                </View>
              </View>
            ))}
        </View>
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
  headerTitle: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 24, color: Colors.white },
  headerSub: { fontFamily: 'Outfit_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  lettermark: { width: 32, height: 32 },
  scroll: { paddingBottom: 100 },
  mapCard: {
    margin: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 16,
    overflow: 'hidden',
  },
  mapNote: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  section: { paddingHorizontal: 16 },
  sectionTitle: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  boothRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  boothNum: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boothNumText: { fontFamily: 'Outfit_700Bold', fontSize: 14, color: Colors.primaryGreen },
  boothInfo: { flex: 1 },
  boothName: { fontFamily: 'Outfit_600SemiBold', fontSize: 14, color: Colors.textPrimary },
  boothCategory: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
    marginTop: 1,
  },
});
