import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import NotificationIcon from '@/assets/icons/Notification';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getTextStyle } from '@/src/utils/fontUtils';
import { useNotifications } from '@/constants/NotificationContext';

interface HeaderProps {
  title?: string | undefined;
  showBackButton?: boolean | undefined;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = true }) => {
  const router = useRouter();
  const { isRTL } = useLanguage();
  const textStyle = getTextStyle(isRTL);
  const { unreadCount } = useNotifications();

  return (
    <View style={[styles.container, isRTL && styles.containerRTL]}>
      {showBackButton && (
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Image
            source={
              isRTL
                ? require('@/assets/images/rightArrow.png')
                : require('@/assets/images/leftArrow.png')
            }
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}

      <Text style={[
        styles.title,
        isRTL ? styles.titleRTL : styles.titleLTR,
        showBackButton && (isRTL ? styles.titleWithBackRTL : styles.titleWithBackLTR)
      ]}>
        {title}
      </Text>

      <View style={styles.notificationContainer}>
        <TouchableOpacity onPress={() => router.push('/profile/notification')}>
          <View style={styles.notificationWrapper}>
            <NotificationIcon color="#030B19" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 24,
    height: 60, // Fixed height to prevent expansion
  },
  containerRTL: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    color: '#030B19',
  },
  titleLTR: {
    textAlign: 'left',
  },
  titleRTL: {
    textAlign: 'right',
  },
  titleWithBackLTR: {
    marginLeft: 16,
  },
  titleWithBackRTL: {
    marginRight: 16,
  },
  notificationContainer: {
    width: 24,
    height: 24,
  },
  notificationWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Header;
