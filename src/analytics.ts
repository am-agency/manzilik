import GA4 from 'google-analytics-ga4';
import { getCityNameById } from './utils/cities_utiles';
import { usePersistedState } from './hooks/usePersistedState';
let recentUserProps: AnalyticsHomeOwnerProps | AnalyticsProfessionalProps | null = null;

const propertyId = process.env.REACT_APP_WEB_PROPERTY_ID;
const { getItem } = usePersistedState('userId');
const userId = getItem();

if (propertyId) {
  GA4.initialize(propertyId);
}
interface AnalyticsHomeOwnerProps {
  User_type: 'Home Owner';
  Registered_at: Date;
  Last_login: Date;
  Comments_count: number;
  Discussions_count: number;
}

interface AnalyticsProfessionalProps {
  User_type: 'Professional';
  Registered_at: Date;
  Verified: 'verified' | 'unverified';
  Last_login: Date;
  Portfolio_count: number;
  Rating: number;
  Followers_count: number;
}

export const analyticsSetUserProperties = (props: AnalyticsHomeOwnerProps | AnalyticsProfessionalProps) => {
  recentUserProps = props;
};

export enum AnalyticsEventName {
  Login = 'login',
  VerifyUser = 'verify_user',
  SignUp = 'sign_up',
  UploadPortfolio = 'upload_portfolio',
  StartDiscussion = 'start_discussion',
  SubmitComment = 'submit_comment',
  RateProfessional = 'rate_professional',
  FollowProfessional = 'follow_professional',
  MessageProfessional = 'message_professional',
  Like = 'like',
  SaveItem = 'save_item',
  Search = 'search',
  ShareItem = 'share_item',
  showContactInformation = 'show_contact_information',
  contact_client = 'contact_client',
  quick_professional_reg = 'quick_professional_reg',
  success_quick_reg = 'success_quick_reg',
  click_tag = 'click_tag',
  select_item = 'select_item',
  manage_gigs = 'manage_gigs',
  initiate_add_gig = 'initiate_add_gig',
  add_gig = 'add_gig',
  initiate_chat = 'initiate_chat',
  open_chat = 'open_chat',
  open_chat_list = 'open_chat_list',
  click_gigs = 'click_gigs',
  select_gig_service = 'select_gig_service',
  empty_gigs = 'empty_gigs',
  select_gig_city = 'select_gig_city',
  find_pro = 'find_pro',
  select_gig = 'select_gig',
  select_similar_gig = 'select_similar_gig',
  start_gig_request = 'start_gig_request',
  view_last_step = 'view_last_step',
  gig_login = 'gig_login',
  gig_signup = 'gig_signup',
  submit_gig = 'submit_gig',
  open_pro_gigs = 'open_pro_gigs',
  complete_service = 'complete_service',
  cancel_service = 'cancel_service',
  OpenManzilikAI = 'open_manzilik_ai',
  ViewPackagesAI = 'view_packages_ai',
  SelectPackage = 'select_package',
  InitiateCreditPurchaseAI = 'initiate_credit_purchase_ai',
  SuccessPurchase = 'success_purchase',
  FailedPurchase = 'failed_purchase',
  InitiateGenerationAI = 'initiate_generation_ai',
  StartGenerateAI = 'start_generate_ai',
  ViewInfoAI = 'view_info_ai',
  ViewResultsAI = 'view_results_ai',
  SelectDesignAI = 'select_design_ai',
  SendToManzilikAI = 'send_to_manzilik_ai',
  AddInquiry = 'add_inquiry',
  ShareAIDesign = 'share_ai_design',
  RateAIDesign = 'rate_ai_design',
  ClickAIBanner = 'click_ai_banner',
  HowAIWorks = 'how_ai_works',
  ViewAccountType = 'view_account_type',
  SelectAccountType = 'select_account_type',
  CloseAddGigTutorial = 'close_add_gig_tutorial',
  InitiateAddGig = 'initiate_add_gig',
  ViewAddGigTutorial = 'view_add_gig_tutorial',
  StartAddGigTutorial = 'start_add_gig_tutorial',
  TutorialAddGigFirst = 'tutorial_add_gig_first',
  TutorialAddGigSecond = 'tutorial_add_gig_second',
  TutorialAddGigThird = 'tutorial_add_gig_third',
  TutorialAddGigEnd = 'tutorial_add_gig_end',
  clickLabel = 'click_label',
  viewSimilarProducts = 'view_similar_products',
  viewProduct = 'view_product',
  filterManufacturer = 'filter_manufacturer',
  viewHiddenProducts = 'view_hidden_products',
  viewHiddenManufacturer = 'view_hidden_manufacturer',
  viewManufacturerFilter = 'view_manufacturer_filter',
  viewHiddenFilter = 'view_Hidden_filter',
  confirmSubPoints = 'confirm_sub_points',
  pointsConsumedMobile = 'points_consumed_mobile',
}

export class AnalyticsQuickProfessionalRegEvent implements AnalyticsEvent {
  name = AnalyticsEventName.quick_professional_reg;
  params: unknown;
}

export class AnalyticsSuccessQuickRegEvent implements AnalyticsEvent {
  name = AnalyticsEventName.success_quick_reg;
  params: unknown;
}

interface AnalyticsShowContactInformationEventParams {
  user_name: string; // user email or mobile - visitor in case of user as guest
  contactName: string; // professional name or brand name
}

export class AnalyticsShowContactInformationEvent implements AnalyticsEvent {
  name = AnalyticsEventName.showContactInformation;
  params: AnalyticsShowContactInformationEventParams;
  constructor(contactName: string, user_name: string, isAuthenticated: boolean) {
    this.params = { contactName, user_name: isAuthenticated ? user_name : 'visitor' };
  }
}

export interface AnalyticsEvent {
  name: string;
  params: unknown;
}

interface AnalyticsContactClientParams {
  contactMethod: 'call' | 'whatsapp';
  user_id?: string;
}

export class AnalyticsContactClient implements AnalyticsEvent {
  name = AnalyticsEventName.contact_client;
  params: AnalyticsContactClientParams;
  constructor(contactMethod: AnalyticsContactClientParams['contactMethod']) {
    this.params = {
      contactMethod,
      user_id: userId,
    };
  }
}

export class AnalyticsLoginEvent implements AnalyticsEvent {
  name = AnalyticsEventName.Login;
  params: unknown;
}
export class AnalyticsVerifyUserEvent implements AnalyticsEvent {
  name = AnalyticsEventName.VerifyUser;
  params: unknown;
}
export class AnalyticsSignupEvent implements AnalyticsEvent {
  name = AnalyticsEventName.SignUp;
  params: unknown;
}

interface AnalyticsUploadPortfolioEventParams {
  professional_id: string;
}
export class AnalyticsUploadPortfolioEvent implements AnalyticsEvent {
  name = AnalyticsEventName.UploadPortfolio;
  params: AnalyticsUploadPortfolioEventParams;
  constructor(professional_id: string) {
    this.params = { professional_id };
  }
}
export class AnalyticsStartDiscussionEvent implements AnalyticsEvent {
  name = AnalyticsEventName.StartDiscussion;
  params: unknown;
}

interface AnalyticsSubmitCommentEventParams {
  resourceId: string;
  content: string;
  user_id?: string;
}
export class AnalyticsSubmitCommentEvent implements AnalyticsEvent {
  name = AnalyticsEventName.SubmitComment;
  params: AnalyticsSubmitCommentEventParams;
  constructor(content: string, resourceId: string) {
    this.params = { content, resourceId, user_id: userId };
  }
}

interface AnalyticsRateProfessionalEventParams {
  rating: number;
  professional_id: string;
}

export class AnalyticsRateProfessionalEvent implements AnalyticsEvent {
  name = AnalyticsEventName.RateProfessional;
  params: AnalyticsRateProfessionalEventParams;
  constructor(rating: number, professional_id: string) {
    this.params = { rating, professional_id };
  }
}
export class AnalyticsFollowProfessionalEvent implements AnalyticsEvent {
  name = AnalyticsEventName.FollowProfessional;
  params: unknown;
}

interface AnalyticsMessageProfessionalEventParams {
  professional_id: string;
  sender_id: string;
}
export class AnalyticsMessageProfessionalEvent implements AnalyticsEvent {
  name = AnalyticsEventName.MessageProfessional;
  params: AnalyticsMessageProfessionalEventParams;
  constructor(professional_id: string, sender_id: string) {
    this.params = { professional_id, sender_id };
  }
}

export enum ItemType {
  Magazine_article = 'Magazine_article',
  Magazine_tv = 'Magazine_tv',
  Magazine_comment = 'Magazine_comment',
  Discussion_topic = 'Discussion_topic',
  Discussion_comment = 'Discussion_comment',
  Idea = 'Idea',
  Idea_comment = 'Idea_comment',
}

export interface AnalyticsLikeEventParams {
  item_type: ItemType;
  item_id: string;
  user_id?: string;
}

export class AnalyticsLikeEvent implements AnalyticsEvent {
  name = AnalyticsEventName.Like;
  params: AnalyticsLikeEventParams;
  constructor(item_type: ItemType, item_id: string) {
    this.params = { item_id, item_type, user_id: userId };
  }
}

export class AnalyticsSaveItemEvent implements AnalyticsEvent {
  name = AnalyticsEventName.SaveItem;
  params: unknown;
}

interface AnalyticsSearchEventParams {
  term: string;
  user_id?: string;
}

export class AnalyticsSearchEvent implements AnalyticsEvent {
  name = AnalyticsEventName.Search;
  params: AnalyticsSearchEventParams;
  constructor(term: string) {
    this.params = { term, user_id: userId };
  }
}

export interface AnalyticsShareItemEventParams {
  item: 'product' | 'idea' | 'article';
  user_id?: string;
}

export class AnalyticsShareItemEvent implements AnalyticsEvent {
  name = AnalyticsEventName.ShareItem;
  params: AnalyticsShareItemEventParams;
  constructor(item: AnalyticsShareItemEventParams['item']) {
    this.params = { item, user_id: userId };
  }
}

export class AnalyticsClickItemTag implements AnalyticsEvent {
  name = AnalyticsEventName.click_tag;
  params: unknown;
}

export interface AnalyticsSelectItemParams {
  item: 'shopping' | 'idea' | 'main_page_slider';
  user_id?: string;
}

export class AnalyticsSelectItem implements AnalyticsEvent {
  name = AnalyticsEventName.select_item;
  params: AnalyticsSelectItemParams;
  constructor(item: AnalyticsSelectItemParams['item']) {
    this.params = { item, user_id: userId };
  }
}

export class AnalyticsManageGigsEvent implements AnalyticsEvent {
  name = AnalyticsEventName.manage_gigs;
  params: unknown;
}

export class AnalyticsInitiateAddGigEvent implements AnalyticsEvent {
  name = AnalyticsEventName.initiate_add_gig;
  params: unknown;
}

export interface AnalyticsAddGigEventParams {
  serviceName: string;
  newOrSuggested: string;
  title: string;
  user_id?: string;
}

export class AnalyticsAddGigEvent implements AnalyticsEvent {
  name = AnalyticsEventName.add_gig;
  params: AnalyticsAddGigEventParams;
  constructor(serviceName: string, newOrSuggested: string, title: string) {
    this.params = { serviceName, newOrSuggested, title, user_id: userId };
  }
}
interface AnalyticsInitChatEventParams {
  account_type: string;
  screen: string;
  user_id?: string;
}
interface AnalyticsStartChatEventParams {
  account_type: string;
  trigger: string;
  user_id?: string;
}
interface AnalyticsOpenChatListEventParams {
  trigger: string;
  account_type: string;
  user_id?: string;
}
export class AnalyticsInitChat implements AnalyticsEvent {
  name = AnalyticsEventName.initiate_chat;
  params: AnalyticsInitChatEventParams;
  constructor(account_type: string, screen: string) {
    this.params = { account_type, screen, user_id: userId };
  }
}
export class AnalyticsOpenChat implements AnalyticsEvent {
  name = AnalyticsEventName.open_chat;
  params: AnalyticsStartChatEventParams;
  constructor(account_type: string, trigger: string) {
    this.params = { account_type, trigger, user_id: userId };
  }
}

export class AnalyticsOpenChatList implements AnalyticsEvent {
  name = AnalyticsEventName.open_chat_list;
  params: AnalyticsOpenChatListEventParams;
  constructor(trigger: string, account_type: string) {
    this.params = { trigger, account_type, user_id: userId };
  }
}

// Gig Request Events
export class AnalyticsClickGigs implements AnalyticsEvent {
  name = AnalyticsEventName.click_gigs;
  params: unknown;
}

export class AnalyticsSelectSimilarGig implements AnalyticsEvent {
  name = AnalyticsEventName.select_similar_gig;
  params: unknown;
}

interface AnalyticsSelectGigServiceParams {
  service: string;
  user_id?: string;
}

export class AnalyticsSelectGigService implements AnalyticsEvent {
  name = AnalyticsEventName.select_gig_service;
  params: AnalyticsSelectGigServiceParams;
  constructor(service: string) {
    this.params = { service, user_id: userId };
  }
}

interface AnalyticsCityAndEmptyGigParams {
  city: string;
  service: string;
  user_id?: string;
}

export class AnalyticsEmptyGig implements AnalyticsEvent {
  name = AnalyticsEventName.empty_gigs;
  params: AnalyticsCityAndEmptyGigParams;
  constructor(service: string, city: string) {
    this.params = { service, city: getCityNameById(city), user_id: userId };
  }
}

export class AnalyticsSelectGigCity implements AnalyticsEvent {
  name = AnalyticsEventName.select_gig_city;
  params: AnalyticsCityAndEmptyGigParams;
  constructor(service: string, city: string) {
    this.params = { service, city: getCityNameById(city), user_id: userId };
  }
}

interface AnalyticsFindProParams {
  city: string;
  service: string;
  screen: string;
  user_id?: string;
}

export class AnalyticsFindPro implements AnalyticsEvent {
  name = AnalyticsEventName.find_pro;
  params: AnalyticsFindProParams;
  constructor(service: string, city: string, screen: string) {
    this.params = { service, city, screen, user_id: userId };
  }
}

interface AnalyticsSelectGigParams {
  gig_id: string;
  gig_title: string;
  service: string;
  city: string;
  professional_id: string;
  screen: string;
}

export class AnalyticsSelectGig implements AnalyticsEvent {
  name = AnalyticsEventName.select_gig;
  params: AnalyticsSelectGigParams;
  constructor(
    service: string,
    city: string,
    gig_id: string,
    gig_title: string,
    professional_id: string,
    screen: string
  ) {
    this.params = { service, city, gig_id, gig_title, professional_id, screen };
  }
}

interface AnalyticsStartGigRequestParams {
  gig_id: string;
  gig_title: string;
  service: string;
  city: string;
  screen?: string;
  user_id?: string;
}

export class AnalyticsStartGigRequest implements AnalyticsEvent {
  name = AnalyticsEventName.start_gig_request;
  params: AnalyticsStartGigRequestParams;
  constructor(service: string, city: string, gig_id: string, gig_title: string, screen?: string) {
    this.params = { service, city, gig_id, gig_title, screen, user_id: userId };
  }
}

export class AnalyticsViewLastStep implements AnalyticsEvent {
  name = AnalyticsEventName.view_last_step;
  params: AnalyticsStartGigRequestParams;
  constructor(service: string, city: string, gig_id: string, gig_title: string, screen?: string) {
    this.params = { service, city, gig_id, gig_title, screen, user_id: userId };
  }
}

interface AnalyticsGigLoginSignUpParams {
  login_method: string;
  screen?: string;
}

export class AnalyticsLoginGig implements AnalyticsEvent {
  name = AnalyticsEventName.gig_login;
  params: AnalyticsGigLoginSignUpParams;
  constructor(login_method: string, screen?: string) {
    this.params = { login_method, screen };
  }
}

export class AnalyticsSignUpGig implements AnalyticsEvent {
  name = AnalyticsEventName.gig_signup;
  params: AnalyticsGigLoginSignUpParams;
  constructor(login_method: string, screen?: string) {
    this.params = { login_method, screen };
  }
}

export class AnalyticsSubmitGig implements AnalyticsEvent {
  name = AnalyticsEventName.submit_gig;
  params: AnalyticsSelectGigParams;
  constructor(
    service: string,
    city: string,
    gig_id: string,
    gig_title: string,
    professional_id: string,
    screen: string
  ) {
    this.params = { service, city, gig_id, gig_title, professional_id, screen };
  }
}

interface AnalyticsOpenProGigsParams {
  triggered_from: string;
  pro_id: string;
}
export class AnalyticsOpenProGigs implements AnalyticsEvent {
  name = AnalyticsEventName.open_pro_gigs;
  params: AnalyticsOpenProGigsParams;
  constructor(triggered_from: string, pro_id: string) {
    this.params = { triggered_from, pro_id };
  }
}

interface AnalyticsCompleteServiceParams {
  clientID: string;
}

export class AnalyticsCompleteService implements AnalyticsEvent {
  name = AnalyticsEventName.complete_service;
  params: AnalyticsCompleteServiceParams;
  constructor(clientID: string) {
    this.params = { clientID };
  }
}

interface AnalyticsCancelServiceParams {
  canceled_by: string;
  type: string;
  user_id?: string;
}

export class AnalyticsCancelService implements AnalyticsEvent {
  name = AnalyticsEventName.cancel_service;
  params: AnalyticsCancelServiceParams;
  constructor(canceled_by: string, type: string) {
    this.params = { canceled_by, type, user_id: userId };
  }
}
interface AnalyticsOpenManzilikAIEventParams {
  userType: string;
  user_id?: string;
}

interface AnalyticsViewPackagesAIEventParams {
  screen: string;
  user_id?: string;
}

interface AnalyticsSelectPackageEventParams {
  screen: string;
  packagePrice: number;
  packageCredits: number;
  user_id?: string;
}

interface AnalyticsInitiateCreditPurchaseAIEventParams {
  screen: string;
  packagePrice: number;
  packageCredits: number;
  user_id?: string;
}

interface AnalyticsSuccessPurchaseEventParams {
  packagePrice: number;
  packageCredits: number;
  user_id?: string;
}

interface AnalyticsFailedPurchaseEventParams {
  packagePrice: number;
  packageCredits: number;
  userID: string;
}

interface AnalyticsInitiateGenerationAIEventParams {
  screen: string;
  user_id?: string;
}

interface AnalyticsStartGenerateAIEventParams {
  style: string;
  roomtype: string;
  privacy: string;
  generationCost: number;
  creditType: string;
  user_id?: string;
}

interface AnalyticsViewInfoAIEventParams {
  info: string;
  user_id?: string;
}

interface AnalyticsSelectDesignAIEventParams {
  design: string;
  user_id?: string;
}

interface AnalyticsSendToManzilikAIEventParams {
  hasMobile: string;
  user_id?: string;
}

interface AnalyticsAddInquiryEventParams {
  screen: string;
  user_id?: string;
}

interface AnalyticsShareAIDesignEventParams {
  action: string;
  user_id?: string;
}

interface AnalyticsRateAIDesignEventParams {
  rate: number;
  user_id?: string;
}

interface AnalyticsClickAIBannerEventParams {
  screen: string;
  creditNumber: number;
  creditType: string;
  user_id?: string;
}

interface AnalyticsHowAIWorksEventParams {
  screen: string;
  user_id?: string;
}

interface AnalyticsViewAccountTypeEventParams {
  cogId: string;
}

interface AnalyticsSelectAccountTypeEventParams {
  type: string;
  userId: string;
}

export class AnalyticsOpenManzilikAIEvent implements AnalyticsEvent {
  name = AnalyticsEventName.OpenManzilikAI;
  params: AnalyticsOpenManzilikAIEventParams;
  constructor(userType: string) {
    this.params = { userType, user_id: userId };
  }
}

export class AnalyticsViewPackagesAIEvent implements AnalyticsEvent {
  name = AnalyticsEventName.ViewPackagesAI;
  params: AnalyticsViewPackagesAIEventParams;
  constructor(screen: string) {
    this.params = { screen, user_id: userId };
  }
}

export class AnalyticsSelectPackageEvent implements AnalyticsEvent {
  name = AnalyticsEventName.SelectPackage;
  params: AnalyticsSelectPackageEventParams;
  constructor(screen: string, packagePrice: number, packageCredits: number) {
    this.params = { screen, packagePrice, packageCredits, user_id: userId };
  }
}

export class AnalyticsInitiateCreditPurchaseAIEvent implements AnalyticsEvent {
  name = AnalyticsEventName.InitiateCreditPurchaseAI;
  params: AnalyticsInitiateCreditPurchaseAIEventParams;
  constructor(screen: string, packagePrice: number, packageCredits: number) {
    this.params = { screen, packagePrice, packageCredits, user_id: userId };
  }
}

export class AnalyticsSuccessPurchaseEvent implements AnalyticsEvent {
  name = AnalyticsEventName.SuccessPurchase;
  params: AnalyticsSuccessPurchaseEventParams;
  constructor(packagePrice: number, packageCredits: number) {
    this.params = { packagePrice, packageCredits, user_id: userId };
  }
}

export class AnalyticsFailedPurchaseEvent implements AnalyticsEvent {
  name = AnalyticsEventName.FailedPurchase;
  params: AnalyticsFailedPurchaseEventParams;
  constructor(packagePrice: number, packageCredits: number, userID: string) {
    this.params = { packagePrice, packageCredits, userID };
  }
}

export class AnalyticsInitiateGenerationAIEvent implements AnalyticsEvent {
  name = AnalyticsEventName.InitiateGenerationAI;
  params: AnalyticsInitiateGenerationAIEventParams;
  constructor(screen: string) {
    this.params = { screen, user_id: userId };
  }
}

export class AnalyticsStartGenerateAIEvent implements AnalyticsEvent {
  name = AnalyticsEventName.StartGenerateAI;
  params: AnalyticsStartGenerateAIEventParams;
  constructor(style: string, roomtype: string, privacy: string, generationCost: number, creditType: string) {
    this.params = { style, roomtype, privacy, generationCost, creditType, user_id: userId };
  }
}

export class AnalyticsViewInfoAIEvent implements AnalyticsEvent {
  name = AnalyticsEventName.ViewInfoAI;
  params: AnalyticsViewInfoAIEventParams;
  constructor(info: string) {
    this.params = { info, user_id: userId };
  }
}

export class AnalyticsViewResultsAIEvent implements AnalyticsEvent {
  name = AnalyticsEventName.ViewResultsAI;
  params: {};
  constructor() {
    this.params = {};
  }
}

export class AnalyticsSelectDesignAIEvent implements AnalyticsEvent {
  name = AnalyticsEventName.SelectDesignAI;
  params: AnalyticsSelectDesignAIEventParams;
  constructor(design: string) {
    this.params = { design, user_id: userId };
  }
}

export class AnalyticsSendToManzilikAIEvent implements AnalyticsEvent {
  name = AnalyticsEventName.SendToManzilikAI;
  params: AnalyticsSendToManzilikAIEventParams;
  constructor(hasMobile: string) {
    this.params = { hasMobile, user_id: userId };
  }
}

export class AnalyticsAddInquiryEvent implements AnalyticsEvent {
  name = AnalyticsEventName.AddInquiry;
  params: AnalyticsAddInquiryEventParams;
  constructor(screen: string) {
    this.params = { screen, user_id: userId };
  }
}

export class AnalyticsShareAIDesignEvent implements AnalyticsEvent {
  name = AnalyticsEventName.ShareAIDesign;
  params: AnalyticsShareAIDesignEventParams;
  constructor(action: string) {
    this.params = { action, user_id: userId };
  }
}

export class AnalyticsRateAIDesignEvent implements AnalyticsEvent {
  name = AnalyticsEventName.RateAIDesign;
  params: AnalyticsRateAIDesignEventParams;
  constructor(rate: number) {
    this.params = { rate, user_id: userId };
  }
}

export class AnalyticsClickAIBannerEvent implements AnalyticsEvent {
  name = AnalyticsEventName.ClickAIBanner;
  params: AnalyticsClickAIBannerEventParams;
  constructor(screen: string, creditNumber: number, creditType: string) {
    this.params = { screen, creditNumber, creditType, user_id: userId };
  }
}

export class AnalyticsHowAIWorksEvent implements AnalyticsEvent {
  name = AnalyticsEventName.HowAIWorks;
  params: AnalyticsHowAIWorksEventParams;
  constructor(screen: string) {
    this.params = { screen, user_id: userId };
  }
}

export class AnalyticsViewAccountTypeEvent implements AnalyticsEvent {
  name = AnalyticsEventName.ViewAccountType;
  params: AnalyticsViewAccountTypeEventParams;
  constructor(cogId: string) {
    this.params = { cogId };
  }
}

export class AnalyticsSelectAccountTypeEvent implements AnalyticsEvent {
  name = AnalyticsEventName.SelectAccountType;
  params: AnalyticsSelectAccountTypeEventParams;
  constructor(type: string, userId: string) {
    this.params = { type, userId };
  }
}

interface AnalyticsCloseAddGigEventParams {
  step: string;
  user_id?: string;
}
interface AnalyticsInitiateAddGigEventParams {
  screen: string;
  user_id?: string;
}

export class AnalyticCloseAddGigEvent implements AnalyticsEvent {
  name = AnalyticsEventName.CloseAddGigTutorial;
  params: AnalyticsCloseAddGigEventParams;
  constructor(step: string) {
    this.params = { step, user_id: userId };
  }
}

export class AnalyticsInitiateAddGigTutorialEvent implements AnalyticsEvent {
  name = AnalyticsEventName.InitiateAddGig;
  params: AnalyticsInitiateAddGigEventParams;
  constructor(screen: string) {
    this.params = { screen, user_id: userId };
  }
}

export class AnalyticsViewAddGigTutorialEvent implements AnalyticsEvent {
  name = AnalyticsEventName.ViewAddGigTutorial;
  params: unknown;
}

export class AnalyticsStartAddGigTutorialEvent implements AnalyticsEvent {
  name = AnalyticsEventName.StartAddGigTutorial;
  params: unknown;
}

export class AnalyticsTutorialAddGigFirstEvent implements AnalyticsEvent {
  name = AnalyticsEventName.TutorialAddGigFirst;
  params: unknown;
}

export class AnalyticsTutorialAddGigSecondEvent implements AnalyticsEvent {
  name = AnalyticsEventName.TutorialAddGigSecond;
  params: unknown;
}

export class AnalyticsTutorialAddGigThirdEvent implements AnalyticsEvent {
  name = AnalyticsEventName.TutorialAddGigThird;
  params: unknown;
}

export class AnalyticsTutorialAddGigEndEvent implements AnalyticsEvent {
  name = AnalyticsEventName.TutorialAddGigEnd;
  params: unknown;
}

interface AnalyticsLabelParams {
  screen: string;
}

interface AnalyticsManufacturerParams {
  manufacturer_name: string;
}

interface AnalyticsPointsParams {
  points_status: string;
}
export class AnalyticClickLabelEvent implements AnalyticsEvent {
  name = AnalyticsEventName.clickLabel;
  params: AnalyticsLabelParams;
  constructor(screen: string) {
    this.params = { screen: screen };
  }
}

export class AnalyticViewSimilarEvent implements AnalyticsEvent {
  name = AnalyticsEventName.viewSimilarProducts;
  params: AnalyticsLabelParams;
  constructor(screen: string) {
    this.params = { screen: screen };
  }
}

export class AnalyticViewProductEvent implements AnalyticsEvent {
  name = AnalyticsEventName.viewProduct;
  params: AnalyticsManufacturerParams;
  constructor(manufacturer_name: string) {
    this.params = { manufacturer_name };
  }
}
export class AnalyticFilterManufacturerEvent implements AnalyticsEvent {
  name = AnalyticsEventName.filterManufacturer;
  params: AnalyticsManufacturerParams;
  constructor(manufacturer_name: string) {
    this.params = { manufacturer_name };
  }
}

export class AnalyticsViewHiddenProductsEvent implements AnalyticsEvent {
  name = AnalyticsEventName.viewHiddenProducts;
  params: unknown;
}
export class AnalyticsViewHiddenManfacturerEvent implements AnalyticsEvent {
  name = AnalyticsEventName.viewHiddenManufacturer;
  params: unknown;
}

export class AnalyticsViewManfacturerFilterEvent implements AnalyticsEvent {
  name = AnalyticsEventName.viewManufacturerFilter;
  params: unknown;
}

export class AnalyticsViewHiddenFilterEvent implements AnalyticsEvent {
  name = AnalyticsEventName.viewHiddenFilter;
  params: unknown;
}

export class AnalyticsConfirmSubPointsEvent implements AnalyticsEvent {
  name = AnalyticsEventName.confirmSubPoints;
  params: AnalyticsPointsParams;
  constructor(points_status: string) {
    this.params = { points_status };
  }
}

export const PublishEvent = (event: AnalyticsEvent) => {
  if (recentUserProps !== null) {
    GA4.ga('set', 'user_properties', recentUserProps);
    recentUserProps = null;
  }
  GA4.event(event.name, event.params);
};
