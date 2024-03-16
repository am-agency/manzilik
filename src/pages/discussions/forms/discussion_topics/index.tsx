import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react';
import { Form, Input, Typography, Checkbox, Button, Row, Col, Tag, message, Divider } from 'antd';

import icons from '../../../../assets/icons';

import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../app/providers/modal';
import { useMainContext } from '../../../../app/providers/main';

import {
  YOUR_TOPICS,
  FIND_HOME_AND_GARDEN_TOPICS,
  FOLLOW_AT_LEAST_ONE_TOPIC,
  DONE,
  SELECTED,
  CHOOSE_TOPIC,
  LOADING,
  DISCUSSION,
  DISCUSSIONS_SEARCH,
} from '../../../../locales/strings';

import { listDiscussionTopics, saveInterestedTopic, listInterestedTopics } from '../../api';
import { Topic } from '../../../../API';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useClient } from '../../../../app/hooks/use_client';
import { toArrayOrEmpty } from '../../../idea/utils';
import InfiniteScroll from 'react-infinite-scroller';
import { SharedStateContext, SharedStateInterface } from '../../../../context/shared_state_context';
const topicsLimit = 25;
interface Props {
  onUpdateTagsValue: Function;
  getDiscussionsList?: () => void;
}
export const DiscussionTopics: FunctionComponent<Props> = ({ onUpdateTagsValue, getDiscussionsList }: Props) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [defaultTopics, setDefaultTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const { t, i18n } = useTranslation();
  const { setModalVisible } = useModal();
  const { requestApi } = useMainContext();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const ref = useRef();
  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;

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
        const newTopicsList = toArrayOrEmpty(prevTopicsList).concat(toArrayOrEmpty(topicsList));
        setTopics(newTopicsList);
        setDefaultTopics(newTopicsList);
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

  const getInterestedTopics = () => {
    requestApi(
      listInterestedTopics,
      { resourceId: client?.id, offset: 0, limit: 100 },
      (response: Topic[], error: string) => {
        if (error) {
          return;
        }
        const ids = response.map((elm) => elm.id!);
        setSelectedTopics(ids);
      }
    );
  };

  const onChange = (e: CheckboxChangeEvent) => {
    const { value } = e.target;
    if (!selectedTopics.includes(value)) {
      setSelectedTopics((prevTopic) => [...prevTopic, e.target.value]);
    } else {
      const filteredValues = selectedTopics?.filter((e) => e !== value);
      setSelectedTopics(filteredValues);
    }
  };

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchedValues = defaultTopics.filter(
      // get searched result based on each character matching
      (value) => value.title && value.title!.toUpperCase().indexOf(event.target.value.toUpperCase()) !== -1
    );
    setTopics(searchedValues);
  };

  const onFinish = () => {
    if (selectedTopics.length == 0) {
      message.error(t(CHOOSE_TOPIC));
      return;
    }
    requestApi(saveInterestedTopic, { topics: selectedTopics }, (response: { message: string }, error: string) => {
      if (error) {
        return;
      }
      setModalVisible!(false);
      const updatedTags = topics.map((elm) => {
        if (selectedTopics.includes(elm.id!)) {
          return elm;
        }
      });
      onUpdateTagsValue(updatedTags);
    });
  };

  const onTagClose = (topic: Topic) => {
    const updatedSelectedTopics = selectedTopics.filter((elm) => elm !== topic.id);
    setSelectedTopics(updatedSelectedTopics);
  };

  useEffect(() => {
    getTopics(true);
    getInterestedTopics();
  }, [i18n.language]);

  return (
    <Form className="form" onFinish={onFinish}>
      <h4 className="sub-title">
        <Typography.Text>{t(FOLLOW_AT_LEAST_ONE_TOPIC)}</Typography.Text>
      </h4>
      <Form.Item className="search-wrapper">
        <Input
          onChange={onSearch}
          prefix={<img src={icons.search.icon} />}
          placeholder={t(FIND_HOME_AND_GARDEN_TOPICS)}
        />
      </Form.Item>
      {selectedTopics.length !== 0 && (
        <Form.Item>
          {selectedTopics.map((elm) => {
            return topics.map((topic, index) => {
              if (topic.id == elm) {
                return (
                  <Tag closable onClose={() => onTagClose(topic)} key={topic.id}>
                    <Typography.Text>{topic.title}</Typography.Text>
                  </Tag>
                );
              }
            });
          })}
        </Form.Item>
      )}
      <Typography.Text>{t(DISCUSSIONS_SEARCH)}</Typography.Text>
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
          <Checkbox.Group className="topics-checkbox" value={selectedTopics}>
            <Row>
              {topics.map((elm, index) => {
                return (
                  <Col span={8} key={index}>
                    <Checkbox value={elm.id} onChange={onChange}>
                      {elm.title}
                    </Checkbox>
                  </Col>
                );
              })}
            </Row>
          </Checkbox.Group>
        </InfiniteScroll>
      </div>
      <Row align="middle" justify="end" className="footer">
        <Form.Item>
          <Typography.Text className="selected-items">
            {selectedTopics?.length}
            &nbsp; {t(SELECTED)}
          </Typography.Text>
        </Form.Item>
        <Form.Item>
          <Button className="submit-btn" type="primary" htmlType="submit">
            {t(DONE)}
          </Button>
        </Form.Item>
      </Row>
    </Form>
  );
};
