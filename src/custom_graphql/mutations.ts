export const checkout = /* GraphQL */ `
  mutation Checkout($input: CheckoutInput) {
    checkout(input: $input) {
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

export const updateReviewEntity = /* GraphQL */ `
  mutation UpdateReviewEntity($input: ReviewInput!) {
    updateReviewEntity(input: $input) {
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
        country_code
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
        followees_count
        is_followed
        total_review
        profile_image
        facebook
        twitter
        linkedin
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
        projects {
          count
          next
          previous
        }
        addresses {
          count
          next
          previous
        }
      }
    }
  }
`;

export const editBasketProductLineQuantity = /* GraphQL */ `
  mutation EditBasketProductLineQuantity($input: BasketLineInput) {
    editBasketProductLineQuantity(input: $input) {
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
`;

export const generatePaymentCheckoutIdForOrderInfo = /* GraphQL */ `
  mutation GeneratePaymentCheckoutIdForOrderInfo($input: PaymentCheckoutIdForOrderInfoInput) {
    generatePaymentCheckoutIdForOrderInfo(input: $input) {
      id
      order_number
      checkout_id
      result {
        code
        description
      }
      updated_basket {
        id
        status
        lines {
          product {
            id
            title
            slug
            photo_url
            color
            dimensions
          }
          quantity
          price_currency
          price_excl_tax
          price_incl_tax
          price_incl_tax_excl_discounts
          price_excl_tax_excl_discounts
          stockrecord {
            id
            currency
            price
            available_number_in_stock
            discount_value
            original_price
            partner_sku
            is_reviewable
            partner {
              id
              name
              code
              logo
              address
              email
              reviews_count
              reviews_total
              is_reviewable
              mobile
              blog
              policy
            }
            is_purchased
          }
          id
          basket_id
          stockrecord_id
          original_price_incl_tax
          original_price_excl_tax
        }
      }
    }
  }
`;

export const refundOrderLine = /* GraphQL */ `
  mutation RefundOrderLine($input: InputRefundOrderLine!) {
    refundOrderLine(input: $input) {
      status
    }
  }
`;

export const submitServiceInquiry = `
  mutation SubmitServiceInquiry($input: ServiceInquiryInput!) {
    submitServiceInquiry(input: $input) {
      id
      status
      number
      
    }
  }
`;

export const respondServiceInquiry = `
  mutation RespondServiceInquiry($input: RespondServiceInquiryInput!) {
    respondServiceInquiry(input: $input) {
      message
      status
    }
  }
`;

export const markNotificationAsRead = /* GraphQL */ `
  mutation MarkNotificationAsRead($input: MarkNotificationAsReadInput) {
    markNotificationAsRead(input: $input) {
      message
      status
    }
  }
`;

export const submitAddGigService = `
 mutation AddGigService($input: GigServiceInput!) {
  addGigService(input: $input) {
    id
    title
    description
    price
    photos
    is_enabled
    cities {
      id
      name
    }
    services {
      title
      image
      id
    }
  }
}`;

export const submitEditGigService = `
 mutation EditGigService($input: GigServiceInput!) {
  editGigService(input: $input) {
    id
    title
    description
    price
    photos
    is_enabled
    cities {
      id
      name
    }
    services {
      title
      image
      id
    }
  }
}`;

export const createSendBirdChatGroup = `
mutation CreateSendBirdChatGroup($input: SendBirdChatGroupInput!) {
  createSendBirdChatGroup(input: $input) {
    sendbird_access_token
    chat_url
    chat_name
  }
}`;

export const addProject = /* GraphQL */ `
  mutation AddProject($input: ProjectInput!) {
    addProject(input: $input) {
      id
    }
  }
`;

export const completeServiceInquiry = /* GraphQL */ `
  mutation CompleteServiceInquiry($input: CompleteServiceInquiryInput) {
    completeServiceInquiry(input: $input) {
      message
      status
      __typename
    }
  }
`;

export const cancelServiceInquiry = /* GraphQL */ `
  mutation CancelServiceInquiry($input: CancelServiceInquiryInput) {
    cancelServiceInquiry(input: $input) {
      message
      status
      __typename
    }
  }
`;

export const updateProject = /* GraphQL */ `
  mutation UpdateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      id
      title
      description
    }
  }
`;

export const generatePaymentCheckoutIdForManzilikAi = /* GraphQL */ `
  mutation GeneratePaymentCheckoutIdForManzilikAi($input: PaymentCheckoutIdForManzilikAiInput!) {
    generatePaymentCheckoutIdForManzilikAi(input: $input) {
      checkout_id
    }
  }
`;

export const generateAIDesign = /* GraphQL */ `
  mutation GenerateAIDesign($input: GenerateAIDesignInput!) {
    generateAIDesign(input: $input) {
      id
      sourceImageUrl
      selectedImageIndex
      processedImagesPath
      visibility
      processingType
      status
      roomType {
        id
        name
        slug
      }
      style {
        id
        name
        slug
      }
    }
  }
`;

export const cancelAIDesignGeneration = /* GraphQL */ `
  mutation CancelAIDesignGeneration($id: ID!) {
    cancelAIDesignGeneration(id: $id) {
      message
    }
  }
`;

export const selectAIDesignImage = /* GraphQL */ `
  mutation SelectAIDesignImage($id: ID!, $index: Int!) {
    selectAIDesignImage(id: $id, index: $index) {
      id
      sourceImageUrl
      selectedImageIndex
      processedImagesPath
      visibility
      processingType
      status
    }
  }
`;

export const rateAIDesign = /* GraphQL */ `
  mutation RateAIDesign($input: RateAIDesignInput!) {
    rateAIDesign(input: $input) {
      message
    }
  }
`;

export const completeRegistration = /* GraphQL */ `
  mutation CompleteRegistration($input: CompleteRegistrationInput!) {
    completeRegistration(input: $input) {
      id
      type
    }
  }
`;

export const deleteAIDesign = /* GraphQL */ `
  mutation DeleteAIDesign($input: DeleteAIDesignInput!) {
    deleteAIDesign(input: $input) {
      message
    }
  }
`;

export const sendRFQ = /* GraphQL */ `
  mutation SendRFQ($input: SendRFQInput!) {
    sendRFQ(input: $input) {
      whatsapp_number
      status
      type
      sendbird_channel_url
      sendbird_channel_name
      reviews_count
      reviews_total
      phone_number
      number
      id
    }
  }
`;

export const sendQuotation = /* GraphQL */ `
  mutation sendQuotation($input: SendQuotationInput!) {
    sendQuotation(input: $input) {
      status
      sendbird_channel_url
      sendbird_channel_name
      budget_limits
      execution_time
      id
    }
  }
`;

export const acceptQuotation = /* GraphQL */ `
  mutation acceptQuotation($input: AcceptQuotationInput!) {
    acceptQuotation(input: $input) {
      status
      sendbird_channel_url
      sendbird_channel_name
      budget_limits
      execution_time
      id
    }
  }
`;

export const sendServiceInquiryReview = /* GraphQL */ `
  mutation sendServiceInquiryReview($input: ReviewInput!) {
    reviewEntity(input: $input) {
      id
    }
  }
`;

export const startProcessSimilarAIProducts = /* GraphQL */ `
  mutation StartProcessSimilarAIProducts($Id: ID!) {
    startProcessSimilarAIProducts(Id: $Id) {
      object_id
      status
      message
    }
  }
`;

export const creditPointsForAIProductView = /* GraphQL */ `
  mutation CreditPointsForAIProductView($object_id: ID!, $feature: AISimilarProductFeature!) {
    creditPointsForAIProductView(object_id: $object_id, feature: $feature) {
      object_id
      outstanding_id
    }
  }
`;
