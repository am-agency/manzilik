import React from 'react';

interface TextWithIconProps {
  icon: string;
  text: string | React.ReactNode;
}

function TextWithIcon(props: TextWithIconProps) {
  const { icon, text } = props;
  return text ? (
    <div className="price">
      <img src={icon} alt="price" />
      <span>{text}</span>
    </div>
  ) : null;
}

export default TextWithIcon;
