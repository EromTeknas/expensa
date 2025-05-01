// components/ui/Button.tsx

import React, {useRef} from 'react';
import {
  TouchableWithoutFeedback,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import {FONTFAMILIES} from '../../constants/fonts';
import COLORS from '../../constants/colors';
import getFontSize from '../../utils/fontSize';
import Icon from 'react-native-vector-icons/Ionicons';

export enum BUTTON_SIZE {
  SMALL = 12,
  MEDIUM = 16,
  LARGE = 20,
}

type ButtonProps = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  size?: BUTTON_SIZE;
  disabled?: boolean;
  loading?: boolean;
  prefixIcon?: string;
  suffixIcon?: string;
  style?: ViewStyle;
};

const Button = ({
  label,
  onPress,
  size = BUTTON_SIZE.MEDIUM,
  disabled = false,
  loading = true,
  prefixIcon = 'chevron-up-outline',
  suffixIcon,
  style,
}: ButtonProps) => {
  const animation = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!disabled) {
      Animated.spring(animation, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      Animated.spring(animation, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }
  };

  const getSizeStyle = (): {container: ViewStyle; text: TextStyle} => {
    switch (size) {
      case BUTTON_SIZE.SMALL:
        return {
          container: {paddingVertical: 12, paddingHorizontal: 32},
          text: {fontSize: getFontSize(12)},
        };
      case BUTTON_SIZE.MEDIUM:
      default:
        return {
          container: {paddingVertical: 16, paddingHorizontal: 32},
          text: {fontSize: getFontSize(14)},
        };
      case BUTTON_SIZE.LARGE:
        return {
          container: {paddingVertical: 20, paddingHorizontal: 32},
          text: {fontSize: getFontSize(16)},
        };
    }
  };
  const getButtonContainerStyle = (): ViewStyle => {
    return {
      transform: [{scale: animation}],
      backgroundColor: disabled ? COLORS.grey[200] : COLORS.accent,
      opacity: disabled ? 0.6 : 1,
    };
  };
  const {container, text: textStyle} = getSizeStyle();
  const iconSize = size;
  const buttonContainer = getButtonContainerStyle();
  return (
    <TouchableWithoutFeedback
      disabled={disabled || loading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}>
      <Animated.View style={[styles.button, container, buttonContainer, style]}>
        {loading ? (
          <ActivityIndicator color={COLORS.grey[100]} />
        ) : (
          <View style={styles.content}>
            {prefixIcon && (
              <Icon name={prefixIcon} style={styles.icon} size={iconSize} />
            )}
            <Text style={[styles.text, textStyle]}>{label}</Text>
            {suffixIcon && (
              <Icon name={suffixIcon} style={styles.icon} size={iconSize} />
            )}
          </View>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default Button;

// ---------------- Styles ----------------

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    color: COLORS.grey[100],
    fontFamily: FONTFAMILIES.LATO.medium,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    color: COLORS.grey[100],
  },
});
