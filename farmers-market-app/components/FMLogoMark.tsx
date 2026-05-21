import React from 'react';
import Svg, { Circle, Text as SvgText, Path } from 'react-native-svg';

interface FMLogoMarkProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export function FMLogoMark({
  size = 40,
  color = '#FFFFFF',
  backgroundColor = '#456F41',
}: FMLogoMarkProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Circle cx="20" cy="20" r="20" fill={backgroundColor} />
      {/* Leaf motif */}
      <Path
        d="M20 8 C24 12 26 16 20 18 C14 16 16 12 20 8Z"
        fill={color}
        opacity={0.6}
      />
      {/* FM lettermark */}
      <SvgText
        x="20"
        y="30"
        textAnchor="middle"
        fill={color}
        fontSize="13"
        fontWeight="bold"
        fontFamily="Georgia"
      >
        FM
      </SvgText>
    </Svg>
  );
}
