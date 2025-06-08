import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import HomeIcon from '../assets/icons/HomeIcon';
import ServicesIcon from '../assets/icons/ServicesIcon';
import BookingsIcon from '../assets/icons/BookingsIcon';
import ProfileIcon from '../assets/icons/ProfileIcon';

const BottomNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const { isRTL: contextRTL, language } = useLanguage();

  // Use both context RTL and I18nManager for reliability
  const [effectiveRTL, setEffectiveRTL] = useState(() => {
    const managerRTL = I18nManager.isRTL;
    const langRTL = i18n.language === 'ar';
    return managerRTL || langRTL || contextRTL;
  });

  // Update RTL state when any RTL indicator changes
  useEffect(() => {
    const managerRTL = I18nManager.isRTL;
    const langRTL = i18n.language === 'ar';
    const newRTL = managerRTL || langRTL || contextRTL;

    if (newRTL !== effectiveRTL) {
      setEffectiveRTL(newRTL);
    }
  }, [contextRTL, i18n.language, language, effectiveRTL]);

  // Simple navigation function
  const navigateTo = (route: string) => {
    router.push(route as any);
  };

  // Simple active check
  const isActive = (section: string) => {
    return pathname.includes(section);
  };

  // Simple color function
  const getColor = (section: string) => {
    return isActive(section) ? '#FFB800' : '#030B19';
  };

  const tabs = [
    {
      id: 'home',
      route: '/(tabs)/home',
      label: t('home:title'),
      icon: HomeIcon,
    },
    {
      id: 'services',
      route: '/(tabs)/services',
      label: t('services:allServices'),
      icon: ServicesIcon,
    },
    {
      id: 'bookings',
      route: '/(tabs)/bookings',
      label: t('bookings:title'),
      icon: BookingsIcon,
    },
    {
      id: 'profile',
      route: '/(tabs)/profile/me',
      label: t('profile:title'),
      icon: ProfileIcon,
    },
  ];

  return (
    <View
      key={`nav-${effectiveRTL ? 'rtl' : 'ltr'}`}
      style={[styles.container]}
    >
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const color = getColor(tab.id);

        return (
          <TouchableOpacity
            key={`${tab.id}-${effectiveRTL ? 'rtl' : 'ltr'}`}
            style={styles.tab}
            onPress={() => navigateTo(tab.route)}
            activeOpacity={0.7}
          >
            <IconComponent color={color} />
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    paddingVertical: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  rtl: {
    flexDirection: 'row-reverse',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default BottomNavigation;
