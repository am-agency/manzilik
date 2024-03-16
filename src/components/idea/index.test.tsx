import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../app/i18n';
import { render, RenderResult } from '@testing-library/react';
import { IdeasFromManzil } from './ideas_from_manzil';
import { IdeaCard } from './';
import { mockProjectIdeas } from '../../mocks/data-mock/utils';
import TabType from '../../pages/project';
import { MyIdeas } from './my_ideas';
let ideasFromManzil: RenderResult;
let ideaCard: RenderResult;
let myIdeas: RenderResult;

describe('IdeasFromManzil test', () => {
  beforeAll((done) => {
    ideasFromManzil = render(
      <I18nextProvider i18n={i18n}>
        <IdeasFromManzil
          projectIdea={mockProjectIdeas[0]}
          onAddIdeaToProject={jest.fn}
          onCardHover={jest.fn}
          isIdeaSelected={false}
        />
      </I18nextProvider>
    );

    ideaCard = render(
      <I18nextProvider i18n={i18n}>
        <IdeaCard tabType={TabType.MyIdeas} projectId={'projectId'} projectIdea={mockProjectIdeas[0]} />
      </I18nextProvider>
    );

    myIdeas = render(
      <I18nextProvider i18n={i18n}>
        <MyIdeas onCardHover={jest.fn} projectId={'projectId'} projectIdea={mockProjectIdeas[0]} />
      </I18nextProvider>
    );
    done();
  });

  it('IdeasFromManzil is defined', () => {
    expect(IdeasFromManzil).toBeDefined();
  });

  it('IdeasFromManzil is defined', () => {
    expect(ideasFromManzil).toMatchSnapshot();
  });

  it('IdeaCard is defined', () => {
    expect(IdeaCard).toBeDefined();
  });

  it('IdeasFromManzil is defined', () => {
    expect(ideaCard).toMatchSnapshot();
  });

  it('IdeaCard is defined', () => {
    expect(MyIdeas).toBeDefined();
  });

  it('IdeasFromManzil is defined', () => {
    expect(myIdeas).toMatchSnapshot();
  });
});
