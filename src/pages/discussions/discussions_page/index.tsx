import { Col, Form, Input, Modal, Row } from 'antd';
import React, { FunctionComponent, useCallback, useContext, useEffect, useRef, useState } from 'react';
// hooks
import { useMainContext } from '../../../app/providers/main';
import { useTranslation } from 'react-i18next';
// strings
import {
  FEATURED,
  GET_HELP_FOR_YOUR_PROJECTS,
  POPULAR,
  START_A_DISCUSSION,
  UNANSWERED,
  WHAT_ARE_YOU_WORKING_ON,
  HI,
  POST,
  ALL,
  THE_DISCUSSIONS,
  DISCUSSIONS,
  HOME_PAGE_SEO_DESCRIPTION,
  MANZILIK,
  INCOMPLETE_RFQ,
  COMPLETE_BTN,
} from '../../../locales/strings';
// utils
import { listLimit as limit } from '../../../app/settings';
import { getLayoutDirection } from '../../../app/layouts';
import { getUserName } from '../../../utils';
import { toArrayOrEmpty } from '../../idea/utils';
// components
import icons from '../../../assets/icons';
import Avatar from 'antd/lib/avatar/avatar';
import { UserOutlined } from '@ant-design/icons';
import { TagsList } from '../../../components/tags_list';
import { DiscussionList } from '../components/discussions_list';
import { SideBoxBottom } from '../components/side_bottom_box';
// types
import { Discussion } from '../components/discussion_card';
import StartDiscussion from '../start_discussion';
import Separator from '../../../components/separator';
import { getUserCommentedOnDiscussions, getUserDiscussions, listDiscussions } from '../api';
import SideBoxTop from '../components/side_top_box';
import { useHistory, useParams } from 'react-router-dom';
import { MetaTags } from '../../../components/meta_tags';
import { useCompletePersonalProfile } from '../../auth/signup/components/complete_basic_profile/hooks/useCompletePersonalProfile';
import { CompletePersonalProfile } from '../../auth/signup/components/complete_basic_profile/complete_personal_profile';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';
import { useClient } from '../../../app/hooks/use_client';
import InDismissibleAlert from '../../../components/in_dismissible_alert';

const discussionTabs = [ALL, POPULAR, FEATURED, UNANSWERED];

const DiscussionsPage: FunctionComponent = () => {
  const [discussionsList, setDiscussionsList] = useState<(Discussion | null)[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [startDiscussion, toggleStartDiscussion] = useState<boolean>(false);
  const [discussionSource, setUsersDiscussionsSource] = useState<'user' | 'comment'>();
  const [selectedTag, selectTag] = useState<number>(0);
  const { id } = useParams<{ id: string }>();
  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;
  const { i18n, t } = useTranslation();
  const history = useHistory();
  const { requestApi, userState, userName } = useMainContext();
  const discussionTabsForRequest = ['', POPULAR, FEATURED, UNANSWERED];
  const { isCompletePersonalProfile, errors, profile, setProfile, submit, saveSnapshot, restoreSnapshot } =
    useCompletePersonalProfile();
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [form] = Form.useForm();
  const { hasDraftRfq } = useClient();

  const onStartDiscussion = useCallback(() => {
    if (userState.isAuthenticated === false) {
      toggleStartDiscussion(true);
    } else {
      if (!showCompleteProfile && !isCompletePersonalProfile) {
        setShowCompleteProfile(true);
      } else {
        toggleStartDiscussion(true);
      }
    }
  }, [showCompleteProfile, isCompletePersonalProfile]);

  const onTagSelect = (index: number) => {
    selectTag(index);
    getDiscussionsList(true, discussionTabsForRequest[index]);
    history.push('/discussions');
  };

  const getDiscussionsFunction = (source: 'user' | 'comment' | undefined) => {
    switch (source) {
      case 'user':
        return getUserDiscussions;
      case 'comment':
        return getUserCommentedOnDiscussions;
      default:
        return listDiscussions;
    }
  };
  const firstLoad = useRef(true);

  useEffect(() => {
    if (!firstLoad.current) {
      firstLoad.current = false;
      return;
    }
  }, [id]);

  const getDiscussionsList = (
    refresh: boolean = false,
    tab: string = discussionTabsForRequest[selectedTag],
    source?: 'user' | 'comment' | undefined
  ) => {
    let pagination = { limit, offset, tab, resourceId: id };
    const listAllDiscussions = getDiscussionsFunction(source!);
    setUsersDiscussionsSource(source!);
    const currentOffset = refresh ? 0 : offset;
    if (refresh) {
      pagination = { limit, offset: 0, tab, resourceId: id };
      setDiscussionsList([]);
      setHasMore(true);
    }

    setLoading(true);
    requestApi(
      listAllDiscussions!,
      { input: pagination, isAuthenticated: userState.isAuthenticated, lang: i18n.language },
      (response: { discussions: Discussion[]; discussions_total: number }, error: string) => {
        if (error) {
          return;
        }
        const discussions = toArrayOrEmpty(response?.discussions);
        setDiscussionsList((prevDiscussionsList) => [
          ...toArrayOrEmpty(prevDiscussionsList),
          ...toArrayOrEmpty(discussions),
        ]);

        setLoading(false);

        if (discussions?.length === 0) {
          setHasMore(false);
          return;
        }

        setOffset(currentOffset + limit);
      }
    );
  };

  const onNext = () => {
    if (!loading) {
      getDiscussionsList(false, discussionTabs[selectedTag], discussionSource);
    }
  };

  useEffect(() => {
    getDiscussionsList(true);
  }, [i18n.language, id]);

  return (
    <Row justify="center" className={`discussions-page ${getLayoutDirection(i18n.language)}`}>
      <MetaTags title={`${t(MANZILIK)} | ${t(DISCUSSIONS)}`} description={t(HOME_PAGE_SEO_DESCRIPTION)} />
      {!startDiscussion && (
        <div className="discussions-header">
          <div className="img-fit-content header-overlay">
            <p className="hi-text">{`${t(HI)} ${userName}`}</p>
            <p className="what-are-you-working-text">{t(WHAT_ARE_YOU_WORKING_ON)}</p>
            <p className="get-help-text">{t(GET_HELP_FOR_YOUR_PROJECTS)}</p>
            <Row justify="center" className="avatar-start-discussion-wrapper">
              <Avatar size={50} src={client?.profile_image} icon={<UserOutlined />} />
              <div className="separator" />
              <div className="start-discussion-input">
                <img src={icons.post.icon} />
                <Input placeholder={t(START_A_DISCUSSION)} onClick={onStartDiscussion} />
                <Modal
                  visible={showCompleteProfile}
                  footer={null}
                  onCancel={(e) => {
                    restoreSnapshot();
                    setShowCompleteProfile(false);
                  }}
                >
                  <Form
                    form={form}
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
              </div>
            </Row>
          </div>
        </div>
      )}

      {startDiscussion && (
        <>
          <StartDiscussion
            client={client}
            userName={userName}
            toggleStartDiscussion={toggleStartDiscussion}
            getDiscussionsList={() => {
              getDiscussionsList(true); // refresh = true
            }}
          />
          <div
            className="img-fit-content header-overlay"
            onClick={() => {
              toggleStartDiscussion(false);
            }}
          />
        </>
      )}
      <Col xl={20} lg={20} md={22} sm={22} xs={22}>
        {hasDraftRfq && (
          <InDismissibleAlert
            isBlocked
            message={t(INCOMPLETE_RFQ)}
            onMessageClick={() => {
              history.push('/request-quotation-service');
            }}
            actionBtnText={t(COMPLETE_BTN)}
            actionBtnClick={() => {
              history.push('/request-quotation-service');
            }}
          />
        )}
        <Row justify="center" className="list-and-boxes-wrapper" gutter={20}>
          <Col xl={7} lg={9} md={10} sm={24} xs={24}>
            <SideBoxTop
              getDiscussionsList={(source?: 'user' | 'comment' | undefined) => {
                id && history.push('/discussions');
                getDiscussionsList(true, discussionTabs[0], source);
                onTagSelect(0);
              }}
            />
            <SideBoxBottom />
          </Col>
          <Col xl={17} lg={15} md={14} sm={24} xs={24}>
            <Row justify="space-between">
              <p className="list-title">{t(THE_DISCUSSIONS)}</p>
              {discussionsList.length !== 0 && (
                <p className="posts-number-text">
                  <strong>{t(POST, { count: discussionsList.length })}</strong>
                </p>
              )}
            </Row>
            {!discussionSource && (
              <>
                <TagsList
                  className="discussions-tags"
                  tags={discussionTabs.map((tab) => t(tab))}
                  selectedTags={[selectedTag]}
                  onTagSelect={onTagSelect}
                />
                <Separator vertical={25} horizontal={0} />
              </>
            )}

            <DiscussionList
              offset={offset}
              onNext={onNext}
              hasMore={hasMore}
              loading={loading}
              discussionsList={discussionsList}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default DiscussionsPage;
