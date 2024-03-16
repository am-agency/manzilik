import React, { FunctionComponent, useState, useEffect } from 'react';
import { Container } from '../../components/container';
import Separator from '../../components/separator';
import { FAQ } from './components/FAQ';
import { ContactForm } from './components/contact_form';
import { Col, FormInstance, Row } from 'antd';
import i18n from '../../app/i18n';
import { useMainContext } from '../../app/providers/main';
import { listFAQs, sendContactForm } from './api';
import { FAQ as Faq, ContactUsInput } from '../../API';
import { StaticPagesBreadcrumb } from '../../components/static_breadcrumb';
import { CONTACT_US } from '../../locales/strings';
import { useTranslation } from 'react-i18next';
import { ResponseType } from './types';
import { DONE } from '../projects/constants';

const ContactUs: FunctionComponent = () => {
  const { requestApi } = useMainContext();
  const [faq, setFaq] = useState<Faq[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { t } = useTranslation();

  const getFAQ = () => {
    requestApi(listFAQs, { offset: 0, limit: 20 }, (response: { results: Faq[] }, error: string) => {
      if (error) {
        return;
      }
      setFaq(response.results);
    });
  };

  const onFinish = (form: FormInstance<ContactUsInput>): void => {
    const values = form.getFieldsValue();
    requestApi(sendContactForm, { ...values }, (response: ResponseType, error: string) => {
      if (error) {
        return;
      }
      if (response.message === DONE) {
        setIsModalVisible(true);
        form.resetFields();
      }
    });
  };

  useEffect(() => {
    getFAQ();
  }, [i18n.language]);

  return (
    <Container>
      <Separator vertical={16} />
      <StaticPagesBreadcrumb title={t(CONTACT_US)} />
      <Separator vertical={24} />
      <Row gutter={[32, 32]}>
        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
          <FAQ faq={faq} />
        </Col>
        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
          <ContactForm setIsModalVisible={setIsModalVisible} isModalVisible={isModalVisible} onFinish={onFinish} />
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;
