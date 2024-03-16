import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../../app/i18n';
import { NotificationsAssets } from '../../../assets/icons/notifications';
import { DISCUSSIONS, IDEAS, MAGAZINES, NO_NOTIFICATIONS, OR, TV, YOU_CAN_BROWSE } from '../../../locales/strings';
import { DISCUSSIONS_ROUTE, IDEAS_ROUTE, MAGAZINES_ROUTE, TV_ROUTE } from '../../../utils/routes';

export const NotificationsEmpty = () => {
  const { t } = useTranslation();

  const placeholderSrc = useMemo(() => {
    return i18n.language == 'ar' ? NotificationsAssets.LOADING_STATIC_RTL : NotificationsAssets.LOADING_STATIC_LTR;
  }, [i18n.language]);

  return (
    <section className="notifications-empty">
      <img className="placeholder" src={placeholderSrc} />
      <img className="placeholder" src={placeholderSrc} />
      <header>{t(NO_NOTIFICATIONS)}</header>
      <p className="content">
        {t(YOU_CAN_BROWSE)} <a href={IDEAS_ROUTE}>{t(IDEAS)}</a> {t(OR)} <a href={MAGAZINES_ROUTE}>{t(MAGAZINES)}</a>{' '}
        {t(OR)} <a href={DISCUSSIONS_ROUTE}>{t(DISCUSSIONS)}</a> {t(OR)} <a href={TV_ROUTE}>{t(TV)}</a>
      </p>
    </section>
  );
};
