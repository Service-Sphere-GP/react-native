import { View, Image } from 'react-native';
import { router } from 'expo-router';
import CustomButton from "@/components/CustomButton";
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

const RegistrationSuccess = () => {
  const handleGetStarted = () => {
    router.push("/(otp)/home");
  };

  return (
    <View className="flex-1 bg-white">
      <View className="mt-[190px] items-center">
        <Animated.View 
          className="relative w-[130px] h-[130px] items-center justify-center"
          entering={ZoomIn.duration(800)}
        >
          <Image
            source={require('../../assets/images/circle.png')}
            className="w-[130px] h-[130px]"
          />
          <Image
            source={require('../../assets/images/check.png')}
            className="w-[78px] h-[56px] absolute"
          />
        </Animated.View>

        <Animated.Text 
          className="mt-[33px] text-[26px] font-Roboto-Bold text-[#030B19] text-center"
          entering={FadeInDown.delay(300)}
        >
          Registration Completed
        </Animated.Text>

        <Animated.Text 
          className="mt-[23px] text-[15px] font-Roboto text-[#363E4C] text-center px-8"
          entering={FadeInDown.delay(600)}
        >
          Congratulations! Your registration is complete{'\n'}
          You're all set to start exploring.Click the button{'\n'}
          below to go to the homepage.{'\n'}
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.delay(900)}
        >
          <CustomButton
            onPress={handleGetStarted}
            title="Get Started"
            containerStyles="mx-auto mt-[86px] w-[358px] h-[46px] rounded-[10px] bg-[#FDBC10] justify-center items-center"
            textStyles="text-[22px] text-[#030B19] font-Roboto-SemiBold"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 6,
            }}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default RegistrationSuccess;
