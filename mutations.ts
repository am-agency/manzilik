/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const sayHello = /* GraphQL */ `
  mutation SayHello($id: String!) {
    sayHello(id: $id) {
      id
      time
    }
  }
`;
export const addProject = /* GraphQL */ `
  mutation AddProject($input: ProjectInput!) {
    addProject(input: $input) {
      id
      room_type {
        id
        arabic_title
        english_title
        category {
          id
          arabic_title
          english_title
          description
          parent {
            id
            arabic_title
            english_title
            description
            photo
            status
            created_at
            updated_at
          }
          photo
          status
          created_at
          updated_at
        }
        status
        created_at
        updated_at
      }
      is_default
      title
      status
      created_at
      updated_at
      visibility
      client_id
      client {
        id
        created_at
        updated_at
        status
        first_name
        last_name
        email
        gender
        type
        about_me
        my_fav_style
        my_next_style
        city_id
        country_id
        city {
          id
          created_at
          updated_at
          status
          name
        }
        country {
          id
          created_at
          updated_at
          status
          name
          country_flag
        }
        zip
        state
        following_count
        followers_count
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        project_role
      }
      discussions_count
      ideas_count
      description
      idea {
        id
        created_at
        updated_at
        title
        photo
        status
        source
        description
        project_id
        client {
          id
          created_at
          updated_at
          status
          first_name
          last_name
          email
          gender
          type
          about_me
          my_fav_style
          my_next_style
          city_id
          country_id
          city {
            id
            created_at
            updated_at
            status
            name
          }
          country {
            id
            created_at
            updated_at
            status
            name
            country_flag
          }
          zip
          state
          following_count
          followers_count
          total_review
          profile_image
          facebook
          twitter
          linkedin
          blog
          project_role
        }
        client_id
        questions_count
        shares_count
        likes_count
        is_liked
      }
      likes_count
      shares_count
      is_liked
    }
  }
`;
export const deleteProject = /* GraphQL */ `
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
      room_type {
        id
        arabic_title
        english_title
        category {
          id
          arabic_title
          english_title
          description
          parent {
            id
            arabic_title
            english_title
            description
            photo
            status
            created_at
            updated_at
          }
          photo
          status
          created_at
          updated_at
        }
        status
        created_at
        updated_at
      }
      is_default
      title
      status
      created_at
      updated_at
      visibility
      client_id
      client {
        id
        created_at
        updated_at
        status
        first_name
        last_name
        email
        gender
        type
        about_me
        my_fav_style
        my_next_style
        city_id
        country_id
        city {
          id
          created_at
          updated_at
          status
          name
        }
        country {
          id
          created_at
          updated_at
          status
          name
          country_flag
        }
        zip
        state
        following_count
        followers_count
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        project_role
      }
      discussions_count
      ideas_count
      description
      idea {
        id
        created_at
        updated_at
        title
        photo
        status
        source
        description
        project_id
        client {
          id
          created_at
          updated_at
          status
          first_name
          last_name
          email
          gender
          type
          about_me
          my_fav_style
          my_next_style
          city_id
          country_id
          city {
            id
            created_at
            updated_at
            status
            name
          }
          country {
            id
            created_at
            updated_at
            status
            name
            country_flag
          }
          zip
          state
          following_count
          followers_count
          total_review
          profile_image
          facebook
          twitter
          linkedin
          blog
          project_role
        }
        client_id
        questions_count
        shares_count
        likes_count
        is_liked
      }
      likes_count
      shares_count
      is_liked
    }
  }
`;
export const addIdea = /* GraphQL */ `
  mutation AddIdea($input: NewIdeaInput!) {
    addIdea(input: $input) {
      id
      created_at
      updated_at
      title
      photo
      status
      source
      description
      project_id
      client {
        id
        created_at
        updated_at
        status
        first_name
        last_name
        email
        gender
        type
        about_me
        my_fav_style
        my_next_style
        city_id
        country_id
        city {
          id
          created_at
          updated_at
          status
          name
        }
        country {
          id
          created_at
          updated_at
          status
          name
          country_flag
        }
        zip
        state
        following_count
        followers_count
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        project_role
      }
      client_id
      questions_count
      shares_count
      likes_count
      is_liked
    }
  }
`;
export const updateProject = /* GraphQL */ `
  mutation UpdateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      id
      room_type {
        id
        arabic_title
        english_title
        category {
          id
          arabic_title
          english_title
          description
          parent {
            id
            arabic_title
            english_title
            description
            photo
            status
            created_at
            updated_at
          }
          photo
          status
          created_at
          updated_at
        }
        status
        created_at
        updated_at
      }
      is_default
      title
      status
      created_at
      updated_at
      visibility
      client_id
      client {
        id
        created_at
        updated_at
        status
        first_name
        last_name
        email
        gender
        type
        about_me
        my_fav_style
        my_next_style
        city_id
        country_id
        city {
          id
          created_at
          updated_at
          status
          name
        }
        country {
          id
          created_at
          updated_at
          status
          name
          country_flag
        }
        zip
        state
        following_count
        followers_count
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        project_role
      }
      discussions_count
      ideas_count
      description
      idea {
        id
        created_at
        updated_at
        title
        photo
        status
        source
        description
        project_id
        client {
          id
          created_at
          updated_at
          status
          first_name
          last_name
          email
          gender
          type
          about_me
          my_fav_style
          my_next_style
          city_id
          country_id
          city {
            id
            created_at
            updated_at
            status
            name
          }
          country {
            id
            created_at
            updated_at
            status
            name
            country_flag
          }
          zip
          state
          following_count
          followers_count
          total_review
          profile_image
          facebook
          twitter
          linkedin
          blog
          project_role
        }
        client_id
        questions_count
        shares_count
        likes_count
        is_liked
      }
      likes_count
      shares_count
      is_liked
    }
  }
`;
export const moveIdea = /* GraphQL */ `
  mutation MoveIdea($input: MoveIdeaInput!) {
    moveIdea(input: $input) {
      message
    }
  }
`;
export const copyIdea = /* GraphQL */ `
  mutation CopyIdea($input: CopyIdeaInput!) {
    copyIdea(input: $input) {
      message
    }
  }
`;
export const deleteIdea = /* GraphQL */ `
  mutation DeleteIdea($input: DeleteIdeaInput!) {
    deleteIdea(input: $input) {
      message
    }
  }
`;
export const addNoteToProjectIdea = /* GraphQL */ `
  mutation AddNoteToProjectIdea($input: AddNoteToProjectIdeaInput!) {
    addNoteToProjectIdea(input: $input) {
      id
      created_at
      updated_at
      title
      photo
      status
      source
      description
      project_id
      client {
        id
        created_at
        updated_at
        status
        first_name
        last_name
        email
        gender
        type
        about_me
        my_fav_style
        my_next_style
        city_id
        country_id
        city {
          id
          created_at
          updated_at
          status
          name
        }
        country {
          id
          created_at
          updated_at
          status
          name
          country_flag
        }
        zip
        state
        following_count
        followers_count
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        project_role
      }
      client_id
      questions_count
      shares_count
      likes_count
      is_liked
    }
  }
`;
export const addExistIdea = /* GraphQL */ `
  mutation AddExistIdea($input: AddExistIdeaInput!) {
    addExistIdea(input: $input) {
      id
      created_at
      updated_at
      title
      photo
      status
      source
      description
      project_id
      client {
        id
        created_at
        updated_at
        status
        first_name
        last_name
        email
        gender
        type
        about_me
        my_fav_style
        my_next_style
        city_id
        country_id
        city {
          id
          created_at
          updated_at
          status
          name
        }
        country {
          id
          created_at
          updated_at
          status
          name
          country_flag
        }
        zip
        state
        following_count
        followers_count
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        project_role
      }
      client_id
      questions_count
      shares_count
      likes_count
      is_liked
    }
  }
`;
export const editProfile = /* GraphQL */ `
  mutation EditProfile($input: EditClientProfileInput!) {
    editProfile(input: $input) {
      id
      created_at
      updated_at
      status
      first_name
      last_name
      email
      gender
      type
      about_me
      my_fav_style
      my_next_style
      city_id
      country_id
      city {
        id
        created_at
        updated_at
        status
        name
      }
      country {
        id
        created_at
        updated_at
        status
        name
        country_flag
      }
      zip
      state
      following_count
      followers_count
      total_review
      profile_image
      facebook
      twitter
      linkedin
      blog
      project_role
    }
  }
`;
export const inviteCollaborators = /* GraphQL */ `
  mutation InviteCollaborators($input: InviteCollaboratorsInput!) {
    inviteCollaborators(input: $input) {
      message
    }
  }
`;
export const deleteCollaborators = /* GraphQL */ `
  mutation DeleteCollaborators($input: InviteCollaboratorsInput!) {
    deleteCollaborators(input: $input) {
      message
    }
  }
`;
export const addQuestion = /* GraphQL */ `
  mutation AddQuestion($input: AddQuestionInput!) {
    addQuestion(input: $input) {
      id
      created_at
      updated_at
      status
      title
      description
      idea_id
      client_id
      idea {
        id
        created_at
        updated_at
        title
        photo
        status
        source
        description
        project_id
        client {
          id
          created_at
          updated_at
          status
          first_name
          last_name
          email
          gender
          type
          about_me
          my_fav_style
          my_next_style
          city_id
          country_id
          city {
            id
            created_at
            updated_at
            status
            name
          }
          country {
            id
            created_at
            updated_at
            status
            name
            country_flag
          }
          zip
          state
          following_count
          followers_count
          total_review
          profile_image
          facebook
          twitter
          linkedin
          blog
          project_role
        }
        client_id
        questions_count
        shares_count
        likes_count
        is_liked
      }
      client {
        id
        created_at
        updated_at
        status
        first_name
        last_name
        email
        gender
        type
        about_me
        my_fav_style
        my_next_style
        city_id
        country_id
        city {
          id
          created_at
          updated_at
          status
          name
        }
        country {
          id
          created_at
          updated_at
          status
          name
          country_flag
        }
        zip
        state
        following_count
        followers_count
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        project_role
      }
      who_like {
        id
        created_at
        updated_at
        status
        first_name
        last_name
        email
        gender
        type
        about_me
        my_fav_style
        my_next_style
        city_id
        country_id
        city {
          id
          created_at
          updated_at
          status
          name
        }
        country {
          id
          created_at
          updated_at
          status
          name
          country_flag
        }
        zip
        state
        following_count
        followers_count
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        project_role
      }
      comments {
        id
        created_at
        updated_at
        status
        comment
        image
        table
        table_id
        who_like {
          id
          created_at
          updated_at
          status
          first_name
          last_name
          email
          gender
          type
          about_me
          my_fav_style
          my_next_style
          city_id
          country_id
          city {
            id
            created_at
            updated_at
            status
            name
          }
          country {
            id
            created_at
            updated_at
            status
            name
            country_flag
          }
          zip
          state
          following_count
          followers_count
          total_review
          profile_image
          facebook
          twitter
          linkedin
          blog
          project_role
        }
        client {
          id
          created_at
          updated_at
          status
          first_name
          last_name
          email
          gender
          type
          about_me
          my_fav_style
          my_next_style
          city_id
          country_id
          city {
            id
            created_at
            updated_at
            status
            name
          }
          country {
            id
            created_at
            updated_at
            status
            name
            country_flag
          }
          zip
          state
          following_count
          followers_count
          total_review
          profile_image
          facebook
          twitter
          linkedin
          blog
          project_role
        }
        client_id
      }
    }
  }
`;
export const likeQuestion = /* GraphQL */ `
  mutation LikeQuestion($input: LikeQuestionInput!) {
    likeQuestion(input: $input) {
      id
      created_at
      updated_at
      status
      title
      description
      idea_id
      client_id
      idea {
        id
        created_at
        updated_at
        title
        photo
        status
        source
        description
        project_id
        client {
          id
          created_at
          updated_at
          status
          first_name
          last_name
          email
          gender
          type
          about_me
          my_fav_style
          my_next_style
          city_id
          country_id
          city {
            id
            created_at
            updated_at
            status
            name
          }
          country {
            id
            created_at
            updated_at
            status
            name
            country_flag
          }
          zip
          state
          following_count
          followers_count
          total_review
          profile_image
          facebook
          twitter
          linkedin
          blog
          project_role
        }
        client_id
        questions_count
        shares_count
        likes_count
        is_liked
      }
      client {
        id
        created_at
        updated_at
        status
        first_name
        last_name
        email
        gender
        type
        about_me
        my_fav_style
        my_next_style
        city_id
        country_id
        city {
          id
          created_at
          updated_at
          status
          name
        }
        country {
          id
          created_at
          updated_at
          status
          name
          country_flag
        }
        zip
        state
        following_count
        followers_count
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        project_role
      }
      who_like {
        id
        created_at
        updated_at
        status
        first_name
        last_name
        email
        gender
        type
        about_me
        my_fav_style
        my_next_style
        city_id
        country_id
        city {
          id
          created_at
          updated_at
          status
          name
        }
        country {
          id
          created_at
          updated_at
          status
          name
          country_flag
        }
        zip
        state
        following_count
        followers_count
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        project_role
      }
      comments {
        id
        created_at
        updated_at
        status
        comment
        image
        table
        table_id
        who_like {
          id
          created_at
          updated_at
          status
          first_name
          last_name
          email
          gender
          type
          about_me
          my_fav_style
          my_next_style
          city_id
          country_id
          city {
            id
            created_at
            updated_at
            status
            name
          }
          country {
            id
            created_at
            updated_at
            status
            name
            country_flag
          }
          zip
          state
          following_count
          followers_count
          total_review
          profile_image
          facebook
          twitter
          linkedin
          blog
          project_role
        }
        client {
          id
          created_at
          updated_at
          status
          first_name
          last_name
          email
          gender
          type
          about_me
          my_fav_style
          my_next_style
          city_id
          country_id
          city {
            id
            created_at
            updated_at
            status
            name
          }
          country {
            id
            created_at
            updated_at
            status
            name
            country_flag
          }
          zip
          state
          following_count
          followers_count
          total_review
          profile_image
          facebook
          twitter
          linkedin
          blog
          project_role
        }
        client_id
      }
    }
  }
`;
export const addComment = /* GraphQL */ `
  mutation AddComment($input: AddCommentInput!) {
    addComment(input: $input) {
      id
      created_at
      updated_at
      status
      comment
      image
      table
      table_id
      who_like {
        id
        created_at
        updated_at
        status
        first_name
        last_name
        email
        gender
        type
        about_me
        my_fav_style
        my_next_style
        city_id
        country_id
        city {
          id
          created_at
          updated_at
          status
          name
        }
        country {
          id
          created_at
          updated_at
          status
          name
          country_flag
        }
        zip
        state
        following_count
        followers_count
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        project_role
      }
      client {
        id
        created_at
        updated_at
        status
        first_name
        last_name
        email
        gender
        type
        about_me
        my_fav_style
        my_next_style
        city_id
        country_id
        city {
          id
          created_at
          updated_at
          status
          name
        }
        country {
          id
          created_at
          updated_at
          status
          name
          country_flag
        }
        zip
        state
        following_count
        followers_count
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        project_role
      }
      client_id
    }
  }
`;
export const updateComment = /* GraphQL */ `
  mutation UpdateComment($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      id
      created_at
      updated_at
      status
      comment
      image
      table
      table_id
      who_like {
        id
        created_at
        updated_at
        status
        first_name
        last_name
        email
        gender
        type
        about_me
        my_fav_style
        my_next_style
        city_id
        country_id
        city {
          id
          created_at
          updated_at
          status
          name
        }
        country {
          id
          created_at
          updated_at
          status
          name
          country_flag
        }
        zip
        state
        following_count
        followers_count
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        project_role
      }
      client {
        id
        created_at
        updated_at
        status
        first_name
        last_name
        email
        gender
        type
        about_me
        my_fav_style
        my_next_style
        city_id
        country_id
        city {
          id
          created_at
          updated_at
          status
          name
        }
        country {
          id
          created_at
          updated_at
          status
          name
          country_flag
        }
        zip
        state
        following_count
        followers_count
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        project_role
      }
      client_id
    }
  }
`;
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id) {
      message
    }
  }
`;
export const likeComment = /* GraphQL */ `
  mutation LikeComment($input: LikeCommentInput!) {
    likeComment(input: $input) {
      id
      created_at
      updated_at
      status
      comment
      image
      table
      table_id
      who_like {
        id
        created_at
        updated_at
        status
        first_name
        last_name
        email
        gender
        type
        about_me
        my_fav_style
        my_next_style
        city_id
        country_id
        city {
          id
          created_at
          updated_at
          status
          name
        }
        country {
          id
          created_at
          updated_at
          status
          name
          country_flag
        }
        zip
        state
        following_count
        followers_count
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        project_role
      }
      client {
        id
        created_at
        updated_at
        status
        first_name
        last_name
        email
        gender
        type
        about_me
        my_fav_style
        my_next_style
        city_id
        country_id
        city {
          id
          created_at
          updated_at
          status
          name
        }
        country {
          id
          created_at
          updated_at
          status
          name
          country_flag
        }
        zip
        state
        following_count
        followers_count
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        project_role
      }
      client_id
    }
  }
`;
export const likeProject = /* GraphQL */ `
  mutation LikeProject($input: LikeProjectInput!) {
    likeProject(input: $input) {
      id
      room_type {
        id
        arabic_title
        english_title
        category {
          id
          arabic_title
          english_title
          description
          parent {
            id
            arabic_title
            english_title
            description
            photo
            status
            created_at
            updated_at
          }
          photo
          status
          created_at
          updated_at
        }
        status
        created_at
        updated_at
      }
      is_default
      title
      status
      created_at
      updated_at
      visibility
      client_id
      client {
        id
        created_at
        updated_at
        status
        first_name
        last_name
        email
        gender
        type
        about_me
        my_fav_style
        my_next_style
        city_id
        country_id
        city {
          id
          created_at
          updated_at
          status
          name
        }
        country {
          id
          created_at
          updated_at
          status
          name
          country_flag
        }
        zip
        state
        following_count
        followers_count
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        project_role
      }
      discussions_count
      ideas_count
      description
      idea {
        id
        created_at
        updated_at
        title
        photo
        status
        source
        description
        project_id
        client {
          id
          created_at
          updated_at
          status
          first_name
          last_name
          email
          gender
          type
          about_me
          my_fav_style
          my_next_style
          city_id
          country_id
          city {
            id
            created_at
            updated_at
            status
            name
          }
          country {
            id
            created_at
            updated_at
            status
            name
            country_flag
          }
          zip
          state
          following_count
          followers_count
          total_review
          profile_image
          facebook
          twitter
          linkedin
          blog
          project_role
        }
        client_id
        questions_count
        shares_count
        likes_count
        is_liked
      }
      likes_count
      shares_count
      is_liked
    }
  }
`;
export const likeIdea = /* GraphQL */ `
  mutation LikeIdea($input: LikeIdeaInput!) {
    likeIdea(input: $input) {
      id
      created_at
      updated_at
      title
      photo
      status
      source
      description
      project_id
      client {
        id
        created_at
        updated_at
        status
        first_name
        last_name
        email
        gender
        type
        about_me
        my_fav_style
        my_next_style
        city_id
        country_id
        city {
          id
          created_at
          updated_at
          status
          name
        }
        country {
          id
          created_at
          updated_at
          status
          name
          country_flag
        }
        zip
        state
        following_count
        followers_count
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        project_role
      }
      client_id
      questions_count
      shares_count
      likes_count
      is_liked
    }
  }
`;
export const saveShareData = /* GraphQL */ `
  mutation SaveShareData($input: SaveShareDataInput!) {
    saveShareData(input: $input) {
      message
    }
  }
`;
export const addDiscussion = /* GraphQL */ `
  mutation AddDiscussion($input: AddDiscussionInput!) {
    addDiscussion(input: $input) {
      id
      created_at
      updated_at
      status
      title
      description
      client_id
      youtube_url
      photo_url
      web_url
      topics {
        id
        created_at
        updated_at
        status
        title
        description
      }
      polls {
        id
        created_at
        updated_at
        status
        title
        photo_url
      }
    }
  }
`;
export const saveInterestedTopic = /* GraphQL */ `
  mutation SaveInterestedTopic($input: SaveInterestedTopicInput!) {
    saveInterestedTopic(input: $input) {
      message
    }
  }
`;
export const addDiscussionToProject = /* GraphQL */ `
  mutation AddDiscussionToProject($input: AddDiscussionToProjectInput!) {
    addDiscussionToProject(input: $input) {
      id
      created_at
      updated_at
      status
      title
      description
      client_id
      youtube_url
      photo_url
      web_url
      topics {
        id
        created_at
        updated_at
        status
        title
        description
      }
      polls {
        id
        created_at
        updated_at
        status
        title
        photo_url
      }
    }
  }
`;
export const deleteDiscussion = /* GraphQL */ `
  mutation DeleteDiscussion($id: ID!) {
    deleteDiscussion(id: $id) {
      message
    }
  }
`;
export const deleteDiscussionFromProject = /* GraphQL */ `
  mutation DeleteDiscussionFromProject($input: DeleteDiscussionFromProjectInput!) {
    deleteDiscussionFromProject(input: $input) {
      message
    }
  }
`;
export const spamComment = /* GraphQL */ `
  mutation SpamComment($input: SpamCommentInput!) {
    spamComment(input: $input) {
      message
    }
  }
`;
export const spamDiscussion = /* GraphQL */ `
  mutation SpamDiscussion($input: SpamDiscussionInput!) {
    spamDiscussion(input: $input) {
      message
    }
  }
`;
