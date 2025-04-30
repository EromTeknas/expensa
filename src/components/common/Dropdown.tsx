import React, {useState} from 'react';
import {View, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import COLORS from '../../constants/colors';
import {FONTFAMILIES} from '../../constants/fonts';
import getFontSize from '../../utils/fontSize';

export enum DROPDOWN_SIZE {
  SMALL,
  MEDIUM,
}
export enum DROPDOWN_TYPE {
  ACTIVE,
  INACTIVE,
  DISABLED,
}
type DropdownProps = {
  value: string;
  size: DROPDOWN_SIZE;
  label?: string | null;
  prefixIcon?: string | null;
  onSelect: (option: string) => void;
  children: React.ReactNode; // accept Picker.Item children
};

const Dropdown = ({value, size, label, onSelect, children}: DropdownProps) => {
  const [type, setType] = useState<DROPDOWN_TYPE>(DROPDOWN_TYPE.INACTIVE);

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={getDropdownContainerStyle(size, type)}>
        <Picker
          style={getPickerStyle(size, type)}
          selectedValue={value}
          onValueChange={onSelect}
          onBlur={() => setType(DROPDOWN_TYPE.INACTIVE)}
          onFocus={() => setType(DROPDOWN_TYPE.ACTIVE)}
          dropdownIconColor={COLORS.grey[100]}>
          {children}
        </Picker>
      </View>
    </View>
  );
};

export default Dropdown;

// ---------------------- Helpers & Styles ----------------------

const getDropdownContainerStyle = (
  size: DROPDOWN_SIZE,
  type: DROPDOWN_TYPE,
): ViewStyle => {
  const PICKER_HEIGHT = size === DROPDOWN_SIZE.MEDIUM ? 56 : 40;
  return {
    boxSizing: 'content-box',
    borderWidth: 1,
    paddingVertical: 0,
    paddingHorizontal: 8,
    borderColor:
      type === DROPDOWN_TYPE.ACTIVE ? COLORS.accent : COLORS.grey[200],
    borderRadius: 12,
    height: PICKER_HEIGHT,
    justifyContent: 'center',
  };
};

const getPickerStyle = (
  size: DROPDOWN_SIZE,
  type: DROPDOWN_TYPE,
): TextStyle => ({
  color: type === DROPDOWN_TYPE.ACTIVE ? COLORS.grey[100] : COLORS.grey[200],
  fontFamily: FONTFAMILIES.LATO.regular,
  fontSize: size === DROPDOWN_SIZE.MEDIUM ? getFontSize(16) : getFontSize(14),
});

const styles = StyleSheet.create({
  outerContainer: {
    display: 'flex',
    gap: 4,
    flex: 1,
  },
  label: {
    marginLeft: 4,
    fontFamily: FONTFAMILIES.LATO.light,
    fontSize: getFontSize(12),
    color: COLORS.grey[200],
  },
});
