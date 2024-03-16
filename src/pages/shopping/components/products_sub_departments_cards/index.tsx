import React from 'react';
import { useState, useEffect } from 'react';
import i18n from '../../../../app/i18n';
import { useMainContext } from '../../../../app/providers/main';
import Separator from '../../../../components/separator';
import { CardsSkeleton } from '../../../../components/skeletons/cards_grid_skeleton';
import { listDepartments } from '../../departments_page/api';
import { TDepartment, SubDepartmentsList } from '../../sub_department_page/components/sub_departments_list';

interface Props {
  categories: string[];
}

export const ProductsSubDepartmentsCards = ({ categories }: Props) => {
  const { requestApi } = useMainContext();

  const [subDepartments, setSubDepartments] = useState<TDepartment[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const getSubDepartments = () => {
    setLoadingCategories(true);
    requestApi(listDepartments, {}, (response: { results: TDepartment[] }, error: string) => {
      if (error) {
        setLoadingCategories(false);
        return;
      }
      setSubDepartments(response.results);
      setLoadingCategories(false);
    });
  };

  useEffect(() => {
    getSubDepartments();
  }, [i18n.language, categories]);

  return (
    <section>
      <Separator vertical={10} />
      {loadingCategories ? (
        <CardsSkeleton cardsCount={2} colSpan={{ xl: 4, lg: 4, md: 4, sm: 12, xs: 12 }} />
      ) : (
        <>
          <SubDepartmentsList subDepartments={subDepartments} />
        </>
      )}
    </section>
  );
};
