import React, { useState } from 'react';

interface TooltipProps {
  text: string;
}

const CustomTooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [show, setShow] = useState(false);

  const handleMouseEnter = () => {
    if (text.length < 38) {
      return;
    } else {
      setShow(true);
    }
  };

  const handleMouseLeave = () => {
    setShow(false);
  };

  return (
    <div
      className="custom-tooltip"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      {show && <div className="custom-tooltip-text">{text}</div>}
    </div>
  );
};

export default CustomTooltip;
