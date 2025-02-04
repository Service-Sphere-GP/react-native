import { View } from 'react-native';
import Input from './Input';
import SmallInput from './SmallInput';

const Inputs = () => {
  return (
    <View className="flex flex-col items-center">
      <View className="block sm:flex sm:flex-row justify-center items-center gap-2 mt-5 w-full">
        <SmallInput label="First Name" placeholder="Enter your first name" />
        <SmallInput label="Last Name" placeholder="Enter your last name" />
      </View>
      <Input label="Email" placeholder="Enter your email" isPassword={false} />
      <Input
        label="Password"
        placeholder="Enter your password"
        isPassword={true}
      />
      <Input
        label="Confirm Password"
        placeholder="Re-enter your password"
        isPassword={true}
      />
    </View>
  );
};

export default Inputs;
