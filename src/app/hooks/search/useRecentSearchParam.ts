import { useEffect, useRef } from 'react';

/**
 * Runs onChange callback once, passing matching key param value to callback
 * @param key param key
 * @param onChange on change callback
 * @returns void
 */
export const useRecentSearchParam = (
  key: string,
  onChange: (value: string[]) => void,
  onInit?: (values: string[]) => void
) => {
  const isInit = useRef(true);
  const updateSearchParamsFromUrl = () => {
    const url = decodeURIComponent(window.location.search);
    const params = new URLSearchParams(url);
    const paramsList = params.getAll(key);
    if (paramsList.length) {
      onChange(paramsList);
    }
    if (isInit.current) {
      onInit?.(paramsList);
      isInit.current = false;
    }
  };

  useEffect(() => {
    updateSearchParamsFromUrl();
  }, [window.location.search]);

  return { updateSearchParamsFromUrl };
};
