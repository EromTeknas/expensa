import {PixelRatio} from 'react-native';

/**
 * Convert px (absolute pixels) to dp (density-independent pixels)
 */
const scaleSize = (px: number) => {
  const pixelDensity = PixelRatio.get();

  return PixelRatio.roundToNearestPixel(px / pixelDensity);
};

const Sizing = {
  4: scaleSize(4),
  8: scaleSize(8),
  12: scaleSize(12),
  16: scaleSize(16),
  20: scaleSize(20),
  24: scaleSize(24),
  28: scaleSize(28),
  32: scaleSize(32),
  36: scaleSize(36),
  40: scaleSize(40),
  44: scaleSize(44),
  48: scaleSize(48),
  52: scaleSize(52),
  56: scaleSize(56),
  60: scaleSize(60),
  64: scaleSize(64),
};

export {Sizing, scaleSize};
