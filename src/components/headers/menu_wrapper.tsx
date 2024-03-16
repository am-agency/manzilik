import { Col, Row } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import i18n from '../../app/i18n';
import { AR } from '../../locales/constants';
import DropdownPopover from '../dropdown_popover';
import Separator from '../separator';

interface Props {
  children: ReactNode;
  icon: string;
  label: string;
  sectionId: string;
  labelLink: string | null;
  onLabelClick?: () => void;
}

interface ItemLabelProps {
  icon: string;
  label: string;
  isArabic: boolean;
}

const ItemLabel = ({ icon, label, isArabic }: ItemLabelProps) => {
  return (
    <>
      <Separator horizontal={8} responsive />
      <div>
        <img src={icon} className="menu-item-icon" />
      </div>
      <Separator horizontal={3} />
      <span className="menu-item-text"> {label}</span>
      <Separator horizontal={isArabic ? 16 : 8} responsive />
    </>
  );
};

export const MenuWrapper = ({ children, icon, label, labelLink, onLabelClick, sectionId }: Props) => {
  const history = useHistory();
  const { t } = useTranslation();
  const isHomePage = history.location.pathname == '/';
  const isArabic = i18n.language == AR;
  const [height, setHeight] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const updatedStyle = { height: height! > 200 ? 200 : 'fit-content' };

  const onVisibleChange = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      setHeight(element.clientHeight!);
    }
  }, [isOpen]);

  return (
    <DropdownPopover
      trigger={['hover', 'click']}
      className={`menu-dropdown ${isHomePage ? 'homepage-popover' : 'default-popover'}`}
      onVisibleChange={onVisibleChange}
      content={
        <>
          <Row
            justify="center"
            style={updatedStyle}
            id={`${!isHomePage && sectionId}`}
            className={`content-wrapper ${i18n.language} ${!isHomePage ? 'popover-content' : ''}`}
          >
            <Col
              xl={21}
              lg={21}
              md={isHomePage ? 23 : 21}
              sm={isHomePage ? 23 : 21}
              xs={isHomePage ? 23 : 21}
              className="icon-wrapper popover-container"
            >
              <Row
                justify="center"
                id={`${isHomePage && sectionId}`}
                style={updatedStyle}
                className={isHomePage ? 'popover-content' : ''}
              >
                <Col
                  xl={isHomePage ? 20 : 23}
                  lg={isHomePage ? 20 : 23}
                  md={isHomePage ? 22 : 24}
                  sm={isHomePage ? 22 : 24}
                  xs={isHomePage ? 22 : 24}
                >
                  {children}
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      }
    >
      {labelLink ? (
        <Link to={labelLink} className="menu-item-label" onClick={onLabelClick}>
          <ItemLabel icon={icon} label={t(label)} isArabic={isArabic} />
        </Link>
      ) : (
        <div className="menu-item-label">
          <ItemLabel icon={icon} label={t(label)} isArabic={isArabic} />
        </div>
      )}
    </DropdownPopover>
  );
};
