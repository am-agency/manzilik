import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '../../components/container';
import { MetaTags } from '../../components/meta_tags';
import Separator from '../../components/separator';
import { StaticPagesBreadcrumb } from '../../components/static_breadcrumb';
import { MANZILIK, PRIVACY_DESCRIPTION } from '../../locales/strings';
import { PrivacyPolicyContent } from './components/content';
import { PrivacyMock } from './mock/privacy';
import { PrivacyPolicy as Privacy } from './types';

const PrivacyPolicy = () => {
  const { t, i18n } = useTranslation();
  const [privacyContent, setPrivacyContent] = useState<Privacy>();

  const getPrivacyContent = () => {
    const privacy = PrivacyMock(i18n.language);
    setPrivacyContent(privacy);
  };

  useEffect(() => {
    getPrivacyContent();
  }, [i18n.language]);

  return (
    <>
      <MetaTags title={` ${t(MANZILIK)} | ${privacyContent?.title!}`} description={t(PRIVACY_DESCRIPTION)} />
      <Separator vertical={13} />
      <Container>
        <StaticPagesBreadcrumb title={privacyContent?.title!} />
      </Container>
      {privacyContent && <PrivacyPolicyContent privacyContent={privacyContent!} />}
    </>
  );
};

export default PrivacyPolicy;
