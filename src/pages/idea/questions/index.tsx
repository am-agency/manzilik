import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Button, Divider, Form, List, Modal } from 'antd';
import 'moment/locale/ar';

import { useTranslation } from 'react-i18next';
import {
  SHOW,
  MORE_QUESTIONS,
  I_HAVE_ANOTHER_QUESTION,
  ASK_QUESTION_ABOUT_THIS_PHOTO,
  QUESTION_SUBMIT,
} from '../../../locales/strings';

import { listProjectQuestion } from '../api';
import { Question } from '../../../API';

import { useMainContext } from '../../../app/providers/main';
import { useModal } from '../../../app/providers/modal';
import { useClient } from '../../../app/hooks/use_client';

import { ModalTitle } from '../../../components/modal_title';
import { NewQuestionForm } from './forms/new_question';
import { PreviousQuestionsForm } from './forms/previous_questions';
import { QuestionHead } from '../components/question_head';
import { SingleQuestion } from './question';
import { CompletePersonalProfile } from '../../auth/signup/components/complete_basic_profile/complete_personal_profile';
import { useCompletePersonalProfile } from '../../auth/signup/components/complete_basic_profile/hooks/useCompletePersonalProfile';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';

interface Props {
  projectId: string;
  ideaId: string;
}

export const Questions: FunctionComponent<Props> = ({ projectId, ideaId }: Props) => {
  const { t } = useTranslation();
  const { requestApi, userState } = useMainContext();
  const { showModal, form, setModalVisible } = useModal();
  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;
  const [ideaQuestions, setIdeaQuestions] = useState<Question[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const { isCompletePersonalProfile, errors, profile, setProfile, submit, saveSnapshot, restoreSnapshot } =
    useCompletePersonalProfile();
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [completeProfileForm] = Form.useForm();

  const getIdeaQuestions = () => {
    requestApi(
      listProjectQuestion,
      { id: projectId, values: { offset: 0, limit: 200 }, user: userState.isAuthenticated },
      (response: { results: Question[]; count: number }, error: string) => {
        if (error) {
          return;
        }
        const { results, count } = response;
        setIdeaQuestions(results);
        setTotalQuestions(count);
      }
    );
  };

  const postAddQuestion = (question: Question) => {
    setIdeaQuestions((prevIdeas) => [...prevIdeas, question]);
    setTotalQuestions(totalQuestions + 1);
    setOffset(offset + 1);
  };

  const openAddQuestion = () => {
    if (ideaQuestions.length !== 0) {
      onPreviousQuestionsModal();
    } else {
      onAskQuestionModal();
    }
  };

  const onAddQuestionClick = () => {
    if (userState.isAuthenticated === false) {
      openAddQuestion();
    } else if (!isCompletePersonalProfile) {
      setShowCompleteProfile(true);
    } else {
      openAddQuestion();
    }
  };

  const onAskQuestionModal = () => {
    showModal(
      <ModalTitle title={t(ASK_QUESTION_ABOUT_THIS_PHOTO)} />,
      <NewQuestionForm form={form!} projectId={projectId} ideaId={ideaId} postAddQuestion={postAddQuestion} />,
      'modal-wrapper new-question-modal',
      t(QUESTION_SUBMIT)
    );
  };

  const onPreviousQuestionsModal = () => {
    showModal(
      <ModalTitle title={t(ASK_QUESTION_ABOUT_THIS_PHOTO)} />,
      <PreviousQuestionsForm
        setModalVisible={setModalVisible!}
        form={form!}
        onFinish={onAskQuestionModal}
        projectId={projectId}
      />,
      'modal-wrapper previous-questions-modal',
      t(I_HAVE_ANOTHER_QUESTION)
    );
  };

  useEffect(() => {
    getIdeaQuestions();
  }, []);

  const loadMore = totalQuestions > ideaQuestions.length && (
    <Button
      className="more-btn"
      onClick={() => {
        getIdeaQuestions();
      }}
    >
      {t(SHOW)} {totalQuestions - ideaQuestions.length} {t(MORE_QUESTIONS)}
    </Button>
  );

  return (
    <div className="questions" id="comments">
      <QuestionHead onAddQuestionClick={onAddQuestionClick} totalQuestions={totalQuestions} />
      <Modal
        visible={showCompleteProfile}
        footer={null}
        onCancel={(e) => {
          restoreSnapshot();
          setShowCompleteProfile(false);
        }}
      >
        <Form
          form={completeProfileForm}
          onFieldsChange={(fields) => {
            fields.forEach((field) => {
              setProfile((pre) => ({ ...pre, [field.name as string]: field.value }));
            });
          }}
        >
          <CompletePersonalProfile
            onInit={saveSnapshot}
            onComplete={() => {
              setShowCompleteProfile(false);
            }}
            errors={errors}
            profile={profile}
            setProfile={setProfile}
            submit={async () => {
              try {
                const updated = await submit();
                setShowCompleteProfile(false);
                return updated;
              } catch (error) {
                return Promise.reject();
              }
            }}
          />
        </Form>
      </Modal>
      <List
        itemLayout="horizontal"
        dataSource={ideaQuestions}
        bordered={false}
        split={false}
        loadMore={loadMore}
        renderItem={(question, index) => {
          return (
            <>
              {index > 0 && <Divider />}
              <SingleQuestion question={question} client={client!} />
            </>
          );
        }}
      />
    </div>
  );
};
