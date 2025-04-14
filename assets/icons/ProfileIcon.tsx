import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface ProfileIconProps {
  color?: string;
  style?: ViewStyle;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({
  color = '#030B19',
  style,
}) => (
  <Svg width="16" height="20" viewBox="0 0 16 20" fill="none" style={style}>
    <Path
      d="M11.3116 4.4375C11.3116 5.34918 10.9494 6.22352 10.3048 6.86818C9.66011 7.51284 8.78577 7.875 7.87408 7.875C6.9624 7.875 6.08806 7.51284 5.4434 6.86818C4.79875 6.22352 4.43658 5.34918 4.43658 4.4375C4.43658 3.52582 4.79875 2.65148 5.4434 2.00682C6.08806 1.36216 6.9624 1 7.87408 1C8.78577 1 9.66011 1.36216 10.3048 2.00682C10.9494 2.65148 11.3116 3.52582 11.3116 4.4375ZM1 17.379C1.02946 15.5753 1.76664 13.8555 3.05258 12.5904C4.33852 11.3253 6.07016 10.6163 7.87408 10.6163C9.678 10.6163 11.4097 11.3253 12.6956 12.5904C13.9815 13.8555 14.7187 15.5753 14.7482 17.379C12.5916 18.3679 10.2466 18.8782 7.87408 18.875C5.42108 18.875 3.09275 18.3397 1 17.379Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ProfileIcon;
