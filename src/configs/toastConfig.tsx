import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {BaseToast, ErrorToast, ToastConfig} from 'react-native-toast-message';
import COLORS from '../constants/colors'; // Adjusted import path
import {FONTFAMILIES} from '../constants/fonts';

export type TrailingButtonProps = {
  label: string;
  onPress: () => void;
};
// Button Component for Undo Action
const ToastButton = ({label, onPress}: TrailingButtonProps) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

// Toast Config with Undo Button
const toastConfig: ToastConfig = {
  info: props => (
    <BaseToast
      {...props}
      style={[styles.baseToast, {borderLeftColor: COLORS.accent}]}
      text1Style={styles.textStyle}
      renderTrailingIcon={() =>
        props.props.trailingButton ? (
          <ToastButton
            label={props.props.trailingButton.label}
            onPress={props.props.trailingButton.onPress}
          />
        ) : null
      }
    />
  ),
  success: props => (
    <BaseToast
      {...props}
      style={[styles.baseToast, {borderLeftColor: COLORS.creditGreen}]}
      text1Style={styles.textStyle}
      renderTrailingIcon={() =>
        props.props.trailingButton ? (
          <ToastButton
            label={props.props.trailingButton.label}
            onPress={props.props.trailingButton.onPress}
          />
        ) : null
      }
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      style={[styles.baseToast, {borderLeftColor: COLORS.debitRed}]}
      text1Style={styles.textStyle}
      renderTrailingIcon={() =>
        props.props.trailingButton ? (
          <ToastButton
            label={props.props.trailingButton.label}
            onPress={props.props.trailingButton.onPress}
          />
        ) : null
      }
    />
  ),
};
export default toastConfig;
const styles = StyleSheet.create({
  baseToast: {
    backgroundColor: COLORS.grey[900],
  },
  textStyle: {
    fontFamily: FONTFAMILIES.LATO.regular,
    color: COLORS.grey[100],
    fontSize: 12,
  },
  button: {
    alignSelf: 'center',
    height: 16,
    paddingHorizontal: 8,
    marginHorizontal: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: COLORS.grey[100],
    fontSize: 12,
    fontFamily: FONTFAMILIES.LATO.bold,
  },
});
