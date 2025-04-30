import {PixelRatio} from 'react-native';

const fontScaleRatio = PixelRatio.getFontScale();

export default function getFontSize(size: number) {
  return fontScaleRatio * size;
}
