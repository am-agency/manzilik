import React, { useContext, useEffect } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { BannerSlug, Professional } from '../../../../API';
import { ProfessionalItem } from '../professional_item';
import { PaginationList } from '../../../../components/pagination_list/pagination_list';
import { Skeleton, Space } from 'antd';
import ProfessionalCardSkeleton from '../../../../components/skeletons/professional_card_skeleton';
import { SharedStateContext, SharedStateInterface } from '../../../../context/shared_state_context';
import BannerContainer from '../../../../components/banner_container';
import BannerCard from '../../../../components/banner_card';

interface Props {
  recordsLimit: number;
  professionals: Professional[];
  onPageChange: (page: number, pageSize?: number) => void;
  total: number;
  currentPage: number;
  isProfessionalsLoading: boolean;
}

export const ProfessionalList = ({
  professionals,
  recordsLimit,
  onPageChange,
  total,
  currentPage,
  isProfessionalsLoading,
}: Props) => {
  const skeletonList = () => {
    // create an array of 10 elements to render 10 skeleton items
    const skeletonArray = Array.from(Array(10).keys());
    return (
      <>
        {skeletonArray.map((item, i) => (
          <ProfessionalCardSkeleton key={i} />
        ))}
      </>
    );
  };

  const { banner, setBannerSlug } = useContext(SharedStateContext) as SharedStateInterface;
  useEffect(() => {
    setBannerSlug!(BannerSlug.PROFESSIONALS_BANNER);
  }, []);

  return (
    <section className="professional-list">
      {isProfessionalsLoading ? (
        skeletonList()
      ) : (
        <PaginationList
          pageSize={recordsLimit}
          dataSource={professionals}
          onPageChange={onPageChange}
          total={total}
          currentPage={currentPage}
          renderItem={(item, index) => {
            return item ? (
              <section>
                {index === 1 ? (
                  <BannerContainer>
                    <BannerCard banner={banner} isDynamicContent />
                  </BannerContainer>
                ) : null}
                <ProfessionalItem item={item as Professional} />
              </section>
            ) : null;
          }}
        />
      )}
    </section>
  );
};
