import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { Popover } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { getLayoutDirection } from '../../app/layouts';
import { AR } from '../../locales/constants';
import { PopoverPlacement } from './types';
import { useLocation } from 'react-router-dom';
import { TooltipPlacement } from 'antd/lib/tooltip';

interface Props {
  content: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  trigger: string | string[];
  className?: string;
  showPopOver?: boolean;
  onVisibleChange?: ((visible: boolean) => void) | undefined;
  placement?: TooltipPlacement;
}

const DropdownPopover: FunctionComponent<Props> = (props: Props) => {
  const { i18n } = useTranslation();
  const { children, disabled, trigger, className, showPopOver = true, onVisibleChange, placement } = props;
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const history = useHistory();

  useEffect(() => {
    setIsVisible(false);
  }, [history.location.pathname, useLocation().search]);

  useEffect(() => {
    !isVisible && setIsVisible(true);
  }, [isVisible]);

  if (!isVisible || !showPopOver) {
    return <div className="popover-btn">{children}</div>;
  }

  return (
    <Popover
      content={props.content}
      placement={
        placement ? placement : i18n.language === AR ? PopoverPlacement.BOTTOMLEFT : PopoverPlacement.BOTTOMRIGHT
      }
      trigger={trigger}
      overlayClassName={`dropdown-popover ${className} ${getLayoutDirection(i18n.language)} ${
        disabled ? 'dropdown-popover-disabled' : ''
      }`}
      onVisibleChange={onVisibleChange}
    >
      <div className="popover-btn">{children}</div>
    </Popover>
  );
};

export default DropdownPopover;
