import React, { useEffect } from 'react';
import { getLayoutDirection } from '../../../app/layouts';
import { useTranslation } from 'react-i18next';
import { ADD_ACCOUNT_POINTS } from '../../../locales/strings';
import UserHeaderAI from '../components/user_header';
import PackageDetails from './components/package_details';

function AiCheckout() {
  const { i18n, t } = useTranslation();

  return (
    <div
      className="ai-checkout-wrapper"
      style={{
        direction: getLayoutDirection(i18n.language),
      }}
    >
      <div className="ai-checkout-content">
        <UserHeaderAI title={t(ADD_ACCOUNT_POINTS)} />
        <PackageDetails />
      </div>
    </div>
  );
}

export default AiCheckout;
