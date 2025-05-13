import {StyleSheet, TouchableOpacity} from 'react-native';
import {ScreenProps} from '../../@types/navigation';
import COLORS from '../../constants/colors';
import ROUTES from '../../constants/routes';
import React from 'react';
import {View} from 'react-native';
import Header from '../../components/common/Header';
import {InfoCircleIcon} from '../../components/common/Icons';

const SyncTransactionsScreen: React.FC<
  ScreenProps<typeof ROUTES.SYNC_TRANSACTIONS>
> = ({navigation}) => {
  return (
    <View style={styles.screen}>
      <Header
        title={'Sync Transactions'}
        navigation={navigation}
        suffix={
          <TouchableOpacity>
            <InfoCircleIcon width={20} height={20} color={COLORS.grey[100]} />
          </TouchableOpacity>
        }
      />
    </View>
  );
};

export default SyncTransactionsScreen;

const styles = StyleSheet.create({
  screen: {
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: COLORS.backgroundColor,
  },
});
