import { useState } from 'react';
import { listGigsTitleSuggestions } from '../api';

import { DirectoryGigService } from '../../../../../API';
import { useMainContext } from '../../../../../app/providers/main';

export const useGigsSuggestions = () => {
  const [suggestions, setSuggestions] = useState<DirectoryGigService[]>([]);
  const { requestApi } = useMainContext();

  const getGigsSuggestions = (query: string) => {
    requestApi(listGigsTitleSuggestions, { query }, (response: DirectoryGigService[], error: string) => {
      if (error) {
        return;
      }
      setSuggestions(response);
    });
  };

  return { getGigsSuggestions, suggestions };
};
