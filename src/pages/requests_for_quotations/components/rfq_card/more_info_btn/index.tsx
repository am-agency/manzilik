import React, { useState } from 'react';
import { aiIcons } from '../../../../../assets/icons/ai';
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
  PUBLISH_THE_PROJECT,
  PUBLISH_THE_PROJECT_TEXT,
  REVIEW_OFFERS,
  REVIEW_OFFERS_TEXT,
  START_NOW,
  SUBMIT_A_PRICE_REQUEST,
} from '../../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { getLayoutDirection } from '../../../../../app/layouts';
import { Modal } from 'antd';
import RfqModalImage from '../../../../../assets/images/rfq-modal.svg';
import { REQUEST_QUOTATION_SERVICE_ROUTE } from '../../../../../utils/routes';
import { useHistory } from 'react-router-dom';
import { useMainContext } from '../../../../../app/providers/main';
interface MoreInfoBtnProps {
  isBtnDisabled?: boolean;
}

function MoreInfoBtn(props: MoreInfoBtnProps) {
  const { isBtnDisabled = false } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { t, i18n } = useTranslation();
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
      <button onClick={handleToggleModal}>
        <img src={aiIcons.more_details} alt="" />
        {t(MORE_INFO)}
      </button>
      <Modal
        visible={isModalVisible}
        footer={false}
        onCancel={handleToggleModal}
        className={`${getLayoutDirection(i18n.language)} rfq-modal`}
        width="371px"
      >
        <div className="header">
          <img src={RfqModalImage} alt="" />
          <p className="title">{t(SUBMIT_A_PRICE_REQUEST)}</p>
          <p className="detail-item-create">
            <strong>{`${t(CREATE_A_PROJECT)} `}</strong>
            <span>{t(CREATE_A_PROJECT_TEXT)}</span>
          </p>
        </div>
        {!isBtnDisabled ? (
          <div className="action-button" onClick={handleRedirect}>
            <button> {t(START_NOW)}</button>
          </div>
        ) : null}

        <div className="rfq-details">
          <p className="detail-item">
            <strong>{`${t(DETERMINE_THE_REQUIRED_SKILLS)} `}</strong>

            <span>{t(DETERMINE_THE_REQUIRED_SKILLS_TEXT)}</span>
          </p>
          <p className="detail-item">
            <strong>{`${t(DETERMINE_THE_BUDGET)} `}</strong>

            <span>{t(DETERMINE_THE_BUDGET_TEXT)}</span>
          </p>
          <p className="detail-item">
            <strong> {`${t(PUBLISH_THE_PROJECT)} `}</strong>

            <span>{t(PUBLISH_THE_PROJECT_TEXT)}</span>
          </p>
          <p className="detail-item">
            <strong>{`${t(REVIEW_OFFERS)} `}</strong>

            <span>{t(REVIEW_OFFERS_TEXT)}</span>
          </p>
          <p className="detail-item">
            <strong> {`${t(DISCUSS_DETAILS)} `}</strong>

            <span>{t(DISCUSS_DETAILS_TEXT)}</span>
          </p>
          <p className="detail-item">
            <strong>{`${t(CONTRACTING)} `}</strong>

            <span>{t(CONTRACTING_TEXT)}</span>
          </p>
          <p className="detail-item">
            <strong>{`${t(FOLLOW_THE_PROGRESS)} `}</strong>

            <span>{t(FOLLOW_THE_PROGRESS_TEXT)}</span>
          </p>
        </div>
      </Modal>
    </>
  );
}

export default MoreInfoBtn;
