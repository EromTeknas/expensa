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
import {formatRupee} from '../utils/formatRupee';
import {CurrencyRupeeIcon} from './common/Icons';

type Transaction = {
  label: string;
  amount: number | string;
};

type TotalTransactionsStatusProps = {
  transactions: Transaction[];
};

const TotalTransactionsStatus = ({
  transactions,
}: TotalTransactionsStatusProps) => {
  return (
    <LinearGradientComponent
      colors={['#1D1D1D', '#262626']}
      start={{x: 0, y: 0.5}}
      end={{x: 1, y: 0.5}}
      style={styles.container}>
      {transactions.map((transaction, index) => (
        <React.Fragment key={index}>
          <OptionColumn label={transaction.label} amount={transaction.amount} />
          {index < transactions.length - 1 && <View style={styles.divider} />}
        </React.Fragment>
      ))}
      <BackgroundEllipse />
      <GradientCircle />
    </LinearGradientComponent>
  );
};

type OptionColumnProps = {
  label: string;
  amount: number | string;
};

const OptionColumn = ({label, amount}: OptionColumnProps) => {
  return (
    <View style={styles.optionColumn}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionColumnRow}>
        <CurrencyRupeeIcon width={24} height={28} color={COLORS.grey[100]} />
        <Text style={styles.amount}>{formatRupee(amount)}</Text>
      </View>
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
    flex: 1,
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
  optionColumnRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    width: 139,
    height: 106,
    left: -12,
    bottom: -26,
    zIndex: 1,
  },
  svgSmall: {
    position: 'absolute',
    width: 92,
    height: 92,
    left: 87,
    bottom: -53,
    zIndex: 2,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.grey[100],
    marginVertical: 6,
  },
});
