import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ideaIcons } from '../../../../assets/icons/idea';
import {
  ACTIVITY,
  YOUR_POSTS,
  YOUR_COMMENTS,
  YOUR_TOPICS,
  EXPLORE_DISCUSSIONS,
  EXPLORE_ALL_DISCUSSIONS,
  FEATURED_HOME_DISCUSSIONS,
  FEATURED_GARDEN_DISCUSSIONS,
  SIGNUP_WITH_EMAIL,
  SIGNUP,
  NEW_TO_MANZILIK,
} from '../../../../locales/strings';
import icons from '../../../../assets/icons';
import { Button } from 'antd';
import { withUserAuthenticator } from '../../../../app/providers/user/with_user_authenticator';
import Separator from '../../../../components/separator';
import { useHistory } from 'react-router';
import { LOGIN_ROUTE } from '../../../../utils/routes';
import UserTopics from '../user_topics';
import { useMainContext } from '../../../../app/providers/main';
import { getUserDiscussionsCommentsCount, getUserDiscussionsCount } from '../../api';
import { useClient } from '../../../../app/hooks/use_client';
import { SharedStateContext, SharedStateInterface } from '../../../../context/shared_state_context';

interface Props {
  getDiscussionsList: (source?: 'user' | 'comment' | undefined) => void;
}

export const SideBoxTop = (props: Props) => {
  const { t } = useTranslation();
  const { requestApi } = useMainContext();
  const { getDiscussionsList } = props;
  const [commentsCount, setCommentsCount] = useState(0);
  const [discussionCount, setDiscussionsCount] = useState(0);
  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;

  const getUserDiscussionsCommentsCountFromApi = () => {
    requestApi(getUserDiscussionsCommentsCount, {}, (result: { total: number }, error: string) => {
      if (error) {
        return;
      }
      setCommentsCount(result.total);
    });
  };

  const getUserDiscussionsCountFromApi = () => {
    requestApi(getUserDiscussionsCount, { resourceId: client?.id }, (result: { total: number }, error: string) => {
      if (error) {
        return;
      }
      setDiscussionsCount(result.total);
    });
  };

  const getDiscussions = () => getDiscussionsList();

  const getUserDiscussions = () => getDiscussionsList('user');

  const getUserCommentedOnDiscussions = () => getDiscussionsList('comment');

  useEffect(() => {
    getUserDiscussionsCommentsCountFromApi();
    getUserDiscussionsCountFromApi();
  }, []);

  return (
    <div className="side-box-top">
      <p className="section-title">
        <strong>{t(ACTIVITY)}</strong>
      </p>
      <span className="icon section-item" onClick={getUserDiscussions}>
        <img src={icons.post.icon} /> &nbsp; {t(YOUR_POSTS)}
        <span className="comments-number-text">{discussionCount}</span>
      </span>
      <span className="section-item" onClick={getUserCommentedOnDiscussions}>
        <img src={ideaIcons.comment.icon} />
        &nbsp; {t(YOUR_COMMENTS)}
        <span className="comments-number-text">{commentsCount}</span>
      </span>
      <UserTopics getDiscussionsList={getDiscussions} client={client!} />
      <p className="section-title">{t(EXPLORE_DISCUSSIONS)}</p>
      <span className="icon section-item" onClick={getDiscussions}>
        <img src={icons.post.icon} /> &nbsp; {t(EXPLORE_ALL_DISCUSSIONS)}
      </span>
      <span className="section-item" onClick={getDiscussions}>
        <img src={icons.home.icon} />
        &nbsp; {t(FEATURED_HOME_DISCUSSIONS)}
      </span>
      <span className="section-item" onClick={getDiscussions}>
        <img src={icons.garden.icon} /> &nbsp;{t(FEATURED_GARDEN_DISCUSSIONS)}
      </span>
    </div>
  );
};

const NotAuthTopBox = () => {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <>
      <div className="side-box-top">
        <p className="section-title">
          <strong>{t(NEW_TO_MANZILIK)}</strong>
        </p>
        <span>{t(SIGNUP_WITH_EMAIL)}</span>
        <Separator vertical={7} />
        <span className="section-item">
          <Button
            type="primary"
            onClick={() => {
              history.push(LOGIN_ROUTE);
            }}
          >
            {t(SIGNUP)}
          </Button>
        </span>
      </div>
      <div className="side-box-top">
        <p className="section-title">{t(EXPLORE_DISCUSSIONS)}</p>
        <span className="icon section-item">
          <img src={icons.post.icon} /> &nbsp; {t(EXPLORE_ALL_DISCUSSIONS)}
        </span>
        <span className="section-item">
          <img src={icons.home.icon} />
          &nbsp; {t(FEATURED_HOME_DISCUSSIONS)}
        </span>
        <span className="section-item">
          <img src={icons.garden.icon} /> &nbsp;{t(FEATURED_GARDEN_DISCUSSIONS)}
        </span>
      </div>
    </>
  );
};

export default withUserAuthenticator(SideBoxTop, NotAuthTopBox);
