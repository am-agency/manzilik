import React, { useContext } from 'react';
import AvatarCard from '../../../../../../components/avatar_card';
import { PROFESSIONAL, SAR } from '../../../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import StartChatButton from '../../../../../../components/custom_button';
import MessageIcon from '../../../../../../icons/message_icon';
import TextWithIcon from '../../../../../../components/text_with_icon';
import { profileIcons } from '../../../../../../assets/icons/profile';
import { RfqContext, RfqProps } from '../../../../requests_for_quotations_context';
import icons from '../../../../../../assets/icons';
import { getTimeFormatBasedOnLanguage } from '../../../../../idea/utils';

interface CardProps {
  avatarUrl?: string;
  buttonText?: string;
  text?: string;
}

const DescriptionCard: React.FC<CardProps> = ({ avatarUrl, buttonText = 'test2', text = 'test' }) => {
  const { t } = useTranslation();
  const { selectedRfq } = useContext(RfqContext) as RfqProps;

  return (
    <div className="description_card">
      <div className="card-header">
        <AvatarCard
          imageUrl={selectedRfq?.sender?.profile_image! || icons.user.icon}
          name={`${selectedRfq?.sender?.first_name} ${selectedRfq?.sender?.last_name}`}
          rateFontSize={'10px'}
          onNameClick={() => {
            return;
          }}
        />
        <StartChatButton isCircular icon={<MessageIcon color="#464774" />} quotationId={selectedRfq?.id!} />
      </div>
      <div className="horizontal-divider"></div>
      <div className="card-body">{selectedRfq?.description}</div>
      <div className="card-footer">
        <TextWithIcon icon={profileIcons.tag2} text={`${selectedRfq?.budget_limits} ${t(SAR)}`} />
        <TextWithIcon icon={profileIcons.time} text={getTimeFormatBasedOnLanguage(selectedRfq?.created_at!)} />
      </div>
    </div>
  );
};

export default DescriptionCard;
