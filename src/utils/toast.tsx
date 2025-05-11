import Toast, {ToastType} from 'react-native-toast-message';
import {TrailingButtonProps} from '../configs/toastConfig';

const showToast = ({
  message,
  type,
  trailingButton,
  afterToastCallback, // Added as a prop
}: {
  message: string;
  type: ToastType;
  trailingButton?: TrailingButtonProps;
  afterToastCallback?: () => void; // Optional callback
}) => {
  const TOAST_TIMEOUT = 3000;
  Toast.show({
    type,
    text1: message,
    visibilityTime: TOAST_TIMEOUT, // 3 seconds
    position: 'bottom',
    props: {
      trailingButton: trailingButton,
    },
  });

  if (afterToastCallback) {
    setTimeout(() => {
      console.log('Toast has disappeared');
      afterToastCallback(); // Call only if defined
    }, TOAST_TIMEOUT + 1000); // Match the visibilityTime
  }
};

export default showToast;
