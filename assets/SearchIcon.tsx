// File: src/assets/icons/SearchIcon.tsx

import React from 'react';
import Svg, { Path } from 'react-native-svg';

const SearchIcon = (props: { width?: number; height?: number; fill?: string }) => (
  <Svg
    width={props.width || 25}
    height={props.height || 24}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M11.8 20C16.7706 20 20.8 15.9706 20.8 11C20.8 6.02944 16.7706 2 11.8 2C6.82942 2 2.79999 6.02944 2.79999 11C2.79999 15.9706 6.82942 20 11.8 20Z"
      stroke={props.fill || "white"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19.7299 20.6898C20.2599 22.2898 21.4699 22.4498 22.3999 21.0498C23.2499 19.7698 22.6899 18.7198 21.1499 18.7198C20.0099 18.7098 19.3699 19.5998 19.7299 20.6898Z"
      stroke={props.fill || "white"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SearchIcon;
