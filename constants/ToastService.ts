import Toast from 'react-native-toast-message';

/**
 * ToastService - A utility for displaying consistent toast notifications across the app
 */
export default class ToastService {
  /**
   * Show a success toast notification
   * @param title The main title text
   * @param message The detailed message text
   * @param duration How long to display the toast (in ms)
   */
  static success(title: string, message: string, duration: number = 3000) {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      position: 'top',
      topOffset: 60,
      visibilityTime: duration,
    });
  }

  /**
   * Show an error toast notification
   * @param title The main title text
   * @param message The detailed message text
   * @param duration How long to display the toast (in ms)
   */
  static error(title: string, message: string, duration: number = 4000) {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      position: 'top',
      topOffset: 60,
      visibilityTime: duration,
    });
  }

  /**
   * Show an info toast notification
   * @param title The main title text
   * @param message The detailed message text
   * @param duration How long to display the toast (in ms)
   */
  static info(title: string, message: string, duration: number = 3000) {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      position: 'top',
      topOffset: 60,
      visibilityTime: duration,
    });
  }

  /**
   * Show a warning toast notification
   * @param title The main title text
   * @param message The detailed message text
   * @param duration How long to display the toast (in ms)
   */
  static warning(title: string, message: string, duration: number = 4000) {
    Toast.show({
      type: 'warning',
      text1: title,
      text2: message,
      position: 'top',
      topOffset: 60,
      visibilityTime: duration,
    });
  }
}
