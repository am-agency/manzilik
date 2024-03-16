import React, { useRef } from 'react';
import { aiIcons } from '../../../../../assets/icons/ai';
import { useTranslation } from 'react-i18next';
import { COPY, COPY_DONE } from '../../../../../locales/strings';
import { useClient } from '../../../../../app/hooks/use_client';

function ReferralInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCopied, setIsCopied] = React.useState(false);
  const { t } = useTranslation();
  const { client } = useClient();

  const copyToClipboard = () => {
    if (inputRef.current) {
      setIsCopied(true);
      inputRef.current.select();
      document.execCommand('copy');
    }
  };

  return (
    <div className="input-container">
      <input ref={inputRef} type="text" value={client?.referral_url || ''} readOnly />
      <button onClick={copyToClipboard} className={isCopied ? 'copied' : ''}>
        <img src={isCopied ? aiIcons.check_green : aiIcons.copy} alt="" />
        <span>{isCopied ? t(COPY_DONE) : t(COPY)}</span>
      </button>
    </div>
  );
}

export default ReferralInput;
