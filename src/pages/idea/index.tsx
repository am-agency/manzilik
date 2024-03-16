import React, { useContext, useEffect, useState } from 'react';
import { Col, Row, List, Card, Skeleton } from 'antd';
import { Container } from '../../components/container';
import { useMainContext } from '../../app/providers/main';
import { listProjectIdeas } from './api';
import { useHistory, useParams } from 'react-router';
import { Idea, StockRecordList, Professional, StockRecord, Indices } from '../../API';
import icons from '../../assets/icons';
import { useTranslation } from 'react-i18next';
import { SAVE, SEND, SEND_BY_EMAIL, HOMEOWNER, SEE_THIS_PROJECT_ON_MANZILIK } from '../../locales/strings';
import { ideaIcons } from '../../assets/icons/idea';
import { useModal } from '../../app/providers/modal';
import { ModalTitle } from '../../components/modal_title';
import SendMessageForm from '../../components/send_message_form';
import { SaveIdeaForm } from './forms/save_idea';
import { ClientComponent } from './components/idea_client';
import { IdeasList } from './components/ideas_list';
import { IdeaDetailsActions } from './components/idea_details_actions';
import { Questions } from './questions';
import { getIdeaCardDirection, getModalTitle } from '../../components/idea/utils';
import { EntityTags } from '../../components/idea/types';
import { MetaTags } from '../../components/meta_tags';
import { getIdeaLink, scrollToSection } from '../../utils';
import { COMMENTS_TEXT, IDEAS, PROFESSIONAL } from '../../app/settings';
import { GoogleVision } from './components/google_vision';
import { RelatedProfessionalsItem } from './components/related_professionals_list_item';
import { getProfessional } from '../professionals/api';
import { ProjectIdeas } from './types';
import { RelatedProfessionalSection } from './related_professional';
import { ProjectDescription } from './components/project_description';
import { CustomCarousal } from '../../components/carousal';
import Separator from '../../components/separator';
import RelatedProductCard from './components/related_product_card';
import { listRelatedStockRecords } from '../ideas/api';
import Loader from 'react-spinners/ClipLoader';
import i18n from '../../app/i18n';
import { useMediaQuery } from 'react-responsive';
import { RelatedProfessionalsSmallCard } from './components/related_professionals_small_card';
import InDismissibleAlert from '../../components/in_dismissible_alert';
import { CompleteProfileContext } from '../../context/complete_profile_context';
import SimilarGigs from '../request_gig/components/similar_gigs';
import { COMPLETE_PROFILE_ROUTE } from '../../utils/routes';

export enum ZoomType {
  ZoomIn = 'zoom_in',
  ZoomOut = 'zoom_out',
}

interface URLParams {
  projectId: string;
  ideaId: string;
}

const IdeaDetails = () => {
  const { requestApi, userState } = useMainContext();
  const { showModal } = useModal();
  const { t } = useTranslation();
  const history = useHistory();
  const { projectId, ideaId } = useParams<URLParams>();
  const [project, setProject] = useState<ProjectIdeas>();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [defaultIdea, setDefaultIdea] = useState<Idea>();
  const [isIdeaSelected, setIsIdeaSelected] = useState<boolean>(false);
  const [totalIdeas, setTotalIdeas] = useState<number>(0);
  const [professional, setProfessional] = useState<Professional>();
  const isHomeOwner = project?.client?.type == HOMEOWNER;
  const { REACT_APP_BASE_URL } = process.env;
  const [isRelatedProductsVisible, setIsRelatedProductsVisible] = useState<boolean>(false);
  const [selectedLabelId, setSelectedLabelId] = useState<string>('');
  const [listOfRelatedProducts, setListOfRelatedProducts] = useState<StockRecord[] | null | undefined>();
  const [isListOfProductsLoading, setIsListOfProductsLoading] = useState<boolean>(false);
  const isMobile = useMediaQuery({ query: '(max-width: 420px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 991px)' });

  const HandleOpenRelatedProducts = () => {
    setIsRelatedProductsVisible(true);
  };

  const HandleCloseRelatedProducts = () => {
    setIsRelatedProductsVisible(false);
  };

  const getIdeaDetails = () => {
    requestApi(
      listProjectIdeas,
      // the project photo won't be more than 10-15 photos, also to get the matched idea in case the idea id from url doesn't exist in the first hit of limt/offset
      { id: projectId, values: { offset: 0, limit: 30 }, user: userState.isAuthenticated },
      (response: ProjectIdeas, error: string) => {
        if (error) {
          return;
        }
        const {
          ideasList: { results, count },
          default_idea,
        } = response;
        setTotalIdeas(count);
        setProject(response);
        setIdeas(results!);

        const selectedIdea = results.find((elm) => elm.id == ideaId);
        setDefaultIdea(selectedIdea || default_idea);

        if (window?.location?.hash?.includes(COMMENTS_TEXT)) {
          requestAnimationFrame(() => {
            scrollToSection(COMMENTS_TEXT);
          });
        }
      }
    );
  };

  const getProfessionalData = () => {
    requestApi(
      getProfessional,
      { id: project!.client?.id, isAuthenticated: userState.isAuthenticated },
      (prof: Professional, error: string) => {
        if (error) {
          return;
        }
        setProfessional(prof);
      }
    );
  };
  const getRelatedProducts = () => {
    setIsListOfProductsLoading(true);
    requestApi(
      listRelatedStockRecords,
      {
        resourceId: selectedLabelId,
        limit: 100,
        offset: 0,
      },
      (response: StockRecordList, error: string) => {
        if (response) {
          setIsListOfProductsLoading(false);
          setListOfRelatedProducts(response?.results as StockRecord[]);
          if (response?.results?.length > 0) {
            HandleOpenRelatedProducts();
          }
        }

        if (error) {
          return;
        }
      }
    );
  };

  useEffect(() => {
    if (selectedLabelId) {
      getRelatedProducts();
    }
  }, [selectedLabelId, i18n.language]);

  const postSaveIdea = () => {
    setIsIdeaSelected(true);
  };

  const onShareIdea = () => {
    showModal(
      <ModalTitle icon={icons.email.icon} title={t(SEND_BY_EMAIL)} />,
      <SendMessageForm
        project={project}
        defaultMessageContent={`${t(SEE_THIS_PROJECT_ON_MANZILIK)}
      ${REACT_APP_BASE_URL}/${getIdeaCardDirection(defaultIdea!, project!, IDEAS)}`}
      />,
      'send-email-modal-wrapper modal-wrapper',
      SEND
    );
  };

  const onSaveIdea = () => {
    showModal(
      <ModalTitle title={getModalTitle(EntityTags.IDEA, t)} icon={ideaIcons.save.icon} />,
      <SaveIdeaForm
        projectId={defaultIdea?.project_id!}
        entity={defaultIdea}
        client={project?.client!}
        postSaveIdea={postSaveIdea}
        tag={EntityTags.IDEA}
      />,
      'modal-wrapper move-idea-modal save-idea-modal',
      t(SAVE)
    );
  };

  const onIdeaChange = (idea: Idea) => {
    setIsIdeaSelected(false);
    setDefaultIdea(idea);
    history.push(getIdeaLink(idea!));
  };

  useEffect(() => {
    getIdeaDetails();
  }, []);

  useEffect(() => {
    if (project?.client?.type == PROFESSIONAL) {
      getProfessionalData();
    }
  }, [project]);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const { isProfessionalCompleteProfile } = useContext(CompleteProfileContext) as {
    isProfessionalCompleteProfile: boolean;
  };

  const IdeaListSection = defaultIdea && (
    <IdeasList
      project={project!}
      ideas={ideas}
      onIdeaChange={onIdeaChange}
      totalIdeas={totalIdeas}
      defaultIdea={defaultIdea!}
    />
  );

  return (
    <Container>
      <MetaTags title={project?.title!} description={project?.description?.substr(0, 160)} />

      <div className="idea-details">
        {!isProfessionalCompleteProfile && userState?.isAuthenticated && userState?.client?.type === PROFESSIONAL ? (
          <InDismissibleAlert
            onMessageClick={() => history.push(COMPLETE_PROFILE_ROUTE)}
            actionBtnClick={() => history.push(COMPLETE_PROFILE_ROUTE)}
            isBlocked
          />
        ) : null}
        <Row gutter={[40, 40]}>
          <Col lg={15} xl={15} md={24} sm={24} xs={24}>
            <div className="img-container" id="canvas">
              {defaultIdea && <GoogleVision idea={defaultIdea} />}
              {project && defaultIdea && (
                <IdeaDetailsActions
                  isIdeaSelected={isIdeaSelected}
                  ideas={ideas}
                  onSaveIdea={onSaveIdea}
                  onShareIdea={onShareIdea}
                  defaultIdea={defaultIdea}
                />
              )}
            </div>
            {isListOfProductsLoading ? (
              <div className="loader-container">
                {Array.from({ length: 6 }).map((_, index) => {
                  return <Skeleton.Image key={index} className="skelton-image" />;
                })}
              </div>
            ) : (
              isRelatedProductsVisible && (
                <div className="related-products-container">
                  {isMobile ? null : (
                    <img
                      src={icons.close_icon}
                      alt="close-icon"
                      className="close-icon"
                      onClick={HandleCloseRelatedProducts}
                    />
                  )}

                  <div className="custom-carousal-wrapper" id="related-products-section">
                    <CustomCarousal id={'related-products-section'} action={listOfRelatedProducts}>
                      {listOfRelatedProducts?.map((elm, index) => {
                        return (
                          <RelatedProductCard
                            length={listOfRelatedProducts.length}
                            index={index!}
                            item={elm}
                            key={index}
                          />
                        );
                      })}
                    </CustomCarousal>
                  </div>
                </div>
              )
            )}
            {isTablet ? IdeaListSection : null}
            <div>
              {project && <ProjectDescription project={project} />}
              <div className="idea-client">
                {isHomeOwner ? (
                  <ClientComponent client={project?.client!} />
                ) : (
                  project &&
                  professional?.client && (
                    <List className="related-professionals-list">
                      {isMobile ? (
                        <RelatedProfessionalsSmallCard item={professional!} isSmallScreen={isMobile ? true : false} />
                      ) : (
                        <RelatedProfessionalsItem item={professional} />
                      )}
                    </List>
                  )
                )}
              </div>
              {defaultIdea && <Questions projectId={projectId} ideaId={defaultIdea?.id} />}
            </div>
          </Col>

          <Col xl={9} lg={9} md={24} sm={24} xs={24} className="right-side-col">
            {!isTablet ? IdeaListSection : null}

            {project && <RelatedProfessionalSection project={project} />}
          </Col>
        </Row>
        <Row>
          <Col xl={15} lg={20} md={24} sm={24} xs={24}>
            <SimilarGigs type={Indices.PROJECT} />
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default IdeaDetails;
