import { Card } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { Category } from '../../../API';
import { useMainContext } from '../../../app/providers/main';
import Separator from '../../../components/separator';
import { listCategories } from '../api';
import defaultPic from '../../../assets/backgrounds/default_pic.jpg';
import i18n from '../../../app/i18n';
import { CustomCarousal } from '../../../components/carousal';
import { SEARCH } from '../../../app/settings';

interface Props {
  onCategoryClick: Function;
}

export const Categories = ({ onCategoryClick }: Props) => {
  const { requestApi } = useMainContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [totalNumber, setTotalNumber] = useState<number>(0);

  const getCategories = () => {
    requestApi(
      listCategories,
      { offset: 0, limit: 50, tab: SEARCH },
      (response: { results: Category[]; count: number }, error: string) => {
        if (error) {
          return;
        }
        const { results, count } = response;
        setCategories(results);
        setTotalNumber(count);
        setOffset(offset + 50);
      }
    );
  };

  useEffect(() => {
    getCategories();
  }, [i18n.language]);
  const categoryImage = (image: string | null | undefined) => {
    if (image) {
      return image;
    } else {
      return defaultPic;
    }
  };

  return (
    <div className="categories-wrapper custom-carousal-wrapper" id="categories-section">
      <CustomCarousal id={'categories-section'} action={categories}>
        {categories?.map((elm, index) => {
          return (
            <>
              <div key={index} className="category clickable" onClick={() => onCategoryClick(elm.title)}>
                <Card cover={<img className="img-fit-content" src={categoryImage(elm?.photo!)} />}>
                  <Card.Meta title={elm.title} />
                </Card>
              </div>
              {categories.length !== index + 1 && <Separator horizontal={10} />}
            </>
          );
        })}
      </CustomCarousal>
    </div>
  );
};
