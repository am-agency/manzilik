import React, { useContext, useEffect, useState } from 'react';
import GigCard from '../gig_card';
import { GigService } from '../../../../API';
import { GigsStepsContext } from '../../../../context/gigs_steps_context';
import { Carousel } from 'react-responsive-carousel';
import { Button, Form, Modal } from 'antd';
import icons from '../../../../assets/icons';
import { getLayoutDirection } from '../../../../app/layouts';
import { useTranslation } from 'react-i18next';
import AvatarCard from '../../../../components/avatar_card';
import TextWithIcon from '../../../../components/text_with_icon';
import {
  AVAILABLE_IN,
  DISAPPEAR,
  PROFESSIONAL,
  SAR,
  SELECT_CITY_FIRST,
  SEND_SERVICE_REQUEST_NOW,
  SIMILAR_SERVICES,
  VIEW,
  VIEW_ALL,
} from '../../../../locales/strings';
import DescriptionToggle from '../../../../components/description_toggle';
import { useGigsServicesList } from '../../hooks/useGigsServicesList';
import { useMainContext } from '../../../../app/providers/main';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { LOGIN_ROUTE, REQUEST_GIG_SERVICE_ROUTE } from '../../../../utils/routes';
import { PreviousHistoryContext } from '../../../../context/previous_history_context';
import { Loading } from '../../../../components/loading';
import DefaultImage from '../../../../assets/images/default//Defult-Image-434.png';
import { useCompletePersonalProfile } from '../../../auth/signup/components/complete_basic_profile/hooks/useCompletePersonalProfile';
import { CompletePersonalProfile } from '../../../auth/signup/components/complete_basic_profile/complete_personal_profile';
import { getValueAndUpdateSearchUrl } from '../../../../utils';
import { GetGigServiceDetails } from '../../api';
import * as analytics from '../../../../analytics';
import { SharedStateContext, SharedStateInterface } from '../../../../context/shared_state_context';
import { UserRole } from '../../../../app/types';

const StepFour = () => {
  const contextValue = useContext(GigsStepsContext);
  const { i18n, t } = useTranslation();
  const langDirection = getLayoutDirection(i18n.language);
  const [cityId, setCityId] = useState<string>('');
  const [renderedList, setRenderedList] = React.useState<GigService[]>([]);
  const [showSimilarityServices, setShowSimilarityServices] = useState<boolean>(false);
  const listFromLocalStorage = localStorage.getItem('gigsServicesList');
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [form] = Form.useForm();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const professionalFromLocalStorage = JSON.parse(localStorage.getItem('Professional')!);
  const isProfessional = professionalFromLocalStorage?.client?.type === UserRole.Professional;

  const { isCompletePersonalProfile, errors, profile, setProfile, submit, saveSnapshot, restoreSnapshot } =
    useCompletePersonalProfile();

  const toggleSimilarityServices = () => {
    setShowSimilarityServices(!showSimilarityServices);
  };

  const { data, isLoading, loadingCardsArray } = useGigsServicesList() as {
    data: GigService[];
    isLoading: boolean;
    loadingCardsArray: JSX.Element[];
  };

  if (!contextValue) {
    return <Loading />;
  }
  const [renderedSelectedServiceItem, setRenderedSelectedServiceItem] = useState<GigService | null>(null);
  const {
    selectedServiceItem,
    updateStep,
    filteredServices,
    selectedCityId,
    setSelectedCityId,
    selectedService,
    selectedCityName,
  } = contextValue;
  const { userState, requestApi } = useMainContext();
  const { setPreviousHistoryLink } = useContext(PreviousHistoryContext) as {
    setPreviousHistoryLink?: (link: string) => void;
    previousHistoryLink: string;
  };
  const history = useHistory();
  const selectedServiceItemFromLocalStorage = localStorage.getItem('selectedServiceItem');
  const gigId = params.get('gigId');
  const cityIdFromUrl = params.get('cityId');
  const fromProfile = params.get('fromProfile');
  const { currentScreenName, defaultCountry } = useContext(SharedStateContext) as SharedStateInterface;
  const { submitWithoutValidation } = useCompletePersonalProfile();

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityId(selectedCityId!);
    setSelectedCityId!(e.target.value);
    submitWithoutValidation({
      country_id: defaultCountry,
      city_id: e.target.value,
    });
  };

  const getGigServiceDetailsCall = (id: string) => {
    requestApi(GetGigServiceDetails, { id }, (response: GigService, error: unknown) => {
      if (error) {
        return;
      }
      setRenderedSelectedServiceItem(response);
      if (profile?.cityId) {
        setSelectedCityId!(profile?.cityId);
        setCityId(profile?.cityId);
      }
    });
  };

  useEffect(() => {
    if (gigId) {
      getGigServiceDetailsCall(gigId);
    }
  }, [gigId]);

  useEffect(() => {
    if (selectedServiceItemFromLocalStorage) {
      setRenderedSelectedServiceItem(JSON.parse(selectedServiceItemFromLocalStorage));
    } else {
      setRenderedSelectedServiceItem(selectedServiceItem!);
    }
  }, [selectedServiceItem, selectedServiceItemFromLocalStorage]);

  useEffect(() => {
    if (selectedCityId) {
      setCityId(selectedCityId);
    } else if (cityIdFromUrl) {
      setCityId(cityIdFromUrl!);
    } else if (profile?.cityId) {
      setCityId(profile?.cityId);
    } else {
      setCityId('');
    }
  }, [profile?.cityId, cityIdFromUrl]);

  useEffect(() => {
    if (listFromLocalStorage) {
      setRenderedList(listFromLocalStorage ? JSON.parse(listFromLocalStorage) : []);
    } else {
      setRenderedList(filteredServices!);
    }
  }, [filteredServices, listFromLocalStorage]);

  const HandleSubmit = () => {
    if (userState.isAuthenticated && userState.client?.status === 'IS_ACTIVE') {
      updateStep(4);
      getValueAndUpdateSearchUrl!(history, 'step', '5');
    } else if (userState.isAuthenticated && !isCompletePersonalProfile) {
      setShowCompleteProfile(true);
    } else {
      history.push(LOGIN_ROUTE);
    }
    setPreviousHistoryLink!(`${REQUEST_GIG_SERVICE_ROUTE}?step=4`);
    analytics.PublishEvent(
      new analytics.AnalyticsStartGigRequest(
        selectedService?.title!,
        selectedCityName!,
        selectedServiceItem?.id!,
        selectedServiceItem?.title!,
        currentScreenName
      )
    );
  };

  useEffect(() => {
    if (selectedServiceItem) {
      analytics.PublishEvent(
        new analytics.AnalyticsViewLastStep(
          selectedService?.title!,
          selectedCityName!,
          selectedServiceItem?.id!,
          selectedServiceItem?.title!,
          currentScreenName
        )
      );
    }
  }, [selectedServiceItem]);

  return (
    <div className="step-four">
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
      <div className="wrapper">
        <div className="image">
          {renderedSelectedServiceItem?.photos?.length! > 0 ? (
            <Carousel
              className="carousal-container"
              showThumbs={false}
              showStatus={false}
              autoPlay={false}
              infiniteLoop={true}
              showIndicators={renderedSelectedServiceItem!?.photos!?.length > 2}
              renderArrowPrev={(onClickHandler, hasPrev) => {
                return (
                  hasPrev && (
                    <Button className={`prev-btn carousal-btns ${langDirection}`} onClick={onClickHandler}>
                      <img src={icons.leftArrow.icon} />
                    </Button>
                  )
                );
              }}
              renderArrowNext={(onClickHandler, hasNext) => {
                return (
                  hasNext && (
                    <Button className={`next-btn carousal-btns ${langDirection}`} onClick={onClickHandler}>
                      <img src={icons.rightArrow.icon} />
                    </Button>
                  )
                );
              }}
            >
              {renderedSelectedServiceItem?.photos?.map((elm) => {
                return (
                  <div key={elm} className="carousal-img-wrapper">
                    <img className={`img-fit-content rounded-left-border ${langDirection}`} src={elm!} />
                  </div>
                );
              })}
            </Carousel>
          ) : (
            <div className="carousal-img-wrapper">
              <img className={`img-fit-content rounded-left-border ${langDirection}`} src={DefaultImage} />
            </div>
          )}
        </div>
        <div className="content">
          <AvatarCard
            imageUrl={renderedSelectedServiceItem?.professional?.company_logo!}
            name={renderedSelectedServiceItem?.professional?.company_name!}
            title={t(PROFESSIONAL)}
            rate={renderedSelectedServiceItem?.professional?.reviews_total!}
            rateFontSize={'10px'}
            onNameClick={() => {
              window.open(`/professional/${renderedSelectedServiceItem?.professional?.id}`, '_blank');
            }}
          />
          <div className="info">
            <h3>{renderedSelectedServiceItem?.title}</h3>
            <TextWithIcon icon={icons.my_gigs.price_icon} text={`${renderedSelectedServiceItem?.price} ${t(SAR)}`} />
          </div>
          <div className="radio">
            <TextWithIcon icon={icons.my_gigs.square_pin} text={t(AVAILABLE_IN)} />
            <div className="radio-list">
              {renderedSelectedServiceItem?.cities?.map((elm) => {
                return (
                  <label key={elm!.id}>
                    <input
                      type="radio"
                      name="radio"
                      value={elm!.id}
                      checked={elm!.id === cityId}
                      onChange={handleCityChange}
                    />
                    {elm!.name}
                  </label>
                );
              })}
            </div>

            {!cityId && (
              <div className="city-warning">
                <img src={icons.my_gigs.infoBlue} />
                <span>{t(SELECT_CITY_FIRST)}</span>
              </div>
            )}
          </div>
          <div className="description">
            <DescriptionToggle
              descriptionText={renderedSelectedServiceItem?.description! || ''}
              descriptionTextLength={120}
            />
          </div>
          {!isProfessional && (
            <button className={`request-button ${!cityId ? 'disabled' : ''}`} onClick={HandleSubmit} disabled={!cityId}>
              {t(SEND_SERVICE_REQUEST_NOW)}
            </button>
          )}
        </div>
      </div>
      <div className="separator"></div>
      {!fromProfile && (
        <div className="cards-wrapper">
          <div className="header">
            <p className="title">{t(SIMILAR_SERVICES)}</p>
            <button className="view" onClick={toggleSimilarityServices}>
              {!showSimilarityServices ? t(VIEW) : t(DISAPPEAR)}
              &nbsp; &nbsp; &nbsp;
              <span
                style={{
                  display: 'inline-block',
                  transform: showSimilarityServices ? 'rotate(177deg)' : 'rotate(0deg)',
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <img src={icons.downArrow} />
              </span>
            </button>
          </div>
          {showSimilarityServices && (
            <div className="list-cards">
              {renderedList &&
                renderedList
                  ?.filter(
                    (item) =>
                      item.id !== renderedSelectedServiceItem?.id &&
                      item?.cities &&
                      item?.cities?.find((city) => city!.id === cityId)
                  )
                  .map((item: GigService) => {
                    return <GigCard key={item.id} item={item} listOfGigServices={renderedList || []} />;
                  })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StepFour;
