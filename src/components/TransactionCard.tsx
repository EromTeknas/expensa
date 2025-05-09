import React, {useState} from 'react';
import {
  View,
  Text,
  Animated,
  PanResponder,
  StyleSheet,
  Vibration,
  Pressable,
} from 'react-native';
import {ArchiveIcon, CurrencyRupeeIcon, PencilIcon} from './common/Icons';
import COLORS from '../constants/colors';
import {FONTFAMILIES} from '../constants/fonts';
import {EnrichedTransaction, TRANSACTION_TYPE} from '../models/transactions';
import {formatRupee} from '../utils/formatRupee';

interface TransactionCardProps {
  transaction: EnrichedTransaction;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onSelect: (id: number) => void;
}

const SWIPE_THRESHOLD_EDIT = 100;
const SWIPE_THRESHOLD_DELETE = 100;

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEdit,
  onDelete,
  onSelect,
}) => {
  const [translateX] = useState(new Animated.Value(0));
  const [scale] = useState(new Animated.Value(1));
  const [bgColor] = useState(new Animated.Value(0));

  const handleLongPress = () => {
    Vibration.vibrate(50);
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {toValue: 1, useNativeDriver: true}),
    ]).start();
    onSelect(transaction.id);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 10;
      // return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5; // Adjust threshold as needed
    },
    // onPanResponderGrant: (evt, gestureState) => {
    //   // if (Math.abs(gestureState.dx) === 0) {
    //   //   // Trigger long press if the initial move is small (to prevent conflict)
    //   //   handleLongPress();
    //   // }
    //   // Start long press timer
    //   // const timer = setTimeout(() => {/
    //   handleLongPress();
    //   // }, 500); // Adjust duration as needed

    //   // return timer;
    // },
    onPanResponderMove: (evt, gestureState) => {
      translateX.setValue(gestureState.dx);
      const colorValue = gestureState.dx > 0 ? 1 : -1;
      bgColor.setValue(
        colorValue * Math.min(Math.abs(gestureState.dx) / 150, 1),
      );
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > SWIPE_THRESHOLD_EDIT) {
        Vibration.vibrate(50);
        onEdit(transaction.id);
      } else if (gestureState.dx < -SWIPE_THRESHOLD_DELETE) {
        Vibration.vibrate(50);
        onDelete(transaction.id);
      }
      Animated.spring(translateX, {toValue: 0, useNativeDriver: true}).start();
      Animated.timing(bgColor, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    },
  });

  const backgroundColor = bgColor.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [COLORS.debitRed, COLORS.grey[800], COLORS.creditGreen],
  });

  return (
    <Pressable onPress={handleLongPress}>
      <View style={styles.container}>
        <Animated.View style={[styles.backgroundLayer, {backgroundColor}]}>
          <View style={styles.editIcon}>
            <PencilIcon width={24} height={24} color={COLORS.grey[100]} />
          </View>
          <View style={styles.deleteIcon}>
            <ArchiveIcon width={24} height={24} color={COLORS.grey[100]} />
          </View>
        </Animated.View>
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.card, {transform: [{translateX}, {scale}]}]}>
          <ArchiveIcon height={28} width={28} color={COLORS.grey[100]} />
          <View style={styles.cardContent}>
            <Text style={styles.cardDescription}>Shopping for Jeans</Text>
            <Text style={styles.cardMetaDetails}>Cash | 10:30 PM</Text>
          </View>
          <View style={styles.cardAmountContainer}>
            <Text
              style={[
                styles.cardAmount,
                {
                  color:
                    transaction.type === TRANSACTION_TYPE.CREDIT
                      ? COLORS.creditGreen
                      : COLORS.debitRed,
                },
              ]}>
              {formatRupee(100, 2)}
            </Text>
            <CurrencyRupeeIcon
              width={20}
              height={20}
              color={
                transaction.type === TRANSACTION_TYPE.CREDIT
                  ? COLORS.creditGreen
                  : COLORS.debitRed
              }
            />
          </View>
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.grey[800],
  },
  editIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  deleteIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: COLORS.grey[800],
    padding: 12,
    borderRadius: 8,
    gap: 16,
    alignItems: 'center',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  cardDescription: {
    fontFamily: FONTFAMILIES.LATO.medium,
    fontSize: 14,
    color: COLORS.grey[100],
  },
  cardMetaDetails: {
    fontFamily: FONTFAMILIES.LATO.light,
    fontSize: 12,
    color: COLORS.grey[100],
  },
  cardAmountContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  cardAmount: {
    fontFamily: FONTFAMILIES.LATO.medium,
    fontSize: 20,
  },
  title: {
    fontFamily: FONTFAMILIES.LATO.bold,
    fontSize: 18,
    color: COLORS.grey[100],
  },
  amount: {
    fontFamily: FONTFAMILIES.LATO.regular,
    fontSize: 16,
    color: COLORS.grey[100],
  },
});

export default TransactionCard;
