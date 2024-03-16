import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../app/i18n';
import { render, RenderResult } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import ModalProvider from '../../app/providers/modal';
import { mockProjectIdeas, mockProjectsList } from '../../mocks/data-mock/utils';
import { getActiveProjectIdeas } from './utils';
import { ExportProject } from './components/export_project';
import { ProjectFilters } from './components/project_filters';
import { ProjectLayout } from './components/project_layout';
import { ProjectOperations } from './project_operations';
import { SuccessMessage } from './components/success_msg';
import { ProjectDetails } from './project_details';
import { EditProjectModal } from './project_details/edit_project_modal';
import { InviteFriendsModal } from './project_operations/invite_friends_modal';
import { UploadIdea } from './upload_idea';
import { ModalTabs } from './upload_idea/modal_tabs';
import { FileUploader } from './upload_idea/file_uploader';
import * as API from './api';

let exportProject: RenderResult;
let projectFilter: RenderResult;
let projectLayout: RenderResult;
let projectOperations: RenderResult;
let successMsg: RenderResult;
let projectDetails: RenderResult;
let editProjectModal: RenderResult;
let inviteFriendsModal: RenderResult;
let uploadIdea: RenderResult;
let fileUploader: RenderResult;
let modalTabs: RenderResult;

describe('Project Module test suitCase', () => {
  beforeAll((done) => {
    const history = createMemoryHistory();
    exportProject = render(
      <ModalProvider>
        <Router history={history}>
          <I18nextProvider i18n={i18n}>
            <ExportProject project={mockProjectsList[0]} />
          </I18nextProvider>
        </Router>
      </ModalProvider>
    );

    projectFilter = render(
      <I18nextProvider i18n={i18n}>
        <ProjectFilters />
      </I18nextProvider>
    );

    projectLayout = render(
      <I18nextProvider i18n={i18n}>
        <ProjectLayout />
      </I18nextProvider>
    );

    projectOperations = render(
      <ModalProvider>
        <I18nextProvider i18n={i18n}>
          <ProjectOperations project={mockProjectsList[0]} />
        </I18nextProvider>
      </ModalProvider>
    );

    successMsg = render(
      <ModalProvider>
        <I18nextProvider i18n={i18n}>
          <SuccessMessage project={mockProjectsList[0]} />
        </I18nextProvider>
      </ModalProvider>
    );

    projectDetails = render(
      <ModalProvider>
        <I18nextProvider i18n={i18n}>
          <ProjectDetails projectDetails={mockProjectsList[0]} />
        </I18nextProvider>
      </ModalProvider>
    );

    editProjectModal = render(<EditProjectModal onFinish={() => {}} project={mockProjectsList[0]} />);
    inviteFriendsModal = render(<InviteFriendsModal />);
    uploadIdea = render(<UploadIdea projectId={'projectId'} onUploadIdeaToProject={() => {}} projectIdeas={[]} />);
    modalTabs = render(<ModalTabs onFinish={() => {}} />);
    fileUploader = render(<FileUploader onFinish={() => {}} />);

    done();
  });

  it('ProjectFilters component to be defined', () => {
    expect(ProjectFilters).toBeDefined();
  });

  it('ProjectFilters component to be match snapshot', () => {
    expect(projectFilter).toMatchSnapshot();
  });

  it('ExportProject component to be defined', () => {
    expect(ExportProject).toBeDefined();
  });

  it('ExportProject component to be match snapshot', () => {
    expect(exportProject).toMatchSnapshot();
  });

  it('ProjectLayout component to be defined', () => {
    expect(ProjectLayout).toBeDefined();
  });

  it('ProjectLayout component to be match snapshot', () => {
    expect(projectLayout).toMatchSnapshot();
  });

  it('ProjectOperations component to be defined', () => {
    expect(ProjectOperations).toBeDefined();
  });

  it('ProjectOperations component to be match snapshot', () => {
    expect(projectOperations).toMatchSnapshot();
  });

  it('Success Msg component to be defined', () => {
    expect(SuccessMessage).toBeDefined();
  });

  it('Success Msg component to be match snapshot', () => {
    expect(successMsg).toMatchSnapshot();
  });

  it('Project Details component to be defined', () => {
    expect(ProjectDetails).toBeDefined();
  });

  it('Project Details component to match snapshot', () => {
    expect(projectDetails).toMatchSnapshot();
  });

  it('Success Msg component to be defined', () => {
    expect(EditProjectModal).toBeDefined();
  });

  it('EditProjectModal component to  be match snapshot', () => {
    expect(editProjectModal).toMatchSnapshot();
  });

  it('InviteFriendsModal component to be match snapshot', () => {
    expect(InviteFriendsModal).toBeDefined();
  });

  it('EditProjectModal component to be match snapshot', () => {
    expect(inviteFriendsModal).toMatchSnapshot();
  });

  it('UploadIdea component to be match snapshot', () => {
    expect(uploadIdea).toMatchSnapshot();
  });

  it('FileUploader component to be match snapshot', () => {
    expect(fileUploader).toMatchSnapshot();
  });

  it('ModalTabs component to be match snapshot', () => {
    expect(modalTabs).toMatchSnapshot();
  });

  it('getActiveProjectIdeas  should only active ideas', () => {
    expect(getActiveProjectIdeas(mockProjectIdeas).length).toEqual(2);
  });

  it('addIdea function to be defined', () => {
    expect(API.addIdea).toBeDefined();
  });

  it('addIdeaToProject function to be defined', () => {
    expect(API.addIdeaToProject).toBeDefined();
  });

  it('getMoreIdeas function to be defined', () => {
    expect(API.getMoreIdeas).toBeDefined();
  });

  it('getProject function to be defined', () => {
    expect(API.getProject).toBeDefined();
  });

  it('getProjectIdeas function to be defined', () => {
    expect(API.getProjectIdeas).toBeDefined();
  });

  it('updateProject function to be defined', () => {
    expect(API.updateProject).toBeDefined();
  });
});
