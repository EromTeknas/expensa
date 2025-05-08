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
import COLORS from '../../constants/colors';
import {FONTFAMILIES} from '../../constants/fonts';
import getFontSize from '../../utils/fontSize';
import {SvgProps} from 'react-native-svg';

// TODO
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
  prefixIcon?: React.FC<SvgProps> | null;
  suffixIcon?: React.FC<SvgProps> | null;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  numberOfLines?: number;
};

const Textfield = ({
  size,
  label,
  placeholder,
  value,
  prefixIcon: PrefixIcon,
  suffixIcon: SuffixIcon,
  onChangeText,
  keyboardType,
  multiline,
  numberOfLines,
}: TextfieldProps) => {
  const [type, setType] = useState(TEXTFIELD_TYPE.INACTIVE);

  return (
    <View style={styles.outerContainer}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={getTextfieldContainerStyle(size, type)}>
        {PrefixIcon && (
          <PrefixIcon
            style={getIconStyle(size)}
            color={getIconColor(type)}
            height={getIconSize(size)}
            width={getIconSize(size)}
          />
        )}
        <TextInput
          style={getInputStyles(size, type, numberOfLines ?? 0)}
          placeholder={placeholder}
          placeholderTextColor={COLORS.grey[200]}
          value={value}
          editable={type !== TEXTFIELD_TYPE.DISABLED}
          onChangeText={onChangeText}
          onFocus={() => setType(TEXTFIELD_TYPE.ACTIVE)}
          onBlur={() => setType(TEXTFIELD_TYPE.INACTIVE)}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          verticalAlign="top"
          textAlignVertical="top"
        />
        {SuffixIcon && (
          <SuffixIcon
            style={getIconStyle(size)}
            color={getIconColor(type)}
            height={getIconSize(size)}
            width={getIconSize(size)}
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
      ? 10
      : 10;
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
    size === TEXTFIELD_SIZE.LARGE ? 6 : size === TEXTFIELD_SIZE.MEDIUM ? 4 : 2;

  const borderColor =
    type === TEXTFIELD_TYPE.ACTIVE ? COLORS.accent : COLORS.grey[200];

  return {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: paddingVertical,
    justifyContent: 'center',
    borderRadius: 12,
    borderColor: borderColor,
    borderWidth: 1,
  };
};

const getInputStyles = (
  size: TEXTFIELD_SIZE,
  type: TEXTFIELD_TYPE,
  numberOfLines: number,
): TextStyle => {
  const fontSize =
    size === TEXTFIELD_SIZE.SMALL
      ? getFontSize(14)
      : size === TEXTFIELD_SIZE.MEDIUM
      ? getFontSize(16)
      : getFontSize(18);
  const TEXTAREA_HEIGHT = numberOfLines * fontSize;

  const fontColor =
    type === TEXTFIELD_TYPE.ACTIVE ? COLORS.grey[100] : COLORS.grey[200];
  return {
    fontFamily: FONTFAMILIES.LATO.medium,
    fontSize: fontSize,
    color: fontColor,
    flex: 1,
    borderWidth: 0,
    height: TEXTAREA_HEIGHT === 0 ? 'auto' : TEXTAREA_HEIGHT,
  };
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
    display: 'flex',
    gap: 4,
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
