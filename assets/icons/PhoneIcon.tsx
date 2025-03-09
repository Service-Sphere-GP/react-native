import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface PhoneIconProps {
  color?: string;
  style?: ViewStyle;
}

const PhoneIcon: React.FC<PhoneIconProps> = ({ color = '#676B73', style }) => (
  <Svg width="25" height="43" viewBox="0 0 25 43" fill="none" style={style}>
    <Path
      d="M9.625 1H5.3125C4.16875 1 3.07185 1.46282 2.2631 2.28664C1.45435 3.11046 1 4.2278 1 5.39286V37.6071C1 38.7722 1.45435 39.8895 2.2631 40.7134C3.07185 41.5372 4.16875 42 5.3125 42H19.6875C20.8312 42 21.9281 41.5372 22.7369 40.7134C23.5456 39.8895 24 38.7722 24 37.6071V5.39286C24 4.2278 23.5456 3.11046 22.7369 2.28664C21.9281 1.46282 20.8312 1 19.6875 1H15.375M9.625 1V3.92857H15.375V1M9.625 1H15.375M9.625 37.6071H15.375"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PhoneIcon;
