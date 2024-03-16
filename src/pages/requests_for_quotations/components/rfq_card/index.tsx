import React, { useState } from 'react';
import { aiIcons } from '../../../../assets/icons/ai';
import { useTranslation } from 'react-i18next';
import {
  CONTRACTING,
  CONTRACTING_TEXT,
  CREATE_A_PROJECT,
  CREATE_A_PROJECT_TEXT,
  DETERMINE_THE_BUDGET,
  DETERMINE_THE_BUDGET_TEXT,
  DETERMINE_THE_REQUIRED_SKILLS,
  DETERMINE_THE_REQUIRED_SKILLS_TEXT,
  DISCUSS_DETAILS,
  DISCUSS_DETAILS_TEXT,
  FOLLOW_THE_PROGRESS,
  FOLLOW_THE_PROGRESS_TEXT,
  MORE_INFO,
  NEW,
  POST_A_QUOTE,
  POST_A_QUOTE_TEXT,
  POST_NOW,
  PUBLISH_THE_PROJECT,
  PUBLISH_THE_PROJECT_TEXT,
  REQUEST_FOR_QUOTATION,
  REQUEST_FOR_QUOTATION_TEXT,
  REVIEW_OFFERS,
  REVIEW_OFFERS_TEXT,
  START_NOW,
  SUBMIT_A_PRICE_REQUEST,
} from '../../../../locales/strings';
import { getLayoutDirection } from '../../../../app/layouts';
import RfqModalImage from '../../../../assets/images/rfq-modal.svg';
import { Modal } from 'antd';
import { useHistory } from 'react-router-dom';
import { REQUEST_QUOTATION_SERVICE_ROUTE } from '../../../../utils/routes';
import MoreInfoBtn from './more_info_btn';
import { useMainContext } from '../../../../app/providers/main';
interface RfqCardProps {
  isHomeView?: boolean;
}

const RfqCard = (props: RfqCardProps) => {
  const { isHomeView = true } = props;
  const { t, i18n } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const history = useHistory();
  const { userState } = useMainContext();
  const isAuthenticated = userState.isAuthenticated;

  const handleToggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const handleRedirect = () => {
    if (isAuthenticated) {
      history.push(REQUEST_QUOTATION_SERVICE_ROUTE);
    } else {
      history.push('/login');
    }
  };

  return (
    <>
      {isHomeView ? (
        <div className="rfq-card-wrapper-main">
          <div className="rfq-card-wrapper">
            <div className="card-content">
              <img src={aiIcons.rfq_card} alt="" />
              <div className="card-main">
                <p className="title">
                  <span>{t(NEW)}</span>
                  {t(REQUEST_FOR_QUOTATION)}
                </p>
                <p className="subtitle"> {t(POST_A_QUOTE_TEXT)}</p>
              </div>
            </div>
            <div className="card-actions">
              <button onClick={handleRedirect}>{t(START_NOW)}</button>
              <MoreInfoBtn />
            </div>
          </div>
        </div>
      ) : (
        <div className="rfq-card-wrapper-main remove-bg">
          <div className="rfq-card-wrapper color-change">
            <div className="card-content">
              <img src={aiIcons.rfq_card_2} alt="" />
              <div className="card-main">
                <p className="title dark-color">
                  <span>{t(NEW)}</span>
                  {t(POST_A_QUOTE)}
                </p>
                <p className="subtitle color-dark "> {t(POST_A_QUOTE_TEXT)}</p>
              </div>
            </div>
            <div className="card-actions">
              <button className="dark-button" onClick={handleRedirect}>
                {t(POST_NOW)}
              </button>
              <MoreInfoBtn />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RfqCard;
