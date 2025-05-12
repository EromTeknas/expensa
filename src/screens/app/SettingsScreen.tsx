import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // You can use other icon sets
import {logoutThunk} from '../../features/auth/authThunk';
import {useAppDispatch} from '../../app/hooks';
import {ScreenProps} from '../../@types/navigation';
import ROUTES from '../../constants/routes';

const menuItems = [
  {
    id: '1',
    title: 'Add Accounts',
    icon: 'wallet-outline',
    screen: 'ProfileScreen',
  },
  {
    id: '2',
    title: 'Categories',
    icon: 'pricetags-outline',
    screen: 'CategoryScreen',
  },
];

const SettingsScreen: React.FC<ScreenProps<typeof ROUTES.SETTINGS>> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();

  const handleNavigate = (screen: string) => {
    navigation.navigate(screen as never); // adjust typing if needed
  };

  const handleLogout = async () => {
    dispatch(logoutThunk());
  };

  return (
    <View style={styles.container}>
      {menuItems.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.menuItem}
          onPress={() => handleNavigate(item.screen)}>
          <Icon name={item.icon} size={24} color="#333" style={styles.icon} />
          <Text style={styles.text}>{item.title}</Text>
        </TouchableOpacity>
      ))}

      {/* Logout button */}
      <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
        <Icon
          name="log-out-outline"
          size={24}
          color="#d00"
          style={styles.icon}
        />
        <Text style={[styles.text, {color: '#d00'}]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  icon: {
    marginRight: 15,
  },
  text: {
    fontSize: 16,
  },
});

export default SettingsScreen;
