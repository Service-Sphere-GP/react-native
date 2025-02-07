import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import DropDownPicker from 'react-native-dropdown-picker';
import Footer from '@/components/Footer/Footer';

const Details = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState([
    { label: 'Select a service', value: '' },
    { label: 'Service A', value: 'Service A' },
    { label: 'Service B', value: 'Service B' },
  ]);
  return (
    <>
      <View className="p-2 pt-20 bg-white h-full">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require('@/assets/images/blackArrow.png')}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <Text className="text-4xl font-Roboto-SemiBold w-full text-center">
            Service Details
          </Text>
        </View>
        <Text className="text-lg font-Roboto-Light mt-20">
          Please enter your Job Details to complete the authentication process.
        </Text>
        <View className="mt-6 z-[9999]">
          <Text className="text-xl font-Roboto-SemiBold mb-2">
            Service Title
          </Text>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="Select a service"
            style={{ borderColor: '#EDEDED', borderRadius: 10 }}
            dropDownContainerStyle={{
              borderColor: '#EDEDED',
              borderRadius: 10,
              zIndex: 9999,
            }}
          />
        </View>
        <View className="flex-row justify-between items-center mt-10">
          <Text className="text-xl font-Roboto-SemiBold mb-2">
            Service Images
          </Text>
          <Text className="text-xl underline text-[#147E93] font-Roboto-Bold">
            Upload
          </Text>
        </View>

        <Text className="text-xl font-Roboto-SemiBold mt-20">
          Service Description
        </Text>
        <Text className=" font-Roboto-Thin mt-1">
          Please provide a brief description of the service you are offering.
        </Text>
        <TextInput
          className="h-40 p-4 border-2 border-[#EDEDED] rounded-lg font-Roboto-Thin focus:outline-[#147E93] w-full mt-2 placeholder:text-[#363E4C]"
          multiline
        />
        <CustomButton
          title="Continue"
          containerStyles="mt-5 bg-[#FDBD10] p-4 rounded-lg w-full shadow-md"
          textStyles="font-medium text-[21px]"
          onPress={() => console.log('Sign Up')}
        />
      </View>
      <Footer />
    </>
  );
};

export default Details;
