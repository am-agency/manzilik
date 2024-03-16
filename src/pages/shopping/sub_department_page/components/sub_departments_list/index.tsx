import React, { FunctionComponent, useEffect, useState } from 'react';
import { SubDepartmentCard } from '../sub_department_card';
import { breadcrumb } from '../../../../../API';
import { useParams } from 'react-router-dom';

export interface TDepartment {
  id: string;
  title: string;
  description: string;
  slug: string;
  photo_url: string;
  products_count: number;
  filters: string;
  breadcrumbs: Array<breadcrumb>;
  sub_departments: Array<TDepartment>;
  children: Array<TDepartment>;
}

interface Props {
  subDepartments: TDepartment[];
}

export const SubDepartmentsList: FunctionComponent<Props> = ({ subDepartments }: Props) => {
  const params = useParams<Record<string, string>>();
  const [selectedDepartmentUrl, setSelectedDepartmentUrl] = useState<string>('');

  useEffect(() => {
    const _params = [];
    let i = 0;
    while (params[i]) {
      _params.push(params[i]);
      i++;
    }
    const _selectedDeptUrl = _params.join('/');
    setSelectedDepartmentUrl(_selectedDeptUrl);
  }, [params]);

  return (
    <section className="subdepartments-container">
      {subDepartments?.map((department, index) => (
        <SubDepartmentCard
          subDepartment={department}
          key={index}
          selectedDepartmentUrl={selectedDepartmentUrl}
          setSelectedDepartmentUrl={setSelectedDepartmentUrl}
        />
      ))}
    </section>
  );
};
