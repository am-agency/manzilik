import React from 'react';
import { IdeaCard } from '.';
import { Project } from '../../../../API';

interface Props {
  project: Project;
}

export const ProjectContainer = ({ project }: Props) => {
  const first = project?.default_idea;
  return (
    <section className="project-container">
      <IdeaCard idea={first!} project={project} hideActions />
    </section>
  );
};
