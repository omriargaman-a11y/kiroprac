import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import Svg, { Rect, Text as SvgText, G } from 'react-native-svg';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Vendor } from '../types';
import { Colors, CategoryColors } from '../constants/colors';
import { Button } from './ui/Button';

const BOOTH_WIDTH = 90;
const BOOTH_HEIGHT = 60;
const GAP = 10;
const PADDING = 16;
const COLS = 6;

interface BoothCell {
  booth: string;
  row: string;
  col: number;
  vendor?: Vendor;
}

interface BoothMapProps {
  vendors: Vendor[];
}

const ROWS = ['A', 'B', 'C'];

function buildGrid(vendors: Vendor[]): BoothCell[] {
  const cells: BoothCell[] = [];
  ROWS.forEach((row) => {
    for (let col = 1; col <= COLS; col++) {
      const boothId = `${row}${col}`;
      const vendor = vendors.find((v) => v.booth === boothId);
      cells.push({ booth: boothId, row, col, vendor });
    }
  });
  return cells;
}

const SVG_WIDTH = COLS * BOOTH_WIDTH + (COLS - 1) * GAP + PADDING * 2;
const SVG_HEIGHT = ROWS.length * BOOTH_HEIGHT + (ROWS.length - 1) * GAP + PADDING * 2 + 40;

export function BoothMap({ vendors }: BoothMapProps) {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const cells = buildGrid(vendors);

  const getCellColor = (vendor?: Vendor) => {
    if (!vendor) return '#F0F0EC';
    return CategoryColors[vendor.category] ?? Colors.lightGreen;
  };

  const handleBoothPress = (vendor?: Vendor) => {
    if (vendor) setSelectedVendor(vendor);
  };

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Svg width={SVG_WIDTH} height={SVG_HEIGHT}>
          {/* Entrance indicator */}
          <SvgText
            x={SVG_WIDTH / 2}
            y={SVG_HEIGHT - 8}
            textAnchor="middle"
            fill={Colors.textSecondary}
            fontSize="11"
            fontFamily="Outfit_400Regular"
          >
            ▼  Entrance
          </SvgText>

          {cells.map((cell) => {
            const rowIndex = ROWS.indexOf(cell.row);
            const colIndex = cell.col - 1;
            const x = PADDING + colIndex * (BOOTH_WIDTH + GAP);
            const y = PADDING + rowIndex * (BOOTH_HEIGHT + GAP);
            const fill = getCellColor(cell.vendor);

            return (
              <G key={cell.booth} onPress={() => handleBoothPress(cell.vendor)}>
                <Rect
                  x={x}
                  y={y}
                  width={BOOTH_WIDTH}
                  height={BOOTH_HEIGHT}
                  rx={8}
                  fill={fill}
                  stroke={cell.vendor ? Colors.primaryGreen : Colors.border}
                  strokeWidth={cell.vendor ? 1.5 : 1}
                />
                <SvgText
                  x={x + BOOTH_WIDTH / 2}
                  y={y + 16}
                  textAnchor="middle"
                  fill={Colors.textSecondary}
                  fontSize="10"
                  fontFamily="Outfit_500Medium"
                >
                  {cell.booth}
                </SvgText>
                <SvgText
                  x={x + BOOTH_WIDTH / 2}
                  y={y + 30}
                  textAnchor="middle"
                  fill={Colors.textPrimary}
                  fontSize="10"
                  fontFamily="Outfit_600SemiBold"
                >
                  {cell.vendor
                    ? cell.vendor.name.length > 12
                      ? cell.vendor.name.slice(0, 11) + '…'
                      : cell.vendor.name
                    : '—'}
                </SvgText>
                {cell.vendor && (
                  <SvgText
                    x={x + BOOTH_WIDTH / 2}
                    y={y + 45}
                    textAnchor="middle"
                    fill={Colors.textSecondary}
                    fontSize="9"
                    fontFamily="Outfit_400Regular"
                  >
                    {cell.vendor.category.replace('_', ' ')}
                  </SvgText>
                )}
              </G>
            );
          })}
        </Svg>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        {Object.entries(CategoryColors).map(([cat, color]) => (
          <View key={cat} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendLabel}>
              {cat.replace('_', ' ')}
            </Text>
          </View>
        ))}
      </View>

      {/* Bottom sheet modal */}
      <Modal
        visible={!!selectedVendor}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedVendor(null)}
      >
        <Pressable style={styles.overlay} onPress={() => setSelectedVendor(null)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            {selectedVendor && (
              <>
                <View style={styles.sheetHeader}>
                  <Image
                    source={{ uri: selectedVendor.avatarImage }}
                    style={styles.sheetAvatar}
                    contentFit="cover"
                  />
                  <View style={styles.sheetInfo}>
                    <Text style={styles.sheetName}>{selectedVendor.name}</Text>
                    <Text style={styles.sheetBooth}>Booth {selectedVendor.booth}</Text>
                    <Text style={styles.sheetTagline}>{selectedVendor.tagline}</Text>
                  </View>
                </View>
                <Button
                  label="View Vendor →"
                  onPress={() => {
                    setSelectedVendor(null);
                    router.push(`/vendor/${selectedVendor.id}`);
                  }}
                  style={styles.sheetBtn}
                />
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setSelectedVendor(null)}
                >
                  <Ionicons name="close" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  legendLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 16,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 20,
  },
  sheetAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.lightGreen,
  },
  sheetInfo: { flex: 1, justifyContent: 'center', gap: 4 },
  sheetName: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 22,
    color: Colors.textPrimary,
  },
  sheetBooth: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: Colors.primaryGreen,
  },
  sheetTagline: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  sheetBtn: {
    marginBottom: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 4,
  },
});
