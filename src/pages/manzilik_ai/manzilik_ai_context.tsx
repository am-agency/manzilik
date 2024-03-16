import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  AIDesignObject,
  AIDesignRoomType,
  AIDesignStyle,
  AIOption,
  AIOptions,
  GenerateAIDesignInput,
  Package,
} from './types';
import { useMainContext } from '../../app/providers/main';
import { useHistory } from 'react-router-dom';
import { PreviousHistoryContext } from '../../context/previous_history_context';

export interface ManzilikAiProps {
  currentView: string;
  setCurrentView?: (view: string) => void;
  currentMobileView?: string;
  setCurrentMobileView?: (view: string) => void;
  formData?: GenerateAIDesignInput;
  setFormData?: (data: GenerateAIDesignInput) => void;
  selectedStyleFilter?: string;
  setSelectedStyleFilter?: (style: string) => void;
  listStyles?: AIDesignStyle[];
  setListStyles?: (styles: AIDesignStyle[]) => void;
  listRoomTypes?: AIDesignRoomType[];
  setListRoomTypes?: (roomTypes: AIDesignRoomType[]) => void;
  originalImageURL?: string;
  setOriginalImageURL?: (url: string) => void;
  generatedImageURL?: string;
  setGeneratedImageURL?: (url: string) => void;
  loginRedirection?: () => void;
  totalSelectedPoints?: number;
  setTotalSelectedPoints?: (points: number) => void;
  setSelectedDesignObject?: (object: AIDesignObject) => void;
  selectedDesignObject?: AIDesignObject;
  listOfImages?: string[];
  setListOfImages?: (list: string[]) => void;
  selectedImageIndex?: number;
  setSelectedImageIndex?: (index: number) => void;
  afterImageURL?: string;
  setAfterImageURL?: (url: string) => void;
  setSelectedPackage?: (packageData: Package) => void;
  selectedPackage?: Package;
  setSelectedCheckoutId?: (id: string | null) => void;
  selectedCheckoutId?: string | null;
  isListMyDesignsRefresh?: boolean;
  setIsListMyDesignsRefresh?: (refresh: boolean) => void;
  aiOptions?: AIOptions[];
  setAIOptions?: (options: AIOptions[]) => void;
  currentLayoutView?: string;
  setCurrentLayoutView?: (layout: string) => void;
  formUploadRef?: React.MutableRefObject<{
    upload: {
      uploader: {
        onClick: () => void;
      };
    };
  }>;
  drawerType?: string;
  setDrawerType?: (type: string) => void;
  isAiDrawerOpen?: boolean;
  setIsAiDrawerOpen?: (open: boolean) => void;
  currentTemplatePrompt?: string;
  setCurrentTemplatePrompt?: (prompt: string) => void;
}

interface ManzilikAiContextProviderProps {
  children: React.ReactNode;
}

export enum ManzilikViews {
  FORM_LIST_VIEW = 'form_list_view',
  LOADING_VIEW = 'loading_view',
  SUGGESTED_VIEW = 'suggested_view',
}

export enum ManzilikMobileViews {
  LIST = 'list',
  FORM = 'form',
}

export enum ManzilikAILayouts {
  DEFAULT = 'default',
  RESULTS = 'results',
  RE_GENERATION = 're_generation',
  LOADING = 'loading',
}

export enum DrawerType {
  GUIDE = 'guide',
  PACKAGES = 'packages',
}

const ManzilikAiContext = createContext<ManzilikAiProps | undefined>(undefined);

const ManzilikAiProvider = ({ children }: ManzilikAiContextProviderProps) => {
  const [selectedDesignObject, setSelectedDesignObject] = useState<AIDesignObject | undefined>();
  const [currentView, setCurrentView] = useState<string>(ManzilikViews.FORM_LIST_VIEW);
  const [currentMobileView, setCurrentMobileView] = useState<string>(ManzilikMobileViews.LIST);
  const [currentLayoutView, setCurrentLayoutView] = useState<string>(ManzilikAILayouts.DEFAULT);
  const [formData, setFormData] = useState<GenerateAIDesignInput>({
    imageURL: '',
    styleSlug: '',
    roomTypeSlug: '',
    visibility: 'PUBLIC',
    processingType: 'fast',
    text: '',
    advancedOptions: [
      {
        optionNameSlug: '',
        optionValueSlug: '',
      },
    ],
  });
  const [currentTemplatePrompt, setCurrentTemplatePrompt] = useState<string>('');

  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>('');
  const [listStyles, setListStyles] = useState<AIDesignStyle[]>([]);
  const [listRoomTypes, setListRoomTypes] = useState<AIDesignRoomType[]>([]);
  const [originalImageURL, setOriginalImageURL] = useState<string>('');
  const [afterImageURL, setAfterImageURL] = useState<string>('');
  const [generatedImageURL, setGeneratedImageURL] = useState<string>('');
  const [totalSelectedPoints, setTotalSelectedPoints] = useState<number>(0);
  const [listOfImages, setListOfImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedPackage, setSelectedPackage] = useState<Package>();
  const [selectedCheckoutId, setSelectedCheckoutId] = useState<string | null>(null);
  const [isListMyDesignsRefresh, setIsListMyDesignsRefresh] = useState<boolean>(false);
  const [aiOptions, setAIOptions] = useState<AIOptions[]>();
  const [drawerType, setDrawerType] = useState<string>(DrawerType.GUIDE);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);

  const { userState } = useMainContext();
  const isLogged = userState.isAuthenticated;
  const history = useHistory();

  useEffect(() => {
    if (formData?.styleSlug) {
      setCurrentTemplatePrompt(listStyles?.find((style) => style.slug === formData?.styleSlug)?.template_prompt || '');
    }
  }, [formData?.styleSlug]);

  useEffect(() => {
    const roomType = listRoomTypes?.find((roomType) => roomType.slug === formData?.roomTypeSlug);
    if (roomType) {
      const roomTypeName = roomType.name;
      const templatePrompt = currentTemplatePrompt?.replace('#', roomTypeName);
      setCurrentTemplatePrompt(templatePrompt!);
    }
  }, [formData?.roomTypeSlug, listRoomTypes]);

  const formUploadRef = useRef<{
    upload: {
      uploader: {
        onClick: () => void;
      };
    };
  }>({
    upload: {
      uploader: {
        onClick: () => {
          // handle onClick logic here
        },
      },
    },
  });

  const { setPreviousHistoryLink } = useContext(PreviousHistoryContext) as {
    setPreviousHistoryLink?: (link: string) => void;
  };

  const loginRedirection = () => {
    if (!isLogged) {
      history.push('/login');
      setPreviousHistoryLink!('/manzilik-ai');
    }
  };

  const contextValue: ManzilikAiProps = {
    currentView,
    setCurrentView,
    currentMobileView,
    setCurrentMobileView,
    formData,
    setFormData,
    selectedStyleFilter,
    setSelectedStyleFilter,
    listStyles,
    setListStyles,
    listRoomTypes,
    setListRoomTypes,
    originalImageURL,
    setOriginalImageURL,
    generatedImageURL,
    setGeneratedImageURL,
    loginRedirection,
    totalSelectedPoints,
    setTotalSelectedPoints,
    setSelectedDesignObject,
    selectedDesignObject,
    listOfImages,
    setListOfImages,
    selectedImageIndex,
    setSelectedImageIndex,
    afterImageURL,
    setAfterImageURL,
    selectedPackage,
    setSelectedPackage,
    selectedCheckoutId,
    setSelectedCheckoutId,
    isListMyDesignsRefresh,
    setIsListMyDesignsRefresh,
    aiOptions,
    setAIOptions,
    currentLayoutView,
    setCurrentLayoutView,
    formUploadRef,
    drawerType,
    setDrawerType,
    isAiDrawerOpen,
    setIsAiDrawerOpen,
    currentTemplatePrompt,
    setCurrentTemplatePrompt,
  };

  return <ManzilikAiContext.Provider value={contextValue}>{children}</ManzilikAiContext.Provider>;
};

export { ManzilikAiContext, ManzilikAiProvider };
