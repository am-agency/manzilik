import React, {
  Dispatch,
  FunctionComponent,
  ReactNode,
  Ref,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { initialUserState, UserState } from '../user';
import { authReducer } from './auth_reducer';
import { GlobalAction, User, UserRole } from '../../types';
import { checkAuthenticationDispatcher } from '../user/with_user_authenticator';
import { LoadingOutlined } from '@ant-design/icons';
import { ErrorFactory, ErrorTypes, SystemError } from './error_factory';
import { useTranslation } from 'react-i18next';
import { useIntercom } from 'react-use-intercom';
import { getUserName } from '../../../utils';
//@TODO: remove-after-skeletons
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';
import { LOADING_GLOBAL, LOADING_LOW_PRIORITY_GLOBAL } from './loading_constants';
import { getUserBasket } from '../user/userBasket';
import { getFeatureFlags, getGeneralSettings } from '../api';
import type { FeatureFlag, GeneralSettings } from '../types';
import { FlagsProvider } from 'flagged';
import { Client, Professional } from '../../../API';
import { useProfessional } from '../../../pages/professionals/hooks/useProfessional';
import { listFeatureFlags } from '../../../custom_graphql/queries';
import { Spin } from 'antd';
import { useSendBirdContext } from '../../../context/sendbird_context';
import { useHistory } from 'react-router-dom';

enum FeatureId {
  SERVICE_INQUIRY = 'SERVICE_INQUIRY',
  GIG_SERVICES = 'GIG_SERVICES',
  GIG_SERVICE_CLIENT = 'GIG_SERVICE_CLIENT',
  SERVICE_CHAT = 'SERVICE_CHAT',
  SIMILAR_GIGS = 'SIMILAR_GIGS',
  SERVICE_COMPLETED_FLOW = 'SERVICE_COMPLETED_FLOW',
  MANZILIK_AI_FLOW = 'MANZILIK_AI_FLOW',
  REFERRAL_FLAG = 'REFERRAL_FLAG',
  MANZILIK_AI_IMAGE_STRENGTH = 'MANZILIK_AI_IMAGE_STRENGTH',
  MANZILIK_AI_FORM_EXTRA_OPTIONS = 'MANZILIK_AI_FORM_EXTRA_OPTIONS',
  AI_FLOORS_OPTION = 'AI_FLOORS_OPTION',
  AI_WALLS_OPTION = 'AI_WALLS_OPTION',
  AI_DESC_OPTION = 'AI_DESC_OPTION',
  REQUEST_FOR_QUOTATION = 'REQUEST_FOR_QUOTATION',
  FIRST_LAST_NAME_FLAG = 'FIRST_LAST_NAME_FLAG',
  SHOW_TUTORIAL_ADD_GIGS = 'SHOW_TUTORIAL_ADD_GIGS',
  MANZILIK_AI_DELETE_DESIGN = 'MANZILIK_AI_DELETE_DESIGN',
  AI_OBJECT_RECOGNITION = 'AI_OBJECT_RECOGNITION',
}
export interface ApiResponse {
  message?: string;
  status?: string;
}
interface State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestApi: (fun: Function, params?: any, callback?: Function, loaderIdentifier?: string) => void;
  userState: UserState;
  dispatchUser: Dispatch<GlobalAction>;
  isProfessional: (client: Client) => boolean;
  setProfessional: (professional: Professional) => void;
  toggleShowLoading: Function;
  apiResponse: ApiResponse;
  setApiResponse: Function;
  loadingMap: { [key: string]: boolean };
  generalSettings: GeneralSettings;
  userName: string;
  featureFlags: FeatureFlag[];
  professional?: Professional;
  isAccountTypeSelected?: boolean;
  setIsAccountTypeSelected?: Function;
}

// layout context is the place where we store the public information which will be shared between the children component
export const MainContext = React.createContext<State>({
  requestApi: () => null,
  userState: initialUserState,
  dispatchUser: (action: GlobalAction) => action,
  toggleShowLoading: () => null,
  setProfessional: () => null,
  apiResponse: {},
  setApiResponse: () => null,
  loadingMap: {},
  generalSettings: {
    hyperPayPaymentUrl: '',
    enableEcommerce: false,
    showProfessionalReviews: false,
  },
  userName: '',
  isProfessional: () => false,
  featureFlags: [],
});

export const useMainContext = () => React.useContext(MainContext);

interface Props {
  children: ReactNode;
}

function removeItemFromArray<T>(array: T[], requiredItem: T) {
  return array.filter((item) => item !== requiredItem);
}

function getFunctionName(fun: Function) {
  return fun.name;
}

export const MainProvider: FunctionComponent<Props> = (props: Props) => {
  const { children } = props;
  const [loadingMap, setLoadingMap] = useState<{ [key: string]: boolean }>({});
  const [requests, setRequests] = useState<string[]>([]);
  const [userName, setUserName] = useState('');
  const { setProfessional, professionalUserName, isProfessional, professional } = useProfessional();
  const [userState, dispatchUser] = useReducer(authReducer, initialUserState);
  const [showLoading, toggleShowLoading] = useState<boolean>(true);
  const [apiResponse, setApiResponse] = useState<ApiResponse>({});
  const { isUserLoaded, user, client } = userState;

  const { t } = useTranslation();
  const { boot, update, shutdown } = useIntercom();
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    hyperPayPaymentUrl: '',
    enableEcommerce: false,
    showProfessionalReviews: false,
  });
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [isAccountTypeSelected, setIsAccountTypeSelected] = useState<boolean>(false);

  const history = useHistory();

  useEffect(() => {
    if (userState.role === UserRole.Professional) {
      setUserName(professionalUserName);
    } else {
      const homeOwnerUserName = getUserName(userState.client || userState.user);
      setUserName(homeOwnerUserName);
    }
  }, [userState.client, userState.user, professionalUserName]);

  const setLoading = (key: string, value: boolean) => {
    const finalState = { [key]: value };

    //setting up the low priority global loader
    if (loadingMap[LOADING_LOW_PRIORITY_GLOBAL] && !value && key !== LOADING_LOW_PRIORITY_GLOBAL) {
      // the new loader will take over this one
      finalState[LOADING_LOW_PRIORITY_GLOBAL] = false;
    }

    // incase we dont short circuit this will set the state
    setLoadingMap({ ...loadingMap, ...finalState });
  };

  useEffect(() => {
    checkAuthenticationDispatcher(dispatchUser);
    getUserBasket(dispatchUser);
  }, []);

  useEffect(() => {
    if (isUserLoaded) {
      shutdown();
      boot();
    }
  }, [isUserLoaded]);

  useEffect(() => {
    if (client) {
      update({
        userId: user?.username || user?.sub,
        email: client.email,
        name: getUserName(client),
        phone: user?.phone_number,
      });
    }
  }, [client, user]);

  useEffect(() => {
    update();
  }, [location]);

  async function requestApi(asyncFunction: Function, params?: {}, callback?: Function, loaderIdentifier?: string) {
    // push to the queue
    setRequests((requests) => [...requests, getFunctionName(asyncFunction)]);
    // set the loader to true if there was a loader identifier set
    if (loaderIdentifier) {
      setLoading(loaderIdentifier, true);
    }
    console.debug('start request', getFunctionName(getFunctionName), asyncFunction.name);
    let result = null;
    let errorHandler: SystemError;

    try {
      result = await asyncFunction(params);
      if (callback) {
        callback(result, undefined);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      /**
       * 1- check if error type is CognitoError
       * 2- check if error type is Graphql
       * 3- check if error exist but from unknown source
       * 4- check if there are a callback and no Graphql error
       * 5- check if use is not logged in and there is error, do nothing
       * 6- show notification error if exist
       */

      let errorInstance = ErrorTypes.UNKNOWN;
      if (error.name) {
        errorInstance = ErrorTypes.COGNITO;
      } else if (error.errors) {
        errorInstance = ErrorTypes.API;
      }
      errorHandler = ErrorFactory.getClass(errorInstance, error);
      errorHandler.execute(callback!);
      setApiResponse({ message: errorHandler.message, status: errorHandler.statusCode });
    } finally {
      setRequests((requests) => removeItemFromArray(requests, asyncFunction.name));
      if (loaderIdentifier) {
        setLoading(loaderIdentifier, false);
      }
      console.debug('stop request', asyncFunction.name);
      return result;
    }
  }

  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
  const loaderStates = Object.values(loadingMap);
  const isLoaderShown = !!loaderStates.filter((status) => !!status).length;
  const loaderRef: Ref<LoadingBarRef> = useRef(null);
  const clientTypeFromLocalStorage = localStorage.getItem('clientType') || '';
  useEffect(() => {
    if (loaderRef && typeof loaderRef?.current?.continuousStart === 'function') {
      loaderRef?.current.continuousStart(0, 1000);
    }
  }, [loaderRef.current]);

  useEffect(() => {
    requestApi(getGeneralSettings).then((settings: GeneralSettings) => {
      setGeneralSettings(settings);
    });
    requestApi(getFeatureFlags).then((flags: FeatureFlag[]) => {
      setFeatureFlags(flags);
    });
  }, []);

  const checkIfFeatureEnabled = useMemo(() => {
    return (featureId: FeatureId) => {
      const feature = featureFlags && featureFlags.find((feature) => feature.title === featureId);
      if (!feature) {
        return false;
      }
      return feature.enabled;
    };
  }, [featureFlags]);

  useEffect(() => {
    if (clientTypeFromLocalStorage && clientTypeFromLocalStorage === 'guest' && userState.isAuthenticated) {
      history.push('/client-type');
    } else {
      return;
    }
  }, [userState.role, userState.isAuthenticated]);

  return (
    <MainContext.Provider
      value={{
        isProfessional,
        requestApi,
        userState,
        setProfessional,
        dispatchUser,
        toggleShowLoading,
        apiResponse,
        setApiResponse,
        loadingMap,
        generalSettings,
        userName,
        featureFlags,
        professional,
        isAccountTypeSelected,
        setIsAccountTypeSelected,
      }}
    >
      <FlagsProvider
        features={{
          ecommerce: generalSettings?.enableEcommerce || false,
          serviceInquiry: checkIfFeatureEnabled(FeatureId.SERVICE_INQUIRY),
          gigServices: checkIfFeatureEnabled(FeatureId.GIG_SERVICES),
          gigServiceClient: checkIfFeatureEnabled(FeatureId.GIG_SERVICE_CLIENT),
          serviceChat: checkIfFeatureEnabled(FeatureId.SERVICE_CHAT),
          similarGigs: checkIfFeatureEnabled(FeatureId.SIMILAR_GIGS),
          serviceCompletedFlow: checkIfFeatureEnabled(FeatureId.SERVICE_COMPLETED_FLOW),
          manzilikAiFlow: checkIfFeatureEnabled(FeatureId.MANZILIK_AI_FLOW),
          referralFlag: checkIfFeatureEnabled(FeatureId.REFERRAL_FLAG),
          manzilikAiImageStrength: checkIfFeatureEnabled(FeatureId.MANZILIK_AI_IMAGE_STRENGTH),
          manzilikAiFormExtraOptions: checkIfFeatureEnabled(FeatureId.MANZILIK_AI_FORM_EXTRA_OPTIONS),
          aiFloorsOption: checkIfFeatureEnabled(FeatureId.AI_FLOORS_OPTION),
          aiWallsOption: checkIfFeatureEnabled(FeatureId.AI_WALLS_OPTION),
          aiDescOption: checkIfFeatureEnabled(FeatureId.AI_DESC_OPTION),
          requestForQuotation: checkIfFeatureEnabled(FeatureId.REQUEST_FOR_QUOTATION),
          firstLastNameFlag: checkIfFeatureEnabled(FeatureId.FIRST_LAST_NAME_FLAG),
          showTutorialAddGigs: checkIfFeatureEnabled(FeatureId.SHOW_TUTORIAL_ADD_GIGS),
          manzilikAiDeleteDesign: checkIfFeatureEnabled(FeatureId.MANZILIK_AI_DELETE_DESIGN),
          aiObjectRecognition: checkIfFeatureEnabled(FeatureId.AI_OBJECT_RECOGNITION),
        }}
      >
        <div className="loader__bar">
          {isLoaderShown && (
            <>
              <LoadingBar color="#bcb39a" ref={loaderRef} />
            </>
          )}
        </div>
        {/* <div className="dev-debugger">
        <p>This panel is only to track the api requests.</p>
        <h3>API Requests Queue ({requests.length})</h3>
        <ul>
          {requests.map((request, index) => (
            <li key={index}>{request}</li>
          ))}


        </ul>
      </div> */}
        {(loadingMap[LOADING_GLOBAL] || loadingMap[LOADING_LOW_PRIORITY_GLOBAL]) && ( //
          <div className="spinner-wrapper">
            <Spin spinning size="large" indicator={antIcon}></Spin>
          </div>
        )}
        {isUserLoaded && (
          <div style={{ position: 'relative' }} className="body-wrapper">
            {children}
          </div>
        )}
      </FlagsProvider>
    </MainContext.Provider>
  );
};
