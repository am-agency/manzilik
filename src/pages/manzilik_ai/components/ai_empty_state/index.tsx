import React from 'react';
import { useTranslation } from 'react-i18next';
import { START_UPLOAD_PHOTO, STUCK, WE_DO_THE_WORK } from '../../../../locales/strings';
import FormUploader from '../form_uploader';
import { aiIcons } from '../../../../assets/icons/ai';

interface AiEmptyStateProps {
  handleOpenUploadDialog: () => void;
}

const AiEmptyState = (props: AiEmptyStateProps) => {
  const { handleOpenUploadDialog } = props;
  const { t } = useTranslation();
  return (
    <div className="ai-empty-state">
      <div className="img-wrapper">
        <img src="https://makhzan-qa.manzilik.com/media/Category/حمام.jpg" alt="" />
        <img src="https://makhzan-qa.manzilik.com/media/Category/حمام.jpg" alt="" />
      </div>
      <div className="empty-uploader" onClick={handleOpenUploadDialog}>
        <div className="empty-uploader-wrapper">
          <img src={aiIcons.addImage} alt="" />
          <p className="empty-uploader-title">{t(START_UPLOAD_PHOTO)}</p>
        </div>
      </div>
      <div className="empty-content">
        <p className="empty-title">{t(WE_DO_THE_WORK)}</p>
        <p className="empty-subtitle">{t(STUCK)}</p>
      </div>
    </div>
  );
};

export default AiEmptyState;
