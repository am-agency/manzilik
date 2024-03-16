import { DefaultLayout } from './default_layout';
import { RightSidebarLayout } from './right_sidebar';
import { DirectionType } from 'antd/lib/config-provider';
import { AR, LTR, RTL } from '../../locales/constants';
import { LoginLayout } from './login_layout';
import { LandingPagesLayout } from './landing_pages';
import { WithoutFooterLayout } from './without_layout';
import { ContentOnlyLayout } from './content_only';

export enum LayoutTypes {
  DEFAULT = 'default',
  RIGHT_SIDE_BAR = 'RIGHT_SIDE_BAR',
  LOGIN = 'LOGIN',
  LANDING_PAGES = 'LANDING_PAGES',
  CONTENT_ONLY = 'CONTENT_ONLY',
  WithoutFooterLayout = 'WithoutFooterLayout',
}

interface Props {
  children: React.ReactNode;
}

/**
 * This is a factory to load the layout by name
 * @param loadLayoutByName
 */
export function loadLayoutByName(layout: LayoutTypes): React.FunctionComponent<Props> {
  switch (layout) {
    case LayoutTypes.DEFAULT:
      return DefaultLayout;
    case LayoutTypes.RIGHT_SIDE_BAR:
      return RightSidebarLayout;
    case LayoutTypes.LOGIN:
      return LoginLayout;
    case LayoutTypes.LANDING_PAGES:
      return LandingPagesLayout;
    case LayoutTypes.WithoutFooterLayout:
      return WithoutFooterLayout;
    case LayoutTypes.WithoutFooterLayout:
      return WithoutFooterLayout;
    case LayoutTypes.CONTENT_ONLY:
      return ContentOnlyLayout;
    default:
      return DefaultLayout;
  }
}

/**
 *
 * @param lng string
 */
export const getLayoutDirection: (lng: string) => DirectionType = (lng) => {
  return lng === AR ? RTL : LTR;
};

export { DefaultLayout, RightSidebarLayout };
