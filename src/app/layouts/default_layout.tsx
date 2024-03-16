import React, { FunctionComponent, ReactNode, useContext, useEffect } from 'react';
import { Col } from 'antd';
import { ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import { Content, Footer, Header } from 'antd/lib/layout/layout';

import { getLayoutDirection } from '.';
import UserHeader from '../../components/headers';
import UserFooter from '../../components/footer';
import { useMainContext } from '../providers/main';
import { useLocation } from 'react-router';
import ExtendedFooter from '../../components/footer/extended_footer';
import TutorialCard from '../../components/tutorial_card';
import { TutorialContext, TutorialInterface } from '../../context/tutorial_context';
import { MANAGE_GIGS, MY_ACCOUNT, THEN_CLICK_GIGS_MANAGEMENT, TYR_TO_ADD_SERVICE } from '../../locales/strings';

const fixedHeader = {
  position: 'fixed',
  width: '100%',
} as React.CSSProperties;

interface Props {
  children: ReactNode;
}

export const DefaultLayout: FunctionComponent<Props> = (props: Props) => {
  const { children } = props;
  const { i18n, t } = useTranslation();
  const { userState } = useMainContext();
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';
  const { currentStep, showTutorial, setShowTutorial, disableTutorial, setPointerPosition, stepIncremental } =
    useContext(TutorialContext) as TutorialInterface;

  const lang = i18n.language;
  const leftArabic = currentStep! === 1 ? '12%' : '26%';
  const rightArabic = currentStep! === 1 ? '12%' : '26%';
  const hasShownBanner = JSON.parse(localStorage.getItem('hasShownBanner')!);

  useEffect(() => {
    if (lang === 'ar' && currentStep! === 1) {
      setPointerPosition!('top');
    } else if (lang === 'ar' && currentStep! === 2) {
      setPointerPosition!('left');
    } else {
      setPointerPosition!('right');
    }
  }, [lang]);

  useEffect(() => {
    stepIncremental(1);
    setPointerPosition!('top');
  }, [pathname]);

  useEffect(() => {
    if (pathname.includes('my-gigs') && hasShownBanner) {
      setShowTutorial!(false);
    } else if (pathname.includes('edit-profile') && hasShownBanner) {
      setShowTutorial!(true);
    } else {
      setShowTutorial!(false);
    }
  }, [pathname, disableTutorial]);

  return (
    <ConfigProvider direction={getLayoutDirection(i18n.language)}>
      <Header className="home-header" style={fixedHeader}>
        <UserHeader />
      </Header>
      {showTutorial && !disableTutorial ? (
        <TutorialCard
          left={lang === 'ar' ? leftArabic : 'auto'}
          right={lang === 'ar' ? 'auto' : rightArabic}
          title={currentStep! === 1 ? t(TYR_TO_ADD_SERVICE) : t(t(THEN_CLICK_GIGS_MANAGEMENT))}
          buttonText={currentStep! === 1 ? t(MY_ACCOUNT) : t(MANAGE_GIGS)}
        />
      ) : null}

      <Content className="main-container">
        <Col span={24}>{children}</Col>
      </Content>
      <>
        <ExtendedFooter />
        <Footer>
          <UserFooter />
        </Footer>
      </>
    </ConfigProvider>
  );
};
