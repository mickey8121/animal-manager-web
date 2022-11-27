import { gql } from '@apollo/client';

const SALE_FRAGMENT = gql`
  fragment saleFragment on AnimalForSale {
    id
    coloration
    name
    sex
    birthday

    owner {
      firstName
      lastName
      breederProfile {
        bio
        email
        phone
      }
      country
    }

    details {
      animalDetails
      status
      contactDetails
      createdAt
    }

    images {
      id
      name
      thumbUrl
      url
      updatedAt
    }

    profile {
      ... on AlpacaForSaleProfile {
        phenotype
      }
    }
  }
`;

export default SALE_FRAGMENT;
