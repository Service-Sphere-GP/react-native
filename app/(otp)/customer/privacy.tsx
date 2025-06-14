import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Image, 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

interface PrivacyPolicyScreenProps {
  onGoBack?: () => void;
  onNavigateToRegister?: () => void;
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({
  onGoBack,
  onNavigateToRegister,
}) => {
  const [isAgreed, setIsAgreed] = useState(false);
  const router = useRouter(); 

  const handleAgreePress = () => {
    setIsAgreed(true);
    setTimeout(() => {
      router.push('/(otp)/customer/register');
    }, 1000); 
  };

  const handleBackPress = () => {
    router.push('/(otp)/customer/register');
  };

  const SectionWithIcon = ({ 
    iconName, 
    iconColor, 
    iconBgColor, 
    title, 
    content 
  }: {
    iconName: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    iconBgColor: string;
    title: string;
    content: string;
  }) => (
    <View className="mb-6">
      <View className="flex-row items-center justify-center mb-3">
        <View 
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full items-center justify-center mr-3`}
          style={{ backgroundColor: iconBgColor }}
        >
          <Ionicons 
            name={iconName} 
            size={screenWidth < 400 ? 18 : 20} 
            color={iconColor} 
          />
        </View>
        <Text className="text-base sm:text-lg font-Roboto-Bold text-gray-900 flex-1">
          {title}
        </Text>
      </View>
      <Text className="text-sm sm:text-base text-gray-800 font-Roboto">
        {content}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 mx-4 mt-6 mb-4">
        <View className="bg-white rounded-3xl shadow-lg flex-1 overflow-hidden">
          <View className="flex-row items-center px-6 py-4 border-b border-gray-50">
            <TouchableOpacity
              onPress={handleBackPress}
              className="mr-4 p-1 active:bg-gray-100 rounded-full"
              activeOpacity={0.7}
              style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}
            >
              <Image
                source={require('@/assets/images/leftArrow.png')}
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
            
            <Text className="text-lg sm:text-xl font-Roboto-Bold text-gray-900 flex-1 text-center mr-8">
              Privacy Policy
            </Text>
          </View>

          <ScrollView 
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="px-6 py-6">
              <Text className="text-sm sm:text-base text-gray-800 leading-6 mb-8 text-center font-Roboto">
                Your privacy is important to us. It is Brainstorming's policy to respect your privacy 
                regarding any information we may collect from you across our{' '}
                <Text className="text-[#147E93] underline font-Roboto-Medium">website</Text>, mobile applications, and other digital platforms 
                we own and operate.
              </Text>

              <SectionWithIcon
                iconName="information-circle"
                iconColor="#3B82F6"
                iconBgColor="#DBEAFE"
                title="Information We Collect"
                content="We only ask for personal information when we truly need it to provide a service to you. This may include your name, email address, phone number, location data, and usage analytics. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used for service improvement and personalization."
              />


              <SectionWithIcon
                iconName="settings"
                iconColor="#8B5CF6"
                iconBgColor="#EDE9FE"
                title="How We Use Your Information"
                content="We use the information we collect to provide, maintain, and improve our services. This includes personalizing your experience, communicating with you about updates and promotions, analyzing usage patterns to enhance functionality, and ensuring the security and integrity of our platform."
              />


              <SectionWithIcon
                iconName="shield-checkmark"
                iconColor="#10B981"
                iconBgColor="#D1FAE5"
                title="Data Storage and Security"
                content="We only retain collected information for as long as necessary to provide you with your requested service, or as required by law. What data we store, we'll protect within commercially acceptable means using encryption, secure servers, and regular security audits to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification."
              />


              <SectionWithIcon
                iconName="people"
                iconColor="#F59E0B"
                iconBgColor="#FEF3C7"
                title="Information Sharing"
                content="We don't share any personally identifying information publicly or with third-parties, except when required by law, with your explicit consent, or with trusted service providers who assist us in operating our platform under strict confidentiality agreements."
              />

              <SectionWithIcon
                iconName="hand-right"
                iconColor="#EF4444"
                iconBgColor="#FEE2E2"
                title="Your Rights and Choices"
                content="You have the right to access, update, or delete your personal information at any time. You can also opt-out of marketing communications, request data portability, and withdraw consent for data processing where applicable. Contact us at privacy@brainstorming.com to exercise these rights."
              />


              <SectionWithIcon
                iconName="analytics"
                iconColor="#06B6D4"
                iconBgColor="#CFFAFE"
                title="Cookies and Tracking Technologies"
                content="We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand user preferences. You can control cookie settings through your browser preferences, though disabling cookies may limit some functionality."
              />

              <SectionWithIcon
                iconName="globe"
                iconColor="#14B8A6"
                iconBgColor="#CCFBF1"
                title="International Data Transfers"
                content="Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable data protection laws and international standards."
              />


              <SectionWithIcon
                iconName="refresh"
                iconColor="#6366F1"
                iconBgColor="#E0E7FF"
                title="Changes to This Policy"
                content="We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the 'Last updated' date above."
              />

            </View>
          </ScrollView>

          <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-4 border-t border-gray-100">
            <TouchableOpacity
              onPress={handleAgreePress}
              className={`py-4 rounded-xl transition-all duration-200 ${
                isAgreed
                  ? 'bg-[#147E93] active:bg-[#0F7A8C]'
                  : 'bg-yellow-400 active:bg-yellow-500'
              }`}
              activeOpacity={0.9}
            >
              <Text className="text-center font-Roboto-Bold text-base sm:text-lg text-black">
                {isAgreed ? "Agreed! Redirecting..." : "I've agree with this"}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;