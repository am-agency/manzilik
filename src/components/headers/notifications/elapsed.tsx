import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../../app/i18n';
import { DAY, DAYS, ELAPSED, HOUR, HOURS, MINUTE, MINUTES } from '../../../locales/strings';

interface Props {
  dateString: string;
}

const refreshRate = 1000 * 60 - 1;

export const Elapsed = ({ dateString }: Props) => {
  const { t } = useTranslation();
  const timer = useRef();
  const [counter, setCounter] = useState(0);

  const elapsedInMinutes = useMemo(() => {
    const diff = new Date().getTime() - new Date(dateString).getTime();
    const toMinutes = diff / 1000 / 60;
    return Math.ceil(toMinutes);
  }, [dateString, counter]);

  const elapsedInHours = useMemo(() => {
    return elapsedInMinutes < 59 ? 0 : Math.floor(elapsedInMinutes / 60);
  }, [elapsedInMinutes]);

  const elapsedInDays = useMemo(() => {
    return elapsedInHours < 24 ? 0 : Math.floor(elapsedInHours / 24);
  }, [elapsedInHours]);

  const suffixMinutes = useMemo(() => (elapsedInMinutes === 1 ? t(MINUTE) : t(MINUTES)), [elapsedInMinutes]);

  const suffixHours = useMemo(() => (elapsedInHours === 1 ? t(HOUR) : t(HOURS)), [elapsedInHours]);

  const suffixDays = useMemo(() => (elapsedInDays === 1 ? t(DAY) : t(DAYS)), [elapsedInHours]);

  const elapsed = useMemo(() => {
    if (elapsedInDays !== 0) {
      return `${elapsedInDays} ${suffixDays}`;
    } else if (elapsedInHours !== 0) {
      return `${elapsedInHours} ${suffixHours}`;
    } else {
      return `${elapsedInMinutes} ${suffixMinutes}`;
    }
  }, [elapsedInMinutes, elapsedInHours]);

  const formatted = useMemo(() => {
    return i18n.language === 'ar' ? `${t(ELAPSED)} ${elapsed}` : `${elapsed} ${t(ELAPSED)}`;
  }, [elapsed]);

  useEffect(() => {
    clearTimeout(timer.current);
    setTimeout(() => {
      setCounter((n) => n + 1);
    }, refreshRate);

    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  return <small className="elapsed">{formatted}</small>;
};
