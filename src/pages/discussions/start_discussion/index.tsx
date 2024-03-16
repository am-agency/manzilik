/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserOutlined } from '@ant-design/icons';
import { Row, Avatar, Input, Button, Popover, message } from 'antd';
import {
  HI,
  WHAT_ARE_YOU_WORKING_ON,
  GET_HELP_FOR_YOUR_PROJECTS,
  START_A_DISCUSSION,
  CANCEL,
  ADD_PHOTO_FOR_BETTER_ANSWERS,
  ADD_POST,
  PREV,
  NEXT,
  POLL_MUST_HAVE_TWO,
  TITLE_AND_DESC_NEEDS_TO_BE_15,
  CHOOSE_TOPIC,
  REQUIRED,
  SEND,
  TITLE_INVALID_CHARS,
} from '../../../locales/strings';
import { checkEmptyString, getUserName, replaceSpaceWithDash } from '../../../utils';
import icons from '../../../assets/icons';
import { useTranslation } from 'react-i18next';
import React, { FunctionComponent, useState } from 'react';
import QuillEditor from './quill_editor';
import { Client } from '../../../API';
import discussionsIcons from '../../../assets/icons/discussions';
import { getLayoutDirection } from '../../../app/layouts';
import ChooseTopic from './choose_topic';
import Separator from '../../../components/separator';
import { addDiscussion } from '../api';
import { useMainContext } from '../../../app/providers/main';
import { Discussion } from '../types';
import { isOptionEmpty } from './add_poll';
import { PopoverPlacement } from '../../../components/dropdown_popover/types';
import { useHistory } from 'react-router';
import { DISCUSSION_ROUTE, LOGIN_ROUTE } from '../../../utils/routes';
import { v4 as uuid } from 'uuid';
import { uploadAsset } from '../../../utils/assets_manager';
import { MakhzanDestination } from '../../project/upload_idea';
import { toArrayOrEmpty } from '../../idea/utils';
import { ModalTitle } from '../../../components/modal_title';
import { useModal } from '../../../app/providers/modal';
import * as analytics from '../../../analytics';

interface Props {
  client?: Client;
  userName: string;
  toggleStartDiscussion: Function;
  getDiscussionsList: Function;
}

const StartDiscussion: FunctionComponent<Props> = (props: Props) => {
  const { client, toggleStartDiscussion } = props;
  const { i18n, t } = useTranslation();
  const history = useHistory();
  const [step, setStep] = useState(0);
  const [addPoll, togglePoll] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [discussion, updateDiscussion] = useState<Discussion>();
  const { title, description } = discussion || {};
  const { requestApi, userState, userName } = useMainContext();
  const { showModal } = useModal();
  const polls = discussion?.polls?.filter((opt) => !isOptionEmpty(opt)) || [];

  const onDiscussionChange = (attr: string, val: any) => {
    updateDiscussion({
      ...(discussion || {}),
      [attr]: val,
    });
  };

  const onDiscussionSubmit = async () => {
    if (step === 0) {
      const titleHasInvalidChars = title?.match(/[\(\)]/);
      if (title && titleHasInvalidChars) {
        setError(t(TITLE_INVALID_CHARS));
        return;
      }
      if (!title || title?.length! < 15 || !description || description?.length! < 15) {
        setError(t(TITLE_AND_DESC_NEEDS_TO_BE_15));
        return;
      } else if (
        (addPoll && (!polls || polls?.length! < 2)) ||
        polls.some((poll) => !poll?.title || poll.title == '')
      ) {
        setError(t(POLL_MUST_HAVE_TWO));
        return;
      } else {
        setError('');
        setStep(1);
        return;
      }
    } else if (step === 1) {
      if (!discussion?.topics || discussion?.topics?.length === 0) {
        message.destroy();
        message.error(t(CHOOSE_TOPIC));
        return;
      }
    }

    if (polls?.length) {
      const uploadPollPhotos = polls?.map((poll, index) => {
        if (poll.file) {
          return requestApi(
            uploadAsset,
            {
              file: poll.file.originFileObj,
              file_name: uuid(),
              content_type: poll.file.type,
              destination: MakhzanDestination.GENERAL,
            },
            async (url: string, error: string) => {
              if (error) {
                return;
              }
              if (polls[index]) {
                polls[index].photo_url = url;
                delete polls[index].file;
              }
              onDiscussionChange('polls', polls);
            }
          );
        }
      });
      await Promise.all(uploadPollPhotos);
    }
    if (!userState.isAuthenticated) {
      showModal(<ModalTitle />, <div />, '', '');
      return;
    }
    requestApi(
      addDiscussion,
      {
        ...discussion,
        topics: discussion?.topics?.length ? discussion?.topics?.map((tp) => tp.id) : undefined,
        polls: polls?.length ? JSON.stringify(polls) : undefined,
      },
      (res: Discussion, error: string) => {
        if (error) {
          return;
        }
        toggleStartDiscussion(false);
        analytics.PublishEvent(new analytics.AnalyticsStartDiscussionEvent());
        history.push(`${DISCUSSION_ROUTE}/${replaceSpaceWithDash(res?.title!)}/${res.id}`);
      }
    );
  };

  return (
    <div className={`start-discussion ${getLayoutDirection(i18n.language)}`}>
      <br />
      {step !== 1 && (
        <>
          <p className="hi-text">{`${t(HI)} ${userName}`}</p>
          <p className="what-are-you-working-text">{t(WHAT_ARE_YOU_WORKING_ON)}</p>
          <p className="get-help-text">{t(GET_HELP_FOR_YOUR_PROJECTS)}</p>
          <Row justify="center">
            <div className="avatar-start-discussion-wrapper">
              <Avatar size={50} src={client?.profile_image} icon={<UserOutlined />} />
              <Separator horizontal={11} vertical={0} />
              <div className={`start-discussion-input ${error ? 'error' : ''}`}>
                <img src={icons.post.icon} />
                <Input
                  autoFocus
                  placeholder={t(START_A_DISCUSSION)}
                  value={discussion?.title}
                  onChange={async (e) => {
                    try {
                      message.destroy();
                      await checkEmptyString(
                        e.target.value,
                        (val: string) => {
                          onDiscussionChange('title', val);
                        },
                        t(REQUIRED)
                      );
                    } catch (error) {
                      message.error(t(REQUIRED));
                    }
                  }}
                />
              </div>
            </div>
          </Row>
        </>
      )}
      <Row justify="center">
        {step !== 1 && (
          <Popover visible={error ? true : false} placement={PopoverPlacement.BOTTOM} content={error}>
            <div className={`editor-wrapper ${getLayoutDirection(i18n.language)} ${error ? 'error' : ''}`}>
              <QuillEditor
                withPoll={false}
                togglePoll={togglePoll}
                addPoll={addPoll}
                updateDiscussion={onDiscussionChange}
                discussion={discussion}
              />
            </div>
          </Popover>
        )}
        {step === 1 && (
          <ChooseTopic updateDiscussion={onDiscussionChange} topics={toArrayOrEmpty(discussion?.topics)} />
        )}
        <Row justify="space-between" align="middle" className="footer">
          <span className="tip">
            <img src={discussionsIcons.tip.icon} />
            &nbsp;
            {t(ADD_PHOTO_FOR_BETTER_ANSWERS)}
          </span>
          <span>
            <Button
              onClick={() => {
                if (step === 0) {
                  toggleStartDiscussion(false);
                  return;
                }
                setStep(0);
              }}
            >
              {step !== 1 ? t(CANCEL) : t(PREV)}
            </Button>
            &nbsp;&nbsp;
            <Button type="primary" htmlType="submit" onClick={onDiscussionSubmit}>
              {step !== 1 ? t(NEXT) : t(ADD_POST)}
            </Button>
          </span>
        </Row>
      </Row>
    </div>
  );
};

export default StartDiscussion;
