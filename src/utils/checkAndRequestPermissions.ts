import {PermissionsAndroid, Platform} from 'react-native';

/**
 * Checks and requests the READ_SMS permission on Android.
 * @returns Promise<boolean> - true if permission is granted, false otherwise
 */
export const checkAndRequestReadSMSPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return false; // READ_SMS is Android-only
  }

  try {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
    );

    if (granted) {
      return true;
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      {
        title: 'SMS Permission Required',
        message: 'This app needs access to your SMS to function properly.',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      },
    );

    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Failed to check/request SMS permission:', err);
    return false;
  }
};
