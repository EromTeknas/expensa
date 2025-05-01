import React, {useState} from 'react';
import {View, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import COLORS from '../../constants/colors';
import {FONTFAMILIES} from '../../constants/fonts';
import getFontSize from '../../utils/fontSize';

// Todo: Add multiple selection support
// Todo: Find a solution to set the height of the dropdown

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
  items: any[];
  schema?: {
    label: string;
    value: string;
  };
  value: string | null;
  size: DROPDOWN_SIZE;
  label?: string | null;
  onSelect: (option: string) => void;
};

const Dropdown = ({
  items,
  schema,
  value,
  size,
  label,
  onSelect,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<DROPDOWN_TYPE>(DROPDOWN_TYPE.INACTIVE);

  return (
    <View style={styles.outerContainer}>
      {label && <Text style={styles.label}>{label}</Text>}
      <DropDownPicker
        // multiple={true}
        theme="DARK"
        schema={schema}
        open={open}
        value={value}
        items={items}
        onOpen={() => setType(DROPDOWN_TYPE.ACTIVE)}
        onClose={() => setType(DROPDOWN_TYPE.INACTIVE)}
        setOpen={setOpen}
        setValue={callback => {
          const val = callback(value);
          onSelect(val);
        }}
        style={getPickerContainerStyle(size, type)}
        textStyle={getPickerTextStyle(size, type)}
        dropDownContainerStyle={{
          backgroundColor: COLORS.grey[800],
          borderColor: COLORS.accent,
        }}
      />
    </View>
  );
};

export default Dropdown;

// ---------------------- Helpers & Styles ----------------------

const getPickerTextStyle = (
  size: DROPDOWN_SIZE,
  type: DROPDOWN_TYPE,
): TextStyle => ({
  color: type === DROPDOWN_TYPE.ACTIVE ? COLORS.grey[100] : COLORS.grey[200],
  fontFamily: FONTFAMILIES.LATO.regular,
  fontSize: size === DROPDOWN_SIZE.MEDIUM ? getFontSize(16) : getFontSize(14),
});

const getPickerContainerStyle = (
  size: DROPDOWN_SIZE,
  type: DROPDOWN_TYPE,
): ViewStyle => {
  // const PICKER_HEIGHT = size === DROPDOWN_SIZE.MEDIUM ? 56 : 40;
  return {
    backgroundColor: 'transparent',
    borderWidth: 1,
    // paddingVertical: 0,
    paddingHorizontal: 8,
    borderColor:
      type === DROPDOWN_TYPE.ACTIVE ? COLORS.accent : COLORS.grey[200],
    borderRadius: 12,
    // height: PICKER_HEIGHT,
    justifyContent: 'center',
  };
};

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
