export const imageProcessed = /* GraphQL */ `
  subscription ImageProcessed($outstandingId: ID!) {
    imageProcessed(outstandingId: $outstandingId) {
      outstandingId
      recommendedImages
      error
      __typename
    }
  }
`;

export const paymentStatusUpdated = /* GraphQL */ `
  subscription PaymentStatusUpdated($checkout_id: String!) {
    paymentStatusUpdated(checkout_id: $checkout_id) {
      checkout_id
      package_id
      status
      message
      __typename
    }
  }
`;

export const onSimilarProductUpdate = /* GraphQL */ `
  subscription OnSimilarProductUpdate($object_id: ID!) {
    onSimilarProductUpdate(object_id: $object_id) {
      object_id
      status
    }
  }
`;
