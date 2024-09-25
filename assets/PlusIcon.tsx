// File: src/assets/icons/PlusIcon.tsx

import React from 'react';
import Svg, { Path } from 'react-native-svg';

const PlusIcon = (props: { width?: number; height?: number; fill?: string }) => (
  <Svg
    width={props.width || 24}
    height={props.height || 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M12 5V19"
      stroke={props.fill || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 12H19"
      stroke={props.fill || "white"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PlusIcon;
