import { on } from 'events';
import React, { useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

interface ManzilikDrawerProps {
  children: React.ReactNode;
  open: boolean;
  setDrawerOpen: (open: boolean) => void;
  onClose?: () => void;
  direction: 'left' | 'right';
  className?: string;
  size?: number;
}

const ManzilikDrawer = (props: ManzilikDrawerProps) => {
  const { children, onClose, direction = 'right', className, setDrawerOpen, open, size = 482 } = props;
  const [isDrawerOpen, setIsDrawerOpen] = useState(open);
  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
    setDrawerOpen(!isDrawerOpen);
    if (onClose) {
      onClose();
    }
  };
  useEffect(() => {
    setIsDrawerOpen(open);
  }, [open]);

  return (
    <>
      <Drawer
        lockBackgroundScroll
        size={size}
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        direction={direction}
        className={className}
      >
        {children}
      </Drawer>
    </>
  );
};

export default ManzilikDrawer;
