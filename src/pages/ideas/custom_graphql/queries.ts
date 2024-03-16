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
        }

        default_idea {
          id
          title
          photo
        }
      }
      filters {
        title
        results {
          title
          count
        }
      }
    }
  }
`;
