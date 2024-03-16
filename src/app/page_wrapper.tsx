import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Auth } from 'aws-amplify';
import { useFeature, useFeatures, Feature } from 'flagged';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, useHistory, useLocation, withRouter } from 'react-router-dom';
import { FullSpinnerComponent } from '../components/full_spinner';
import FailurePage from '../components/page_not_found';
import { loadLayoutByName, LayoutTypes, getLayoutDirection } from './layouts';
import { useMainContext } from './providers/main';
import { loginActionCreator, logoutActionCreator } from './providers/main/actions';
import { useModal } from './providers/modal';
import { ECOMMERCE_FEATURE, HTTP_STATUS_401, HTTP_STATUS_404 } from './settings';

interface Props {
  Component: React.ComponentClass;
  layout: LayoutTypes;
  path: string | string[];
  enabledFeatures: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WrapperRoute: React.FunctionComponent<any> = (props: Props) => {
  const { Component, layout, path, enabledFeatures } = props;

  const Layout = loadLayoutByName(layout);
  const location = useLocation();
  const { apiResponse, setApiResponse, dispatchUser } = useMainContext();
  const { i18n } = useTranslation();
  const is404Response = apiResponse?.status === HTTP_STATUS_404;
  const { setModalVisible } = useModal();
  const history = useHistory();
  const features = useFeatures();

  useEffect(() => {
    try {
      setModalVisible?.(false);
      setApiResponse({});
      window.scrollTo(0, 0);
      setApiResponse({});
    } catch (error) {}
  }, [location]);

  useEffect(() => {
    if (apiResponse.status == HTTP_STATUS_401) {
      try {
        Auth.currentSession().then(() => {
          dispatchUser(logoutActionCreator());
          history.push('/');
        });
      } catch (error) {
        history.push('/');
        dispatchUser(logoutActionCreator());
      }
    }
  }, [apiResponse.status]);

  const isFeatureEnabled = () => {
    if (enabledFeatures) {
      return enabledFeatures?.every((elm) => features[elm]);
    }
    return true;
  };

  return (
    <Route
      path={path}
      render={(props) => {
        return (
          <div className={getLayoutDirection(i18n.language)}>
            {isFeatureEnabled() ? (
              <Layout>{is404Response ? <FailurePage apiResponse={apiResponse} /> : <Component {...props} />}</Layout>
            ) : (
              <Layout>
                <FailurePage />
              </Layout>
            )}
          </div>
        );
      }}
    />
  );
};

export default withRouter(WrapperRoute);

WrapperRoute.defaultProps = {
  layout: LayoutTypes.DEFAULT,
};
