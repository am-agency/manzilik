import React, { FunctionComponent, useEffect } from 'react';
import { BaseEntity } from '../../../components/idea/types';

interface Props {
  children: React.ReactElement;
}

export interface MultiIdeasOperationsState {
  projectIdeaList?: BaseEntity[];
  isVisible?: boolean;
  operation?: string;
  status?: string;
}

export interface MultiIdeasOperationsContextState {
  showMultiIdeasOperations: (component: React.ReactElement | undefined) => void;
  hideMultiIdeasOperations: () => void;
  updateProviderState: (providerState: MultiIdeasOperationsState) => void;
  multiIdeasOperationProviderState: MultiIdeasOperationsState;
}

const initState: MultiIdeasOperationsContextState = {
  showMultiIdeasOperations: () => null,
  hideMultiIdeasOperations: () => null,
  updateProviderState: () => null,
  multiIdeasOperationProviderState: { projectIdeaList: [], isVisible: false },
};

const MultiIdeasOperations = React.createContext<MultiIdeasOperationsContextState>(initState);
export const useMultiIdeasOperations = () => React.useContext(MultiIdeasOperations);

export const MultiIdeasOperationsProvider: FunctionComponent<Props> = (props: Props) => {
  const [component, setComponent] = React.useState<React.ReactElement>();
  const [multiIdeasOperationProviderState, updateMultiIdeasOperationsState] = React.useState<MultiIdeasOperationsState>(
    {
      projectIdeaList: [],
      isVisible: false,
    }
  );

  const { isVisible } = multiIdeasOperationProviderState;

  useEffect(() => {
    return () => {
      updateMultiIdeasOperationsState({
        projectIdeaList: [],
      });
    };
  }, []);

  const showMultiIdeasOperations = (component: React.ReactElement | undefined) => {
    updateMultiIdeasOperationsState({ ...multiIdeasOperationProviderState, isVisible: true });
    if (component) {
      setComponent(component);
    }
  };

  const hideMultiIdeasOperations = () => {
    updateMultiIdeasOperationsState({ ...multiIdeasOperationProviderState, isVisible: false });
  };

  const updateProviderState = (providerState: MultiIdeasOperationsState) => {
    updateMultiIdeasOperationsState({
      ...multiIdeasOperationProviderState,
      ...providerState,
      isVisible: multiIdeasOperationProviderState.isVisible,
    });
  };

  if (!isVisible) {
    <div />;
  }

  return (
    <MultiIdeasOperations.Provider
      value={{
        showMultiIdeasOperations,
        hideMultiIdeasOperations,
        updateProviderState,
        multiIdeasOperationProviderState,
      }}
      {...props}
    >
      <React.Fragment>
        {isVisible && component}
        {props.children}
      </React.Fragment>
    </MultiIdeasOperations.Provider>
  );
};

export default MultiIdeasOperationsProvider;
