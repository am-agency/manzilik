import * as API from './api';
import IdeaDetails from './';
import * as utils from './utils';
import { mockProjectIdeas } from '../../mocks/data-mock/utils';
import moment from 'moment';

jest.mock('../../utils', () => ({
  graphqlAuthenticationOperation: (query: Function, variables?: {}) => {
    return {
      data: {},
    };
  },
  graphqlOperation: (query: Function, variables?: {}) => {
    return {
      data: {},
    };
  },
}));

jest.mock('aws-amplify', () => ({
  API: {
    graphql: (fn: Function) => {
      return fn;
    },
  },
}));

describe('Idea Module  test', () => {
  it('IdeaDetails is defined', () => {
    expect(IdeaDetails).toBeDefined();
  });

  it('convertProjectIdeaListToString is defined', () => {
    expect(utils.convertProjectIdeaListToString).toBeDefined();
  });

  it('convertProjectIdeaListToString returns correct string', () => {
    expect(utils.convertProjectIdeaListToString(mockProjectIdeas)).toEqual(
      'a00b3aaf-4b17-41a2-ba56-a64afbb73cb4,d37c6266-c9d5-4706-b746-ac2236823e42,8ecb25d9-1d21-44a8-8d44-e3910946255e'
    );
  });

  it('checkIfProjectIdeaExist is defined', () => {
    expect(utils.checkIfProjectIdeaExist).toBeDefined();
  });

  it('checkIfProjectIdeaExist return correct value', () => {
    expect(utils.checkIfProjectIdeaExist(mockProjectIdeas, mockProjectIdeas[0])).toBeTruthy();
  });

  it('getTimeFormatBasedOnLanguage is defined', () => {
    expect(utils.getTimeFormatBasedOnLanguage).toBeDefined();
  });

  it('getTimeFormatBasedOnLanguage return correct value', () => {
    expect(utils.getTimeFormatBasedOnLanguage(moment().toISOString())).toEqual('منذ ثانية واحدة');
  });

  it('addNoteToIdea is defined', () => {
    expect(API.addNoteToIdea).toBeDefined();
  });

  it('addNoteToIdea is called and working', async () => {
    const params = {
      idea_id: 'idea_id',
      project_id: 'project_id',
      description: 'description',
    };
    const response = await API.addNoteToIdea(params);
    expect(response).toBeUndefined();
  });

  it('copyIdea is defined', () => {
    expect(API.copyIdea).toBeDefined();
  });

  it('copyIdea is called and working', async () => {
    const response = await API.copyIdea({
      new_project_id: '',
      old_project_id: '',
      ideas: '',
    });
    expect(response).toBeUndefined();
  });

  it('deleteIdea is defined', () => {
    expect(API.deleteIdea).toBeDefined();
  });

  it('deleteIdea is called and working', async () => {
    const response = await API.deleteIdea({
      project_id: '',
      ideas: '',
    });
    expect(response).toBeUndefined();
  });

  it('addQuestion is defined', () => {
    expect(API.addQuestion).toBeDefined();
  });

  it('addQuestion is called and working', async () => {
    const response = await API.addQuestion({
      idea_id: '',
      title: '',
      description: '',
    });
    expect(response).toBeUndefined();
  });

  it('moveIdeaToProject is defined', () => {
    expect(API.moveIdeaToProject).toBeDefined();
  });

  it('moveIdeaToProject is called and working', async () => {
    const response = await API.moveIdeaToProject({
      ideas: '',
      old_project_id: '',
      new_project_id: '',
    });
    expect(response).toBeUndefined();
  });

  it('publicIdea is defined', () => {
    expect(API.publicIdea).toBeDefined();
  });

  it('deleteComment is defined', () => {
    expect(API.deleteComment).toBeDefined();
  });

  it('deleteComment is called and working', async () => {
    const response = await API.deleteComment('');
    expect(response).toBeUndefined();
  });

  it('getIdeaQuestions is defined', () => {
    expect(API.getIdeaQuestions).toBeDefined();
  });

  it('getIdeaQuestions is called and working', async () => {
    const response = await API.getIdeaQuestions('');
    expect(response).toBeUndefined();
  });

  it('getPresignedUrl is defined', () => {
    expect(API.getPresignedUrl).toBeDefined();
  });

  it('getPresignedUrl is called and working', async () => {
    const response = await API.getPresignedUrl({ file_name: '', content_type: '' });
    expect(response).toBeUndefined();
  });

  it('likeComment is defined', () => {
    expect(API.likeComment).toBeDefined();
  });

  it('likeComment is called and working', async () => {
    const response = await API.likeComment({ comment_id: '', like: true });
    expect(response).toBeUndefined();
  });

  it('listPreviousIdeaQuestions is defined', () => {
    expect(API.listPreviousIdeaQuestions).toBeDefined();
  });

  it('updateComment is defined', () => {
    expect(API.updateComment).toBeDefined();
  });

  it('updateComment is called and working', async () => {
    const response = await API.updateComment({ comment_id: '', comment: '' });
    expect(response).toBeUndefined();
  });

  it('addQuestion is defined', () => {
    expect(API.addQuestion).toBeDefined();
  });

  it('addQuestion is called and working', async () => {
    const response = await API.addQuestion({ idea_id: '', title: '', description: '' });
    expect(response).toBeUndefined();
  });
});
