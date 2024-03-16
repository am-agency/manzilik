import { Row } from 'antd';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Client, Topic } from '../../../../API';
import { useMainContext } from '../../../../app/providers/main';
import { ModalTitle } from '../../../../components/modal_title';
import { THE_DISCUSSIONS, WHAT_ARE_YOUR_INTERESTS, YOUR_TOPICS } from '../../../../locales/strings';
import { checkFirstOpenDiscussionPage } from '../../../../utils';
import { listInterestedTopics } from '../../api';
import { DiscussionTopics } from '../../forms/discussion_topics';
import { DiscussionWelcome } from '../../forms/discussion_welcome';
import { TagsList } from '../../../../components/tags_list';
import icons from '../../../../assets/icons';
import { useModal } from '../../../../app/providers/modal';
import { useHistory, useLocation } from 'react-router-dom';

interface Props {
  getDiscussionsList: () => void;
  client: Client;
}

const UserTopics: FunctionComponent<Props> = (props: Props) => {
  const { getDiscussionsList, client } = props;
  const { i18n, t } = useTranslation();
  const { showModal } = useModal();
  const { requestApi, userState } = useMainContext();
  const [selectedTopicValues, setSelectedTopicValues] = useState<Topic[]>([]);
  const history = useHistory();
  const { pathname } = useLocation();
  const selectedTopicIndex = selectedTopicValues.findIndex((val, index) => pathname.includes(val?.id!));

  const onUpdateTagsValue = (values: Topic[]) => {
    setSelectedTopicValues(values);
    history.push('/discussions');
  };

  const onUpdateTopics = () => {
    showModal(
      <ModalTitle title={t(WHAT_ARE_YOUR_INTERESTS)} />,
      <DiscussionTopics onUpdateTagsValue={onUpdateTagsValue} getDiscussionsList={getDiscussionsList} />,
      'modal-wrapper discussion-topics-modal',
      '',
      <div />
    );
  };

  const getInterestedTopics = () => {
    requestApi(
      listInterestedTopics,
      { resourceId: client?.id, offset: 0, limit: 100 },
      (response: Topic[], error: string) => {
        if (error) {
          return;
        }
        if (response.length === 0) {
          showTopicsModal();
          return;
        }
        setSelectedTopicValues(response);
        // getDiscussionsList();
      }
    );
  };

  const showTopicsModal = () => {
    showModal(
      <ModalTitle />,
      <DiscussionWelcome onUpdateTagsValue={onUpdateTagsValue} />,
      'modal-wrapper discussion-welcome-modal',
      '',
      <div />
    );
  };

  useEffect(() => {
    const isFirstOpenPage = checkFirstOpenDiscussionPage();
    if (
      !isFirstOpenPage &&
      selectedTopicValues.length !== 0 &&
      userState.isAuthenticated &&
      pathname.includes('discussions')
    ) {
      showTopicsModal();
    }
  }, []);

  useEffect(() => {
    getInterestedTopics();
  }, [i18n.language]);

  return (
    <>
      <Row justify="space-between">
        <p className="section-title">{t(THE_DISCUSSIONS)}</p>
        <img className="icon" src={icons.settingsNoBackground.icon} onClick={onUpdateTopics} />
      </Row>
      <TagsList
        className="topic-tags"
        tags={selectedTopicValues.map((elm) => elm && elm.title!)}
        selectedTags={[selectedTopicIndex]}
        onTagSelect={(index: number) => {
          if (selectedTopicIndex === index) {
            return history.push('/discussions');
          } else {
            return history.push('/discussions/' + selectedTopicValues[index].id);
          }
        }}
      />
    </>
  );
};

export default UserTopics;
