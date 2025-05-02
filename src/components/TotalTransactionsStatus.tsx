import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Svg, {
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
  Circle,
} from 'react-native-svg';
import LinearGradientComponent from 'react-native-linear-gradient';
import {FONTFAMILIES} from '../constants/fonts';
import COLORS from '../constants/colors';
type TotalTransactionsStatusProps = {
  totalDebitAmount: string;
  totalCreditAmount: string;
};

const TotalTransactionsStatus = ({
  totalDebitAmount,
  totalCreditAmount,
}: TotalTransactionsStatusProps) => {
  return (
    <LinearGradientComponent
      colors={['#1D1D1D', '#262626']}
      start={{x: 0, y: 0.5}}
      end={{x: 1, y: 0.5}}
      style={styles.container}>
      <OptionColumn label="This Month" amount={totalDebitAmount} />
      <View style={styles.divider} />
      <OptionColumn label="Today" amount={totalCreditAmount} />
      <BackgroundEllipse />
      <GradientCircle />
    </LinearGradientComponent>
  );
};

type OptionColumnProps = {
  label: string;
  amount: string;
};

const OptionColumn = ({label, amount}: OptionColumnProps) => {
  return (
    <View style={styles.optionColumn}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.amount}>{amount}</Text>
    </View>
  );
};

const BackgroundEllipse = () => {
  return (
    <Svg width={139} height={106} viewBox="0 0 139 106" style={styles.svgLarge}>
      <Defs>
        <LinearGradient
          id="grad"
          x1="-12"
          y1="0"
          x2="133.763"
          y2="10.3007"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#DC2BAA" stopOpacity={0.5} />
          <Stop offset="1" stopColor="#6F4DE5" stopOpacity={0.5} />
        </LinearGradient>
      </Defs>
      <Ellipse cx="69.5" cy="53" rx="69.5" ry="53" fill="url(#grad)" />
    </Svg>
  );
};

const GradientCircle = () => {
  return (
    <Svg width={92} height={92} viewBox="0 0 92 92" style={styles.svgSmall}>
      <Defs>
        <LinearGradient
          id="circleGradient"
          x1="0"
          y1="0"
          x2="96.6771"
          y2="5.20996"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#DC2BAA" stopOpacity={0.5} />
          <Stop offset="1" stopColor="#6F4DE5" stopOpacity={0.5} />
        </LinearGradient>
      </Defs>
      <Circle cx="46" cy="46" r="46" fill="url(#circleGradient)" />
    </Svg>
  );
};
export default TotalTransactionsStatus;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingVertical: 24,
    gap: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#2B2B2B',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.1,
        shadowRadius: 40,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  optionColumn: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    display: 'flex',
    gap: 0,
    zIndex: 3,
    flex: 1,
  },
  label: {
    fontFamily: FONTFAMILIES.LATO.light,
    fontSize: 12,
    color: COLORS.grey[100],
    lineHeight: 14,
  },
  amount: {
    fontFamily: FONTFAMILIES.LATO.bold,
    fontSize: 28,
    letterSpacing: 0.4,
    color: COLORS.grey[100],
    lineHeight: 34,
  },
  svgLarge: {
    position: 'absolute',
    width: 139, // 8.6875rem * 16 = 139px
    height: 106, // 6.625rem * 16 = 106px
    left: -12, // -0.75rem * 16 = -12px
    bottom: -26, // -1.625rem * 16 = -26px
    zIndex: 1, // place it behind content
  },
  svgSmall: {
    position: 'absolute',
    width: 92, // 5.75rem * 16
    height: 92,
    left: 87, // 5.4375rem * 16
    bottom: -53, // -3.3125rem * 16
    zIndex: 2,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.grey[100], // or any color you prefer
    marginVertical: 6,
  },
});
