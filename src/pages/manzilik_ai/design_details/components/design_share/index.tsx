import React from 'react';
import { aiIcons } from '../../../../../assets/icons/ai';
import { useTranslation } from 'react-i18next';
import { DOWNLOAD, SHARE_AI, SHOW } from '../../../../../locales/strings';
interface DesignShareProps {
  setIsViewerOpen: (isViewerOpen: boolean) => void;
}

function DesignShare(props: DesignShareProps) {
  const { setIsViewerOpen } = props;
  const { t } = useTranslation();
  return (
    <div className="design-share-ai-wrapper">
      <div className="share-item" onClick={() => setIsViewerOpen(true)}>
        <img src={aiIcons.view} alt="" />
        <p>{t(SHOW)}</p>
      </div>
      {/* <div className="share-item">
        <img src={aiIcons.share} alt="" />
        <p>{t(SHARE_AI)}</p>
      </div> */}
      {/* <div className="share-item">
        <img src={aiIcons.download} alt="" />
        <p>{t(DOWNLOAD)}</p>
      </div> */}
    </div>
  );
}

export default DesignShare;
