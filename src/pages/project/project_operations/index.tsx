import { Tooltip } from 'antd';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import exportIcon from '../../../assets/icons/export.svg';
import DropdownPopover from '../../../components/dropdown_popover';
import { Project } from '../../../components/idea/types';
import Separator from '../../../components/separator';
import { EXPORT } from '../../../locales/strings';
import { ExportProject } from '../components/export_project';

interface Props {
  project?: Project;
}

export const ProjectOperations: FunctionComponent<Props> = ({ project }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Separator horizontal={15} />
      <DropdownPopover content={<ExportProject project={project} />} trigger="click">
        <Tooltip placement="top" title={t(EXPORT)}>
          <img src={exportIcon} />
        </Tooltip>
      </DropdownPopover>
    </>
  );
};
