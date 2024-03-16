import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { render, RenderResult } from '@testing-library/react';
import i18n from '../../../app/i18n';
import { DeleteIdeaForm } from './delete_idea';
import { MoveOrCopyIdeaForm } from './move_copy_idea';
import { SaveIdeaForm } from './save_idea';
import { MOVE } from '../../../locales/strings';
import { mockClient } from '../../../mocks/data-mock/utils';
import { IDEA } from '../../../app/settings';
let delete_idea: RenderResult;
let move_copy_idea: RenderResult;
let save_idea: RenderResult;

describe('CommentList  test', () => {
  beforeAll((done) => {
    delete_idea = render(
      <I18nextProvider i18n={i18n}>
        <DeleteIdeaForm projectId="projectId" />
      </I18nextProvider>
    );

    move_copy_idea = render(
      <I18nextProvider i18n={i18n}>
        <MoveOrCopyIdeaForm projectId="projectId" method={MOVE} />
      </I18nextProvider>
    );

    save_idea = render(
      <I18nextProvider i18n={i18n}>
        <SaveIdeaForm projectId="projectId" postMoveIdea={jest.fn} client={mockClient} tag={IDEA} />
      </I18nextProvider>
    );

    done();
  });

  it('DeleteIdeaForm is defined', () => {
    expect(DeleteIdeaForm).toBeDefined();
  });

  it('DeleteIdeaForm is to MatchSnapshot', () => {
    expect(delete_idea).toMatchSnapshot();
  });

  it('MoveOrCopyIdeaForm is defined', () => {
    expect(MoveOrCopyIdeaForm).toBeDefined();
  });

  it('MoveOrCopyIdeaForm is to MatchSnapshot', () => {
    expect(move_copy_idea).toMatchSnapshot();
  });

  it('SaveIdeaForm is defined', () => {
    expect(SaveIdeaForm).toBeDefined();
  });

  it('SaveIdeaForm is to MatchSnapshot', () => {
    expect(save_idea).toMatchSnapshot();
  });
});
