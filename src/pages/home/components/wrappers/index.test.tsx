import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { render, RenderResult } from '@testing-library/react';
import { IdeaCardWrapper, ProjectListWrapper } from '.';
import i18n from '../../../../app/i18n';
let idea_card_wrapper_component: RenderResult;
let project_list_wrapper: RenderResult;

describe('IdeaCardWrapper  test', () => {
  beforeAll((done) => {
    idea_card_wrapper_component = render(
      <I18nextProvider i18n={i18n}>
        <IdeaCardWrapper>
          <div />
        </IdeaCardWrapper>
      </I18nextProvider>
    );
    project_list_wrapper = render(
      <I18nextProvider i18n={i18n}>
        <ProjectListWrapper>
          <div />
        </ProjectListWrapper>
      </I18nextProvider>
    );
    done();
  });

  it('IdeaCardWrapper is defined', () => {
    expect(IdeaCardWrapper).toBeDefined();
  });

  it('IdeaCardWrapper is defined', () => {
    expect(idea_card_wrapper_component).toMatchSnapshot();
  });

  it('IdeaCardWrapper is defined', () => {
    expect(ProjectListWrapper).toBeDefined();
  });

  it('IdeaCardWrapper is defined', () => {
    expect(project_list_wrapper).toMatchSnapshot();
  });
});
