import React from 'react';
import { Badge, Tag, Tooltip, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { Magazine } from '../../../../../API';
import Separator from '../../../../../components/separator';
import { getArticlePath } from '../../../utils';
import { AuthorSection } from '../author_section';

interface Props {
  magazine?: Magazine;
  withCategory?: boolean;
  withDescription?: boolean;
}

export const MagazineCard = (props: Props) => {
  const { magazine, withCategory, withDescription } = props;
  const classNames = withDescription && 'magazine-expanded-card';
  const contentClassName = !withDescription && 'small-card_content-wrapper';
  const restCategoriesCount = magazine?.categories && magazine?.categories?.length! - 3;

  return (
    <Link to={getArticlePath(magazine!)}>
      <div className={`magazine-card main-article ${classNames}`}>
        <div className="img-wrapper">
          <LazyLoadImage
            src={magazine?.photo}
            alt={magazine?.title!}
            className="clickable img-fit-content rounded-border"
          />
        </div>

        <div className={`content-wrapper ${contentClassName}`}>
          <div>
            <div>
              {withCategory && (
                <>
                  {magazine?.categories?.map((elm, index) => {
                    return (
                      <>
                        {index < 3 && (
                          <Tag className="category-tag" key={elm?.id}>
                            {elm?.title}
                          </Tag>
                        )}
                      </>
                    );
                  })}
                  {restCategoriesCount! > 0 && <Badge className="badg" count={`+ ${restCategoriesCount}`} />}
                </>
              )}
            </div>

            <Tooltip title={magazine?.title}>
              <Typography.Paragraph className="card-title" ellipsis={{ rows: 2 }}>
                {magazine?.title?.substring(0, 40)} ...
              </Typography.Paragraph>
            </Tooltip>
            <Separator vertical={2} />
            {withDescription && (
              <Typography.Paragraph className="card-description" ellipsis={{ rows: 4 }}>
                {magazine?.meta_description}
              </Typography.Paragraph>
            )}
          </div>
          {magazine && <AuthorSection magazine={magazine} />}
        </div>
      </div>
    </Link>
  );
};
