import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/i18n/LanguageContext';
import HomeIcon from '../assets/icons/HomeIcon';
import ServicesIcon from '../assets/icons/ServicesIcon';
import BookingsIcon from '../assets/icons/BookingsIcon';
import ProfileIcon from '../assets/icons/ProfileIcon';

interface NavigationItem {
  nameKey: string;
  icon: (props: { color: string }) => React.ReactNode;
  href: string;
  section: string; // Added to identify which section a path belongs to
}

const BottomNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const [activeSection, setActiveSection] = useState<string>('home');

  // Navigation items configuration with specific destination pages
  const navigationItems: NavigationItem[] = [
    {
      nameKey: 'home:title',
      icon: ({ color }) => <HomeIcon color={color} />,
      href: '/(tabs)/home',
      section: 'home',
    },
    {
      nameKey: 'services:allServices',
      icon: ({ color }) => <ServicesIcon color={color} />,
      href: '/(tabs)/services', // Changed to all-services
      section: 'services',
    },
    {
      nameKey: 'bookings:title',
      icon: ({ color }) => <BookingsIcon color={color} />,
      href: '/(tabs)/bookings',
      section: 'bookings',
    },
    {
      nameKey: 'profile:title',
      icon: ({ color }) => <ProfileIcon color={color} />,
      href: '/(tabs)/profile/me', // Changed to me.tsx
      section: 'profile',
    },
  ];

  // Update active section when pathname changes
  useEffect(() => {
    const path = pathname.split('/').filter(Boolean);
    // Check which section the current path belongs to
    if (path.includes('home')) {
      setActiveSection('home');
    } else if (path.includes('services')) {
      setActiveSection('services');
    } else if (path.includes('bookings')) {
      setActiveSection('bookings');
    } else if (path.includes('profile')) {
      setActiveSection('profile');
    }
  }, [pathname]);

  // Handle navigation to a specific tab
  const handleNavigation = (href: string, section: string) => {
    setActiveSection(section);
    router.navigate(href as any);
  };

  // Determine color based on active section
  const getColor = (section: string) => {
    return activeSection === section ? '#FFB800' : '#030B19';
  };

  // Create a localized copy of navigation items to respect RTL order if needed
  const localizedNavItems = [...navigationItems];

  // Reverse the navigation items if RTL
  if (isRTL) {
    localizedNavItems.reverse();
  }

  return (
    <View style={[styles.container, isRTL && styles.containerRTL]}>
      {localizedNavItems.map((item) => (
        <TouchableOpacity
          key={item.nameKey}
          style={styles.tabItem}
          onPress={() => handleNavigation(item.href, item.section)}
          activeOpacity={0.7}
        >
          {item.icon({ color: getColor(item.section) })}
          <Text
            style={[
              styles.tabText,
              {
                color: getColor(item.section),
              },
            ]}
          >
            {t(item.nameKey)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    paddingVertical: 12,
    paddingHorizontal: 0, // Changed from 16 to 0
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  containerRTL: {
    flexDirection: 'row-reverse',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
    // fontFamily will be added dynamically
  },
});

export default BottomNavigation;
