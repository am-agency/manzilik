import { Skeleton } from 'antd';
import React from 'react';

const ProfessionalCardSkeleton = () => {
  return (
    <div className="prof-list-skeleton">
      <Skeleton.Image className="skeleton-img" />
      <div className="prof-list-skeleton-data">
        <Skeleton avatar paragraph={{ rows: 3 }} active />
        <div>
          <Skeleton paragraph={{ rows: 2, width: [200, 200] }} title={{ width: 0 }} active />
          <Skeleton.Button active size="large" />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCardSkeleton;
