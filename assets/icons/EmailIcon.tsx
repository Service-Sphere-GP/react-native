import React from 'react';
import Svg, { Path } from 'react-native-svg';

const EmailIcon = ({ color = '#676B73' }) => (
  <Svg width="42" height="33" viewBox="0 0 42 33" fill="none">
    <Path
      d="M41 5.65V27.35C41 28.5833 40.5137 29.766 39.6482 30.638C38.7826 31.5101 37.6087 32 36.3846 32H5.61538C4.39131 32 3.21737 31.5101 2.35181 30.638C1.48626 29.766 1 28.5833 1 27.35V5.65M41 5.65C41 4.41674 40.5137 3.234 39.6482 2.36195C38.7826 1.48991 37.6087 1 36.3846 1H5.61538C4.39131 1 3.21737 1.48991 2.35181 2.36195C1.48626 3.234 1 4.41674 1 5.65M41 5.65V6.1522C41.0001 6.9461 40.7984 7.7268 40.4142 8.41994C40.03 9.11308 39.4761 9.69558 38.8051 10.1119L23.4205 19.6496C22.6927 20.1012 21.8548 20.3404 21 20.3404C20.1452 20.3404 19.3073 20.1012 18.5795 19.6496L3.19487 10.114C2.52394 9.69764 1.96999 9.11515 1.58578 8.42201C1.20158 7.72887 0.999913 6.94817 1 6.15427V5.65"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default EmailIcon;
