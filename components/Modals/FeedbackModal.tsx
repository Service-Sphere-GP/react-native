import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '@/constants/ApiService';
import { API_ENDPOINTS } from '@/constants/ApiConfig';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/src/i18n/LanguageContext';
import ToastService from '@/constants/ToastService';

interface BookingItem {
  _id: string;
  customer: {
    full_name: string;
    profile_image: string;
  };
  status: string;
  service: {
    _id: string;
    service_name: string;
    base_price: string;
    service_provider: {
      full_name: string;
      profile_image: string;
    };
  };
}

interface FeedbackModalProps {
  isVisible: boolean;
  onClose: () => void;
  booking: BookingItem;
}

const FeedbackModal = ({ isVisible, onClose, booking }: FeedbackModalProps) => {
  const { t } = useTranslation(['bookings', 'common']);
  const { isRTL } = useLanguage();

  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Reset state when modal opens with a new booking
  useEffect(() => {
    if (isVisible) {
      setFeedback('');
      setRating(0);
      setIsSubmitting(false);
    }
  }, [isVisible, booking]);

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
    ToastService.error(
      t('common:error'),
      t('bookings:ratingRequired'),
    );
      return;
    }

    setIsSubmitting(true);

    try {
      // First mark the booking as completed
      const changeStatusResponse = await ApiService.patch(
        API_ENDPOINTS.CHANGE_BOOKING_STATUS.replace(':id', booking._id),
        {
          status: 'completed',
        },
      );

      if (
        changeStatusResponse.status === 200 ||
        changeStatusResponse.status === 201
      ) {
        // Then submit the feedback
        const feedbackResponse = await ApiService.post(
          API_ENDPOINTS.SEND_FEEDBACK,
          {
            rating,
            message: feedback,
            service: booking.service._id,
            booking: booking._id,
          },
        );

        if (
          feedbackResponse.status === 200 ||
          feedbackResponse.status === 201
        ) {
          ToastService.success(
            t('bookings:feedbackSubmitted'),
            t('bookings:thanksForFeedback'),
          );

          // redirect to home 
          router.push('/home');
        } else {
          ToastService.error(
            t('common:error'),
            t('bookings:feedbackSubmitFailed'),
          );
        }
      } else {
        ToastService.error(t('common:error'), t('bookings:statusUpdateFailed'));
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      ToastService.error(t('common:error'), t('bookings:feedbackSubmitFailed'));
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={30}
            color={i <= rating ? '#FFD700' : '#C4C4C4'}
            style={{ marginHorizontal: 5 }}
          />
        </TouchableOpacity>,
      );
    }
    return stars;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-80 bg-white rounded-2xl p-6 shadow-lg">
          <Text className="text-xl text-center font-bold text-[#147E93] mb-4">
            {t('bookings:leaveFeedback')}
          </Text>

          <Text className="text-gray-700 text-base mb-2">
            {t('bookings:serviceProvider')}:{' '}
            {booking.service.service_provider.full_name}
          </Text>

          <Text className="text-gray-700 text-base mb-4">
            {t('bookings:service')}: {booking.service.service_name}
          </Text>

          <Text
            className={`text-base mb-3 text-gray-700 self-start ${isRTL ? 'self-end text-right' : 'self-start text-left'}`}
          >
            {t('bookings:rateService')}
          </Text>

          <View
            className={`flex-row justify-center mb-5 space-x-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {renderStars()}
          </View>

          <TextInput
            className={`w-full border border-gray-300 rounded-lg p-3 h-24 ${isRTL ? 'text-right' : 'text-left'}`}
            placeholder={t('bookings:tellExperience')}
            multiline
            textAlignVertical="top"
            value={feedback}
            onChangeText={setFeedback}
            style={{
              textAlign: isRTL ? 'right' : 'left',
              writingDirection: isRTL ? 'rtl' : 'ltr',
            }}
          />

          <View className="flex-row w-full mt-6 space-x-4 gap-4"
          >
            <TouchableOpacity
              className="px-4 py-2 rounded-lg bg-gray-200 flex-1 items-center"
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text className="text-gray-700 font-semibold">
                {t('bookings:cancel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-4 py-2 rounded-lg bg-[#147E93] flex-1 items-center disabled:opacity-50"
              onPress={handleSubmitFeedback}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Text className="text-white font-semibold">
                  {t('common:submitting')}
                </Text>
              ) : (
                <Text className="text-white font-semibold">
                  {t('bookings:submit')}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FeedbackModal;
