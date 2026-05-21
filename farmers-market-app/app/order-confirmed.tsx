import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '../constants/colors';
import { Button } from '../components/ui/Button';

const ORDER_NUM = `BCM-${Math.floor(1000 + Math.random() * 9000)}`;

const qrValue = JSON.stringify({
  orderId: ORDER_NUM,
  app: 'Shefa',
  market: 'Barton Creek Farmers Market',
  pickup: 'Saturday 9AM-1PM',
  timestamp: new Date().toISOString(),
});

export default function OrderConfirmed() {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Shefa wordmark */}
        <Animated.View
          style={[
            styles.logoWrap,
            { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
          ]}
        >
          <Image
            source={require('../assets/Shefa Wordmark (no background).png')}
            style={styles.wordmark}
            resizeMode="contain"
          />
        </Animated.View>

        <Text style={styles.title}>Order Reserved! 🎉</Text>
        <Text style={styles.orderNum}>Order {ORDER_NUM}</Text>
        <Text style={styles.subtitle}>
          Your pre-order has been sent to the vendors. Show this QR code at pickup.
        </Text>

        {/* QR Code */}
        <View style={styles.qrContainer}>
          <QRCode
            value={qrValue}
            size={180}
            color={Colors.textPrimary}
            backgroundColor={Colors.white}
          />
          <Text style={styles.qrNote}>Show this at pickup · Saturday 9AM–1PM</Text>
        </View>

        {/* QR instruction */}
        <View style={styles.qrInstructionCard}>
          <Ionicons name="qr-code-outline" size={22} color={Colors.primaryGreen} />
          <Text style={styles.qrInstructionText}>
            Show this QR code to your vendor at pickup to confirm your order.
          </Text>
        </View>

        {/* Pickup info */}
        <View style={styles.pickupCard}>
          <View style={styles.pickupRow}>
            <Ionicons name="location-outline" size={18} color={Colors.primaryGreen} />
            <Text style={styles.pickupText}>
              Barton Creek Farmers Market{'\n'}2525 Bee Cave Rd, Austin, TX
            </Text>
          </View>
          <View style={styles.pickupRow}>
            <Ionicons name="time-outline" size={18} color={Colors.primaryGreen} />
            <Text style={styles.pickupText}>Saturday, 9:00 AM – 1:00 PM</Text>
          </View>
        </View>

        <Button
          label="Back to Market"
          size="lg"
          onPress={() => router.replace('/(tabs)/')}
          style={styles.cta}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    gap: 16,
  },
  logoWrap: {
    backgroundColor: Colors.primaryGreen,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 8,
  },
  wordmark: {
    width: 140,
    height: 40,
  },
  title: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 34,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  orderNum: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
    color: Colors.primaryGreen,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  qrContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    alignItems: 'center',
    gap: 14,
    width: '100%',
  },
  qrNote: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  qrInstructionCard: {
    backgroundColor: Colors.lightGreen,
    borderRadius: 14,
    padding: 14,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qrInstructionText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: Colors.primaryGreen,
    flex: 1,
  },
  pickupCard: {
    width: '100%',
    backgroundColor: Colors.lightGreen,
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  pickupRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  pickupText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
  cta: { width: '100%', marginTop: 8 },
});
