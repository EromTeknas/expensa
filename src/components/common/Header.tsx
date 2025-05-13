import React, {ReactNode} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {ArrowLeftIcon} from './Icons';
import {FONTFAMILIES} from '../../constants/fonts';
import COLORS from '../../constants/colors';

type HeaderProps = {
  title: string;
  navigation: {
    goBack: () => void;
  };
  suffix?: ReactNode;
};

const Header: React.FC<HeaderProps> = ({title, navigation, suffix: Suffix}) => {
  return (
    <View style={styles.headerContainer}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <ArrowLeftIcon width={28} height={28} color={COLORS.grey[100]} />
      </TouchableOpacity>

      {/* Header Title */}
      <Text style={styles.headerTitle}>{title}</Text>

      {Suffix}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.grey[800],
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingRight: 16,
  },
  headerTitle: {
    fontFamily: FONTFAMILIES.LATO.medium,
    fontSize: 24,
    color: COLORS.grey[100],
    textAlign: 'left',
    flex: 1,
  },
});

export default Header;
