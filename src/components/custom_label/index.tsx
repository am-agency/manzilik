import React from 'react';

interface CustomLabelProps {
  text: string;
  backgroundColor: string;
}

const CustomLabel = (props: CustomLabelProps) => {
  const { text, backgroundColor } = props;
  return (
    <div
      className="gig-label"
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      {text}
    </div>
  );
};

export default CustomLabel;
