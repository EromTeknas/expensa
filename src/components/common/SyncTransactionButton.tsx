/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef} from 'react';
import {TouchableOpacity, Animated, StyleSheet, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ArrowRepeatIcon} from './Icons';
import COLORS from '../../constants/colors';
export enum SyncStatusType {
  SYNCING = 'SYNCING',
  TRANSACTIONS_AVAILABLE = 'TRANSACTIONS_AVAILABLE',
  NOTHING_TO_SYNC = 'NOTHING_TO_SYNC',
}
interface SyncStatusButtonProps {
  loading: boolean;
  type: SyncStatusType;
  onClick: () => void;
}

const statusDotColor: Record<SyncStatusType, string> = {
  [SyncStatusType.SYNCING]: 'red',
  [SyncStatusType.TRANSACTIONS_AVAILABLE]: 'green',
  [SyncStatusType.NOTHING_TO_SYNC]: 'yellow',
};

export const SyncStatusButton: React.FC<SyncStatusButtonProps> = ({
  loading,
  type,
  onClick,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      rotateAnim.stopAnimation();
      rotateAnim.setValue(0);
    }
  }, [loading]);

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      blinkAnim.stopAnimation();
      blinkAnim.setValue(1);
    }
  }, [loading]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity onPress={onClick}>
      <LinearGradient
        colors={['#1D1D1D', '#262626']}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
        style={styles.iconButton}>
        <Animated.View style={{transform: [{rotate}]}}>
          <ArrowRepeatIcon height={16} width={16} color={COLORS.grey[100]} />
        </Animated.View>

        <Animated.View
          style={[
            styles.statusDot,
            getStatusDotStyle(type, blinkAnim, loading),
          ]}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};
const getStatusDotStyle = (
  type: SyncStatusType,
  blinkAnim: Animated.Value,
  loading: boolean,
): ViewStyle => ({
  ...styles.statusDot,
  backgroundColor: statusDotColor[type],
  opacity: loading ? blinkAnim : 1,
});

const styles = StyleSheet.create({
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  statusDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
