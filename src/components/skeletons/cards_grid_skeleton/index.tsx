import { Card, Col, Row, Skeleton } from 'antd';
import React, { FC, useMemo } from 'react';
import { IdeaCardWrapper } from '../../../pages/home/components/wrappers';

interface ColSpan {
  xl: number;
  lg?: number;
  md?: number;
  sm?: number;
  xs?: number;
}

interface Props {
  cols?: number;
  cardsCount?: number;
  noWrapper?: boolean;
  colSpan?: ColSpan;
}
interface WrapperProps {
  noWrapper: boolean;
}

const Wrapper: FC<WrapperProps> = function ({ children, noWrapper }) {
  return noWrapper ? (
    <>{children}</>
  ) : (
    <Row justify="center" align="middle" className="ideas">
      {children}
    </Row>
  );
};

export const IdeaCardSkeleton: FC = () => (
  <Card className="idea-card" cover={<Skeleton.Image className="block fit-parent no-image" />}>
    <Skeleton active paragraph={{ rows: 1 }} />
  </Card>
);

export const WideIdeaCardSkeleton: FC = () => (
  <div className="project-idea-card">
    <div className="idea">
      <Card className="" cover={<Skeleton.Image className="block fit-parent no-image" />}></Card>
    </div>
  </div>
);

export const CardsSkeleton = ({ cardsCount = 1, colSpan }: Props) => {
  const listOfCard = Array(cardsCount).fill({});
  const renderListOfCards = useMemo(
    () =>
      listOfCard.map((_, index) => (
        <Col {...colSpan} key={index}>
          <WideIdeaCardSkeleton />
        </Col>
      )),
    [cardsCount]
  );

  return <Row gutter={[12, 5]}>{renderListOfCards}</Row>;
};

const CardsGridSkeleton = ({ cols = 1, cardsCount = 1, noWrapper }: Props) => {
  return (
    <Wrapper noWrapper={!!noWrapper}>
      {new Array(cardsCount).fill({}).map((_v, index) => (
        <IdeaCardWrapper key={index}>
          <IdeaCardSkeleton />
        </IdeaCardWrapper>
      ))}
    </Wrapper>
  );
};

export default CardsGridSkeleton;
