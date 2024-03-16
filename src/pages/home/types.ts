import { Category, Department, ListFeedsQuery, Magazine, Pagination, StockRecord } from '../../API';
import { Idea, Project, TV } from '../../components/idea/types';

export interface ListProjectsFromApi {
  data: ListFeedsQuery;
}

export interface ProjectsWithTotal {
  projects: Project[];
  projects_total: number;
}

export interface PaginationWithAuth extends Pagination {
  isAuthenticated?: boolean;
  isForceRefresh?: boolean;
  tag?: string;
}

export interface HomeService {
  id: string;
  title: string;
  english_title: string;
  photo: string;
}

export interface HomeRoomType {
  id: string;
  title: string;
  english_title: string;
  photo: string;
  category?: Category;
}

export interface ProjectsSlider {
  projects: Project[];
  title: string;
  show_all_url: string;
}

export interface MagazineSlider {
  magazines: Magazine[];
  title: string;
  show_all_url: string;
}

export interface TvSlider {
  tvs: TV[];
  title: string;
  show_all_url: string;
}

export interface IdeasSlider {
  ideas: Idea[];
  title: string;
  show_all_url: string;
}

export interface RoomTypeSlider {
  roomtypes: HomeRoomType[];
  title: string;
  show_all_url: string;
}

export interface ServicesSlider {
  title: string;
  show_all_url: string;
  services: HomeService[];
}

export interface StockRecordsSlider {
  title: string;
  show_all_url: string;
  stockrecords: StockRecord[];
}

export interface ProductCategorySlider {
  title: string;
  show_all_url: string;
  product_categories: Department[];
}

export interface HomePageSlider {
  idea_slider: IdeasSlider;
  roomtype_slider: RoomTypeSlider;
  magazine_slider: MagazineSlider;
  Projects_slider: ProjectsSlider;
  service_slider: ServicesSlider;
}

export interface GetHomePageSliderFromApi {
  data: { getHomePageSlider: { result: string } };
}
