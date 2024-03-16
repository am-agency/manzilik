/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rate } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { SEND_NOW, SMART_DESIGN, THANKS_FOR_RATE } from '../../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { useMainContext } from '../../../../../app/providers/main';
import { rateAIDesign } from '../../../api';
import { ManzilikAiContext, ManzilikAiProps } from '../../../manzilik_ai_context';
import { aiIcons } from '../../../../../assets/icons/ai';
import * as analytics from '../../../../../analytics';

function DesignRating() {
  const { t } = useTranslation();
  const { requestApi } = useMainContext();
  const selectedDesign = JSON.parse(localStorage.getItem('selectedDesign') || '{}');
  const [count, setCount] = useState(0);
  const [isRatingSuccess, setIsRatingSuccess] = useState(false);

  const onSendRating = (count: number) => {
    setIsRatingSuccess(false);
    requestApi(
      rateAIDesign,
      {
        imageId: selectedDesign?.id!,
        rating: count,
        comments: 'Submitted from ManzilikAI',
      },
      (response: any, error: any) => {
        if (error) {
          return;
        }
        setIsRatingSuccess(true);
      }
    );
    analytics.PublishEvent(new analytics.AnalyticsRateAIDesignEvent(count));
  };

  return (
    <div className="design-rating-wrapper">
      <p className="rating-title">{t(SMART_DESIGN)}</p>
      <div className="rating-main">
        {isRatingSuccess ? (
          <div className="rating-success">
            <img src={aiIcons.success} alt="" />
            <p>{t(THANKS_FOR_RATE)}</p>
          </div>
        ) : (
          <>
            <div className="rating-stars">
              <Rate
                onChange={(value) => {
                  setCount(value);
                }}
                value={count}
              />
            </div>
            <button
              className={count === 0 ? 'disabled' : ''}
              disabled={count === 0}
              onClick={() => onSendRating(count)}
            >
              {t(SEND_NOW)}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default DesignRating;
