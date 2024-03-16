import React from 'react';
import { Row, Result, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { BACK_HOME, PAGE_404 } from '../../locales/strings';
import { HTTP_STATUS_404 } from '../../app/settings';
import { ApiResponse } from '../../app/providers/main';

interface Props {
  apiResponse: ApiResponse;
}

const mapApiResponseToHttpStatus = (status?: string) => {
  switch (status) {
    case HTTP_STATUS_404:
      return HTTP_STATUS_404;
    default:
      break;
  }
};

const mapApiResponseToTitle = (status?: string) => {
  switch (status) {
    case HTTP_STATUS_404:
      return PAGE_404;
    default:
      return '';
  }
};

const FailurePage = (props: Props) => {
  const { apiResponse } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const statusCode = apiResponse?.status;
  return (
    <Row justify="center" className="failure-page-container">
      <Result
        status={mapApiResponseToHttpStatus(statusCode)}
        title={mapApiResponseToHttpStatus(statusCode)}
        subTitle={t(mapApiResponseToTitle(statusCode))}
        extra={
          <Button
            type="primary"
            onClick={() => {
              history.push('/');
              history.go(0);
            }}
          >
            {t(BACK_HOME)}
          </Button>
        }
      />
    </Row>
  );
};

FailurePage.defaultProps = {
  apiResponse: {
    status: HTTP_STATUS_404,
  },
};

export default FailurePage;
