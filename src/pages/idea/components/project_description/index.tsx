import React from 'react';
import { Project } from '../../../../components/idea/types';

interface Props {
  project: Project;
}

export const ProjectDescription = ({ project }: Props) => {
  return (
    <>
      <div className="project-details">
        <h1 className="title"> {project?.title} </h1>
        {project.description && <p className="description"> {project?.description} </p>}
      </div>
    </>
  );
};
