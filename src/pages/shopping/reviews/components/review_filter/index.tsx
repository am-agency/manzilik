import React, { FunctionComponent, useState } from 'react';
import { Col, Row, Select, Typography } from 'antd';
import { FILTER_BY, LATEST, OF, OLDEST, REVIEW } from '../../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { getLayoutDirection } from '../../../../../app/layouts';

export const ReviewFilter: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const [value, setValue] = useState(LATEST);

  const handleSelectFilter = (value: string) => {
    setValue(value);
  };

  //@TODO: will change it when connecting with api
  //Select Options
  const options = [
    {
      label: (
        <span>
          {t(FILTER_BY)} <strong>{t(LATEST)}</strong>
        </span>
      ),
      value: 'latest',
    },
    {
      label: (
        <span>
          {t(FILTER_BY)} <strong>{t(OLDEST)}</strong>
        </span>
      ),
      value: 'oldest',
    },
  ];

  //Select Props
  const selectProps = {
    value,
    onChange: handleSelectFilter,
    options,
    dropdownClassName: getLayoutDirection(i18n.language),
  };

  return (
    <Row justify="start" align="middle" className="review_filter">
      <Col span={12}>
        {/*@TODO: will change the static content when it's done from backend*/}
        <Typography.Text>
          1 - 5 {t(OF)} 20 {t(REVIEW)}
        </Typography.Text>
      </Col>
      <Col span={12}>
        <Select {...selectProps} />
      </Col>
    </Row>
  );
};
