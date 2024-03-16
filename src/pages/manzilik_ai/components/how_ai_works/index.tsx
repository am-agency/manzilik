import React, { useEffect } from 'react';
import { HOW_AI_WORKS } from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { aiIcons } from '../../../../assets/icons/ai';
import { useHistory } from 'react-router-dom';
import * as analytics from '../../../../analytics';

function HowAiWorks() {
  const { t } = useTranslation();
  const history = useHistory();
  const pathName = history.location.pathname;
  const currentScreen = pathName.includes('manzilik-ai') ? 'GenerateForm' : 'MyDesigns';

  useEffect(() => {
    analytics.PublishEvent(new analytics.AnalyticsHowAIWorksEvent(currentScreen));
  }, [currentScreen]);

  return (
    <div className="how-ai-work" onClick={() => history.push('/how-manzilik-ai-works')}>
      <img src={aiIcons.question} />
      <p>{t(HOW_AI_WORKS)}</p>
    </div>
  );
}

export default HowAiWorks;
