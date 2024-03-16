import React, { ReactNode } from 'react';

interface BoxShadowContainerProps {
  children: ReactNode;
}

const BoxShadowContainer: React.FC<BoxShadowContainerProps> = ({ children }) => {
  return (
    <div
      style={{
        borderRadius: '10px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        padding: '14px 18px',
        marginBottom: '10px',
        backgroundColor: '#fff',
      }}
    >
      {children}
    </div>
  );
};

export default BoxShadowContainer;
