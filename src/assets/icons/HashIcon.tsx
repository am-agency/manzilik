import * as React from 'react';
import { SVGProps } from 'react';

const HashIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} fill="none" {...props}>
    <path
      d="M31.5 16c0 8.56-6.94 15.5-15.5 15.5C7.44 31.5.5 24.56.5 16 .5 7.44 7.44.5 16 .5 24.56.5 31.5 7.44 31.5 16Z"
      fill="#EFEFEF"
      stroke="#fff"
    />
    <path
      d="m9 24 7-16M16 24l7-16M9 13h16M7 19h16"
      stroke="#0A0C10"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default HashIcon;
