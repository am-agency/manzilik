import React, { FunctionComponent } from 'react';
import { Button, Col, Row } from 'antd';

//hooks
import { useTranslation } from 'react-i18next';

//strings
import { BE_FIRST_REVIEWER, NO_BODY_REVIEWED_THIS_PRODUCT } from '../../../../../locales/strings';

import Separator from '../../../../../components/separator';

export interface Props {
  onAddReview: () => void;
}
export const NoReviews: FunctionComponent<Props> = ({ onAddReview }: Props) => {
  const { t } = useTranslation();

  return (
    <Row align="middle" justify="center" className="no-reviews-wrapper">
      <Col>
        <h4>{t(NO_BODY_REVIEWED_THIS_PRODUCT)}</h4>
        <Separator vertical={7} />
        <Button className="custom-antd-btn" block onClick={onAddReview}>
          {t(BE_FIRST_REVIEWER)}
        </Button>
      </Col>
    </Row>
  );
};
