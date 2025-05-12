import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ROUTES from '../constants/routes';

type RootStackParamList = {
  [ROUTES.TABS]: undefined;
  [ROUTES.HOME]: undefined;
  [ROUTES.LOGIN]: undefined;
  [ROUTES.SETTINGS]: undefined;
  [ROUTES.SYNC]: undefined;
};
// Type for each screen's navigation props
export type ScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
