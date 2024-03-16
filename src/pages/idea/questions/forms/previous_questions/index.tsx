import { ProjectFilled } from '@ant-design/icons';
import { Form, FormInstance, Spin, Typography } from 'antd';
import React, { FunctionComponent, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Question } from '../../../../../API';
import { useMainContext } from '../../../../../app/providers/main';
import { listProjectQuestion } from '../../../api';

interface Props {
  onFinish: () => void;
  form?: FormInstance;
  setModalVisible: Function;
  projectId: string;
}

export const PreviousQuestionsForm: FunctionComponent<Props> = ({
  onFinish,
  form,
  setModalVisible,
  projectId,
}: Props) => {
  const [prevQuestions, setPrevQuestions] = useState<Question[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { requestApi } = useMainContext();

  const getPrevQuestions = () => {
    setIsLoading(true);
    requestApi(
      listProjectQuestion,
      { id: projectId, values: { offset: 0, limit: 200 } },
      (response: { results: Question[]; count: number }, error: string) => {
        if (error) {
          return;
        }
        const { results, count } = response;
        setPrevQuestions(results);
        setTotalQuestions(count);
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    getPrevQuestions();
  }, [projectId]);

  return (
    <Form onFinish={onFinish} form={form} className="questions-form">
      <InfiniteScroll
        dataLength={prevQuestions.length}
        next={getPrevQuestions}
        hasMore={totalQuestions > prevQuestions.length}
        loader={<span />}
      >
        {prevQuestions.length !== 0 ? (
          prevQuestions?.map((question, index) => {
            return (
              <a key={index} href={`#${question.id}`} onClick={() => setModalVisible(false)!}>
                <Typography.Text>- {question.title}</Typography.Text>
                <br />
              </a>
            );
          })
        ) : (
          <Spin spinning={isLoading} />
        )}
      </InfiniteScroll>
    </Form>
  );
};
