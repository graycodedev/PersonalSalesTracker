import Toast from 'react-native-root-toast';
const ToastMessage = {
  Short: (message) => {
    Toast.show(message, { duration: Toast.durations.SHORT});
  },
  Long: (message) => {
    Toast.show(message, { duration: Toast.durations.LONG});
  },
  LongCenter: (message) => {
    Toast.show(message, { duration: Toast.durations.LONG});
  },
};

export default ToastMessage;
