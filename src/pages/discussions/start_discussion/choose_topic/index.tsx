import { CloseOutlined } from '@ant-design/icons';
import { Input, Row } from 'antd';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroller';
import { Topic } from '../../../../API';
import { useMainContext } from '../../../../app/providers/main';
import icons from '../../../../assets/icons';
import discussionsIcons from '../../../../assets/icons/discussions';
import Separator from '../../../../components/separator';
import {
  CHOOSE_TOPIC,
  FEATURED_HOME_DISCUSSIONS,
  GET_HELP_FOR_YOUR_PROJECTS,
  LOADING,
} from '../../../../locales/strings';
import { toArrayOrEmpty } from '../../../idea/utils';
import { listDiscussionTopics } from '../../api';
const topicsLimit = 25;

interface Props {
  updateDiscussion: Function;
  topics: Topic[];
}
const ChooseTopic: FunctionComponent<Props> = (props: Props) => {
  const { i18n, t } = useTranslation();
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>(props.topics);
  const [filteredTopics, searchTopics] = useState<Topic[] | undefined>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { requestApi } = useMainContext();
  const ref = useRef();
  const { updateDiscussion } = props;
  const threeTopicsIsSelected = selectedTopics?.length == 3;
  const getTopics = (refresh: boolean = false) => {
    let prevTopicsList = topics;
    let currentOffset = offset;
    setLoading(true);
    if (refresh) {
      prevTopicsList = [];
      currentOffset = 0;
    }
    requestApi(
      listDiscussionTopics,
      { limit: topicsLimit, offset: currentOffset },
      (topicsList: Topic[], error: string) => {
        if (error) {
          return;
        }
        setTopics([...toArrayOrEmpty(prevTopicsList), ...toArrayOrEmpty(topicsList)]);
        searchTopics([...toArrayOrEmpty(prevTopicsList), ...toArrayOrEmpty(topicsList)]);
        setLoading(false);

        if (topicsList?.length == 0) {
          setHasMore(false);
          return;
        }
        setOffset(offset + topicsLimit);
      }
    );
  };

  const onNext = () => {
    !loading && getTopics();
  };

  const selectTopic = (topic: Topic) => {
    if (selectedTopics?.find((topic_) => topic_.id === topic.id)) {
      deleteTopic(topic);
    } else if (threeTopicsIsSelected) {
      return;
    } else {
      const newSelectedTopics = selectedTopics ? [topic, ...toArrayOrEmpty(selectedTopics)] : [topic];
      updateDiscussion('topics', newSelectedTopics);
      setSelectedTopics([...newSelectedTopics]);
    }
  };

  const deleteTopic = (topic: Topic) => {
    const newSelectedTopics = selectedTopics?.filter((tp) => tp.id !== topic.id);
    setSelectedTopics(newSelectedTopics);
    updateDiscussion('topics', newSelectedTopics);
  };

  useEffect(() => {
    getTopics(true);
  }, [i18n.language]);

  return (
    <div className="select-discussion-topic">
      <p className="what-are-you-working-text">{t(CHOOSE_TOPIC)}</p>
      <p className="get-help-text">{t(GET_HELP_FOR_YOUR_PROJECTS)}</p>
      <div className="search-input">
        <img src={icons.search.icon}></img>
        <Input
          placeholder={t(CHOOSE_TOPIC)}
          onChange={(event) => {
            const searchText = event.target.value;
            const filteredTopics = topics?.filter((topic: Topic) => {
              const isIncluded = topic?.title?.toLowerCase().includes(searchText?.toLowerCase());
              return isIncluded;
            });
            searchTopics(filteredTopics);
          }}
        />
      </div>
      <Row>
        {selectedTopics?.map((topic, i) => (
          <span key={i} className="selected-option-wrapper">
            <div className="selected-option" onClick={() => deleteTopic(topic)}>
              <CloseOutlined />
              {topic.title}
            </div>
            <Separator horizontal={5} />
          </span>
        ))}
      </Row>
      <div className="options-list">
        <br />
        {t(FEATURED_HOME_DISCUSSIONS)}
        <div className="topics-container" ref={(ref) => ref}>
          <InfiniteScroll
            initialLoad={false}
            pageStart={offset / topicsLimit}
            loadMore={onNext}
            hasMore={hasMore}
            useWindow={false}
            getScrollParent={ref.current}
            loader={
              loading ? (
                <Row justify="center" align="middle" key={'loader'}>
                  {t(LOADING)}
                </Row>
              ) : (
                <div></div>
              )
            }
          >
            {filteredTopics?.map?.((topic, i) => {
              const isSelected = selectedTopics?.find((selectedTopic) => selectedTopic.id === topic.id);

              return (
                <div
                  key={i}
                  className={`option ${threeTopicsIsSelected && !isSelected ? 'disabled' : ''}`}
                  onClick={() => selectTopic(topic)}
                >
                  <img src={isSelected ? discussionsIcons.checked.icon : discussionsIcons.un_checked.icon} />
                  &nbsp;&nbsp;
                  {topic.title}
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default ChooseTopic;
