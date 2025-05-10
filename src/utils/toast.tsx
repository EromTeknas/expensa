import Toast, {ToastType} from 'react-native-toast-message';
import {TrailingButtonProps} from '../configs/toastConfig';

const showToast = ({
  message,
  type,
  trailingButton,
}: {
  message: string;
  type: ToastType;
  trailingButton?: TrailingButtonProps;
}) => {
  Toast.show({
    type,
    text1: message,
    visibilityTime: 3000, // 3 seconds
    position: 'bottom',
    props: {
      trailingButton: trailingButton,
    },
  });
};

export default showToast;
