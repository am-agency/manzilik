import React from 'react';

interface Props {
  status: string;
  icon?: string;
  bgColor?: string;
  textColor?: string;
  isCenter?: boolean;
}

const StatusCard: React.FC<Props> = ({ status, icon, bgColor, textColor, isCenter = true }) => {
  return (
    <div
      className="card-status"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        justifyContent: isCenter ? 'center' : 'flex-start',
      }}
    >
      <img src={icon!} alt="check" />
      <span>{status}</span>
    </div>
  );
};

export default StatusCard;
