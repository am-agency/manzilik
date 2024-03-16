import React, { useEffect, useState } from 'react';
import { DirectoryGigService, GigService } from '../../../../API';
import HelpComponent from '../../../request_gig/components/help_component';
import { Pagination } from 'antd';
import GigCard from '../../../request_gig/components/gig_card';
import { useMediaQuery } from 'react-responsive';
interface GigsListWithPaginationProps {
  listOfGigServices: GigService[];
  professional_id: string | undefined;
}

const GigsListWithPagination = (props: GigsListWithPaginationProps) => {
  const { listOfGigServices, professional_id } = props;
  const cardPerPage = 8;
  const isMobile = useMediaQuery({ query: '(max-width: 500px)' });
  const [paginationConfig, setPaginationConfig] = useState({
    data: [] as GigService[],
    total: 0,
    current: 1,
    minIndex: 0,
    maxIndex: cardPerPage,
    lastPageIndex: 1,
  });

  useEffect(() => {
    if (listOfGigServices) {
      setPaginationConfig({
        ...paginationConfig,
        data: listOfGigServices.slice(paginationConfig.minIndex, paginationConfig.maxIndex),
        total: listOfGigServices.length,
        lastPageIndex: Math.ceil(listOfGigServices.length / cardPerPage),
      });
    }
  }, [listOfGigServices]);

  const HandlePaginationChange = (page: number) => {
    const minIndex = (page - 1) * cardPerPage;
    const maxIndex = minIndex + cardPerPage;
    setPaginationConfig({
      ...paginationConfig,
      data: listOfGigServices.slice(minIndex, maxIndex),
      current: page,
      minIndex,
      maxIndex,
    });
  };
  return (
    <>
      <div className="gigs-list">
        {paginationConfig.data
          ? paginationConfig.data.map((item) => {
              return (
                <GigCard
                  key={item?.id}
                  item={item}
                  listOfGigServices={[]}
                  width={isMobile ? '167px' : '187px'}
                  backgroundColor="#FFF"
                  border="none"
                />
              );
            })
          : 'No Data'}
        {paginationConfig.lastPageIndex === paginationConfig.current && (
          <HelpComponent profId={professional_id} isGridView />
        )}
      </div>
      {paginationConfig?.total > cardPerPage && (
        <Pagination
          onChange={HandlePaginationChange}
          total={paginationConfig.total}
          pageSize={cardPerPage}
          defaultCurrent={paginationConfig.current}
        />
      )}
    </>
  );
};

export default GigsListWithPagination;
