import React, {useState} from 'react';
import {View, Text, Animated, Vibration, StyleSheet} from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
  Gesture,
} from 'react-native-gesture-handler';
import {ArchiveIcon, CurrencyRupeeIcon, PencilIcon} from './common/Icons';
import COLORS from '../constants/colors';
import {FONTFAMILIES} from '../constants/fonts';
import {EnrichedTransaction, TRANSACTION_TYPE} from '../models/transactions';
import {formatRupee} from '../utils/formatRupee';
import dayjs from 'dayjs';

const formatTo12HourTime = (timestamp: string): string => {
  return dayjs(timestamp).format('hh:mm A');
};
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
  const translateX = useState(new Animated.Value(0))[0];
  const scale = useState(new Animated.Value(1))[0];
  const bgColor = useState(new Animated.Value(0))[0];
  const iconOpacity = useState(new Animated.Value(1))[0];

  const handleScaleAnimation = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      stiffness: 300,
      damping: 20,
    }).start();
  };

  const handleIconOpacity = (toValue: number) => {
    Animated.timing(iconOpacity, {
      toValue,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleLongPress = () => {
    Vibration.vibrate(50);
    onSelect(transaction.id);
  };
  const swipeGesture = Gesture.Pan()
    .onUpdate(e => {
      translateX.setValue(e.translationX);
      const colorValue = e.translationX > 0 ? 1 : -1;
      bgColor.setValue(
        colorValue * Math.min(Math.abs(e.translationX) / 150, 1),
      );
    })
    .onEnd(e => {
      if (e.translationX > SWIPE_THRESHOLD_EDIT) {
        Vibration.vibrate(50);
        onEdit(transaction.id);
      } else if (e.translationX < -SWIPE_THRESHOLD_DELETE) {
        Vibration.vibrate(50);
        onDelete(transaction.id);
      }
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        stiffness: 300,
        damping: 30,
      }).start();
      Animated.timing(bgColor, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    })
    .shouldCancelWhenOutside(true) // Allow scrolling when gesture goes out
    .simultaneousWithExternalGesture(Gesture.Native()) // Enable simultaneous gestures
    .onTouchesUp(() => {
      // Reset gesture when touch ends
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    })
    .onFinalize(() => {
      // Reset background color after gesture completes
      Animated.timing(bgColor, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  // const swipeGesture = Gesture.Pan()
  //   .onUpdate(e => {
  //     translateX.setValue(e.translationX);
  //     const colorValue = e.translationX > 0 ? 1 : -1;
  //     bgColor.setValue(
  //       colorValue * Math.min(Math.abs(e.translationX) / 150, 1),
  //     );
  //   })
  //   .onEnd(e => {
  //     if (e.translationX > SWIPE_THRESHOLD_EDIT) {
  //       Vibration.vibrate(50);
  //       onEdit(transaction.id);
  //     } else if (e.translationX < -SWIPE_THRESHOLD_DELETE) {
  //       Vibration.vibrate(50);
  //       onDelete(transaction.id);
  //     }
  //     Animated.spring(translateX, {
  //       toValue: 0,
  //       useNativeDriver: true,
  //       stiffness: 300,
  //       damping: 30,
  //     }).start();
  //     Animated.timing(bgColor, {
  //       toValue: 0,
  //       duration: 200,
  //       useNativeDriver: false,
  //     }).start();
  //   });

  const longPressGesture = Gesture.LongPress()
    .onStart(() => {
      handleScaleAnimation(0.9); // Start scaling
      handleIconOpacity(0); // Hide icons
    })
    .onEnd(() => {
      handleScaleAnimation(1); // Reset scale
      handleIconOpacity(1); // Show icons
      handleLongPress();
    });

  const backgroundColor = bgColor.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [COLORS.debitRed, COLORS.grey[800], COLORS.creditGreen],
  });
  const displayText = () => {
    // Check if description is null, undefined, or only whitespace
    if (
      !transaction.description ||
      transaction.description.trim().length === 0
    ) {
      return transaction.category.name;
    }
    return transaction.description;
  };

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={longPressGesture}>
        <View style={styles.container}>
          <Animated.View style={[styles.backgroundLayer, {backgroundColor}]}>
            <Animated.View style={[styles.editIcon, {opacity: iconOpacity}]}>
              <PencilIcon width={24} height={24} color={COLORS.grey[100]} />
            </Animated.View>
            <Animated.View style={[styles.deleteIcon, {opacity: iconOpacity}]}>
              <ArchiveIcon width={24} height={24} color={COLORS.grey[100]} />
            </Animated.View>
          </Animated.View>

          <GestureDetector gesture={swipeGesture}>
            <Animated.View
              style={[styles.card, {transform: [{translateX}, {scale}]}]}>
              <ArchiveIcon height={28} width={28} color={COLORS.grey[100]} />
              <View style={styles.cardContent}>
                <Text style={styles.cardDescription}>{displayText()}</Text>
                <Text style={styles.cardMetaDetails}>
                  {transaction.account.name} |{' '}
                  {formatTo12HourTime(transaction.transaction_time)}
                </Text>
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
                  {formatRupee(transaction.amount, 2)}
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
          </GestureDetector>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginVertical: 8,
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
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  cardAmount: {
    fontFamily: FONTFAMILIES.LATO.medium,
    fontSize: 20,
  },
});

export default TransactionCard;
