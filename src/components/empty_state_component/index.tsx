import { Button, Typography } from 'antd';
import React from 'react';

interface EmptyStateProps {
  image: string;
  title: string;
  description?: string;
  actionElement?: React.ReactNode;
  actionFunction?: () => void;
}

const EmptyState = (props: EmptyStateProps) => {
  const { image, title, description, actionElement, actionFunction } = props;
  return (
    <div className="empty-state-container">
      <img src={image} alt="empty_state" />
      <p className="title">{title}</p>
      <p className="description">{description}</p>
      {actionElement && (
        <Button type="primary" className="action-btn" onClick={actionFunction}>
          {actionElement}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
