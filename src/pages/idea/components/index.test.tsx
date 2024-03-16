import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { render, RenderResult } from '@testing-library/react';
import i18n from '../../../app/i18n';
import { mockClient, mockProjectIdeas, mockProjectsList } from '../../../mocks/data-mock/utils';
import { BriefComment } from './brief_comment';
import { IdeaCard } from './idea_card';
import { ClientComponent } from './idea_client';
import { IdeaDetailsActions } from './idea_details_actions';
import { IdeasList } from './ideas_list';
import { ProjectItem } from './project_item';
import { QuestionHead } from './question_head';
import { ZoomInIdea } from './zoom_in_idea';
let brief_comment: RenderResult;
let idea_card: RenderResult;
let idea_client: RenderResult;
let idea_actions: RenderResult;
let ideas_list: RenderResult;
let project_item: RenderResult;
let question_head: RenderResult;
let zoom_in_idea: RenderResult;

describe('CommentList  test', () => {
  beforeAll((done) => {
    brief_comment = render(
      <I18nextProvider i18n={i18n}>
        <BriefComment onWriteComment={jest.fn} />
      </I18nextProvider>
    );

    idea_card = render(
      <I18nextProvider i18n={i18n}>
        <IdeaCard project={mockProjectsList[0]} />
      </I18nextProvider>
    );

    idea_client = render(
      <I18nextProvider i18n={i18n}>
        <ClientComponent client={mockClient} ideaId={'ideaId'} />
      </I18nextProvider>
    );

    idea_actions = render(
      <I18nextProvider i18n={i18n}>
        <IdeaDetailsActions
          isZoomInVisible
          isIdeaSelected
          onSaveIdea={jest.fn}
          onShareIdea={jest.fn}
          onZoomIdea={jest.fn}
        />
      </I18nextProvider>
    );

    ideas_list = render(
      <I18nextProvider i18n={i18n}>
        <IdeasList ideaId="ideaId" ideas={mockProjectIdeas} onIdeaChange={jest.fn} project={mockProjectsList[0]} />
      </I18nextProvider>
    );

    project_item = render(
      <I18nextProvider i18n={i18n}>
        <ProjectItem project={mockProjectsList[0]} />
      </I18nextProvider>
    );

    question_head = render(
      <I18nextProvider i18n={i18n}>
        <QuestionHead totalQuestions={10} onAddQuestionClick={jest.fn} />
      </I18nextProvider>
    );

    zoom_in_idea = render(
      <I18nextProvider i18n={i18n}>
        <ZoomInIdea
          isZoomInVisible
          isIdeaSelected
          currentIdea={mockProjectIdeas[0]}
          ideas={mockProjectIdeas}
          onIdeaChange={jest.fn}
          onSaveIdea={jest.fn}
          onShareIdea={jest.fn}
          onZoomIdea={jest.fn}
        />
      </I18nextProvider>
    );

    done();
  });

  it('BriefComment is defined', () => {
    expect(BriefComment).toBeDefined();
  });

  it('BriefComment is to MatchSnapshot', () => {
    expect(brief_comment).toMatchSnapshot();
  });

  it('IdeaCard is defined', () => {
    expect(IdeaCard).toBeDefined();
  });

  it('IdeaCard is to MatchSnapshot', () => {
    expect(idea_card).toMatchSnapshot();
  });

  it('ClientComponent is defined', () => {
    expect(ClientComponent).toBeDefined();
  });

  it('ClientComponent is to MatchSnapshot', () => {
    expect(idea_client).toMatchSnapshot();
  });

  it('IdeaDetailsActions is defined', () => {
    expect(IdeaDetailsActions).toBeDefined();
  });

  it('IdeaDetailsActions is to MatchSnapshot', () => {
    expect(idea_actions).toMatchSnapshot();
  });

  it('IdeasList is defined', () => {
    expect(IdeasList).toBeDefined();
  });

  it('IdeasList is to MatchSnapshot', () => {
    expect(ideas_list).toMatchSnapshot();
  });

  it('ProjectItem is defined', () => {
    expect(ProjectItem).toBeDefined();
  });

  it('ProjectItem is to MatchSnapshot', () => {
    expect(project_item).toMatchSnapshot();
  });

  it('QuestionHead is defined', () => {
    expect(QuestionHead).toBeDefined();
  });

  it('QuestionHead is to MatchSnapshot', () => {
    expect(question_head).toMatchSnapshot();
  });

  it('ZoomInIdea is defined', () => {
    expect(ZoomInIdea).toBeDefined();
  });

  it('ZoomInIdea is to MatchSnapshot', () => {
    expect(zoom_in_idea).toMatchSnapshot();
  });
});
