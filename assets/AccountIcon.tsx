// File: src/assets/icons/AccountIcon.tsx

import React from 'react';
import Svg, { Path } from 'react-native-svg';

const AccountIcon = (props: { width?: number; height?: number; fill?: string }) => (
  <Svg
    width={props.width || 25}
    height={props.height || 24}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M12.6 12C15.3614 12 17.6 9.76142 17.6 7C17.6 4.23858 15.3614 2 12.6 2C9.83855 2 7.59998 4.23858 7.59998 7C7.59998 9.76142 9.83855 12 12.6 12Z"
      stroke={props.fill || "#676D75"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21.19 22C21.19 18.13 17.34 15 12.6 15C7.86001 15 4.01001 18.13 4.01001 22"
      stroke={props.fill || "#676D75"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default AccountIcon;
