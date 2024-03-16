import React from 'react';
import { useTranslation } from 'react-i18next';
import { Professional } from '../../../../../API';
import icons from '../../../../../assets/icons';
import SendRequestButton from '../../../../../components/send_request_button';

interface Props {
  item: Professional;
}

function ContactActions({ item: professional }: Props) {
  const { t } = useTranslation();
  const getWebsiteUrl = () => {
    const blog = professional?.client?.blog!;
    if (!blog?.includes('http')) {
      return blog?.replace(blog, `http://${blog}`);
    }
    return blog;
  };
  return (
    <div className="prof-actions">
      {professional?.client?.mobile && (
        <a href={`tel:${professional?.client?.mobile}`}>
          <img src={icons.prof_contact} alt="contact" />
        </a>
      )}
      {professional?.client?.blog && (
        <a href={`${getWebsiteUrl()}`} target="_blank" rel="noreferrer">
          <img src={icons.prof_website} alt="website" />
        </a>
      )}

      <SendRequestButton item={professional} />
    </div>
  );
}

export default ContactActions;
