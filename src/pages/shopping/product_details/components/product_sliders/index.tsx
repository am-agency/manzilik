import React from 'react';
import { Row, Typography } from 'antd';
import { FunctionComponent } from 'react';
import { ProductSlider } from '../../../../../API';
import { withPagination, WithPaginationProps } from '../../../../../app/hooks/with_pagination';
import Separator from '../../../../../components/separator';
import ProductCard from '../../../components/product_card';
import { listProductSliders } from '../../api';
import { Slider } from '../../../../../components/slider';
import CardsGridSkeleton, { CardsSkeleton } from '../../../../../components/skeletons/cards_grid_skeleton';

interface Props extends WithPaginationProps<ProductSlider> {}

const ProductSliders: FunctionComponent<Props> = ({ list, loading }: Props) => {
  return (
    <div>
      {!loading && list?.length !== 0 ? (
        list?.map((items) => {
          return (
            <>
              <Typography.Text className="title">{items.title}</Typography.Text>
              <Separator vertical={12} />
              <Slider
                slidesToScroll={{ xl: 4, lg: 4, md: 2, sm: 1 }}
                slidesToShow={{ xl: 4, lg: 4, md: 2, sm: 1 }}
                listLength={items.stock_records?.length!}
              >
                {items.stock_records?.map((elm, index) => {
                  return (
                    <Row key={elm?.id} justify="center" align="middle">
                      <ProductCard stockRecord={elm!} key={index} />
                      <Separator horizontal={10} />
                    </Row>
                  );
                })}
              </Slider>
              <Separator vertical={10} />
            </>
          );
        })
      ) : (
        <CardsSkeleton cardsCount={6} colSpan={{ xl: 8, lg: 8, md: 8, sm: 24, xs: 24 }} />
      )}
    </div>
  );
};

export default withPagination<ProductSlider>(listProductSliders, ProductSliders);
