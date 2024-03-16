/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import SuggestedDesigns from '../components/suggested_designs';
import { ManzilikAiContext, ManzilikAiProps, ManzilikViews } from '../manzilik_ai_context';
import AILoader from '../../../assets/gifs/Loading.gif';
import { useMainContext } from '../../../app/providers/main';
import { API } from 'aws-amplify';
import { graphqlAuthenticationOperation } from '../../../utils';
import { imageProcessed } from '../../../custom_graphql/subscriptions';
import { useHistory, useParams } from 'react-router-dom';
import { getLayoutDirection } from '../../../app/layouts';
import { useTranslation } from 'react-i18next';
import { DESIGN_IN_PROGRESS } from '../../../locales/strings';
import * as analytics from '../../../analytics';

const AIResults = () => {
  const { currentView, setCurrentView, selectedDesignObject, listOfImages, setListOfImages } = useContext(
    ManzilikAiContext
  ) as ManzilikAiProps;

  const [message, setMessage] = useState('');

  const { i18n, t } = useTranslation();
  const history = useHistory();
  const pathName = history.location.pathname;
  const id = pathName.split('/')[2];

  useEffect(() => {
    analytics.PublishEvent(new analytics.AnalyticsViewResultsAIEvent());
  }, []);

  useEffect(() => {
    if (!selectedDesignObject?.id) {
      return;
    }
    const subscription = (
      API.graphql(graphqlAuthenticationOperation(imageProcessed, { outstandingId: selectedDesignObject?.id })) as any
    ).subscribe({
      next: (eventData: any) => {
        const imageNotification = eventData.value.data.imageProcessed;
        if (!imageNotification.error) {
          setCurrentView!(ManzilikViews.SUGGESTED_VIEW);
          setListOfImages!(imageNotification.recommendedImages);
        } else {
          setMessage(imageNotification.error);
        }
      },
      error: (error: never) => console.error("Can't subscrib", error),
    });

    // Cleanup subscription on component unmount
    return () => subscription.unsubscribe();
  }, [selectedDesignObject?.id]);

  return (
    <div
      style={{
        direction: getLayoutDirection(i18n.language),
      }}
    >
      {currentView === ManzilikViews.SUGGESTED_VIEW ? (
        <SuggestedDesigns listImages={listOfImages!} />
      ) : (
        <div className="loader-container">
          <div className="ai_loader">
            <img src={AILoader} />
            <p>{t(DESIGN_IN_PROGRESS)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIResults;
