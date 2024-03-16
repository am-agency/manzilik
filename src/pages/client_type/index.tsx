import React, { useEffect } from 'react';
import icons from '../../assets/icons';
import { useTranslation } from 'react-i18next';
import { getLayoutDirection } from '../../app/layouts';
import {
  CLIENT_TYPE_TEXT,
  CONTINUE_HOME_OWNER,
  CONTINUE_PROFESSIONAL,
  HOME_OWNER,
  PROFESSIONAL,
  PROF_TYPE_TEXT,
  RIGHT_DESCRIPTION,
  SERVICE_PROVIDER2,
  SPECIFY_ACCOUNT_TYPE,
} from '../../locales/strings';
import { useMainContext } from '../../app/providers/main';
import { UserType, completeClientRegistration } from '../auth/login/api';
import { Client } from '../../API';
import { useHistory } from 'react-router-dom';
import * as analytics from '../../analytics';

function ClientTypePage() {
  const { i18n, t } = useTranslation();
  const { requestApi } = useMainContext();
  const history = useHistory();
  const cognitoUser = JSON.parse(localStorage.getItem('cognitoUser') || '{}');
  const referee_referral_code = localStorage.getItem('referee_referral_code')
    ? JSON.parse(localStorage.getItem('referee_referral_code') || '')
    : '';

  useEffect(() => {
    analytics.PublishEvent(new analytics.AnalyticsViewAccountTypeEvent(cognitoUser?.id!));
  }, []);

  const onSelectType = (type: UserType) => {
    requestApi(
      completeClientRegistration,
      {
        user_type: type,
        referral_code: referee_referral_code,
      },
      (response: Client, error: string) => {
        if (error) {
          return;
        }
        history.push('/');

        localStorage.setItem('clientType', response?.type!);
        localStorage.setItem('isProf', response?.type === UserType.PROFESSIONAL ? 'true' : 'false');
        analytics.PublishEvent(new analytics.AnalyticsSelectAccountTypeEvent(type, response?.id!));
        window.location.reload();
      }
    );
  };
  return (
    <div
      className="client-type-wrapper"
      style={{
        direction: getLayoutDirection(i18n.language),
      }}
    >
      <img src={icons.question_mark} alt="question mark" />
      <p className="client-type-title">{t(RIGHT_DESCRIPTION)}</p>
      <p className="client-type-subtitle">{t(SPECIFY_ACCOUNT_TYPE)}</p>
      <div className="client-type-item">
        <div className="client-type">
          <img src={icons.house_client} alt="" />
          <p>{t(HOME_OWNER)}</p>
        </div>
        <p className="client-type-description">{t(CLIENT_TYPE_TEXT)}</p>
        <button
          onClick={() => {
            onSelectType(UserType.HOMEOWNER);
          }}
        >
          {t(CONTINUE_HOME_OWNER)}
        </button>
      </div>
      <div className="client-type-item">
        <div className="client-type">
          <img src={icons.house_prof} alt="" />
          <p>
            {t(SERVICE_PROVIDER2)}
            <span className="professional">({t(PROFESSIONAL)})</span>
          </p>
        </div>
        <p className="client-type-description">{t(PROF_TYPE_TEXT)}</p>
        <button
          onClick={() => {
            onSelectType(UserType.PROFESSIONAL);
          }}
        >
          {t(CONTINUE_PROFESSIONAL)}
        </button>
      </div>
    </div>
  );
}

export default ClientTypePage;
