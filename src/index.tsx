import React, { lazy, Suspense, useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import Logger from 'js-logger';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router, matchPath, Switch } from 'react-router-dom';
import { IntercomProvider } from 'react-use-intercom';
import { awsConfigure } from './app/config';
import i18n from './app/i18n';
import { LayoutTypes } from './app/layouts';
import WrapperRoute from './app/page_wrapper';
import { MainProvider } from './app/providers/main';
import ModalProvider from './app/providers/modal';
import { ECOMMERCE_FEATURE } from './app/settings';
import { AR } from './locales/constants';

import reportWebVitals from './reportWebVitals';
import './styles/index.less';
import {
  ADD_REVIEW,
  ARTICLE_ROUTE,
  BRANDS_ROUTE,
  BRAND_ROUTE,
  CHANGE_PASSWORD_ROUTE,
  CHECKOUT_ROUTE,
  CLIENTS_LANDING_PAGE_ROUTE,
  COMING_SOON_ROUTE,
  COMPLETE_PROFILE_ROUTE,
  CONTACT_US_ROUT,
  DISCUSSIONS_ROUTE,
  DISCUSSION_ROUTE,
  FEDERATED_LOGIN_ROUTE,
  FORGET_PASSWORD_ROUTE,
  IDEA_ROUTE,
  LOGIN_ROUTE,
  MAGAZINE_ROUTE,
  PRIVACY_POLICY,
  PRODUCTS_MAIN_ROUTE,
  PRODUCTS_ROUTE,
  PROFESSIONALS_LANDING_PAGE_ROUTE,
  PROFESSIONALS_ROUTE,
  PROFESSIONAL_PUBLIC_ROUTE,
  PROFILE_ROUTE,
  PROJECTS_ROUTE,
  PROJECT_ROUTE,
  PUBLIC_PROFILE_ROUTE,
  RESET_PASSWORD_ROUTE,
  SIGN_UP_ROUTE,
  TERMS_AND_CONDITIONS_ROUTE,
  TV_ROUTE,
  VENDOR_ROUTE,
  WHO_WE_ARE_ROUTE,
  UPDATE_REVIEW,
  SET_PASSWORD_ROUTE,
  PRODUCT_ROUTE,
  REQUEST_PROFESSIONAL_SERVICE_ROUTE,
  REQUEST_GIG_SERVICE_ROUTE,
  MESSENGER_ROUTE,
  MESSENGER_MOBILE_ROUTE,
  MANZILIK_AI_ROUTE,
  MANZILIK_AI_DESIGN_DETAILS,
  HOW_MANZILIK_AI_ROUTE,
  AI_CHECKOUT_ROUTE,
  AI_RESULTS_ROUTE,
  AI_CHECKOUT_REDIRECT_ROUTE,
  CLIENT_TYPE_PAGE,
  REQUEST_QUOTATION_SERVICE_ROUTE,
  PROFESSIONAL_RFQ_ROUTE,
  REQUESTS_FOR_QUOTATIONS,
  TEST_PAGE,
  MANZILIK_AI_SUGGESTED_PRODUCTS_ROUTE,
} from './utils/routes';
import { GigsStepsProvider } from './context/gigs_steps_context';
import { PreviousHistoryProvider } from './context/previous_history_context';
import { SendBirdProvider } from './context/sendbird_context';
import { GigsServicesProvider } from './context/services_context';
import { SharedStateProvider } from './context/shared_state_context';
import { Loading } from './components/loading';
import { CompleteProfileProvider } from './context/complete_profile_context';
import DesignDetails from './pages/manzilik_ai/design_details';
import HowManzilikAiWorks from './pages/manzilik_ai/how_manzilik_ai_works';
import AiCheckout from './pages/manzilik_ai/ai_checkout';
import { ManzilikAiProvider } from './pages/manzilik_ai/manzilik_ai_context';
import AIResults from './pages/manzilik_ai/results';
import StatusPage from './pages/manzilik_ai/ai_checkout/components/status_page';
import ClientTypePage from './pages/client_type';
import { useFeature } from 'flagged';
import QuotationsDetails from './pages/profile/edit_profile/service_requests/rfq_details';
import RequestsForQuotations from './pages/requests_for_quotations';
import { RfqProvider } from './pages/requests_for_quotations/requests_for_quotations_context';
import { TutorialProvider } from './context/tutorial_context';
import { GuestUserModal } from './components/guest_user_modal';
import { REGISTER_NOW } from './locales/strings';
import { RemoteConfigProvider } from './context/remote_config_context';
import { ObjectRecognitionProvider } from './pages/manzilik_ai/suggested_products/object_recognation_context';

const { REACT_APP_SENTRY, REACT_APP_INTERCOM_APP_ID } = process.env;

awsConfigure();
Logger.useDefaults();

export const App: React.FunctionComponent = () => {
  const isContentOnly = matchPath(location.pathname, {
    path: '/messenger-mobile/:id?' || '/manzilik-ai',
    exact: true,
    strict: false,
  })?.isExact;

  const FailurePage = lazy(() => import('./components/page_not_found'));
  const WebToApp = lazy(() => import('./components/web_to_app_component'));
  const ForgetPassword = lazy(() => import('./pages/auth/forget_password'));
  const Login = lazy(() => import('./pages/auth/login'));
  const ResetPassword = lazy(() => import('./pages/auth/reset_password'));
  const SignUpWithEmail = lazy(() => import('./pages/auth/signup'));
  const ClientsLandingPage = lazy(() => import('./pages/clients_landing_page'));
  const ComingSoon = lazy(() => import('./pages/coming_soon'));
  const ContactUs = lazy(() => import('./pages/contact_us'));
  const Ideas = lazy(() => import('./pages/ideas'));
  const Article = lazy(() => import('./pages/magazine/article'));
  const PrivacyPolicy = lazy(() => import('./pages/privacy_policy'));
  const Messenger = lazy(() => import('./pages/messenger'));
  const MobileMessenger = lazy(() => import('./pages/messenger/messenger_mobile'));
  const Professionals = lazy(() => import('./pages/professionals'));
  const ProfessionalsLandingPage = lazy(() => import('./pages/professionals_landing_page'));
  const PublicProfile = lazy(() => import('./pages/public_profile'));
  const StepPaymentStatus = lazy(() => import('./pages/shopping/checkout/steps/step_payment_status'));
  const SubDepartmentPage = lazy(() => import('./pages/shopping/sub_department_page'));
  const TermsAndConditions = lazy(() => import('./pages/terms_conditions'));
  const WhoWeAre = lazy(() => import('./pages/who_we_are'));
  const DiscussionsPage = lazy(() => import('./pages/discussions/discussions_page'));
  const DiscussionDetails = lazy(() => import('./pages/discussions/discussion_details'));
  const Home = lazy(() => import('./pages/home'));
  const IdeaDetails = lazy(() => import('./pages/idea'));
  const Magazine = lazy(() => import('./pages/magazine/home'));
  const TVDetails = lazy(() => import('./pages/magazine/tv_details'));
  const TVList = lazy(() => import('./pages/magazine/tv_list'));
  const CompleteProfile = lazy(() => import('./pages/professionals/complete_profile'));
  const ProfessionalProfile = lazy(() => import('./pages/professionals/professional_profile'));
  const RequestProfessionalServiceView = lazy(
    () => import('./pages/professionals/request_professional_service/request_professional_service_view')
  );
  const RequestQuotationServiceView = lazy(
    () => import('./pages/professionals/request_professional_service/request_quotation_service_view')
  );
  const ChangePassword = lazy(() => import('./pages/profile/change_password'));
  const EditProfile = lazy(() => import('./pages/profile/edit_profile'));
  const Project = lazy(() => import('./pages/project/main'));
  const ProjectsPage = lazy(() => import('./pages/projects/projects_page'));
  const Checkout = lazy(() => import('./pages/shopping/checkout'));
  const Departments = lazy(() => import('./pages/shopping/departments_page'));
  const ProductDetails = lazy(() => import('./pages/shopping/product_details'));
  const AddReview = lazy(() => import('./pages/shopping/reviews/add_review'));
  const VendorProfile = lazy(() => import('./pages/shopping/vendor'));
  const StoreProfile = lazy(() => import('./pages/stores/store_profile'));
  const RequestGigPage = lazy(() => import('./pages/request_gig'));
  const StorePage = lazy(() => import('./pages/stores'));
  const ManzilikAiPage = lazy(() => import('./pages/manzilik_ai'));
  const SuggestedProductsPage = lazy(() => import('./pages/manzilik_ai/suggested_products'));

  const isEcommerce = useFeature(ECOMMERCE_FEATURE);
  const isLoggedIn = !!localStorage.getItem('isProf');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);

  // Show the modal for guest users after 30 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isLoggedIn && !popupDismissed) {
      timer = setTimeout(() => {
        setIsModalVisible(true);
      }, 30000); // 30 seconds
    }

    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [isLoggedIn, popupDismissed]);
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        {<GuestUserModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} title={REGISTER_NOW} />}
        <IntercomProvider
          appId={REACT_APP_INTERCOM_APP_ID!}
          autoBootProps={{ alignment: i18n.language == AR ? 'left' : 'right' }}
          shouldInitialize={!isContentOnly}
          initializeDelay={500}
        >
          <RemoteConfigProvider>
            <MainProvider>
              <TutorialProvider>
                <GigsStepsProvider>
                  <PreviousHistoryProvider>
                    <SharedStateProvider>
                      <GigsServicesProvider>
                        <SendBirdProvider>
                          <CompleteProfileProvider>
                            <ObjectRecognitionProvider>
                              <ManzilikAiProvider>
                                <I18nextProvider i18n={i18n}>
                                  <ModalProvider>
                                    <Switch>
                                      <WrapperRoute
                                        exact
                                        path={[`${LOGIN_ROUTE}/from=:screen`, LOGIN_ROUTE, FEDERATED_LOGIN_ROUTE]}
                                        Component={Login}
                                        layout={LayoutTypes.LOGIN}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={['/', '/federated-logout']}
                                        Component={Home}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={SIGN_UP_ROUTE}
                                        Component={SignUpWithEmail}
                                        layout={LayoutTypes.RIGHT_SIDE_BAR}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={PROJECTS_ROUTE}
                                        Component={ProjectsPage}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={FORGET_PASSWORD_ROUTE}
                                        Component={ForgetPassword}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={PROJECT_ROUTE}
                                        Component={Project}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={PROFILE_ROUTE}
                                        Component={EditProfile}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={`${PROFILE_ROUTE}/:tabId`}
                                        Component={EditProfile}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={`${PROFILE_ROUTE}/:tabId/:subId`}
                                        Component={EditProfile}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={RESET_PASSWORD_ROUTE}
                                        Component={ResetPassword}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={SET_PASSWORD_ROUTE}
                                        Component={ForgetPassword}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={CHANGE_PASSWORD_ROUTE}
                                        Component={ChangePassword}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={IDEA_ROUTE}
                                        Component={IdeaDetails}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path="/ideas/:value?"
                                        Component={Ideas}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={DISCUSSIONS_ROUTE}
                                        Component={DiscussionsPage}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={MAGAZINE_ROUTE}
                                        Component={Magazine}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={DISCUSSION_ROUTE + '/:title' + '/:id'}
                                        Component={DiscussionDetails}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={ARTICLE_ROUTE}
                                        Component={Article}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={TV_ROUTE + '/:title' + '/:id'}
                                        Component={TVDetails}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={TV_ROUTE}
                                        Component={TVList}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={PROFESSIONALS_ROUTE}
                                        Component={Professionals}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={REQUEST_PROFESSIONAL_SERVICE_ROUTE}
                                        Component={RequestProfessionalServiceView}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={REQUEST_QUOTATION_SERVICE_ROUTE}
                                        Component={RequestQuotationServiceView}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={COMPLETE_PROFILE_ROUTE}
                                        Component={CompleteProfile}
                                        layout={LayoutTypes.DEFAULT}
                                      />

                                      <WrapperRoute exact path={BRAND_ROUTE} Component={StoreProfile} />
                                      <WrapperRoute exact path={BRANDS_ROUTE} Component={StorePage} />

                                      <WrapperRoute
                                        exact
                                        path={PROFESSIONAL_PUBLIC_ROUTE}
                                        Component={ProfessionalProfile}
                                      />
                                      <WrapperRoute exact path={PROFESSIONALS_ROUTE} Component={Professionals} />

                                      <WrapperRoute
                                        exact
                                        path={PRODUCTS_MAIN_ROUTE}
                                        Component={Departments}
                                        enabledFeatures={[ECOMMERCE_FEATURE]}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={PRODUCTS_ROUTE}
                                        Component={SubDepartmentPage}
                                        enabledFeatures={[ECOMMERCE_FEATURE]}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={PRODUCT_ROUTE}
                                        Component={ProductDetails}
                                        enabledFeatures={[ECOMMERCE_FEATURE]}
                                      />

                                      <WrapperRoute
                                        exact
                                        path={PRIVACY_POLICY}
                                        Component={PrivacyPolicy}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={ADD_REVIEW}
                                        Component={AddReview}
                                        enabledFeatures={[ECOMMERCE_FEATURE]}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={UPDATE_REVIEW}
                                        Component={AddReview}
                                        enabledFeatures={[ECOMMERCE_FEATURE]}
                                      />
                                      <WrapperRoute exact path={CONTACT_US_ROUT} Component={ContactUs} />
                                      <WrapperRoute
                                        exact
                                        path={WHO_WE_ARE_ROUTE}
                                        Component={WhoWeAre}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={TERMS_AND_CONDITIONS_ROUTE}
                                        Component={TermsAndConditions}
                                      />
                                      <WrapperRoute exact path={PUBLIC_PROFILE_ROUTE} Component={PublicProfile} />
                                      <WrapperRoute
                                        exact
                                        path={CLIENTS_LANDING_PAGE_ROUTE}
                                        Component={ClientsLandingPage}
                                        layout={LayoutTypes.LANDING_PAGES}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={PROFESSIONALS_LANDING_PAGE_ROUTE}
                                        Component={ProfessionalsLandingPage}
                                        layout={LayoutTypes.LANDING_PAGES}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={`${VENDOR_ROUTE}/:id`}
                                        Component={VendorProfile}
                                        layout={LayoutTypes.DEFAULT}
                                        enabledFeatures={[ECOMMERCE_FEATURE]}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={CHECKOUT_ROUTE}
                                        Component={isEcommerce ? Checkout : FailurePage}
                                        layout={LayoutTypes.DEFAULT}
                                        enabledFeatures={[]}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={`${CHECKOUT_ROUTE}/payment-status/redirect`}
                                        Component={isEcommerce ? StepPaymentStatus : FailurePage}
                                        layout={LayoutTypes.DEFAULT}
                                        enabledFeatures={[]}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={`${CHECKOUT_ROUTE}/:tabId`}
                                        Component={isEcommerce ? Checkout : FailurePage}
                                        layout={LayoutTypes.DEFAULT}
                                        enabledFeatures={[]}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={COMING_SOON_ROUTE}
                                        Component={ComingSoon}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={REQUEST_GIG_SERVICE_ROUTE}
                                        Component={RequestGigPage}
                                        layout={LayoutTypes.WithoutFooterLayout}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={MESSENGER_ROUTE}
                                        Component={Messenger}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={MESSENGER_MOBILE_ROUTE}
                                        Component={MobileMessenger}
                                        layout={LayoutTypes.CONTENT_ONLY}
                                      />

                                      <WrapperRoute
                                        exact
                                        path={MANZILIK_AI_ROUTE}
                                        Component={ManzilikAiPage}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={`${MANZILIK_AI_SUGGESTED_PRODUCTS_ROUTE}/:id`}
                                        Component={SuggestedProductsPage}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={AI_CHECKOUT_ROUTE}
                                        Component={AiCheckout}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={HOW_MANZILIK_AI_ROUTE}
                                        Component={HowManzilikAiWorks}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={`${MANZILIK_AI_DESIGN_DETAILS}/:id`}
                                        Component={DesignDetails}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={AI_RESULTS_ROUTE}
                                        Component={AIResults}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={AI_CHECKOUT_REDIRECT_ROUTE}
                                        Component={StatusPage}
                                        layout={LayoutTypes.DEFAULT}
                                      />

                                      <WrapperRoute
                                        exact
                                        path={CLIENT_TYPE_PAGE}
                                        Component={ClientTypePage}
                                        layout={LayoutTypes.CONTENT_ONLY}
                                      />

                                      <WrapperRoute
                                        exact
                                        path={PROFESSIONAL_RFQ_ROUTE}
                                        Component={QuotationsDetails}
                                        layout={LayoutTypes.DEFAULT}
                                      />
                                      <WrapperRoute
                                        exact
                                        path={REQUESTS_FOR_QUOTATIONS}
                                        Component={RequestsForQuotations}
                                        layout={LayoutTypes.DEFAULT}
                                      />

                                      <WrapperRoute path={'*'} Component={FailurePage} layout={LayoutTypes.DEFAULT} />
                                    </Switch>
                                  </ModalProvider>
                                </I18nextProvider>
                              </ManzilikAiProvider>
                            </ObjectRecognitionProvider>
                          </CompleteProfileProvider>
                          {!isContentOnly && <WebToApp />}
                        </SendBirdProvider>
                      </GigsServicesProvider>
                    </SharedStateProvider>
                  </PreviousHistoryProvider>
                </GigsStepsProvider>
              </TutorialProvider>
            </MainProvider>
          </RemoteConfigProvider>
        </IntercomProvider>
      </Router>
    </Suspense>
  );
};

if (REACT_APP_SENTRY && REACT_APP_SENTRY != 'sentry') {
  //docs.sentry.io/platforms/javascript/guides/react/
  https: Sentry.init({
    dsn: REACT_APP_SENTRY,
    integrations: [new Integrations.BrowserTracing()],
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 0.25,
  });
}
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
