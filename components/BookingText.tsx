import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';

const BookingText = () => {
  const { t } = useTranslation(['bookings']);
  const { isRTL } = useLanguage();

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text
        className={`text-2xl font-bold mb-2 ${isRTL ? 'text-right' : 'text-left'}`}
      >
        {t('bookings:noBookings')}
      </Text>
      <Text
        className={`text-base text-[#666] ${isRTL ? 'text-right' : 'text-left'}`}
      >
        {t('bookings:manageAppointments')}
      </Text>
    </View>
  );
};

export default BookingText;
