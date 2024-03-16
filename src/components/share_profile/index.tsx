import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { COPY_DONE, SHARE, SHARE_PROFILE, SHARE_PROFILE_WITH_PEOPLE } from '../../locales/strings';

interface Props {
  link: string;
}

const ShareProfile: React.FC<Props> = ({ link }) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const { t } = useTranslation();
  const handleCopyProfileLinkToClipboard = () => {
    navigator.clipboard.writeText(link);
    setIsCopied(true);
  };

  return (
    <div className="share-profile">
      <div className="text">
        <span>{isCopied ? t(COPY_DONE) : t(SHARE_PROFILE_WITH_PEOPLE)}</span>
      </div>
      <div className="action">
        <button onClick={handleCopyProfileLinkToClipboard}>
          <PlusOutlined />
          {t(SHARE_PROFILE)}
        </button>
      </div>
    </div>
  );
};

export default ShareProfile;
