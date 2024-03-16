import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  timestamp: string;
}

export const DateFormat = ({ timestamp }: Props) => {
  const { t } = useTranslation();
  const date = useMemo(() => new Date(timestamp), [timestamp]);

  const { day, monthName, year, hours, minutes, ampm } = useMemo(() => {
    const hours = date.getHours() % 12;
    return {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      hours: hours === 0 ? 12 : hours,
      minutes: date.getMinutes(),
      ampm: date.getHours() >= 12 ? 'AM' : 'PM',
      monthName: t(`M${date.getMonth()}`),
    };
  }, [date, t]);

  return (
    <span>
      {day} {monthName} {year} | {hours}:{minutes} {ampm}
    </span>
  );
};
