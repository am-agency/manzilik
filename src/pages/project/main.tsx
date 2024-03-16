import React from 'react';
import ProjectsPage from './index';
import { withUserAuthenticator } from '../../app/providers/user/with_user_authenticator';

const MainProject = () => {
  return <ProjectsPage />;
};

export default withUserAuthenticator(MainProject);
