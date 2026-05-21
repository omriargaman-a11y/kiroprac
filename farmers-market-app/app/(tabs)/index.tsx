import React, { useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { markets } from '../../data/markets';
import { Market } from '../../types';

const USA_REGION = {
  latitude: 39.5,
  longitude: -98.35,
  latitudeDelta: 55,
  longitudeDelta: 55,
};

// Only render markers when zoomed in enough, otherwise show summary
// We split into supported (always show) and unsupported (show when zoomed)
const supportedMarkets = markets.filter((m) => m.supported);

export default function MarketMapHome() {
  const [selected, setSelected] = useState<Market | null>(null);
  const [region, setRegion] = useState(USA_REGION);
  const cardAnim = useRef(new Animated.Value(0)).current;

  const isZoomedIn = region.latitudeDelta < 5;

  // Show supported always; show unsupported only when zoomed in
  const visibleMarkets = useMemo(() => {
    if (isZoomedIn) {
      // Filter to only markets in current view for performance
      const latMin = region.latitude - region.latitudeDelta;
      const latMax = region.latitude + region.latitudeDelta;
      const lonMin = region.longitude - region.longitudeDelta;
      const lonMax = region.longitude + region.longitudeDelta;
      return markets.filter(
        (m) =>
          m.latitude >= latMin &&
          m.latitude <= latMax &&
          m.longitude >= lonMin &&
          m.longitude <= lonMax
      );
    }
    return supportedMarkets;
  }, [isZoomedIn, region]);

  const handleMarkerPress = (market: Market) => {
    setSelected(market);
    Animated.spring(cardAnim, {
      toValue: 1,
      friction: 8,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  const handleDismiss = () => {
    Animated.timing(cardAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setSelected(null));
  };

  const cardTranslateY = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        initialRegion={USA_REGION}
        showsUserLocation
        showsCompass={false}
        onPress={handleDismiss}
        onRegionChangeComplete={setRegion}
      >
        {visibleMarkets.map((market) => (
          <Marker
            key={market.id}
            coordinate={{ latitude: market.latitude, longitude: market.longitude }}
            onPress={() => handleMarkerPress(market)}
            tracksViewChanges={false}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            {/* 
              Wrapping in a TouchableOpacity ensures the press fires on both
              iOS and Android even with custom children inside Marker 
            */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleMarkerPress(market)}
              style={market.supported
                ? [styles.pin, styles.pinSupported, selected?.id === market.id && styles.pinActive]
                : [styles.pin, styles.pinUnsupported, selected?.id === market.id && styles.pinUnsupportedActive]
              }
            >
              {market.supported ? (
                <Image
                  source={require('../../assets/Shefa lettermark logo (S) (no background).png')}
                  style={styles.pinLettermark}
                  resizeMode="contain"
                />
              ) : (
                <Ionicons
                  name="storefront"
                  size={12}
                  color={selected?.id === market.id ? Colors.white : Colors.textSecondary}
                />
              )}
            </TouchableOpacity>
          </Marker>
        ))}
      </MapView>

      {/* Top bar */}
      <SafeAreaView edges={['top']} style={styles.topBar}>
        <View style={styles.topBarInner}>
          <Image
            source={require('../../assets/Shefa Wordmark (no background).png')}
            style={styles.wordmark}
            resizeMode="contain"
          />
          <View style={styles.locationBtn}>
            <Ionicons name="globe-outline" size={14} color={Colors.primaryGreen} />
            <Text style={styles.locationText}>United States</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Legend pill */}
      <View style={styles.legendContainer}>
        <View style={styles.legendPill}>
          <View style={styles.legendDot} />
          <Text style={styles.legendText}>{supportedMarkets.length} Shefa markets</Text>
          <View style={styles.legendDivider} />
          <Ionicons name="storefront-outline" size={12} color={Colors.textSecondary} />
          <Text style={styles.legendText}>
            {isZoomedIn ? `${visibleMarkets.length - visibleMarkets.filter(m => m.supported).length} nearby` : `${markets.length - supportedMarkets.length} total`}
          </Text>
        </View>
        {!isZoomedIn && (
          <View style={[styles.legendPill, { marginTop: 6 }]}>
            <Ionicons name="zoom-in-outline" size={12} color={Colors.textSecondary} />
            <Text style={styles.legendText}>Zoom in to see all markets</Text>
          </View>
        )}
      </View>

      {/* Market card */}
      {selected && (
        <Animated.View
          style={[
            styles.card,
            { transform: [{ translateY: cardTranslateY }], opacity: cardAnim },
          ]}
        >
          <View style={styles.cardHandle} />

          {selected.supported && (
            <View style={styles.supportedBadge}>
              <Image
                source={require('../../assets/Shefa lettermark logo (S) (no background).png')}
                style={{ width: 14, height: 14 }}
                resizeMode="contain"
              />
              <Text style={styles.supportedText}>Shefa Market · Pre-order available</Text>
            </View>
          )}

          <View style={styles.cardTitleRow}>
            <View style={[styles.cardIconWrap, !selected.supported && styles.cardIconWrapGray]}>
              <Ionicons name="storefront" size={20} color={selected.supported ? Colors.primaryGreen : Colors.textSecondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle} numberOfLines={2}>{selected.name}</Text>
              <Text style={styles.cardOrganizer}>
                {selected.city ? `${selected.city}, ` : ''}{selected.state}
                {selected.organizer ? ` · ${selected.organizer}` : ''}
              </Text>
            </View>
            <TouchableOpacity onPress={handleDismiss} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.cardDetails}>
            {selected.schedule ? (
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={14} color={Colors.primaryGreen} />
                <Text style={styles.detailText}>{selected.schedule}</Text>
              </View>
            ) : null}
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={14} color={Colors.primaryGreen} />
              <Text style={styles.detailText} numberOfLines={2}>{selected.address}</Text>
            </View>
            {selected.preOrderCutoff ? (
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={14} color={Colors.primaryGreen} />
                <Text style={styles.detailText}>Pre-order by {selected.preOrderCutoff}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.cardFooter}>
            {selected.vendorCount > 0 && (
              <View style={styles.vendorCount}>
                <Text style={styles.vendorCountNum}>{selected.vendorCount}</Text>
                <Text style={styles.vendorCountLabel}>vendors</Text>
              </View>
            )}
            {selected.supported ? (
              <TouchableOpacity
                style={styles.enterBtn}
                activeOpacity={0.85}
                onPress={() => {
                  const marketId = selected.id;
                  handleDismiss();
                  setTimeout(() => router.push(`/market/${marketId}`), 50);
                }}
              >
                <Text style={styles.enterBtnText}>Enter Market</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.white} />
              </TouchableOpacity>
            ) : (
              <View style={styles.comingSoonBtn}>
                <Text style={styles.comingSoonText}>Coming Soon on Shefa</Text>
              </View>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  topBarInner: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  wordmark: { height: 26, width: 90 },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.lightGreen,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  locationText: { fontFamily: 'Outfit_600SemiBold', fontSize: 12, color: Colors.primaryGreen },
  legendContainer: { position: 'absolute', top: 108, alignSelf: 'center', zIndex: 9, alignItems: 'center' },
  legendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  legendDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primaryGreen },
  legendText: { fontFamily: 'Outfit_500Medium', fontSize: 11, color: Colors.textSecondary },
  legendDivider: { width: 1, height: 12, backgroundColor: Colors.border, marginHorizontal: 2 },
  pin: {
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pinSupported: {
    width: 36,
    height: 36,
    backgroundColor: Colors.primaryGreen,
    borderWidth: 2,
    borderColor: Colors.darkGreen,
  },
  pinUnsupported: {
    width: 26,
    height: 26,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pinActive: { backgroundColor: Colors.darkGreen },
  pinUnsupportedActive: { backgroundColor: Colors.textSecondary },
  pinLettermark: { width: 20, height: 20 },
  card: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 28,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  cardHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 14,
  },
  supportedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.lightGreen, paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, alignSelf: 'flex-start', marginBottom: 12,
  },
  supportedText: { fontFamily: 'Outfit_600SemiBold', fontSize: 11, color: Colors.primaryGreen },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  cardIconWrap: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: Colors.lightGreen, alignItems: 'center', justifyContent: 'center',
  },
  cardIconWrapGray: { backgroundColor: '#F0F0EC' },
  cardTitle: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 18, color: Colors.textPrimary },
  cardOrganizer: { fontFamily: 'Outfit_400Regular', fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  closeBtn: { padding: 4 },
  cardDetails: {
    gap: 7, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border, marginBottom: 14,
  },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  detailText: { fontFamily: 'Outfit_400Regular', fontSize: 13, color: Colors.textSecondary, flex: 1 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  vendorCount: { alignItems: 'center' },
  vendorCountNum: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 28, color: Colors.primaryGreen, lineHeight: 30 },
  vendorCountLabel: { fontFamily: 'Outfit_400Regular', fontSize: 11, color: Colors.textSecondary },
  enterBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primaryGreen, paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 16, shadowColor: Colors.primaryGreen,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  enterBtnText: { fontFamily: 'Outfit_600SemiBold', fontSize: 15, color: Colors.white },
  comingSoonBtn: {
    flex: 1, paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 16, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.background,
    alignItems: 'center',
  },
  comingSoonText: { fontFamily: 'Outfit_500Medium', fontSize: 13, color: Colors.textSecondary },
});
