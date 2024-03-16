import { Row } from 'antd';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Avatar from '../../../../components/avatar';
import { BE_FIRST_TO_COMMENT } from '../../../../locales/strings';
import { replaceSpaceWithDash } from '../../../../utils';
import { DISCUSSION_ROUTE } from '../../../../utils/routes';
import { Discussion } from '../discussion_card';

interface Props {
  discussion?: Discussion | null;
}

export const UsersIcon: FunctionComponent<Props> = ({ discussion }: Props) => {
  const { t } = useTranslation();
  const remainingComments = discussion?.comments_count! - (discussion?.latest_two_commenters?.length || 0);
  return (
    <div className="users-icons-wrapper">
      {discussion?.comments_count === 0 ? (
        <Link
          to={DISCUSSION_ROUTE + '/' + replaceSpaceWithDash(discussion?.title!) + '/' + discussion.id + '#comments'}
        >
          {t(BE_FIRST_TO_COMMENT)}
        </Link>
      ) : (
        <>
          {discussion?.latest_two_commenters?.map((client) => (
            <Avatar className="users-icon" key={client.id} size={25} src={client.profile_image} />
          ))}
          {remainingComments > 0 && <Row className="comments-number-wrapper">+{remainingComments}</Row>}
        </>
      )}
    </div>
  );
};
