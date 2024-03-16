import React, { useEffect, useState, FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '../../components/container';
import { MetaTags } from '../../components/meta_tags';
import Separator from '../../components/separator';
import { StaticPagesBreadcrumb } from '../../components/static_breadcrumb';
import { AR } from '../../locales/constants';
import { MANZILIK, TERMS_DESCRIPTION } from '../../locales/strings';
import { TermsAndConditionsContent } from './components/terms_content';
import { TermsAndConditionsMock } from './mock';
import { TermsAndConditions as TermsConditions } from './types';

const TermsAndConditions: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const [termsContent, setTermsContent] = useState<TermsConditions>();

  const getTermsAndConditions = () => {
    const privacy = TermsAndConditionsMock(i18n.language);
    setTermsContent(privacy);
  };

  useEffect(() => {
    getTermsAndConditions();
  }, [i18n.language]);

  return (
    <>
      <MetaTags title={` ${t(MANZILIK)} | ${termsContent?.title!}`} description={t(TERMS_DESCRIPTION)} />
      <Separator vertical={13} />
      <Container>
        <StaticPagesBreadcrumb title={termsContent?.title!} />
      </Container>
      {termsContent && <TermsAndConditionsContent termsContent={termsContent} />}
    </>
  );
};

export default TermsAndConditions;
