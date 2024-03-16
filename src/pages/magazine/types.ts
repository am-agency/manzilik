export enum PluginTypes {
  TextPlugin = 'TextPlugin',
  Bootstrap4GridRowPlugin = 'Bootstrap4GridRowPlugin',
  Bootstrap4PicturePlugin = 'Bootstrap4PicturePlugin',
  Bootstrap4GridColumnPlugin = 'Bootstrap4GridColumnPlugin',
  Bootstrap4LinkPlugin = 'Bootstrap4LinkPlugin',
}

export interface Category {
  id?: string;
  title?: string | null;
  english_title?: string | null;
  description?: string | null;
  parent?: Category | null;
  photo?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  filters?: string | null;
}

export interface StaticMagazineTab {
  __typename: string;
  id: string;
  title: string;
}

export interface StaticMagazineTabs {
  [key: string]: StaticMagazineTab;
}
