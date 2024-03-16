export const listHomePageProjects = /* GraphQL */ `
  query ListHomePageProjects($input: Pagination) {
    listHomePageProjects(input: $input) {
      count
      next
      previous
      results {
        id
        is_default
        title
        visibility
        client_id
        discussions_count
        ideas_count
        likes_count
        shares_count
        description
        client {
          id
          status
          first_name
          last_name
          email
          type
        }
        default_idea {
          id
          tag
          title
          photo
          description
          project_id
          client {
            id
            first_name
            last_name
            email
            type
            project_role
          }
        }
        is_liked
      }
    }
  }
`;

export const getHomePageSlider = /* GraphQL */ `
  query GetHomePageSlider {
    getHomePageSlider {
      result
    }
  }
`;

export const getMenu = /* GraphQL */ `
  query GetMenu {
    getMenu {
      data
    }
  }
`;

export const getGeneralSettings = /* GraphQL */ `
  query GetGeneralSettings {
    getGeneralSettings {
      hyperPayPaymentUrl
      enableEcommerce
      showProfessionalReviews
    }
  }
`;

export const listProjectIdeas = /* GraphQL */ `
  query GetProject($id: ID!, $input: Pagination) {
    getProject(id: $id) {
      id
      title
      status
      created_at
      updated_at
      visibility
      discussions_count
      ideas_count
      description
      client {
        id
        first_name
        type
        last_name
        email
        mobile
        following_count
        followers_count
        followees_count
        is_followed
        total_review
        profile_image
      }
      room_type {
        id
        title
        photo
        category {
          id
          title
        }
      }
      default_idea {
        id
        title
        photo
        google_vision_result
        ideaLabels {
          count
          results {
            id
            name
            coordinates {
              x
              y
            }
            related_stockrecords_count
          }
        }
      }
      ideasList(input: $input) {
        count
        results {
          id
          photo
          google_vision_result
          ideaLabels {
            count
            results {
              id
              name
              coordinates {
                x
                y
              }
              related_stockrecords_count
            }
          }
          project {
            id
            title
            description
          }
          client {
            id
            email
            first_name
            last_name
            mobile
            type
            following_count
            followers_count
            followees_count
            is_followed
            total_review
            profile_image
          }
        }
      }
    }
  }
`;

export const listProjectQuestion = /* GraphQL */ `
  query GetProject($id: ID!, $input: Pagination) {
    getProject(id: $id) {
      id
      title
      status
      ideas_count
      description
      client {
        id
        first_name
        type
      }
      questions(input: $input) {
        count
        results {
          id
          title
          description
          idea_id
          created_at
          idea {
            title
            id
          }
          client {
            id
            email
            first_name
            last_name
            type
            created_at
          }
        }
      }
    }
  }
`;

export const listMyProjects = /* GraphQL */ `
  query ListMyProjects($input: Pagination) {
    listMyProjects(input: $input) {
      count
      next
      previous
      results {
        id
        is_default
        title
        status
        created_at
        updated_at
        visibility
        client_id
        client {
          id
          status
          first_name
          last_name
          email
          type
        }
        discussions_count
        ideas_count
        likes_count
        shares_count
        description
        default_idea {
          id
          tag
          title
          photo
          status
          source
          description
          project_id
          client_id
        }
        is_liked
      }
    }
  }
`;
/**
 * [describe why we cant have the idea get the client directly]
 * without an existing project the idea won't be owned by anyone.
 * so if a user deletes a project he loses ownership of the ideas
 * */
export const listClientIdeasByClientId = /* GraphQL */ `
  query ListClientIdeasByClientId($input: Pagination!) {
    listClientIdeasByClientId(input: $input) {
      count
      next
      previous
      results {
        id
        tag
        created_at
        updated_at
        title
        photo
        status
        source
        description
        project_id
        project {
          id
          is_default
          title
          status
          created_at
          updated_at
          visibility
          client_id
          discussions_count
          questions_count
          ideas_count
          likes_count
          shares_count
          description
          is_liked
        }
        client {
          id
          first_name
          last_name
          email
          mobile
          type
        }
        questions_count
        shares_count
        likes_count
        is_liked
        is_photo_uploaded
      }
    }
  }
`;

export const getProjectMinimized = /* GraphQL */ `
  query GetProject($id: ID!) {
    getProject(id: $id) {
      id
      title
      status
      created_at
      updated_at
      visibility
      discussions_count
      ideas_count
      description
      public_profile_deep_link
      default_idea {
        id
        photo
        title
      }
      client {
        id
      }
      room_type {
        id
        title
      }
      ideas {
        client_id
        created_at
        description
        google_vision_result
        id
        is_liked
        is_photo_uploaded
        likes_count
        photo
        project_id
        questions_count
        shares_count
        source
        status
        tag
        title
        updated_at
        client {
          related_professional {
            is_profile_completed
            professional_type
            company_name
            company_logo
            is_verified
            reviews_count
            reviews_total
            is_reviewable
          }
          about_me
          blog
          city_id
          comments_count
          country_code
          country_id
          created_at
          discussions_count
          email
          facebook
          first_name
          followees_count
          followers_count
          following_count
          gender
          id
          is_followed
          is_verified
          last_login
          last_name
          linkedin
          mobile
          my_fav_style
          my_next_style
          profile_image
          project_role
          state
          status
          total_review
          twitter
          type
          updated_at
          zip
        }
      }
    }
  }
`;

export const listProjectEntities = /* GraphQL */ `
  query GetProject($id: ID!, $input: ProjectEntitiesInput) {
    getProject(id: $id) {
      id
      title
      status
      created_at
      updated_at
      visibility
      discussions_count
      ideas_count
      description
      default_idea {
        photo
        title
      }
      client {
        id
      }
      entities(input: $input) {
        count
        results {
          status
          photo
          description
          tag
          client_id
          project_id
          entity_id
          title
          is_main_entity
        }
      }
    }
  }
`;

export const getAuthenticatedClient = /* GraphQL */ `
  query GetAuthenticatedClient {
    getAuthenticatedClient {
      id
      created_at
      updated_at
      status
      first_name
      last_name
      email
      mobile
      country_code
      gender
      type
      about_me
      my_fav_style
      my_next_style
      city_id
      country_id
      profile_image
      last_login
      comments_count
      followers_count
      discussions_count
      sendbird_access_token
      balance
      is_purchased
      referral_url
      can_create_free_rfq
      client_badges {
        id
        created_at
        updated_at
        status
        key
        title
        value
        image
      }
      client_awards {
        id
        created_at
        updated_at
        status
        title
        code
        image
      }
      city {
        id
        name
      }
      country {
        id
        name
      }
      draft_service_inquiry {
        id
      }
    }
  }
`;

export const getClientAddresses = /* GraphQL */ `
  query GetAuthenticatedClient($input: Pagination) {
    getAuthenticatedClient {
      id
      status
      first_name
      last_name
      email
      about_me
      addresses(input: $input) {
        count
        results {
          id
          name
          first_name
          last_name
          phone_number
          description
          email
          description
          is_default
          city {
            id
            name
          }
          country {
            id
            name
          }
          neighborhood {
            id
            name
          }
        }
      }
    }
  }
`;

export const listCategories = /* GraphQL */ `
  query ListCategories($input: Pagination) {
    listCategories(input: $input) {
      count
      next
      previous
      results {
        id
        title
        english_title
        description
        parent {
          id
          title
          english_title
          description
          photo
          status
          created_at
          updated_at
          filters
        }
        photo
        status
        created_at
        updated_at
        filters
      }
    }
  }
`;

export const listCategoriesWithSubCategories = /* GraphQL */ `
  query ListCategoriesWithSubCategories {
    listCategoriesWithSubCategories {
      result {
        parent {
          id
          title
          english_title
          description
          photo
          status
          created_at
          updated_at
          filters
        }
        children {
          id
          title
          english_title
          description
          photo
          status
          created_at
          updated_at
          filters
        }
      }
    }
  }
`;

export const getCategory = /* GraphQL */ `
  query GetCategory($id: ID!) {
    getCategory(id: $id) {
      id
      title
      english_title
      description
      photo
      status
      filters
    }
  }
`;

export const listRoomTypes = /* GraphQL */ `
  query ListRoomTypes($input: Pagination) {
    listRoomTypes(input: $input) {
      count
      next
      previous
      results {
        id
        title
        arabic_title
        english_title
        status
        photo
      }
    }
  }
`;

export const listMoreIdeas = /* GraphQL */ `
  query ListMoreIdeas($input: Pagination!) {
    listMoreIdeas(input: $input) {
      count
      next
      previous
      results {
        id
        tag
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
          first_name
          last_name
          email
          mobile
          type
        }
        client_id
        questions_count
        shares_count
        likes_count
        is_liked
        is_photo_uploaded
      }
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

export const listFeeds = /* GraphQL */ `
  query ListFeeds($input: Pagination) {
    listFeeds(input: $input) {
      count
      results {
        data
      }
    }
  }
`;

export const listRelatedProfessionals = /* GraphQL */ `
  query ListRelatedProfessionals($input: Pagination!) {
    listRelatedProfessionals(input: $input) {
      count
      next
      previous
      results {
        id
        created_at
        updated_at
        client {
          id
          first_name
          last_name
          email
          mobile
          gender
          type
          about_me
          state
          following_count
          followers_count
          followees_count
          is_followed
          total_review
          profile_image
          project_role
        }
        address
        is_profile_completed
        reviews_total
        reviews_count
        gallery_photos
        is_reviewable
        projects_count
        public_profile_deep_link
      }
    }
  }
`;

export const getAuthenticatedProfessional = /* GraphQL */ `
  query GetAuthenticatedProfessional {
    getAuthenticatedProfessional {
      id
      company_logo
      company_name
      company_registration_ref
      professional_type
      personal_freelance_license
      created_at
      client {
        id
        status
        first_name
        last_name
        email
        mobile
        country_code
        gender
        type
        about_me
        city {
          id
          status
          name
        }
        country {
          id
          status
          name
          country_flag
        }
        zip
        state
        following_count
        followers_count
        followees_count
        is_followed
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        project_role
      }
      address
      categories {
        id
        title
        english_title
        description
        photo
        status
      }
      services(input: { limit: 100 }) {
        id
        created_at
        updated_at
        title
      }
      locations(input: { limit: 100 }) {
        id
        created_at
        updated_at
        status
        name
      }
      is_profile_completed
      is_gig_professional
      reviews_total
      reviews_count
      gallery_photos
      public_profile_deep_link
      photos {
        count
        next
        previous
        results {
          id
          created_at
          updated_at
          photo
        }
      }
      is_reviewable
      projects_count
      videos {
        results {
          id
          video
        }
      }
    }
  }
`;

export const listGalleryPhotos = /* GraphQL */ `
  query ListGalleryPhotos($input: Pagination) {
    listGalleryPhotos(input: $input) {
      count
      next
      previous
      results {
        id
        created_at
        updated_at
        photo
      }
    }
  }
`;

export const listServices = /* GraphQL */ `
  query ListServices($input: Pagination) {
    listServices(input: $input) {
      count
      next
      previous
      results {
        id
        created_at
        updated_at
        title
      }
    }
  }
`;

export const getService = /* GraphQL */ `
  query GetService($id: ID!) {
    getService(id: $id) {
      id
      created_at
      updated_at
      title
    }
  }
`;

export const getClient = /* GraphQL */ `
  query GetClient($id: ID!) {
    getClient(id: $id) {
      id
      status
      first_name
      last_name
      email
      mobile
      country_code
      gender
      type
      about_me
      last_login
      city {
        id
        status
        name
      }
      country {
        id
        status
        name
        country_flag
      }
      zip
      state
      following_count
      followers_count
      followees_count
      is_followed
      total_review
      profile_image
      blog
      project_role
      client_awards {
        id
        created_at
        updated_at
        status
        title
        code
        image
      }
      client_badges {
        id
        created_at
        updated_at
        status
        key
        title
        value
        image
      }
    }
  }
`;

export const listCities = /* GraphQL */ `
  query ListCities($input: Pagination) {
    listCities(input: $input) {
      count
      next
      previous
      results {
        id
        created_at
        updated_at
        status
        name
        region_id
        country_id
      }
    }
  }
`;

export const listLocations = /* GraphQL */ `
  query ListLocations($input: Pagination) {
    listLocations(input: $input) {
      count
      next
      previous
      results {
        id
        created_at
        updated_at
        status
        name
      }
    }
  }
`;

export const listCountries = /* GraphQL */ `
  query ListCountries($input: Pagination) {
    listCountries(input: $input) {
      count
      next
      previous
      results {
        id
        created_at
        updated_at
        status
        name
        country_flag
      }
    }
  }
`;

export const getDiscussion = /* GraphQL */ `
  query GetDiscussion($id: ID!) {
    getDiscussion(id: $id) {
      id
      tag
      created_at
      updated_at
      status
      title
      description
      client {
        id
        first_name
        last_name
        email
        mobile
        type
        profile_image
      }
      photo
      web_url
      likes_count
      comments_count
      topics {
        id
        paren_id
        status
        title
        description
        is_interested
      }
      polls {
        id
        status
        title
        photo_url
      }
      is_liked
    }
  }
`;

export const listDiscussions = /* GraphQL */ `
  query ListDiscussions($input: Pagination) {
    listDiscussions(input: $input) {
      count
      next
      previous
      results {
        id
        tag
        created_at
        updated_at
        status
        title
        description
        client_id
        client {
          id
          first_name
          last_name
          email
          mobile
          type
          about_me
          profile_image
        }
        youtube_url
        photo
        web_url
        likes_count
        comments_count
        topics {
          id
          paren_id
          created_at
          updated_at
          status
          title
          description
          is_interested
        }
        polls {
          id
          created_at
          updated_at
          status
          title
          photo_url
        }
        is_liked
        latest_two_commenters {
          id
          first_name
          last_name
          email
          mobile
          gender
          type
          about_me
          state
          profile_image
        }
      }
    }
  }
`;

export const listMostRecentDiscussions = /* GraphQL */ `
  query ListMostRecentDiscussions($input: Pagination) {
    listMostRecentDiscussions(input: $input) {
      count
      results {
        id
        tag
        status
        title
        description
        photo
        web_url
        likes_count
        comments_count
        is_liked
      }
    }
  }
`;

export const listSameTopicsDiscussions = /* GraphQL */ `
  query ListSameTopicsDiscussions($input: Pagination!) {
    listSameTopicsDiscussions(input: $input) {
      count
      next
      previous
      results {
        id
        tag
        title
        description
        photo
        web_url
        likes_count
        comments_count
        is_liked
      }
    }
  }
`;

export const listUserDiscussions = /* GraphQL */ `
  query ListUserDiscussions($input: Pagination!) {
    listUserDiscussions(input: $input) {
      count
      next
      previous
      results {
        id
        tag
        created_at
        updated_at
        status
        title
        description
        photo
        web_url
        likes_count
        comments_count
        topics {
          id
          paren_id
          status
          title
          description
          is_interested
        }
        polls {
          id
          status
          title
          photo_url
        }
        is_liked
        latest_two_commenters {
          id
          first_name
          last_name
          email
          mobile
          gender
          type
          about_me
          state
          profile_image
        }
      }
    }
  }
`;

export const listDiscussionsWhereUserInteracted = /* GraphQL */ `
  query ListDiscussionsWhereUserInteracted($input: Pagination!) {
    listDiscussionsWhereUserInteracted(input: $input) {
      count
      next
      previous
      results {
        id
        tag
        created_at
        updated_at
        status
        title
        description
        client_id
        youtube_url
        photo
        web_url
        likes_count
        comments_count
        topics {
          id
          paren_id
          status
          title
          description
          is_interested
        }
        polls {
          id
          status
          title
          photo_url
        }
        is_liked
        latest_two_commenters {
          id
          first_name
          last_name
          email
          mobile
          gender
          type
          about_me
          state
          profile_image
        }
      }
    }
  }
`;

export const listTopCommenters = /* GraphQL */ `
  query ListTopCommenters($input: Pagination) {
    listTopCommenters(input: $input) {
      count
      next
      previous
      results {
        id
        first_name
        last_name
        email
        mobile
        type
        profile_image
      }
    }
  }
`;

export const listComments = /* GraphQL */ `
  query ListComments($input: Pagination!) {
    listComments(input: $input) {
      count
      next
      previous
      results {
        id
        created_at
        updated_at
        status
        content
        client {
          id
          first_name
          last_name
          email
          mobile
          type
          about_me
          following_count
          followers_count
          followees_count
          is_followed
          total_review
          profile_image
          client_badges {
            id
            created_at
            updated_at
            status
            key
            title
            value
            image
          }
        }
        client_id
        likes_count
        is_liked
      }
    }
  }
`;
export const listLikes = /* GraphQL */ `
  query ListLikes($input: Pagination!) {
    listLikes(input: $input) {
      count
      next
      previous
      results {
        id
        created_at
        updated_at
        first_name
        last_name
        email
        mobile
        type
        following_count
        followers_count
        followees_count
        is_followed
        total_review
        profile_image
      }
    }
  }
`;

export const listReviews = /* GraphQL */ `
  query ListReviews($input: Pagination!) {
    listReviews(input: $input) {
      count
      results {
        id
        created_at
        updated_at
        content
        rating
        client {
          id
          created_at
          updated_at
          status
          first_name
          last_name
          email
          mobile
          gender
          type
          about_me
          following_count
          followers_count
          followees_count
          is_followed
          total_review
          profile_image
        }
      }
    }
  }
`;

export const listRelatedStockRecords = /* GraphQL */ `
  query ListRelatedStockRecords($input: Pagination!) {
    listRelatedStockRecords(input: $input) {
      count
      results {
        id
        currency
        price
        original_price
        discount_value
        product {
          title
          photo_url
        }
      }
    }
  }
`;

export const getMyReviewForProfessional = /* GraphQL */ `
  query GetMyReviewForProfessional($input: Pagination!) {
    getMyReviewForProfessional(input: $input) {
      id
      content
      rating
    }
  }
`;

export const getProfessional = /* GraphQL */ `
  query GetProfessional($id: ID!, $input: Pagination) {
    getProfessional(id: $id) {
      id
      created_at
      updated_at
      is_verified
      company_name
      company_logo
      professional_type
      gigs_count
      client {
        id
        projects(input: { limit: 200 }) {
          count
          results {
            id
            is_default
            title
            status
            created_at
            updated_at
            visibility
            client_id
            client {
              id
              status
              first_name
              last_name
              email
              type
            }
            discussions_count
            ideas_count
            likes_count
            shares_count
            description
            default_idea {
              id
              tag
              title
              photo
              status
              source
              description
              project_id
              client_id
            }
            is_liked
          }
        }
        created_at
        updated_at
        status
        first_name
        last_name
        email
        mobile
        country_code
        gender
        type
        about_me
        city_id
        country_id
        zip
        state
        following_count
        followers_count
        followees_count
        is_followed
        total_review
        profile_image
        facebook
        twitter
        linkedin
        blog
        client_awards(input: $input) {
          id
          created_at
          updated_at
          status
          title
          code
          image
        }
        client_badges(input: $input) {
          id
          created_at
          updated_at
          status
          key
          title
          value
          image
        }
      }
      address
      categories(input: $input) {
        id
        title
        english_title
        description
      }
      services(input: $input) {
        id
        created_at
        updated_at
        title
      }
      locations {
        id
        created_at
        updated_at
        status
        name
      }
      is_profile_completed
      is_gig_professional
      reviews_total
      reviews_count
      gallery_photos
      is_reviewable
      projects_count
      public_profile_deep_link
      photos {
        count
        next
        previous
      }
      videos(input: $input) {
        count
        next
        previous
        results {
          id
          created_at
          updated_at
          video
        }
      }
    }
  }
`;

export const getTV = /* GraphQL */ `
  query GetTV($id: ID!) {
    getTV(id: $id) {
      id
      video_url
      photo
      page
      likes_count
      is_liked
      comments_count
      title
      meta_description
      categories {
        id
        title
        english_title
        description
        photo
        status
        created_at
        updated_at
        filters
      }
      created_at
      video_length
      client {
        id
        first_name
        last_name
        email
        mobile
        type
        following_count
        followers_count
        followees_count
        is_followed
        total_review
        profile_image
      }
    }
  }
`;

export const listTVs = /* GraphQL */ `
  query ListTVs($input: Pagination) {
    listTVs(input: $input) {
      count
      next
      previous
      results {
        id
        video_url
        photo
        page
        likes_count
        is_liked
        comments_count
        title
        meta_description
        created_at
        video_length
      }
    }
  }
`;

export const listMagazines = /* GraphQL */ `
  query ListMagazines($input: Pagination) {
    listMagazines(input: $input) {
      count
      next
      previous
      results {
        id
        page
        photo
        likes_count
        comments_count
        title
        meta_description
        is_liked
        categories {
          id
          title
          english_title
          description
        }
        created_at
        client {
          id
          created_at
          updated_at
          status
          first_name
          last_name
          email
          mobile
          type
          profile_image
          project_role
        }
      }
    }
  }
`;

export const getMagazine = /* GraphQL */ `
  query GetMagazine($id: ID!) {
    getMagazine(id: $id) {
      id
      page
      photo
      likes_count
      comments_count
      title
      meta_description
      is_liked
      categories {
        id
        title
        english_title
        description
      }
      created_at
      client {
        id
        first_name
        last_name
        email
        mobile
        country_code
        type
        about_me
        following_count
        followers_count
        followees_count
        is_followed
        total_review
        profile_image
      }
    }
  }
`;

export const listRecentMagazines = /* GraphQL */ `
  query ListRecentMagazines($input: Pagination) {
    listRecentMagazines(input: $input) {
      count
      results {
        id
        title
      }
    }
  }
`;

export const listFollowersByClientId = /* GraphQL */ `
  query ListFollowersByClientId($input: Pagination) {
    listFollowersByClientId(input: $input) {
      count
      results {
        id
        first_name
        last_name
        email
        mobile
        type
        following_count
        followers_count
        followees_count
        is_followed
        total_review
        profile_image
      }
    }
  }
`;

export const listFolloweesByClientId = /* GraphQL */ `
  query ListFolloweesByClientId($input: Pagination) {
    listFolloweesByClientId(input: $input) {
      count
      results {
        id
        first_name
        last_name
        email
        mobile
        type
        following_count
        followers_count
        followees_count
        is_followed
        total_review
        profile_image
      }
    }
  }
`;

export const getShoppingMenu = /* GraphQL */ `
  query GetShoppingMenu {
    getShoppingMenu {
      departments
    }
  }
`;

export const listBrands = /* GraphQL */ `
  query listBrands($input: Pagination) {
    listBrands(input: $input) {
      results {
        title
        address
        description
        email
        logo
        phone
        rank
        rate
        rates_count
        website
        type
        tags {
          results {
            title
          }
        }
        images {
          results {
            photo
          }
        }
        id
      }
      count
    }
  }
`;

export const getBrand = /* GraphQL */ `
  query GetBrand($id: ID!) {
    getBrand(id: $id) {
      address
      arabic_description
      arabic_title
      description
      email
      english_description
      english_title
      id
      logo
      images {
        count
        results {
          photo
        }
      }
      phone
      rank
      rate
      rates_count
      tags {
        results {
          arabic_title
          english_title
          title
        }
      }
      title
      type
      website
    }
  }
`;
export const getBrandGalleryPhotos = /* GraphQL */ `
  query GetBrand($id: ID!, $input: Pagination) {
    getBrand(id: $id) {
      images(input: $input) {
        count
        next
        previous
        results {
          photo
        }
      }
    }
  }
`;

// e-commerce endpoints
export const listDepartments = /* GraphQL */ `
  query ListDepartments($input: Pagination) {
    listDepartments(input: $input) {
      count
      next
      previous
      results {
        id
        title
        description
        slug
        photo_url
        products_count
        filters
        breadcrumbs {
          title
          slug
        }
        sub_departments {
          id
          title
          description
          slug
          photo_url
          breadcrumbs {
            title
            slug
          }
          products_count
          filters
          sub_departments {
            id
            title
            description
            slug
            photo_url
            breadcrumbs {
              title
              slug
            }
            products_count
            filters
          }
        }
      }
    }
  }
`;

export const listDepartmentsBySlug = /* GraphQL */ `
  query ListDepartmentsBySlug($input: Pagination) {
    listDepartmentsBySlug(input: $input) {
      count
      next
      previous
      results {
        id
        title
        description
        slug
        photo_url
        products_count
        filters
        breadcrumbs {
          title
          slug
        }
        sub_departments {
          id
          title
          description
          slug
          photo_url
          products_count
          filters
          breadcrumbs {
            title
            slug
          }
        }
      }
    }
  }
`;

export const listProductSliders = /* GraphQL */ `
  query ListProductSliders($input: Pagination) {
    listProductSliders(input: $input) {
      results {
        title
        show_all_url
        stock_records {
          id
          partner_sku
          currency
          price
          original_price
          discount_value
          available_number_in_stock
          reviews_total
          reviews_count
          is_reviewable
          is_purchased
          product {
            id
            title
            description
            slug
            upc
            photo_url
            color
            dimensions
            categories {
              title
              slug
            }
            labels {
              id
              title
              description
              color
              is_extra
            }
            manufactory {
              id
              name
              website_url
            }
            images {
              id
              original
              is_default
              display_order
            }
            attributes {
              name
              value
            }
            breadcrumbs {
              title
              slug
            }
            offer {
              type
              value
            }
            section {
              id
              title
              description
              slug
              photo_url
              products_count
              filters
              children_count
              breadcrumbs {
                title
                slug
              }
            }
          }
          partner {
            id
            name
            code
            logo
            address
            email
            reviews_total
            reviews_count
            is_reviewable
            mobile
            blog
            policy
          }
        }
      }
      count
    }
  }
`;

export const listHomePageSpecialProducts = /* GraphQL */ `
  query ListHomePageSpecialProducts($input: Pagination) {
    listHomePageSpecialProducts(input: $input) {
      count
      next
      previous
      results {
        id
        title
        description
        slug
        upc
        photo_url
        reviews_total
        reviews_count
        labels {
          id
          title
          description
          color
          is_extra
        }
        manufactory {
          id
          name
          website_url
        }
        stock_record {
          id
          currency
          price
          original_price
          discount_value
          number_in_stock
        }
        attributes {
          name
          type
          code
          required
          is_selectable
        }
        breadcrumbs {
          title
          slug
        }
        offer {
          type
          value
        }
      }
    }
  }
`;

export const listDepartmentProducts = /* GraphQL */ `
  query ListDepartmentProducts($input: Pagination) {
    listDepartmentProducts(input: $input) {
      count
      next
      previous
      results {
        id
        title
        description
        slug
        upc
        photo_url
        reviews_total
        reviews_count
        labels {
          id
          title
          description
          color
          is_extra
        }
        manufactory {
          id
          name
          website_url
        }
        stock_record {
          id
          currency
          price
          original_price
          discount_value
          number_in_stock
        }
        attributes {
          name
          type
          code
          required
          is_selectable
        }
        breadcrumbs {
          title
          slug
        }
      }
    }
  }
`;

export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      title
      description
      slug
      upc
      photo_url
      reviews_total
      reviews_count
      labels {
        id
        title
        description
        color
        is_extra
      }
      manufactory {
        id
        name
        website_url
      }
      images {
        id
        original
        is_default
        display_order
      }
      stock_record {
        id
        currency
        price
        original_price
        discount_value
        number_in_stock
      }
      attributes {
        name
        type
        values {
          slug
          title
          photo_url
        }
        code
        required
        is_selectable
        default_value {
          slug
          title
          photo_url
        }
      }
      breadcrumbs {
        title
        slug
      }
      offer {
        type
        value
      }
      section {
        id
        title
        description
        slug
        photo_url
        products_count
        filters
        breadcrumbs {
          title
          slug
        }
        sub_departments {
          id
          title
          description
          slug
          photo_url
          products_count
          filters
        }
      }
    }
  }
`;

export const listProductReviewsBySlug = /* GraphQL */ `
  query ListProductReviewsBySlug($input: Pagination) {
    listProductReviewsBySlug(input: $input) {
      count
      next
      previous
      results {
        id
        product {
          id
          title
          description
          slug
          upc
          photo_url
          reviews_total
          reviews_count
        }
        client {
          id
          created_at
          updated_at
          status
          first_name
          last_name
          email
          mobile
          country_code
          gender
          type
          about_me
          city_id
          country_id
          zip
          following_count
          followers_count
          followees_count
          is_followed
          total_review
          profile_image
        }
        body
        general_score
        client_bought_product
        client_first_name
        client_last_name
        client_profile_image
        created_at
        status
        detailed_review_scores {
          id
          title
          status
          score
        }
        review_images {
          id
          image
          status
        }
      }
    }
  }
`;

export const listDepartmentStockRecords = /* GraphQL */ `
  query ListDepartmentStockRecords($input: Pagination) {
    listDepartmentStockRecords(input: $input) {
      count
      next
      previous
      results {
        id
        currency
        price
        original_price
        discount_value
        available_number_in_stock
        reviews_total
        reviews_count
        is_reviewable
        product {
          id
          title
          description
          slug
          upc
          photo_url
          labels {
            id
            title
            description
            color
            is_extra
          }
          manufactory {
            id
            name
            website_url
          }
          attributes {
            name
            type
            code
            required
            is_selectable
          }
          breadcrumbs {
            title
            slug
          }
        }
        partner {
          id
          name
          code
          logo
          address
          email
          reviews_total
          reviews_count
          is_reviewable
        }
      }
    }
  }
`;

export const listHomePageSpecialStockRecords = /* GraphQL */ `
  query ListHomePageSpecialStockRecords($input: Pagination) {
    listHomePageSpecialStockRecords(input: $input) {
      count
      next
      previous
      results {
        id
        currency
        price
        original_price
        discount_value
        available_number_in_stock
        product {
          id
          title
          description
          slug
          upc
          photo_url
          labels {
            id
            title
            description
            color
            is_extra
          }
          manufactory {
            id
            name
            website_url
          }
          images {
            id
            original
            is_default
            display_order
          }
          attributes {
            name
            value
          }
          breadcrumbs {
            title
            slug
          }
          offer {
            type
            value
          }
          section {
            id
            title
            description
            slug
            photo_url
            products_count
            filters
            breadcrumbs {
              title
              slug
            }
            sub_departments {
              id
              title
              description
              slug
              photo_url
              products_count
              filters
              breadcrumbs {
                title
                slug
              }
              children_count
            }
            children_count
          }
          categories {
            title
            slug
          }
          color
          dimensions
        }
        partner {
          id
          name
          code
          logo
          address
          email
          reviews_total
          reviews_count
          is_reviewable
        }
      }
    }
  }
`;

export const getStockRecord = /* GraphQL */ `
  query GetStockRecord($id: ID!) {
    getStockRecord(id: $id) {
      id
      currency
      price
      original_price
      discount_value
      available_number_in_stock
      product {
        id
        title
        description
        slug
        upc
        photo_url
        labels {
          id
          title
          description
          color
          is_extra
        }
        manufactory {
          id
          name
          website_url
        }
        images {
          id
          original
          is_default
          display_order
        }
        attributes {
          name
          value
        }
        breadcrumbs {
          title
          slug
        }
        offer {
          type
          value
        }
        section {
          id
          title
          description
          slug
          photo_url
          products_count
          filters
          breadcrumbs {
            title
            slug
          }
          sub_departments {
            id
            title
            description
            slug
            photo_url
            products_count
            filters
            breadcrumbs {
              title
              slug
            }
            children_count
          }
          children_count
        }
        categories {
          title
          slug
        }
        color
        dimensions
      }
      partner {
        id
        name
        code
        logo
        address
        email
        reviews_total
        reviews_count
        is_reviewable
        mobile
        blog
        policy
      }
      reviews_total
      reviews_count
      partner_sku
      is_reviewable
      is_purchased
      vendor_variants {
        id
        currency
        price
        original_price
        discount_value
        available_number_in_stock
        product {
          id
          title
          description
          slug
          upc
          photo_url
          labels {
            id
            title
            description
            color
            is_extra
          }
          manufactory {
            id
            name
            website_url
          }
          images {
            id
            original
            is_default
            display_order
          }
          attributes {
            name
            value
          }
          breadcrumbs {
            title
            slug
          }
          offer {
            type
            value
          }
          section {
            id
            title
            description
            slug
            photo_url
            products_count
            filters
            breadcrumbs {
              title
              slug
            }
            sub_departments {
              id
              title
              description
              slug
              photo_url
              products_count
              filters
              breadcrumbs {
                title
                slug
              }
              children_count
            }
            children_count
          }
          categories {
            title
            slug
          }
          color
          dimensions
        }
        partner {
          id
          name
          code
          logo
          address
          email
          reviews_total
          reviews_count
          is_reviewable
          mobile
          blog
          policy
        }
        reviews_total
        reviews_count
        partner_sku
        is_reviewable
        is_purchased
      }
    }
  }
`;

export const getPartner = /* GraphQL */ `
  query GetPartner($id: ID!) {
    getPartner(id: $id) {
      id
      name
      code
      logo
      address
      email
      reviews_total
      reviews_count
      is_reviewable
    }
  }
`;

export const getAuthenticatedClientBasket = /* GraphQL */ `
  query GetAuthenticatedClientBasket {
    getAuthenticatedClientBasket {
      id
      status
      total_excl_tax
      total_excl_tax_excl_discounts
      total_incl_tax
      total_incl_tax_excl_discounts
      total_tax
      currency
      total_original_excl_tax
      total_original_incl_tax
      total_quantity
    }
  }
`;

export const listBasketProducts = /* GraphQL */ `
  query ListBasketProducts($input: Pagination) {
    listBasketProducts(input: $input) {
      count
      next
      previous
      results {
        id
        product {
          id
          title
          description
          slug
          upc
          photo_url
          color
          dimensions
        }
        quantity
        stockrecord_id
        basket_id
        price_currency
        price_excl_tax
        price_incl_tax
        original_price_incl_tax
        original_price_excl_tax
      }
    }
  }
`;

export const listBasketProductsCount = /* GraphQL */ `
  query ListBasketProducts($input: Pagination) {
    listBasketProducts(input: $input) {
      count
      next
      previous
      results {
        id
        quantity
      }
    }
  }
`;

export const listPaymentMethods = /* GraphQL */ `
  query ListPaymentMethods($input: Pagination) {
    listPaymentMethods(input: $input) {
      count
      next
      previous
      results {
        id
        name
        logo
        brand
      }
    }
  }
`;
export const getPaymentCheckoutId = /* GraphQL */ `
  query GetPaymentCheckoutId($input: PaymentCheckoutIdInput) {
    getPaymentCheckoutId(input: $input) {
      result {
        code
        description
      }
      id
    }
  }
`;

export const getPaymentStatus = /* GraphQL */ `
  query GetPaymentStatus($input: PaymentStatusInput) {
    getPaymentStatus(input: $input) {
      payment_status
      description
    }
  }
`;

export const getClientCards = /* GraphQL */ `
  query getClientCards {
    getAuthenticatedClient {
      id
      bankcards {
        results {
          card_type
          id
          expiry_date
          name
          number
          partner_reference
        }
        count
      }
    }
  }
`;

export const listMyOrders = /* GraphQL */ `
  query ListMyOrders($input: OrderListInput) {
    listMyOrders(input: $input) {
      count
      next
      previous
      results {
        id
        number
        currency
        total_incl_tax
        total_excl_tax
        shipping_incl_tax
        shipping_excl_tax
        status
        date_placed
        shipping_address {
          id
          name
          description
          first_name
          last_name
          phone_number
          email
          country {
            id
            name
          }
          city {
            id
            name
          }
          neighborhood {
            id
            name
          }
        }
        num_items
      }
    }
  }
`;

export const getOrderById = /* GraphQL */ `
  query GetOrderById($id: Int!) {
    getOrderById(id: $id) {
      id
      number
      currency
      total_incl_tax
      total_excl_tax
      shipping_incl_tax
      shipping_excl_tax
      status
      date_placed
      shipping_address {
        id
        name
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
        neighborhood {
          id
          created_at
          updated_at
          status
          name
        }
        description
        first_name
        last_name
        phone_number
        email
      }
      num_items
      products_price
      total_tax
      discount_price
      discount_amount
      payment_method {
        id
        name
        logo
        brand
      }
      payment_card {
        id
        card_type
        number
        name
        expiry_date
        partner_reference
      }
    }
  }
`;

export const listOrderProducts = /* GraphQL */ `
  query ListOrderProducts($input: Pagination) {
    listOrderProducts(input: $input) {
      count
      next
      previous
      results {
        id
        product {
          id
          title
          description
          slug
          upc
          photo_url
          color
          dimensions
        }
        quantity
        stockrecord {
          id
          currency
          price
          original_price
          discount_value
          available_number_in_stock
          reviews_total
          reviews_count
          partner_sku
          is_reviewable
        }
        price_currency
        price_excl_tax
        price_incl_tax
        price_incl_tax_excl_discounts
        price_excl_tax_excl_discounts
        status
      }
    }
  }
`;

export const getOrderByNumber = /* GraphQL */ `
  query GetOrderByNumber($id: String!) {
    getOrderByNumber(id: $id) {
      id
      number
      currency
      total_incl_tax
      total_excl_tax
      shipping_incl_tax
      shipping_excl_tax
      status
      date_placed
      shipping_address {
        id
        name
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
        neighborhood {
          id
          created_at
          updated_at
          status
          name
        }
        description
        first_name
        last_name
        phone_number
        email
      }
      num_items
      products_price
      total_tax
      discount_price
      discount_amount
      payment_method {
        id
        name
        logo
        brand
      }
      payment_card {
        id
        card_type
        number
        name
        expiry_date
        partner_reference
      }
    }
  }
`;

export const listOrderProductsGroupedByPartner = /* GraphQL */ `
  query ListOrderProductsGroupedByPartner($input: Pagination) {
    listOrderProductsGroupedByPartner(input: $input) {
      result {
        partner {
          id
          name
          code
          logo
          address
          email
          reviews_total
          reviews_count
          is_reviewable
          mobile
          blog
          policy
        }
        lines {
          id
          quantity
          product {
            id
            title
            photo_url
            dimensions
            color
          }
          price_currency
          price_excl_tax
          price_incl_tax
          price_incl_tax_excl_discounts
          price_excl_tax_excl_discounts
          original_price_incl_tax
          original_price_excl_tax
          status
          stockrecord {
            id
          }
        }
      }
    }
  }
`;

export const listCitiesByRegion = /* GraphQL */ `
  query ListCitiesByRegion($input: Pagination) {
    listCitiesByRegion(input: $input) {
      count
      next
      previous
      results {
        id
        created_at
        updated_at
        status
        name
      }
    }
  }
`;

export const listRegions = /* GraphQL */ `
  query ListRegions($input: Pagination) {
    listRegions(input: $input) {
      count
      next
      previous
      results {
        id
        created_at
        updated_at
        status
        name
      }
    }
  }
`;
export const listBasketProductsGroupedByPartner = /* GraphQL */ `
  query ListBasketProductsGroupedByPartner($input: Pagination) {
    listBasketProductsGroupedByPartner(input: $input) {
      result {
        partner {
          id
          name
          code
          logo
          address
          email
          reviews_total
          reviews_count
          is_reviewable
          mobile
          blog
          policy
        }
        lines {
          id
          quantity
          stockrecord_id
          basket_id
          price_currency
          price_excl_tax
          price_incl_tax
          price_incl_tax_excl_discounts
          price_excl_tax_excl_discounts
          original_price_incl_tax
          original_price_excl_tax
          product {
            color
            description
            dimensions
            id
            photo_url
            title
            upc
            slug
          }
        }
      }
    }
  }
`;

export const getListRefundReasons = /* GraphQL */ `
  query {
    listRefundReasons {
      results {
        id
        is_note_required
        title
      }
    }
  }
`;

export const listSentServiceInquiries = `
query ListSentServiceInquiries($input: Pagination, $filters: ServiceInquiryFilter) {
    listSentServiceInquiries(input: $input, filters: $filters) {
      count
      results {
        id
        budget_limits
        created_at
        description
        number
        status
        type
        reviews_count
        reviews_total
        phone_number
        whatsapp_number
        professional {
          id
          company_logo
          client {
            id
            first_name
            last_name
            profile_image
          
          }
        }
        city {
          id
          name
        }
        quotations_count
        quotations(input: {limit: 100, offset:0}) {
          count
          results {
            id
            status
            professional {
              company_name
              company_logo
              id
            }
          }
        } 
        categories {
          results {
            title
            id
          }
        }

        services(input: { limit: 100 }) {
          results {
            title
            id
          }
        }
       
      }
    }
  }
`;

export const listReceivedServiceInquiries = `
  query {
    listReceivedServiceInquiries {
      count
      results {
        id
        number
        status
        services {
          results {
            title
          }
        }
        sender {
          first_name
          last_name
        }
        phone_number
        created_at
        gig_service_id
        gig_service_title
        gig_service_price
        gig_service_description
        sendbird_channel_name
        sendbird_channel_url
        budget_limits
      }
    }
  }
`;

export const listNotifications = /* GraphQL */ `
  query ListNotifications($input: Pagination) {
    listNotifications(input: $input) {
      count
      results {
        notification_payload {
          id
          page
          section
          url
          icon
          image
        }
        body
        created_at
        id
        notification_class
        sender {
          first_name
          last_name
          id
          profile_image
        }
        unread
        title
      }
    }
  }
`;

export const listServiceInquiryRejectionReason = `
  query ListServiceInquiryRejectionReason($input: Pagination) {
    listServiceInquiryRejectionReason(input: $input) {
      results {
        id
        is_note_required
        title
      }
    }
  }
`;

export const listBadges = /* GraphQL */ `
  query ListBadges($input: Pagination) {
    listBadges(input: $input) {
      count
      results {
        status
        key
        title
        value
        image
        description
        client_progress
        is_claimed
      }
    }
  }
`;

export const getUserUnreadNotificationsCount = /* GraphQL */ `
  query GetUserUnreadNotificationsCount {
    getUserUnreadNotificationsCount {
      total
    }
  }
`;

export const getServiceInquiry = `
  query GetServiceInquiry($id: String!) {
    getServiceInquiry(id: $id) {
      id
      budget_limits
      created_at
      description
      number
      phone_number
      status
      whatsapp_number
      gig_service_id
      gig_service_title
      gig_service_price
      gig_service_description
      sendbird_channel_url
      sendbird_channel_name
      type
      reviews_count
      reviews_total
      city {
        id
        name
      }
      services(input: { limit: 100 }) {
        results {
          title
          id
        }
      }
      categories {
        results {
          title
        }
      }
      sender {
        first_name
        last_name
      }
      professional {
        company_name
        professional_type
        id
      }
      
      quotations(input: {limit: 100, offset:0}) {
        count
        results {
          id
          created_at
          status
          budget_limits
          execution_time
          description
          time_unit
          photos(input: {limit: 100, offset:0}) {
            count
            results {
              photo
            }
          }
          service_inquiry {
            description
          }
          professional {
            professional_type
            company_name
            company_logo
            is_verified
            reviews_count
            reviews_total
            id
          }
        }
      }
      photos {
        results {
          photo
        }
      }
    }
  }
`;

export const listFeatureFlags = /* GraphQL */ `
  query ListFeatureFlags($input: PlatformInput) {
    listFeatureFlags(input: $input) {
      enabled
      platform
      title
    }
  }
`;

export const listProfessionalGigs = /* GraphQL */ `
  query ListProfessionalGigs($input: Pagination) {
    ListProfessionalGigs(input: $input) {
      count
      results {
        id
        title
        description
        price
        photos
        is_enabled
        services {
          created_at
          id
          image
          title
          updated_at
        }
        cities {
          id
          name
          region_id
          country_id
        }
        professional {
          id
          address
          company_logo
          company_name
          reviews_count
          reviews_total
        }
      }
    }
  }
`;

export const listGigsTitleSuggestions = /* GraphQL */ `
  query ListGigsTitleSuggestions($input: GigSuggestionInput) {
    listGigsTitleSuggestions(input: $input) {
      id
      description
      price
      title
    }
  }
`;

export const listGigsServices = /* GraphQL */ `
  query ListServices($input: Pagination) {
    listServices(input: $input) {
      count
      results {
        id
        image
        title
        short_description
        long_description
      }
    }
  }
`;

export const listGigsServicesItem = /* GraphQL */ `
  query ListGigServicesItem($input: ListGigServiceInput!) {
    ListGigServices(input: $input) {
      count
      results {
        cities {
          name
          country_id
          id
          region_id
          status
        }
        description
        id
        is_enabled
        photos
        price
        services {
          title
          short_description
          long_description
          image
          id
        }
        professional {
          id
          address
          company_logo
          company_name
          reviews_count
          reviews_total
        }
        title
      }
    }
  }
`;

export const getGigServiceDetails = /* GraphQL */ `
  query getGigServiceDetails($id: String!) {
    getGigServiceDetails(id: $id) {
      cities {
        name
        country_id
        id
        region_id
        status
      }
      description
      id
      is_enabled
      photos
      price
      services {
        title
        short_description
        long_description
        image
        id
      }
      professional {
        id
        address
        company_logo
        company_name
        reviews_count
        reviews_total
      }
      title
    }
  }
`;

export const searchProfessionals = /* GraphQL */ `
  query SearchProfessionals(
    $text: String
    $pagination: SearchPagination
    $sortBy: ProfessionalSearchSortBy
    $services: [String]
    $cities: [String]
    $regions: [String]
    $is_verified: Boolean
  ) {
    searchProfessionals(
      text: $text
      pagination: $pagination
      sortBy: $sortBy
      services: $services
      cities: $cities
      regions: $regions
      is_verified: $is_verified
    ) {
      count
      results {
        id
        gigs_count
        client {
          id
          first_name
          last_name
          is_verified
          profile_image
          about_me
          mobile
          blog
        }
        services {
          id
          title
          image
          short_description
          long_description
          __typename
        }
        is_profile_completed
        reviews_total
        public_profile_deep_link
        reviews_count
        photos {
          results {
            id
            photo
            __typename
          }
          __typename
        }

        professional_type
        company_name
        company_logo
        is_verified
        is_gig_professional
        __typename
      }
      __typename
    }
  }
`;
export const searchProjects = /* GraphQL */ `
  query SearchProjects(
    $text: String
    $pagination: SearchPagination
    $sortBy: SearchSortBy
    $filters: [SearchFilterInput]
    $categories: [String]
  ) {
    searchProjects(text: $text, pagination: $pagination, sortBy: $sortBy, filters: $filters, categories: $categories) {
      count
      filters {
        title
        results {
          title
          count
        }
      }
      results {
        id
        title
        default_idea {
          id
          photo
          title
          client {
            id
            first_name
            last_name
          }
        }
      }
    }
  }
`;

export const listPublishedDesigns = /* GraphQL */ `
  query ListPublishedAIDesigns($input: AIPagination!, $styleSlug: String) {
    listPublishedAIDesigns(input: $input, styleSlug: $styleSlug) {
      count
      results {
        id
        sourceImageUrl
        selectedImageIndex
        processedImagesPath
        visibility
        processingType
        status
        style {
          name
          slug
          template_prompt
        }
        roomType {
          name
          slug
        }
        objects {
          id
          name
          description
          coordinates {
            x
            y
          }
        }
      }
    }
  }
`;

export const listMyAIDesigns = /* GraphQL */ `
  query ListMyAIDesigns($input: AIPagination!) {
    listMyAIDesigns(input: $input) {
      count
      results {
        id
        sourceImageUrl
        selectedImageIndex
        processedImagesPath
        visibility
        processingType
        status
        style {
          name
          slug
          template_prompt
        }
        roomType {
          name
          slug
        }
        objects {
          id
          name
          description
          is_purchased
          coordinates {
            x
            y
          }
        }
      }
    }
  }
`;

export const listAiStyles = /* GraphQL */ `
  query ListAIStyles($input: AIPagination!) {
    listAIStyles(input: $input) {
      count
      results {
        id
        name
        slug
        image
        template_prompt
      }
    }
  }
`;

export const listAiRoomTypes = /* GraphQL */ `
  query ListAIRoomTypes($input: AIPagination!) {
    listAIRoomTypes(input: $input) {
      count
      results {
        id
        name
        slug
        image
      }
    }
  }
`;

export const getListPackages = /* GraphQL */ `
  query ListPackages($input: PaymentPagination!) {
    listPackages(input: $input) {
      count
      results {
        id
        name
        credit_amount
        price
        discount
      }
    }
  }
`;

export const getPresignedUrlForImageAIDesign = /* GraphQL */ `
  query GetPresignedUrlForImageAIDesign($input: AIPresignedUrlInput!) {
    getPresignedUrlForImageAIDesign(input: $input) {
      result
    }
  }
`;

export const getAIDesignDetails = /* GraphQL */ `
  query GetAIDesignDetails($id: ID!) {
    getAIDesignDetails(id: $id) {
      id
      sourceImageUrl
      selectedImageIndex
      processedImagesPath
      visibility
      processingType
      status
      style {
        name
        slug
      }
      roomType {
        name
        slug
      }
    }
  }
`;

export const getAIOptions = /* GraphQL */ `
  query GetAIOptions {
    getAIOptions {
      values {
        image
        name
        slug
      }
      name
      slug
    }
  }
`;

export const getGlobalBannerDetails = /* GraphQL */ `
  query GetBannerDetails($slug: BannerSlug!) {
    getBannerDetails(slug: $slug) {
      title
      sub_title
      description
      photo_url
      slug
      button_title
      responsive_photo_url
      url
    }
  }
`;

export const listMyQuotations = /* GraphQL */ `
  query listMyQuotations($input: ListQuotationInput!) {
    ListMyQuotations(input: $input) {
      count
      results {
        professional {
          id
        }
        service_inquiry {
          type
          status
          number
          created_at
          id
          services {
            results {
              title
              id
            }
          }
          sender {
            first_name
            last_name
          }
          budget_limits
        }
      }
    }
  }
`;

export const listRfq = /* GraphQL */ `
  query ListRFQ($input: ListRFQInput!, $quotationsInput: ListQuotationInput) {
    ListRFQ(input: $input) {
      count
      results {
        id
        number
        status
        sender {
          first_name
          last_name
          id
          profile_image
        }
        professional {
          professional_type
          company_name
          company_logo
          is_verified
          reviews_count
          reviews_total
        }
        description
        budget_limits
        phone_number
        whatsapp_number
        sendbird_channel_name
        sendbird_channel_url
        reviews_total
        reviews_count
        created_at
        sender {
          first_name
          last_name
          id
          profile_image
          sendbird_access_token
        }
        city {
          id
          name
        }
        photos {
          results {
            photo
          }
        }
        services {
          results {
            title
            id
          }
        }
        quotations(input: $quotationsInput) {
          count
        }
        has_quotation
        quotations_count
      }
    }
  }
`;

export const getClientDraftService = /* GraphQL */ `
  query GetClientDraftService {
    getAuthenticatedClient {
      id
      can_create_free_rfq
      draft_service_inquiry {
        id
        description
        budget_limits
        phone_number
        whatsapp_number
        categories {
          results {
            id
            title
          }
        }
        city {
          id
          name
        }
        services {
          results {
            title
            id
          }
        }
        photos {
          results {
            photo
          }
        }
      }
    }
  }
`;

export const listCategorizedServiceInquiries = `
  query {
    listCategorizedServiceInquiries {
      completed_inquiries {
        count
        data {
          id
          budget_limits
          created_at
          description
          number
          status
          type
          reviews_count
          reviews_total
          phone_number
          whatsapp_number
          professional {
            id
            company_logo
            client {
              id
              first_name
              last_name
              profile_image
            
            }
          }
          city {
            id
            name
          }
          quotations_count
          categories {
            results {
              title
              id
            }
          }
          services(input: { limit: 100 }) {
            results {
              title
              id
            }
          }
        }
      }
      in_progress_inquiries {
        count
        data {
          id
          budget_limits
          created_at
          description
          number
          status
          type
          reviews_count
          reviews_total
          professional {
            id
            company_logo
            client {
              id
              first_name
              last_name
              profile_image
            
            }
          }
          city {
            id
            name
          }
          quotations_count
          quotations(input: {limit: 100, offset:0}) {
            count
            results {
              id
              status
              professional {
                company_name
                company_logo
                id
              }
            }
          }
          services {
            results {
              title
              id
            }
          }
        }
      }
      new_inquiries {
        count
        data {
          id
          budget_limits
          created_at
          description
          number
          status
          type
          reviews_count
          reviews_total
          professional {
            id
            company_logo
            client {
              id
              first_name
              last_name
              profile_image
            
            }
          }
          city {
            id
            name
          }
          quotations_count
          services {
            results {
              title
              id
            }
          }
        }
      }
    }
  }
`;

export const listSimilarAIProducts = `
query ListSimilarAIProducts($filters: SimilarAIProductsFilter! ,$input: AIPagination! ) {
  listSimilarAIProducts(input: $input, filters: $filters) {
      count
      results {
        id
        title
        link
        price
        thumbnail
        source
        source_icon
      }       
    }
  }
`;

export const listAIVendors = `
query ListAIVendors($filters: AIVendorsFilter! ) {
  listAIVendors(filters: $filters) {
    products_count
    photo
    name
    id
    is_premium      
    }
  }
`;
