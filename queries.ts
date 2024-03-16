/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getHello = /* GraphQL */ `
  query GetHello {
    getHello {
      id
      time
    }
  }
`;
export const listCategories = /* GraphQL */ `
  query ListCategories {
    listCategories {
      id
      arabic_title
      english_title
      description
      parent {
        id
        arabic_title
        english_title
        description
        parent {
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
  }
`;
export const getCategory = /* GraphQL */ `
  query GetCategory($id: ID!) {
    getCategory(id: $id) {
      id
      arabic_title
      english_title
      description
      parent {
        id
        arabic_title
        english_title
        description
        parent {
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
  }
`;
export const listRoomTypes = /* GraphQL */ `
  query ListRoomTypes {
    listRoomTypes {
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
        photo
        status
        created_at
        updated_at
      }
      status
      created_at
      updated_at
    }
  }
`;
export const getRoomType = /* GraphQL */ `
  query GetRoomType($id: ID!) {
    getRoomType(id: $id) {
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
        photo
        status
        created_at
        updated_at
      }
      status
      created_at
      updated_at
    }
  }
`;
export const getProject = /* GraphQL */ `
  query GetProject($id: ID!) {
    getProject(id: $id) {
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
export const listProjects = /* GraphQL */ `
  query ListProjects($input: Pagination!) {
    listProjects(input: $input) {
      projects {
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
      projects_total
    }
  }
`;
export const listProjectsWithFirstIdea = /* GraphQL */ `
  query ListProjectsWithFirstIdea($input: Pagination!) {
    listProjectsWithFirstIdea(input: $input) {
      projects {
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
      projects_total
    }
  }
`;
export const listClientProjects = /* GraphQL */ `
  query ListClientProjects($input: Pagination!) {
    listClientProjects(input: $input) {
      projects {
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
      projects_total
    }
  }
`;
export const listProjectIdeas = /* GraphQL */ `
  query ListProjectIdeas($input: PaginationWithProjectInput!) {
    listProjectIdeas(input: $input) {
      ideas {
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
      ideas_total
    }
  }
`;
export const getPublicIdeaDetails = /* GraphQL */ `
  query GetPublicIdeaDetails($input: PaginationWithProjectAndIdeaInput!) {
    getPublicIdeaDetails(input: $input) {
      ideas {
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
      project {
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
      ideas_total
    }
  }
`;
export const getIdea = /* GraphQL */ `
  query GetIdea($id: ID!) {
    getIdea(id: $id) {
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
export const listIdeas = /* GraphQL */ `
  query ListIdeas($input: PaginationWithProjectInput!) {
    listIdeas(input: $input) {
      ideas {
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
      ideas_total
    }
  }
`;
export const getClient = /* GraphQL */ `
  query GetClient {
    getClient {
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
export const listCities = /* GraphQL */ `
  query ListCities($country_id: String!) {
    listCities(country_id: $country_id) {
      id
      created_at
      updated_at
      status
      name
    }
  }
`;
export const listCountries = /* GraphQL */ `
  query ListCountries {
    listCountries {
      id
      created_at
      updated_at
      status
      name
      country_flag
    }
  }
`;
export const listClients = /* GraphQL */ `
  query ListClients($input: Pagination!) {
    listClients(input: $input) {
      clients {
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
      clients_total
    }
  }
`;
export const getPresignedUrl = /* GraphQL */ `
  query GetPresignedUrl($input: PresignedUrlInput!) {
    getPresignedUrl(input: $input) {
      result
    }
  }
`;
export const listCollaborators = /* GraphQL */ `
  query ListCollaborators($project_id: String!) {
    listCollaborators(project_id: $project_id) {
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
export const listSuggestedCollaborators = /* GraphQL */ `
  query ListSuggestedCollaborators($input: PaginationWithProjectInput!) {
    listSuggestedCollaborators(input: $input) {
      clients {
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
      clients_total
    }
  }
`;
export const listPreviousIdeaQuestions = /* GraphQL */ `
  query ListPreviousIdeaQuestions($input: PaginationWithIdeaInput!) {
    listPreviousIdeaQuestions(input: $input) {
      questions {
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
      questions_total
    }
  }
`;
export const listIdeaQuestionsWithComments = /* GraphQL */ `
  query ListIdeaQuestionsWithComments($idea_id: ID!) {
    listIdeaQuestionsWithComments(idea_id: $idea_id) {
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
export const listDiscussionTopics = /* GraphQL */ `
  query ListDiscussionTopics {
    listDiscussionTopics {
      id
      created_at
      updated_at
      status
      title
      description
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments($input: PaginationWithCommentInput!) {
    listComments(input: $input) {
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
export const listSpamReasons = /* GraphQL */ `
  query ListSpamReasons {
    listSpamReasons {
      id
      created_at
      updated_at
      status
      name
      description
    }
  }
`;
export const getDiscussionDetails = /* GraphQL */ `
  query GetDiscussionDetails($discussion_id: ID!) {
    getDiscussionDetails(discussion_id: $discussion_id) {
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
export const searchIdeas = /* GraphQL */ `
  query SearchIdeas($input: SearchInput!) {
    searchIdeas(input: $input) {
      ideas {
        id
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
      total
    }
  }
`;
export const listFilters = /* GraphQL */ `
  query ListFilters($input: FilterInput!) {
    listFilters(input: $input) {
      filter_type
      title
      filters {
        id
        code
        title
      }
    }
  }
`;
export const listInterestedTopics = /* GraphQL */ `
  query ListInterestedTopics {
    listInterestedTopics {
      id
      created_at
      updated_at
      status
      title
      description
    }
  }
`;
export const listMostRecentDiscussions = /* GraphQL */ `
  query ListMostRecentDiscussions($input: Pagination!) {
    listMostRecentDiscussions(input: $input) {
      discussions {
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
      discussions_total
    }
  }
`;
