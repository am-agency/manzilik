import { Typography } from 'antd';
import React from 'react';
import { Department } from '../../../../../API';
import Separator from '../../../../../components/separator';
import { Slider } from '../../../../../components/slider';
import { DepartmentCard } from '../department_card';
import { SubDepartmentCard } from '../sub_department_card';

interface Props {
  department: Department;
  index: number;
}

export const DepartmentSection = ({ department, index }: Props) => {
  return (
    <>
      <Typography.Text className="title">{department.title} </Typography.Text>
      <Separator vertical={10} />
      <div className="department-wrapper">
        <DepartmentCard department={department} index={index} />

        <Slider
          slidesToScroll={{ xl: 3, lg: 2, md: 2, sm: 1 }}
          slidesToShow={{ xl: 3, lg: 2, md: 2, sm: 1 }}
          listLength={department?.sub_departments?.length!}
        >
          {department.sub_departments?.map((sub_department) => {
            return <SubDepartmentCard sub_department={sub_department!} key={sub_department?.id} />;
          })}
        </Slider>
      </div>
      <Separator vertical={25} />
    </>
  );
};
