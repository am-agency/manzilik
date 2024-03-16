import { useEffect, useState } from 'react';
import { useRecentSearchParam } from './useRecentSearchParam';
import { QueryStringKeys } from './useSearchQuery';

export const useSearchKeywords = () => {
  const [initKeywords, setInitKeywords] = useState('');
  const [keywords, setKeywords] = useState('');

  const { updateSearchParamsFromUrl } = useRecentSearchParam(
    QueryStringKeys.KEYWORDS,
    (q) => {
      if (q.length) {
        setKeywords(q[0]);
      }
    },
    ([first]) => {
      setInitKeywords(first);
    }
  );

  return {
    keywords,
    initKeywords,
    setKeywords,
    updateKeywordsSearchParamsFromUrl: updateSearchParamsFromUrl,
  };
};
