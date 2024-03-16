import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { render, RenderResult } from '@testing-library/react';
import i18n from '../../../app/i18n';
import { SingleIdeaOperations } from './single_idea_operations';
import { MultiIdeasOperations } from './multi_ideas_operations';
import { mockProjectIdeas } from '../../../mocks/data-mock/utils';
let single_idea_operations: RenderResult;
let multi_idea_operations: RenderResult;

describe('Idea operations  test', () => {
  beforeAll((done) => {
    single_idea_operations = render(
      <I18nextProvider i18n={i18n}>
        <SingleIdeaOperations projectId="projectId" projectIdea={mockProjectIdeas[0]} />
      </I18nextProvider>
    );

    multi_idea_operations = render(
      <I18nextProvider i18n={i18n}>
        <MultiIdeasOperations projectId="projectId" projectIdea={mockProjectIdeas[0]} cancelOrganizeMode={jest.fn} />
      </I18nextProvider>
    );

    done();
  });

  it('SingleIdeaOperations is defined', () => {
    expect(SingleIdeaOperations).toBeDefined();
  });

  it('SingleIdeaOperations is to MatchSnapshot', () => {
    expect(single_idea_operations).toMatchSnapshot();
  });

  it('MultiIdeasOperations is defined', () => {
    expect(MultiIdeasOperations).toBeDefined();
  });

  it('MultiIdeasOperations is to MatchSnapshot', () => {
    expect(multi_idea_operations).toMatchSnapshot();
  });
});
