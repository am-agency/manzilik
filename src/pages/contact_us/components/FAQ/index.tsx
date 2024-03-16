import React, { FunctionComponent } from 'react';
import { Col, Collapse, Row } from 'antd';
import { CONTACT_US, FREQUENTLY_ASKED_QUESTIONS } from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import Separator from '../../../../components/separator';
import { contactIcons } from '../../../../assets/icons/contact';
import { AR } from '../../../../locales/constants';
import { FAQ as Faq } from '../../../../API';

const { expand, un_expand } = contactIcons;
const { Panel } = Collapse;

interface Props {
  faq: Faq[];
}
export const FAQ: FunctionComponent<Props> = ({ faq }: Props) => {
  const { t, i18n } = useTranslation();
  const iconClassName = i18n.language === AR ? 'expand-icon-ar' : 'expand-icon-en';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (expanded: any) => {
    if (expanded.isActive) {
      return <img src={un_expand.icon} alt="expand" className={iconClassName} />;
    }
    return <img src={expand.icon} alt="expand" className={iconClassName} />;
  };

  return (
    <Row className="contact_FAQ">
      <Col span={24}>
        <h1 className="heading-text">{t(CONTACT_US)}</h1>
      </Col>
      <Col span={24}>
        <h3 className="sub-heading-text">{t(FREQUENTLY_ASKED_QUESTIONS)}</h3>
        <Separator vertical={4} />
      </Col>
      <Col span={24}>
        <Collapse defaultActiveKey={['1']} onChange={onChange} expandIcon={(expanded) => onChange(expanded)}>
          {faq?.map((question, index) => (
            <>
              <Panel header={<span>{question.title}</span>} key={`${index + 1}`}>
                <p dangerouslySetInnerHTML={{ __html: question.description! }} />
              </Panel>
              <Separator vertical={8} />
            </>
          ))}
        </Collapse>
      </Col>
    </Row>
  );
};
