import React, { useContext, useEffect } from 'react';
import { Package } from '../../../types';
import { CreditCheckout } from './credit_checkout';
import { GET_IT_NOW, MOST_REQUESTED, POINT, SAR } from '../../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ManzilikAiContext, ManzilikAiProps } from '../../../manzilik_ai_context';
import * as analytics from '../../../../../analytics';
import { CheckoutTypes } from '../../../../../constants';

interface PackageCardProps {
  isMostRequested?: boolean;
  item: Package;
  cardType?: 'redirect' | 'normal';
  setPackageId?: (id: string) => void;
  selectedPackageId?: string | null;
}

function PackageCard(props: PackageCardProps) {
  const { isMostRequested = false, cardType = 'normal', item, setPackageId, selectedPackageId } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const { setSelectedPackage } = useContext(ManzilikAiContext) as ManzilikAiProps;
  const screen = history.location.pathname.includes('ai-checkout') ? 'PurchasePackage' : 'GeneratedResult';

  const handleSelectPackage = () => {
    if (cardType === 'redirect') {
      history.push('/ai-checkout');
    }
    setPackageId!(item.id);
    setSelectedPackage!(item);
    localStorage.setItem('selectedPackage', JSON.stringify(item));
    analytics.PublishEvent(new analytics.AnalyticsSelectPackageEvent(screen, item.price, item.credit_amount));
    if (screen === 'PurchasePackage') {
      analytics.PublishEvent(
        new analytics.AnalyticsInitiateCreditPurchaseAIEvent(screen, item.price, item.credit_amount)
      );
    }
  };

  useEffect(() => {
    analytics.PublishEvent(new analytics.AnalyticsViewPackagesAIEvent(screen));
  }, [screen]);

  return (
    <>
      <div className="package-card">
        <div className="package-card-left">
          {isMostRequested && <p className="package-card-label"> {t(MOST_REQUESTED)}</p>}
          <p className="package-card-title">
            {item.credit_amount} <span>{t(POINT)}</span>
          </p>
          <p className="package-card-price">
            {`${item.discount > 0 ? item.discount : item.price} ${t(SAR)} `}
            {item.discount === 0 ? null : <span>{`${item.price} ${t(SAR)}`}</span>}
          </p>
        </div>
        <div className="package-card-right">
          <button
            className={`package-card-button ${selectedPackageId === item.id ? 'disabled' : ''}`}
            onClick={handleSelectPackage}
          >
            {t(GET_IT_NOW)}
          </button>
        </div>
      </div>
      {selectedPackageId === item.id && (
        <CreditCheckout selectedPackageId={selectedPackageId!} checkoutType={CheckoutTypes.MANZILIK_AI} />
      )}
    </>
  );
}

export default PackageCard;
