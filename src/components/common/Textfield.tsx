import React, {useState} from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Sizing} from '../../constants/sizing';
import COLORS from '../../constants/colors';
import {FONTFAMILIES} from '../../constants/fonts';
import getFontSize from '../../utils/fontSize';

// TODO
// Add support for textarea (multiline textinput)
// When textfield is inactive but user has entered some value into it, the color of text and icons should be white
export enum TEXTFIELD_SIZE {
  LARGE,
  MEDIUM,
  SMALL,
}

export enum TEXTFIELD_TYPE {
  ACTIVE,
  INACTIVE,
  DISABLED,
}

type TextfieldProps = {
  value: string;
  size: TEXTFIELD_SIZE;
  placeholder: string;
  label?: string | null;
  prefixIcon?: string | null;
  suffixIcon?: string | null;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
};

const Textfield = ({
  size,
  label,
  placeholder,
  value,
  prefixIcon,
  suffixIcon,
  onChangeText,
  keyboardType,
}: TextfieldProps) => {
  const [type, setType] = useState(TEXTFIELD_TYPE.INACTIVE);
  return (
    <View style={styles.outerContainer}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={getTextfieldContainerStyle(size, type)}>
        {prefixIcon && (
          <Icon
            style={getIconStyle(size)}
            color={getIconColor(type)}
            size={getIconSize(size)}
            name={prefixIcon}
          />
        )}
        <TextInput
          style={[getInputStyles(size, type)]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.grey[200]}
          value={value}
          editable={type !== TEXTFIELD_TYPE.DISABLED}
          onChangeText={onChangeText}
          onFocus={() => setType(TEXTFIELD_TYPE.ACTIVE)}
          onBlur={() => setType(TEXTFIELD_TYPE.INACTIVE)}
          keyboardType={keyboardType}
          multiline
          numberOfLines={4}
        />
        {suffixIcon && (
          <Icon
            style={getIconStyle(size)}
            color={getIconColor(type)}
            size={getIconSize(size)}
            name={suffixIcon}
          />
        )}
      </View>
    </View>
  );
};

export default Textfield;
const getIconStyle = (size: TEXTFIELD_SIZE): ViewStyle => {
  const marginTop =
    size === TEXTFIELD_SIZE.SMALL
      ? 12
      : size === TEXTFIELD_SIZE.MEDIUM
      ? 16
      : 20;
  return {
    marginTop: marginTop,
  };
};
const getIconColor = (type: TEXTFIELD_TYPE) => {
  return type === TEXTFIELD_TYPE.ACTIVE ? COLORS.grey[100] : COLORS.grey[200];
};
const getIconSize = (size: TEXTFIELD_SIZE) => {
  return size === TEXTFIELD_SIZE.SMALL
    ? 12
    : size === TEXTFIELD_SIZE.MEDIUM
    ? 16
    : 20;
};
const getTextfieldContainerStyle = (
  size: TEXTFIELD_SIZE,
  type: TEXTFIELD_TYPE,
): ViewStyle => {
  const paddingVertical =
    size === TEXTFIELD_SIZE.LARGE
      ? Sizing[20]
      : size === TEXTFIELD_SIZE.MEDIUM
      ? Sizing[16]
      : Sizing[12];

  const borderColor =
    type === TEXTFIELD_TYPE.ACTIVE ? COLORS.accent : COLORS.grey[200];

  return {
    display: 'flex',
    flexDirection: 'row',
    rowGap: 8,
    paddingHorizontal: 16,
    paddingVertical: paddingVertical,
    justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 12,
    borderColor: borderColor,
    borderWidth: 2,
  };
};

const getInputStyles = (
  size: TEXTFIELD_SIZE,
  type: TEXTFIELD_TYPE,
): TextStyle => {
  const fontSize =
    size === TEXTFIELD_SIZE.SMALL || size === TEXTFIELD_SIZE.MEDIUM
      ? getFontSize(16)
      : getFontSize(18);

  const fontColor =
    type === TEXTFIELD_TYPE.ACTIVE ? COLORS.grey[100] : COLORS.grey[200];
  return {
    fontFamily: FONTFAMILIES.LATO.regular,
    fontSize: fontSize,
    color: fontColor,
    flex: 1,
  };
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
    display: 'flex',
    columnGap: 4,
  },
  label: {
    marginLeft: 4,
    fontFamily: FONTFAMILIES.LATO.light,
    fontSize: getFontSize(12),
    color: COLORS.grey[200],
  },
  textfieldContainer: {
    width: '100%',
  },
  input: {
    fontFamily: FONTFAMILIES.LATO.regular,
    fontSize: getFontSize(16),
    color: '#000000',
    flex: 1,
  },
});
