import React, { createContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { City, Client, Banner as GlobalBanner, Professional, Project, RoomType, Service, ServiceInquiry } from '../API';
import { useMainContext } from '../app/providers/main';
import { getAuthenticatedClientData, listMyProjects, listRoomTypes } from '../pages/projects/api';
import { DepartmentsMenu, Menu } from '../app/providers/types';
import { getBannerDetails, getIdeasMenu, getShoppingMenu } from '../app/providers/api';
import { useHistory } from 'react-router-dom';
import { listServices } from '../pages/professionals/api';
import { BannerSlug } from '../constants';
import { listCities } from '../pages/profile/api';
import { toArrayOrEmpty } from '../pages/idea/utils';
import { usePersistedState } from '../hooks/usePersistedState';

export interface SharedStateInterface {
  clientData: Client;
  isClientDataLoading: boolean;
  projects: Project[];
  projectsCount: number;
  isProjectsLoading: boolean;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  refreshGetClientData: () => void;
  roomTypes: RoomType[];
  isRoomTypesLoading: boolean;
  ideasMenu: Menu;
  isIdeasMenuLoading: boolean;
  shoppingMenu: DepartmentsMenu[];
  isShoppingMenuLoading: boolean;
  defaultCountry?: string;
  currentScreenName: string;
  setCurrentScreenName?: React.Dispatch<React.SetStateAction<string>>;
  listOfServices?: Service[];
  isListServicesLoading?: boolean;
  banner?: GlobalBanner;
  isBannerLoading?: boolean;
  bannerSlug?: BannerSlug;
  setBannerSlug?: React.Dispatch<React.SetStateAction<BannerSlug>>;
  cities?: City[];
  isCityLoading?: boolean;
  isProfessional?: boolean;
  professional?: Professional;
  setProfessional?: React.Dispatch<React.SetStateAction<Professional | undefined>>;
  canceledServiceInquires?: ServiceInquiry;
  setCanceledServiceInquires?: React.Dispatch<React.SetStateAction<ServiceInquiry | undefined>>;
  aiRfqInquiry?: ServiceInquiry;
  setAiRfqInquiry?: React.Dispatch<React.SetStateAction<ServiceInquiry | undefined>>;
}

interface SharedStateContextProviderProps {
  children: React.ReactNode;
}

const SharedStateContext = createContext<SharedStateInterface | undefined>(undefined);

const SharedStateProvider = ({ children }: SharedStateContextProviderProps) => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const { pathname, search } = history.location;
  const { setItem } = usePersistedState('userId');

  const { requestApi, userState } = useMainContext();
  // get Client Data
  const [clientData, setClientData] = useState<Client>({} as Client);
  const [isClientDataLoading, setIsClientDataLoading] = useState<boolean>(false);
  // get Projects List
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsCount, setProjectsCount] = useState<number>(0);

  const [isProjectsLoading, setIsProjectsLoading] = useState<boolean>(false);
  // get list room types
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isRoomTypesLoading, setIsRoomTypesLoading] = useState<boolean>(false);
  // get ideas menu
  const [ideasMenu, setIdeasMenu] = useState<Menu>({} as Menu);
  const [isIdeasMenuLoading, setIsIdeasMenuLoading] = useState<boolean>(false);
  // get shopping menu
  const [shoppingMenu, setShoppingMenu] = useState<DepartmentsMenu[]>({} as DepartmentsMenu[]);
  const [isShoppingMenuLoading, setIsShoppingMenuLoading] = useState<boolean>(false);

  // get list of services
  const [listOfServices, setListOfServices] = useState<Service[]>([]);
  const [isListServicesLoading, setIsListServicesLoading] = useState<boolean>(false);

  // get current screen name
  const [currentScreenName, setCurrentScreenName] = useState<string>('');

  // get Banner
  const [banner, setBanner] = useState<GlobalBanner | undefined>();
  const [isBannerLoading, setIsBannerLoading] = useState<boolean>(false);
  const [bannerSlug, setBannerSlug] = useState<BannerSlug>(BannerSlug.MAGAZINE_BANNER);

  // get list of cities
  const [cities, setCities] = useState<City[]>([]);
  const [isCityLoading, setIsCityLoading] = useState<boolean>(false);

  // is Professional

  // get Professional
  const [professional, setProfessional] = useState<Professional>();

  const defaultCountry = 'a8358a7e-4fae-4fbe-8e48-ecefccf440b8';
  const isProfessional = JSON.parse(localStorage.getItem('isProf')!);

  //get canceled/ closed / rejected service inquires
  const [canceledServiceInquires, setCanceledServiceInquires] = useState<ServiceInquiry>();
  const [aiRfqInquiry, setAiRfqInquiry] = useState<ServiceInquiry>();

  const getClientData = () => {
    setIsClientDataLoading(true);
    requestApi(getAuthenticatedClientData, {}, (clientData: Client, error: string) => {
      if (error) {
        return;
      }

      setClientData(clientData);
      setItem(clientData.id);
    });
  };

  const getServices = async () => {
    setIsListServicesLoading(true);
    requestApi(listServices, { limit: 200 }, (list: Service[], error: string) => {
      if (error) {
        return;
      }
      setIsListServicesLoading(false);
      setListOfServices(list);
    });
  };

  const getProjectsList = () => {
    setIsProjectsLoading(true);
    requestApi(
      listMyProjects,
      { limit: 4, offset: 0 },
      (myProjects: { results: Project[]; count: number }, error: string) => {
        if (error) {
          return;
        }
        setProjects(myProjects.results);
        setProjectsCount(myProjects.count);
        setIsProjectsLoading(false);
      }
    );
  };

  const getRoomTypes = () => {
    setIsRoomTypesLoading(true);
    requestApi(listRoomTypes, { limit: 50, offset: 0 }, (list: RoomType[], error: string) => {
      if (error) {
        return;
      }
      setRoomTypes(list);
      setIsRoomTypesLoading(false);
    });
  };

  const getIdeasMenuRequest = () => {
    setIsIdeasMenuLoading(true);
    requestApi(getIdeasMenu, {}, (response: Menu, error: string) => {
      if (error) {
        return;
      }
      setIsIdeasMenuLoading(false);
      setIdeasMenu(response);
    });
  };

  const getShoppingMenuList = () => {
    setIsShoppingMenuLoading(true);
    requestApi(getShoppingMenu, {}, (response: DepartmentsMenu[], error: string) => {
      if (error) {
        return;
      }
      setIsShoppingMenuLoading(false);
      setShoppingMenu(response);
    });
  };

  const refreshGetClientData = () => {
    getClientData();
  };

  const getBanner = (bannerType: BannerSlug) => {
    setIsBannerLoading(true);
    requestApi(
      getBannerDetails,
      {
        slug: bannerType,
      },
      (response: GlobalBanner, error: string) => {
        if (error) {
          return;
        }
        setIsBannerLoading(false);
        setBanner(response!);
      }
    );
  };
  const listCitiesOfCountry = (query?: string) => {
    setIsCityLoading(true);
    requestApi(
      listCities,
      { resourceId: defaultCountry, offset: 0, limit: 1000, query },
      (response: City[], error: string) => {
        if (error) {
          return;
        }
        setIsCityLoading(false);
        setCities(toArrayOrEmpty(response));
      }
    );
  };

  useEffect(() => {
    getClientData();
    getRoomTypes();
    getIdeasMenuRequest();
    getShoppingMenuList();
    getServices();
    listCitiesOfCountry();
    if (userState.user?.email) {
      getProjectsList();
    }
  }, [i18n.language]);

  useEffect(() => {
    getBanner(bannerSlug);
  }, [bannerSlug, i18n.language]);

  useEffect(() => {
    if (pathname.includes('professional')) {
      setCurrentScreenName('pro public profile');
    } else if (pathname.includes('idea')) {
      setCurrentScreenName('idea slider');
    } else if (pathname.includes('magazine')) {
      setCurrentScreenName('magazine slider');
    } else if (pathname.includes('discussion')) {
      setCurrentScreenName('discussion slider');
    } else if (search.includes('step=3')) {
      setCurrentScreenName('gig wizard');
    }
  }, [pathname]);

  const contextValue: SharedStateInterface = {
    clientData,
    isClientDataLoading,
    projects,
    projectsCount,
    isProjectsLoading,
    setProjects,
    refreshGetClientData,
    roomTypes,
    isRoomTypesLoading,
    ideasMenu,
    isIdeasMenuLoading,
    shoppingMenu,
    isShoppingMenuLoading,
    defaultCountry,
    currentScreenName,
    setCurrentScreenName,
    listOfServices,
    isListServicesLoading,
    banner,
    isBannerLoading,
    bannerSlug,
    setBannerSlug,
    cities,
    isCityLoading,
    isProfessional,
    professional,
    setProfessional,
    canceledServiceInquires,
    setCanceledServiceInquires,
    aiRfqInquiry,
    setAiRfqInquiry,
  };

  return <SharedStateContext.Provider value={contextValue}>{children}</SharedStateContext.Provider>;
};

export { SharedStateContext, SharedStateProvider };
