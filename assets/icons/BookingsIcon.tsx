import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface BookingsIconProps {
  color?: string;
  style?: ViewStyle;
}

const BookingsIcon: React.FC<BookingsIconProps> = ({
  color = '#030B19',
  style,
}) => (
  <Svg width="24" height="25" viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M1 8.33333H23M8.33333 15.6667L10.7778 18.1111L15.6667 13.2222M5.88889 1V3.44444M18.1111 1V3.44444M4.91111 23H19.0889C20.4579 23 21.1425 23 21.6653 22.7336C22.1253 22.4993 22.4993 22.1253 22.7336 21.6653C23 21.1425 23 20.4579 23 19.0889V7.35556C23 5.98653 23 5.30203 22.7336 4.77914C22.4993 4.31918 22.1253 3.94523 21.6653 3.71088C21.1425 3.44444 20.4579 3.44444 19.0889 3.44444H4.91111C3.5421 3.44444 2.85758 3.44444 2.33469 3.71088C1.87473 3.94523 1.50078 4.31918 1.26643 4.77914C1 5.30203 1 5.98653 1 7.35556V19.0889C1 20.4579 1 21.1425 1.26643 21.6653C1.50078 22.1253 1.87473 22.4993 2.33469 22.7336C2.85758 23 3.54209 23 4.91111 23Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default BookingsIcon;
