import { Badge, Button, Col, Divider, Empty, Pagination, Rate, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DirectoryGigService, GigService, Professional, Project, Review } from '../../../../API';
import { useMainContext } from '../../../../app/providers/main';
import { GIG_SERVICE_CLIENT, PROFESSIONAL } from '../../../../app/settings';
import { MetaTags } from '../../../../components/meta_tags';
import { PaginationList } from '../../../../components/pagination_list/pagination_list';
import ReadMoreText from '../../../../components/read_more_text';
import Separator from '../../../../components/separator';
import { UserIdeasList } from '../../../../components/user_ideas_list';
import {
  ADD_NEW_SERVICE,
  EDIT_REVIEW,
  NO_FAST_SERVICES,
  NO_GIGS,
  PROJECTS,
  READ_MORE,
  REVIEW,
  REVIEWS,
  START_NOW_GIGS,
  VIDEOS,
  WRITE_REVIEW,
} from '../../../../locales/strings';
import { getUserName } from '../../../../utils';
import { ProjectPreviewCard } from '../../../projects/project_card/ProjectPreviewCard';
import ProfileVideos from '../../complete_profile/gallery_videos';
import { ReviewsList } from '../../../../components/reviews_list';
import { getFloatRoundUp } from '../../utils';
import { ReviewList } from '../reviews_list';
import GalleryPhotos from '../gallery_photos';
import { useProfessional } from '../../hooks/useProfessional';
import { GigsListItem } from '../../../profile/edit_profile/my_gigs/types';
import { ListProfessionalGigs } from '../../../profile/edit_profile/my_gigs/api';
import GigCard from '../../../request_gig/components/gig_card';
import HelpComponent from '../../../request_gig/components/help_component';
import GigsListWithPagination from '../gigs_list_with_pagination';
import { publicProfileIcons } from '../../../../assets/icons/public_profile';
import { useFeatures } from 'flagged';
import EmptyState from '../../../../components/empty_state_component';
import icons from '../../../../assets/icons';

interface Props {
  id: string;
  professional: Professional;
  updateUser: Function;
  onLoadMore: () => void;
  reviewsList: Review[];
  total: number;
  listOfGigServices: GigService[];
  reviewProf: () => void;
}

export const RenderTabsPane = ({
  id,
  professional,
  reviewsList,
  onLoadMore,
  total,
  reviewProf,
  listOfGigServices,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { userState, requestApi } = useMainContext();
  const haveProjects = id && professional?.projects_count! > 0;
  const haveVideos = id && professional?.videos?.count! > 0;
  const havePhotos = id && professional.photos?.count! > 0;
  const haveReviews = id && professional?.reviews_count! > 0;
  const { client } = professional;
  const [currentPage, setCurrentPage] = useState(0);
  const aboutMe = client?.about_me?.substr(0, 160);
  const isProfessional = userState?.client?.id === professional?.client?.id;
  const features = useFeatures();

  const canReview =
    reviewsList.findIndex((review) => {
      return review?.client?.id === userState?.client?.id;
    }) >= 0;

  const { getProfessionalUserName } = useProfessional();

  return (
    <>
      <MetaTags title={getProfessionalUserName(professional)} description={aboutMe} />
      {professional?.is_gig_professional && features[GIG_SERVICE_CLIENT] && (
        <div id="gigs">
          {listOfGigServices.length > 0 ? (
            <GigsListWithPagination listOfGigServices={listOfGigServices} professional_id={professional?.client?.id} />
          ) : (
            <Empty
              description={
                <div className="no-ideas-text">
                  <Typography.Text className="title">{t(NO_GIGS)}</Typography.Text> <br />
                </div>
              }
            />
          )}
        </div>
      )}

      <div id="about-me">
        {professional?.client?.about_me && (
          <div className="about-me-wrapper">
            <ReadMoreText text={professional?.client?.about_me!} actionText={t(READ_MORE)} />
            <Separator vertical={10} />
            <Divider />
          </div>
        )}
      </div>

      {professional.client?.projects?.results.length && (
        <>
          <div id="projects">
            <Col span={24}>
              <Typography.Text className="title">{t(PROJECTS)}</Typography.Text>
              <Badge count={professional.client.projects.count} />
              <Separator vertical={10} />
            </Col>
            <div className="projects-list-wrapper">
              <PaginationList
                currentPage={currentPage}
                pageSize={6}
                grid={{ gutter: 10, column: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1, xxl: 2 }}
                total={professional.client.projects.count}
                dataSource={professional.client.projects.results}
                renderItem={(item) => {
                  return <ProjectPreviewCard project={item as Project} />;
                }}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
          <Divider type="horizontal" />
        </>
      )}

      {havePhotos && (
        <>
          <GalleryPhotos paginationProps={{ resourceId: id }} />
          <Divider type="horizontal" />
        </>
      )}

      {haveVideos && (
        <div id="videos" className="photos-vidoes-container">
          <div className="videos-label">{`${t(VIDEOS)} (${professional?.videos?.count!})`}</div>
          <Separator vertical={15} />
          <ProfileVideos
            paginationProps={{ resourceId: professional?.client?.id }}
            queryParams={{ id }}
            type={PROFESSIONAL}
            showIcon={false}
          />
          <Divider type="horizontal" />
        </div>
      )}
      <div id="comments">
        <Row justify="space-between" align="middle">
          <div className="review-label">{t(REVIEWS)}</div>
          <Button onClick={reviewProf} type="primary" className="add-review-btn">
            {canReview ? t(EDIT_REVIEW) : t(WRITE_REVIEW)}
          </Button>
        </Row>
        {haveReviews && (
          <>
            <Separator vertical={16} />
            <div className="count-wrapper">
              <Row justify="space-between" align="middle" className="review-count-container">
                <Row justify="center" align="middle">
                  <Typography.Title className="total-wrapper">
                    {getFloatRoundUp(professional?.reviews_total!) || '0.0'}
                  </Typography.Title>
                  <Separator horizontal={5} />
                  <Rate disabled value={professional?.reviews_total!} allowHalf />
                </Row>
                <Typography.Text>
                  <span className="total-wrapper">{professional?.reviews_count!}</span>
                  <span className="review-text">{t(REVIEW)}</span>
                </Typography.Text>
              </Row>
            </div>
          </>
        )}
        <Separator vertical={15} />
        {professional && <ReviewList reviewsList={reviewsList} onLoadMore={onLoadMore} total={total} />}
      </div>
    </>
  );
};
