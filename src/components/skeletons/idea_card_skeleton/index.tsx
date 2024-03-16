import { Skeleton } from 'antd';
import React from 'react';

const IdeaCardSkeleton = () => {
  return (
    <div className="idea-list-skeleton">
      <div className="idea-single-card">
        <Skeleton.Image className="skeleton-img" />
        <Skeleton className="skeleton-para" paragraph={{ rows: 2, width: [200, 200] }} title={{ width: 0 }} active />
      </div>
      <div className="idea-single-card">
        <Skeleton.Image className="skeleton-img" />
        <Skeleton className="skeleton-para" paragraph={{ rows: 2, width: [200, 200] }} title={{ width: 0 }} active />
      </div>
      <div className="idea-single-card">
        <Skeleton.Image className="skeleton-img" />
        <Skeleton className="skeleton-para" paragraph={{ rows: 2, width: [200, 200] }} title={{ width: 0 }} active />
      </div>
    </div>
  );
};

export default IdeaCardSkeleton;
