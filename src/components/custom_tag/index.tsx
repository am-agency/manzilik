import React from 'react';

interface CustomTagProps {
  className?: string;
  children?: React.ReactNode;
}

const CustomTag = (props: CustomTagProps) => {
  const { className, children } = props;
  return <span className={`tag ${className}`}>{children}</span>;
};

export default CustomTag;
